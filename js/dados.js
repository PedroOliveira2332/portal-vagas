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
