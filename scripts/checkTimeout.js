let timeout;

function resetSession() {
    localStorage.clear();
    alert("Вы бездействовали более 10 минут. Для продолжения общения необходимо заново авторизоваться.")
    window.location.href = "login.html"
}

function resetTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(resetSession, 1000 * 60 * 10);
}

document.addEventListener('mousemove', resetTimeout);
document.addEventListener('keydown', resetTimeout);

resetTimeout();