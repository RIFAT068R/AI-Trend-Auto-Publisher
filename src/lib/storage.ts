import { promises as fs } from "fs";
import path from "path";

export type StoredPost = {
  id: string;
  title: string;
  topic: string;
};

export type AutomationModule = {
  name: string;
  status: string;
};

const postsFilePath = path.join(process.cwd(), "data", "posts.json");

export async function getStoredPosts(): Promise<StoredPost[]> {
  try {
    const file = await fs.readFile(postsFilePath, "utf8");
    return JSON.parse(file) as StoredPost[];
  } catch {
    return [];
  }
}

export async function getAutomationModules(): Promise<AutomationModule[]> {
  return [
    { name: "Trends", status: "Placeholder Ready" },
    { name: "Generate", status: "Placeholder Ready" },
    { name: "Image", status: "Placeholder Ready" },
    { name: "Post", status: "Placeholder Ready" }
  ];
}
