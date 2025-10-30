window.addEventListener('load', () => {
  console.log('EDD custom chatbot.js loaded, waiting for CXone chat iframe...');

  const injectCustomChat = (doc) => {
    console.log('Injecting EDD chat UI into CXone chat iframe...');

    doc.body.innerHTML = '';

    const container = doc.createElement('div');
    container.id = 'chatbot-container';
    container.innerHTML = `
      <style>
        .chat-center-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100%;
        }
        .chat-window {
          width: 360px;
          height: 600px;
          max-height: 75vh;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.11);
          display: flex;
          flex-direction: column;
        }
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #003366;
          color: #fff;
          padding: 12px 16px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .edd-logo {
          height: 32px;
          width: auto;
          margin-right: 10px;
        }
        .chat-title {
          font-size: 1.08rem;
          font-weight: 600;
          letter-spacing: 0.1px;
        }
        .menu-dots {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.4em;
          cursor: pointer;
          margin-right: 8px;
        }
        .chat-header-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lang-selector, .close-chat {
          background: #01509e;
          border: none;
          color: #fff;
          border-radius: 4px;
          padding: 5px 10px;
          margin-left: 2px;
          cursor: pointer;
        }
      </style>
      <div class="chat-center-container">
        <div class="chat-window">
          <div class="chat-header">
            <div class="header-left">
              <button class="menu-dots">&#8942;</button>
              <img src="images/edd-white.svg" alt="EDD" class="edd-logo" />
            </div>
            <div class="header-right">
              <button class="lang-selector">English</button>
              <button class="close-chat">&times;</button>
            </div>
          </div>
          <div class="menu-dropdown">
            <button class="menu-option">Unmute</button>
            <button class="menu-option">End Chat</button>
          </div>
          <div class="chat-content">
            <div class="chat-messages">
              <div class="message bot">
                <div class="message-content">
                  Hello! I’m EDD’s virtual assistant. I’ll do my best to answer your questions about our services. For your privacy, don't share personal details like your Social Security number or address.<br><br>Let's get started! Which option can I help you with?
                </div>
              </div>
              <div class="chat-options">
                <button class="option-button">Password Reset</button>
                <button class="option-button">Other Technical Issues</button>
              </div>
            </div>
            <div class="chat-input-area">
              <input type="text" class="chat-input" placeholder="Type a message...">
              <button class="send-btn">Send</button>
            </div>
          </div>
        </div>
      </div>
    `;
    doc.body.appendChild(container);

    const input = doc.querySelector('.chat-input');
    const sendBtn = doc.querySelector('.send-btn');
    const messages = doc.querySelector('.chat-messages');

    const sendMessage = () => {
      const text = input.value.trim();
      if (!text) return;
      const userMsg = doc.createElement('div');
      userMsg.classList.add('message', 'user');
      userMsg.innerHTML = `<div class="user-message">${text}</div>`;
      messages.appendChild(userMsg);
      input.value = '';
      messages.scrollTop = messages.scrollHeight;
      setTimeout(() => {
        const botMsg = doc.createElement('div');
        botMsg.classList.add('message', 'bot');
        botMsg.innerHTML = `<div class="avatar">E</div>
          <div class="message-content">Thanks for your message! A support agent will join shortly.</div>`;
        messages.appendChild(botMsg);
        messages.scrollTop = messages.scrollHeight;
      }, 1000);
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  };

  console.log('[EDD Debug] Injecting immediately on window load');
  const root = document.getElementById('root');
  if (root) root.innerHTML = '';
  injectCustomChat(document);
});
