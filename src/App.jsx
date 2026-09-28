import { useEffect, useState } from "react";

import Header from "./components/Header.jsx";
import Card from "./components/Card.jsx";
import Footer from "./components/Footer.jsx";
import StatusRede from "./components/StatusRede.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";
import NotificationPrompt from "./components/NotificationPrompt.jsx";

import { notificarLocal } from "./notifications.js";
import { agendarSincronizacao } from "./backgroundSync.js";

const musicasIniciais = [
  {
    id: 1,
    titulo: "Cruel Summer",
    artista: "Taylor Swift",
    categoria: "Pop",
    descricao:
      "Uma música pop intensa, energética e perfeita para cantar junto.",
    cor: "#a855f7",
    favorito: false,
  },
  {
    id: 2,
    titulo: "Good Luck, Babe!",
    artista: "Chappell Roan",
    categoria: "Pop alternativo",
    descricao:
      "Uma faixa marcante sobre sentimentos, escolhas e relacionamentos.",
    cor: "#ec4899",
    favorito: false,
  },
  {
    id: 3,
    titulo: "Espresso",
    artista: "Sabrina Carpenter",
    categoria: "Pop",
    descricao:
      "Uma música divertida, leve e cheia de personalidade.",
    cor: "#f59e0b",
    favorito: false,
  },
  {
    id: 4,
    titulo: "drivers license",
    artista: "Olivia Rodrigo",
    categoria: "Pop rock",
    descricao:
      "Uma canção emocional sobre lembranças e amadurecimento.",
    cor: "#3b82f6",
    favorito: false,
  },
];

function escolherCor(categoria) {
  const cores = {
    Pop: "#a855f7",
    "Pop alternativo": "#ec4899",
    "Pop rock": "#3b82f6",
    Rock: "#ef4444",
    "Indie pop": "#14b8a6",
    "R&B": "#f97316",
    Sertanejo: "#eab308",
    Funk: "#8b5cf6",
  };

  return cores[categoria] || "#a855f7";
}

function App() {
  const [musicas, setMusicas] = useState(musicasIniciais);

  const [hora, setHora] = useState(
    new Date().toLocaleTimeString("pt-BR")
  );

  const [anuncio, setAnuncio] = useState("");

  const [formulario, setFormulario] = useState({
    titulo: "",
    artista: "",
    categoria: "",
    descricao: "",
  });

  // RELÓGIO EM TEMPO REAL
  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(new Date().toLocaleTimeString("pt-BR"));
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  // RECEBE A MENSAGEM DO BACKGROUND SYNC
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    function aoReceberMensagem(evento) {
      if (evento.data?.tipo === "SINCRONIZADO") {
        setAnuncio(
          "Sincronização em segundo plano concluída."
        );
      }
    }

    navigator.serviceWorker.addEventListener(
      "message",
      aoReceberMensagem
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "message",
        aoReceberMensagem
      );
    };
  }, []);

  function atualizarFormulario(event) {
    const { name, value } = event.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }));
  }

  // AGENDA SINCRONIZAÇÃO SE ESTIVER OFFLINE
  function avisarMudancaOffline() {
    if (!navigator.onLine) {
      agendarSincronizacao("sincronizar-musicas");

      setAnuncio(
        "Alteração salva. A sincronização ocorrerá quando a conexão voltar."
      );
    }
  }

  // ADICIONAR MÚSICA
  function adicionarMusica(event) {
    event.preventDefault();

    if (
      !formulario.titulo.trim() ||
      !formulario.artista.trim() ||
      !formulario.categoria.trim() ||
      !formulario.descricao.trim()
    ) {
      setAnuncio(
        "Preencha todos os campos antes de adicionar a música."
      );

      return;
    }

    const novaMusica = {
      id: Date.now(),
      titulo: formulario.titulo,
      artista: formulario.artista,
      categoria: formulario.categoria,
      descricao: formulario.descricao,
      cor: escolherCor(formulario.categoria),
      favorito: false,
    };

    setMusicas((atual) => [
      ...atual,
      novaMusica,
    ]);

    setFormulario({
      titulo: "",
      artista: "",
      categoria: "",
      descricao: "",
    });

    setAnuncio(
      `Música "${novaMusica.titulo}" adicionada.`
    );

    avisarMudancaOffline();
  }

  // FAVORITAR MÚSICA
  function favoritarMusica(id) {
    const musica = musicas.find(
      (item) => item.id === id
    );

    if (!musica) {
      return;
    }

    const novoEstado = !musica.favorito;

    setMusicas((atual) =>
      atual.map((item) =>
        item.id === id
          ? {
              ...item,
              favorito: novoEstado,
            }
          : item
      )
    );

    if (novoEstado) {
      setAnuncio(
        `Música "${musica.titulo}" adicionada aos favoritos.`
      );

      notificarLocal(
        "💜 Música favoritada!",
        {
          body: `${musica.titulo} — ${musica.artista}`,
        }
      );
    } else {
      setAnuncio(
        `Música "${musica.titulo}" removida dos favoritos.`
      );
    }
  }

  // EXCLUIR MÚSICA
  function excluirMusica(id) {
    const musica = musicas.find(
      (item) => item.id === id
    );

    if (!musica) {
      return;
    }

    setMusicas((atual) =>
      atual.filter(
        (item) => item.id !== id
      )
    );

    setAnuncio(
      `Música "${musica.titulo}" excluída.`
    );

    avisarMudancaOffline();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* SKIP LINK PARA ACESSIBILIDADE */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-zinc-900 focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>

      {/* CABEÇALHO */}
      <Header hora={hora} />

      {/* STATUS DA CONEXÃO */}
      <StatusRede />

      {/* INSTALAÇÃO DO PWA */}
      <InstallPrompt />

      {/* NOTIFICAÇÕES */}
      <NotificationPrompt />

      {/* REGIÃO PARA LEITORES DE TELA */}
      <div
        aria-live="polite"
        role="status"
        className="sr-only"
      >
        {anuncio}
      </div>

      <main
        id="conteudo"
        className="mx-auto max-w-7xl px-6 py-12 md:px-10"
      >
        {/* APRESENTAÇÃO */}
        <section
          id="inicio"
          aria-labelledby="titulo-principal"
          className="mb-12"
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[3px] text-purple-400">
            Seu catálogo musical
          </p>

          <h2
            id="titulo-principal"
            className="text-5xl font-bold leading-tight md:text-6xl"
          >
            Suas próximas{" "}
            <span className="text-purple-400">
              vibes favoritas.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">
            Adicione músicas, favorite suas preferidas e
            organize seu catálogo musical.
          </p>
        </section>

        {/* FORMULÁRIO */}
        <section
          id="adicionar"
          aria-labelledby="titulo-formulario"
          className="mb-14 rounded-2xl bg-zinc-900 p-6 shadow-lg md:p-8"
        >
          <h2
            id="titulo-formulario"
            className="mb-6 text-3xl font-bold"
          >
            Adicionar nova música
          </h2>

          <form
            onSubmit={adicionarMusica}
            className="grid gap-5 md:grid-cols-2"
          >
            {/* NOME DA MÚSICA */}
            <div>
              <label
                htmlFor="campo-musica"
                className="mb-2 block font-semibold text-zinc-200"
              >
                Nome da música
              </label>

              <input
                id="campo-musica"
                name="titulo"
                type="text"
                value={formulario.titulo}
                onChange={atualizarFormulario}
                placeholder="Ex.: Cruel Summer"
                className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* ARTISTA */}
            <div>
              <label
                htmlFor="campo-artista"
                className="mb-2 block font-semibold text-zinc-200"
              >
                Artista
              </label>

              <input
                id="campo-artista"
                name="artista"
                type="text"
                value={formulario.artista}
                onChange={atualizarFormulario}
                placeholder="Ex.: Taylor Swift"
                className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* GÊNERO */}
            <div>
              <label
                htmlFor="campo-genero"
                className="mb-2 block font-semibold text-zinc-200"
              >
                Gênero musical
              </label>

              <input
                id="campo-genero"
                name="categoria"
                type="text"
                value={formulario.categoria}
                onChange={atualizarFormulario}
                placeholder="Ex.: Pop"
                className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* DESCRIÇÃO */}
            <div>
              <label
                htmlFor="campo-descricao"
                className="mb-2 block font-semibold text-zinc-200"
              >
                Descrição
              </label>

              <textarea
                id="campo-descricao"
                name="descricao"
                value={formulario.descricao}
                onChange={atualizarFormulario}
                placeholder="Descreva a música..."
                rows="3"
                className="w-full resize-y rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* BOTÃO ADICIONAR */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-purple-600 px-5 py-3 font-bold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                + Adicionar música
              </button>
            </div>
          </form>
        </section>

        {/* CARDS DAS MÚSICAS */}
        <section
          id="musicas"
          aria-labelledby="titulo-musicas"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="titulo-musicas"
                className="text-3xl font-bold"
              >
                Músicas cadastradas
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {musicas.length}{" "}
                {musicas.length === 1
                  ? "música cadastrada"
                  : "músicas cadastradas"}
              </p>
            </div>

            <p className="text-sm text-zinc-400">
              {
                musicas.filter(
                  (musica) => musica.favorito
                ).length
              }{" "}
              favoritas 💜
            </p>
          </div>

          {musicas.length === 0 ? (
            <p className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 text-center text-zinc-300">
              Nenhuma música cadastrada no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {musicas.map((musica) => (
                <Card
                  key={musica.id}
                  titulo={musica.titulo}
                  artista={musica.artista}
                  categoria={musica.categoria}
                  descricao={musica.descricao}
                  cor={musica.cor}
                  favorito={musica.favorito}
                  onFavoritar={() =>
                    favoritarMusica(
                      musica.id
                    )
                  }
                  onExcluir={() =>
                    excluirMusica(
                      musica.id
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;