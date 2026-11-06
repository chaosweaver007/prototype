import test from "node:test";
import assert from "node:assert/strict";
import {
  MIRROR_DISCLOSURE,
  MIRROR_FIRST_VERSION,
  mirrorDataNotice,
  mirrorMayReply,
  mirrorMayUseLiveService,
} from "./mirror-first.ts";

test("default and declined states cannot start a reflection or remote request", () => {
  for (const state of ["awaiting", "declined"] as const) {
    assert.equal(mirrorMayReply(state, false), false);
    assert.equal(mirrorMayUseLiveService(state, false), false);
  }
});

test("local consent allows reflection without permission for remote calls", () => {
  assert.equal(mirrorMayReply("local", false), true);
  assert.equal(mirrorMayUseLiveService("local", false), false);
});

test("live consent is necessary but not sufficient when kill switch is active", () => {
  assert.equal(mirrorMayReply("live", false), true);
  assert.equal(mirrorMayUseLiveService("live", false), true);
  assert.equal(mirrorMayReply("live", true), false);
  assert.equal(mirrorMayUseLiveService("live", true), false);
});

test("disclosure distinguishes local reflection from a networked request", () => {
  assert.match(mirrorDataNotice("local"), /not sent to the AI service/);
  assert.match(mirrorDataNotice("live"), /AI provider/);
  assert.ok(MIRROR_DISCLOSURE.some((item) => item.includes("mistaken")));
  assert.equal(MIRROR_FIRST_VERSION, "MIRROR-FIRST-001");
});
