function login() {
    const login = document.querySelector(".log-login-input").value;
    const password = document.querySelector(".log-password-input").value;
    const data = {
        email: login,
        password: password,
        additionalParameter: "sent from browser"
    };

    fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            if (data.success){
                const user = data.user;
                const userId = user.id;
                const email = user.email;
                const fullName = user.fullName;
                const avatarPath = user.avatarPath;
                const username = user.username;
                localStorage.setItem('myId', userId);
                localStorage.setItem('email', email);
                localStorage.setItem('fullName', fullName);
                localStorage.setItem('avatarPath', avatarPath);
                localStorage.setItem('username', username);
                window.location.href = 'chats.html';
            } else {
                alert(data.message);
            }
        });
}

function register() {
    const login = document.querySelector(".reg-login-input").value;
    const password = document.querySelector(".reg-password-input").value;
    const firstname = document.querySelector(".reg-firstname-input").value;
    const lastname = document.querySelector(".reg-lastname-input").value;
    const username = document.querySelector(".reg-username-input").value;
    const data = {
        email: login,
        password: password,
        firstName: firstname,
        lastName: lastname,
        username: username,
    };

    fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            if (data.success){
                const user = data.user;
                const userId = user.id;
                const email = user.email;
                const fullName = user.fullName;
                const avatarPath = user.avatarPath;
                const username = user.username;
                localStorage.setItem('myId', userId);
                localStorage.setItem('email', email);
                localStorage.setItem('fullName', fullName);
                localStorage.setItem('avatarPath', avatarPath);
                localStorage.setItem('username', username);
                window.location.href = 'chats.html';
            } else {
                alert(data.message);
            }
        });
}

