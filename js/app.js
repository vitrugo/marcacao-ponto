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
    
    // ✅ CORREÇÃO: Usar o nome correto da função do database.js
    const sucesso = await cadastrarFuncionarioNoBanco(nome, id);
    
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

// ✅ FUNÇÕES QUE ESTAVAM FALTANDO:

async function carregarMeusRegistros() {
    try {
        if (tipoUsuario !== 'funcionario') return;
        
        const funcionarioId = usuarioLogado.id;
        const registros = await carregarRegistrosPorFuncionario(funcionarioId);
        
        // Aqui você precisa implementar a lógica para exibir os registros
        // na tabela com id "meusRegistros"
        console.log("Meus registros:", registros);
        
        // Exemplo básico de exibição (você precisa adaptar)
        const tbody = document.getElementById('meusRegistros');
        if (tbody) {
            tbody.innerHTML = ''; // Limpar tabela
            
            registros.forEach(registro => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatarData(new Date(registro.data))}</td>
                    <td>${registro.hora_entrada ? formatarHora(registro.hora_entrada.toDate()) : '-'}</td>
                    <td>${registro.hora_saida ? formatarHora(registro.hora_saida.toDate()) : '-'}</td>
                    <td>-</td>
                    <td>-</td>
                `;
                tbody.appendChild(row);
            });
        }
        
    } catch (error) {
        console.error("Erro ao carregar meus registros:", error);
    }
}

async function marcarEntrada() {
    try {
        if (tipoUsuario !== 'funcionario') return;
        
        const registro = {
            funcionarioId: usuarioLogado.id,
            tipo: "entrada",
            data: new Date().toISOString().split('T')[0],
            hora_entrada: new Date(),
            hora_saida: null
        };
        
        const sucesso = await registrarPonto(registro);
        
        if (sucesso) {
            mostrarMensagem('msgPonto', 'Entrada registrada com sucesso!', 'success');
            atualizarStatus();
            carregarMeusRegistros();
        } else {
            mostrarMensagem('msgPonto', 'Erro ao registrar entrada.', 'error');
        }
    } catch (error) {
        console.error("Erro ao marcar entrada:", error);
        mostrarMensagem('msgPonto', 'Erro ao registrar entrada.', 'error');
    }
}

async function marcarSaida() {
    try {
        if (tipoUsuario !== 'funcionario') return;
        
        const registro = {
            funcionarioId: usuarioLogado.id,
            tipo: "saida",
            data: new Date().toISOString().split('T')[0],
            hora_entrada: null,
            hora_saida: new Date()
        };
        
        const sucesso = await registrarPonto(registro);
        
        if (sucesso) {
            mostrarMensagem('msgPonto', 'Saída registrada com sucesso!', 'success');
            atualizarStatus();
            carregarMeusRegistros();
        } else {
            mostrarMensagem('msgPonto', 'Erro ao registrar saída.', 'error');
        }
    } catch (error) {
        console.error("Erro ao marcar saída:", error);
        mostrarMensagem('msgPonto', 'Erro ao registrar saída.', 'error');
    }
}

async function marcarPausa() {
    try {
        mostrarMensagem('msgPonto', 'Funcionalidade de pausa em desenvolvimento', 'info');
    } catch (error) {
        console.error("Erro ao marcar pausa:", error);
        mostrarMensagem('msgPonto', 'Erro ao registrar pausa.', 'error');
    }
}

async function marcarRetorno() {
    try {
        mostrarMensagem('msgPonto', 'Funcionalidade de retorno em desenvolvimento', 'info');
    } catch (error) {
        console.error("Erro ao marcar retorno:", error);
        mostrarMensagem('msgPonto', 'Erro ao registrar retorno.', 'error');
    }
}

// Inicializar a aplicação quando a página carregar
window.onload = init;