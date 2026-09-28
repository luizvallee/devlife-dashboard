import { useEffect, useState } from "react";

import {
  suportaNotificacoes,
  ativarNotificacoes,
  notificarLocal,
} from "../notifications.js";

function NotificationPrompt() {
  const [permissao, setPermissao] =
    useState(
      suportaNotificacoes()
        ? Notification.permission
        : "unsupported"
    );

  const [carregando, setCarregando] =
    useState(false);

  useEffect(() => {
    if (permissao === "granted") {
      ativarNotificacoes().catch((erro) =>
        console.warn(
          "Inscrição de push adiada:",
          erro
        )
      );
    }
  }, [permissao]);

  async function handleAtivar() {
    setCarregando(true);

    const resultado =
      await ativarNotificacoes();

    setPermissao(Notification.permission);
    setCarregando(false);

    if (resultado.ok) {
      notificarLocal(
        "VibeList 🎵",
        {
          body: "Notificações ativadas! Vamos avisar sobre suas músicas favoritas.",
        }
      );
    }
  }

  if (
    permissao === "unsupported" ||
    permissao === "denied"
  ) {
    return null;
  }

  if (permissao === "granted") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-800 px-6 py-2 text-sm text-zinc-200">
        <span>
          🔔 Notificações ativadas.
        </span>

        <button
          type="button"
          onClick={() =>
            notificarLocal(
              "VibeList 🎵",
              {
                body: "Esta é uma notificação de teste 🚀",
              }
            )
          }
          className="rounded px-1 text-xs font-semibold underline decoration-dotted hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Testar notificação
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-800 px-6 py-3 text-zinc-200">
      <p className="text-sm">
        🔔 Quer receber notificações do VibeList?
      </p>

      <button
        type="button"
        onClick={handleAtivar}
        disabled={carregando}
        className="rounded-lg bg-purple-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-zinc-800"
      >
        {carregando
          ? "Ativando…"
          : "Ativar notificações"}
      </button>
    </div>
  );
}

export default NotificationPrompt;