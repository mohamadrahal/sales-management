"use client";

import React from "react";
import axios from "axios";

interface DownloadButtonProps {
  contractId: number;
  date: string;
  fileName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  contractId,
  date,
  fileName,
}) => {
  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `/api/contracts/${contractId}/download/${date}/${fileName}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out"
    >
      Download {fileName}
    </button>
  );
};

export default DownloadButton;
