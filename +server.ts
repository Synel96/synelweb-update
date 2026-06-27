if (process.env.NODE_ENV === "production") {
  await import("./dist/server/entry.mjs");
}

export default {
  prod: {},
};