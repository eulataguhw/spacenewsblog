import dotenv from "dotenv";
import path from "node:path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { getAllArticles } from "../services/articleService";
import { createComment } from "../services/commentService";
import prisma from "../utils/prismaClient";

const USERS = [
  "SpaceFan99",
  "CosmicVoyager",
  "StarGazer",
  "OrionHunter",
  "MarsRover",
  "GalaxyGuard",
  "AstroNut",
  "NebulaSurfer",
  "RocketMan",
  "LunarWalker",
];

const COMMENTS = [
  "This is incredible news for space exploration!",
  "I've been waiting for this mission for years.",
  "Does anyone know when the next launch window is?",
  "The engineering behind this is mind-blowing.",
  "SpaceX keeps pushing the boundaries.",
  "I hope to see humans on Mars in my lifetime.",
  "Fascinating discovery!",
  "Great article, thanks for sharing.",
  "Is there a live stream for this?",
  "Ad astra!",
  "The photos from this mission are going to be amazing.",
  "Science fiction becoming science fact.",
  "Funding for NASA needs to increase.",
  "Private spaceflight is changing everything.",
  "We are not alone in the universe.",
];

const getRandomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const populateComments = async () => {
  try {
    const articlesResponse = await getAllArticles(1, 50);
    const articles = articlesResponse.data;

    if (articles.length === 0) {
      console.warn("No articles found.");
      return;
    }

    let totalCommentsAdded = 0;
    let variationAdded = false;

    for (const article of articles) {
      if (Math.random() > 0.2) {
        const commentCount = Math.floor(Math.random() * 8) + 3;

        for (let i = 0; i < commentCount; i++) {
          let username = getRandomElement(USERS);
          const comment = getRandomElement(COMMENTS);

          if (!variationAdded && totalCommentsAdded > 10) {
            username = username.toUpperCase();
            variationAdded = true;
          }

          await createComment(article.id, { username, comment });
          totalCommentsAdded++;
        }
      }
    }
    console.log(`Total comments added: ${totalCommentsAdded}`);
  } catch (error) {
    console.error("Error seeding comments:", error);
  } finally {
    await prisma.$disconnect();
  }
};

populateComments();
