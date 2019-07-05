class Enemy extends Actor {
    constructor(name, size, pos) {
        super(name, size, pos);

        this.animationTime = 0;
        this.animationKey = 0;
        this.stepModifier = 1;

        this.act = game => {
            this.animationTime += game.step * this.stepModifier;
        };
    }
}
