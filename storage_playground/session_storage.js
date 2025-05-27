// --- SessionStorage ---
function setSession() {
    const key = document.getElementById('sessionKey').value;
    const value = document.getElementById('sessionValue').value;
    sessionStorage.setItem(key, value);
    updateSessionDisplay();
}

function getSession() {
    const val = sessionStorage.getItem(document.getElementById('sessionKey').value);
    document.getElementById('sessionDisplay').textContent = val;
}

function removeSession() {
    sessionStorage.removeItem(document.getElementById('sessionKey').value);
    updateSessionDisplay();
}

function clearSession() {
    sessionStorage.clear();
    updateSessionDisplay();
}

function updateSessionDisplay() {
    let out = "";
    for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        out += `${i+1}- ${k}: ${sessionStorage.getItem(k)}\n`;
    }
    document.getElementById('sessionDisplay').textContent = out || 'Empty';
}
