import { importServerProductionEntry } from "@brillout/vite-plugin-server-entry/runtime";

if (process.env.NODE_ENV === "production") {
  await importServerProductionEntry();
}

export default {
  prod: {},
};