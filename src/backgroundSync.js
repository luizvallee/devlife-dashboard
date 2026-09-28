export function suportaBackgroundSync() {
  return (
    "serviceWorker" in navigator &&
    "SyncManager" in window
  );
}

export async function agendarSincronizacao(
  tag = "sincronizar-musicas"
) {
  if (!suportaBackgroundSync()) {
    console.warn(
      "Background Sync não suportado neste navegador — os dados continuam disponíveis localmente."
    );

    return false;
  }

  try {
    const registro =
      await navigator.serviceWorker.ready;

    await registro.sync.register(tag);

    console.log(
      `🔄 Sincronização "${tag}" agendada — será executada quando a rede voltar.`
    );

    return true;
  } catch (erro) {
    console.error(
      "Falha ao agendar Background Sync:",
      erro
    );

    return false;
  }
}