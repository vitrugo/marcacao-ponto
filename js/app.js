// Aplicação principal
function init() {
    atualizarRelogio();
    carregarDados();
    verificarLoginSalvo();
}

function atualizarRelogio() {
    const now = new Date();
    if (document.getElementById('currentTime')) {
        document.getElementById('currentTime').textContent = 
            formatarData(now) + ' | ' + formatarHora(now);
    }
    setTimeout(atualizarRelogio, 1000);
}

function carregarFuncionarios() {
    const selectFiltro = document.getElementById('filtroFuncionario');
    
    if (selectFiltro) {
        // Limpar select
        selectFiltro.innerHTML = '<option value="">Todos os funcionários</option>';
        
        // Adicionar funcionários
        funcionarios.forEach(func => {
            const optionFiltro = document.createElement('option');
            optionFiltro.value = func.id;
            optionFiltro.textContent = `${func.nome} (${func.id})`;
            selectFiltro.appendChild(optionFiltro);
        });
    }
}

async function cadastrarFuncionario() {
    const nome = document.getElementById('nomeFuncionario').value.trim();
    const id = document.getElementById('idFuncionario').value.trim();
    
    if (!nome || !id) {
        mostrarMensagem('msgCadastro', 'Preencha todos os campos!', 'error');
        return;
    }
    
    if (funcionarios.some(f => f.id === id)) {
        mostrarMensagem('msgCadastro', 'Já existe um funcionário com este ID!', 'error');
        return;
    }
    
    const sucesso = await cadastrarFuncionario(nome, id);
    
    if (sucesso) {
        mostrarMensagem('msgCadastro', 'Funcionário cadastrado com sucesso!', 'success');
        document.getElementById('nomeFuncionario').value = '';
        document.getElementById('idFuncionario').value = '';
        carregarFuncionarios();
    } else {
        mostrarMensagem('msgCadastro', 'Erro ao cadastrar funcionário.', 'error');
    }
}

function atualizarStatus() {
    if (tipoUsuario !== 'funcionario') return;
    
    const funcionarioId = usuarioLogado.id;
    const hoje = formatarData(new Date());
    const registrosHoje = registrosPonto.filter(r => 
        r.funcionarioId === funcionarioId && r.data === hoje);
    
    let status = '';
    let classeStatus = '';
    
    if (registrosHoje.length > 0) {
        const ultimoRegistro = registrosHoje[registrosHoje.length - 1];
        
        if (ultimoRegistro.saida) {
            status = 'Fora de expediente';
            classeStatus = 'status-fora';
        } else if (ultimoRegistro.retornoPausa) {
            status = 'Trabalhando';
            classeStatus = 'status-trabalhando';
        } else if (ultimoRegistro.inicioPausa) {
            status = 'Em pausa';
            classeStatus = 'status-pausa';
        } else if (ultimoRegistro.entrada) {
            status = 'Trabalhando';
            classeStatus = 'status-trabalhando';
        }
    } else {
        status = 'Fora de expediente';
        classeStatus = 'status-fora';
    }
    
    const elementoStatus = document.getElementById('status');
    elementoStatus.textContent = status;
    elementoStatus.className = `status ${classeStatus}`;
}

// ... (outras funções principais)

// Inicializar a aplicação quando a página carregar
window.onload = init;