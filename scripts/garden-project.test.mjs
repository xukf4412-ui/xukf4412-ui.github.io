import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { projects } from "../scripts/content.mjs";

test("places Garden Home as the second portfolio project", () => {
  assert.equal(projects[1]?.slug, "garden-apartment");
  assert.equal(projects[1]?.caseStudyUrl, "garden-apartment.html");
});

test("homepage links the second project to its case study", async () => {
  const homepage = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const spatialPosition = homepage.indexOf('data-project-slug="spatial-agent"');
  const gardenPosition = homepage.indexOf('data-project-slug="garden-apartment"');
  const hotelPosition = homepage.indexOf('data-project-slug="nihao-hotel-2"');

  assert.ok(spatialPosition >= 0, "spatial project is present");
  assert.ok(gardenPosition > spatialPosition, "garden project follows spatial project");
  assert.ok(hotelPosition > gardenPosition, "hotel project follows garden project");
  assert.match(homepage, /href="garden-apartment\.html"/);
});

test("case study exposes model, tour and video", async () => {
  const caseStudy = await readFile(new URL("../garden-apartment.html", import.meta.url), "utf8");

  assert.match(caseStudy, /assets\/images\/projects\/garden\/model-perspective\.webp/);
  assert.match(caseStudy, /garden-tour\/index\.html/);
  assert.match(caseStudy, /assets\/video\/garden-living-room\.mp4/);
});
