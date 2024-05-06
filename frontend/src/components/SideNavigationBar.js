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
  const sessionIds = JSON.parse(localStorage.getItem("sessionIds")) || [];

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

  const userChatData = sessionIds.reverse().map((sessionId) => ({
    id: sessionId,
    title: "Id: " + sessionId,
    chatHistory: "No chat history available. (TODO)",
    date: "04/17/2024",
  }));

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
            // generate a new 32-long session id
            const sessionId = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
            sessionIds.push(sessionId);
            localStorage.setItem("sessionIds", JSON.stringify(sessionIds));
            navigate(`/chat/${sessionId}`);
            console.log("creating new chat");
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
            return (
              <Box
                key={index} // Use index as key, or better, a unique id if available
                justifyContent="left"
                borderRadius="lg"
                px="6.5%"
                py="3%"
                cursor="pointer"
                onClick={() => {
                  navigate(`/chat/${chat.id}`);
                }}
                _hover={{ bg: "lightBackgroundColor" }}
              >
                {chat.title}
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
