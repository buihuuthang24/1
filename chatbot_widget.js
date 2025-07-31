// chatbot_widget.js: Tự động nhúng widget chat nổi vào mọi trang có file này
(function() {
    // Tạo nút mở chat
    const openBtn = document.createElement('button');
    openBtn.id = 'chatbot-floating-btn';
    openBtn.innerText = '💬';
    document.body.appendChild(openBtn);

    // Tạo khung chat
    const container = document.createElement('div');
    container.id = 'chatbot-floating-container';
    container.innerHTML = `
        <div id="chatbot-floating-header">
            Gemini Embedding Chatbot
            <button id="chatbot-floating-close">×</button>
        </div>
        <div id="chatbot-log"></div>
        <form id="chatbot-input-form">
            <input type="text" id="chatbot-user-input" placeholder="Nhập tin nhắn..." autocomplete="off" required />
            <button type="submit" id="chatbot-send-btn">Gửi</button>
        </form>
    `;
    document.body.appendChild(container);

    // Sự kiện mở/đóng
    openBtn.onclick = () => {
        container.style.display = 'flex';
        openBtn.style.display = 'none';
    };
    container.querySelector('#chatbot-floating-close').onclick = () => {
        container.style.display = 'none';
        openBtn.style.display = 'block';
    };

    // Chat logic
    const chatLog = container.querySelector('#chatbot-log');
    const chatForm = container.querySelector('#chatbot-input-form');
    const userInput = container.querySelector('#chatbot-user-input');


    function appendMessage(sender, text) {
        const msg = document.createElement('div');
        msg.className = 'chatbot-message ' + sender;

        // Avatar
        const avatar = document.createElement('div');
        avatar.className = 'chatbot-avatar';
        avatar.innerText = sender === 'user' ? '🧑' : '🤖';

        // Bubble
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble';
        bubble.textContent = text;

        msg.appendChild(avatar);
        msg.appendChild(bubble);
        chatLog.appendChild(msg);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text) return;
        appendMessage('user', text);
        userInput.value = '';
        appendMessage('bot', 'Đang trả lời...');
        try {
            const res = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await res.json();
            chatLog.lastChild.textContent = data.reply ? data.reply : 'Lỗi: ' + (data.error || 'Không nhận được trả lời');
        } catch (err) {
            chatLog.lastChild.textContent = 'Lỗi kết nối server!';
        }
    });
})();
