"use client";

import React from "react";

type ModalProps = {
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal = ({
  title,
  content,
  onConfirm,
  onCancel,
}: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-4">{content}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
