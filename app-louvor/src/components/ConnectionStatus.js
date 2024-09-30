import React, { useEffect, useState } from 'react';

function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div>
      {!isOnline && (
        <p style={{ color: 'red', textAlign: 'center' }}>
          Você está offline! Verifique sua conexão de Internet.
        </p>
      )}
    </div>
  );
}

export default ConnectionStatus;
