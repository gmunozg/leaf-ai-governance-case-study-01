/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  GROUND & MOTHER — PRODUCT CATALOGUE
 *  The single source of truth for every digital product and tiny app.
 *
 *  To add a product: copy one entry below, give it a unique `slug`, fill in the
 *  fields, and deploy. Its card, Shop listing, landing page, sitemap entry and
 *  structured data are generated automatically. See README → "Adding a product".
 *
 *  Rules that keep the storefront honest:
 *   • Never paste a checkout URL you have not copied from your own Gumroad dashboard.
 *   • A product is only purchasable when status === "available" AND checkoutUrl is set.
 *   • `price: null` renders as "Price announced at launch". Keep it null until decided.
 *   • `screenshots` must be real captures of the real app. Leave empty until they exist.
 *   • status "unpublished" hides the product everywhere (no page, no card, no sitemap).
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { Locale, Localized } from "@/i18n/config";

export type ProductStatus = "available" | "coming-soon" | "unpublished";
export type ProductType = "app" | "guide" | "printable" | "course" | "workshop" | "collection" | "subscription";
export type Collection = "mother" | "first-foods" | "first-years" | "family";
export type Billing = "one-time" | "monthly" | "yearly";
export type Tone = "broth" | "sage" | "clay" | "linen" | "forest" | "yolk";

export type Image = { src: string; alt: Localized; width: number; height: number };

export type ProductContent = {
  title: string;
  /** One line, used on cards. */
  short: string;
  /** Editorial standfirst under the title on the landing page. */
  standfirst: string;
  /** Paragraphs for the landing page. */
  description: string[];
  audience: string;
  problem: string;
  features: { title: string; body: string }[];
  included: string[];
  faqs: { q: string; a: string }[];
  /** Optional art-direction brief shown on the placeholder until real photography exists. */
  imageBrief?: string;
};

export type Product = {
  /** URL segment. Apps live at /apps/{slug}, everything else at /shop/{slug}. */
  slug: string;
  collection: Collection;
  type: ProductType;
  status: ProductStatus;
  featured: boolean;
  /** Price in major units (e.g. 24 = $24.00). null = not announced. */
  price: number | null;
  currency: "USD" | "EUR" | "GBP" | "MXN";
  billing: Billing;
  /** Copied from Gumroad: the product's share URL, e.g. https://yourname.gumroad.com/l/abc123 */
  checkoutUrl: string | null;
  /** Gumroad product ID (Product → Advanced). Server-side licence verification uses it. */
  gumroadProductId: string | null;
  /** Where buyers go to use the product (e.g. https://companion.your-domain.com). Never a secret. */
  accessUrl: string | null;
  /** Whether this product needs server-verified access (true for interactive apps). */
  requiresAccessControl: boolean;
  tone: Tone;
  image: Image | null;
  gallery: Image[];
  /** REAL screenshots only. */
  screenshots: Image[];
  related: string[];
  content: Localized<ProductContent>;
};

const common = {
  faqMedical: {
    en: {
      q: "Is this medical or nutritional advice?",
      a: "No. Ground & Mother shares food-first education and practical inspiration. It does not replace advice from your doctor, midwife, paediatrician or a registered dietitian, especially for allergies, medical conditions or concerns about growth.",
    },
    es: {
      q: "¿Es esto un consejo médico o nutricional?",
      a: "No. Ground & Mother comparte educación centrada en los alimentos e inspiración práctica. No sustituye el consejo de tu médico, matrona, pediatra o dietista-nutricionista, sobre todo ante alergias, condiciones médicas o dudas sobre el crecimiento.",
    },
  },
  faqWhen: {
    en: {
      q: "When will it be available?",
      a: "It is in development. We will announce the release date and price in the Ground & Mother letter and on this page — nothing is for sale until the button here says so.",
    },
    es: {
      q: "¿Cuándo estará disponible?",
      a: "Está en desarrollo. Anunciaremos la fecha y el precio en la carta de Ground & Mother y en esta página: nada está a la venta hasta que este botón lo indique.",
    },
  },
  faqCheckout: {
    en: {
      q: "How does checkout work?",
      a: "Payments are handled securely by Gumroad, our payment provider. Checkout opens in a window over this page, and Gumroad sends your receipt by email.",
    },
    es: {
      q: "¿Cómo funciona el pago?",
      a: "Los pagos los gestiona de forma segura Gumroad, nuestro proveedor de pagos. El pago se abre en una ventana sobre esta página y Gumroad te envía el recibo por correo electrónico.",
    },
  },
  faqAppAccess: {
    en: {
      q: "How will I access the app after buying?",
      a: "The app will live at its own address and you will sign in with the email you used at checkout. Your purchase is confirmed server-side before access is granted — never by a link alone.",
    },
    es: {
      q: "¿Cómo accederé a la aplicación después de comprarla?",
      a: "La aplicación tendrá su propia dirección y entrarás con el correo que usaste al pagar. Tu compra se confirma en el servidor antes de dar acceso; nunca solo mediante un enlace.",
    },
  },
};

export const products: Product[] = [
  // ───────────────────────────── FIRST FOODS ─────────────────────────────
  {
    slug: "first-foods-companion",
    collection: "first-foods",
    type: "app",
    status: "coming-soon",
    featured: true,
    price: null,
    currency: "USD",
    billing: "one-time",
    checkoutUrl: null,
    gumroadProductId: null,
    accessUrl: null,
    requiresAccessControl: true,
    tone: "yolk",
    image: null,
    gallery: [],
    screenshots: [],
    related: ["the-iron-edit", "family-food-studio"],
    content: {
      en: {
        title: "First Foods Companion",
        short: "An interactive companion for the first months at the table.",
        standfirst: "A quiet, well-made place to explore first foods, keep a record of each new taste and plan the week ahead — designed for the kitchen, not the clinic.",
        description: [
          "The first months of eating are full of small decisions: which food next, how to prepare it, what texture, what to buy on Saturday. Most of that thinking happens in notes apps, screenshots and half-remembered conversations.",
          "First Foods Companion gathers it into one calm place. Explore real, nutrient-dense foods one at a time, note how each one was received, and turn it all into meals and a shopping list for the days ahead.",
        ],
        audience: "Parents and caregivers beginning solid foods with a baby, and anyone who wants to build a food-first approach to the early table.",
        problem: "Information about first foods is scattered and often contradictory. The Companion gives you one tidy, food-first place to explore, remember and plan.",
        features: [
          { title: "Food explorer", body: "Browse foods one by one, with preparation notes and ideas for age-appropriate textures." },
          { title: "Food journal", body: "Record each new food, the date and how it went, so patterns are easy to see." },
          { title: "Meal inspiration", body: "Simple ideas that bring single foods together into family-style plates." },
          { title: "Shopping list", body: "Turn the week's plan into a list for the market or the shop." },
          { title: "Your food journey", body: "A personal timeline of every food your child has met." },
        ],
        included: ["Access to the First Foods Companion web app", "Updates as new foods and ideas are added", "Works on phone, tablet and computer"],
        faqs: [common.faqWhen.en, common.faqAppAccess.en, common.faqCheckout.en, common.faqMedical.en],
        imageBrief: "Close-up, window light: a small hand reaching for a soft-cooked egg yolk on a wooden spoon.",
      },
      es: {
        title: "First Foods Companion",
        short: "Una compañera interactiva para los primeros meses en la mesa.",
        standfirst: "Un lugar tranquilo y bien hecho para explorar los primeros alimentos, registrar cada nuevo sabor y planificar la semana; pensado para la cocina, no para la consulta.",
        description: [
          "Los primeros meses de alimentación están llenos de pequeñas decisiones: qué alimento ofrecer después, cómo prepararlo, con qué textura, qué comprar el sábado. Casi todo eso vive en notas del móvil, capturas de pantalla y conversaciones a medio recordar.",
          "First Foods Companion lo reúne en un solo lugar sereno. Explora alimentos reales y densos en nutrientes uno a uno, anota cómo fue cada uno y conviértelo todo en comidas y una lista de la compra para los próximos días.",
        ],
        audience: "Madres, padres y cuidadores que empiezan con los alimentos sólidos, y cualquiera que quiera construir una mesa temprana centrada en la comida real.",
        problem: "La información sobre los primeros alimentos está dispersa y a menudo es contradictoria. La Companion te ofrece un único lugar ordenado para explorar, recordar y planificar.",
        features: [
          { title: "Explorador de alimentos", body: "Recorre los alimentos uno a uno, con notas de preparación e ideas de texturas adecuadas a cada edad." },
          { title: "Diario de alimentos", body: "Registra cada alimento nuevo, la fecha y cómo fue, para ver los patrones con claridad." },
          { title: "Inspiración para comidas", body: "Ideas sencillas para unir alimentos sueltos en platos de familia." },
          { title: "Lista de la compra", body: "Convierte el plan de la semana en una lista para el mercado." },
          { title: "Tu recorrido", body: "Una línea del tiempo personal con cada alimento que tu hijo o hija ha conocido." },
        ],
        included: ["Acceso a la aplicación web First Foods Companion", "Actualizaciones con nuevos alimentos e ideas", "Funciona en móvil, tableta y ordenador"],
        faqs: [common.faqWhen.es, common.faqAppAccess.es, common.faqCheckout.es, common.faqMedical.es],
        imageBrief: "Primer plano con luz de ventana: una mano pequeña alcanza una yema cocida en una cuchara de madera.",
      },
    },
  },
  {
    slug: "the-iron-edit",
    collection: "first-foods",
    type: "guide",
    status: "coming-soon",
    featured: true,
    price: null,
    currency: "USD",
    billing: "one-time",
    checkoutUrl: null,
    gumroadProductId: null,
    accessUrl: null,
    requiresAccessControl: false,
    tone: "clay",
    image: null,
    gallery: [],
    screenshots: [],
    related: ["first-foods-companion", "the-nourishment-library-collection"],
    content: {
      en: {
        title: "The Iron Edit",
        short: "An edited guide to iron-rich foods and how to bring them to the table.",
        standfirst: "Iron-rich foods, gathered and edited — with practical ways to prepare them for little ones and the rest of the family.",
        description: [
          "Iron-rich foods are among the most talked-about and least-cooked foods of the first years. The Iron Edit is a practical, beautifully set guide to the foods themselves: where they come from, how they have been prepared in traditional kitchens, and how to make them part of an ordinary week.",
        ],
        audience: "Families introducing first foods, and parents who want more iron-rich foods on the shared table.",
        problem: "Knowing a food matters is different from knowing what to do with it on a Tuesday evening. The Iron Edit is about the cooking.",
        features: [
          { title: "A curated food list", body: "Animal and plant foods, organised for the kitchen rather than the textbook." },
          { title: "Preparation notes", body: "Textures and methods suited to babies, toddlers and the whole family." },
          { title: "Weekly inspiration", body: "Simple ways to rotate iron-rich foods through ordinary meals." },
        ],
        included: ["Digital guide (PDF)", "Printable kitchen reference"],
        faqs: [common.faqWhen.en, common.faqCheckout.en, common.faqMedical.en],
        imageBrief: "Overhead on linen: chicken livers, a bowl of lentils, a marrow bone and a cast-iron pan.",
      },
      es: {
        title: "The Iron Edit",
        short: "Una guía editada de alimentos ricos en hierro y cómo llevarlos a la mesa.",
        standfirst: "Alimentos ricos en hierro, reunidos y editados, con formas prácticas de prepararlos para los más pequeños y para toda la familia.",
        description: [
          "Los alimentos ricos en hierro están entre los más mencionados y los menos cocinados de los primeros años. The Iron Edit es una guía práctica y cuidadosamente diseñada sobre los alimentos en sí: de dónde vienen, cómo se han preparado en las cocinas tradicionales y cómo hacerlos parte de una semana corriente.",
        ],
        audience: "Familias que introducen los primeros alimentos y quienes quieren más alimentos ricos en hierro en la mesa compartida.",
        problem: "Saber que un alimento importa no es lo mismo que saber qué hacer con él un martes por la noche. The Iron Edit trata de cocinar.",
        features: [
          { title: "Una lista curada", body: "Alimentos de origen animal y vegetal, organizados para la cocina y no para el manual." },
          { title: "Notas de preparación", body: "Texturas y métodos para bebés, niños pequeños y toda la familia." },
          { title: "Inspiración semanal", body: "Formas sencillas de rotar alimentos ricos en hierro en las comidas de cada día." },
        ],
        included: ["Guía digital (PDF)", "Referencia imprimible para la cocina"],
        faqs: [common.faqWhen.es, common.faqCheckout.es, common.faqMedical.es],
        imageBrief: "Cenital sobre lino: hígados de pollo, un cuenco de lentejas, un hueso de caña y una sartén de hierro.",
      },
    },
  },

  // ───────────────────────────── MOTHER ─────────────────────────────
  {
    slug: "the-preconception-pantry",
    collection: "mother",
    type: "app",
    status: "coming-soon",
    featured: true,
    price: null,
    currency: "USD",
    billing: "one-time",
    checkoutUrl: null,
    gumroadProductId: null,
    accessUrl: null,
    requiresAccessControl: true,
    tone: "sage",
    image: null,
    gallery: [],
    screenshots: [],
    related: ["the-nourishment-journal", "the-iron-edit"],
    content: {
      en: {
        title: "The Preconception Pantry",
        short: "An interactive pantry for nourishing the season before pregnancy.",
        standfirst: "An interactive food and pantry resource for the months before conception — what to keep on the shelf, and how to cook from it.",
        description: [
          "Preparing for pregnancy often begins with a list of things to avoid. The Preconception Pantry begins with what to cook. It is an interactive pantry: browse nutrient-dense staples, build your own shelf, and find simple ways to use what you keep.",
        ],
        audience: "Women and couples preparing for pregnancy who want a food-first, practical place to start.",
        problem: "Preconception advice tends to arrive as rules. The Pantry turns it into a kitchen.",
        features: [
          { title: "Pantry explorer", body: "Nutrient-dense staples, organised by shelf, fridge and freezer." },
          { title: "Your pantry", body: "Mark what you keep and see what to stock next." },
          { title: "Cooking from the shelf", body: "Simple meal ideas built from what is already there." },
        ],
        included: ["Access to The Preconception Pantry web app", "Updates as new foods are added"],
        faqs: [common.faqWhen.en, common.faqAppAccess.en, common.faqCheckout.en, common.faqMedical.en],
        imageBrief: "A pantry shelf in morning light: jars of ghee, dried beans, honey, sardine tins, a linen cloth.",
      },
      es: {
        title: "The Preconception Pantry",
        short: "Una despensa interactiva para nutrir la etapa anterior al embarazo.",
        standfirst: "Un recurso interactivo de alimentos y despensa para los meses previos a la concepción: qué tener en la alacena y cómo cocinar con ello.",
        description: [
          "Prepararse para un embarazo suele empezar con una lista de cosas que evitar. The Preconception Pantry empieza por lo que se cocina. Es una despensa interactiva: explora alimentos básicos densos en nutrientes, arma tu propia alacena y encuentra formas sencillas de usar lo que guardas.",
        ],
        audience: "Mujeres y parejas que se preparan para un embarazo y buscan un punto de partida práctico y centrado en la comida.",
        problem: "Los consejos previos al embarazo suelen llegar en forma de reglas. La Pantry los convierte en una cocina.",
        features: [
          { title: "Explorador de despensa", body: "Básicos densos en nutrientes, organizados por alacena, nevera y congelador." },
          { title: "Tu despensa", body: "Marca lo que tienes y descubre qué reponer." },
          { title: "Cocinar con lo que hay", body: "Ideas sencillas a partir de lo que ya está en casa." },
        ],
        included: ["Acceso a la aplicación web The Preconception Pantry", "Actualizaciones con nuevos alimentos"],
        faqs: [common.faqWhen.es, common.faqAppAccess.es, common.faqCheckout.es, common.faqMedical.es],
        imageBrief: "Una alacena con luz de mañana: tarros de ghee, legumbres secas, miel, latas de sardinas, un paño de lino.",
      },
    },
  },
  {
    slug: "the-nourishment-journal",
    collection: "mother",
    type: "app",
    status: "coming-soon",
    featured: false,
    price: null,
    currency: "USD",
    billing: "one-time",
    checkoutUrl: null,
    gumroadProductId: null,
    accessUrl: null,
    requiresAccessControl: true,
    tone: "linen",
    image: null,
    gallery: [],
    screenshots: [],
    related: ["the-preconception-pantry", "family-food-studio"],
    content: {
      en: {
        title: "The Nourishment Journal",
        short: "A structured digital journal for the way you eat and feel.",
        standfirst: "A structured, private journal for noticing what nourishes you — through preconception, pregnancy and the months after birth.",
        description: [
          "Some of the most useful knowledge about nourishment is personal: what you ate, how you slept, what you craved, what helped. The Nourishment Journal gives that knowledge a structure, with gentle prompts and a clear record you can look back on.",
        ],
        audience: "Mothers and mothers-to-be who want a calm, structured way to pay attention to their own nourishment.",
        problem: "Paper journals get lost and generic trackers count the wrong things. This one is made for the season you are in.",
        features: [
          { title: "Daily pages", body: "Meals, energy and notes, in a few quiet minutes." },
          { title: "Seasonal prompts", body: "Prompts for preconception, pregnancy and postpartum." },
          { title: "Looking back", body: "A clear record of weeks and months." },
        ],
        included: ["Access to The Nourishment Journal web app"],
        faqs: [common.faqWhen.en, common.faqAppAccess.en, common.faqCheckout.en, common.faqMedical.en],
        imageBrief: "A mother's hands holding a warm cup beside an open notebook on a kitchen table.",
      },
      es: {
        title: "The Nourishment Journal",
        short: "Un diario digital estructurado sobre cómo comes y cómo te sientes.",
        standfirst: "Un diario privado y estructurado para notar lo que te nutre, durante la preconcepción, el embarazo y los meses después del parto.",
        description: [
          "Parte del conocimiento más útil sobre la alimentación es personal: qué comiste, cómo dormiste, qué te apetecía, qué te ayudó. The Nourishment Journal da estructura a ese conocimiento, con preguntas amables y un registro claro al que volver.",
        ],
        audience: "Madres y futuras madres que buscan una forma serena y ordenada de prestar atención a su propia alimentación.",
        problem: "Los cuadernos se pierden y las aplicaciones genéricas cuentan lo que no importa. Este está hecho para la etapa que vives.",
        features: [
          { title: "Páginas diarias", body: "Comidas, energía y notas, en pocos minutos tranquilos." },
          { title: "Preguntas por etapa", body: "Para la preconcepción, el embarazo y el posparto." },
          { title: "Mirar atrás", body: "Un registro claro de semanas y meses." },
        ],
        included: ["Acceso a la aplicación web The Nourishment Journal"],
        faqs: [common.faqWhen.es, common.faqAppAccess.es, common.faqCheckout.es, common.faqMedical.es],
        imageBrief: "Las manos de una madre sostienen una taza caliente junto a un cuaderno abierto en la mesa de la cocina.",
      },
    },
  },

  // ───────────────────────────── FAMILY ─────────────────────────────
  {
    slug: "family-food-studio",
    collection: "family",
    type: "app",
    status: "coming-soon",
    featured: true,
    price: null,
    currency: "USD",
    billing: "one-time",
    checkoutUrl: null,
    gumroadProductId: null,
    accessUrl: null,
    requiresAccessControl: true,
    tone: "forest",
    image: null,
    gallery: [],
    screenshots: [],
    related: ["first-foods-companion", "the-nourishment-library-collection"],
    content: {
      en: {
        title: "The Family Food Studio",
        short: "An interactive planning table for the whole family's week.",
        standfirst: "An interactive planning tool for cooking one nourishing table for everyone — from the baby in the high chair to the grandparents.",
        description: [
          "Family meals rarely fail for lack of recipes. They fail for lack of a plan that fits real life. The Family Food Studio helps you plan a week of shared, nourishing meals, adapt them for the smallest eaters and gather everything into one list.",
        ],
        audience: "Families who want to cook one meal for everyone, built around real, traditional food.",
        problem: "Cooking separate meals for each family member is exhausting. The Studio is built around one shared table.",
        features: [
          { title: "Week planner", body: "Lay out the week's meals in a few minutes." },
          { title: "Adapt for little ones", body: "Notes for serving each meal to babies and toddlers." },
          { title: "One list", body: "Everything you need, gathered and grouped." },
        ],
        included: ["Access to The Family Food Studio web app"],
        faqs: [common.faqWhen.en, common.faqAppAccess.en, common.faqCheckout.en, common.faqMedical.en],
        imageBrief: "A long table mid-meal, shot from the doorway: bowls passed hand to hand, a child kneeling on a chair.",
      },
      es: {
        title: "The Family Food Studio",
        short: "Una mesa de planificación interactiva para la semana de toda la familia.",
        standfirst: "Una herramienta interactiva para cocinar una sola mesa nutritiva para todos, del bebé en la trona a los abuelos.",
        description: [
          "Las comidas en familia rara vez fallan por falta de recetas. Fallan por falta de un plan que se ajuste a la vida real. The Family Food Studio te ayuda a planificar una semana de comidas compartidas y nutritivas, adaptarlas para los más pequeños y reunirlo todo en una sola lista.",
        ],
        audience: "Familias que quieren cocinar una sola comida para todos, alrededor de la comida real y tradicional.",
        problem: "Cocinar un plato distinto para cada miembro de la familia agota. El Studio gira en torno a una mesa compartida.",
        features: [
          { title: "Planificador semanal", body: "Organiza las comidas de la semana en pocos minutos." },
          { title: "Adaptar para los pequeños", body: "Notas para servir cada plato a bebés y niños pequeños." },
          { title: "Una sola lista", body: "Todo lo que necesitas, reunido y agrupado." },
        ],
        included: ["Acceso a la aplicación web The Family Food Studio"],
        faqs: [common.faqWhen.es, common.faqAppAccess.es, common.faqCheckout.es, common.faqMedical.es],
        imageBrief: "Una mesa larga a mitad de comida, desde la puerta: cuencos que pasan de mano en mano, un niño de rodillas en la silla.",
      },
    },
  },
  {
    slug: "the-nourishment-library-collection",
    collection: "family",
    type: "collection",
    status: "coming-soon",
    featured: false,
    price: null,
    currency: "USD",
    billing: "one-time",
    checkoutUrl: null,
    gumroadProductId: null,
    accessUrl: null,
    requiresAccessControl: false,
    tone: "broth",
    image: null,
    gallery: [],
    screenshots: [],
    related: ["the-iron-edit", "family-food-studio"],
    content: {
      en: {
        title: "The Nourishment Library",
        short: "A curated collection of Ground & Mother's educational resources.",
        standfirst: "A curated, downloadable collection of Ground & Mother resources — gathered in one place for the kitchen shelf.",
        description: [
          "The Nourishment Library collection brings our guides and printables together as a single, considered set: the reference you reach for while the pot is on the stove.",
        ],
        audience: "Families who want the full Ground & Mother reference set in one place.",
        problem: "Good resources are most useful when they live together. This is the shelf.",
        features: [
          { title: "Curated guides", body: "The core Ground & Mother guides, edited as a set." },
          { title: "Printables", body: "Kitchen references designed to be printed and kept." },
        ],
        included: ["Collection of digital guides (PDF)", "Printable references"],
        faqs: [common.faqWhen.en, common.faqCheckout.en, common.faqMedical.en],
        imageBrief: "A stack of printed guides on a wooden counter, a pot steaming out of focus behind.",
      },
      es: {
        title: "The Nourishment Library",
        short: "Una colección curada de los recursos educativos de Ground & Mother.",
        standfirst: "Una colección descargable y curada de recursos de Ground & Mother, reunidos para el estante de la cocina.",
        description: [
          "La colección The Nourishment Library reúne nuestras guías e imprimibles en un solo conjunto pensado: la referencia que buscas con la olla al fuego.",
        ],
        audience: "Familias que quieren todo el material de referencia de Ground & Mother en un solo lugar.",
        problem: "Los buenos recursos son más útiles cuando viven juntos. Este es el estante.",
        features: [
          { title: "Guías curadas", body: "Las guías esenciales de Ground & Mother, editadas como conjunto." },
          { title: "Imprimibles", body: "Referencias de cocina para imprimir y conservar." },
        ],
        included: ["Colección de guías digitales (PDF)", "Referencias imprimibles"],
        faqs: [common.faqWhen.es, common.faqCheckout.es, common.faqMedical.es],
        imageBrief: "Una pila de guías impresas sobre una encimera de madera, una olla humeante desenfocada al fondo.",
      },
    },
  },

  // ───────────────────────────── EXAMPLE: UNPUBLISHED ─────────────────────────────
  // Unpublished products never appear on the site. Kept here as a working example of the status.
  {
    slug: "first-years-kitchen-workshop",
    collection: "first-years",
    type: "workshop",
    status: "unpublished",
    featured: false,
    price: null,
    currency: "USD",
    billing: "one-time",
    checkoutUrl: null,
    gumroadProductId: null,
    accessUrl: null,
    requiresAccessControl: false,
    tone: "clay",
    image: null,
    gallery: [],
    screenshots: [],
    related: [],
    content: {
      en: {
        title: "Cooking with Little Hands (draft)",
        short: "Draft workshop concept — not public.",
        standfirst: "Draft.",
        description: ["Draft."],
        audience: "Draft.",
        problem: "Draft.",
        features: [],
        included: [],
        faqs: [],
      },
      es: {
        title: "Cocinar con manos pequeñas (borrador)",
        short: "Concepto de taller en borrador — no público.",
        standfirst: "Borrador.",
        description: ["Borrador."],
        audience: "Borrador.",
        problem: "Borrador.",
        features: [],
        included: [],
        faqs: [],
      },
    },
  },
];

// ───────────────────────────── Helpers ─────────────────────────────

export const collections: Collection[] = ["mother", "first-foods", "first-years", "family"];

/** Everything the public may see. Unpublished products are removed here, once, for the whole site. */
export function getPublishedProducts(): Product[] {
  return products.filter((p) => p.status !== "unpublished");
}

export function getProduct(slug: string): Product | undefined {
  return getPublishedProducts().find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return getPublishedProducts().filter((p) => p.featured);
}

export function isPurchasable(p: Product): boolean {
  return p.status === "available" && Boolean(p.checkoutUrl);
}

export function anyPurchasable(): boolean {
  return getPublishedProducts().some(isPurchasable);
}

export function productPath(p: Pick<Product, "type" | "slug">, locale: Locale): string {
  return p.type === "app" ? `/${locale}/apps/${p.slug}` : `/${locale}/shop/${p.slug}`;
}

export function getRelated(p: Product): Product[] {
  return p.related.map(getProduct).filter((x): x is Product => Boolean(x));
}

export function formatPrice(p: Product, locale: Locale): string | null {
  if (p.price == null) return null;
  const amount = new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
    style: "currency",
    currency: p.currency,
    minimumFractionDigits: Number.isInteger(p.price) ? 0 : 2,
  }).format(p.price);
  return amount;
}
