"use client";

import React from "react";
import ActionButton from "./ActionButton";
import { IconType } from "react-icons";

interface Column {
  header: string;
  accessor: string;
}

interface Action {
  icon: IconType;
  onClick: (row: any) => void;
  className?: string;
}

type TableProps = {
  columns: Column[];
  data: any[];
  actions?: Action[];
};

const Table = ({ columns, data, actions }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100">
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="px-6 py-2 whitespace-no-wrap border-b border-gray-200"
                >
                  {row[column.accessor]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200">
                  <div className="flex space-x-2">
                    {actions.map((action, actionIndex) => (
                      <ActionButton
                        key={actionIndex}
                        icon={action.icon}
                        onClick={() => action.onClick(row)}
                        className={action.className}
                      />
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
