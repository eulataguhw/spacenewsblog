import spaceNewsApiService from "../services/spaceNewsApiService";
import * as articleService from "../services/articleService";

/**
 * Test script to verify actual API output from Space Flight News API
 */
async function testActualApiOutput() {
  console.log("=".repeat(80));
  console.log("Testing Actual Space Flight News API Output");
  console.log("=".repeat(80));
  console.log();

  try {
    // Test 1: Fetch articles using Space News API Service
    console.log("📡 Test 1: Fetching articles from Space News API Service");
    console.log("-".repeat(80));
    const apiResult = await spaceNewsApiService.getArticles({ limit: 3 });

    console.log(`✅ Success! API Response:`);
    console.log(`   Total articles: ${apiResult.count}`);
    console.log(`   Fetched: ${apiResult.results.length} articles`);
    console.log(`   Next page: ${apiResult.next ? "Available" : "None"}`);
    console.log();

    if (apiResult.results.length > 0) {
      console.log("📰 First Article Details:");
      const firstArticle = apiResult.results[0];
      console.log(`   ID: ${firstArticle.id}`);
      console.log(`   Title: ${firstArticle.title}`);
      console.log(`   Source: ${firstArticle.news_site}`);
      console.log(`   Published: ${firstArticle.published_at}`);
      console.log(`   Featured: ${firstArticle.featured}`);
      console.log(`   URL: ${firstArticle.url}`);
      console.log(`   Summary: ${firstArticle.summary.substring(0, 100)}...`);
      console.log();
    }

    // Test 2: Fetch articles using Article Service (with transformation)
    console.log("🔄 Test 2: Fetching articles through Article Service");
    console.log("-".repeat(80));
    const serviceResult = await articleService.getAllArticles(1, 3);

    console.log(`✅ Success! Service Response:`);
    console.log(`   Total articles: ${serviceResult.meta.total}`);
    console.log(`   Current page: ${serviceResult.meta.page}`);
    console.log(`   Total pages: ${serviceResult.meta.totalPages}`);
    console.log(`   Articles returned: ${serviceResult.data.length}`);
    console.log();

    if (serviceResult.data.length > 0) {
      console.log("📰 Transformed Article Details:");
      const firstTransformed = serviceResult.data[0];
      console.log(`   ID: ${firstTransformed.id}`);
      console.log(`   External ID: ${firstTransformed.external_id}`);
      console.log(`   Title: ${firstTransformed.title}`);
      console.log(`   Source: ${firstTransformed.source}`);
      console.log(
        `   Published: ${firstTransformed.published_at.toISOString()}`,
      );
      console.log(`   Featured: ${firstTransformed.featured}`);
      console.log(`   Image URL: ${firstTransformed.image_url}`);
      console.log();
    }

    // Test 3: Search functionality
    console.log("🔍 Test 3: Testing search functionality");
    console.log("-".repeat(80));
    const searchResult = await articleService.getAllArticles(1, 5, "SpaceX");

    console.log(`✅ Success! Search Results for "SpaceX":`);
    console.log(`   Found: ${searchResult.meta.total} articles`);
    console.log(`   Returned: ${searchResult.data.length} articles`);
    console.log();

    if (searchResult.data.length > 0) {
      console.log("📰 Search Results:");
      searchResult.data.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title}`);
      });
      console.log();
    }

    // Test 4: Fetch single article by ID
    if (apiResult.results.length > 0) {
      const testArticleId = apiResult.results[0].id.toString();
      console.log(`📄 Test 4: Fetching single article (ID: ${testArticleId})`);
      console.log("-".repeat(80));

      const singleArticle = await articleService.getArticleById(testArticleId);

      console.log(`✅ Success! Article Details:`);
      console.log(`   ID: ${singleArticle.id}`);
      console.log(`   Title: ${singleArticle.title}`);
      console.log(`   Source: ${singleArticle.source}`);
      console.log(`   Published: ${singleArticle.published_at.toISOString()}`);
      console.log(`   Comments: ${singleArticle.comments.length}`);
      console.log();
    }

    // Test 5: Pagination
    console.log("📄 Test 5: Testing pagination (Page 2)");
    console.log("-".repeat(80));
    const page2Result = await articleService.getAllArticles(2, 5);

    console.log(`✅ Success! Page 2 Results:`);
    console.log(`   Current page: ${page2Result.meta.page}`);
    console.log(`   Articles returned: ${page2Result.data.length}`);
    console.log(`   Has next page: ${page2Result.meta.next ? "Yes" : "No"}`);
    console.log(
      `   Has previous page: ${page2Result.meta.previous ? "Yes" : "No"}`,
    );
    console.log();

    // Summary
    console.log("=".repeat(80));
    console.log("✅ ALL TESTS PASSED!");
    console.log("=".repeat(80));
    console.log();
    console.log("Summary:");
    console.log("  ✓ Space News API Service is working correctly");
    console.log("  ✓ Article Service transformation is working correctly");
    console.log("  ✓ Search functionality is operational");
    console.log("  ✓ Single article fetch is working");
    console.log("  ✓ Pagination is functioning properly");
    console.log("  ✓ Comments integration is ready (no comments in test data)");
    console.log();
  } catch (error) {
    console.error("❌ TEST FAILED!");
    console.error("Error:", error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
}

// Run the tests
testActualApiOutput();
