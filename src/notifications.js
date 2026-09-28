const VAPID_PUBLIC_KEY = "BD50E8SFOMStfcGpiCbtHudiMcgJa05s11KmWtuvwfq10NKdHZrWlELxSV1EY7DdUVHX9x7TJpe5UdfiixzVKIM";

function urlBase64ToUint8Array(base64String) {
  const padding =
    "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);

  return Uint8Array.from(
    [...rawData].map((c) => c.charCodeAt(0))
  );
}

export function suportaNotificacoes() {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator
  );
}

export async function ativarNotificacoes() {
  if (!suportaNotificacoes()) {
    return {
      ok: false,
      motivo: "sem-suporte",
    };
  }

  const permissao =
    await Notification.requestPermission();

  if (permissao !== "granted") {
    return {
      ok: false,
      motivo: "negada",
    };
  }

  const registro =
    await navigator.serviceWorker.ready;

  try {
    let subscription =
      await registro.pushManager.getSubscription();

    if (!subscription) {
      subscription =
        await registro.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(
              VAPID_PUBLIC_KEY
            ),
        });
    }

    console.log(
      "📬 Inscrição de push criada:",
      subscription.endpoint
    );

    return {
      ok: true,
      subscription,
    };
  } catch (erro) {
    console.warn(
      "⚠️ Não foi possível criar a inscrição de push:",
      erro.message
    );

    return {
      ok: false,
      motivo: "subscribe-falhou",
      erro,
    };
  }
}

export async function notificarLocal(
  titulo,
  opcoes = {}
) {
  if (
    !suportaNotificacoes() ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  const registro =
    await navigator.serviceWorker.ready;

  await registro.showNotification(titulo, {
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    ...opcoes,
  });
}