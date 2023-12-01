import { add } from "../src/calc";
import { describe, it, expect } from "vitest";
 
describe("add", () => {
  it("should add two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });
});