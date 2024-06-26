import React from "react";
import { BranchesProvider } from "../../context/BranchContext";
import BranchesPageWrapper from "./components/BranchesPageWrapper";

const page = () => {
  return (
    <BranchesProvider>
      <div>
        <BranchesPageWrapper />
      </div>
    </BranchesProvider>
  );
};

export default page;
