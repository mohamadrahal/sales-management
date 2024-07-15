"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";
import InputField from "@/app/[locale]/components/reusables/InputField";

interface Option {
  id: number;
  name: string;
}

interface IssueReportModalProps {
  onClose: () => void;
  fetchReports: () => void;
}

const IssueReportModal: React.FC<IssueReportModalProps> = ({
  onClose,
  fetchReports,
}) => {
  const t = useTranslations("reports");
  const [reportType, setReportType] = useState("Contract Report");
  const [secondSelect, setSecondSelect] = useState("");
  const [lastSelect, setLastSelect] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [lastOptions, setLastOptions] = useState<Option[]>([]);
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const locale = Cookies.get("NEXT_LOCALE") || "en";

  const { token } = useRequireAuth();

  useEffect(() => {
    if (reportType === "Contract Report") {
      setOptions(["salesman", "branch", "team", "period"]);
    } else {
      setOptions(["salesman", "team"]);
    }
  }, [reportType]);

  useEffect(() => {
    const fetchOptions = async () => {
      let apiUrl = "";
      if (reportType === "Contract Report") {
        if (secondSelect === "salesman") {
          apiUrl = "/api/reports/salesmen";
        } else if (secondSelect === "team") {
          apiUrl = "/api/reports/teams";
        }
      } else if (reportType === "Compensation Report") {
        if (secondSelect === "salesman") {
          apiUrl = "/api/reports/salesmen/target";
        } else if (secondSelect === "team") {
          apiUrl = "/api/reports/teams/target";
        }
      }

      if (apiUrl) {
        const response = await axios.get<Option[]>(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLastOptions(response.data);
      } else if (secondSelect === "period") {
        setLastOptions([]); // No need for options if filtering by period
      }
    };

    fetchOptions();
  }, [secondSelect, reportType, token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "periodFrom") {
      setPeriodFrom(value);
    } else if (name === "periodTo") {
      setPeriodTo(value);
    } else {
      // Handle other input changes if needed
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl =
        reportType === "Contract Report"
          ? "/api/reports/contract"
          : "/api/reports/compensation";
      await axios.post(
        apiUrl,
        {
          reportType,
          secondSelect,
          lastSelect:
            secondSelect === "period" ? undefined : Number(lastSelect),
          periodFrom,
          periodTo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReports(); // Fetch reports after issuing a new report
      onClose();
    } catch (error) {
      console.error("Failed to issue report:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">{t("issueReport")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">{t("reportType")}</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Contract Report">{t("contractReport")}</option>
              <option value="Compensation Report">
                {t("compensationReport")}
              </option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">{t("filterBy")}</label>
            <select
              value={secondSelect}
              onChange={(e) => setSecondSelect(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">{t("selectOption")}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {t(option)}
                </option>
              ))}
            </select>
          </div>
          {secondSelect !== "period" && (
            <div className="mb-4">
              <label className="block mb-2">{t("choose")}</label>
              <select
                value={lastSelect}
                onChange={(e) => setLastSelect(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">{t("selectOption")}</option>
                {lastOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <InputField
            type="date"
            name="periodFrom"
            value={periodFrom}
            onChange={handleInputChange}
            placeholder={t("from")}
            label={t("periodFrom")}
            error={undefined}
          />
          <InputField
            type="date"
            name="periodTo"
            value={periodTo}
            onChange={handleInputChange}
            placeholder={t("to")}
            label={t("periodTo")}
            error={undefined}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border border-gray-300 rounded"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {t("issue")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueReportModal;
