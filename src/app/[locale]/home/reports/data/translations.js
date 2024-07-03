export const getFilterOptions = (t2) => [
  { label: t2("filter.perPeriod"), value: "per period" },
  { label: t2("filter.perBranch"), value: "per branch" },
  { label: t2("filter.perBranchCity"), value: "per branch city" },
  { label: t2("filter.perTeam"), value: "per team" },
  { label: t2("filter.perSalesman"), value: "per salesman" },
];

export const getReportsColumns = (t2, filterType) => [
  { header: t2("columns.id"), accessor: "id" },
  { header: t2("columns.type"), accessor: "type" },
  {
    header:
      filterType === "per period" ? t2("columns.period") : t2("columns.branch"),
    accessor: filterType === "per period" ? "period" : "branch",
  },
  { header: t2("columns.amount"), accessor: "amount" },
];
