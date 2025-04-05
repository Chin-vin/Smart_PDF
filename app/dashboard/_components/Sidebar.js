import Image from 'next/image';
import React,{lazy} from 'react';
import { Button } from "@/components/ui/button";
import { Layout, Shield } from 'lucide-react';
import { Progress } from '@radix-ui/react-progress';
import UploadPdf from './UploadPdf';

function Sidebar() {
  return (
    <div className="shadow-sm h-screen p-5">
      <Image src={'/logo.svg'} alt="logo"  loading="lazy" width={40} height={40} />
      <div className="mt-10">
       <UploadPdf>
        <Button className="w-full cursor-pointer">+Upload PDF</Button>
        </UploadPdf>
        <div
          className="flex gap-2 items-center p-5 mt-3 hover:bg-slate-100 dark:hover:bg-slate-700 w-full rounded-lg cursor-pointer transition-colors duration-300">
          <Layout />
          <h2>WorkSpace</h2>
        </div>
        <div
          className="flex gap-2 items-center p-5 w-full hover:bg-red-500 dark:hover:bg-black-600 rounded-lg cursor-pointer transition-colors duration-300">
          <Shield className='h-4'/>
          <h2>Upgrade</h2>
        </div>
      </div>
      </div>
  );
}

export default Sidebar;
