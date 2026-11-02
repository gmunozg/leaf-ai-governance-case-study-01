// Bundled into the static preview: the exact same plate runtime the site uses.
import { mountPlate } from "../../src/lib/plate-runtime";
(window as unknown as { GMPlate: { mountPlate: typeof mountPlate } }).GMPlate = { mountPlate };
