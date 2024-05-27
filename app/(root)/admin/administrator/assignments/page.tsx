import React from "react";

import AssignmentForm from "@/components/general/assignment/AssignmentForm";
import AssignmentReport from "@/components/general/assignment/AssignmentReport";
import AssignmentTable from "@/components/general/assignment/AssignmentTable";
import AssignmentCounter from "@/components/general/assignment/AssignmentCounter";

const AssignmentsPage = () => {
  return (
    <>
      <AssignmentCounter></AssignmentCounter>
      <AssignmentForm></AssignmentForm>
      <AssignmentTable></AssignmentTable>
      <AssignmentReport></AssignmentReport>
    </>
  );
};

export default AssignmentsPage;
