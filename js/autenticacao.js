// ===================================
// LOGIN LÍDER
// ===================================
const liderForm = document.getElementById('lider-login-form');
if (liderForm) {
    liderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('lider-username').value.trim().toLowerCase();
        const pass = document.getElementById('lider-password').value;

        if (username && lideresData[username] && lideresData[username].senha === pass) {
            // Login sucesso
            currentLider = lideresData[username];

            // Preenche dados na view do formulário
            document.getElementById('logged-lider-name').textContent = currentLider.nome;
            document.getElementById('logged-lider-setor').textContent = currentLider.setor;

            document.getElementById('lider').value = currentLider.nome;
            document.getElementById('setor').value = currentLider.setor;

            // Ajusta o campo de cargo dependendo do setor
            const oldCargo = document.getElementById('cargo');
            if (currentLider.setor === 'Financeiro') {
                const newCargo = document.createElement('select');
                newCargo.id = 'cargo';
                newCargo.required = true;
                newCargo.innerHTML = `
                    <option value="" disabled selected>Selecione um cargo</option>
                    <option value="Analista de Financeiro Junior">Analista de Financeiro Junior</option>
                    <option value="Analista de Financeiro Pleno">Analista de Financeiro Pleno</option>
                    <option value="Analista de Financeiro Senior">Analista de Financeiro Sênior</option>
                `;
                oldCargo.parentNode.replaceChild(newCargo, oldCargo);
            } else {
                const newCargo = document.createElement('input');
                newCargo.type = 'text';
                newCargo.id = 'cargo';
                newCargo.placeholder = 'Ex: Analista Sênior';
                newCargo.required = true;
                oldCargo.parentNode.replaceChild(newCargo, oldCargo);
            }

            // Limpa form de login
            document.getElementById('lider-login-error').classList.remove('show');
            document.getElementById('lider-username').value = '';
            document.getElementById('lider-password').value = '';

            switchView('lider-form');
            showToast(`Bem-vindo(a), ${currentLider.nome}!`, 'success');
        } else {
            // Erro
            const errorEl = document.getElementById('lider-login-error');
            errorEl.classList.add('show');
            errorEl.style.animation = 'none';
            void errorEl.offsetWidth;
            errorEl.style.animation = 'slideDown 0.35s ease';
        }
    });
}

function logoutLider() {
    currentLider = null;
    showToast('Sessão encerrada.', 'info');

    // Reseta form de solicitação
    document.getElementById('vaga-form').reset();

    switchView('lider-login');
}

// ===================================
// LOGIN RH
// ===================================
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === '1234') {
        isRhLoggedIn = true;
        document.getElementById('login-error').classList.remove('show');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        switchView('rh');
        showToast('Login realizado com sucesso!', 'success');
    } else {
        const errorEl = document.getElementById('login-error');
        errorEl.classList.add('show');
        // Animação de tremor
        errorEl.style.animation = 'none';
        void errorEl.offsetWidth;
        errorEl.style.animation = 'slideDown 0.35s ease';
    }
});

function logoutRH() {
    isRhLoggedIn = false;
    showToast('Sessão encerrada.', 'info');
    switchView('lider-login');
}

// ===================================
// MOSTRAR / OCULTAR SENHA (Genérico)
// ===================================
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');

    if (input.getAttribute('type') === 'password') {
        input.setAttribute('type', 'text');
        if (icon) icon.setAttribute('data-lucide', 'eye-off');
        btn.title = 'Ocultar senha';
    } else {
        input.setAttribute('type', 'password');
        if (icon) icon.setAttribute('data-lucide', 'eye');
        btn.title = 'Mostrar senha';
    }
    lucide.createIcons({ nodes: [btn] });
}
