import React from "react";

import AssignmentForm from "@/components/general/assignment/AssignmentForm";
import AssignmentTable from "@/components/general/assignment/AssignmentTable";
import AssignmentCounter from "@/components/general/assignment/AssignmentCounter";

const AssignmentsPage = () => {
  return (
    <>
      <AssignmentCounter></AssignmentCounter>
      <AssignmentForm></AssignmentForm>
      <AssignmentTable></AssignmentTable>
    </>
  );
};

export default AssignmentsPage;
