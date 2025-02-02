// >> NavBar
function toggleMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('active');
}

// Scroll-to-Top Button Logic
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // Show or hide the button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Scroll to the top when the button is clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const telegramIcon = document.getElementById('telegramIcon');
    const telegramPopup = document.getElementById('telegramPopup');
    const closePopup = document.getElementById('closePopup');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const userMessageInput = document.getElementById('userMessage');
    const typingIndicator = document.getElementById('typingIndicator');

    // Show popup on icon click
    telegramIcon.addEventListener('click', () => {
        telegramPopup.classList.add('show');
    });

    // Hide popup on close button click
    closePopup.addEventListener('click', () => {
        telegramPopup.classList.remove('show');
    });

    // Close popup when clicking outside
    document.addEventListener('click', (event) => {
        if (!telegramPopup.contains(event.target) && !telegramIcon.contains(event.target)) {
            telegramPopup.classList.remove('show');
        }
    });

    // Funzione per determinare la risposta del bot
    function getBotResponse(userMessage) {
        userMessage = userMessage.toLowerCase().trim();

        if (userMessage === 'comandi') {
            return "Comandi disponibili: regole - master - evento - festebimbi";
        } else if (userMessage === 'regole') {
            return "Per le regole puoi tranquillamente scriverci o entrare nel gruppo <a href='https://discord.gg/QS3ZPSSJUa'>Discord</a>!";
        } else if (userMessage === 'master') {
            return "Se hai bisogno di un Master per le tue sessioni, <a href='https://giovannispezia.wixsite.com/mythicmaster'>contattaci direttamente!</a>";
        } else if (userMessage === 'ciao') {
            return "Ciao! Piacere siamo MythicMaster.";
        } else if (userMessage === 'come stai?') {
            return "Bene, grazie! Chiedimi qualsiasi cosa nella lista dei Comandi. Scrivi 'comandi'";
        } else if (userMessage === 'evento') {
            return "Vuoi creare un evento con noi! Siamo lieti di assisterti, scrivici direttamente in privato! Ti dico subito che si può fare.";
        } else if (userMessage === 'festebimbi') {
            return "Possiamo anche organizzare delle feste per bambini, ci sono delle nostre sessioni pronte a tutto!";
        }
        
        else {
            return "Non posso aiutarti direttamente io, scrivi direttamente a: <a href='mailto:mythicmaster@yahoo.com'>mythicmaster@yahoo.com</a>";
        }
    }

    // Simulazione invio messaggio
    sendMessageBtn.addEventListener('click', () => {
        const userMessage = userMessageInput.value.trim();
        if (userMessage) {
            // Aggiungi il messaggio dell'utente
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('message', 'user-message');
            userMessageDiv.innerHTML = `<span>${userMessage}</span>`;
            document.querySelector('.chat-window').appendChild(userMessageDiv);

            // Mostra l'indicatore di scrittura del bot
            typingIndicator.style.display = 'block';
            
            // Simula una risposta del bot dopo un breve ritardo
            setTimeout(() => {
                typingIndicator.style.display = 'none';
                const botMessageDiv = document.createElement('div');
                botMessageDiv.classList.add('message', 'bot-message');
                
                // Risposta del bot basata sul messaggio dell'utente
                const botResponse = getBotResponse(userMessage);
                botMessageDiv.innerHTML = `<span>${botResponse}</span>`;
                document.querySelector('.chat-window').appendChild(botMessageDiv);
                userMessageInput.value = ''; // Svuota l'input
                telegramPopup.scrollTop = telegramPopup.scrollHeight; // Scrolla verso il basso
            }, 1500); // Simula il tempo di risposta
        }
    });
});

// Pop-up

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        let popup = document.getElementById("popup");
        popup.classList.add("show-popup");
    }, 2000); // Mostra dopo 15 secondi

    document.getElementById("close-popup").addEventListener("click", function () {
        let popup = document.getElementById("popup");
        popup.style.bottom = "-150px";
        popup.style.opacity = "0";

        setTimeout(function () {
            popup.style.display = "none";
        }, 500);
    });
});