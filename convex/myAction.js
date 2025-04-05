import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { TaskType } from "@google/generative-ai";
import { action } from "./_generated/server.js";
import { v } from "convex/values";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const ingest = action({
  args: {
    splitText: v.array(v.string()), // Ensure it's an array of strings
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Ingesting document with fileId:", args.fileId);
    
    await ConvexVectorStore.fromTexts(
      args.splitText,
      args.fileId,
      new GoogleGenerativeAIEmbeddings({
        apiKey:NEXT_PUBLIC_GEMINI_API_KEY, // Use env variables
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );
    
    return "Ingest Completed";
  },
});

export const getNotesByFile = action({
  args: { fileId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notes")
      .withIndex("by_fileId", (q) => q.eq("fileId", args.fileId))
      .collect();
  },
});


export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Searching for query:", args.query, "with fileId:", args.fileId);

    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey:NEXT_PUBLIC_GEMINI_API_KEY,
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    const results = await vectorStore.similaritySearch(args.query, 1);
    console.log("📌 Raw Search Results:", JSON.stringify(results, null, 2));
    const filteredResults = results.filter(q => {
      if (q.metadata) {
        const fileIdFromMetadata = Object.values(q.metadata).join(""); // Fix split fileId issue
        console.log("🧐 Extracted fileId from metadata:", fileIdFromMetadata);
        return fileIdFromMetadata === args.fileId;
      }
      return false;
    });

    console.log("🔹 Filtered Search Results:", JSON.stringify(filteredResults, null, 2));

    if (filteredResults.length === 0) {
      return JSON.stringify({ message: "No matching documents found." });
    }

    return JSON.stringify(filteredResults.map(q => q.pageContent));
  },
});

    //     // Ensure metadata exists before filtering
    // const filteredResults = results.filter(q => {
    //   console.log("🧐 Checking fileId in metadata:", q.metadata);
    //   console.log( 'b0622e21-350b-4291-9785-f09fa4a9ec54'=== args.fileId);
    // });

    // console.log("🔹 Filtered Search Results:", JSON.stringify(filteredResults));

    // return JSON.stringify(filteredResults.pageContent);

    // console.log("Hello"+results);
    // const filteredResults = results.filter(q => q.metadata.fileId === args.fileId);
    
    // console.log("Search Results:", filteredResults);

    // return JSON.stringify(filteredResults);
  