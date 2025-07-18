// Gemini Chatbot Widget - nhúng vào mọi trang
// Sử dụng API key của bạn, KHÔNG public lên github!

const GEMINI_API_KEY = "AIzaSyDL4n_AoesuAdPMs6HuHIQVM0O5A613oQY";

function createChatbotWidget() {
  if (document.getElementById('botpress-chatbot-widget')) return;
  const style = document.createElement('style');
  style.innerHTML = `
    #botpress-chatbot-widget {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 99999;
      width: 370px;
      height: 540px;
      max-width: 95vw;
      max-height: 95vh;
      border-radius: 18px;
      box-shadow: 0 8px 32px rgba(30,60,114,0.18);
      overflow: hidden;
      background: transparent;
      border: none;
      transition: width 0.3s, height 0.3s, border-radius 0.3s, opacity 0.3s;
    }
    #botpress-chatbot-widget.minimized {
      width: 64px !important;
      height: 64px !important;
      border-radius: 50% !important;
      box-shadow: 0 4px 16px rgba(30,60,114,0.18);
      background: linear-gradient(135deg,#1e3c72 0%,#2a5298 100%);
      opacity: 1;
      overflow: hidden;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    #botpress-chatbot-widget.minimized iframe {
      display: none;
    }
    #botpress-chatbot-avatar {
      display: none;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: auto;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    #botpress-chatbot-widget.minimized #botpress-chatbot-avatar {
      display: flex !important;
      opacity: 1;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: auto;
    }
    #botpress-chatbot-avatar span {
      font-size: 2.6rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      user-select: none;
      pointer-events: none;
      text-shadow: 0 2px 8px rgba(30,60,114,0.18);
    }
    #botpress-chatbot-minimize-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #fff;
      color: #1e3c72;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 1.3rem;
      cursor: pointer;
      z-index: 2;
      box-shadow: 0 2px 8px rgba(30,60,114,0.10);
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    #botpress-chatbot-minimize-btn:hover {
      opacity: 1;
    }
    #botpress-chatbot-show-btn {
      position: fixed;
      bottom: 40px;
      right: 24px;
      z-index: 99998;
      background: linear-gradient(135deg,#1e3c72 0%,#2a5298 100%);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 54px;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      box-shadow: 0 4px 16px rgba(30,60,114,0.18);
      cursor: pointer;
      opacity: 0.96;
      transition: background 0.2s, opacity 0.2s;
      outline: none;
      display: none;
    }
    #botpress-chatbot-show-btn:hover {
      background: #2a5298;
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.id = 'botpress-chatbot-widget';
  widget.innerHTML = `
    <button id="botpress-chatbot-minimize-btn" title="Thu nhỏ">–</button>
    <iframe
      src="https://cdn.botpress.cloud/webchat/v3.1/shareable.html?configUrl=https://files.bpcontent.cloud/2025/07/18/06/20250718063825-AMJMI19D.json"
      style="width:100%;height:100%;border:none;"
      allow="microphone; camera;"
      title="Botpress Chatbot"
    ></iframe>
    <div id="botpress-chatbot-avatar" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;">
      <span style="font-size:2.6rem;display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:#fff;">🤖</span>
    </div>
  `;
  document.body.appendChild(widget);

  // Nút hiện lại chatbot
  const showBtn = document.createElement('button');
  showBtn.id = 'botpress-chatbot-show-btn';
  showBtn.title = 'Mở trợ lý AI';
  showBtn.innerHTML = '🤖';
  showBtn.onclick = () => {
    widget.classList.remove('minimized');
    widget.querySelector('iframe').style.display = '';
    widget.querySelector('#botpress-chatbot-avatar').style.display = 'none';
    widget.querySelector('#botpress-chatbot-minimize-btn').style.display = '';
    showBtn.style.display = 'none';
  };
  document.body.appendChild(showBtn);

  // Nút thu nhỏ
  widget.querySelector('#botpress-chatbot-minimize-btn').onclick = () => {
    widget.classList.add('minimized');
    widget.querySelector('iframe').style.display = 'none';
    widget.querySelector('#botpress-chatbot-avatar').style.display = 'flex';
    widget.querySelector('#botpress-chatbot-minimize-btn').style.display = 'none';
    showBtn.style.display = 'block';
  };

  // Khi bấm avatar thì mở lại chatbot
  widget.querySelector('#botpress-chatbot-avatar').onclick = (e) => {
    e.stopPropagation();
    widget.classList.remove('minimized');
    widget.querySelector('iframe').style.display = '';
    widget.querySelector('#botpress-chatbot-avatar').style.display = 'none';
    widget.querySelector('#botpress-chatbot-minimize-btn').style.display = '';
    showBtn.style.display = 'none';
  };

  widget.onclick = function(e) {
    if (!widget.classList.contains('minimized') && e.target !== widget.querySelector('iframe')) {
      widget.classList.add('minimized');
      widget.querySelector('iframe').style.display = 'none';
      widget.querySelector('#botpress-chatbot-avatar').style.display = 'flex';
      showBtn.style.display = 'block';
    }
  };
}

// Tự động nhúng widget khi trang load, trừ trang intro (index.html)
window.addEventListener('DOMContentLoaded', function() {
  // Chỉ không nhúng widget nếu là intro, còn lại đều nhúng
  const isIntro = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
  if (!isIntro) createChatbotWidget();
});
