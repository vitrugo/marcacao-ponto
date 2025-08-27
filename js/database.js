// Configuração do Firebase - SUBSTITUA com suas credenciais
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO_ID",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variáveis globais
let funcionarios = [];
let registrosPonto = [];

// Funções de banco de dados
async function carregarDados() {
    try {
        // Carregar funcionários
        const funcionariosSnapshot = await db.collection("funcionarios").get();
        funcionarios = funcionariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Carregar registros de ponto
        const registrosSnapshot = await db.collection("registrosPonto").get();
        registrosPonto = registrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        carregarFuncionarios();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

async function cadastrarFuncionario(nome, id) {
    try {
        // Salvar no Firebase
        await db.collection("funcionarios").doc(id).set({
            nome: nome,
            dataCadastro: new Date().toISOString()
        });
        
        // Atualizar lista local
        funcionarios.push({ id, nome });
        
        return true;
    } catch (error) {
        console.error("Erro ao cadastrar funcionário:", error);
        return false;
    }
}

async function registrarPonto(registro) {
    try {
        // Salvar no Firebase
        const docRef = await db.collection("registrosPonto").add(registro);
        registro.id = docRef.id;
        
        // Atualizar lista local
        registrosPonto.push(registro);
        
        return true;
    } catch (error) {
        console.error("Erro ao registrar ponto:", error);
        return false;
    }
}

async function atualizarRegistroPonto(registroId, dados) {
    try {
        // Atualizar no Firebase
        await db.collection("registrosPonto").doc(registroId).update(dados);
        
        // Atualizar lista local
        const index = registrosPonto.findIndex(r => r.id === registroId);
        if (index !== -1) {
            registrosPonto[index] = { ...registrosPonto[index], ...dados };
        }
        
        return true;
    } catch (error) {
        console.error("Erro ao atualizar registro:", error);
        return false;
    }
}

async function carregarRegistrosPorFuncionario(funcionarioId) {
    try {
        const registrosSnapshot = await db.collection("registrosPonto")
            .where("funcionarioId", "==", funcionarioId)
            .get();
            
        return registrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Erro ao carregar registros:", error);
        return [];
    }
}