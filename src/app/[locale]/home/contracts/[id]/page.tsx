"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "@/navigation";
import axios from "axios";
import ContractDetails from "../components/ContractDetails";
import { ContractWithBranches } from "../../../../../types/types";

const ContractPage = ({ params }: { params: { id: string } }) => {
  const [contract, setContract] = useState<ContractWithBranches | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(`/api/contracts/${params.id}`);
        setContract(response.data);
      } catch (error) {
        console.error("Failed to fetch contract:", error);
        router.push("/404"); // Redirect to 404 page if not found
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [params.id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!contract) {
    return <p>Contract not found</p>;
  }

  return <ContractDetails contract={contract} />;
};

export default ContractPage;
