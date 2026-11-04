/* ==========================================================================
   DADOS DA LOJA — tudo o que muda sem mexer no visual.
   Na implementação, este arquivo é o que o CMS (ou a planilha) vai substituir.
   ========================================================================== */

// Atalho para declarar uma variação: cor, tamanho, preço, preço antigo, disponível
const v = (cor, tamanho, preco, precoAntigo = null, disponivel = true) => ({ cor, tamanho, preco, precoAntigo, disponivel });

window.LOJA = {
  // true mostra a faixa avisando que preços e variações são exemplos
  prototipo: true,

  marca: {
    nome: "Thayná Barcelos",
    subtitulo: "Acessórios",
    logo: "assets/logo.png",
  },

  contato: {
    whatsapp: "5565998089763", // só dígitos: 55 + DDD + número
    whatsappExibicao: "(65) 99808-9763",
    instagram: "https://www.instagram.com/salaothaynabarcelos/",
    instagramUser: "@salaothaynabarcelos",
  },

  entregas: [
    { id: "correios", nome: "Correios", texto: "A loja calcula o frete pelo seu CEP." },
    { id: "local", nome: "Entrega local", texto: "A loja confirma se atende o seu bairro." },
  ],

  categorias: [
    { id: "brincos", nome: "Brincos" },
    { id: "colares", nome: "Colares" },
    { id: "conjuntos", nome: "Conjuntos" },
    { id: "pulseiras", nome: "Pulseiras" },
    { id: "aneis", nome: "Anéis" },
    { id: "cabelo", nome: "Cabelo" },
  ],

  // precoReal: true = valor visto nos stories da loja. Os demais são exemplos.
  produtos: [
    {
      id: "choker-pingente", sku: "TB-101", nome: "Choker de cordão com pingente", categoria: "colares", novo: true,
      descricao: "Cordão encerado para amarrar em várias voltas, com pingente dourado de destaque.",
      fotos: [{ src: "assets/produtos/choker.jpg", posicao: "center 70%" }],
      variantes: [v("Preto", "Único", 129.9, 179.9), v("Marrom", "Único", 129.9, 179.9)],
    },
    {
      id: "brinco-solar", sku: "TB-102", nome: "Brinco solar dourado", categoria: "brincos", novo: true,
      descricao: "Brinco grande de metal frisado, leve para o tamanho que tem.",
      fotos: [{ src: "assets/produtos/brinco-solar.jpg" }],
      variantes: [v("Dourado", "Único", 99.9)],
    },
    {
      id: "anel-turquesa", sku: "TB-103", nome: "Anel turquesa", categoria: "aneis", novo: true,
      descricao: "Anel largo com pedra turquesa ao centro e acabamento envelhecido.",
      fotos: [{ src: "assets/produtos/anel-turquesa.jpg" }],
      variantes: [v("Prata velha", "Aro 16", 89.9), v("Prata velha", "Aro 18", 89.9), v("Prata velha", "Aro 20", 89.9, null, false)],
    },
    {
      id: "conjuntinhos", sku: "TB-201", nome: "Conjuntinho pérola e zircônia", categoria: "conjuntos", precoReal: true,
      descricao: "Colar e par de brincos combinando. Vários modelos na bandeja: escolha o seu pelo WhatsApp.",
      fotos: [{ src: "assets/produtos/conjuntinhos-perola.jpg" }],
      variantes: [v("Prateado", "Único", 169)],
    },
    {
      id: "coracao-azul", sku: "TB-202", nome: "Conjunto coração azul cravejado", categoria: "conjuntos",
      descricao: "Colar e brincos de coração com pedra azul e contorno de zircônias.",
      fotos: [
        { src: "assets/produtos/conjunto-coracao-azul.jpg", posicao: "center 40%" },
        { src: "assets/produtos/conjunto-coracao-azul-2.jpg", posicao: "center 45%" },
      ],
      variantes: [v("Azul", "Único", 189.9, 259.9)],
    },
    {
      id: "esmeralda", sku: "TB-203", nome: "Conjunto verde esmeralda", categoria: "conjuntos",
      descricao: "Colar e brincos com pedra verde oval e contorno de zircônias.",
      fotos: [{ src: "assets/produtos/conjunto-esmeralda.jpg", posicao: "center 45%" }],
      variantes: [v("Verde", "Único", 189.9, 259.9)],
    },
    {
      id: "brincos-cravejados", sku: "TB-301", nome: "Brinco redondo cravejado", categoria: "brincos", precoReal: true,
      descricao: "Brinco redondo de zircônias, nas versões dourada e prateada.",
      fotos: [{ src: "assets/produtos/brincos-dourados.jpg" }],
      variantes: [v("Dourado", "Único", 89.9), v("Prateado", "Único", 89.9)],
    },
    {
      id: "piercing-fake", sku: "TB-302", nome: "Piercing fake", categoria: "brincos", precoReal: true,
      descricao: "Usa sem furo: encaixa na orelha e dá o efeito de piercing.",
      fotos: [{ src: "assets/produtos/piercing-fake.jpg" }],
      variantes: [v("Prateado", "Único", 139), v("Dourado", "Único", 139)],
    },
    {
      id: "minimalistas", sku: "TB-303", nome: "Brinco minimalista dourado", categoria: "brincos",
      descricao: "Formas lisas e polidas para usar todo dia.",
      fotos: [{ src: "assets/produtos/brincos-minimalistas.jpg", posicao: "center 40%" }],
      variantes: [v("Dourado", "Pequeno", 69.9, 99.9), v("Dourado", "Médio", 79.9, 109.9)],
    },
    {
      id: "brincos-rosa", sku: "TB-304", nome: "Brinco rosa cravejado", categoria: "brincos",
      descricao: "Três corações rosa em linha, contornados por zircônias.",
      fotos: [{ src: "assets/produtos/brincos-rosa.jpg", posicao: "center 70%" }],
      variantes: [v("Rosa", "Único", 109.9)],
    },
    {
      id: "riviera", sku: "TB-401", nome: "Colar riviera cravejado", categoria: "colares",
      descricao: "Riviera de pedras claras, em duas medidas.",
      fotos: [{ src: "assets/produtos/colar-riviera.jpg" }],
      variantes: [v("Prateado", "40 cm", 249.9, 329.9), v("Prateado", "45 cm", 269.9, 349.9)],
    },
    {
      id: "delicadeza", sku: "TB-402", nome: "Colar pérolas e zircônias", categoria: "colares",
      descricao: "Pérolas alternadas com zircônias, para usar sozinho ou em camadas.",
      fotos: [{ src: "assets/produtos/colar-delicadeza.jpg", posicao: "center 55%" }],
      variantes: [v("Prateado", "40 cm", 179.9), v("Prateado", "45 cm", 189.9)],
    },
    {
      id: "pingente-azul", sku: "TB-403", nome: "Colar pingente azul", categoria: "colares",
      descricao: "Corrente fina com pingente redondo de pedras azuis.",
      fotos: [{ src: "assets/produtos/colar-pingente-azul.jpg", posicao: "center 80%" }],
      variantes: [v("Azul", "Único", 149.9)],
    },
    {
      id: "colar-esmaltado", sku: "TB-404", nome: "Colar de pingentes esmaltados", categoria: "colares", novo: true,
      descricao: "Duas voltas douradas com pingentes pintados de flores e frutas.",
      fotos: [{ src: "assets/produtos/colar-esmaltado.jpg", posicao: "center 60%" }],
      variantes: [v("Colorido", "Único", 219.9)],
    },
    {
      id: "pulseiras-cravejadas", sku: "TB-501", nome: "Pulseira cravejada", categoria: "pulseiras",
      descricao: "Pulseira de pedras claras, em dois tons de metal.",
      fotos: [{ src: "assets/produtos/pulseiras-cravejadas.jpg", posicao: "center 60%" }],
      variantes: [v("Dourado", "17 cm", 119.9, 159.9), v("Dourado", "19 cm", 119.9, 159.9), v("Prateado", "17 cm", 119.9, 159.9), v("Prateado", "19 cm", 119.9, 159.9)],
    },
    {
      id: "pulseira-coracao", sku: "TB-502", nome: "Pulseira coração", categoria: "pulseiras",
      descricao: "Cordão duplo com coração cravejado, fecho ajustável.",
      fotos: [{ src: "assets/produtos/pulseira-coracao.jpg", posicao: "center 75%" }],
      variantes: [v("Azul claro", "Ajustável", 89.9), v("Vermelho", "Ajustável", 89.9)],
    },
    {
      id: "pulseira-elos", sku: "TB-503", nome: "Pulseira de elos dourados", categoria: "pulseiras",
      descricao: "Elos retangulares grandes, polidos, com fecho de lagosta.",
      fotos: [{ src: "assets/produtos/pulseira-elos.jpg", posicao: "center 20%" }],
      variantes: [v("Dourado", "19 cm", 139.9)],
    },
    {
      id: "aneis-cravejados", sku: "TB-601", nome: "Anel cravejado", categoria: "aneis",
      descricao: "Anel de faixa com zircônias, em dourado e prateado.",
      fotos: [{ src: "assets/produtos/aneis-cravejados.jpg", posicao: "center 45%" }],
      variantes: [v("Dourado", "Aro 16", 79.9, 109.9), v("Dourado", "Aro 18", 79.9, 109.9), v("Prateado", "Aro 16", 79.9, 109.9), v("Prateado", "Aro 18", 79.9, 109.9, false)],
    },
    {
      id: "meia-alianca", sku: "TB-602", nome: "Anel meia aliança", categoria: "aneis",
      descricao: "Fino para empilhar: combine vários no mesmo dedo.",
      fotos: [{ src: "assets/produtos/aneis-meia-alianca.jpg" }],
      variantes: [v("Dourado", "Aro 16", 59.9), v("Dourado", "Aro 18", 59.9), v("Prateado", "Aro 16", 59.9), v("Prateado", "Aro 18", 59.9)],
    },
    {
      id: "presilhas-bianca", sku: "TB-701", nome: "Presilha Bianca", categoria: "cabelo",
      descricao: "Presilha para prender o cabelo sem marcar.",
      fotos: [{ src: "assets/produtos/presilhas-bianca.jpg", posicao: "center 25%" }],
      variantes: [v("Preto", "Único", 49.9), v("Tartaruga", "Único", 49.9)],
    },
  ],
};
