// --- Cookie Functions ---
function setCookie(name, value, days, options = {}) {
    let str = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/`;
    if (options.useMaxAge && options.maxAge) {
        str += `; max-age=${options.maxAge}`;
    } else if (days) {
        const expires = new Date(Date.now() + days * 86400000).toUTCString();
        str += `; expires=${expires}`;
    }
    if (options.sameSite) str += `; SameSite=${options.sameSite}`;
    if (options.secure) str += `; Secure`;
    document.cookie = str;
}

function getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1] || null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function setCookieFromUI() {
    const name = document.getElementById('cookieName').value;
    const value = document.getElementById('cookieValue').value;
    const days = parseInt(document.getElementById('cookieDays').value, 10);
    const sameSite = document.getElementById('cookieSameSite').value;
    const secure = document.getElementById('cookieSecure').checked;
    const useMaxAge = document.getElementById('useMaxAge').checked;
    const maxAge = parseInt(document.getElementById('cookieMaxAge').value, 10);
    setCookie(name, value, days, { sameSite, secure, useMaxAge, maxAge });
}

function getCookieFromUI() {
    const name = document.getElementById('getCookieName').value;
    document.getElementById('getCookieResult').textContent = getCookie(name);
}

function deleteCookieFromUI() {
    const name = document.getElementById('deleteCookieName').value;
    deleteCookie(name);
}

function showAllCookies() {
    document.getElementById('cookieDisplay').textContent = document.cookie;
}
