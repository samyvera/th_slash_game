class Game {
    constructor() {
        this.size = new Vector2D(512, 256);
        
        this.frame = 0;
        this.relativeFrame = 0;
        this.step = 1;

        this.player = new Player("Youmu Konpaku", new Vector2D(16, 16), new Vector2D(this.size.x / 2 - 8, this.size.y / 2 - 8));
        this.enemies = [new Enemy("???", new Vector2D(16, 32), new Vector2D(this.size.x * 0.75 - 8, this.size.y - 64))];

        this.update = mouse => {
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
            this.enemies.forEach(enemy => {
                if (this.mouse.startLine && this.mouse.endLine && this.lineRect(
                    this.mouse.startLine.x, this.mouse.startLine.y, this.mouse.endLine.x, this.mouse.endLine.y,
                    enemy.pos.x, enemy.pos.y, enemy.size.x, enemy.size.y)) {
                    console.log('ok!');
                    touchEnemy = true;
                    // this.mouse.startLine = null;
                    // this.mouse.endLine = null;
                }
            });
            if (!touchEnemy) {
                this.mouse.startLine = null;
                this.mouse.endLine = null;
            }

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
