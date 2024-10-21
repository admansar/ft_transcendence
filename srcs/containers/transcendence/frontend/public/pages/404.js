class PageNotFound extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                color: #333;
            }
    
            .container {
                text-align: center;
            }
    
            h1 {
                font-size: 6em;
                margin: 0;
                color: #ff6b6b;
            }
    
            p {
                font-size: 1.5em;
                margin: 20px 0;
            }
    
            a {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                text-decoration: none;
                background-color: #ff6b6b;
                color: white;
                font-size: 1.2em;
                border-radius: 5px;
            }
    
            a:hover {
                background-color: #ff4c4c;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <h1>404</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
            <a href="/">Go Back Home</a>
        </div>
    </body>
        `
    }
}

export function attachDOM() {
    setTimeout(() => {
        document.body.innerHTML = '';
        document.body.setAttribute('style', '');
        document.head.innerHTML = ''
        const page = document.createElement('notfound-page');
        document.body.appendChild(page);
    }, 100)
}

customElements.define('notfound-page', PageNotFound);