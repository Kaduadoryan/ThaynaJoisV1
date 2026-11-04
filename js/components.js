/* ==========================================================================
   COMPONENTES — funções que recebem dados e devolvem HTML.
   ========================================================================== */

(function () {
  const { dinheiro, varianteId, disponiveis, desconto, maiorDesconto, menorPreco, rotuloVariante } = window.Loja;

  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const Icone = {
    busca: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
    sacola: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l1 12h-15z"/><path d="M9 11V7a3 3 0 0 1 6 0v4"/></svg>',
    topo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V5M6 11l6-6 6 6"/></svg>',
    filtro: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6" fill="currentColor"/></svg>',
    whatsapp:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M20.5 3.5A11 11 0 0 0 3.3 17.1L2 22l5-1.3a11 11 0 0 0 13.5-17.2Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-3 .8.8-2.9-.2-.3a9 9 0 1 1 7.3 3.9Zm5-6.7c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1a7.4 7.4 0 0 1-3.7-3.2c-.3-.5.3-.4.8-1.4.1-.2 0-.3 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3Z"/></svg>',
  };

  const Selo = (pct) => (pct > 0 ? `<span class="selo">-${pct}%</span>` : "");

  function Precos(x) {
    return `<span class="precos">${x.precoAntigo ? `<s>${dinheiro(x.precoAntigo)}</s> ` : ""}<strong>${dinheiro(x.preco)}</strong></span>`;
  }

  // Foto do card: desliza para o lado quando o produto tem mais de uma
  function FotosCard(p) {
    const fotos = p.fotos
      .map(
        (f) =>
          `<a class="foto" href="#/produto/${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(f.src)}" alt="" loading="lazy" style="object-position:${esc(f.posicao || "center")}" /></a>`
      )
      .join("");
    const contador =
      p.fotos.length > 1
        ? `<span class="fotos__contador" data-total="${p.fotos.length}">1/${p.fotos.length}</span>
           <span class="fotos__pontos" aria-hidden="true">${p.fotos.map((_, i) => `<i class="${i === 0 ? "ativo" : ""}"></i>`).join("")}</span>`
        : "";
    return `<div class="fotos"><div class="fotos__trilho" data-trilho>${fotos}</div>${Selo(maiorDesconto(p))}${contador}</div>`;
  }

  function LinhaVariacao(p, x) {
    return `
      <li class="variacao">
        <span class="variacao__texto">
          <span class="variacao__nome">${esc(rotuloVariante(x))}</span>
          ${Precos(x)}
        </span>
        <button type="button" class="botao botao--comprar" data-comprar="${esc(p.id)}" data-vid="${esc(varianteId(x))}" aria-label="Comprar ${esc(p.nome)}, ${esc(rotuloVariante(x))}">Comprar</button>
      </li>`;
  }

  // Opções abertas no card ("Mostrar detalhes"): até 3; as demais ficam na janela
  function OpcoesCard(p) {
    const lista = disponiveis(p);
    if (!lista.length) return `<p class="card__esgotado">Sem estoque no momento</p>`;
    const resto = lista.length - 3;
    return `<ul class="variacoes">${lista.slice(0, 3).map((x) => LinhaVariacao(p, x)).join("")}</ul>${
      resto > 0 ? `<a class="card__mais" href="#/produto/${esc(p.id)}" data-abrir-opcoes="${esc(p.id)}">Ver mais ${resto} ${resto === 1 ? "opção" : "opções"}</a>` : ""
    }`;
  }

  // Preço de chamada do card: a opção mais barata
  function PrecoResumo(p) {
    const variosPrecos = new Set(p.variantes.map((x) => x.preco)).size > 1;
    const maisBarata = p.variantes.find((x) => x.preco === menorPreco(p));
    return `<p class="card__resumo">${variosPrecos ? "A partir de " : ""}${Precos(maisBarata)}</p>`;
  }

  function CardProduto(p) {
    const temEstoque = disponiveis(p).length > 0;
    return `
      <article class="card">
        ${FotosCard(p)}
        <div class="card__corpo">
          <h3 class="card__nome"><a href="#/produto/${esc(p.id)}">${esc(p.nome)}</a></h3>
          <p class="card__sku">${esc(p.sku)}</p>
          ${PrecoResumo(p)}
          <button type="button" class="botao botao--carrinho" ${temEstoque ? `data-abrir-opcoes="${esc(p.id)}" aria-haspopup="dialog"` : "disabled"} aria-label="${temEstoque ? `Adicionar ${esc(p.nome)} ao carrinho` : `${esc(p.nome)} sem estoque`}">${temEstoque ? "Adicionar ao carrinho" : "Sem estoque"}</button>
        </div>
        <div class="card__opcoes">${OpcoesCard(p)}</div>
      </article>`;
  }

  // Escolha de cor, tamanho e quantidade: usada na janela e na página da peça
  function SeletorOpcoes(p) {
    const grupo = (tipo, rotulo, valores) => `
      <fieldset class="opcoes">
        <legend>${rotulo}: <span data-escolhida="${tipo}"></span></legend>
        <div class="opcoes__lista" data-opcao="${tipo}">
          ${valores.map((o) => `<button type="button" class="chip" data-valor="${esc(o)}">${esc(o)}</button>`).join("")}
        </div>
      </fieldset>`;
    const tamanhos = [...new Set(p.variantes.map((x) => x.tamanho))];
    return `
      <p class="seletor__preco" data-preco aria-live="polite"></p>
      ${grupo("cor", "Cor", [...new Set(p.variantes.map((x) => x.cor))])}
      ${tamanhos.length > 1 || tamanhos[0] !== "Único" ? grupo("tamanho", "Tamanho", tamanhos) : ""}
      <div class="seletor__comprar">
        <div class="quantidade" role="group" aria-label="Quantidade">
          <button type="button" data-menos aria-label="Diminuir quantidade">−</button>
          <output data-qtd>1</output>
          <button type="button" data-mais aria-label="Aumentar quantidade">+</button>
        </div>
        <button type="button" class="botao botao--grande" data-adicionar>Adicionar ao carrinho</button>
      </div>
      <p class="seletor__aviso" data-aviso role="status"></p>`;
  }

  // Liga o seletor já desenhado em raiz; aoAdicionar recebe a variação e a quantidade
  function ligarSeletor(raiz, p, aoAdicionar) {
    const $ = (sel) => raiz.querySelector(sel);
    const inicial = p.variantes.find((x) => x.disponivel) || p.variantes[0];
    const escolha = { cor: inicial.cor, tamanho: inicial.tamanho, qtd: 1 };
    const atual = () => p.variantes.find((x) => x.cor === escolha.cor && x.tamanho === escolha.tamanho);

    function pintar() {
      const x = atual();
      const disponivel = x && x.disponivel;
      $("[data-preco]").innerHTML = x ? Precos(x) : "Combinação indisponível";
      if ($("[data-selo]")) $("[data-selo]").innerHTML = x ? Selo(desconto(x)) : "";
      raiz.querySelectorAll("[data-opcao]").forEach((grupo) => {
        const tipo = grupo.dataset.opcao;
        raiz.querySelector(`[data-escolhida="${tipo}"]`).textContent = escolha[tipo];
        grupo.querySelectorAll(".chip").forEach((c) => {
          const valor = c.dataset.valor;
          const ativo = valor === escolha[tipo];
          // Risca a opção que não existe combinada com a outra escolha
          const existe = p.variantes.some((o) => o[tipo] === valor && o.disponivel && (tipo === "cor" ? o.tamanho === escolha.tamanho : o.cor === escolha.cor));
          c.classList.toggle("ativo", ativo);
          c.classList.toggle("indisponivel", !existe);
          c.setAttribute("aria-pressed", ativo);
        });
      });
      $("[data-qtd]").textContent = escolha.qtd;
      $("[data-adicionar]").disabled = !disponivel;
      $("[data-adicionar]").textContent = disponivel ? "Adicionar ao carrinho" : "Sem estoque";
      $("[data-aviso]").textContent = disponivel ? "" : "Essa combinação está sem estoque. Escolha outra cor ou tamanho.";
    }

    raiz.querySelectorAll("[data-opcao]").forEach((grupo) =>
      grupo.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        escolha[grupo.dataset.opcao] = chip.dataset.valor;
        pintar();
      })
    );
    $("[data-menos]").addEventListener("click", () => {
      escolha.qtd = Math.max(1, escolha.qtd - 1);
      pintar();
    });
    $("[data-mais]").addEventListener("click", () => {
      escolha.qtd += 1;
      pintar();
    });
    $("[data-adicionar]").addEventListener("click", () => {
      const x = atual();
      if (x && x.disponivel) aoAdicionar(x, escolha.qtd);
    });
    pintar();
  }

  // Conteúdo da janela aberta pelo botão "Adicionar ao carrinho"
  function ConteudoOpcoes(p) {
    const f = p.fotos[0];
    return `
      <div class="janela__foto">
        <img src="${esc(f.src)}" alt="" style="object-position:${esc(f.posicao || "center")}" />
        <span data-selo></span>
      </div>
      <div class="janela__corpo">
        <h2 id="janela-titulo">${esc(p.nome)}</h2>
        <p class="card__sku">${esc(p.sku)}</p>
        ${SeletorOpcoes(p)}
        <a class="link" href="#/produto/${esc(p.id)}">Ver detalhes da peça</a>
      </div>`;
  }

  const Grade = (lista) => `<div class="grade">${lista.map(CardProduto).join("")}</div>`;

  // Raminho desenhado para os cantos do círculo de categoria
  const Raminho =
    '<svg class="raminho" viewBox="0 0 40 40" aria-hidden="true"><path d="M4 36C12 28 20 20 34 6"/><path d="M12 28c-5-1-7-4-8-8 5 0 8 3 8 8ZM20 20c-1-5 1-8 5-11 1 5 0 9-5 11ZM21 20c4-2 8-1 11 2-4 2-8 2-11-2Z" fill="currentColor" stroke="none"/><circle cx="35" cy="5" r="3" fill="currentColor" stroke="none"/></svg>';

  function CirculosCategoria(categorias) {
    return `
      <ul class="circulos">
        ${categorias
          .map(
            (c) => `
          <li>
            <a class="circulo" href="#/catalogo?cat=${esc(c.id)}">
              <span class="circulo__disco" aria-hidden="true">${Raminho}<span>${esc(c.nome)}</span>${Raminho}</span>
              <span class="circulo__nome">${esc(c.nome)}</span>
            </a>
          </li>`
          )
          .join("")}
      </ul>`;
  }

  function Vazio({ titulo, texto, acao }) {
    return `<div class="vazio"><h2>${esc(titulo)}</h2><p>${esc(texto)}</p>${acao || ""}</div>`;
  }

  window.UI = { esc, Icone, Selo, Precos, CardProduto, SeletorOpcoes, ligarSeletor, ConteudoOpcoes, Grade, CirculosCategoria, Vazio };
})();
