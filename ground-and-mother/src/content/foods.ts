/**
 * THE FOOD JOURNAL — entries for the interactive food exploration on the home page.
 *
 * Editorial rules: general, well-established food facts only; qualify anything that varies;
 * no health promises. Pregnancy and baby notes point readers to local guidance.
 * Photographs: set `image` once a licensed photograph is in public/images/food/ and
 * recorded in PHOTO_CREDITS.md. Until then a labelled placeholder carries the brief.
 */
import type { Localized } from "@/i18n/config";
import type { Image, Tone } from "./products";
import type { Motif } from "@/components/StillLife";

export type FoodEntry = {
  name: string;
  /** one line under the name, always visible */
  line: string;
  nutrition: string;
  tradition: string;
  kitchen: string;
  tryThis: string;
  /** safety or guidance note, shown highlighted */
  note?: string;
  brief: string;
};

export type Food = {
  id: string;
  tone: Tone;
  motif: Motif;
  image: Image | null;
  content: Localized<FoodEntry>;
};

export const foodSources: { label: Localized; url: string }[] = [
  { label: { en: "USDA FoodData Central (food composition)", es: "USDA FoodData Central (composición de alimentos)" }, url: "https://fdc.nal.usda.gov/" },
  { label: { en: "NHS: foods to avoid in pregnancy", es: "NHS: alimentos que evitar en el embarazo" }, url: "https://www.nhs.uk/pregnancy/keeping-well/foods-to-avoid/" },
  { label: { en: "NHS: foods to avoid giving babies and young children", es: "NHS: alimentos que no conviene dar a bebés y niños pequeños" }, url: "https://www.nhs.uk/conditions/baby/weaning-and-feeding/foods-to-avoid-giving-babies-and-young-children/" },
];

export const foods: Food[] = [
  {
    id: "egg-yolk",
    tone: "yolk",
    motif: "eggs",
    image: null,
    content: {
      en: {
        name: "Egg yolk",
        line: "Small, golden and quietly rich.",
        nutrition: "The yolk holds most of an egg's fat, along with the fat-soluble vitamins A, D, E and K, and choline. Amounts vary with what the hen has eaten.",
        tradition: "In many family kitchens a soft, well-mashed yolk has been among the first foods offered to a baby.",
        kitchen: "Enriches custards, sauces and fresh pasta, and binds and emulsifies dressings.",
        tryThis: "Stir a cooked yolk through warm rice or mashed vegetables.",
        note: "Guidance on runny eggs for babies and during pregnancy differs between countries. Follow your local advice.",
        brief: "Two halved soft-boiled eggs on a dark plate, morning window light, film grain.",
      },
      es: {
        name: "Yema de huevo",
        line: "Pequeña, dorada y discretamente rica.",
        nutrition: "La yema concentra casi toda la grasa del huevo, junto con las vitaminas liposolubles A, D, E y K, y la colina. Las cantidades varían según la alimentación de la gallina.",
        tradition: "En muchas cocinas familiares, una yema bien cocida y aplastada ha estado entre los primeros alimentos que se ofrecían al bebé.",
        kitchen: "Enriquece natillas, salsas y pasta fresca, y liga y emulsiona aliños.",
        tryThis: "Mezcla una yema cocida con arroz templado o verduras en puré.",
        note: "Las recomendaciones sobre huevos poco hechos para bebés y durante el embarazo cambian según el país. Sigue las indicaciones de tu zona.",
        brief: "Dos huevos pasados por agua partidos por la mitad en un plato oscuro, luz de mañana, grano de película.",
      },
    },
  },
  {
    id: "butter",
    tone: "linen",
    motif: "butter",
    image: null,
    content: {
      en: {
        name: "Butter",
        line: "The fat that carries flavour.",
        nutrition: "Butter is mostly milk fat, with small amounts of vitamin A. Butter from grass-fed cows is often more golden, coloured by carotenoids from the grass.",
        tradition: "Cultured butter, churned from soured cream, is an old tradition in Northern Europe; ghee, butter clarified by slow heating, is central to South Asian cooking.",
        kitchen: "Browns, bastes and finishes; a spoonful turns plain vegetables into a dish.",
        tryThis: "Melt a little over steamed vegetables for the whole table.",
        brief: "A block of pale butter on wax paper, knife resting beside it, soft side light.",
      },
      es: {
        name: "Mantequilla",
        line: "La grasa que lleva el sabor.",
        nutrition: "La mantequilla es sobre todo grasa láctea, con pequeñas cantidades de vitamina A. La de vacas alimentadas con pasto suele ser más dorada, por los carotenoides de la hierba.",
        tradition: "La mantequilla cultivada, batida a partir de nata fermentada, es una vieja tradición del norte de Europa; el ghee, mantequilla clarificada a fuego lento, es esencial en la cocina del sur de Asia.",
        kitchen: "Dora, baña y remata; una cucharada convierte unas verduras sencillas en un plato.",
        tryThis: "Funde un poco sobre verduras al vapor para toda la mesa.",
        brief: "Un bloque de mantequilla clara sobre papel encerado, un cuchillo al lado, luz lateral suave.",
      },
    },
  },
  {
    id: "beef",
    tone: "clay",
    motif: "cut",
    image: null,
    content: {
      en: {
        name: "Beef",
        line: "Slow cuts, long afternoons.",
        nutrition: "Beef provides protein, haem iron, zinc and vitamin B12. Haem iron, found in meat and fish, is absorbed more readily than the iron in plant foods.",
        tradition: "Cheaper, harder-working cuts such as shin, cheek and brisket are the backbone of stews and braises in almost every cuisine.",
        kitchen: "Braise, slow-cook or mince; long, gentle cooking makes tough cuts tender.",
        tryThis: "Slow-cooked beef, shredded very finely, gives small eaters a soft texture.",
        brief: "A raw shin of beef on butcher's paper, deep shadow, marbling catching the light.",
      },
      es: {
        name: "Ternera",
        line: "Cortes lentos, tardes largas.",
        nutrition: "La ternera aporta proteína, hierro hemo, zinc y vitamina B12. El hierro hemo, presente en la carne y el pescado, se absorbe con más facilidad que el hierro de los alimentos vegetales.",
        tradition: "Los cortes más económicos y trabajados, como el morcillo, la carrillera o el pecho, son la base de guisos y estofados en casi todas las cocinas.",
        kitchen: "Guisa, cocina a fuego lento o pica; la cocción larga y suave ablanda los cortes duros.",
        tryThis: "La ternera guisada y deshilachada muy fina ofrece una textura blanda a los más pequeños.",
        brief: "Un morcillo de ternera crudo sobre papel de carnicero, sombra profunda, el veteado atrapando la luz.",
      },
    },
  },
  {
    id: "liver",
    tone: "forest",
    motif: "lobe",
    image: null,
    content: {
      en: {
        name: "Liver",
        line: "Eaten in small amounts, for good reason.",
        nutrition: "Liver is one of the most concentrated food sources of vitamin A (as retinol), and is also rich in vitamin B12, folate and iron.",
        tradition: "Pâtés, liver with onions and quick-fried chicken livers appear across European, Middle Eastern and Asian cooking.",
        kitchen: "Cook quickly and gently; overcooking makes it grainy.",
        tryThis: "Blend a little into a meat sauce or meatballs.",
        note: "Because vitamin A is so concentrated, liver is traditionally eaten in small portions, and health services in several countries advise avoiding liver and liver products during pregnancy. Ask your health professional.",
        brief: "Chicken livers in a black pan with sage leaves, steam, low evening light.",
      },
      es: {
        name: "Hígado",
        line: "En pequeñas cantidades, y con razón.",
        nutrition: "El hígado es una de las fuentes alimentarias más concentradas de vitamina A (en forma de retinol), y también es rico en vitamina B12, folato y hierro.",
        tradition: "Patés, hígado encebollado e higaditos de pollo salteados aparecen en las cocinas de Europa, Oriente Medio y Asia.",
        kitchen: "Cocínalo rápido y con suavidad; si se pasa, queda granuloso.",
        tryThis: "Tritura un poco en una salsa de carne o en unas albóndigas.",
        note: "Como la vitamina A está tan concentrada, el hígado se come tradicionalmente en raciones pequeñas, y los servicios de salud de varios países recomiendan evitar el hígado y sus derivados durante el embarazo. Consulta a tu profesional sanitario.",
        brief: "Higaditos de pollo en una sartén negra con hojas de salvia, vapor, luz baja de tarde.",
      },
    },
  },
  {
    id: "bone-broth",
    tone: "broth",
    motif: "bowl",
    image: null,
    content: {
      en: {
        name: "Bone broth",
        line: "The pot that is always on.",
        nutrition: "Broth is made by simmering bones, often with vegetables and a splash of vinegar. Long simmering draws gelatin from the collagen in bones and connective tissue. Its nutrient content varies widely with ingredients and method.",
        tradition: "Stocks and broths underpin cooking from the French fond to Vietnamese phở and Jewish chicken soup.",
        kitchen: "The base for soups, risottos and braises, and for cooking grains and pulses.",
        tryThis: "Cook rice or lentils in broth instead of water.",
        note: "If you are making broth for a baby, leave out the salt.",
        brief: "A wide pot of broth on a low flame, bones and onion skins, steam in window light.",
      },
      es: {
        name: "Caldo de huesos",
        line: "La olla que siempre está al fuego.",
        nutrition: "El caldo se hace cociendo huesos a fuego lento, a menudo con verduras y un chorrito de vinagre. La cocción larga extrae gelatina del colágeno de huesos y tejidos. Su contenido nutricional varía mucho según los ingredientes y el método.",
        tradition: "Fondos y caldos sostienen cocinas tan distintas como el fondo francés, el phở vietnamita o la sopa de pollo judía.",
        kitchen: "Base de sopas, arroces y guisos, y para cocer cereales y legumbres.",
        tryThis: "Cuece el arroz o las lentejas en caldo en lugar de agua.",
        note: "Si preparas caldo para un bebé, no le añadas sal.",
        brief: "Una olla ancha de caldo a fuego bajo, huesos y pieles de cebolla, vapor a contraluz.",
      },
    },
  },
  {
    id: "fish",
    tone: "sage",
    motif: "fish",
    image: null,
    content: {
      en: {
        name: "Fish",
        line: "From the cold sea to the family table.",
        nutrition: "Oily fish such as salmon, sardines, mackerel and trout provide long-chain omega-3 fats (EPA and DHA) and vitamin D. Small fish eaten with their soft bones, such as tinned sardines, also provide calcium.",
        tradition: "Preserved fish (salt cod, anchovies, fish sauce) has been a staple of coastal cooking for centuries.",
        kitchen: "Bake, poach or flake into dishes, and check carefully for bones.",
        tryThis: "Mash tinned sardines, bones and all, onto buttered toast.",
        note: "Guidance in pregnancy and for children usually limits fish that can be high in mercury, such as shark, swordfish and marlin, and sets a weekly limit for oily fish. Follow your local advice.",
        brief: "Whole mackerel on crushed ice and newspaper, silver skin, overcast daylight.",
      },
      es: {
        name: "Pescado",
        line: "Del mar frío a la mesa familiar.",
        nutrition: "Los pescados azules como el salmón, la sardina, la caballa y la trucha aportan grasas omega-3 de cadena larga (EPA y DHA) y vitamina D. Los pescados pequeños que se comen con sus espinas blandas, como las sardinas en lata, también aportan calcio.",
        tradition: "El pescado en conserva (bacalao en salazón, anchoas, salsa de pescado) ha sido básico en las cocinas de costa durante siglos.",
        kitchen: "Al horno, escalfado o desmigado en otros platos, revisando bien las espinas.",
        tryThis: "Aplasta sardinas en lata, con sus espinas, sobre una tostada con mantequilla.",
        note: "Las recomendaciones para el embarazo y para la infancia suelen limitar los pescados que pueden tener mucho mercurio, como el tiburón, el pez espada o el marlín, y fijan un máximo semanal de pescado azul. Sigue las indicaciones de tu zona.",
        brief: "Caballas enteras sobre hielo picado y papel de periódico, piel plateada, luz de día nublado.",
      },
    },
  },
  {
    id: "seasonal-fruit",
    tone: "yolk",
    motif: "fruit",
    image: null,
    content: {
      en: {
        name: "Seasonal fruit",
        line: "Whatever the month is offering.",
        nutrition: "Fruit provides fibre and, in many varieties such as citrus, berries and kiwi, vitamin C. Vitamin C eaten in the same meal helps the body absorb the iron in plant foods.",
        tradition: "Preserving the harvest as jams, compotes, dried and fermented fruit carried it through the winter in many cultures.",
        kitchen: "Eat it raw, stew it into compote, or roast it alongside meat.",
        tryThis: "Serve berries or citrus with lentils or greens.",
        brief: "A bowl of late-summer plums and figs, one split open, warm afternoon light.",
      },
      es: {
        name: "Fruta de temporada",
        line: "Lo que el mes tenga que ofrecer.",
        nutrition: "La fruta aporta fibra y, en muchas variedades como los cítricos, los frutos rojos o el kiwi, vitamina C. La vitamina C tomada en la misma comida ayuda a absorber el hierro de los alimentos vegetales.",
        tradition: "Conservar la cosecha en mermeladas, compotas, fruta seca o fermentada permitía llegar al invierno en muchas culturas.",
        kitchen: "Cruda, en compota o asada junto a la carne.",
        tryThis: "Sirve frutos rojos o cítricos con lentejas o verduras de hoja.",
        brief: "Un cuenco de ciruelas e higos de final de verano, uno abierto, luz cálida de tarde.",
      },
    },
  },
  {
    id: "herbs-vegetables",
    tone: "forest",
    motif: "herbs",
    image: null,
    content: {
      en: {
        name: "Herbs & vegetables",
        line: "Colour, bitterness and green.",
        nutrition: "Vegetables provide fibre and a wide range of vitamins and minerals; dark leafy greens are a source of folate. A variety of colours brings a variety of nutrients.",
        tradition: "Fermenting vegetables, as in sauerkraut and kimchi, preserved the harvest and added sharp, bright flavours to winter meals.",
        kitchen: "Roast, steam or braise in good fat, and finish dishes with fresh herbs.",
        tryThis: "Cook vegetables soft and put them on the shared table, alongside everything else.",
        brief: "Bunches of herbs and young carrots on a wooden board, soil still on the roots.",
      },
      es: {
        name: "Hierbas y verduras",
        line: "Color, amargor y verde.",
        nutrition: "Las verduras aportan fibra y una gran variedad de vitaminas y minerales; las de hoja verde oscura son fuente de folato. Variar los colores es variar los nutrientes.",
        tradition: "Fermentar verduras, como en el chucrut o el kimchi, conservaba la cosecha y daba sabores vivos y ácidos a las comidas de invierno.",
        kitchen: "Asadas, al vapor o guisadas en buena grasa, y hierbas frescas para terminar.",
        tryThis: "Cocina las verduras tiernas y ponlas en la mesa compartida, junto a todo lo demás.",
        brief: "Manojos de hierbas y zanahorias tiernas sobre una tabla de madera, con tierra aún en las raíces.",
      },
    },
  },
];
