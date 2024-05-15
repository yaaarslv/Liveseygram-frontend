let stompClient = null;
const id = localStorage.getItem("myId");
let currentUser = parseInt(id);
let isConnected = false;

const connectWebSocket = () => {
    const Stomp = StompJs.Stomp;
    let SockJS = window.SockJS;
    SockJS = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(SockJS);

    client.connect({}, () => onConnected(client), onError);
    return client;
};

const onConnected = (client) => {
    console.log("connected");
    console.log("currentUser:", currentUser);

    client.subscribe(
        "/user/" + currentUser + "/queue/messages",
        onMessageReceived
    );
    isConnected = true;
};

const onError = (error) => {
    console.error("Error during WebSocket connection:", error);
    isConnected = false;
};

const onMessageReceived = (message) => {
    const receivedMessage = JSON.parse(message.body);
    let chat_id = receivedMessage.senderId;

    if (chat_id !== currentUser) {
        const key = `${chat_id}`;
        const existingMessages = JSON.parse(localStorage.getItem(key)) || [];
        existingMessages.push(receivedMessage);
        localStorage.setItem(key, JSON.stringify(existingMessages));
    }

    const existingChat = document.getElementById(`chat-${chat_id}`);
    if (!existingChat) {
        const chatContainer = document.getElementById("chat-container");

        const newChat = document.createElement("div");
        newChat.id = `chat-${chat_id}`;
        newChat.className = `chat`;

        const imageDiv = document.createElement('div');
        // if (receivedMessage.avatarPath) {
        imageDiv.innerHTML = `<img class="user-avatar" src="${receivedMessage.avatarPath}">`;
        // } else {
        //     imageDiv.innerHTML = `<img class="user-avatar" src="../default_avatar.webp">`;
        // }

        imageDiv.id = `user-avatar-${chat_id}`;
        imageDiv.className = `avatar`;

        const participantAndText = document.createElement("div");
        participantAndText.className = `participant-text`
        participantAndText.id = `participant-text-${chat_id}`

        const newChatParticipant = document.createElement("div");
        newChatParticipant.id = `participant-${chat_id}`;
        newChatParticipant.className = `participant`;
        if (chat_id === currentUser) {
            newChatParticipant.textContent = "Избранное";
        } else {
            newChatParticipant.textContent = receivedMessage.senderFullname;
        }

        const newChatText = document.createElement("div");
        newChatText.id = `lastMessage-${chat_id}`
        newChatText.className = `lastMessage`
        newChatText.textContent = receivedMessage.content;

        const unreadPoint = document.createElement("div");
        unreadPoint.id = `unreadPoint-${chat_id}`
        unreadPoint.className = `unreadPoint`

        participantAndText.appendChild(newChatParticipant);
        participantAndText.appendChild(newChatText);
        newChat.appendChild(imageDiv);
        newChat.appendChild(participantAndText);
        newChat.appendChild(unreadPoint);

        const firstElement = chatContainer.firstChild;
        if (firstElement) {
            chatContainer.insertBefore(newChat, firstElement);
        } else {
            chatContainer.appendChild(newChat);
        }

        newChat.addEventListener('click', function () {
            unreadPoint.style.display = "none";
            const activeChatId = localStorage.getItem("activeChat");
            if (activeChatId) {
                const activeChat = document.getElementById(activeChatId);
                activeChat.style.backgroundColor = "initial";
            }

            newChat.style.backgroundColor = "#007bff";
            localStorage.setItem("activeChat", newChat.id);
            const transparent_input = document.querySelector(".transparent-input");
            const sendButton = document.getElementById("sendButton");

            const start_dialog = document.querySelector(".start-dialog");
            start_dialog.style.display = 'none'

            transparent_input.style.display = "initial";
            sendButton.style.display = "initial";
            loadChatMessages(chat_id);
        });

    } else {
        const chatText = document.getElementById(`lastMessage-${chat_id}`);
        chatText.textContent = receivedMessage.content;

        if (chat_id !== currentUser) {
            const messagesContainer = document.querySelector('.messages-container');
            const messageElement = document.createElement('div');

            const activeChatId = localStorage.getItem("activeChat");

            if (activeChatId) {
                const activeChat = document.getElementById(activeChatId);
                if (activeChat.id !== `chat-${chat_id}`) {
                    const unreadPoint = document.getElementById(`unreadPoint-${chat_id}`);
                    unreadPoint.style.display = "initial"
                } else {
                    messageElement.classList.add('other-user');
                    messageElement.textContent = receivedMessage.content;
                    messagesContainer.appendChild(messageElement);

                    let unreadMessage = [receivedMessage.id];
                    changeMessageStatusToREAD(unreadMessage);
                    const chatElement = document.querySelector('.messages-container');
                    chatElement.scrollTop = chatElement.scrollHeight;
                }
            } else {
                const unreadPoint = document.getElementById(`unreadPoint-${chat_id}`);
                unreadPoint.style.display = "initial"
            }
        }

        const clonedChat = existingChat.cloneNode(true);
        const chatContainer = document.getElementById("chat-container");
        chatContainer.removeChild(existingChat);

        const firstElement = chatContainer.firstChild;
        if (firstElement) {
            chatContainer.insertBefore(clonedChat, firstElement);
        } else {
            chatContainer.appendChild(clonedChat);
        }

        clonedChat.addEventListener('click', function () {
            const unreadPoint = document.getElementById(`unreadPoint-${chat_id}`);

            unreadPoint.style.display = "none";
            const activeChatId = localStorage.getItem("activeChat");
            if (activeChatId) {
                const activeChat = document.getElementById(activeChatId);
                activeChat.style.backgroundColor = "initial";
            }

            const start_dialog = document.querySelector(".start-dialog");
            start_dialog.style.display = 'none'

            clonedChat.style.backgroundColor = "#007bff";
            localStorage.setItem("activeChat", clonedChat.id)

            const transparent_input = document.querySelector(".transparent-input");
            const sendButton = document.getElementById("sendButton");

            transparent_input.style.display = "initial";
            sendButton.style.display = "initial";
            loadChatMessages(chat_id)
        })
    }
};

const sendMessage = () => {
    const inputMessage = document.getElementById("messageInput").value
    if (inputMessage.trim() !== "") {
        const activeChatId = localStorage.getItem("activeChat");
        if (activeChatId) {
            const participantId = activeChatId.split("-")[1];
            const participantIdInt = parseInt(participantId);
            const cleanedMessage = inputMessage.replace(/^\s*/, '').replace(/\s*$/, '');
            const message = {
                sender: currentUser,
                recipient: participantIdInt,
                content: cleanedMessage,
            };

            if (stompClient && isConnected) {
                stompClient.send("/app/chat", {}, JSON.stringify(message));
            }
            document.getElementById('messageInput').value = '';

            const existingChat = document.getElementById(`chat-${participantId}`);

            const chatText = document.getElementById(`lastMessage-${participantId}`);
            chatText.textContent = inputMessage;

            const clonedChat = existingChat.cloneNode(true);
            const chatContainer = document.getElementById("chat-container");
            chatContainer.removeChild(existingChat);

            const firstElement = chatContainer.firstChild;
            if (firstElement) {
                chatContainer.insertBefore(clonedChat, firstElement);
            } else {
                chatContainer.appendChild(clonedChat);
            }

            const messagesContainer = document.querySelector('.messages-container');
            const messageElement = document.createElement('div');
            messageElement.classList.add('current-user');
            messageElement.innerHTML = cleanedMessage.replace(/\n/g, '<br>'); // Заменяем \n на <br>
            messagesContainer.appendChild(messageElement);

            const chatElement = document.querySelector('.messages-container');
            chatElement.scrollTop = chatElement.scrollHeight;

            clonedChat.addEventListener('click', function () {
                const unreadPoint = document.getElementById(`unreadPoint-${participantId}`);

                unreadPoint.style.display = "none";
                const activeChatId = localStorage.getItem("activeChat");
                if (activeChatId) {
                    const activeChat = document.getElementById(activeChatId);
                    activeChat.style.backgroundColor = "initial";
                }

                const start_dialog = document.querySelector(".start-dialog");
                start_dialog.style.display = 'none'

                clonedChat.style.backgroundColor = "#007bff";
                localStorage.setItem("activeChat", clonedChat.id)
                loadChatMessages(participantId)
            })

            const key = `${participantId}`;
            const existingMessages = JSON.parse(localStorage.getItem(key)) || [];
            const messageToSave = {
                senderId: currentUser,
                recipientId: participantIdInt,
                content: inputMessage,
            };
            existingMessages.push(messageToSave);
            localStorage.setItem(key, JSON.stringify(existingMessages));
        }
    }

};

stompClient = connectWebSocket();
document.addEventListener("DOMContentLoaded", function () {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton')

    messageInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                const messageText = messageInput.value;
                messageInput.value = messageText + '\n';
                event.preventDefault();
            } else {
                event.preventDefault();
                sendMessage();
            }
        }
    });

    sendButton.addEventListener('click', sendMessage);
});

window.addEventListener("beforeunload", function (){
    localStorage.removeItem("activeChat")
})

