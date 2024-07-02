// components/reusables/DownloadButton.tsx
"use client";

import React from "react";

interface DownloadButtonProps {
  contractId: number;
  fileName: string;
  documentPath: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  contractId,
  fileName,
  documentPath,
}) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/download`);
      if (!response.ok) {
        throw new Error("Failed to download the file");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        a.download = contentDisposition.split("filename=")[1];
      } else {
        a.download = `${fileName}.${documentPath.split(".").pop()}`;
      }

      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-secondary text-white px-4 py-2 rounded-md mt-6"
    >
      Download File
    </button>
  );
};

export default DownloadButton;
