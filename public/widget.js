(function () {
  const API_URL = "https://moh-chatbot-tau.vercel.app/api/chat";

  // Styles
  const style = document.createElement("style");
  style.textContent = `
    #moh-chat-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #1a3a5c;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, background 0.2s;
    }
    #moh-chat-btn:hover { transform: scale(1.08); background: #244d75; }
    #moh-chat-btn svg { width: 28px; height: 28px; fill: white; }

    #moh-chat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 370px;
      height: 520px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.25);
      z-index: 99999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #moh-chat-window.open { display: flex; }

    #moh-chat-header {
      background: #1a3a5c;
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #moh-chat-header-icon {
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #moh-chat-header-icon svg { width: 20px; height: 20px; fill: white; }
    #moh-chat-header-text h3 { margin: 0; font-size: 15px; font-weight: 600; }
    #moh-chat-header-text p { margin: 2px 0 0; font-size: 12px; opacity: 0.8; }
    #moh-chat-close {
      margin-left: auto;
      background: none;
      border: none;
      color: white;
      font-size: 22px;
      cursor: pointer;
      padding: 0 4px;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    #moh-chat-close:hover { opacity: 1; }

    #moh-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f5f7fa;
    }
    .moh-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.45;
      word-wrap: break-word;
    }
    .moh-msg.bot {
      background: white;
      color: #333;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .moh-msg.user {
      background: #1a3a5c;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .moh-msg.typing { opacity: 0.7; font-style: italic; }

    #moh-chat-input-area {
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
      background: white;
    }
    #moh-chat-input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      outline: none;
      font-family: inherit;
      resize: none;
    }
    #moh-chat-input:focus { border-color: #1a3a5c; }
    #moh-chat-input::placeholder { color: #9ca3af; }
    #moh-chat-send {
      background: #1a3a5c;
      border: none;
      border-radius: 8px;
      width: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    #moh-chat-send:hover { background: #244d75; }
    #moh-chat-send:disabled { background: #9ca3af; cursor: not-allowed; }
    #moh-chat-send svg { width: 18px; height: 18px; fill: white; }

    #moh-chat-footer {
      text-align: center;
      padding: 6px;
      font-size: 11px;
      color: #9ca3af;
      background: white;
    }
    #moh-chat-footer a { color: #1a3a5c; text-decoration: none; }

    @media (max-width: 480px) {
      #moh-chat-window {
        width: calc(100vw - 20px);
        height: calc(100vh - 120px);
        right: 10px;
        bottom: 80px;
        border-radius: 10px;
      }
    }
  `;
  document.head.appendChild(style);

  // Chat button
  const btn = document.createElement("button");
  btn.id = "moh-chat-btn";
  btn.title = "Chat with us!";
  btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>`;
  document.body.appendChild(btn);

  // Chat window
  const win = document.createElement("div");
  win.id = "moh-chat-window";
  win.innerHTML = `
    <div id="moh-chat-header">
      <div id="moh-chat-header-icon">
        <svg viewBox="0 0 24 24"><path d="M18 18.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zM6 18.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5zM20 8h-3l-3-4H3c-1.1 0-2 .9-2 2v9h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2V12l-3-4zM7 6h4v4H3V6h4zm13 7h-8V6h1.5l3 4H20v3z"/></svg>
      </div>
      <div id="moh-chat-header-text">
        <h3>Movers of Houston</h3>
        <p>Ask us anything about your move!</p>
      </div>
      <button id="moh-chat-close">&times;</button>
    </div>
    <div id="moh-chat-messages"></div>
    <div id="moh-chat-input-area">
      <input id="moh-chat-input" type="text" placeholder="Type your question..." autocomplete="off" />
      <button id="moh-chat-send">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div id="moh-chat-footer">Powered by <a href="https://moversofhouston.com" target="_blank">Movers of Houston</a></div>
  `;
  document.body.appendChild(win);

  // State
  let messages = [];
  let isOpen = false;
  let isSending = false;

  const msgsEl = win.querySelector("#moh-chat-messages");
  const inputEl = win.querySelector("#moh-chat-input");
  const sendBtn = win.querySelector("#moh-chat-send");
  const closeBtn = win.querySelector("#moh-chat-close");

  // Toggle
  btn.addEventListener("click", function () {
    isOpen = !isOpen;
    win.classList.toggle("open", isOpen);
    if (isOpen && messages.length === 0) {
      addBotMessage("Hi there! I'm here to help with your upcoming move. What questions do you have about our moving services?");
    }
    if (isOpen) inputEl.focus();
  });

  closeBtn.addEventListener("click", function () {
    isOpen = false;
    win.classList.remove("open");
  });

  // Send message
  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isSending) return;

    addUserMessage(text);
    inputEl.value = "";
    isSending = true;
    sendBtn.disabled = true;

    // Show typing indicator
    const typingEl = document.createElement("div");
    typingEl.className = "moh-msg bot typing";
    typingEl.textContent = "Typing...";
    msgsEl.appendChild(typingEl);
    msgsEl.scrollTop = msgsEl.scrollHeight;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: messages.map(function (m) {
          return { role: m.role, content: m.content };
        }),
      }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        typingEl.remove();
        addBotMessage(data.reply || "Sorry, I couldn't process that. Please call us at 281-377-4177!");
      })
      .catch(function () {
        typingEl.remove();
        addBotMessage("I'm having trouble connecting. Please call us at 281-377-4177 and we'll be happy to help!");
      })
      .finally(function () {
        isSending = false;
        sendBtn.disabled = false;
        inputEl.focus();
      });
  }

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  function addUserMessage(text) {
    messages.push({ role: "user", content: text });
    const el = document.createElement("div");
    el.className = "moh-msg user";
    el.textContent = text;
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function addBotMessage(text) {
    messages.push({ role: "assistant", content: text });
    const el = document.createElement("div");
    el.className = "moh-msg bot";
    el.textContent = text;
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
})();
