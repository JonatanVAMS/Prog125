
document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) { window.location.href = '/'; return; }

    const masterPassword = sessionStorage.getItem('masterPassword');
    const userEmail = sessionStorage.getItem('userEmail');
    const itemsList = document.getElementById('items-list');
    const addItemForm = document.getElementById('add-item-form');
    const logoutBtn = document.getElementById('logout-btn');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    let decryptionKey = null;

    async function fetchAndDisplayItems() {
        itemsList.innerHTML = '';
        loadingMessage.style.display = 'block';
        errorMessage.textContent = '';

        try {
            if (!decryptionKey) {
                const salt = createSalt(userEmail);
                decryptionKey = await deriveKeyFromPassword(masterPassword, salt);
            }

            const response = await fetch('/api/Vault', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) logout();
                throw new Error('Não foi possível buscar os itens.');
            }

            const data = await response.json();
            loadingMessage.style.display = 'none';
            if (data.length === 0) { itemsList.innerHTML = '<li>Seu cofre está vazio.</li>'; return; }
            for (const item of data) {
                const decrypted = await decryptData(decryptionKey, item.encryptedData);
                if (decrypted) {
                    const li = document.createElement('li');
                    li.innerHTML = `<div class="item-content"><span><span class="math-inline">\{decrypted\.label\}\:</span\> <span class\="secret" title\="Clique para revelar"\>\[escondido\]</span\></div\> <button class\="delete\-btn" data\-id\="</span>{item.id}">✖</button>`;
                    itemsList.appendChild(li);
                    const secretSpan = li.querySelector('.secret');
                    let isRevealed = false;
                    secretSpan.addEventListener('click', () => { isRevealed = !isRevealed; secretSpan.textContent = isRevealed ? decrypted.value : '[escondido]'; });
                }
            }
        } catch (error) { errorMessage.textContent = `Erro: ${error.message}.`; console.error(error); }
    }

    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const label = document.getElementById('item-label').value;
        const value = document.getElementById('item-value').value;
        try {
            const dataToEncrypt = { label, value };
            const encryptedDataString = await encryptData(decryptionKey, dataToEncrypt);

            const response = await fetch('/api/Vault', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ encryptedData: encryptedDataString })
            });

            if (!response.ok) throw new Error('Falha ao adicionar o item.');
            addItemForm.reset();
            fetchAndDisplayItems();
        } catch (error) { errorMessage.textContent = `Erro: ${error.message}`; }
    });

    itemsList.addEventListener('click', async (e) => {
        if (e.target && e.target.classList.contains('delete-btn')) {
            const itemId = e.target.dataset.id;
            if (confirm('Tem certeza?')) {
                try {
                    const response = await fetch(`/api/Vault/${itemId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error('Falha ao deletar.');
                    fetchAndDisplayItems();
                } catch (error) { errorMessage.textContent = `Erro: ${error.message}`; }
            }
        }
    });

    function logout() { sessionStorage.clear(); window.location.href = '/'; }
    logoutBtn.addEventListener('click', logout);

    fetchAndDisplayItems();
});