"use client";

import { useState } from "react";
import { FileUpload } from "@/components/motion/file-upload";

export function FileUploadPreview() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-sm">
      <FileUpload
        value={files}
        onChange={setFiles}
        accept="image/png,image/jpeg,.pdf"
        maxSize={5 * 1024 * 1024}
      />
    </div>
  );
}
