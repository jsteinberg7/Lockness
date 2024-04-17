import React, { useState, useEffect } from "react";
import { Box, VStack, HStack, Button, Text, Textarea } from "@chakra-ui/react";
import io from "socket.io-client";
import { ArrowUpIcon } from "@chakra-ui/icons";
import logo from "./assets/locknessLogo.png";

// get active domain
const domain = window.location.hostname;

const socket = domain.includes("localhost")
  ? io("http://localhost:5001")
  : io("https://lockness-420607.uc.r.appspot.com");

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I am Lockness. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputMessage, setInputMessage] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    let currentMessage = { text: "", sender: "bot" };

    socket.on("new_message", (message) => {
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
  };

  return (
    <Box
      bg="#3E4B5C"
      color="#E8F2FC"
      h="100vh"
      position="relative"
      py="2%"
    >
      <VStack spacing={4} align="stretch" px="10%">
        {messages.map((msg, index) => (
          <Box
            key={index}
            bg={msg.sender === "user" ? "blue.500" : "gray.600"}
            p={3}
            borderRadius="md"
          >
            <Text fontSize="sm">
              <b>{msg.sender === "user" ? "You" : "Lockness"}:</b> {msg.text}
            </Text>
          </Box>
        ))}
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
      </VStack>
      <HStack
        mt={4}
        position="absolute"
        bottom="10"
        left="40"
        right="40"
        spacing="5"
      >
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Enter your message..."
          colorScheme="white"
          autoFocus={true}
          size="md"
          color="white"
          outlineColor="white"
          borderRadius="md"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSendMessage();
              e.preventDefault();
            }
          }}
        />
        <Button
          colorScheme="white"
          type="submit"
          borderRadius="md"
          outlineColor="white"
          onClick={handleSendMessage}
        >
          <ArrowUpIcon />
        </Button>
      </HStack>
    </Box>
  );
};

export default ChatInterface;
