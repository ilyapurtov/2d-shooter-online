export class ChatController {
  constructor(UIContainer, socket, nickname, color) {
    this.socket = socket;

    // getting color and nickname for current player
    this.nickname = nickname;
    this.color = color;

    // chat elements in DOM
    this.UIContainer = UIContainer;
    this.chatOpenerElement = this.UIContainer.querySelector("#chat-opener");
    this.chatElement = this.UIContainer.querySelector("#chat");
    this.inputElement = this.UIContainer.querySelector("#chat__input");
    this.messagesElement = this.UIContainer.querySelector("#chat__messages");

    // setting up event listeners
    this.listenToEvents();
  }

  listenToEvents() {
    // showing and hiding the chat by pressing the button
    this.chatOpenerElement.addEventListener("click", () =>
      this.toggleChatVisibility()
    );

    // showing and hiding chat by T and also hiding by Escape
    window.addEventListener("keyup", (event) => {
      if (
        (event.code == "KeyT" && !this.inputElement.dataset.focused) ||
        (this.chatOpenerElement.classList.contains("active") &&
          event.code == "Escape")
      ) {
        this.toggleChatVisibility();
      }
    });

    // using data-focused to separate game input and chat input
    this.inputElement.addEventListener("focus", () => {
      this.inputElement.dataset.focused = true;
    });
    this.inputElement.addEventListener("focusout", () => {
      delete this.inputElement.dataset.focused;
    });

    // sending message on pressing enter
    this.inputElement.addEventListener("keydown", (event) => {
      if (event.code == "Enter") {
        this.sendMessage();
      }
    });
  }

  toggleChatVisibility() {
    if (this.chatOpenerElement.classList.contains("active")) {
      this.inputElement.value = "";
      this.chatElement.style.display = "none";
      this.chatOpenerElement.classList.remove("active");
    } else {
      this.chatElement.style.display = "flex";
      this.inputElement.focus();
      this.chatOpenerElement.classList.add("active");
    }
  }

  // sending message on a server
  sendMessage() {
    const message = this.inputElement.value;
    this.inputElement.value = "";
    this.socket.emit("sendMessage", this.nickname, this.color, message);
  }

  // emits from the server and creates a new DOM element containing new message that we got
  updateChat(nickname, color, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    const nicknameElement = document.createElement("span");
    nicknameElement.style.color = color;
    nicknameElement.innerText = nickname + ": ";
    messageElement.appendChild(nicknameElement);

    const textElement = document.createElement("span");
    textElement.innerText = message;
    messageElement.appendChild(textElement);

    this.messagesElement.appendChild(messageElement);
    this.messagesElement.scroll({ top: this.messagesElement.scrollHeight });
  }
}
