// --- IndexedDB ---
const dbName = "StorageDB";
let db;

const request = indexedDB.open(dbName, 2); // Increment version if schema changes
request.onerror = () => console.error("IndexedDB failed");

request.onsuccess = () => {
    db = request.result;
    updateIDBDisplay();
};

request.onupgradeneeded = (event) => {
    db = event.target.result;

    // Create object stores if they don't exist
    if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
    }
    if (!db.objectStoreNames.contains("logs")) {
        db.createObjectStore("logs", { autoIncrement: true });
    }
};

function getSelectedStore() {
    return document.getElementById("storeSelect").value;
}

function getTrimmedValue(id) {
    return document.getElementById(id).value.trim();
}

function addToIndexedDB() {
    const storeName = getSelectedStore();
    const key = getTrimmedValue('idbKey');
    const value = getTrimmedValue('idbValue');

    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    let entry;

    switch (storeName) {
        case "users":
            if (!key || !value) return alert("ID and Name required");
            entry = { id: key, name: value };
            break;
        case "settings":
            if (!key || !value) return alert("Key and Value required");
            entry = { key, value };
            break;
        case "logs":
            if (!value) return alert("Log message required");
            entry = { timestamp: Date.now(), log: value };
            break;
        default:
            return;
    }

    store.put(entry);
    tx.oncomplete = updateIDBDisplay;
}

function getFromIndexedDB() {
    const storeName = getSelectedStore();
    const key = getTrimmedValue('idbKey');
    if (!key && storeName !== "logs") return alert("Key required");

    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(storeName === "logs" ? Number(key) : key);

    req.onsuccess = () => {
        document.getElementById('idbDisplay').textContent = req.result
            ? JSON.stringify(req.result, null, 2)
            : "Not found";
    };
}

function deleteFromIndexedDB() {
    const storeName = getSelectedStore();
    const key = getTrimmedValue('idbKey');
    if (!key && storeName !== "logs") return alert("Key required");

    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).delete(storeName === "logs" ? Number(key) : key);
    tx.oncomplete = updateIDBDisplay;
}

function clearIndexedDB() {
    const storeName = getSelectedStore();
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).clear();
    tx.oncomplete = updateIDBDisplay;
}

function updateIDBDisplay() {
    const storeName = getSelectedStore();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();

    req.onsuccess = () => {
        const items = req.result;
        document.getElementById('idbDisplay').textContent = items.length
            ? items.map(i => JSON.stringify(i)).join("\n")
            : 'Empty';
    };
}
