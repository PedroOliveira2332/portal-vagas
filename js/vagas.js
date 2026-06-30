// ===================================
// FORMULÁRIO DO LÍDER (Abertura de vaga)
// ===================================
document.getElementById('vaga-form').addEventListener('submit', function (e) {
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

        // Determina o status atual para destaque
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

    // Exibe notificação na tela
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
function excluirVaga(id) {
    if (confirm("Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita.")) {
        let listaVagas = JSON.parse(localStorage.getItem('vagasEmpresa')) || [];
        const vagaExcluida = listaVagas.find(v => v.id === id);
        listaVagas = listaVagas.filter(vaga => vaga.id !== id);
        localStorage.setItem('vagasEmpresa', JSON.stringify(listaVagas));
        carregarVagasRH();

        if (vagaExcluida) {
            showToast(`Solicitação "${vagaExcluida.cargo}" excluída.`, 'danger');
        }
    }
}
