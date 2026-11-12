import type { GodparentRole, InviteKind, WeddingContent } from "./types";

export const WEDDING_DEFAULTS = {
  id: "main",
  groomName: "Victor",
  brideName: "Isabel",
  eventAt: "2027-04-17T17:00:00-03:00",
  timeZone: "America/Sao_Paulo",
  maxGiftsPerGuest: 2 as number | null,
};

export const WEDDING_CONTENT: WeddingContent = {
  tagline:
    "Com o coração cheio de alegria, convidamos você para viver conosco o dia em que prometemos amar para sempre.",
  message: [
    "Há encontros que não são acaso: são destino chegando devagar, em forma de riso fácil e de silêncio bom.",
    "Entre sonhos divididos e caminhos que passaram a ser um só, descobrimos que o amor é, antes de tudo, escolha — feita todos os dias, com carinho e coragem.",
    "Agora, cercados de quem mais amamos, vamos transformar promessa em caminho. Será uma alegria imensa celebrar esse momento com você.",
  ],
  signature: "Victor & Isabel",
  countdownLine: "Cada segundo nos aproxima do nosso grande dia.",
  venue: {
    name: "Igreja Matriz de Nova Russas",
    address: "R. General Sampaio, 1044 — Centro",
    city: "Nova Russas · CE",
    lat: -4.7048,
    lng: -40.5655,
    mapMode: "illustrated",
    streetLabel: "Rua General Sampaio",
    marker: "church",
    note: "Cerimônia religiosa",
  },
  schedule: [
    { time: "16h30", label: "Recepção dos convidados" },
    { time: "17h00", label: "Cerimônia" },
    { time: "18h30", label: "Coquetel e jantar" },
    { time: "20h00", label: "Festa" },
  ],
  info: [
    {
      icon: "dress",
      title: "Vestimenta",
      text: "Traje social completo. Sugerimos tons suaves; o branco e o off-white ficam reservados à noiva.",
    },
    {
      icon: "clock",
      title: "Horários",
      text: "A cerimônia começa pontualmente às 17h. Chegue com 20 minutos de antecedência para ser recebido com calma.",
    },
    {
      icon: "car",
      title: "Estacionamento",
      text: "Recomendamos chegar com antecedência para estacionar com tranquilidade. Se preferir, use aplicativo de transporte.",
    },
    {
      icon: "gift",
      title: "Presentes",
      text: "Nossa lista está aqui no convite, ao confirmar sua presença. Indicamos presentes nas cores branco, preto, inox ou bambu.",
    },
  ],
  godparents: {
    tagline: "Um convite feito com muito carinho, escrito só para você.",
    greeting: "{querido} {nome},",
    message: [
      "Entre todas as pessoas que fizeram parte da nossa história, poucas estiveram tão perto. Por isso, temos um pedido que vem do fundo do coração:",
    ],
    question: "você aceita ser nosso {papel}?",
    closing:
      "Queremos você ao nosso lado quando dissermos sim — testemunhando, abençoando e tornando esse dia ainda mais nosso.",
    guidance: [
      {
        icon: "clock",
        title: "Chegada",
        text: "Padrinhos e madrinhas chegam às {chegada}, para as fotos e os últimos detalhes antes da cerimônia.",
      },
      {
        icon: "camera",
        title: "Fotos",
        text: "Teremos um momento de fotos com os padrinhos antes da cerimônia. Capriche no sorriso!",
      },
      {
        icon: "heart",
        title: "Entrada",
        text: "Você entrará em cortejo, acompanhado(a). Enviamos o roteiro por mensagem na semana do casamento.",
      },
    ],
    dressCode: {
      PADRINHO:
        "Terno azul-marinho, camisa branca e gravata em tom Serenity (nós enviamos). Sapato social escuro.",
      MADRINHA:
        "Vestido longo em azul Serenity, a cor da nossa festa. Enviaremos a cartela de tons e referências.",
    },
    arrival: "15h30",
  },
  rsvp: {
    deadlineLabel: "Pedimos a gentileza de confirmar até 17 de março de 2027.",
    thanksConfirmed:
      "Que alegria saber que você estará conosco! Mal podemos esperar para celebrar esse dia ao seu lado.",
    thanksDeclined:
      "Agradecemos de coração o carinho. Você estará em nossos pensamentos nesse dia.",
  },
};

export interface GiftSeed {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  priceCents: number | null;
  quantity: number;
  sortOrder: number;
}

const COZINHA = "Cozinha e eletrodomésticos";

const GIFT_LIST: [string, string, string, string, number][] = [
  ["liquidificador", "Liquidificador", COZINHA, "blender", 1],
  ["cafeteira", "Cafeteira elétrica", COZINHA, "coffee", 1],
  ["panelas", "Jogo de panelas", COZINHA, "pots", 2],
  ["faqueiro", "Faqueiro Tramontina", COZINHA, "cutlery", 1],
  ["copos", "Jogo de copos", COZINHA, "glasses", 2],
  ["pratos", "Kit pratos", COZINHA, "plates", 2],
  ["xicaras", "Jogo de xícaras", COZINHA, "cups", 2],
  ["batedeira", "Batedeira", COZINHA, "standmixer", 1],
  ["microondas", "Micro-ondas", COZINHA, "microwave", 1],
  ["mixer", "Mixer", COZINHA, "immersion", 1],
  ["jarra", "Jarra", COZINHA, "pitcher", 1],
  ["travessas", "Travessas", COZINHA, "dishes", 3],
  ["potes", "Kit de potes", COZINHA, "containers", 3],
  ["porta-temperos", "Porta-temperos", COZINHA, "spices", 1],
  ["tacas", "Conjunto de taças", COZINHA, "wine", 1],
  ["sobremesa", "Conjunto para sobremesa", COZINHA, "dessert", 1],
  [
    "colheres-silicone",
    "Colheres de cozinhar de silicone",
    COZINHA,
    "spatulas",
    1,
  ],
  ["utensilios-bambu", "Kit de utensílios de bambu", COZINHA, "bamboo", 1],
  ["toalhas-mesa", "Toalhas de mesa", COZINHA, "tablecloth", 2],
  ["jogo-americano", "Jogo americano", COZINHA, "placemat", 1],
  ["assadeira-redonda", "Assadeira redonda", COZINHA, "roundpan", 1],
  ["assadeira-retangular", "Assadeira retangular", COZINHA, "squarepan", 1],
  ["jogos-cama", "Jogos de cama casal", "Quarto", "bed", 3],
  ["protetor-colchao", "Protetor de colchão", "Quarto", "mattress", 2],
  ["cortina", "Cortina para sala ou quarto", "Sala", "curtain", 2],
  ["almofadas", "Almofadas", "Sala", "cushions", 2],
  [
    "toalhas-banho",
    "Jogos de toalhas de banho e rosto",
    "Banheiro",
    "towels",
    2,
  ],
  ["tapetes", "Tapetes", "Banheiro", "rug", 2],
];

export const GIFT_SEEDS: GiftSeed[] = GIFT_LIST.map(
  ([slug, name, category, glyph, quantity], i) => ({
    id: `gift-${slug}`,
    name,
    category,
    description: "",
    imageUrl: `glyph:${glyph}`,
    priceCents: null,
    quantity,
    sortOrder: i + 1,
  }),
);

export interface DemoGuestSeed {
  id: string;
  token: string;
  name: string;
  kind: InviteKind;
  godparentRole: GodparentRole | null;
}

export const DEMO_GUESTS: DemoGuestSeed[] = [
  {
    id: "g-demo-1",
    token: "demo-convidado",
    name: "Mariana Alves",
    kind: "GUEST",
    godparentRole: null,
  },
  {
    id: "g-demo-2",
    token: "demo-sozinho",
    name: "Paulo Nunes",
    kind: "GUEST",
    godparentRole: null,
  },
  {
    id: "g-demo-3",
    token: "demo-padrinho",
    name: "Rafael Menezes",
    kind: "GODPARENT",
    godparentRole: "PADRINHO",
  },
  {
    id: "g-demo-4",
    token: "demo-madrinha",
    name: "Helena Duarte",
    kind: "GODPARENT",
    godparentRole: "MADRINHA",
  },
  {
    id: "g-demo-x",
    token: "demo-outro-convidado",
    name: "Convidado de exemplo",
    kind: "GUEST",
    godparentRole: null,
  },
];

export const DEMO_PRE_RESERVED: { giftId: string; guestId: string }[] = [
  { giftId: "gift-liquidificador", guestId: "g-demo-x" },
  { giftId: "gift-panelas", guestId: "g-demo-x" },
];
