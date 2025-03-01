import type { MenuItem } from "@/types/menu"

export const menuItems: MenuItem[] = [
  // Entradas
  {
    id: 1,
    name: "Batata frita",
    description: "Crocante por fora e macia por dentro, acompanhada de molho especial.",
    price: 22.00,
    category: "starters",
    image: "/French-fries.jpg",
  },
  {
    id: 2,
    name: "Pastel de fumeiro com banana",
    description: "Recheio agridoce e defumado, uma combinação surpreendente.",
    price: 22.00,
    category: "starters",
    image: "/pastel-fumeiro-banana.jpg", // Adicionei imagem específica
  },
  {
    id: 3,
    name: "Provolone empanado",
    description: "Queijo provolone empanado e crocante, servido com geleia de pimenta.",
    price: 24.00,
    category: "starters",
    image: "/provolone-empanado.jpg", // Adicionei imagem específica
  },
  {
    id: 4,
    name: "Dadinho de tapioca",
    description: "Cubinhos de tapioca crocantes com queijo coalho e melado.",
    price: 24.00,
    category: "starters",
    image: "/dadinho-tapioca.jpg", // Adicionei imagem específica
  },
  {
    id: 5,
    name: "Kibe",
    description: "Kibe frito tradicional, temperado com especiarias e hortelã.",
    price: 32.00,
    category: "starters",
    image: "/kibe.jpg", // Adicionei imagem específica
  },
  {
    id: 6,
    name: "Camarão na tapioca",
    description: "Camarões salteados com especiarias, servidos em cama de tapioca cremosa.",
    price: 38.00,
    category: "starters",
    image: "/camarao-tapioca.jpg", // Adicionei imagem específica
  },
  {
    id: 7,
    name: "Bolinho de costela",
    description: "Bolinhos de costela desfiada, empanados e crocantes.",
    price: 38.00,
    category: "starters",
    image: "/bolinho-costela.jpg", // Adicionei imagem específica
  },
  {
    id: 8,
    name: "Caponata de berinjela",
    description: "Berinjelas assadas com legumes e especiarias, servida com torradas.",
    price: 34.00,
    category: "starters",
    image: "/caponata-berinjela.jpg", // Adicionei imagem específica
  },
  {
    id: 9,
    name: "Escondidinho (individual)",
    description: "Purê de mandioca cremoso com recheio à sua escolha.",
    price: 25.00,
    category: "mains",
    image: "/escondidinho.jpg", // Adicionei imagem específica
  },
  {
    id: 10,
    name: "Sanduíche de pernil",
    description: "Pernil desfiado, queijo, vinagrete e maionese da casa no pão francês.",
    price: 28.00,
    category: "mains",
    image: "/sanduiche-pernil.jpg", // Adicionei imagem específica
  },
  {
    id: 11,
    name: "Moela com pão",
    description: "Moela cozida lentamente em molho saboroso, acompanhada de pão francês.",
    price: 38.00,
    category: "mains",
    image: "/moela-pao.jpg", // Adicionei imagem específica
  },
  {
    id: 12,
    name: "Brandade de bacalhau",
    description: "Bacalhau desfiado com purê de batata e azeite extra virgem.",
    price: 34.00,
    category: "mains",
    image: "/brandade-bacalhau.jpg", // Adicionei imagem específica
  },
  {
    id: 13,
    name: "Carne de panela c/ aipim",
    description: "Carne de panela macia e saborosa, servida com aipim cozido.",
    price: 40.00,
    category: "mains",
    image: "/carne-de-panela.jpg",
  },
  {
    id: 14,
    name: "Filézinho ao gorgonzola",
    description: "Filé mignon grelhado com molho cremoso de gorgonzola.",
    price: 60.00,
    category: "mains",
    image: "/file-gorgonzola.jpg", // Adicionei imagem específica
  },
  {
    id: 15,
    name: "Costelinha com batata rústica",
    description: "Costelinha de porco assada com temperos especiais e batatas rústicas.",
    price: 65.00,
    category: "mains",
    image: "/costelinha.jpg",
  },
  {
    id: 16,
    name: "Amstel",
    description: "Cerveja Amstel 600ml",
    price: 12.00,
    category: "beers",
    image: "/amstel.jpg",
  },
  {
    id: 17,
    name: "Gin Tônica", 
    description: "Mistura de gin, água tônica e um toque de limão, refrescante e leve.",
    price: 22.00,
    category: "drinks",
    image: "/gin-tonica.jpg",
  },
  {
    id: 18,
    name: "Mojito",
    description: "Rum, hortelã, açúcar, limão e água com gás, um clássico cubano refrescante.",
    price: 22.00,
    category: "drinks",
    image: "/mojito.jpg", // Adicionei imagem específica
  },
  {
    id: 19,
    name: "Negroni",
    description: "Gin, Campari e vermute tinto, um aperitivo italiano sofisticado e amargo.",
    price: 22.00,
    category: "drinks",
    image: "/negroni.jpg", // Adicionei imagem específica
  },
  {
    id: 20,
    name: "Campari",
    description: "Aperitivo italiano com sabor amargo e cítrico, servido com gelo e laranja.",
    price: 12.00,
    category: "drinks",
    image: "/campari.jpg", // Adicionei imagem específica
  },
  {
    id: 21,
    name: "Vinho seco",
    description: "Consulte nossa carta de vinhos para opções.",
    price: 0.00, // Preço a consultar
    category: "drinks",
    image: "/vinho-seco.jpg", // Adicionei imagem específica
  }
]