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
      <MarkdownCasing />{" "}
    </Box>
  );
};

export default OldChat;
