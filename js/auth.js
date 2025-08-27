// Sistema de autenticação e controle de acesso
let usuarioLogado = null;
let tipoUsuario = null;

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    
    const tabIndex = tab === 'gestor' ? 1 : 2;
    document.querySelector(`.tab:nth-child(${tabIndex})`).classList.add('active');
    document.getElementById(`${tab}Login`).classList.add('active');
}

async function fazerLogin(tipo) {
    if (tipo === 'gestor') {
        const user = document.getElementById('gestorUser').value;
        const password = document.getElementById('gestorPassword').value;
        
        if (user === 'admin' && password === 'admin123') {
            usuarioLogado = { nome: 'Gestor', id: 'admin' };
            tipoUsuario = 'gestor';
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            localStorage.setItem('tipoUsuario', tipoUsuario);
            entrarNoSistema();
        } else {
            alert('Usuário ou senha incorretos!');
        }
    } else {
        const id = document.getElementById('funcionarioID').value;
        const nome = document.getElementById('funcionarioNome').value;
        
        if (!id || !nome) {
            alert('Preencha todos os campos!');
            return;
        }
        
        // Verificar se funcionário existe
        const funcionario = funcionarios.find(f => f.id === id && f.nome === nome);
        
        if (!funcionario) {
            alert('Funcionário não encontrado! Verifique o ID e nome.');
            return;
        }
        
        usuarioLogado = funcionario;
        tipoUsuario = 'funcionario';
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
        localStorage.setItem('tipoUsuario', tipoUsuario);
        entrarNoSistema();
    }
}

function entrarNoSistema() {
    alternarVisibilidade('loginSection', false);
    
    if (tipoUsuario === 'gestor') {
        alternarVisibilidade('gestorArea', true);
        carregarRegistros();
    } else {
        alternarVisibilidade('funcionarioArea', true);
        document.getElementById('nomeFuncionarioLogado').textContent = usuarioLogado.nome;
        atualizarStatus();
        carregarMeusRegistros();
    }
}

function sair() {
    usuarioLogado = null;
    tipoUsuario = null;
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('tipoUsuario');
    
    alternarVisibilidade('gestorArea', false);
    alternarVisibilidade('funcionarioArea', false);
    alternarVisibilidade('loginSection', true);
}

function verificarLoginSalvo() {
    const savedUser = localStorage.getItem('usuarioLogado');
    const savedType = localStorage.getItem('tipoUsuario');
    
    if (savedUser && savedType) {
        usuarioLogado = JSON.parse(savedUser);
        tipoUsuario = savedType;
        entrarNoSistema();
    }
}