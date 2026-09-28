const CACHE_NAME = "vibelist-cache-v1";

const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((nomes) =>
        Promise.all(
          nomes
            .filter((nome) => nome !== CACHE_NAME)
            .map((nome) => caches.delete(nome))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request).then((respostaEmCache) => {
      const buscaNaRede = fetch(request)
        .then((respostaDaRede) => {
          if (
            respostaDaRede &&
            respostaDaRede.status === 200
          ) {
            const copia = respostaDaRede.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copia);
            });
          }

          return respostaDaRede;
        })
        .catch(() => respostaEmCache);

      return respostaEmCache || buscaNaRede;
    })
  );
});
// BACKGROUND SYNC
self.addEventListener("sync", (event) => {
  if (event.tag !== "sincronizar-musicas") {
    return;
  }

  event.waitUntil(
    self.clients.matchAll().then((clientes) => {
      clientes.forEach((cliente) => {
        cliente.postMessage({
          tipo: "SINCRONIZADO",
          em: new Date().toISOString(),
        });
      });
    })
  );
});

// PUSH
self.addEventListener("push", (event) => {
  const dados = event.data
    ? event.data.json()
    : {
        titulo: "VibeList 🎵",
        corpo: "Você tem uma novidade musical.",
      };

  event.waitUntil(
    self.registration.showNotification(
      dados.titulo,
      {
        body: dados.corpo,
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
      }
    )
  );
});