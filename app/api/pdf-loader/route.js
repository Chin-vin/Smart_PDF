import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl='https://lovely-mule-948.convex.cloud/api/storage/239de0c7-4801-487c-9df6-04f42c931134';
export async function GET(req)
{
    const reqUrl=req.url;
    const {searchParams}=new URL(reqUrl);
    const pdfUrl=searchParams.get('pdfUrl');
    console.log(pdfUrl);
    const response=await fetch(pdfUrl);
    const data=await response.blob();
    const loader= new WebPDFLoader(data);
    const docs=await loader.load();
    let pdfTextContent='';
    docs.forEach(doc=>{
        pdfTextContent=pdfTextContent+doc.pageContent;
    })
    const splitter=new RecursiveCharacterTextSplitter({
        chunkSize:10000,
        chunkOverlap:20,
    })
    const output = await splitter.createDocuments([pdfTextContent]);
    let splitterList=[];
    output.forEach(doc=>{
        splitterList.push(doc.pageContent);
    })
    return NextResponse.json({result:output})
}