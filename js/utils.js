// Utilitários do sistema
function formatarData(data) {
    return data.toLocaleDateString('pt-BR');
}

function formatarHora(data) {
    return data.toLocaleTimeString('pt-BR');
}

function calcularTempoTotal(entrada, saida, pausas) {
    if (!entrada || !saida) return '-';
    
    // Converter para minutos
    function timeToMinutes(timeStr) {
        const parts = timeStr.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    
    const entradaMin = timeToMinutes(entrada);
    const saidaMin = timeToMinutes(saida);
    let totalMin = saidaMin - entradaMin;
    
    // Subtrair tempo de pausas
    if (pausas && pausas.length > 0) {
        pausas.forEach(pausa => {
            if (pausa.inicio && pausa.fim) {
                const inicioMin = timeToMinutes(pausa.inicio);
                const fimMin = timeToMinutes(pausa.fim);
                totalMin -= (fimMin - inicioMin);
            }
        });
    }
    
    // Converter de volta para formato HH:MM
    const hours = Math.floor(totalMin / 60);
    const minutes = totalMin % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function mostrarMensagem(elementoId, mensagem, tipo) {
    const elemento = document.getElementById(elementoId);
    elemento.innerHTML = `<div class="${tipo === 'success' ? 'success' : 'alert'}">${mensagem}</div>`;
    
    setTimeout(() => {
        elemento.innerHTML = '';
    }, 3000);
}

function alternarVisibilidade(elementoId, mostrar) {
    const elemento = document.getElementById(elementoId);
    if (mostrar) {
        elemento.classList.remove('hidden');
    } else {
        elemento.classList.add('hidden');
    }
}