function editAvatar() {
    const id = localStorage.getItem("myId");
    let intId = parseInt(id);

    const imagefile = document.getElementById('avatar-image').files[0];

    if (imagefile){
        const fileExtension = imagefile.name.split('.').pop();
        const formData = new FormData();

        formData.append("file", imagefile);
        formData.append("userId", intId);

        fetch('http://localhost:8080/upload-avatar', {
            method: 'POST',
            body: formData
        }).then(response => response.text())
            .then(data => {
                alert(data + "\nЧтобы увидеть новую аватарку, перезагрузите страницу!")
            });

        localStorage.setItem("avatarPath", `http://localhost:8080/avatar/${intId}.${fileExtension}`);
    }
}

function editFirstName() {
    const id = localStorage.getItem("myId");
    let intId = parseInt(id);

    const firstName = document.getElementById('editFirstName').value;

    if (firstName){
        const data = {
            id: intId,
            firstName: firstName,
        };

        fetch('http://localhost:8080/users/updateFirstName', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                if (data){
                    alert("Фамилия успешно изменена!");
                    localStorage.setItem("firstName", firstName);
                    localStorage.setItem("fullName", data.fullName);
                    const firstname = document.getElementById("firstName");
                    firstname.textContent = firstName;
                } else {
                    alert("Произошла ошибка. Попробуйте ещё раз позднее.");
                }
            });
    }
}

function editLastName() {
    const id = localStorage.getItem("myId");
    let intId = parseInt(id);

    const lastName = document.getElementById('editLastName').value;

    if (lastName){
        const data = {
            id: intId,
            lastName: lastName,
        };

        fetch('http://localhost:8080/users/updateLastName', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                if (data){
                    alert("Имя успешно изменено!");
                    localStorage.setItem("lastName", lastName);
                    localStorage.setItem("fullName", data.fullName);
                    const lastname = document.getElementById("lastName");
                    lastname.textContent = lastName;
                } else {
                    alert("Произошла ошибка. Попробуйте ещё раз позднее.");
                }
            });
    }
}

function editUserName() {
    const id = localStorage.getItem("myId");
    let intId = parseInt(id);

    const userName = document.getElementById('editUserName').value;

    if (userName){
        const data = {
            id: intId,
            username: userName,
        };

        fetch('http://localhost:8080/users/updateUserName', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                if (data.success){
                    alert("Имя пользователя успешно изменено!");
                    localStorage.setItem("username", userName);
                    const username = document.getElementById("userName");
                    username.textContent = userName;
                } else {
                    alert(data.message);
                }
            });
    }
}

function editPassword() {
    const id = localStorage.getItem("myId");
    let intId = parseInt(id);

    const password = document.getElementById('editPassword').value;

    if (password){
        const data = {
            id: intId,
            password: password,
        };

        fetch('http://localhost:8080/users/updatePassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                if (data){
                    alert("Пароль успешно изменён!");
                } else {
                    alert("Произошла ошибка. Попробуйте ещё раз позднее.");
                }
            });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById('settingsButton');
    const modal = document.getElementById('myModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const editAvatarButton = document.getElementById('editAvatarButton');
    const editFirstNameButton = document.getElementById('editFirstNameButton');
    const editLastNameButton = document.getElementById('editLastNameButton');
    const editPasswordButton = document.getElementById('editPasswordButton');
    const cancelEditAvatarButton = document.getElementById('cancelEditAvatarButton');
    const acceptEditAvatarButton = document.getElementById('acceptEditAvatarButton');
    const cancelEditFirstNameButton = document.getElementById('cancelEditFirstNameButton');
    const acceptEditFirstNameButton = document.getElementById('acceptEditFirstNameButton');
    const cancelEditLastNameButton = document.getElementById('cancelEditLastNameButton');
    const acceptEditLastNameButton = document.getElementById('acceptEditLastNameButton');
    const cancelEditUserNameButton = document.getElementById('cancelEditUserNameButton');
    const acceptEditUserNameButton = document.getElementById('acceptEditUserNameButton');
    const cancelEditPasswordButton = document.getElementById('cancelEditPasswordButton');
    const acceptEditPasswordButton = document.getElementById('acceptEditPasswordButton');
    const editUserNameButton = document.getElementById('editUserNameButton');
    const myAvatarPath = localStorage.getItem("avatarPath");
    const myFullName = localStorage.getItem("fullName");
    const myUsername = localStorage.getItem("username");
    const myFirstName = myFullName.split(" ")[0];
    const myLastName = myFullName.split(" ")[1];

    openModalBtn.addEventListener('click', function () {
        const elementsToExclude = document.querySelectorAll('body :not(.modal):not(.modal *)');
        elementsToExclude.forEach(element => {
            element.style.opacity = '0.5';
        });

        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', function () {
        const elementsToExclude = document.querySelectorAll('body :not(.modal)');
        elementsToExclude.forEach(element => {
            element.style.opacity = '1';
        });
        modal.classList.remove('active');
    });

    editAvatarButton.addEventListener('click', function (){
        const avatarImage = document.getElementById("avatar-image");
        const cancelEditAvatarButton = document.getElementById("cancelEditAvatarButton");
        const acceptEditAvatarButton = document.getElementById("acceptEditAvatarButton");
        avatarImage.style.display = "initial";
        cancelEditAvatarButton.style.display = "initial";
        acceptEditAvatarButton.style.display = "initial";
        editAvatarButton.style.display = "none";
    });

    cancelEditAvatarButton.addEventListener('click', function (){
        const avatarImage = document.getElementById("avatar-image");
        const cancelEditAvatarButton = document.getElementById("cancelEditAvatarButton");
        const acceptEditAvatarButton = document.getElementById("acceptEditAvatarButton");
        avatarImage.style.display = "none";
        cancelEditAvatarButton.style.display = "none";
        acceptEditAvatarButton.style.display = "none";
        editAvatarButton.style.display = "initial";
    });

    acceptEditAvatarButton.addEventListener('click', function (){
        editAvatar();
        const avatarImage = document.getElementById("avatar-image");
        const image = document.getElementById("myAvatar");
        const cancelEditAvatarButton = document.getElementById("cancelEditAvatarButton");
        const acceptEditAvatarButton = document.getElementById("acceptEditAvatarButton");
        avatarImage.style.display = "none";
        image.innerHTML = "";
        image.textContent = "Обновите страницу!";
        cancelEditAvatarButton.style.display = "none";
        acceptEditAvatarButton.style.display = "none";
        editAvatarButton.style.display = "initial";
    });

    editFirstNameButton.addEventListener('click', function (){
        const editFirstName = document.getElementById("editFirstName");
        const cancelEditFirstNameButton = document.getElementById("cancelEditFirstNameButton");
        const acceptEditFirstNameButton = document.getElementById("acceptEditFirstNameButton");
        editFirstName.style.display = "initial";
        editFirstName.value = `${myFirstName}`;
        cancelEditFirstNameButton.style.display = "initial";
        acceptEditFirstNameButton.style.display = "initial";
        editFirstNameButton.style.display = "none";
    });

    cancelEditFirstNameButton.addEventListener('click', function (){
        const editFirstName = document.getElementById("editFirstName");
        const cancelEditFirstNameButton = document.getElementById("cancelEditFirstNameButton");
        const acceptEditFirstNameButton = document.getElementById("acceptEditFirstNameButton");
        editFirstName.style.display = "none";
        cancelEditFirstNameButton.style.display = "none";
        acceptEditFirstNameButton.style.display = "none";
        editFirstNameButton.style.display = "initial";
    });

    acceptEditFirstNameButton.addEventListener('click', function (){
        editFirstName();
        const editFirstname = document.getElementById("editFirstName");
        const cancelEditFirstNameButton = document.getElementById("cancelEditFirstNameButton");
        const acceptEditFirstNameButton = document.getElementById("acceptEditFirstNameButton");
        editFirstname.style.display = "none";
        cancelEditFirstNameButton.style.display = "none";
        acceptEditFirstNameButton.style.display = "none";
        editFirstNameButton.style.display = "initial";
    });

    editLastNameButton.addEventListener('click', function (){
        const editLastName = document.getElementById("editLastName");
        const cancelEditLastNameButton = document.getElementById("cancelEditLastNameButton");
        const acceptEditLastNameButton = document.getElementById("acceptEditLastNameButton");
        editLastName.style.display = "initial";
        editLastName.value = `${myLastName}`;
        cancelEditLastNameButton.style.display = "initial";
        acceptEditLastNameButton.style.display = "initial";
        editLastNameButton.style.display = "none";
    });

    cancelEditLastNameButton.addEventListener('click', function (){
        const editLastName = document.getElementById("editLastName");
        const cancelEditLastNameButton = document.getElementById("cancelEditLastNameButton");
        const acceptEditLastNameButton = document.getElementById("acceptEditLastNameButton");
        editLastName.style.display = "none";
        cancelEditLastNameButton.style.display = "none";
        acceptEditLastNameButton.style.display = "none";
        editLastNameButton.style.display = "initial";
    });

    acceptEditLastNameButton.addEventListener('click', function (){
        editLastName();
        const editLastname = document.getElementById("editLastName");
        const cancelEditLastNameButton = document.getElementById("cancelEditLastNameButton");
        const acceptEditLastNameButton = document.getElementById("acceptEditLastNameButton");
        editLastname.style.display = "none";
        cancelEditLastNameButton.style.display = "none";
        acceptEditLastNameButton.style.display = "none";
        editLastNameButton.style.display = "initial";
    });

    editUserNameButton.addEventListener('click', function (){
        const editUserName = document.getElementById("editUserName");
        const cancelEditUserNameButton = document.getElementById("cancelEditUserNameButton");
        const acceptEditUserNameButton = document.getElementById("acceptEditUserNameButton");
        editUserName.style.display = "initial";
        editUserName.value = `${myUsername}`;
        cancelEditUserNameButton.style.display = "initial";
        acceptEditUserNameButton.style.display = "initial";
        editUserNameButton.style.display = "none";
    });

    cancelEditUserNameButton.addEventListener('click', function (){
        const editUserName = document.getElementById("editUserName");
        const cancelEditUserNameButton = document.getElementById("cancelEditUserNameButton");
        const acceptEditUserNameButton = document.getElementById("acceptEditUserNameButton");
        editUserName.style.display = "none";
        cancelEditUserNameButton.style.display = "none";
        acceptEditUserNameButton.style.display = "none";
        editUserNameButton.style.display = "initial";
    });

    acceptEditUserNameButton.addEventListener('click', function (){
        editUserName();
        const editUsername = document.getElementById("editUserName");
        const cancelEditUserNameButton = document.getElementById("cancelEditUserNameButton");
        const acceptEditUserNameButton = document.getElementById("acceptEditUserNameButton");
        editUsername.style.display = "none";
        cancelEditUserNameButton.style.display = "none";
        acceptEditUserNameButton.style.display = "none";
        editUserNameButton.style.display = "initial";
    });

    editPasswordButton.addEventListener('click', function (){
        const editPassword = document.getElementById("editPassword");
        const cancelEditPasswordButton = document.getElementById("cancelEditPasswordButton");
        const acceptEditPasswordButton = document.getElementById("acceptEditPasswordButton");
        editPassword.style.display = "initial";
        editPassword.value = "";
        cancelEditPasswordButton.style.display = "initial";
        acceptEditPasswordButton.style.display = "initial";
        editPasswordButton.style.display = "none";
    });

    cancelEditPasswordButton.addEventListener('click', function (){
        const editPassword = document.getElementById("editPassword");
        const cancelEditPasswordButton = document.getElementById("cancelEditPasswordButton");
        const acceptEditPasswordButton = document.getElementById("acceptEditPasswordButton");
        editPassword.style.display = "none";
        editPassword.value = "";
        cancelEditPasswordButton.style.display = "none";
        acceptEditPasswordButton.style.display = "none";
        editPasswordButton.style.display = "initial";
    });

    acceptEditPasswordButton.addEventListener('click', function (){
        editPassword();
        const editpassword = document.getElementById("editPassword");
        const cancelEditPasswordButton = document.getElementById("cancelEditPasswordButton");
        const acceptEditPasswordButton = document.getElementById("acceptEditPasswordButton");
        editpassword.style.display = "none";
        editpassword.value = "";
        cancelEditPasswordButton.style.display = "none";
        acceptEditPasswordButton.style.display = "none";
        editPasswordButton.style.display = "initial";
    });

    const myAvatar = document.getElementById("myAvatar");
    myAvatar.innerHTML = `<img class="user-avatar" src="${myAvatarPath}">`;

    const firstName = document.getElementById("firstName");
    firstName.textContent = myFirstName;

    const lastName = document.getElementById("lastName");
    lastName.textContent = myLastName;

    const username = document.getElementById("userName");
    username.textContent = myUsername;
});