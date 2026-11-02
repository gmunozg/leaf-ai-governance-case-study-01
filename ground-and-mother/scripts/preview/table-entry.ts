// Bundled into the static preview: the same table runtime the site uses.
import { mountTable } from "../../src/lib/table";
(window as unknown as { GMTable: { mountTable: typeof mountTable } }).GMTable = { mountTable };
