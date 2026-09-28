import { useEffect, useState } from "react";

function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    function aoPoderInstalar(evento) {
      evento.preventDefault();

      setPromptEvent(evento);
      setVisivel(true);
    }

    window.addEventListener(
      "beforeinstallprompt",
      aoPoderInstalar
    );

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        aoPoderInstalar
      );
  }, []);

  async function instalar() {
    if (!promptEvent) {
      return;
    }

    promptEvent.prompt();

    await promptEvent.userChoice;

    setPromptEvent(null);
    setVisivel(false);
  }

  if (!visivel) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-purple-700 px-6 py-3 text-white">
      <div className="flex items-center gap-3">
        <img
          src="/icons/icon-192.png"
          alt=""
          className="h-8 w-8 rounded-lg"
        />

        <p className="text-sm font-medium">
          Instale o VibeList no seu dispositivo e use até
          mesmo offline.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={instalar}
          className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-purple-800 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-700"
        >
          Instalar
        </button>

        <button
          type="button"
          onClick={() => setVisivel(false)}
          aria-label="Fechar aviso de instalação"
          className="rounded px-2 py-1 text-purple-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default InstallPrompt;