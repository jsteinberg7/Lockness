import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Textarea,
  Spinner,
  Flex,
  Center,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import io from "socket.io-client";
import { ArrowUpIcon } from "@chakra-ui/icons";
import logo from "./assets/locknessLogo.png";
import defaultProfilePicture from "./assets/defaultProfilePicture.jpeg";

import { TriangleUpIcon } from "@chakra-ui/icons"; // Or any other appropriate icon
import MarkdownCasing from "./components/Markdown";

// get active domain
const domain = window.location.hostname;

const socket = domain.includes("localhost")
  ? io("http://localhost:5001")
  : io("https://lockness-420607.uc.r.appspot.com");

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    // {
    //   text: "Hello! I am Lockness. How can I help you today?",
    //   sender: "bot",
    // },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let currentMessage = { text: "", sender: "bot" };

    socket.on("new_message", (message) => {
      setLoading(false);
      setError(null);
      if (!message.final && message.text) {
        currentMessage.text += message.text;
        setMessages((prevMessages) => {
          // Update the last bot message if it exists, otherwise add a new one
          if (
            prevMessages.length &&
            prevMessages[prevMessages.length - 1].sender === "bot"
          ) {
            return [...prevMessages.slice(0, -1), currentMessage];
          } else {
            return [...prevMessages, currentMessage];
          }
        });
      } else if (message.final && currentMessage.text) {
        // Push the complete message only if there's text in the current message
        // setMessages(prevMessages => [...prevMessages, currentMessage]);
        currentMessage = { text: "", sender: "bot" }; // Reset for the next message
      }
    });

    socket.on("connect_error", (err) => {
      setError("WebSocket connection failed.");
      setLoading(false);
    });

    return () => {
      socket.off("new_message");
      socket.off("connect_error");
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) {
      setError("Please enter a message.");
      return;
    }
    socket.emit("send_prompt", { prompt: inputMessage });
    // Do not clear the inputMessage here if you want to retain the input until it's manually cleared
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputMessage, sender: "user" },
    ]);
    setInputMessage("");
    setLoading(true);
  };

  return (
    <Box bg="#3E4B5C" color="#E8F2FC" h="100vh" position="relative" py="2%">

    {/* <Box backgroundColor = "blue" overflow="auto" height = "75%">




    </Box> */}
      <VStack spacing={4} align="stretch" px="10%" overflow="auto" height = "75%">
        {messages.length === 0 && (
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            mt="15%"
          >
            <Box
              display="inline-block"
              width="65px"
              height="65px"
              borderRadius="50%"
              backgroundImage={logo}
              backgroundSize="cover"
            />

            <Text fontSize="xl" fontWeight="bold" mt="2%">
              How can I help you with your research today?
            </Text>
          </Flex>
        )}
        {messages.map((msg, index) => (
          <Center>
            <Box
              width="100%"
              key={index}
              // bg={msg.sender === "user" ? "blue.500" : "gray.600"}
              p={5}
              borderRadius="md"
            >
              <Flex alignItems="center" justifyContent="start">
                <Box
                  display="inline-block"
                  width="40px"
                  height="40px"
                  borderRadius="50%"
                  backgroundImage={
                    msg.sender === "user" ? defaultProfilePicture : logo
                  }
                  backgroundSize="cover"
                />
                <Text ml="1%" size="lg" fontWeight="bold">
                  {msg.sender === "user" ? "You" : "Lockness AI"}
                </Text>
              </Flex>

              {msg.sender === "user" ? (
                <Text fontSize="md" mt="1%" ml="5%">
                  {msg.text}
                </Text>
              ) : (
                <MarkdownCasing markdownContent={msg.text} />
              )}
            </Box>
          </Center>
        ))}
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
        {loading && (
          <VStack justifyContent="center" py="5%">
            <Spinner color="white" />
            <Text>Hmmm...</Text>
          </VStack>
        )}
      </VStack>

      <Flex
        position="absolute"
        bottom="2%"
        justifyContent="center"
        width="50%"
        left="25%"
      >
        <VStack spacing={5} width="100%">
          <InputGroup size="md">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                messages.length === 0
                  ? "Enter new research prompt here..."
                  : "Message Lockness..."
              }
              style={{
                background: "#3E4B5C",
                color: "#E8F2FC",
                borderRadius: "8px",
                width: "100%",
                height: "15vh",
                resize: "none", // Allows vertical resizing
                overflowY: "auto", // Adds scroll if content overflows
                borderColor: "#E8F2FC",
                placeholderColor: "#B4B4B4",
                padding: "2%",
                fontSize: "sm",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSendMessage();
                  e.preventDefault();
                }
              }}
            />

            <Button
              size="lg"
              color="#E8F2FC"
              onClick={handleSendMessage}
              ml="1rem" // Adjust the margin to align the button as in the design
              borderRadius="lg"
              height="50%"
              isDisabled={inputMessage === ""}
            >
              <ArrowUpIcon color="black" />
            </Button>
          </InputGroup>
          <Text color="#B4B4B4" fontSize="sm">
            Lockness AI produces results based on the query and the data it has
            access to.
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default ChatInterface;
