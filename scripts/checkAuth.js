document.addEventListener("DOMContentLoaded", function () {
    const myId = localStorage.getItem('myId');
    if (!myId) {
        window.location.href = "login.html"
    }
});