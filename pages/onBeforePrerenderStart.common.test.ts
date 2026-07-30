import { describe, expect, it } from "vitest";
import { onBeforePrerenderStart as aboutPrerender } from "./about/+onBeforePrerenderStart";
import { onBeforePrerenderStart as blogPrerender } from "./blog/+onBeforePrerenderStart";
import { onBeforePrerenderStart as contactPrerender } from "./contact/+onBeforePrerenderStart";
import { onBeforePrerenderStart as indexPrerender } from "./index/+onBeforePrerenderStart";
import { onBeforePrerenderStart as projectsPrerender } from "./projects/+onBeforePrerenderStart";
import { onBeforePrerenderStart as servicesPrerender } from "./services/+onBeforePrerenderStart";
import { onBeforePrerenderStart as technologyPrerender } from "./technology/+onBeforePrerenderStart";
import { onBeforePrerenderStart as adatkezelesPrerender } from "./adatkezeles/+onBeforePrerenderStart";

describe("static onBeforePrerenderStart hooks", () => {
  it("about: returns every language variant of /about", () => {
    expect(aboutPrerender()).toEqual(["/en/about", "/hu/rolam", "/de/ueber-mich"]);
  });

  it("blog: returns every language variant of /blog", () => {
    expect(blogPrerender()).toEqual(["/en/blog", "/hu/blog", "/de/blog"]);
  });

  it("contact: returns every language variant of /contact", () => {
    expect(contactPrerender()).toEqual(["/en/contact", "/hu/kapcsolat", "/de/kontakt"]);
  });

  it("index: returns every language variant of the root", () => {
    expect(indexPrerender()).toEqual(["/en/", "/hu/", "/de/"]);
  });

  it("projects: returns every language variant of /projects", () => {
    expect(projectsPrerender()).toEqual(["/en/projects", "/hu/projektek", "/de/projekte"]);
  });

  it("services: returns every language variant of /services", () => {
    expect(servicesPrerender()).toEqual([
      "/en/services",
      "/hu/szolgaltatasok",
      "/de/dienstleistungen",
    ]);
  });

  it("technology: returns every language variant of /technology", () => {
    expect(technologyPrerender()).toEqual(["/en/technology", "/hu/technologia", "/de/technologie"]);
  });

  it("adatkezeles: returns a single, unprefixed Hungarian-only route", () => {
    expect(adatkezelesPrerender()).toEqual(["/adatkezeles"]);
  });
});
