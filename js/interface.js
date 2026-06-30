// ===================================
// TOAST NOTIFICATIONS
// ===================================
function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
        success: 'check-circle-2',
        info: 'info',
        danger: 'trash-2',
        warning: 'alert-triangle'
    };

    toast.innerHTML = `<i data-lucide="${iconMap[type] || 'info'}"></i><span>${message}</span>`;
    container.appendChild(toast);
    lucide.createIcons({ nodes: [toast] });

    setTimeout(() => {
        toast.classList.add('toast-exit');
        toast.addEventListener('animationend', () => toast.remove());
    }, duration);
}

// ===================================
// NAVEGAÇÃO
// ===================================
function switchView(viewName) {
    // Redirecionamentos lógicos
    if (viewName === 'rh' && !isRhLoggedIn) {
        viewName = 'login';
    } else if (viewName === 'lider-login' && currentLider !== null) {
        viewName = 'lider-form';
    }

    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.add('active');
        // Reinicia a animação de fade
        const card = targetView.querySelector('.card');
        if (card) {
            card.classList.remove('fade-in');
            void card.offsetWidth; // Força o reflow
            card.classList.add('fade-in');
        }
    }

    // Atualiza o botão de navegação ativo
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (viewName === 'lider-login' || viewName === 'lider-form') {
        document.getElementById('nav-lider').classList.add('active');
    } else if (viewName === 'rh' || viewName === 'login') {
        document.getElementById('nav-rh').classList.add('active');
    }

    if (viewName === 'rh') {
        carregarVagasRH();
    }
}

// ===================================
// MODAL
// ===================================
function abrirModal(id) {
    const listaVagas = JSON.parse(localStorage.getItem('vagasEmpresa')) || [];
    const vaga = listaVagas.find(v => v.id === id);

    if (vaga) {
        document.getElementById('texto-modal-justificativa').textContent = vaga.justificativa;
        const modal = document.getElementById('modal-justificativa');
        modal.classList.add('active');
        // Reinicia a animação
        const content = modal.querySelector('.modal-content');
        content.classList.remove('fade-in');
        void content.offsetWidth;
        content.classList.add('fade-in');
    }
}

function fecharModal() {
    document.getElementById('modal-justificativa').classList.remove('active');
}

window.onclick = function (event) {
    const modal = document.getElementById('modal-justificativa');
    if (event.target === modal) {
        fecharModal();
    }
}

// Fechar modal com ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        fecharModal();
    }
});
