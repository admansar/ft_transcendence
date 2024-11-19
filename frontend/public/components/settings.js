import { Router } from '../services/Router.js';

export function setupSetting() {
    const setModal = document.querySelector('.modal_settings');
    console.log("im in settings");
    
    document.querySelectorAll('.setting_bnt').forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all panels
            document.querySelectorAll('.edit_panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Get the target panel's ID from the data-target attribute
            const targetPanelId = button.getAttribute('data-target');
            
            // Show the target panel by adding the 'active' class
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === setModal) {
            setModal.style.display = 'none';
        }
    });
}

export class settings extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        setupSetting()
    }

    render() {
        this.innerHTML = `
            <div class="modal_settings">
	        		<div class="settings_window">
	        			<span class="switch_panel">
	        				<div class="setting_bnt" data-target="UserInfo">Profile</div>
	        				<div class="setting_bnt" data-target="SecurityInfo">Security</div>
	        				<div class="setting_bnt" data-target="ControlInfo">Control</div>
	        			</span>

	        			<span class="edit_panel active" id="UserInfo">
	        				<div class="message">Change your profile information below</div>
	        				<input type="text" id="new_username" name="username" placeholder="Username">
	        				<input type="text" id="new_first-name" name="first-name" placeholder="First Name">
	        				<input type="text" id="new_last-name" name="last-name" placeholder="Last Name">
	        				<input type="text" id="new_email" name="email" placeholder="Email">
	        				<input type="text" id="new_email_1" name="email" placeholder="Confirmed Email">
	        				<div class="Confirmed_change">Apply Change</div>
	        			</span>

	        			<!-- Security Panel -->
	        			<span class="edit_panel" id="SecurityInfo">
	        				<div class="message">Change your security settings below</div>
	        				<input type="password" id="new_pwd" name="NewPassword" placeholder="New Password">
	        				<input type="password" id="Confirmed_new_pwd" name="Confirmed_NewPassword" placeholder="Confirmed New Password">
	        				<div class="checkbox-container">
	        					<input type="checkbox" id="stay-sign" name="stay-sign" value="stay-signed-in">
	        					<label for="stay-sign">Activate two-factor authentication</label>
	        				</div>
	        				<div class="Confirmed_change">Apply Change</div>
	        			</span>

	        			<!-- Control Panel -->
	        			<span class="edit_panel" id="ControlInfo">
	        				<div class="message">Adjust control settings below</div>

	        				<div class="Confirmed_change">Apply Change</div>
	        			</span>
	        		</div>

	        </div>
        `
    }
}

customElements.define('app-settings', settings);