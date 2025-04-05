"use client";
import { useQueries, useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useEffect  ,useState} from 'react'
import PdfViewer from '../_components/PdfViewer';
import TextEditor from '../_components/TextEditor';
import WorkspaceHeader from '../_components/WorkspaceHeader';
import { api } from "/convex/_generated/api";
function Workspace() {
  const [fileUrl, setFileUrl] = useState(null);
  const {fileId}=useParams();
  const fileInfo=useQuery(api.fileStorage.GetFileRecord,{
    fileId:fileId
  });

  useEffect(() => {
    if (fileInfo && fileInfo.fileUrl) {
      setFileUrl(fileInfo.fileUrl);
    }
  }, [fileInfo]);
  // useEffect(()=>{
  //   console.log(fileInfo);
  //   // console.log(fileInfo.fileUrl);
  // },[fileInfo])

  return (
    <div>
        <div>
        <WorkspaceHeader />
        </div>
        <div className='grid grid-cols-2 gap-10'>
            <div>
                {/* Text Editor */}
                <TextEditor />
            </div>
            <div>
               
                {/* Pdf Viewer */}
                {fileUrl ? <PdfViewer fileUrl={fileUrl} /> : <p>Loading PDF...</p>}
            </div>
        </div>
    </div>
  )
}

export default Workspace;