// script.js

const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "AIzaSyDtY2Fiau6w_XwexXlo-Lz-SKox_b0fmWU";  // Thay YOUR_API_KEY bằng khóa API của bạn

// Tạo thẻ li cho mỗi tin nhắn
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

// Gửi tin nhắn và nhận phản hồi từ Gemini API
const generateResponse = (incomingChatLi) => {
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`  // Nếu cần authorization token
        },
        body: JSON.stringify({
            "model": "gemini-1.5-flash",  // Thay đổi model nếu cần thiết
            "input": {
                "messages": [
                    {
                        role: "user",
                        content: userMessage
                    }
                ]
            }
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;  // Điều chỉnh theo dữ liệu trả về của Gemini
        })
        .catch((error) => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again!";
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
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Gọi API Gemini
        generateResponse(incomingChatLi);
    }, 600); // Tùy chỉnh thời gian delay
}

sendChatBtn.addEventListener("click", handleChat);

// Hàm hủy chat
function cancel() {
    let chatbotcomplete = document.querySelector(".chatBot");
    if (chatbotcomplete.style.display != 'none') {
        chatbotcomplete.style.display = "none";
        let lastMsg = document.createElement("p");
        lastMsg.textContent = 'Thanks for using our Chatbot!';
        lastMsg.classList.add('lastMessage');
        document.body.appendChild(lastMsg);
    }
}
