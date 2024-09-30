import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // Adicionando estado para o papel do usuário
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Buscar o papel do usuário no Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role); // Atribuir o papel ao estado
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false); // Finaliza o carregamento após o papel ser recuperado
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole, // Adicionar o papel ao valor do contexto
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
