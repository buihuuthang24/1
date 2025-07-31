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
    // Không còn input file


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
        let displayText = text;
        if (sender === 'bot') {
            // 1. Chuyển **Tiêu đề:** thành dòng mới với tiêu đề in đậm
            displayText = displayText.replace(/\*\*(.*?)\*\*:/g, '<br><b>$1:</b>');
            // 2. Chuyển **Tiêu đề** thành dòng mới với tiêu đề in đậm
            displayText = displayText.replace(/\*\*(.*?)\*\*/g, '<br><b>$1</b>');
            // 3. Chuyển ** ở đầu dòng thành bullet
            displayText = displayText.replace(/(^|\n)\*\*\s*/g, '$1<br>• ');
            // 4. Xoá các dấu * còn sót lại
            displayText = displayText.replace(/\*/g, '');
            // 5. Thay \n thành <br>
            displayText = displayText.replace(/\n/g, '<br>');
            // 6. Xoá <br> đầu nếu có
            displayText = displayText.replace(/^<br>/, '');
            bubble.innerHTML = displayText;
        } else {
            bubble.textContent = text;
        }

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
            const res = await fetch('https://1-production-7e62.up.railway.app/chat', {
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
