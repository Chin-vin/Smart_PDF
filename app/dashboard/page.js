"use client";
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import UploadPdf from './_components/UploadPdf';


function Page() {
  const { user } = useUser();
  const tempResult = useQuery(api.fileStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  const [fileList, setFileList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (tempResult) {
      setFileList(tempResult);
    }
  }, [tempResult]);

  return (
    <div className={`p-10 transition-all duration-300 ${dialogOpen ? "blur-md" : ""}`}>
      <h2 className='font-bold text-3xl'>Workspace</h2>
      {/* <UploadPdf setDialogOpen={setDialogOpen} /> */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mr-2 xl:grid-cols-5' >
        {fileList.length > 0 ? (
          fileList.map((file, index) => (
            <Link href={'/workspace/'+file?.fileId} key={index}>
              <div className='flex p-5 shadow-md rounded-md flex-col items-center cursor-pointer justify-center border hover:scale-105 transition-all' >
                <Image src={'/pdf.png'} alt="file" width={40} height={40} />
                <h2 className='mt-3 font-medium text-lg'>{file?.fileName}</h2>
              </div>
            </Link>
          ))
        ) : 
          [1,2,3,4,5,6,7].map((_,index) => (
            <div key={index} className='bg-slate-200 rounded-md h-[150px] animate-pulse'></div>
          ))
        }
      </div>
    </div>
  );
}

export default Page;
