"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAction, useMutation } from 'convex/react';
import { Loader2Icon } from 'lucide-react';
import { api } from "/convex/_generated/api";
import uuid4 from 'uuid4';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'sonner';

function UploadPdf({ children }) {
  const [fileName, setFileName] = useState('');
  const { user } = useUser();
  const [fileSizeError, setFileSizeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [inputFileName, setInputFileName] = useState('');
  const embedDocument = useAction(api.myAction.ingest);
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry = useMutation(api.fileStorage.addFileEntryToDb);
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const [open, setOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (file.size > maxSize) {
        setFileSizeError('File size exceeds the allowed limit of 5MB.');
        setFileName('');
        setFile(null);
      } else {
        setFileSizeError('');
        setFileName(file.name);
        setFile(file);
      }
    }
  };

  const onUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }
    if (!inputFileName.trim()) {
      alert("Please enter a file name before uploading.");
      return;
    }

    setLoading(true);

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("File upload failed.");
      }

      const { storageId } = await result.json();
      console.log("Uploaded File ID:", storageId);
      const fileId = uuid4();
      console.log(fileId);
      const fileUrl = await getFileUrl({ storageId });
      console.log(fileUrl);
      await addFileEntry({
        fileId: fileId,
        storageId: storageId,
        fileName: inputFileName,
        fileUrl: fileUrl,
        createdBy: user?.primaryEmailAddress?.emailAddress
      });
      const ApiResp = await axios.get('/api/pdf-loader?pdfUrl=' + fileUrl);
      console.log(ApiResp.data.result);
      await embedDocument({
        splitText: ApiResp.data.result.map(doc => doc.pageContent),
        fileId: fileId
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed. Please try again.");
    } finally {
      setLoading(false);
      setOpen(false);
      toast("File is ready!!!");
    }
  };

  return (
    <div className="rounded-lg border-3 bg-blue" >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>+ Upload PDF File</Button>
        </DialogTrigger>
        <DialogContent className="z-50 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-left">Upload PDF File</DialogTitle>
            <DialogDescription>
              <div className="mt-10 p-3">
                <div className="text-left">
                  <div className="text-sm">Select a file to upload</div>
                  <div className="p-2 text-md cursor-pointer h-10 w-full mt-3 border rounded-lg">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      id="fileInput"
                    />
                    <label htmlFor="fileInput" className="cursor-pointer">
                      {fileName || 'Choose File'}
                    </label>
                  </div>
                </div>
              </div>
              {fileSizeError && (
                <p className="text-red-500 text-sm mt-2">{fileSizeError}</p>
              )}
              <div className="text-left mt-3 p-3">
                <label>File Name</label>
                <Input
                  placeholder="Enter file name"
                  className="mt-2"
                  value={inputFileName}
                  onChange={(e) => setInputFileName(e.target.value)}
                  required
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={onUpload} disabled={loading}>
              {loading ? <Loader2Icon className="animate-spin" /> : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UploadPdf;
