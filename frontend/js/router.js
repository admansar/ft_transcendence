function routing() {
    const path = window.location.pathname;
    switch(path) {
        case '/register':
            setTimeout(() => {
                document.body.setAttribute('style', '');
                document.body.innerHTML = ''
                document.body.innerHTML = regBody;
            }, 200);
            break;
            case '/login':
            setTimeout(() => {
                document.body.setAttribute('style', '');
                document.body.innerHTML = ''
                document.body.innerHTML = logBody;
            }, 200);
            break;
    }
}

let regBody = `

    <div class="registing" style="background-color: rgba(0, 0, 0, 0.6);">
        <img src="src/pingpong-logo.png" class="logo-log" style="margin: 10px;">
        <div class="registing">
            <div class="message">Enterning the requirts for your regist:</div>
		    <input type="text" id="fname" name="fname" placeholder="Username">
            <input type="text" id="fname" name="fname" placeholder="First Name">
            <input type="text" id="fname" name="fname" placeholder="Last Name">
		    <input type="text" id="fname" name="fname" placeholder="Email">
		    <input type="password" id="pwd" name="pwd" placeholder="password">
		    <button class="submit-button">Submit</button>
            <div class="message" style="color: #fff;">You can also create an account with</div>
            <div class="button-logs">
                <button class="btn1" type="button"></button>
                <button class="btn2" type="button"></button>
                <button class="btn3" type="button"></button>
            </div>
        </div>
    </div>

`

let logBody = `
<div class="login">
<img src="src/pingpong-logo.png" class="logo-log">
<div class="log-contain">
    <form action="/log.html" method="post">
        <input type="text" id="fname" name="fname" placeholder="Username">
        <input type="password" id="pwd" name="pwd" placeholder="Password">
        <!-- Use an <a> tag styled as a button for redirection -->
            <a href="index.html" class="submit-button">Submit</a>
            <div class="stay-sign">
                <input type="checkbox" id="stay-sign" name="stay-sign" value="stay-signed-in">
                <label for="stay-sign"> Stay Signed-in</label>
            </div>
        <div class="line"></div> <!-- Add a <div> for the line -->
        </form>
    <div class="Sign-in">
        <div class ="message">not registed yet ?</div>
        <div class="Sign-in-button">Sign-in</div>
    </div>
    <div class="button-logs">
        <button class="btn1" type="button"></button>
        <button class="btn2" type="button"></button>
        <button class="btn3" type="button"></button>
    </div>
</div>
</div>
`

// routing();
document.addEventListener('DOMContentLoaded', routing);