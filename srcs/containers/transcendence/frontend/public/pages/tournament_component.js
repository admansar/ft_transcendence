
class TournamentComponent  extends HTMLElement {
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ping Pong Tournament - 4 Players</title>
            <link rel="stylesheet" href="public/tournoi/css/tournament.css">
        </head>
        <body>
            <div class="tournament-frame">
                <h1>🏓 Ping Pong Tournament 🏓</h1>

                <div class="tournament-bracket">
                    <div class="round">
                        <div class="match">
                            <div class="player1">...</div>
                            <div class="player2">...</div>
                        </div>
                        <div class="match">
                            <div class="player3">...</div>
                            <div class="player4">...</div>
                        </div>
                    </div>

                    <div class="round">
                        <div class="match">
                            <div class="winner1">...</div>
                            <div class="winner2">...</div>
                        </div>
                    </div>

                    <div class="round">
                        <div class="match">
                            <div class="winner_winner_chicken_dinner">Champion</div>
                        </div>
                    </div>
                </div>

                <div class="register-btn" id="register-id">waiting for players</div>
            </div>

            <script src="public/tournoi/js/tournament.js"></script>
        </body>
        </html>
        `
    }
}

export function attachDOM() {
    setTimeout(() => {
        document.body.innerHTML = '';
        document.body.setAttribute('style', '');
        document.head.innerHTML = ''
        const page = document.createElement('game-page');
        document.body.appendChild(page);
        import('../tournoi/js/tournament.js').then(module => { module.tournament(); })
    }, 100)
}
customElements.define('game-page', TournamentComponent);

