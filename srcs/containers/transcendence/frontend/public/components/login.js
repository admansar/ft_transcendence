export class Login extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="login">
                <img src="public/src/img/pingpong-logo.png" class="logo-log">
                <div class="log-contain">
                        <input type="text" id="username" name="username" placeholder="Username">
                        <input type="password" id="pwd" name="pwd" placeholder="Password">
                        <div id="error" style="color: red; display: none;"></div>
                        <button type="submit" class="submit-button">Connect</button>
                        <div class="stay-sign">
                            <input type="checkbox" id="stay-sign" name="stay-sign" value="stay-signed-in">
                            <label for="stay-sign"> Stay Signed-in</label>
                        </div>
                        <div class="line"></div>
                    <div class="Sign-in">
                        <div class="message">Not registered yet?</div>
                        <div class="Sign-in-button" id="open-register">Sign-in</div> <!-- Button to open registration form -->
                    </div>
                    <div class="button-logs">
                        <button class="btn1" type="button"></button>
                        <button class="btn2" type="button"></button>
                        <button class="btn3" type="button"></button>
                    </div>
                </div>
            </div>
        `;
    }
}

export function attachDOM() {
    const page = document.createElement('login-page');
    document.appendChild(page);
}

customElements.define('login-page', Login);