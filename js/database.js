// database.js

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDb08uNQvXBoiTBt-qdHYEUgVv9woZxu0k",
    authDomain: "liberdadenews-ee35e.firebaseapp.com",
    projectId: "liberdadenews-ee35e",
    storageBucket: "liberdadenews-ee35e.appspot.com",
    messagingSenderId: "986630956093",
    appId: "1:986630956093:web:03197b27c2b4a0a5777654",
    measurementId: "G-WJSZZ7E8WY"
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
        const funcionariosSnapshot = await db.collection("funcionarios").get();
        funcionarios = funcionariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const registrosSnapshot = await db.collection("registrosPonto").get();
        registrosPonto = registrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        carregarFuncionarios();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

async function cadastrarFuncionarioNoBanco(nome, id) {
    try {
        await db.collection("funcionarios").doc(id).set({
            nome: nome,
            dataCadastro: new Date().toISOString()
        });

        funcionarios.push({ id, nome });
        return true;
    } catch (error) {
        console.error("Erro ao cadastrar funcionário:", error);
        return false;
    }
}

async function registrarPonto(registro) {
    try {
        // USAR OS MESMOS NOMES DO FIREBASE
        const registroPadronizado = {
            funcionarioId: registro.funcionarioId, // ✅
            tipo: registro.tipo, // ✅
            data: registro.data, // ✅ AGORA CORRETO
            hora_entrada: registro.hora_entrada, // ✅ AGORA CORRETO  
            hora_saida: registro.hora_saida // ✅ AGORA CORRETO
        };
        
        const docRef = await db.collection("registrosPonto").add(registroPadronizado);
        return true;
    } catch (error) {
        console.error("Erro ao registrar ponto:", error);
        return false;
    }
}


async function atualizarRegistroPonto(registroId, dados) {
    try {
        await db.collection("registrosPonto").doc(registroId).update(dados);

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
