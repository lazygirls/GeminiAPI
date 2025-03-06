// chatbot.js

const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "AIzaSyD6DHBC0MtBhLpvH8gW4sQvC-3dsmn9MPA"; // Thay bằng API key Gemini của bạn

// Hàm tạo thẻ li cho mỗi tin nhắn
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    chatLi.innerHTML = `<p>${message}</p>`;
    return chatLi;
};

// Hàm gửi yêu cầu và nhận phản hồi từ Gemini API
const generateResponse = (incomingChatLi) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: userMessage }]
                }
            ]
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            const messageElement = incomingChatLi.querySelector("p");
            if (data.candidates && data.candidates.length > 0) {
                messageElement.textContent = data.candidates[0].content.parts[0].text;
            } else {
                messageElement.textContent = "Gemini không trả về kết quả hợp lệ.";
                messageElement.classList.add("error");
            }
        })
        .catch((error) => {
            const messageElement = incomingChatLi.querySelector("p");
            messageElement.classList.add("error");
            messageElement.textContent = "Lỗi kết nối hoặc API. Vui lòng thử lại!";
            console.error(error);
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

// Xử lý tin nhắn chat từ người dùng
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Đang xử lý...", "chat-incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        generateResponse(incomingChatLi);
    }, 600);

    chatInput.value = "";
};

sendChatBtn.addEventListener("click", handleChat);

// Hàm đóng cửa sổ chat
function cancel() {
    const chatbotcomplete = document.querySelector(".chatBot");
    if (chatbotcomplete.style.display !== 'none') {
        chatbotcomplete.style.display = "none";
        const lastMsg = document.createElement("p");
        lastMsg.textContent = 'Thanks for using our Chatbot!';
        lastMsg.classList.add('lastMessage');
        document.body.appendChild(lastMsg);
    }
}
