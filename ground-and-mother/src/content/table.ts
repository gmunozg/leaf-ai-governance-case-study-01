/**
 * THE TABLE — one dining table, photographed from directly above, that fills as the visitor scrolls.
 *
 * Every object has a place in two compositions of the same table:
 *   • portrait (phones and narrow screens): 900 × 1500 units, mother's place at the top, baby's below
 *   • landscape (desktop): 1600 × 1000 units, mother's place on the left, baby's on the right
 * x / y are the object's centre, w / h its footprint, r its rotation in degrees.
 *
 * PHOTOGRAPHY: set `image` to a cut-out (transparent PNG/WebP) shot from directly overhead,
 * lit from the same window as the table (see PHOTOGRAPHY.md). Until then the site shows a
 * labelled marker in the object's exact place — never an illustration posing as a photograph.
 */
import type { Localized } from "@/i18n/config";

export type SceneId = "hero" | "mother" | "firstFoods" | "firstYears" | "library" | "final";
export const scenes: SceneId[] = ["hero", "mother", "firstFoods", "firstYears", "library", "final"];

export type Kind = "ceramic" | "silver" | "glass" | "linen" | "food" | "wood" | "paper" | "hands";
export type Shape = "round" | "rect" | "pill";
type Place = { x: number; y: number; w: number; h: number; r: number };

export type TableObject = {
  id: string;
  scene: SceneId;
  kind: Kind;
  shape: Shape;
  /** Stacking: higher sits on top (food on a plate, a spoon in a bowl). */
  z: number;
  label: Localized;
  portrait: Place;
  landscape: Place;
  /** Overhead cut-out photograph, once shot. */
  image: { src: string; width: number; height: number } | null;
  /** Shot brief for the photographer. */
  brief: string;
};

export const COMPOSITION = { portrait: { w: 900, h: 1500 }, landscape: { w: 1600, h: 1000 } } as const;

/** Where the camera looks in each scene (always straight down): focus point and zoom over the base framing. */
export const cameras: Record<SceneId, { portrait: [number, number, number]; landscape: [number, number, number] }> = {
  hero: { portrait: [450, 690, 1.0], landscape: [820, 540, 1.0] },
  mother: { portrait: [450, 470, 1.32], landscape: [560, 560, 1.38] },
  firstFoods: { portrait: [450, 1080, 1.38], landscape: [1130, 590, 1.45] },
  firstYears: { portrait: [470, 1230, 1.2], landscape: [1140, 700, 1.25] },
  library: { portrait: [450, 560, 0.92], landscape: [820, 360, 1.05] },
  final: { portrait: [450, 750, 0], landscape: [800, 500, 0] }, // 0 = the whole table
};

const o = (
  id: string, scene: SceneId, kind: Kind, shape: Shape, z: number,
  en: string, es: string, portrait: Place, landscape: Place, brief: string,
): TableObject => ({ id, scene, kind, shape, z, label: { en, es }, portrait, landscape, image: null, brief });
const P = (x: number, y: number, w: number, h: number, r = 0): Place => ({ x, y, w, h, r });

export const tableObjects: TableObject[] = [
  // I · The table is laid: two places, one for mother, one for baby.
  o("napkin", "hero", "linen", "rect", 1, "Linen napkin", "Servilleta de lino", P(205, 470, 130, 190, -4), P(300, 520, 170, 240, -4), "Folded washed-linen napkin, oatmeal colour."),
  o("plate", "hero", "ceramic", "round", 2, "Mother's plate", "Plato de la madre", P(450, 470, 270, 270), P(540, 520, 300, 300), "Handmade stoneware dinner plate, matte glaze, soft rim."),
  o("fork", "hero", "silver", "pill", 3, "Silver fork", "Tenedor de plata", P(205, 470, 26, 190, -3), P(300, 520, 32, 230, -3), "Antique silver fork, worn patina."),
  o("knife", "hero", "silver", "pill", 3, "Silver knife", "Cuchillo de plata", P(625, 470, 22, 200, 1), P(715, 520, 26, 240, 1), "Antique silver knife, matching the fork."),
  o("glass", "hero", "glass", "round", 3, "Water glass", "Vaso de agua", P(640, 275, 96, 96), P(720, 320, 112, 112), "Thick hand-blown tumbler with water, light falling through it."),
  o("mat", "hero", "linen", "rect", 1, "Baby's linen mat", "Mantelito de lino del bebé", P(450, 1080, 330, 250, 2), P(1140, 560, 360, 270, 2), "Small linen place mat for the baby's place."),
  o("cup", "hero", "ceramic", "round", 3, "Small cup", "Tacita", P(640, 975, 76, 76), P(1300, 410, 86, 86), "Small ceramic beaker for a baby, no handle."),

  // II · Mother: her place fills.
  o("meal", "mother", "food", "round", 4, "Soft eggs, greens, butter", "Huevos tiernos, verduras, mantequilla", P(450, 470, 185, 185), P(540, 520, 210, 210), "Plated meal for the mother: soft eggs, sautéed greens, sourdough with butter."),
  o("broth", "mother", "ceramic", "round", 3, "Bowl of broth", "Cuenco de caldo", P(235, 690, 150, 150), P(380, 800, 170, 170), "Wide ceramic bowl of golden bone broth, a little steam."),
  o("board", "mother", "wood", "rect", 2, "Bread and butter", "Pan y mantequilla", P(660, 690, 240, 125, 6), P(790, 810, 300, 150, 6), "Oak board with torn sourdough and a pat of butter."),
  o("tea", "mother", "ceramic", "round", 3, "Cup of tea", "Taza de té", P(255, 255, 104, 104), P(390, 300, 118, 118), "Handleless ceramic cup of tea."),

  // III · First Foods: the baby's first bowl.
  o("bowl", "firstFoods", "ceramic", "round", 3, "Small ceramic bowl", "Cuenco pequeño de cerámica", P(450, 1080, 150, 150), P(1140, 560, 160, 160), "Small handmade bowl of mashed sweet potato with a soft yolk."),
  o("spoon", "firstFoods", "silver", "pill", 4, "Baby spoon", "Cucharita", P(595, 1110, 18, 130, 20), P(1290, 600, 20, 145, 20), "Small antique silver baby spoon."),
  o("dish", "firstFoods", "food", "round", 3, "First tastes", "Primeros sabores", P(228, 1222, 96, 96), P(950, 745, 104, 104), "Tiny dish of avocado, mashed with a fork."),

  // IV · First Years: more food, a child's plate, small hands.
  o("childplate", "firstYears", "ceramic", "round", 3, "Child's plate", "Plato infantil", P(480, 1320, 190, 190), P(1170, 830, 200, 200), "Child's plate with soft pieces: chicken, carrot, bread."),
  o("berries", "firstYears", "food", "round", 3, "Berries", "Frutos rojos", P(285, 1350, 104, 104), P(985, 860, 112, 112), "Small bowl of raspberries and blueberries."),
  o("hands", "firstYears", "hands", "rect", 5, "Little hands", "Manos pequeñas", P(705, 1400, 210, 170, -18), P(1380, 880, 240, 190, -18), "A toddler's hands reaching onto the table from the edge."),

  // V · The Nourishment Library: notes and pictures join the table.
  o("notebook", "library", "paper", "rect", 2, "Notebook", "Cuaderno", P(205, 115, 230, 170, 4), P(220, 190, 280, 210, 4), "Open notebook with handwritten notes."),
  o("recipe", "library", "paper", "rect", 2, "Recipe card", "Ficha de receta", P(690, 120, 220, 150, -5), P(880, 170, 260, 180, -5), "Handwritten recipe card for broth."),
  o("print", "library", "paper", "rect", 2, "A photograph", "Una fotografía", P(700, 800, 180, 130, 7), P(1420, 210, 210, 155, 7), "Small printed food photograph, matte paper."),
  o("pencil", "library", "wood", "pill", 3, "Pencil", "Lápiz", P(300, 820, 12, 170, 32), P(1080, 230, 14, 200, 32), "Wooden pencil, half used."),

  // VI · The complete table.
  o("jug", "final", "ceramic", "round", 3, "Jug of milk", "Jarra de leche", P(180, 1000, 110, 110), P(820, 460, 130, 130), "Stoneware jug of milk."),
  o("flowers", "final", "glass", "round", 3, "Garden flowers", "Flores del jardín", P(720, 1460, 116, 116), P(800, 120, 120, 120), "Small glass of garden flowers."),
  o("salt", "final", "ceramic", "round", 3, "Salt", "Sal", P(760, 560, 52, 52), P(850, 650, 56, 56), "Little dish of flaky salt."),
];
