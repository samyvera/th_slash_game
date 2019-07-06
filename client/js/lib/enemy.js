class Enemy extends Actor {
    constructor(name, size, pos) {
        super(name, size, pos);

        this.animationTime = 0;
        this.animationKey = 0;
        this.stepModifier = 1;

        this.touched = false;

        this.move = game => {
            var player = game.player;
            var speed = game.step * 2;

            var dx = (player.pos.x - (this.pos.x + this.size.x / 2)) * .125;
            var dy = (player.pos.y - (this.pos.y + this.size.y / 2)) * .125;
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
        };
    }
}
