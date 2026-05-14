let isRhLoggedIn = false;

// Alternar vistas
function switchView(viewName) {
    if (viewName === 'rh' && !isRhLoggedIn) {
        viewName = 'login';
    }

    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.getElementById(`view-${viewName}`).classList.add('active');

    if (viewName === 'rh') {
        carregarVagasRH();
    }
}

// Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === '1234') {
        isRhLoggedIn = true;
        document.getElementById('login-error').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        switchView('rh');
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

function logoutRH() {
    isRhLoggedIn = false;
    switchView('lider');
}

// Submissão do Formulário (Líder)
document.getElementById('vaga-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const novaSolicitacao = {
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        lider: document.getElementById('lider').value,
        setor: document.getElementById('setor').value,
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
    this.reset();
});

function mostrarSucesso() {
    const msg = document.getElementById('success-msg');
    msg.style.display = 'block';
    setTimeout(() => {
        msg.style.display = 'none';
    }, 4000);
}

// Carregar tabela do RH
function carregarVagasRH() {
    const listaVagas = JSON.parse(localStorage.getItem('vagasEmpresa')) || [];
    const tbody = document.getElementById('tabela-vagas');
    
    tbody.innerHTML = '';

    if (listaVagas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem; color: #64748b;">Nenhuma solicitação encontrada.</td></tr>'; // Atualizado para colspan=8
        return;
    }

    listaVagas.slice().reverse().forEach((vaga) => {
        const row = document.createElement('tr');
        const classeStatus = vaga.status.toLowerCase().replace(" ", "-").normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        // MODIFICADO: MUDAMOS O BOTÃO "VER MOTIVO" PARA A NOVA COLUNA "DADOS"
        row.innerHTML = `
            <td>${vaga.data}</td>
            <td><strong>${vaga.setor}</strong><br><small>${vaga.lider}</small></td>
            <td>${vaga.cargo}</td>
            <td>${vaga.tipo}</td>
            <td><span style="color: ${vaga.urgencia === 'Alta' ? '#dc2626' : 'inherit'}">${vaga.urgencia}</span></td>
            <td><span class="status-badge ${classeStatus}">${vaga.status}</span></td>
            <td>
                <button class="btn-acao btn-pendente" onclick="alterarStatus(${vaga.id}, 'Pendente')">Pendente</button>
                <button class="btn-acao btn-andamento" onclick="alterarStatus(${vaga.id}, 'Em andamento')">Em andamento</button>
                <button class="btn-acao btn-concluir" onclick="alterarStatus(${vaga.id}, 'Concluído')">Concluir</button>
                <button class="btn-acao btn-excluir" onclick="excluirVaga(${vaga.id})">Excluir</button>
            </td>
            <td>
                <button class="btn-acao btn-info" onclick="abrirModal(${vaga.id})">Ver Motivo</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Alterar Status
function alterarStatus(id, novoStatus) {
    let listaVagas = JSON.parse(localStorage.getItem('vagasEmpresa')) || [];
    listaVagas = listaVagas.map(vaga => {
        if (vaga.id === id) vaga.status = novoStatus;
        return vaga;
    });
    localStorage.setItem('vagasEmpresa', JSON.stringify(listaVagas));
    carregarVagasRH();
}

// Excluir
function excluirVaga(id) {
    if (confirm("Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita.")) {
        let listaVagas = JSON.parse(localStorage.getItem('vagasEmpresa')) || [];
        listaVagas = listaVagas.filter(vaga => vaga.id !== id);
        localStorage.setItem('vagasEmpresa', JSON.stringify(listaVagas));
        carregarVagasRH();
    }
}

// --- FUNÇÕES DO MODAL --- //

function abrirModal(id) {
    const listaVagas = JSON.parse(localStorage.getItem('vagasEmpresa')) || [];
    const vaga = listaVagas.find(v => v.id === id);
    
    if (vaga) {
        document.getElementById('texto-modal-justificativa').textContent = vaga.justificativa;
        document.getElementById('modal-justificativa').classList.add('active');
    }
}

function fecharModal() {
    document.getElementById('modal-justificativa').classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-justificativa');
    if (event.target === modal) {
        fecharModal();
    }
}

// --- FUNCIONALIDADE: MOSTRAR / OCULTAR SENHA --- //

const btnMostrarSenha = document.getElementById('btn-mostrar-senha');
const inputSenha = document.getElementById('password');

if (btnMostrarSenha && inputSenha) {
    btnMostrarSenha.addEventListener('click', function() {
        const tipoAtual = inputSenha.getAttribute('type');

        if (tipoAtual === 'password') {
            inputSenha.setAttribute('type', 'text');
            this.textContent = 'Ocultar'; 
        } else {
            inputSenha.setAttribute('type', 'password');
            this.textContent = 'Mostrar'; 
        }
    });
}