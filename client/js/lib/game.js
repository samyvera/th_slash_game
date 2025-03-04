class Game {
    constructor() {
        this.size = new Vector2D(512, 256);
        
        this.frame = 0;
        this.relativeFrame = 0;
        this.step = 1;

        this.player = new Player("Youmu Konpaku", new Vector2D(8, 8), new Vector2D(this.size.x / 2 - 4, this.size.y / 2 - 4));
        this.enemies = [];

        this.score = 0;

        this.update = mouse => {

            if (Math.floor(this.relativeFrame) % 64 === 0 && this.step === 1 && this.enemies.length < 10) {
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

            this.touchEnemy = false;
            this.enemies.forEach((enemy, i) => {
                if (enemy.touched && enemy.hitCoolDown <= 0) {
                    this.enemies.splice(i, 1);
                    this.score += 10;
                }
                else if (!this.player.touched && !this.mouse.rightClick && this.mouse.startLine && this.mouse.endLine && this.lineRect(
                    this.mouse.startLine.x, this.mouse.startLine.y, this.mouse.endLine.x, this.mouse.endLine.y,
                    enemy.pos.x, enemy.pos.y, enemy.size.x, enemy.size.y)) {
                    this.touchEnemy = true;
                    enemy.touched = true;
                    mouse.startLine = null;
                    mouse.endLine = null;
                }
            });
            if (this.mouse.rightClick) {
                this.mouse.startLine = null;
                this.mouse.endLine = null;
                mouse.endLine = null;
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

        this.intersect = (pos1, size1, pos2, size2) => !(pos2.x > pos1.x + size1.x || pos2.x + size2.x < pos1.x || pos2.y > pos1.y + size1.y || pos2.y + size2.y < pos1.y);

        this.rectCircle = (circle, rect) => {
            var distX = Math.abs(circle.x - rect.x - rect.w / 2);
            var distY = Math.abs(circle.y - rect.y - rect.h / 2);
        
            if (distX > (rect.w / 2 + circle.r) || distY > (rect.h / 2 + circle.r)) return false;
            else if (distX <= (rect.w / 2) || distY <= (rect.h / 2)) return true;
            else return (Math.pow(distX - rect.w / 2, 2) + Math.pow(distY - rect.h / 2, 2) <= (circle.r * circle.r));
        }
    }
}
