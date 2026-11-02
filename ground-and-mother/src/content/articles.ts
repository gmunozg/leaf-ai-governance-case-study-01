/**
 * THE NOURISHMENT LIBRARY — article index.
 *
 * Add an essay by adding an entry. `status: "published"` requires a body in both languages.
 * `status: "in-preparation"` shows the title and standfirst with an honest "In preparation" label.
 *
 * Editorial rules: no invented research, references, credentials or health claims. If an essay cites
 * a study, add it to `sources` with a real, checkable link.
 */
import type { Locale, Localized } from "@/i18n/config";
import type { Tone, Collection } from "./products";

export type CategoryId = "traditional-nourishment" | "maternal-nutrition" | "first-foods" | "family-food-culture" | "food-preparation";
export type Pillar = Exclude<Collection, "family">;

export const categories: { id: CategoryId; label: Localized }[] = [
  { id: "traditional-nourishment", label: { en: "Traditional Nourishment", es: "Nutrición tradicional" } },
  { id: "maternal-nutrition", label: { en: "Maternal Nutrition", es: "Alimentación materna" } },
  { id: "first-foods", label: { en: "First Foods", es: "Primeros alimentos" } },
  { id: "family-food-culture", label: { en: "Family Food Culture", es: "Cultura alimentaria familiar" } },
  { id: "food-preparation", label: { en: "Food Preparation", es: "Preparación de alimentos" } },
];

export type Block = { type: "p"; text: string } | { type: "h2"; text: string } | { type: "quote"; text: string };

export type Article = {
  slug: string;
  status: "published" | "in-preparation";
  category: CategoryId;
  pillar: Pillar | null;
  featured: boolean;
  /** ISO date of publication (published essays only). */
  date: string | null;
  tone: Tone;
  /** Product slugs to recommend alongside the essay. */
  relatedProducts: string[];
  sources: { title: string; url: string }[];
  content: Localized<{ title: string; standfirst: string; body: Block[]; imageBrief: string }>;
};

export const articles: Article[] = [
  {
    slug: "why-we-begin-at-the-table",
    status: "published",
    category: "traditional-nourishment",
    pillar: null,
    featured: true,
    date: "2026-11-02",
    tone: "broth",
    relatedProducts: ["the-nourishment-library-collection"],
    sources: [],
    content: {
      en: {
        title: "Why we begin at the table",
        standfirst: "A note from the editors on what the Nourishment Library is for, and how it will grow.",
        imageBrief: "An empty kitchen table at dawn, a single bowl and spoon, light raking across the wood.",
        body: [
          { type: "p", text: "Every family has a table, even when it is only a corner of a counter. It is where food stops being information and becomes something shared: passed, tasted, refused, asked for again. We chose to begin there." },
          { type: "p", text: "There is no shortage of advice about feeding mothers and children. Much of it arrives as charts, percentages and warnings. Some of it is useful. Very little of it tells you what to cook on a Tuesday, how your grandmother made broth, or how to bring a baby into the rhythm of a family meal." },
          { type: "h2", text: "What this Library is" },
          { type: "p", text: "The Nourishment Library is our editorial home. It holds essays on traditional nourishment, maternal food, first foods, family food culture and the craft of preparation. Each essay is written to be read slowly and returned to — closer to a cookbook's headnote than to a feed." },
          { type: "p", text: "We are interested in foodways: the accumulated, practical knowledge of how communities have fed their mothers and children. Broths and stews. Eggs and organ meats. Fermented foods. Slow-cooked grains and legumes. We read these traditions with curiosity rather than nostalgia, and we try to translate them into ordinary weeks." },
          { type: "quote", text: "Food stops being information at the table, and becomes something shared." },
          { type: "h2", text: "What it is not" },
          { type: "p", text: "It is not medical advice, and it does not replace the people who know your family: your doctor, midwife, paediatrician or dietitian. We do not sell supplements or make health claims. When an essay draws on research, we will cite it plainly so you can read it for yourself." },
          { type: "h2", text: "How it will grow" },
          { type: "p", text: "Slowly, and in three chapters: Mother, First Foods and First Years. Some essays are already listed as “in preparation”. They will appear when they are ready, not before. If there is something you would like us to write about, the letter is the best place to tell us." },
        ],
      },
      es: {
        title: "Por qué empezamos en la mesa",
        standfirst: "Una nota de la redacción sobre para qué sirve la Biblioteca de la Nutrición y cómo crecerá.",
        imageBrief: "Una mesa de cocina vacía al amanecer, un solo cuenco y una cuchara, la luz rasante sobre la madera.",
        body: [
          { type: "p", text: "Toda familia tiene una mesa, aunque sea solo una esquina de la encimera. Es donde la comida deja de ser información y se convierte en algo compartido: se pasa, se prueba, se rechaza, se vuelve a pedir. Elegimos empezar ahí." },
          { type: "p", text: "No faltan consejos sobre cómo alimentar a madres y niños. Gran parte llega en forma de tablas, porcentajes y advertencias. Algunos son útiles. Muy pocos te dicen qué cocinar un martes, cómo hacía el caldo tu abuela o cómo integrar a un bebé en el ritmo de una comida familiar." },
          { type: "h2", text: "Qué es esta Biblioteca" },
          { type: "p", text: "La Biblioteca de la Nutrición es nuestra casa editorial. Reúne ensayos sobre nutrición tradicional, alimentación materna, primeros alimentos, cultura alimentaria familiar y el oficio de la preparación. Cada ensayo está escrito para leerse despacio y volver a él: más cerca de la entradilla de un recetario que de un feed." },
          { type: "p", text: "Nos interesan las tradiciones culinarias: el saber práctico y acumulado de cómo las comunidades han alimentado a sus madres y a sus hijos. Caldos y guisos. Huevos y vísceras. Fermentados. Cereales y legumbres cocidos a fuego lento. Leemos estas tradiciones con curiosidad y no con nostalgia, e intentamos traducirlas a semanas corrientes." },
          { type: "quote", text: "En la mesa, la comida deja de ser información y se convierte en algo compartido." },
          { type: "h2", text: "Qué no es" },
          { type: "p", text: "No es consejo médico ni sustituye a quienes conocen a tu familia: tu médico, matrona, pediatra o dietista-nutricionista. No vendemos suplementos ni hacemos declaraciones de salud. Cuando un ensayo se apoye en una investigación, la citaremos con claridad para que puedas leerla tú misma." },
          { type: "h2", text: "Cómo crecerá" },
          { type: "p", text: "Despacio, y en tres capítulos: Madre, Primeros alimentos y Primeros años. Algunos ensayos ya figuran como «en preparación». Aparecerán cuando estén listos, no antes. Si hay algo sobre lo que te gustaría que escribiéramos, la carta es el mejor lugar para decírnoslo." },
        ],
      },
    },
  },
  {
    slug: "the-stockpot-as-an-heirloom",
    status: "published",
    category: "food-preparation",
    pillar: "first-years",
    featured: false,
    date: "2026-11-02",
    tone: "clay",
    relatedProducts: ["family-food-studio"],
    sources: [],
    content: {
      en: {
        title: "The stockpot as an heirloom",
        standfirst: "On keeping a pot of broth going, and the quiet rhythm it brings to a family kitchen.",
        imageBrief: "A dented enamel stockpot on a low flame, steam catching the window light, bones and onion skins visible.",
        body: [
          { type: "p", text: "In many kitchens the most valuable object is not a knife or a machine but a pot: wide, heavy, a little dented, used so often it rarely makes it back into the cupboard. Into it go the bones from Sunday's roast, the ends of onions and carrots, a bay leaf, cold water. Out of it, hours later, comes the base of the week." },
          { type: "h2", text: "A practice, not a recipe" },
          { type: "p", text: "Broth is less a recipe than a habit. It asks very little: something to simmer, time, and the willingness to save what would otherwise be thrown away. That is part of its appeal for families. It turns leftovers into a beginning, and it makes the next meal easier before you have even decided what it is." },
          { type: "p", text: "A jar of broth in the fridge becomes soup on a tired evening, the liquid for a pot of rice or lentils, a soft braise for a toddler, a warm cup for a mother who has not sat down all day. Cooks in many traditions have kept a pot like this going for exactly these reasons." },
          { type: "quote", text: "It turns leftovers into a beginning." },
          { type: "h2", text: "Starting your own" },
          { type: "p", text: "Keep a bag in the freezer for bones, vegetable ends and herb stalks. When it is full, tip it into your largest pot, cover with cold water, add a splash of vinegar if you like, and bring it slowly to a gentle simmer. Skim, lower the heat, and let it be. Strain, cool quickly, and keep it in jars." },
          { type: "p", text: "There is no perfect broth. Some weeks it will be rich and wobbly, some weeks thin and golden. Both are worth keeping. The heirloom is not the pot itself, but the rhythm: something always simmering, something always saved, a kitchen that feeds itself forward." },
        ],
      },
      es: {
        title: "La olla de caldo como herencia",
        standfirst: "Sobre mantener una olla de caldo en marcha y el ritmo tranquilo que trae a la cocina familiar.",
        imageBrief: "Una olla esmaltada abollada a fuego bajo, el vapor atrapando la luz de la ventana, huesos y pieles de cebolla a la vista.",
        body: [
          { type: "p", text: "En muchas cocinas el objeto más valioso no es un cuchillo ni una máquina, sino una olla: ancha, pesada, un poco abollada, usada tan a menudo que rara vez vuelve al armario. En ella van los huesos del asado del domingo, los extremos de cebollas y zanahorias, una hoja de laurel, agua fría. De ella sale, horas después, la base de la semana." },
          { type: "h2", text: "Una práctica, no una receta" },
          { type: "p", text: "El caldo es menos una receta que un hábito. Pide muy poco: algo que cocer a fuego lento, tiempo y la voluntad de guardar lo que de otro modo se tiraría. Ahí está parte de su atractivo para las familias. Convierte las sobras en un comienzo y hace más fácil la siguiente comida antes incluso de decidir cuál será." },
          { type: "p", text: "Un tarro de caldo en la nevera se convierte en sopa una noche cansada, en el líquido para una olla de arroz o lentejas, en un guiso tierno para un niño pequeño, en una taza caliente para una madre que no se ha sentado en todo el día. Cocineras y cocineros de muchas tradiciones han mantenido una olla así precisamente por eso." },
          { type: "quote", text: "Convierte las sobras en un comienzo." },
          { type: "h2", text: "Empezar la tuya" },
          { type: "p", text: "Guarda una bolsa en el congelador para huesos, restos de verduras y tallos de hierbas. Cuando esté llena, vuélcala en tu olla más grande, cúbrela con agua fría, añade un chorrito de vinagre si quieres y llévala despacio a un hervor suave. Espuma, baja el fuego y déjala estar. Cuela, enfría rápido y guárdala en tarros." },
          { type: "p", text: "No existe el caldo perfecto. Algunas semanas será denso y gelatinoso; otras, ligero y dorado. Los dos merecen guardarse. La herencia no es la olla en sí, sino el ritmo: algo siempre al fuego, algo siempre guardado, una cocina que se alimenta hacia delante." },
        ],
      },
    },
  },
  {
    slug: "how-we-write",
    status: "published",
    category: "traditional-nourishment",
    pillar: null,
    featured: false,
    date: "2026-11-02",
    tone: "linen",
    relatedProducts: [],
    sources: [],
    content: {
      en: {
        title: "How we write",
        standfirst: "The editorial standards behind every essay in the Library.",
        imageBrief: "A desk by a window: a cookbook open, handwritten notes, a pencil and a cup of tea going cold.",
        body: [
          { type: "p", text: "Writing about food for mothers and children carries responsibility. These are the standards we hold ourselves to, published so you can hold us to them too." },
          { type: "h2", text: "Food first, and honest about it" },
          { type: "p", text: "We write about food: what it is, where it comes from, how it has been prepared and how to cook it today. We do not promise outcomes, cure conditions or tell anyone what their body needs. That is the work of qualified professionals who know you." },
          { type: "h2", text: "Sources you can check" },
          { type: "p", text: "When an essay refers to research, we link to it directly. We do not invent studies, statistics or experts, and we will correct mistakes openly when we find them." },
          { type: "h2", text: "No testimonials, no borrowed authority" },
          { type: "p", text: "We do not publish testimonials, endorsements or invented credentials. Our work should stand on its own, and you should be able to judge it for yourself." },
          { type: "h2", text: "Tradition, read closely" },
          { type: "p", text: "Traditional foodways are a source of practical wisdom, not a set of commandments. We describe them carefully, credit the cultures they come from, and leave room for every family to make its own choices." },
        ],
      },
      es: {
        title: "Cómo escribimos",
        standfirst: "Los criterios editoriales detrás de cada ensayo de la Biblioteca.",
        imageBrief: "Un escritorio junto a una ventana: un recetario abierto, notas a mano, un lápiz y una taza de té enfriándose.",
        body: [
          { type: "p", text: "Escribir sobre comida para madres y niños conlleva responsabilidad. Estos son los criterios que nos exigimos, publicados para que tú también puedas exigírnoslos." },
          { type: "h2", text: "Primero la comida, y con honestidad" },
          { type: "p", text: "Escribimos sobre comida: qué es, de dónde viene, cómo se ha preparado y cómo cocinarla hoy. No prometemos resultados, no curamos dolencias ni le decimos a nadie lo que necesita su cuerpo. Ese es el trabajo de profesionales cualificados que te conocen." },
          { type: "h2", text: "Fuentes que puedes comprobar" },
          { type: "p", text: "Cuando un ensayo se refiere a una investigación, enlazamos a ella directamente. No inventamos estudios, estadísticas ni expertos, y corregimos los errores abiertamente cuando los encontramos." },
          { type: "h2", text: "Sin testimonios ni autoridad prestada" },
          { type: "p", text: "No publicamos testimonios, avales ni credenciales inventadas. Nuestro trabajo debe sostenerse por sí mismo, y tú debes poder juzgarlo." },
          { type: "h2", text: "La tradición, leída con atención" },
          { type: "p", text: "Las tradiciones culinarias son una fuente de sabiduría práctica, no un conjunto de mandamientos. Las describimos con cuidado, reconocemos las culturas de las que provienen y dejamos espacio para que cada familia tome sus propias decisiones." },
        ],
      },
    },
  },

  // ───────────── In preparation: titles and standfirsts only, clearly labelled on the site ─────────────
  ...([
    ["the-postpartum-kitchen", "maternal-nutrition", "mother", "yolk",
      "The postpartum kitchen", "Warming, restoring foods for the weeks after birth, and the traditions that surround them.",
      "La cocina del posparto", "Alimentos cálidos y reparadores para las semanas después del parto, y las tradiciones que los rodean."],
    ["a-pantry-for-the-season-before", "maternal-nutrition", "mother", "sage",
      "A pantry for the season before", "What to keep on the shelf in the months before pregnancy, and how to cook from it.",
      "Una despensa para la etapa previa", "Qué tener en la alacena en los meses antes del embarazo, y cómo cocinar con ello."],
    ["a-short-history-of-first-foods", "first-foods", "first-foods", "yolk",
      "Egg yolk, liver, broth: a short history of first foods", "What babies were first fed in kitchens around the world, before the jar.",
      "Yema, hígado, caldo: breve historia de los primeros alimentos", "Qué comían primero los bebés en las cocinas del mundo, antes de los potitos."],
    ["textures-one-month-at-a-time", "food-preparation", "first-foods", "clay",
      "Textures, one month at a time", "From smooth to soft to everything else: the kitchen craft of first foods.",
      "Texturas, mes a mes", "De lo liso a lo blando y a todo lo demás: el oficio de los primeros alimentos."],
    ["bringing-the-baby-to-the-family-table", "family-food-culture", "first-years", "forest",
      "Bringing the baby to the family table", "One meal for everyone, adapted gently for the smallest eater.",
      "Llevar al bebé a la mesa familiar", "Una sola comida para todos, adaptada con suavidad para el comensal más pequeño."],
    ["small-hands-in-the-kitchen", "family-food-culture", "first-years", "linen",
      "Small hands in the kitchen", "Real tasks for toddlers and young children, and why the mess is worth it.",
      "Manos pequeñas en la cocina", "Tareas reales para niños pequeños, y por qué el desorden merece la pena."],
  ] as const).map(([slug, category, pillar, tone, enT, enS, esT, esS]): Article => ({
    slug,
    status: "in-preparation",
    category,
    pillar,
    featured: false,
    date: null,
    tone,
    relatedProducts: [],
    sources: [],
    content: {
      en: { title: enT, standfirst: enS, body: [], imageBrief: "" },
      es: { title: esT, standfirst: esS, body: [], imageBrief: "" },
    },
  })),
];

// ───────────── Helpers ─────────────

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function categoryLabel(id: CategoryId, locale: Locale) {
  return categories.find((c) => c.id === id)!.label[locale];
}

export function readingMinutes(a: Article, locale: Locale) {
  const words = a.content[locale].body.reduce((n, b) => n + b.text.split(/\s+/).length, 0);
  return Math.max(1, Math.ceil(words / 200));
}

export function relatedArticles(a: Article, limit = 3) {
  const others = articles.filter((x) => x.slug !== a.slug);
  const score = (x: Article) => (x.pillar && x.pillar === a.pillar ? 2 : 0) + (x.category === a.category ? 1 : 0) + (x.status === "published" ? 0.5 : 0);
  return others.sort((x, y) => score(y) - score(x)).slice(0, limit);
}

export function articlesForPillar(p: Pillar) {
  return articles.filter((a) => a.pillar === p);
}
