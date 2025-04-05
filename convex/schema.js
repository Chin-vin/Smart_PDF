import { defineSchema , defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users:defineTable({
        userName:v.string(),
        email:v.string(),
        imageUrl:v.string()
    }),

    pdfFiles:defineTable({
        fileId:v.string(),
        storageId:v.string(),
        fileUrl:v.string(),
        fileName:v.string(),
        createdBy:v.string()
    }),
    documents: defineTable({
        embedding: v.array(v.number()),
        text: v.string(),
        metadata: v.any(),
      }).vectorIndex("byEmbedding", {
        vectorField: "embedding",
        dimensions: 768,
      }),

    notes: defineTable({
        fileId: v.string(),  // ID of the associated file
        userId: v.optional(v.string()), // Optional: For multi-user support
        title: v.string(), // Title of the note
        content: v.string(), // Rich text content (HTML)
        createdAt: v.number(), // Timestamp
        updatedAt: v.number(), // Timestamp
      }).index("by_fileId", ["fileId"]),
})

