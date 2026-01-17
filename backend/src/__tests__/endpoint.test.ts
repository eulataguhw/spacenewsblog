import { describe, it } from "vitest";
import * as articleService from "../services/articleService";

describe("Endpoint Verification", () => {
  it("should fetch and log articles for the user", async () => {
    console.log("\n--- Article Service Output ---");
    const result = await articleService.getAllArticles(1, 1);
    console.log(JSON.stringify(result, null, 2));
    console.log("--- End of Output ---\n");
  });
});
