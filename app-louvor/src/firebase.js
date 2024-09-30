import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAi9RL94FpNAhpTV2UOGQvP8dFOrcqvZzc",
  authDomain: "app-louvor-f1555.firebaseapp.com",
  projectId: "app-louvor-f1555",
  storageBucket: "app-louvor-f1555.appspot.com",
  messagingSenderId: "248575002353",
  appId: "1:248575002353:web:fdcdbf01f29785d757cb50"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando os serviços do Firebase
const auth = getAuth(app);
const storage = getStorage(app);

// Inicializando o Firestore com persistência offline
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

export { auth, db, storage };
