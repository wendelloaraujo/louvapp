import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Button } from 'react-bootstrap';

function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Você saiu da sua conta.');
    } catch (error) {
      alert(error.message);
    }
  };

  return <Button variant="primary" type="submit" className="mt-3" onClick={handleLogout}>Sair</Button>;
}

export default Logout;
