// Importar funções necessárias
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);  // 🔹 Aqui você pega a referência do Firestore

export { app, analytics, db };


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