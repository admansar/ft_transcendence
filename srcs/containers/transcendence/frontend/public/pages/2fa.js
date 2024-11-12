class TWOFA extends HTMLElement {
    constructor() {
        super();
        // Créer un Shadow DOM pour encapsuler le style et la logique
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        // Appelé lorsque l'élément est ajouté au DOM
        this.render();
        this.addEventListeners();
    }

    render() {
        // Ajouter le style et l'interface utilisateur
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    max-width: 300px;
                    margin: 20px auto;
                    background: #f9f9f9;
                    text-align: center;
                }
                button {
                    background-color: #007BFF;
                    color: #fff;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:disabled {
                    background-color: #ccc;
                }
                input {
                    width: calc(100% - 20px);
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                .message {
                    margin-top: 10px;
                    font-size: 14px;
                    color: #555;
                }
            </style>
            <h3>2FA Authentication</h3>
            <button id="generate-otp">Generate OTP</button>
            <div id="otp-section" style="display: none;">
                <input type="text" id="otp-input" placeholder="Enter OTP" />
                <button id="verify-otp">Verify OTP</button>
            </div>
            <div id="message" class="message"></div>
        `;
    }

    addEventListeners() {
        const generateOtpBtn = this.shadowRoot.querySelector("#generate-otp");
        const verifyOtpBtn = this.shadowRoot.querySelector("#verify-otp");
        const otpSection = this.shadowRoot.querySelector("#otp-section");
        const otpInput = this.shadowRoot.querySelector("#otp-input");
        const messageDiv = this.shadowRoot.querySelector("#message");

        const API_BASE_URL = "http://localhost:8000/api/accounts";

        // Gestionnaire pour générer un OTP
        generateOtpBtn.addEventListener("click", async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/generate-otp/`, {
                    method: "GET",
                });
                const data = await response.json();

                if (response.ok) {
                    messageDiv.textContent = "OTP généré et envoyé avec succès!";
                    messageDiv.style.color = "green";
                    otpSection.style.display = "block";
                } else {
                    messageDiv.textContent = data.message || "Une erreur est survenue.";
                    messageDiv.style.color = "red";
                }
            } catch (error) {
                console.error("Erreur lors de la génération de l'OTP:", error);
                messageDiv.textContent = "Erreur lors de la génération de l'OTP.";
                messageDiv.style.color = "red";
            }
        });

        // Gestionnaire pour vérifier un OTP
        verifyOtpBtn.addEventListener("click", async () => {
            const otp = otpInput.value.trim();

            if (!otp) {
                messageDiv.textContent = "Veuillez entrer un OTP.";
                messageDiv.style.color = "red";
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/verify-otp/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ otp }),
                });

                const data = await response.json();

                if (response.ok) {
                    messageDiv.textContent = "OTP validé avec succès!";
                    messageDiv.style.color = "green";
                } else {
                    messageDiv.textContent = data.message || "OTP invalide ou expiré.";
                    messageDiv.style.color = "red";
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de l'OTP:", error);
                messageDiv.textContent = "Erreur lors de la vérification de l'OTP.";
                messageDiv.style.color = "red";
            }
        });
    }
}

customElements.define("two-fa", TWOFA);
