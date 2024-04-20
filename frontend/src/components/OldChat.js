import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import MarkdownCasing from "./Markdown";

const OldChat = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const chatId = queryParams.get("queryId");
  console.log(chatId);

  const userChatData = [
    // We are going to pull this info from the DB
    {
      chatID1: {
        chatId: "chatID1",
        title: "Dialysis spend from 2021 to 2022",
        chatHistory:
          "Initial analysis shows a 10% increase in spending compared to previous period.",
        date: "04/17/2024",
      },
    },
    {
      chatID2: {
        chatId: "chatID2",

        title: "Diabetes treatment updates 2024",
        chatHistory:
          "New insulin types being considered. More data is needed for decision-making.",
        date: "04/17/2024",
      },
    },
    {
      chatID3: {
        chatId: "chatID3",

        title: "Healthcare budget review 2024",
        chatHistory:
          "Meeting scheduled to discuss potential adjustments due to increased demands.",
        date: "04/20/2024",
      },
    },
    {
      chatID4: {
        chatId: "chatID4",

        title: "Patient satisfaction survey results 2024",
        chatHistory:
          "Overall satisfaction has improved. Detailed reports will follow.",
        date: "04/25/2024",
      },
    },
    {
      chatID5: {
        chatId: "chatID5",

        title: "Updates on medical equipment procurement",
        chatHistory:
          "Negotiations with new suppliers are underway. Looking for better pricing.",
        date: "04/28/2024",
      },
    },
  ];


//   const markdownContent =  `
//   ### Step 1: Identify and Select Relevant Tables and Columns

// 1. Choose the appropriate tables that contain the billing information for medical procedures. Typically, this might include tables like transactions, patients, services, etc.

// 1. Identify necessary columns such as amount_spent, date_of_service, state, service_id, and any patient identifiers linking to Medicaid.

// ## Step 2: Filter for Dialysis Services

// - Apply filters to the selected tables and columns to only include rows related to dialysis services.

// - Use service codes, descriptions, or other identifiers specific to dialysis to accurately capture the relevant data.

// ## Step 3: Set Date Range and Location Filters

// - Determine the desired date range for the analysis and filter the data to only include rows within that time period.

// - If looking at data for a specific geographic region, filter the data based on state, zip code, or other location identifiers.

// ## Step 4: Aggregate and Sum Expenses

// - Group the filtered data by relevant dimensions such as date, location, or service type.

// - Sum the amount_spent column for each grouping to calculate total expenses for dialysis services over the specified time period and geographic area.
// `

  const chatData = userChatData.find((chat) => chat[chatId]);

  const chatHistory = chatData
    ? Object.values(chatData)[0].chatHistory
    : "Chat history not available.";

  const chatTitle = chatData
    ? Object.values(chatData)[0].title
    : "Title not avaialble.";
  const date = chatData
    ? Object.values(chatData)[0].date
    : "Date not available.";

  return (
    <Box p="2%" color="#E8F2FC">
      <Text>Title: {chatTitle}</Text>
      <Text>Chat History: {chatHistory}</Text>
      <Text>Date: {date}</Text>
    </Box>
  );
};

export default OldChat;
