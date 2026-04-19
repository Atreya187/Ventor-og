import axios from 'axios';

// Select elements
const input = document.getElementById("chatbot-input");
const sendBtn = document.getElementById("chatbot-send");
const messages = document.getElementById("chatbot-messages");
const chatbotWindow = document.getElementById("chatbot-window");

/* SEND MESSAGE FUNCTION */
async function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;

    /* USER MESSAGE */
    const userDiv = document.createElement("div");
    userDiv.className = "user-message";
    userDiv.innerText = text;
    messages.appendChild(userDiv);
    messages.scrollTop = messages.scrollHeight;
    input.value = "";

    /* SHOW TYPING INDICATOR */
    const typingDiv = document.createElement("div");
    typingDiv.className = "typing-indicator";
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;

    try {
        const API_URL = import.meta.env.VITE_API_URL || "https://ventor.onrender.com";
        
        const response = await axios.post(`${API_URL}/chat`, { 
            message: text 
        });

        typingDiv.remove();

        /* BOT MESSAGE */
        const botDiv = document.createElement("div");
        botDiv.className = "bot-message";
        botDiv.innerText = response.data.reply; 

        messages.appendChild(botDiv);
        messages.scrollTop = messages.scrollHeight;

    } catch (error) {
        console.error("Chatbot Error:", error);
        if(typingDiv) typingDiv.remove();
        const botDiv = document.createElement("div");
        botDiv.className = "bot-message";
        botDiv.innerText = "Server not responding.";
        messages.appendChild(botDiv);
    }
}

/* EVENT LISTENERS */
if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}

if (input) {
    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });
}

/* TOGGLE CHATBOT - Export this so your HTML can see it */
export function toggleChatbot() {
    if (!chatbotWindow) return;
    
    if (chatbotWindow.style.display === "flex") {
        chatbotWindow.style.display = "none";
    } else {
        chatbotWindow.style.display = "flex";
    }
}

// Attach to window so onclick="toggleChatbot()" works in plain HTML
window.toggleChatbot = toggleChatbot;
