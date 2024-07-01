// translations.js

export const getFilterOptions = (t2) => [
  { label: t2("teamTargets"), value: "team" },
  { label: t2("salesmanTargets"), value: "salesman" },
];

export const getTargetsColumns = (t2, filter) => {
  const columns = [
    { header: t2("columns.id"), accessor: "id" },
    { header: t2("columns.ownerType"), accessor: "targetType" },
    {
      header: t2("columns.ownerName"),
      accessor: (row) => row.team?.name || row.individual?.name || "",
    },
    { header: t2("columns.periodFrom"), accessor: "periodFrom" },
    { header: t2("columns.periodTo"), accessor: "periodTo" },
    { header: t2("columns.numberOfContracts"), accessor: "numberOfContracts" },
    { header: t2("columns.totalAmountLYD"), accessor: "totalAmountLYD" },
  ];

  if (filter === "team") {
    columns.splice(3, 0, { header: t2("columns.teamId"), accessor: "teamId" });
  } else if (filter === "salesman") {
    columns.splice(3, 0, { header: t2("columns.userId"), accessor: "userId" });
  }

  return columns;
};
