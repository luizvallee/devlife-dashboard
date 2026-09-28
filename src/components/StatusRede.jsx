import { useEffect, useState } from "react";

function StatusRede() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    function aoFicarOnline() {
      setOnline(true);
    }

    function aoFicarOffline() {
      setOnline(false);
    }

    window.addEventListener("online", aoFicarOnline);
    window.addEventListener("offline", aoFicarOffline);

    return () => {
      window.removeEventListener("online", aoFicarOnline);
      window.removeEventListener("offline", aoFicarOffline);
    };
  }, []);

  if (online) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-100 py-2 text-center text-sm font-semibold text-amber-900"
    >
      📡 Você está offline — o VibeList está usando os
      dados salvos no dispositivo.
    </div>
  );
}

export default StatusRede;