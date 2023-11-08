let poop, targets, enemies, blocks;
let targetEmojis = ['🪠','🧻'];
let blockEmoji = '🚾';
let enemyEmoji = '🚽';
let deadEmoji = '☠️'

let pooped = false; // dead
let restart = false;
let muted = false;

let lives = 5;
let points = 0;
let targetPointValue = 1;

let tootSound, flushSound;

function preload() {
    soundFormats('wav');
    tootSound = loadSound('toot.wav');
    flushSound = loadSound('flush.wav');
}

function setup() {
    let canvas = new Canvas("fullscreen");
    world.gravity.y = 10;
    allSprites.rotationLock = true;
    textSize(48);
    
    enemies = new Group();
    for (let i = 0; i < 50; i++) {
        let enemy = new enemies.Sprite(
            random(width),
            random(200,height),
            48, 48, 's'
        )
        enemy.draw = () => {
            text(enemyEmoji,0,0);
        }
    }

    blocks = new Group();
    blocks.friction = 10;
    for (let i = 0; i < 200; i++) {
        let block = new blocks.Sprite(
            random(width),
            random(200,height),
            48, 48, 'd'
        )
        block.draw = () => {
            textSize(48);
            text(blockEmoji,0,0);
        }
    }

    targets = new Group();
    for (let i = 0; i < 10; i++) {
        let target = new targets.Sprite(
            random(width),
            random(200,height),
            48, 48, 'k'
        );
        let randomEmoji = targetEmojis[floor(random(targetEmojis.length))];
        target.emoji = randomEmoji;
        target.draw = () => {
            text(randomEmoji,0,0);
        }    
    }

    poop = new Sprite(random(width),10,48,48,'d');
    poop.draw = () => {
        if (pooped) text("☠️",0,0);
        else text("💩",0,0);
    };

    poop.overlaps(targets, collect);
    poop.collides(enemies, poopHim);
    blocks.collides(enemies, maybeRemoveEnemy);
}

function collect(p,t) {
    t.remove();
    points += targetPointValue;
    if (!muted) tootSound.play();
}

function poopHim(p,e) {
    pooped = true;
    if (!muted) flushSound.play();
    p.vel.x = 0;
    p.vel.y = 2.5;
    p.rotationSpeed = 1;
    p.collider = 'n'; // so he falls off the screen without being interrupted
    lives--;
}

function maybeRemoveEnemy(b,e) {
    if (random() > .2) e.remove();
}

function draw() {
    clear();

    textSize(16);
    text("💩".repeat(lives),10,20);
    textSize(24);
    text(numberToEmoji(points),10,50);
    if (muted) text('🔇', width-50,20);
    else text('🔈', width-50,20);
    textSize(48);

    if (restart) newLife();
    
    if (!pooped) { // only control if he's not being flusheds
        if (kb.pressing('left')) {
            poop.vel.x = -5;
        }
        if (kb.pressing('right')) {
            poop.vel.x = 5;
        }
        if (kb.pressing('up') && poop.colliding(blocks)) {
            poop.vel.y = -5;
        }
    }

    if (poop.y > height) {
        restart = true;
    }

}

function newLife() {
    poop.y = 10;
    poop.x = random(width);
    poop.vel.x = 0;
    poop.vel.y = 0;
    poop.rotationSpeed = 0;
    poop.collider = 'd'; // make him functional again
    restart = false;
    pooped = false;
}

function numberToEmoji(number) {
    const emojiArray = ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];
    const numberString = number.toString();
    const emojiString = numberString.split('').map(digit => emojiArray[parseInt(digit,10)]).join('');
    return emojiString;
}

function keyReleased() {
    if (key == " ") {
        muted = !muted;
    }
}