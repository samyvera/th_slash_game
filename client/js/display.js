class Display {
    constructor(game, parent, zoom) {
        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext("2d", { alpha: false });
        this.lastTime = null;

        this.zoom = zoom;
        this.game = game;
        this.animationTime = this.game.relativeFrame;
        this.canvas.width = this.game.size.x * this.zoom;
        this.canvas.height = this.game.size.y * this.zoom;
        parent.appendChild(this.canvas);
        this.cx.scale(this.zoom, this.zoom);
        this.cx.imageSmoothingEnabled = false;

        this.drawFrame = (time, zoom) => {
            this.drawBackground();
            this.game.enemies.forEach(enemy => this.drawEnemy(enemy));
            this.drawPlayer(this.game.player);
            if (this.lastTime) this.hud(time);
            this.lastTime = time;
            this.animationTime = this.game.relativeFrame;
            if (zoom !== this.zoom) {
                this.zoom = zoom;
                this.canvas.width = this.game.size.x * this.zoom;
                this.canvas.height = this.game.size.y * this.zoom;
                this.cx.scale(this.zoom, this.zoom);
                this.cx.imageSmoothingEnabled = false;
            }
            this.drawMouseLine();
        };
        
        this.drawMouseLine = () => {
            if (this.game.mouse.startLine && this.game.mouse.endLine) {
                this.cx.strokeStyle = "#f00";
                this.cx.beginPath();
                this.cx.moveTo(this.game.mouse.startLine.x, this.game.mouse.startLine.y);
                this.cx.lineTo(this.game.mouse.endLine.x, this.game.mouse.endLine.y);
                this.cx.stroke();
            }
        }

        this.drawMyon = () => {
            this.game.mouse.history.forEach((pos, i) => {
                this.cx.fillStyle = "#fff";
                this.cx.globalAlpha = i / this.game.mouse.history.length;
                this.cx.beginPath();
                this.cx.arc(pos.x, pos.y, i / 2, 0, 2 * Math.PI);
                this.cx.fill();
            });
            this.cx.globalAlpha = 1;
        }

        this.hud = (time) => {

            var hudName = document.createElement("img");
            hudName.src = "img/hud.png";
            this.cx.drawImage(hudName, 0, 0, 128, 32, 0, 0, 128, 32);

            var player = this.game.player;
            var fps = Math.round((time - this.lastTime) / 1000 * 3600) + "FPS";
            this.cx.fillStyle = "#fff";
            this.cx.textAlign = "right";
            this.cx.font = "8px serif";
            this.cx.fillText(fps, this.game.size.x, 6);
            this.cx.fillText(Math.floor(this.game.relativeFrame) + "RF", this.game.size.x, 12);
            this.cx.fillText(this.game.frame + "AF", this.game.size.x, 18);
            this.cx.textAlign = "left";
            this.cx.fillText(player.name, 4, 11);
            if (player.charge) {
                for (let i = 0; i < 100; i++) {
                    if (i <= player.charge) player.charge === 100 && player.animationTime % 2 === 0 ? this.cx.fillStyle = "#000" : this.cx.fillStyle = "#fff";
                    else this.cx.fillStyle = "#000";
                    this.cx.fillRect(4 + i, 16, 1, 2);
                }
            }
        }

        this.drawBackground = () => {
            var back1 = document.createElement("img");
            back1.src = "img/back1.png";
            this.cx.drawImage(back1, 0, 0, 512, 256, 0, 0, 512, 256);

            if (this.game.player && this.game.player.action === 'charge') this.drawSakura();
            
            var back = document.createElement("img");
            back.src = "img/back.png";
            this.cx.drawImage(back, 0, 0, 512, 256, 0, 0, 512, 256);
        }

        this.sakura = 8;
        this.drawSakura = () => {
            this.sakuraHistory = this.game.player.chargeMax ? this.sakuraHistory < this.sakura ? this.sakuraHistory + 1 : this.sakuraHistory : 1;
            var sakura = document.createElement("img");
            sakura.src = "img/sakura.png";
            this.cx.fillStyle = "#224";
            this.cx.globalAlpha = this.game.player.charge / 100 / 2;
            this.cx.fillRect(0, 0, this.game.size.x, this.game.size.y);
            this.cx.globalAlpha = this.game.player.charge / 100;
            this.cx.translate(this.game.size.x / 2, this.game.size.y / 2);
            for (let i = 0; i < this.sakuraHistory; i++) {
                this.cx.rotate(-((this.animationTime + i) * 2 % 360 * Math.PI / 180));
                this.cx.drawImage(sakura, 0, 0, 512, 512, -256, -256, 512, 512);
                this.cx.rotate((this.animationTime + i) * 2 % 360 * Math.PI / 180);
            }
            this.cx.translate(-this.game.size.x / 2, -this.game.size.y / 2);
            this.cx.globalAlpha = 1;
        }

        this.drawMagic = (posX, posY) => {
            var magic = document.createElement("img");
            magic.src = "img/magic.png";
            var magic2 = document.createElement("img");
            magic2.src = "img/magic2.png";
            this.cx.translate(posX, posY);
            this.cx.rotate(this.animationTime * 2 % 360 * Math.PI / 180);
            this.cx.drawImage(magic, 0, 0, 64, 64, -32, -32, 64, 64);
            this.cx.rotate(-(this.animationTime * 2 % 360 * Math.PI / 180));
            this.cx.rotate(-(this.animationTime % 360 * Math.PI / 180));
            this.cx.drawImage(magic2, 0, 0, 64, 64, -32, -32, 64, 64);
            this.cx.rotate(this.animationTime % 360 * Math.PI / 180);
            this.cx.translate(-posX, -posY);
        }

        this.drawPlayerShadow = (spriteX, width, height, centerX, centerY) => {
            var shadow = document.createElement("img");
            shadow.src = "img/youmu.png";
            var amplitude = Math.floor(Math.sin(this.game.player.animationTime * 0.1) * 2) + 2;
            this.cx.drawImage(shadow, spriteX * width, 3 * height, width, height, centerX - width / 2 - amplitude, centerY - height / 2 - amplitude / 2, width + amplitude * 2, height + amplitude);
        }
        
        this.drawPlayer = (player) => {
            var width = 64;
            var height = 32;
            var posX = player.pos.x;
            var posY = player.pos.y;
            var centerX = posX + player.size.x / 2;
            var centerY = posY + player.size.y / 2;
            var spriteY = 0;

            if (player.action === 'charge' || player.action === 'stand') {
                if (player.animationKey < 8 * this.game.step * player.stepModifier) {
                    spriteY = 1;
                    if (player.animationKey === 0) player.animationTime = 0;
                    player.animationKey += 1 / 4 * this.game.step * player.stepModifier;
                }
                else spriteY = 2;
            }
            else player.animationKey = 0;
            var spriteX = Math.floor(player.animationTime / 8) % 4;
            var sprites = document.createElement("img");
            sprites.src = "img/youmu.png";

            if (player.fly) this.drawMagic(centerX, centerY);
            this.drawMyon();


            this.cx.save();
            if (!player.direction) {
                this.flipHorizontally(this.cx, posX + player.size.x / 2);
            }
            if (player.charge) this.drawPlayerShadow(spriteX, width, height, centerX, centerY);
            this.cx.drawImage(sprites, spriteX * width, spriteY * height, width, height, centerX - width / 2, centerY - height / 2, width, height);
            this.cx.restore();

            if (player.focus) {
                this.cx.fillStyle = "#f008";
                this.cx.fillRect(posX, posY, player.size.x, player.size.y);
            }

            if (player.attack) {
                this.cx.fillStyle = "#00f5";
                this.cx.fillRect(player.attack.pos.x, player.attack.pos.y, player.attack.size.x, player.attack.size.y);
            }
        }

        this.drawEnemy = enemy => {
            var posX = enemy.pos.x;
            var posY = enemy.pos.y;

            this.cx.fillStyle = "#f00";
            this.cx.fillRect(posX, posY, enemy.size.x, enemy.size.y);
        }

        this.flipHorizontally = (context, around) => {
            context.translate(around, 0);
            context.scale(-1, 1);
            context.translate(-around, 0);
        };
    }
}
