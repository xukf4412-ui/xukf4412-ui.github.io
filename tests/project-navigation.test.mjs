import assert from "node:assert/strict";
import test from "node:test";
import { getAdjacentProject, projects } from "../scripts/content.mjs";

test("returns the next project and wraps after the final project", () => {
  assert.equal(getAdjacentProject(projects[0].slug).slug, projects[1].slug);
  assert.equal(getAdjacentProject(projects.at(-1).slug).slug, projects[0].slug);
});

test("returns no navigation target for an unknown project", () => {
  assert.equal(getAdjacentProject("missing-project"), undefined);
});
