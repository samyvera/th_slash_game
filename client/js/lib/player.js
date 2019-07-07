class Player extends Actor {
    constructor(name, size, pos) {
        super(name, size, pos);

        this.game = null;

        this.direction = null;
        this.action = null;

        this.chargeCooldown = 32;
        this.chargeSpeed = 1;
        this.charge = 0;
        this.chargeMax = false;
        this.slowMotionTime = 64;

        this.animationTime = 0;
        this.animationKey = 0;
        this.stepModifier = 1;

        this.attack = null;
        this.circleRange = 64;

        this.touched = false;
        this.hitCoolDown = 32;

        this.move = () => {
            var speed = this.action === 'charge' ? 2 : 5;
            var dx = (this.game.mouse.x - (this.pos.x + this.size.x / 2)) * .125;
            var dy = (this.game.mouse.y - (this.pos.y + this.size.y / 2)) * .125;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > speed) {
                dx *= speed / distance;
                dy *= speed / distance;
            }
            this.pos.x += dx;
            this.pos.y += dy;
        }

        this.circleAttack = () => {
            this.game.enemies.forEach(enemy => {
                if (this.game.rectCircle({
                        x: this.pos.x,
                        y: this.pos.y,
                        r: this.circleRange
                    }, {
                        x: enemy.pos.x,
                        y: enemy.pos.y,
                        w: enemy.size.x,
                        h: enemy.size.y
                    })) enemy.touched = true;
            });
        }

        this.act = game => {
            this.game = game;

            this.game.enemies.forEach((enemy, i) => {
                if (!this.touched && !enemy.touched && this.game.intersect(this.pos, this.size, enemy.pos, enemy.size)) {
                    this.game.score = 0;
                    this.touched = true;
                }
            });

            if (this.touched) {
                this.game.mouse.leftClick = false;
                this.game.mouse.rightClick = false;
            }
            
            if (this.chargeMax) {
                this.slowMotionTime--;
            }
            if (this.slowMotionTime <= 0 || !this.game.mouse.rightClick) {
                this.game.mouse.rightClick = false;
                this.slowMotionTime = 64;
                if (this.chargeMax) this.circleAttack();
            }

            if (this.game.mouse.rightClick && this.game.mouse.activeFrame !== 0) {
                if (this.chargeCooldown > 0) {
                    this.chargeCooldown--;
                    this.action = 'stand';
                } else {
                    this.action = "charge";
                    if (this.charge < 100) this.charge += this.chargeSpeed * game.step * this.stepModifier;
                    else if (!this.chargeMax) {
                        this.chargeMax = true;
                        game.step /= 4;
                        this.stepModifier *= 4;
                        this.animationKey *= 4;
                    }
                }
            }
            if (!this.game.mouse.rightClick) {
                this.chargeCooldown = 32;
                if (this.action === 'stand') this.action = null;
                if (this.action === "charge") {
                    this.action = null;
                    this.charge = 0;
                    if (this.chargeMax) {
                        this.chargeMax = false;
                        game.step *= 4;
                        this.stepModifier /= 4;
                        this.animationKey /= 4;
                    }
                }
            }

            if (!this.game.mouse.leftClick || this.game.mouse.rightClick) this.move();

            if (this.touched) {
                this.hitCoolDown--;
                if (this.hitCoolDown < 0) {
                    this.hitCoolDown = 32;
                    this.touched = false;
                }
            } else {
                if (this.game.mouse.x > this.pos.x + this.size.x / 2) this.direction = true;
                else if (this.game.mouse.x !== this.pos.x + this.size.x / 2) this.direction = false;
            }

            this.animationTime += game.step * this.stepModifier;
        };
    }
}