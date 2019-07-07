window.onload = () => {
    var leaderboard = [];

    class App {
        constructor(socket) {
            this.socket = socket;
            this.setupSocket = () => {
                this.socket.on("welcome", () => console.log('connected'));
                this.socket.on('update', data => leaderboard = data);
                this.socket.on("connect_failed", () => this.socket.close());
                this.socket.on("disconnect", () => this.socket.close());
            }
            this.setupSocket();
            this.socket.emit('join');
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

    var nameInput = document.createElement('input');
    nameInput.id = 'name';
    nameInput.value = '';
    nameInput.maxLength = 10;
    nameInput.placeholder = 'Enter your nickname';
    document.body.appendChild(nameInput);

    var informations = document.createElement('p');
    informations.id = 'informations';
    informations.innerHTML = 'Eliminate fairies to get the highest score !<br><br>' +
        'Perform a normal attack by holding while dragging the left click and releasing it to create a line that cuts across enemies<br><br>' +
        'Hold the right click to charge, slow time and perform a powerful circular attack !<br><br>' +
        'Warning ! If a fairy hits you, your score starts from scratch !';
    informations.onclick = () => document.getElementById('informations').style.display = 'none';
    document.body.appendChild(informations);

    var button = document.createElement('button');
    button.innerHTML = 'About this game';
    button.onclick = () => document.getElementById('informations').style.display = 'flex';
    document.body.appendChild(button);

    var updateScore = () => app.socket.emit('update', { name:document.getElementById('name').value, score:game.score });
    setInterval(updateScore, 1000);

    var frame = (time) => {
        if (mouse.history.length > 10) mouse.history.splice(0, 1);
        mouse.history.push({ x:mouse.x, y:mouse.y });

        game.update(mouse);
        display.drawFrame(time, zoom, leaderboard);

        if (mouse.startLine && mouse.endLine && !game.touchEnemy && !mouse.leftClick) {
            mouse.startLine = null;
            mouse.endLine = null;
        }
        
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}