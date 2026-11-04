/* ==========================================================================
   APP — cabeçalho, rotas por hash e interações comuns a todas as páginas.
   ========================================================================== */

(function () {
  const L = window.LOJA;
  const { sacola, produto, variante, varianteId, rotuloVariante, linkWhatsApp } = window.Loja;
  const { esc, Icone } = window.UI;
  const P = window.Paginas;
  const $ = (id) => document.getElementById(id);

  function montarCabecalho() {
    $("topo").innerHTML = `
      <div class="recipiente topo__linha">
        <a class="marca" href="#/" aria-label="${esc(L.marca.nome)}, página inicial">
          <img src="${esc(L.marca.logo)}" alt="" width="44" height="44" />
          <span><strong>${esc(L.marca.nome)}</strong><small>${esc(L.marca.subtitulo)}</small></span>
        </a>
        <nav class="navegacao" aria-label="Principal">
          <a href="#/" data-rota="inicio">Início</a>
          <a href="#/catalogo" data-rota="catalogo">Catálogo</a>
          <a href="#/catalogo?promo=1" data-rota="promocoes">Promoções</a>
          <a href="#/contato" data-rota="contato">Contato</a>
        </nav>
        <div class="topo__icones">
          <a href="#/catalogo?foco=busca" aria-label="Buscar produtos">${Icone.busca}</a>
          <a class="so-largo" href="${esc(linkWhatsApp("Olá! Vim pelo site e tenho uma dúvida."))}" target="_blank" rel="noopener" aria-label="WhatsApp da loja">${Icone.whatsapp}</a>
          <a class="so-largo" href="${esc(L.contato.instagram)}" target="_blank" rel="noopener" aria-label="Instagram da loja">${Icone.instagram}</a>
          <a class="topo__sacola" href="#/carrinho" id="link-sacola">${Icone.sacola}<span id="contador" hidden></span></a>
        </div>
      </div>`;
    $("aviso-prototipo").hidden = !L.prototipo;
    $("rodape-texto").textContent = `${L.marca.nome} ${L.marca.subtitulo}`;
    $("rodape-whats").href = linkWhatsApp("Olá! Vim pelo site e tenho uma dúvida.");
    $("rodape-insta").href = L.contato.instagram;
  }

  function atualizarContador() {
    const n = sacola.quantidade();
    $("contador").hidden = n === 0;
    $("contador").textContent = n;
    $("link-sacola").setAttribute("aria-label", n ? `Carrinho com ${n} ${n === 1 ? "item" : "itens"}` : "Carrinho vazio");
  }

  /* ---------- Aviso rápido ---------- */
  let temporizador;
  function avisar(texto) {
    const t = $("aviso");
    t.innerHTML = `<span>${esc(texto)}</span><a href="#/carrinho">Ver carrinho</a>`;
    t.classList.add("visivel");
    clearTimeout(temporizador);
    temporizador = setTimeout(() => t.classList.remove("visivel"), 4000);
  }

  /* ---------- Rotas ---------- */
  function rotear() {
    if ($("janela-opcoes").open) $("janela-opcoes").close();
    const [caminho, consulta] = (location.hash.slice(1) || "/").split("?");
    const params = new URLSearchParams(consulta || "");
    const partes = caminho.split("/").filter(Boolean);
    let titulo;
    let ativa = "";

    if (partes[0] === "catalogo") {
      titulo = P.Catalogo(params);
      ativa = params.get("promo") === "1" ? "promocoes" : "catalogo";
    } else if (partes[0] === "produto") {
      titulo = P.Produto(decodeURIComponent(partes[1] || ""));
      ativa = "catalogo";
    } else if (partes[0] === "carrinho") {
      titulo = P.Sacola();
    } else if (partes[0] === "contato") {
      titulo = P.Contato();
      ativa = "contato";
    } else {
      titulo = P.Inicio();
      ativa = "inicio";
    }

    document.title = `${titulo} | ${L.marca.nome}`;
    document.querySelectorAll("[data-rota]").forEach((a) => {
      if (a.dataset.rota === ativa) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
    // Leitor de tela e teclado começam na página nova, salvo se a busca pediu o foco
    if (params.get("foco") !== "busca") $("conteudo").focus({ preventScroll: true });
  }

  /* ---------- Interações comuns ---------- */
  const janela = $("janela-opcoes");

  document.addEventListener("click", (e) => {
    const abrir = e.target.closest("[data-abrir-opcoes]");
    // Ctrl/Cmd + clique continua abrindo a página da peça em outra aba
    if (abrir && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      const peca = produto(abrir.dataset.abrirOpcoes);
      const conteudo = $("janela-conteudo");
      conteudo.innerHTML = UI.ConteudoOpcoes(peca);
      UI.ligarSeletor(conteudo, peca, (x, qtd) => {
        sacola.adicionar(peca.id, varianteId(x), qtd);
        janela.close();
        avisar(`${peca.nome} (${rotuloVariante(x)}) adicionado ao carrinho`);
      });
      janela.showModal();
      return;
    }
    const b = e.target.closest("[data-comprar]");
    if (!b) return;
    const p = produto(b.dataset.comprar);
    const x = variante(p, b.dataset.vid);
    sacola.adicionar(p.id, b.dataset.vid);
    avisar(`${p.nome} (${rotuloVariante(x)}) adicionado ao carrinho`);
  });

  janela.addEventListener("click", (e) => {
    if (e.target === janela || e.target.closest("[data-fechar]")) janela.close();
  });

  // Atualiza "1/2" e as bolinhas enquanto a foto do card desliza
  document.addEventListener(
    "scroll",
    (e) => {
      const trilho = e.target;
      if (!trilho.matches?.("[data-trilho]")) return;
      const i = Math.round(trilho.scrollLeft / trilho.clientWidth);
      const caixa = trilho.parentElement;
      const contador = caixa.querySelector(".fotos__contador");
      if (contador) contador.textContent = `${i + 1}/${contador.dataset.total}`;
      caixa.querySelectorAll(".fotos__pontos i").forEach((o, n) => o.classList.toggle("ativo", n === i));
    },
    true
  );

  const voltar = $("voltar-topo");
  voltar.innerHTML = Icone.topo;
  voltar.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => voltar.classList.toggle("visivel", window.scrollY > 600), { passive: true });

  window.App = { avisar };

  montarCabecalho();
  atualizarContador();
  sacola.aoMudar(atualizarContador);
  window.addEventListener("hashchange", rotear);
  rotear();
})();
