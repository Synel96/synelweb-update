import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const serverStaticDir = join(process.cwd(), "dist", "server", "assets", "static");
const clientStaticDir = join(process.cwd(), "dist", "client", "assets", "static");

if (!existsSync(serverStaticDir) || !existsSync(clientStaticDir)) {
  process.exit(0);
}

mkdirSync(clientStaticDir, { recursive: true });

const serverCssFiles = readdirSync(serverStaticDir).filter((name) => name.endsWith(".css"));

for (const fileName of serverCssFiles) {
  cpSync(join(serverStaticDir, fileName), join(clientStaticDir, fileName));
}
