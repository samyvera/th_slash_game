class Game {
    constructor() {
        this.size = new Vector2D(512, 256);
        
        this.frame = 0;
        this.relativeFrame = 0;
        this.step = 1;

        this.player = new Player("Youmu Konpaku", new Vector2D(16, 16), new Vector2D(this.size.x / 2 - 8, this.size.y / 2 - 8));
        this.enemies = [];

        this.score = 0;

        this.update = mouse => {

            if (this.relativeFrame % 64 === 0 && this.enemies.length < 10) {
                var posX = Math.round(Math.random()) ? this.size.x : 0;
                var posY = Math.round(Math.random()) ? this.size.y : 0;
                this.enemies.push(new Enemy("???", new Vector2D(24, 24), new Vector2D(posX, posY)));
            }

            this.mouse = {
                x:mouse.x,
                y:mouse.y,
                leftClick:mouse.leftClick,
                rightClick:mouse.rightClick,
                activeFrame:mouse.activeFrame,
                history:mouse.history,
                startLine:mouse.startLine,
                endLine:mouse.endLine
            };

            if (this.mouse.x < 0) this.mouse.x = 0;
            else if (this.mouse.x > this.size.x) this.mouse.x = this.size.x;
            if (this.mouse.y < 0) this.mouse.y = 0;
            else if (this.mouse.y > this.size.y - 32) this.mouse.y = this.size.y - 32;

            var touchEnemy = false;
            this.enemies.forEach((enemy, i) => {
                if (enemy.touched) {
                    this.enemies.splice(i, 1);
                    this.score += 10;
                }
                else if (!this.mouse.rightClick && this.mouse.startLine && this.mouse.endLine && this.lineRect(
                    this.mouse.startLine.x, this.mouse.startLine.y, this.mouse.endLine.x, this.mouse.endLine.y,
                    enemy.pos.x, enemy.pos.y, enemy.size.x, enemy.size.y)) {
                    touchEnemy = true;
                    enemy.touched = true;
                    mouse.startLine = null;
                    mouse.endLine = null;
                }
            });
            if (!touchEnemy || this.mouse.rightClick) {
                this.mouse.startLine = null;
                this.mouse.endLine = null;
            }

            this.enemies.forEach(enemy => enemy.act(this));
            this.player.act(this);
            this.relativeFrame += this.step;
            this.frame++;
        };

        this.lineRect = (x1, y1, x2, y2, rx, ry, rw, rh) => {
            var left = this.lineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
            var right = this.lineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
            var top = this.lineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
            var bottom = this.lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
            return left || right || top || bottom;
        }

        this.lineLine = (x1, y1, x2, y2, x3, y3, x4, y4) => {
            var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
            var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
            return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
        }
    }
}
