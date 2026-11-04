/* ==========================================================================
   PÁGINAS — cada função recebe os parâmetros da rota e preenche o <main>.
   ========================================================================== */

(function () {
  const L = window.LOJA;
  const { dinheiro, produto, varianteId, cores, filtrar, sacola, rotuloVariante, linkWhatsApp, mensagemPedido } = window.Loja;
  const { esc, Icone, SeletorOpcoes, ligarSeletor, Grade, CirculosCategoria, Vazio } = window.UI;
  const main = () => document.getElementById("conteudo");

  /* ---------- Início ---------- */
  function Inicio() {
    const promocoes = filtrar({ promo: true, ordem: "desconto" }).slice(0, 4);
    const novidades = L.produtos.filter((p) => p.novo).slice(0, 4);
    main().innerHTML = `
      <section class="capa">
        <img class="capa__foto" src="assets/hero.jpg" alt="Choker de cordão com pingente dourado, brinco dourado e anel turquesa" fetchpriority="high" />
        <div class="capa__texto">
          <h1>Detalhes que fazem a diferença.</h1>
          <p>Brincos, colares, pulseiras, anéis e conjuntos escolhidos pela Thayná. Você monta o carrinho aqui e finaliza pelo WhatsApp.</p>
          <div class="acoes">
            <a class="botao botao--claro" href="#/catalogo">Ver catálogo</a>
            <a class="botao botao--contorno-claro" href="#/catalogo?promo=1">Ver promoções</a>
          </div>
        </div>
      </section>

      <nav class="faixa-circulos" aria-label="Categorias">
        ${CirculosCategoria(L.categorias)}
      </nav>

      <section class="secao recipiente" aria-labelledby="t-promo">
        <header class="secao__topo">
          <h2 id="t-promo">Em promoção</h2>
          <a class="link" href="#/catalogo?promo=1">Ver todas</a>
        </header>
        ${Grade(promocoes)}
      </section>

      <section class="secao recipiente" aria-labelledby="t-novo">
        <header class="secao__topo">
          <h2 id="t-novo">Chegou agora</h2>
          <a class="link" href="#/catalogo?ordem=novidades">Ver catálogo</a>
        </header>
        ${Grade(novidades)}
      </section>

      <section class="como" aria-labelledby="t-como">
        <div class="recipiente">
          <h2 id="t-como">Como comprar</h2>
          <ol class="passos">
            <li><strong>Monte o carrinho</strong><span>Escolha cor e tamanho de cada peça.</span></li>
            <li><strong>Envie pelo WhatsApp</strong><span>O site escreve a mensagem com a sua lista.</span></li>
            <li><strong>A loja confirma</strong><span>Confere o estoque e soma o frete.</span></li>
            <li><strong>Pague pelo link</strong><span>Pix ou cartão, na página do provedor de pagamento.</span></li>
          </ol>
        </div>
      </section>

      <section class="redes recipiente" aria-label="Redes da loja">
        <a href="${esc(L.contato.instagram)}" target="_blank" rel="noopener">${Icone.instagram}<span>Novidades no Instagram<small>${esc(L.contato.instagramUser)}</small></span></a>
        <a href="${esc(linkWhatsApp("Olá! Vim pelo site e tenho uma dúvida."))}" target="_blank" rel="noopener">${Icone.whatsapp}<span>Tire dúvidas no WhatsApp<small>${esc(L.contato.whatsappExibicao)}</small></span></a>
      </section>`;
    return "Acessórios";
  }

  /* ---------- Catálogo ---------- */
  const preferenciaDetalhes = { visiveis: false };

  function Catalogo(params) {
    const estado = {
      q: params.get("q") || "",
      cat: params.get("cat") || "",
      cor: params.get("cor") || "",
      promo: params.get("promo") === "1",
      ordem: params.get("ordem") || "destaque",
    };
    const painelAberto = !!(estado.cor || estado.ordem !== "destaque");
    const titulo = estado.promo ? "Promoções" : L.categorias.find((c) => c.id === estado.cat)?.nome || "Catálogo";

    main().innerHTML = `
      <div class="recipiente catalogo">
        <h1 id="catalogo-titulo">${esc(titulo)}</h1>
        <div class="catalogo__busca">
          ${Icone.busca}
          <input id="busca" type="search" value="${esc(estado.q)}" placeholder="Buscar por nome ou código" aria-label="Buscar produtos" autocomplete="off" />
        </div>
        <div class="catalogo__chips" role="group" aria-label="Categorias">
          <button type="button" class="chip" data-cat="">Todas</button>
          ${L.categorias.map((c) => `<button type="button" class="chip" data-cat="${esc(c.id)}">${esc(c.nome)}</button>`).join("")}
        </div>
        <div class="catalogo__barra">
          <button type="button" class="botao-texto" id="abrir-filtros" aria-expanded="${painelAberto}" aria-controls="filtros">${Icone.filtro} Filtrar e ordenar</button>
          <button type="button" class="botao-texto" id="detalhes" aria-pressed="${preferenciaDetalhes.visiveis}">${preferenciaDetalhes.visiveis ? "Ocultar detalhes" : "Mostrar detalhes"}</button>
          <p class="catalogo__contagem" id="contagem" role="status"></p>
        </div>
        <div class="filtros" id="filtros" ${painelAberto ? "" : "hidden"}>
          <label>Ordenar por
            <select id="ordem">
              <option value="destaque">Destaques</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="desconto">Maior desconto</option>
              <option value="novidades">Novidades</option>
            </select>
          </label>
          <label>Cor
            <select id="cor">
              <option value="">Todas as cores</option>
              ${cores().map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("")}
            </select>
          </label>
          <label class="filtros__marca"><input type="checkbox" id="promo" /> Só promoções</label>
          <button type="button" class="botao-texto" id="limpar">Limpar filtros</button>
        </div>
        <div id="resultado"></div>
      </div>`;

    const $ = (id) => document.getElementById(id);
    $("ordem").value = estado.ordem;
    $("cor").value = estado.cor;
    $("promo").checked = estado.promo;

    function pintar() {
      const lista = filtrar(estado);
      document.querySelectorAll(".catalogo__chips .chip").forEach((c) => {
        const ativo = c.dataset.cat === estado.cat;
        c.classList.toggle("ativo", ativo);
        c.setAttribute("aria-pressed", ativo);
      });
      $("catalogo-titulo").textContent = estado.promo ? "Promoções" : L.categorias.find((c) => c.id === estado.cat)?.nome || "Catálogo";
      $("contagem").textContent = `${lista.length} ${lista.length === 1 ? "peça" : "peças"}`;
      $("resultado").innerHTML = lista.length
        ? Grade(lista)
        : Vazio({
            titulo: "Nenhuma peça encontrada",
            texto: "Tente outro termo ou limpe os filtros.",
            acao: `<button type="button" class="botao" id="limpar-vazio">Limpar filtros</button>`,
          });
      $("resultado").classList.toggle("com-detalhes", preferenciaDetalhes.visiveis);

      // Mantém o endereço em dia sem disparar nova renderização
      const p = new URLSearchParams();
      if (estado.q) p.set("q", estado.q);
      if (estado.cat) p.set("cat", estado.cat);
      if (estado.cor) p.set("cor", estado.cor);
      if (estado.promo) p.set("promo", "1");
      if (estado.ordem !== "destaque") p.set("ordem", estado.ordem);
      const qs = p.toString();
      history.replaceState(null, "", `#/catalogo${qs ? `?${qs}` : ""}`);
    }

    function limpar() {
      Object.assign(estado, { q: "", cat: "", cor: "", promo: false, ordem: "destaque" });
      $("busca").value = "";
      $("ordem").value = "destaque";
      $("cor").value = "";
      $("promo").checked = false;
      pintar();
    }

    $("busca").addEventListener("input", (e) => {
      estado.q = e.target.value;
      pintar();
    });
    $("ordem").addEventListener("change", (e) => {
      estado.ordem = e.target.value;
      pintar();
    });
    $("cor").addEventListener("change", (e) => {
      estado.cor = e.target.value;
      pintar();
    });
    $("promo").addEventListener("change", (e) => {
      estado.promo = e.target.checked;
      pintar();
    });
    $("limpar").addEventListener("click", limpar);
    $("abrir-filtros").addEventListener("click", (e) => {
      const abrir = $("filtros").hidden;
      $("filtros").hidden = !abrir;
      e.currentTarget.setAttribute("aria-expanded", abrir);
    });
    $("detalhes").addEventListener("click", (e) => {
      preferenciaDetalhes.visiveis = !preferenciaDetalhes.visiveis;
      e.currentTarget.textContent = preferenciaDetalhes.visiveis ? "Ocultar detalhes" : "Mostrar detalhes";
      e.currentTarget.setAttribute("aria-pressed", preferenciaDetalhes.visiveis);
      $("resultado").classList.toggle("com-detalhes", preferenciaDetalhes.visiveis);
    });
    main().querySelector(".catalogo__chips").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      estado.cat = chip.dataset.cat;
      pintar();
    });
    $("resultado").addEventListener("click", (e) => {
      if (e.target.id === "limpar-vazio") limpar();
    });

    pintar();
    if (params.get("foco") === "busca") $("busca").focus();
    return titulo;
  }

  /* ---------- Produto ---------- */
  function Produto(id) {
    const p = produto(id);
    if (!p) {
      main().innerHTML = `<div class="recipiente">${Vazio({
        titulo: "Esta peça não está no catálogo",
        texto: "Ela pode ter saído da coleção. Veja o que há disponível agora.",
        acao: `<a class="botao" href="#/catalogo">Ver catálogo</a>`,
      })}</div>`;
      return "Peça não encontrada";
    }

    const categoria = L.categorias.find((c) => c.id === p.categoria);
    const relacionados = L.produtos.filter((o) => o.categoria === p.categoria && o.id !== p.id).slice(0, 4);

    main().innerHTML = `
      <div class="recipiente pagina-produto">
        <nav class="migalhas" aria-label="Você está em">
          <a href="#/catalogo">Catálogo</a> / <a href="#/catalogo?cat=${esc(p.categoria)}">${esc(categoria?.nome || "")}</a>
        </nav>
        <div class="produto">
          <div class="galeria">
            <div class="galeria__principal">
              <img id="foto-principal" src="${esc(p.fotos[0].src)}" alt="${esc(p.nome)}" style="object-position:${esc(p.fotos[0].posicao || "center")}" />
              <span data-selo></span>
            </div>
            ${
              p.fotos.length > 1
                ? `<div class="galeria__miniaturas">${p.fotos
                    .map(
                      (f, i) =>
                        `<button type="button" data-foto="${i}" aria-label="Ver foto ${i + 1} de ${p.fotos.length}" aria-pressed="${i === 0}"><img src="${esc(f.src)}" alt="" style="object-position:${esc(f.posicao || "center")}" /></button>`
                    )
                    .join("")}</div>`
                : ""
            }
          </div>
          <div class="produto__info">
            <h1>${esc(p.nome)}</h1>
            <p class="produto__sku">Código ${esc(p.sku)}</p>
            <p class="produto__descricao">${esc(p.descricao)}</p>
            ${SeletorOpcoes(p)}
            <a class="link link--whats" href="${esc(linkWhatsApp(`Olá! Tenho uma dúvida sobre ${p.nome} (${p.sku}).`))}" target="_blank" rel="noopener">${Icone.whatsapp} Perguntar sobre esta peça</a>
            <p class="produto__nota">O frete e o estoque são confirmados pela loja no WhatsApp, antes do pagamento.</p>
          </div>
        </div>
        ${
          relacionados.length
            ? `<section class="secao" aria-labelledby="t-rel"><header class="secao__topo"><h2 id="t-rel">Combina com</h2></header>${Grade(relacionados)}</section>`
            : ""
        }
      </div>`;

    const $ = (x) => document.getElementById(x);

    ligarSeletor(main().querySelector(".produto"), p, (x, qtd) => {
      sacola.adicionar(p.id, varianteId(x), qtd);
      window.App.avisar(`${p.nome} (${rotuloVariante(x)}) adicionado ao carrinho`);
    });
    main().querySelector(".galeria__miniaturas")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-foto]");
      if (!b) return;
      const f = p.fotos[+b.dataset.foto];
      $("foto-principal").src = f.src;
      $("foto-principal").style.objectPosition = f.posicao || "center";
      main().querySelectorAll("[data-foto]").forEach((o) => o.setAttribute("aria-pressed", o === b));
    });

    return p.nome;
  }

  /* ---------- Sacola ---------- */
  const pedido = { nome: "", entrega: "", cep: "", observacao: "" };

  function Sacola() {
    const linhas = sacola.linhas();
    if (!linhas.length) {
      main().innerHTML = `<div class="recipiente">${Vazio({
        titulo: "Seu carrinho está vazio",
        texto: "Escolha uma peça no catálogo para começar o pedido.",
        acao: `<a class="botao" href="#/catalogo">Ver catálogo</a>`,
      })}</div>`;
      return "Carrinho";
    }

    main().innerHTML = `
      <div class="recipiente pagina-sacola">
        <h1>Seu carrinho</h1>
        <div class="sacola">
          <ul class="itens">
            ${linhas
              .map(
                (l) => `
              <li class="item">
                <a href="#/produto/${esc(l.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(l.produto.fotos[0].src)}" alt="" style="object-position:${esc(l.produto.fotos[0].posicao || "center")}" /></a>
                <div class="item__info">
                  <a class="item__nome" href="#/produto/${esc(l.id)}">${esc(l.produto.nome)}</a>
                  <p class="item__variacao">${esc(rotuloVariante(l.variante))} <span>${esc(l.produto.sku)}</span></p>
                  <div class="item__controles">
                    <div class="quantidade" role="group" aria-label="Quantidade de ${esc(l.produto.nome)}">
                      <button type="button" data-acao="menos" data-id="${esc(l.id)}" data-vid="${esc(l.vid)}" aria-label="Diminuir quantidade">−</button>
                      <output>${l.qtd}</output>
                      <button type="button" data-acao="mais" data-id="${esc(l.id)}" data-vid="${esc(l.vid)}" aria-label="Aumentar quantidade">+</button>
                    </div>
                    <button type="button" class="botao-texto" data-acao="remover" data-id="${esc(l.id)}" data-vid="${esc(l.vid)}">Remover</button>
                  </div>
                </div>
                <p class="item__preco">${dinheiro(l.variante.preco * l.qtd)}</p>
              </li>`
              )
              .join("")}
          </ul>

          <aside class="resumo" aria-label="Resumo do pedido">
            <dl>
              ${sacola.economia() > 0 ? `<div><dt>Você economiza</dt><dd>${dinheiro(sacola.economia())}</dd></div>` : ""}
              <div class="resumo__total"><dt>Total dos produtos</dt><dd>${dinheiro(sacola.total())}</dd></div>
            </dl>
            <p class="resumo__nota">O frete é somado pela loja no WhatsApp.</p>

            <form id="form-pedido" novalidate>
              <fieldset class="entrega">
                <legend>Como quer receber?</legend>
                ${L.entregas
                  .map(
                    (e) => `
                  <label>
                    <input type="radio" name="entrega" value="${esc(e.id)}" ${pedido.entrega === e.id ? "checked" : ""} />
                    <span><strong>${esc(e.nome)}</strong><small>${esc(e.texto)}</small></span>
                  </label>`
                  )
                  .join("")}
              </fieldset>
              <p class="erro" id="erro-entrega" role="alert" hidden>Escolha como quer receber para continuar.</p>
              <label class="campo">Seu nome (opcional)<input name="nome" autocomplete="name" value="${esc(pedido.nome)}" /></label>
              <label class="campo">CEP (opcional)<input name="cep" inputmode="numeric" autocomplete="postal-code" value="${esc(pedido.cep)}" /></label>
              <label class="campo">Observação (opcional)<textarea name="observacao" rows="2">${esc(pedido.observacao)}</textarea></label>
              <button type="submit" class="botao botao--grande botao--whats">${Icone.whatsapp} Finalizar pelo WhatsApp</button>
            </form>
            <p class="resumo__nota">Você ainda não paga nada aqui. Depois de conferir o pedido, a loja envia o link de pagamento para Pix ou cartão.</p>
          </aside>
        </div>
      </div>`;

    main().querySelector(".itens").addEventListener("click", (e) => {
      const b = e.target.closest("[data-acao]");
      if (!b) return;
      const linha = sacola.linhas().find((l) => l.id === b.dataset.id && l.vid === b.dataset.vid);
      const nova = { menos: linha.qtd - 1, mais: linha.qtd + 1, remover: 0 }[b.dataset.acao];
      sacola.definir(b.dataset.id, b.dataset.vid, nova);
      Sacola();
    });

    const form = document.getElementById("form-pedido");
    form.addEventListener("input", () => {
      const d = new FormData(form);
      pedido.nome = d.get("nome");
      pedido.cep = d.get("cep");
      pedido.observacao = d.get("observacao");
      pedido.entrega = d.get("entrega") || "";
      if (pedido.entrega) document.getElementById("erro-entrega").hidden = true;
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!pedido.entrega) {
        document.getElementById("erro-entrega").hidden = false;
        return;
      }
      window.open(linkWhatsApp(mensagemPedido(pedido)), "_blank", "noopener");
    });
    return "Carrinho";
  }

  /* ---------- Contato ---------- */
  function Contato() {
    main().innerHTML = `
      <div class="recipiente pagina-contato">
        <h1>Fale com a loja</h1>
        <p class="pagina-contato__intro">Pedidos, dúvidas sobre uma peça e entregas são atendidos pelo WhatsApp.</p>
        <div class="contatos">
          <a class="contato" href="${esc(linkWhatsApp("Olá! Vim pelo site e tenho uma dúvida."))}" target="_blank" rel="noopener">${Icone.whatsapp}<span><strong>WhatsApp</strong>${esc(L.contato.whatsappExibicao)}</span></a>
          <a class="contato" href="${esc(L.contato.instagram)}" target="_blank" rel="noopener">${Icone.instagram}<span><strong>Instagram</strong>${esc(L.contato.instagramUser)}</span></a>
        </div>
        <div class="duvidas">
          <h2>Dúvidas sobre a compra</h2>
          <details open><summary>Como pago?</summary><p>A loja envia um link de pagamento pelo WhatsApp, com o total já somado ao frete. Você paga com Pix ou cartão na página do provedor. Nenhum dado de pagamento passa por este site.</p></details>
          <details><summary>Quais são as formas de entrega?</summary><p>Correios para todo o Brasil e entrega local feita pela loja. O valor é informado no WhatsApp.</p></details>
          <details><summary>Preciso criar conta?</summary><p>Não. Seu carrinho fica salvo neste aparelho até você finalizar o pedido.</p></details>
          <details><summary>Tem pedido mínimo?</summary><p>Não. Você pode pedir uma peça só.</p></details>
        </div>
      </div>`;
    return "Contato";
  }

  window.Paginas = { Inicio, Catalogo, Produto, Sacola, Contato };
})();
