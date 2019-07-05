window.onload = () => {
    class App {
        constructor(socket) {
            this.setupSocket = () => {
                socket.on("welcome", () => console.log('welcome !'));

                socket.on("connect_failed", () => socket.close());
                socket.on("disconnect", () => socket.close());
            }
            this.setupSocket();
            socket.emit('join');
        }
    }
    var app = new App(io());

    var zoom = 3;

    var mouse = {
        x:256,
        y:128,
        active:false,
        activeFrame:0,
        history:[],
        startLine:null,
        endLine:null
    };

    document.addEventListener("mousemove", event => {
        mouse.x = Math.floor(event.clientX / zoom);
        mouse.y = Math.floor(event.clientY / zoom);
        if (mouse.x < 0) mouse.x = 0;
        if (mouse.x > 512) mouse.x = 512;
        if (mouse.y < 0) mouse.y = 0;
        if (mouse.y > 256) mouse.y = 256;
    }, false);
    document.addEventListener("mousedown", event => {
        if (event.button === 0 && !mouse.active) {
            mouse.startLine = { x:mouse.x, y:mouse.y };
            mouse.endLine = null;
            mouse.leftClick = true;
        }
        else if (event.button === 2) {
            mouse.startLine = null;
            mouse.rightClick = true;
        }
        mouse.activeFrame++;
    }, false);
    document.addEventListener("mouseup", event => {
        if (event.button === 0 && !mouse.active) {
            mouse.endLine = { x:mouse.x, y:mouse.y };
            mouse.leftClick = false;
        }
        else if (event.button === 2) {
            mouse.rightClick = false;
        }
        mouse.activeFrame = 0;
    }, false);

    var game = new Game();
    var display = new Display(game, document.body, zoom);

    var frame = (time) => {
        if (mouse.history.length > 10) mouse.history.splice(0, 1);
        mouse.history.push({ x:mouse.x, y:mouse.y });

        game.update(mouse);
        display.drawFrame(time, zoom);

        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}