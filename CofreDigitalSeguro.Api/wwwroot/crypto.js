
async function deriveKeyFromPassword(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
        {
            "name": 'PBKDF2',
            salt: salt,
            "iterations": 100000,
            "hash": 'SHA-256'
        },
        keyMaterial,
        { "name": 'AES-GCM', "length": 256 },
        true,
        ["encrypt", "decrypt"]
    );
}
async function encryptData(key, data) {
    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = encoder.encode(JSON.stringify(data));
    const encryptedContent = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        encodedData
    );
    const encryptedBytes = new Uint8Array(encryptedContent);
    const fullMessage = new Uint8Array(iv.length + encryptedBytes.length);
    fullMessage.set(iv);
    fullMessage.set(encryptedBytes, iv.length);
    return btoa(String.fromCharCode.apply(null, fullMessage));
}
async function decryptData(key, encryptedBase64) {
    try {
        const fullMessage = new Uint8Array(atob(encryptedBase64).split('').map(c => c.charCodeAt(0)));
        const iv = fullMessage.slice(0, 12);
        const encryptedContent = fullMessage.slice(12);
        const decryptedContent = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encryptedContent
        );
        const decoder = new TextDecoder();
        const decryptedString = decoder.decode(decryptedContent);
        return JSON.parse(decryptedString);
    } catch (e) {
        console.error("Falha ao descriptografar:", e);
        return null;
    }
}
function createSalt(email) {
    const encoder = new TextEncoder();
    return encoder.encode(email.padEnd(16, '0'));
}