/* ==========================================================================
   REGRAS DA LOJA — catálogo, sacola no navegador e mensagem do WhatsApp.
   Sem HTML aqui: o visual fica em components.js e pages.js.
   ========================================================================== */

(function () {
  const L = window.LOJA;
  const CHAVE = "thayna-sacola-v1";
  const assinantes = new Set();

  const dinheiro = (n) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const produto = (id) => L.produtos.find((p) => p.id === id);
  const varianteId = (x) => `${x.cor}|${x.tamanho}`;
  const variante = (p, vid) => p.variantes.find((x) => varianteId(x) === vid);
  const disponiveis = (p) => p.variantes.filter((x) => x.disponivel);
  const desconto = (x) => (x.precoAntigo ? Math.round((1 - x.preco / x.precoAntigo) * 100) : 0);
  const maiorDesconto = (p) => Math.max(...p.variantes.map(desconto));
  const menorPreco = (p) => Math.min(...p.variantes.map((x) => x.preco));
  const cores = () => [...new Set(L.produtos.flatMap((p) => p.variantes.map((x) => x.cor)))].sort();
  const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  function filtrar({ q = "", cat = "", cor = "", promo = false, ordem = "destaque" }) {
    const termo = semAcento(q.trim());
    const lista = L.produtos.filter((p) => {
      const nomeCategoria = L.categorias.find((c) => c.id === p.categoria)?.nome || "";
      if (termo && !semAcento(`${p.nome} ${p.sku} ${nomeCategoria}`).includes(termo)) return false;
      if (cat && p.categoria !== cat) return false;
      if (cor && !p.variantes.some((x) => x.cor === cor)) return false;
      if (promo && maiorDesconto(p) === 0) return false;
      return true;
    });
    const ordens = {
      "menor-preco": (a, b) => menorPreco(a) - menorPreco(b),
      "maior-preco": (a, b) => menorPreco(b) - menorPreco(a),
      desconto: (a, b) => maiorDesconto(b) - maiorDesconto(a),
      novidades: (a, b) => Number(!!b.novo) - Number(!!a.novo),
    };
    return ordens[ordem] ? [...lista].sort(ordens[ordem]) : lista;
  }

  /* ---------- Sacola ---------- */
  function ler() {
    try {
      const dados = JSON.parse(localStorage.getItem(CHAVE));
      if (!Array.isArray(dados)) return [];
      // Descarta itens que saíram do catálogo ou ficaram indisponíveis
      return dados.filter((i) => {
        const p = produto(i.id);
        const x = p && variante(p, i.vid);
        return x && x.disponivel && i.qtd > 0;
      });
    } catch {
      return [];
    }
  }

  let itens = ler();

  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens));
    } catch {
      // Sem armazenamento (janela anônima): a sacola vale até fechar a página
    }
    assinantes.forEach((fn) => fn());
  }

  const sacola = {
    linhas: () =>
      itens.map((i) => {
        const p = produto(i.id);
        return { ...i, produto: p, variante: variante(p, i.vid) };
      }),
    quantidade: () => itens.reduce((t, i) => t + i.qtd, 0),
    total: () => sacola.linhas().reduce((t, l) => t + l.variante.preco * l.qtd, 0),
    economia: () => sacola.linhas().reduce((t, l) => t + (l.variante.precoAntigo ? (l.variante.precoAntigo - l.variante.preco) * l.qtd : 0), 0),
    adicionar(id, vid, qtd = 1) {
      const atual = itens.find((i) => i.id === id && i.vid === vid);
      if (atual) atual.qtd += qtd;
      else itens.push({ id, vid, qtd });
      salvar();
    },
    definir(id, vid, qtd) {
      itens = qtd > 0 ? itens.map((i) => (i.id === id && i.vid === vid ? { ...i, qtd } : i)) : itens.filter((i) => !(i.id === id && i.vid === vid));
      salvar();
    },
    limpar() {
      itens = [];
      salvar();
    },
    aoMudar: (fn) => assinantes.add(fn),
  };

  // Só mostra cor/tamanho quando há escolha de verdade ("Único" não informa nada)
  function rotuloVariante(x) {
    return [x.cor, x.tamanho === "Único" ? "" : x.tamanho].filter(Boolean).join(", ");
  }

  function linkWhatsApp(mensagem) {
    return `https://wa.me/${L.contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
  }

  function mensagemPedido({ nome = "", entrega = "", cep = "", observacao = "" }) {
    const linhas = sacola.linhas().map((l) => `• ${l.qtd}x ${l.produto.nome} (${l.produto.sku}), ${rotuloVariante(l.variante)}: ${dinheiro(l.variante.preco * l.qtd)}`);
    const entregaEscolhida = L.entregas.find((e) => e.id === entrega);
    const dados = [
      `Total dos produtos: ${dinheiro(sacola.total())}`,
      entregaEscolhida && `Entrega: ${entregaEscolhida.nome}`,
      cep.trim() && `CEP: ${cep.trim()}`,
      nome.trim() && `Nome: ${nome.trim()}`,
      observacao.trim() && `Observação: ${observacao.trim()}`,
    ].filter(Boolean);
    return ["Olá! Quero finalizar este pedido:", "", ...linhas, "", ...dados, "", "Pode conferir o estoque e me passar o frete?"].join("\n");
  }

  window.Loja = { dinheiro, produto, varianteId, variante, disponiveis, desconto, maiorDesconto, menorPreco, cores, filtrar, sacola, rotuloVariante, linkWhatsApp, mensagemPedido };
})();
