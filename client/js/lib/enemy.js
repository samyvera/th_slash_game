class Enemy extends Actor {
    constructor(name, size, pos) {
        super(name, size, pos);

        this.animationTime = 0;
        this.animationKey = 0;
        this.stepModifier = 1;
        
        this.color = Math.floor(Math.random() * 3) + 1;

        this.touched = false;
        this.hitCoolDown = 32;

        this.move = game => {
            var player = game.player;
            var speed = game.step * 2;

            var dx = (player.pos.x + player.size.x / 2 - (this.pos.x + this.size.x / 2)) * .125;
            var dy = (player.pos.y + player.size.y / 2 - (this.pos.y + this.size.y / 2)) * .125;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > speed) {
                dx *= speed / distance;
                dy *= speed / distance;
            }
            this.pos.x += dx;
            this.pos.y += dy;
        }

        this.act = game => {
            if (!this.touched) {
                this.animationTime += game.step * this.stepModifier;

                this.move(game);
            }
            else {
                this.hitCoolDown--;
            }
        };
    }
}
