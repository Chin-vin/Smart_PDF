import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const addFileEntryToDb=mutation({
    args:{
        fileId:v.string(),
        storageId:v.string(),
        fileName:v.string(),
        createdBy:v.string(),
        fileUrl:v.string()
    },
    handler :async(ctx,args)=>{
        const result=await ctx.db.insert('pdfFiles',{
            fileId:args.fileId,
            fileName:args.fileName,
            fileUrl:args.fileUrl,
            storageId:args.storageId,
            createdBy:args.createdBy
        })
        return "Inserted"
    }
})

export const getFileUrl=mutation({
    args:{
        storageId:v.string()
    },
    handler:async(ctx,args)=>{
        const url=await ctx.storage.getUrl(args.storageId);
        return url;
    }
})

export const GetFileRecord=query({
    args:{
        fileId:v.string()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.query('pdfFiles').filter((q)=>q.eq(q.field('fileId'),args.fileId))
        .collect();
        console.log(result);
        return result[0];
    }
})

export const GetUserFiles=query({
    args:{
        userEmail:v.optional(v.string()),
    },
    handler:async(ctx,args)=>{

        if(!args?.userEmail)
        {
            return ;
        }

        const result=await ctx.db.query('pdfFiles')
        .filter((q)=>q.eq(q.field('createdBy'),args.userEmail)).collect();
        return result;
    }
});

export const saveNote = mutation({
  args: { fileId: v.string(), title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const existingNote = await ctx.db
      .query("notes")
      .withIndex("by_fileId", (q) => q.eq("fileId", args.fileId))
      .first();

    if (existingNote) {
      return await ctx.db.patch(existingNote._id, {
        content: args.content,
        updatedAt: Date.now(),
      });
    } else {
      return await ctx.db.insert("notes", {
        fileId: args.fileId,
        title: args.title,
        content: args.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});
