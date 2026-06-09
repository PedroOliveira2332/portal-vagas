let isRhLoggedIn = false;
let currentLider = null;

// ===================================
// DADOS DOS LÍDERES (Simulação de Banco de Dados)
// ===================================
const lideresData = {
    'dicesar.silva': { nome: 'Dicesar Silva', setor: 'Pré-Vendas', senha: '123' },
    'peterson.botelho': { nome: 'Peterson Botelho', setor: 'Vendas', senha: '123' },
    'aline.schmidt': { nome: 'Aline Schmidt', setor: 'Customer Service', senha: '123' },
    'fernando.oliveira': { nome: 'Fernando R. Oliveira', setor: 'Suporte', senha: '123' },
    'carla.franco': { nome: 'Carla Franco', setor: 'Projeto e Produto', senha: '123' },
    'irc.miguel': { nome: 'Irc Miguel', setor: 'Sustentação', senha: '123' },
    'pedro.ramos': { nome: 'Pedro Henrique de Souza Ramos', setor: 'Financeiro', senha: '123' },
    'gabrielly.bezerra': { nome: 'Gabrielly De Moraes Bezerra', setor: 'Pessoas e Cultura', senha: '123' }
};

// ===================================
// INICIALIZAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

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
        // Re-trigger fade animation
        const card = targetView.querySelector('.card');
        if (card) {
            card.classList.remove('fade-in');
            void card.offsetWidth; // force reflow
            card.classList.add('fade-in');
        }
    }

    // Update active nav button
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
// LOGIN LÍDER
// ===================================
const liderForm = document.getElementById('lider-login-form');
if (liderForm) {
    liderForm.addEventListener('submit', function(e) {
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
document.getElementById('login-form').addEventListener('submit', function(e) {
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
        // Shake animation
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

// ===================================
// FORMULÁRIO DO LÍDER (Abertura de vaga)
// ===================================
document.getElementById('vaga-form').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!currentLider) {
        showToast('Erro: Você precisa estar logado para enviar uma solicitação.', 'danger');
        switchView('lider-login');
        return;
    }

    const novaSolicitacao = {
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        lider: currentLider.nome,
        setor: currentLider.setor,
        cargo: document.getElementById('cargo').value,
        tipo: document.getElementById('tipo').value,
        urgencia: document.getElementById('urgencia').value,
        justificativa: document.getElementById('justificativa').value,
        status: 'Pendente'
    };

    let listaVagas = JSON.parse(localStorage.getItem('vagasEmpresa')) || [];
    listaVagas.push(novaSolicitacao);
    localStorage.setItem('vagasEmpresa', JSON.stringify(listaVagas));

    mostrarSucesso();
    showToast('Solicitação enviada com sucesso!', 'success');
    
    // Reseta apenas os campos preenchíveis, mantém líder e setor
    document.getElementById('cargo').value = '';
    document.getElementById('tipo').selectedIndex = 0;
    document.getElementById('urgencia').selectedIndex = 0;
    document.getElementById('justificativa').value = '';
});

function mostrarSucesso() {
    const msg = document.getElementById('success-msg');
    msg.classList.add('show');
    setTimeout(() => {
        msg.classList.remove('show');
    }, 4000);
}

// ===================================
// TABELA DO RH
// ===================================
function carregarVagasRH() {
    const listaVagas = JSON.parse(localStorage.getItem('vagasEmpresa')) || [];
    const tbody = document.getElementById('tabela-vagas');
    
    tbody.innerHTML = '';

    if (listaVagas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <div class="empty-state-icon">
                        <i data-lucide="inbox"></i>
                    </div>
                    <p>Nenhuma solicitação encontrada.</p>
                </td>
            </tr>`;
        lucide.createIcons({ nodes: [tbody] });
        return;
    }

    listaVagas.slice().reverse().forEach((vaga) => {
        const row = document.createElement('tr');
        const classeStatus = vaga.status.toLowerCase().replace(" ", "-").normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        // Classe de urgência
        let urgenciaClass = 'urgencia-baixa';
        if (vaga.urgencia === 'Alta') urgenciaClass = 'urgencia-alta';
        else if (vaga.urgencia === 'Média') urgenciaClass = 'urgencia-media';

        // Determinar status atual para highlight
        const isPendente = vaga.status === 'Pendente';
        const isAndamento = vaga.status === 'Em andamento';
        const isConcluido = vaga.status === 'Concluído';

        row.innerHTML = `
            <td data-label="Data">${vaga.data}</td>
            <td data-label="Setor / Líder"><strong>${vaga.setor}</strong><br><small>${vaga.lider}</small></td>
            <td data-label="Cargo">${vaga.cargo}</td>
            <td data-label="Tipo">${vaga.tipo}</td>
            <td data-label="Urgência"><span class="${urgenciaClass}">${vaga.urgencia}</span></td>
            <td data-label="Status"><span class="status-badge ${classeStatus}">${vaga.status}</span></td>
            <td data-label="Ações">
                <button class="btn-acao btn-pendente ${isPendente ? 'current-status' : ''}" onclick="alterarStatus(${vaga.id}, 'Pendente')">
                    <i data-lucide="clock"></i> Pendente
                </button>
                <button class="btn-acao btn-andamento ${isAndamento ? 'current-status' : ''}" onclick="alterarStatus(${vaga.id}, 'Em andamento')">
                    <i data-lucide="loader"></i> Em andamento
                </button>
                <button class="btn-acao btn-concluir ${isConcluido ? 'current-status' : ''}" onclick="alterarStatus(${vaga.id}, 'Concluído')">
                    <i data-lucide="check"></i> Concluir
                </button>
                <button class="btn-acao btn-excluir" onclick="excluirVaga(${vaga.id})">
                    <i data-lucide="trash-2"></i> Excluir
                </button>
            </td>
            <td data-label="Dados">
                <button class="btn-acao btn-info" onclick="abrirModal(${vaga.id})">
                    <i data-lucide="file-text"></i> Ver Motivo
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    lucide.createIcons({ nodes: [tbody] });
}

// ===================================
// ALTERAR STATUS
// ===================================
function alterarStatus(id, novoStatus) {
    let listaVagas = JSON.parse(localStorage.getItem('vagasEmpresa')) || [];
    let vagaAlterada = null;

    listaVagas = listaVagas.map(vaga => {
        if (vaga.id === id) {
            vaga.status = novoStatus;
            vagaAlterada = vaga;
        }
        return vaga;
    });
    localStorage.setItem('vagasEmpresa', JSON.stringify(listaVagas));
    carregarVagasRH();

    // Toast notification
    if (vagaAlterada) {
        const toastTypes = {
            'Pendente': 'warning',
            'Em andamento': 'info',
            'Concluído': 'success'
        };
        showToast(
            `${vagaAlterada.cargo} — status alterado para "${novoStatus}"`,
            toastTypes[novoStatus] || 'info'
        );
    }
}

// ===================================
// EXCLUIR VAGA
// ===================================
let vagaParaExcluir = null;

function excluirVaga(id) {
    vagaParaExcluir = id;
    const modal = document.getElementById('modal-confirmacao');
    modal.classList.add('active');
    
    const content = modal.querySelector('.modal-content');
    content.classList.remove('fade-in');
    void content.offsetWidth;
    content.classList.add('fade-in');
}

function fecharModalConfirmacao() {
    document.getElementById('modal-confirmacao').classList.remove('active');
    vagaParaExcluir = null;
}

const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');
if (btnConfirmarExclusao) {
    btnConfirmarExclusao.addEventListener('click', function() {
        if (vagaParaExcluir !== null) {
            let listaVagas = JSON.parse(localStorage.getItem('vagasEmpresa')) || [];
            const vagaExcluida = listaVagas.find(v => v.id === vagaParaExcluir);
            listaVagas = listaVagas.filter(vaga => vaga.id !== vagaParaExcluir);
            localStorage.setItem('vagasEmpresa', JSON.stringify(listaVagas));
            carregarVagasRH();

            if (vagaExcluida) {
                showToast(`Solicitação "${vagaExcluida.cargo}" excluída.`, 'danger');
            }
            fecharModalConfirmacao();
        }
    });
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
        // Re-trigger animation
        const content = modal.querySelector('.modal-content');
        content.classList.remove('fade-in');
        void content.offsetWidth;
        content.classList.add('fade-in');
    }
}

function fecharModal() {
    document.getElementById('modal-justificativa').classList.remove('active');
}

window.onclick = function(event) {
    const modalJustificativa = document.getElementById('modal-justificativa');
    const modalConfirmacao = document.getElementById('modal-confirmacao');
    
    if (event.target === modalJustificativa) {
        fecharModal();
    }
    if (event.target === modalConfirmacao) {
        fecharModalConfirmacao();
    }
}

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharModal();
        fecharModalConfirmacao();
    }
});