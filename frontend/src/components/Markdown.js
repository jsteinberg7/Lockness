import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import { Box } from "@chakra-ui/react";

const MarkdownCasing = () => {
    const markdown = `
**Step 1: Identify and Select Relevant Tables and Columns**

1. Choose the appropriate tables that contain the billing information for medical procedures. Typically, this might include tables like transactions, patients, services, etc.

1. Identify necessary columns such as amount_spent, date_of_service, state, service_id, and any patient identifiers linking to Medicaid.

## Step 2: Filter for Dialysis Services

- Apply filters to the selected tables and columns to only include rows related to dialysis services.

- Use service codes, descriptions, or other identifiers specific to dialysis to accurately capture the relevant data.

## Step 3: Set Date Range and Location Filters

- Determine the desired date range for the analysis and filter the data to only include rows within that time period.

- If looking at data for a specific geographic region, filter the data based on state, zip code, or other location identifiers.

## Step 4: Aggregate and Sum Expenses

- Group the filtered data by relevant dimensions such as date, location, or service type.

- Sum the amount_spent column for each grouping to calculate total expenses for dialysis services over the specified time period and geographic area.
`;

//   const [markdown, setMarkdown] = useState("");


//   useEffect(() => {
//     fetch("./README.md")
//       .then((res) => res.text())
//       .then((text) => setMarkdown(text));
//   }, []);

  return (

	<div className="post">
	<ReactMarkdown children={markdown} />
  </div>

  );
};

export default MarkdownCasing;
