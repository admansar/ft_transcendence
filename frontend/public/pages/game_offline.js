class Game_Offline extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ping pong game</title>
          <link rel="stylesheet" href="../public/game/css/game_style_offline.css">
          <link rel="icon" type="image/x-icon" href="public/game/images/140412.png">
        </head>
        <body>
          <canvas id="canvas" width="600" height="400"></canvas>
          <script type="module" src="../public/game/js/game_offline.js"></script>
        </body>
        </html>
        `
    }

    disconnectedCallback() {
        console.log('Game_Offline disconnected');
        this.innerHTML = '';
    }
}

export function attachDOM() {
    document.body.style = '';
    app.root.innerHTML = '';
    import('../game/js/game_offline.js').then(module => { module.game_2d_offline(); })
    const page = document.createElement('game-page');
    app.root.appendChild(page);
    console.log('Gamee');
    
}
customElements.define('game-page', Game_Offline);

