function loadChatMessages(recipientId) {
    const id = localStorage.getItem("myId");
    let intId = parseInt(id);

    const messages = localStorage.getItem(`${recipientId}`);
    if (messages) {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer.id) {
            if (messagesContainer.id !== recipientId) {
                while (messagesContainer.firstChild) {
                    messagesContainer.removeChild(messagesContainer.firstChild);
                }
            }
        }

        const existingMessages = JSON.parse(messages);
        let unreadMessages = [];

        existingMessages.forEach(message => {
            const messageElement = document.createElement('div');

            if (message.senderId === message.recipientId) {
                messageElement.classList.add('current-user');
                const fullname_container = document.querySelector(".fullname-chat");
                fullname_container.textContent = "Избранное";
                fullname_container.style.display = "block";
            } else if (message.senderId === intId) {
                messageElement.classList.add('current-user');
                messagesContainer.id = message.recipientId;
                const fullname_container = document.querySelector(".fullname-chat");
                fullname_container.textContent = message.recipientFullname;
                fullname_container.style.display = "block";
            } else if (message.recipientId === intId) {
                messagesContainer.id = message.senderId;
                messageElement.classList.add('other-user');
                const fullname_container = document.querySelector(".fullname-chat");
                fullname_container.textContent = message.senderFullname;
                fullname_container.style.display = "block";
            }

            const cleanedMessage = message.content.replace(/^\s*/, '');

            messageElement.innerHTML = cleanedMessage.replace(/\n/g, '<br>'); // Заменяем \n на <br>
            messagesContainer.appendChild(messageElement);

            if (message.senderId === recipientId && message.messageStatus === "RECEIVED") {
                unreadMessages.push(message.id);
            }
        });

        if (unreadMessages.length !== 0){
            changeMessageStatusToREAD(unreadMessages)
        }

    } else {
        const data = {
            sender_id: intId,
            recipient_id: recipientId
        };

        fetch('http://localhost:8080/messages/getChatMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                const messagesContainer = document.querySelector('.messages-container');
                if (messagesContainer.id) {
                    if (messagesContainer.id !== recipientId) {
                        while (messagesContainer.firstChild) {
                            messagesContainer.removeChild(messagesContainer.firstChild);
                        }
                    }
                }

                data.forEach(message => {
                    const messageElement = document.createElement('div');

                    if (message.senderId === message.recipientId) {
                        messageElement.classList.add('current-user');
                        const fullname_container = document.querySelector(".fullname-chat");
                        fullname_container.textContent = "Избранное";
                        fullname_container.style.display = "block";
                    } else if (message.senderId === intId) {
                        messageElement.classList.add('current-user');
                        messagesContainer.id = message.recipientId;
                        const fullname_container = document.querySelector(".fullname-chat");
                        fullname_container.textContent = message.recipientFullname;
                        fullname_container.style.display = "block";
                    } else if (message.recipientId === intId) {
                        messagesContainer.id = message.senderId;
                        messageElement.classList.add('other-user');
                        const fullname_container = document.querySelector(".fullname-chat");
                        fullname_container.textContent = message.senderFullname;
                        fullname_container.style.display = "block";
                    }

                    const cleanedMessage = message.content.replace(/^\s*/, '');

                    messageElement.innerHTML = cleanedMessage.replace(/\n/g, '<br>'); // Заменяем \n на <br>
                    messagesContainer.appendChild(messageElement);

                    const key = `${recipientId}`;
                    const existingMessages = JSON.parse(localStorage.getItem(key)) || [];
                    existingMessages.push(message);
                    localStorage.setItem(key, JSON.stringify(existingMessages));
                });
            });
    }
    const chatElement = document.querySelector('.messages-container');
    chatElement.scrollTop = chatElement.scrollHeight;
}

function loadChats() {
    const id = localStorage.getItem("myId");
    let intId = parseInt(id);

    const izbrannoje = document.querySelector(".chat");
    izbrannoje.id = `chat-${id}`;

    const izbrannoje_avatar = document.querySelector(".avatar");
    izbrannoje_avatar.id = `user-avatar-${id}`;

    const izbrannoje_avatar_url = localStorage.getItem("avatarPath");
    izbrannoje_avatar.innerHTML = `<img class="user-avatar" src="${izbrannoje_avatar_url}">`;

    const izbrannoje_participant_text = document.querySelector(".participant-text");
    izbrannoje_participant_text.id = `participant-text-${id}`;

    const izbrannoje_participant = document.querySelector(".participant");
    izbrannoje_participant.id = `participant-${id}`;

    const izbrannoje_lastMessage = document.querySelector(".lastMessage");
    izbrannoje_lastMessage.id = `lastMessage-${id}`;

    const izbrannoje_unreadPoint = document.querySelector(".unreadPoint");
    izbrannoje_unreadPoint.id = `unreadPoint-${id}`;

    izbrannoje.addEventListener('click', function () {
        const activeChatId = localStorage.getItem("activeChat");
        if (activeChatId) {
            const activeChat = document.getElementById(activeChatId);
            activeChat.style.backgroundColor = "initial";
        }

        const start_dialog = document.querySelector(".start-dialog");
        start_dialog.style.display = 'none'

        izbrannoje.style.backgroundColor = "#007bff";
        localStorage.setItem("activeChat", izbrannoje.id);
        const transparent_input = document.querySelector(".transparent-input");
        const sendButton = document.getElementById("sendButton");
        transparent_input.style.display = "initial";
        sendButton.style.display = "initial";
        loadChatMessages(intId);
    });

    fetch('http://localhost:8080/messages/getUserChatsWithLastMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(intId)
    }).then(response => response.json())
        .then(data => {

            const chatContainer = document.getElementById("chat-container");
            for (let i = 0; i < data.length; i++) {
                let chat_id = data[i].participantId;

                if (chat_id !== intId) {
                    const newChat = document.createElement("div");
                    newChat.id = `chat-${chat_id}`;
                    newChat.className = `chat`;

                    const imageDiv = document.createElement('div');
                    // if (data[i].avatarPath) {
                    imageDiv.innerHTML = `<img class="user-avatar" src="${data[i].avatarPath}">`;
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
                    if (chat_id === intId) {
                        newChatParticipant.textContent = "Избранное";
                    } else {
                        newChatParticipant.textContent = data[i].participantFullname;
                    }

                    const newChatText = document.createElement("div");
                    newChatText.id = `lastMessage-${chat_id}`
                    newChatText.className = `lastMessage`
                    newChatText.textContent = data[i].content;

                    const unreadPoint = document.createElement("div");
                    unreadPoint.id = `unreadPoint-${chat_id}`
                    unreadPoint.className = `unreadPoint`
                    if (data[i].unreadMessagesCount > 0) {
                        unreadPoint.textContent = data[i].unreadMessagesCount;
                    } else {
                        unreadPoint.style.display = "none"
                    }

                    participantAndText.appendChild(newChatParticipant);
                    participantAndText.appendChild(newChatText);
                    newChat.appendChild(imageDiv);
                    newChat.appendChild(participantAndText);
                    newChat.appendChild(unreadPoint);

                    chatContainer.appendChild(newChat);
                    newChat.addEventListener('click', function () {
                        unreadPoint.style.display = "none";
                        const activeChatId = localStorage.getItem("activeChat");
                        if (activeChatId) {
                            const activeChat = document.getElementById(activeChatId);
                            activeChat.style.backgroundColor = "initial";
                        }

                        const start_dialog = document.querySelector(".start-dialog");
                        start_dialog.style.display = 'none'

                        newChat.style.backgroundColor = "#007bff";
                        localStorage.setItem("activeChat", newChat.id);
                        const transparent_input = document.querySelector(".transparent-input");
                        const sendButton = document.getElementById("sendButton");
                        transparent_input.style.display = "initial";
                        sendButton.style.display = "initial";
                        loadChatMessages(chat_id);
                    });
                } else {
                    const myLastMessage = document.getElementById(`lastMessage-${id}`);
                    myLastMessage.textContent = data[i].content;
                }
            }
        });
}

document.addEventListener("DOMContentLoaded", loadChats)
document.addEventListener("DOMContentLoaded", function (){

})
