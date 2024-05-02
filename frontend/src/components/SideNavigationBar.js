import {
  Box,
  Divider,
  Flex,
  Text,
  VStack,
  useToast
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";

import { BsDatabaseAdd } from "react-icons/bs";
import { SlCloudUpload } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

import defaultProfilePicture from "../assets/defaultProfilePicture.jpeg";
import Profile from "./Profile";

const SideNavigationBar = () => {
  const authAccount = { profilePictureLink: "", name: "Lockness Test" };
  const navigate = useNavigate(); // Hook to navigate programmatically
  const fileInputRef = useRef(null);
  const toast = useToast();
  const [file, setFile] = useState(null); // State to store the uploaded file

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Access the file
    if (file) {
      setFile(file); // Store the file in state
      // TODO: Upload the file to the server, have
      toast({
        title: "File uploaded successfully.",
        description: file.name,
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  // Function to simulate clicking the hidden file input
  const handleClick = () => {
    // fileInputRef.current.click();
    toast({
      title: "Coming soon!",
      description: "Uploading files globally is not available yet. For now, try uploading a file to the chat instead!",
      status: "info",
      duration: 9000,
      isClosable: true,
    });
  };

  const userChatData = [
    {
      chatID1: {
        id: "chatID1",
        title: "Dialysis spend from 2021 to 2022",
        chatHistory:
          "Initial analysis shows a 10% increase in spending compared to previous period.",
        date: "04/17/2024",
      },
    },
    {
      chatID2: {
        id: "chatID2",

        title: "Diabetes treatment updates 2024",
        chatHistory:
          "New insulin types being considered. More data is needed for decision-making.",
        date: "04/17/2024",
      },
    },
    {
      chatID3: {
        id: "chatID3",

        title: "Healthcare budget review 2024",
        chatHistory:
          "Meeting scheduled to discuss potential adjustments due to increased demands.",
        date: "04/20/2024",
      },
    },
    {
      chatID4: {
        id: "chatID4",

        title: "Patient satisfaction survey results 2024",
        chatHistory:
          "Overall satisfaction has improved. Detailed reports will follow.",
        date: "04/25/2024",
      },
    },
    {
      chatID5: {
        id: "chatID5",

        title: "Updates on medical equipment procurement",
        chatHistory:
          "Negotiations with new suppliers are underway. Looking for better pricing.",
        date: "04/28/2024",
      },
    },
  ];
  return (
    <Box
      position="fixed"
      left="0"
      top="0"
      p="1%"
      w="15%"
      h="100%"
      bg="darkBackgroundColor"
      color="primaryColor"
      zIndex="overlay"
    >
      <VStack spacing="2" align="stretch" mt="2%">
        <Flex
          alignItems="center"
          justifyContent="left"
          borderRadius="lg"
          p="6.5%"
          cursor="pointer"
          _hover={{ bg: "lightBackgroundColor" }}
          onClick={handleClick}
        >
          <SlCloudUpload size="10%" />

          <Text ml="5%">Upload Document</Text>
          {/* <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }} // Hide the input element
          /> */}
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="left"
          borderRadius="lg"
          onClick={() => {
            navigate(`/new-chat`);
            console.log("creating new query");
          }}
          p="6.5%"
          cursor="pointer"
          _hover={{ bg: "lightBackgroundColor" }}
        >
          <BsDatabaseAdd size="10%" />
          <Text ml="5%">New Query</Text>
        </Flex>
        <Divider borderColor="#545454" />

        <Text mt="3%" fontSize="sm" mb="2%" fontWeight="semibold">
          Past Queries
        </Text>

        <VStack
          align="start"
          spacing="2"
          height="70vh"
          overflowY="auto"
          sx={{
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "lightBackgroundColor",
              borderRadius: "4px",
            },
          }}
          w="full"
        >
          {userChatData.map((chat, index) => {
            // Since each chat is an object with a dynamic key, let's access the data using Object.values
            const chatData = Object.values(chat)[0];
            return (
              <Box
                key={index} // Use index as key, or better, a unique id if available
                justifyContent="left"
                borderRadius="lg"
                px="6.5%"
                py="3%"
                cursor="pointer"
                onClick={() => {
                  navigate(`/queries?queryId=${chatData.id}`);
                }}
                _hover={{ bg: "lightBackgroundColor" }}
              >
                {chatData.title}
              </Box>
            );
          })}
        </VStack>
      </VStack>

      <Profile
        bottom="5"
        width="13vw"
        profilePicture={defaultProfilePicture}
        authAccountName={authAccount.name}
      />
    </Box>
  );
};

export default SideNavigationBar;
