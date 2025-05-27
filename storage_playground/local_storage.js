// --- LocalStorage ---
function setLocal() {
    const key = document.getElementById('localKey').value;
    const value = document.getElementById('localValue').value;
    localStorage.setItem(key, value);
    updateLocalDisplay();
}

function getLocal() {
    const key = document.getElementById('localKey').value;
    const val = localStorage.getItem(key);
    document.getElementById('localDisplay').textContent = val;
}

function removeLocal() {
    const key = document.getElementById('localKey').value;
    localStorage.removeItem(key);
    updateLocalDisplay();
}

function clearLocal() {
    localStorage.clear();
    updateLocalDisplay();
}

function updateLocalDisplay() {
    let out = "";
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        out += `${k}: ${localStorage.getItem(k)}\n`;
    }
    document.getElementById('localDisplay').textContent = out || 'Empty';
}
