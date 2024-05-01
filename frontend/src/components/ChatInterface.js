import {
  Box,
  Center,
  Spinner,
  Text,
  VStack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import ChatHeader from "./ChatHeader";
import EnglishOutline from "./EnglishOutline";
import CodeStep from "./CodeStep";
import NewChatDesign from "./NewChatDesign";
import UserInput from "./UserInput";
import MarkdownCasing from "./Markdown";

// get active domain
const domain = window.location.hostname;

const socket = domain.includes("localhost")
  ? io("http://localhost:5001")
  : io("https://lockness-420607.uc.r.appspot.com");

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const toast = useToast();

  const messagesEndRef = useRef(null); // Ref to maintain scrolling position

  // Define the step state to manage the chatbot steps
  // Step 0 is English outline
  // All other steps are for code generation
  // Note: We start at -1 to indicate that the user has not yet started the chat
  const [step, setStep] = useState(-2); // -2 is the start

  useEffect(() => {
    let currentMessage = {
      text: "",
      sender: "bot",
      step: step,
      type:
        step <= -1
          ? "clarification"
          : step <= 0
          ? "englishOutline"
          : step === totalSteps
          ? "finalCode"
          : "codeStep",
    };

    socket.on("new_message", (message) => {
      setLoading(false);
      setError(null);
      if (!message || !message.text) {
        return;
      }

      console.log("New message received: ", message);

      if (step === 0) {
        // This means we have just gotten the English Outline
        calculateTotalSteps(message.text);
      }

      if (!message.final) {
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
        setMessages((prevMessages) => [...prevMessages, currentMessage]);

        currentMessage = {
          text: "",
          sender: "bot",
          type:
            step <= -1
              ? "clarification"
              : step <= 0
              ? "englishOutline"
              : step === totalSteps
              ? "finalCode"
              : "codeStep",
          step: step,
        }; // Reset for the next message
      }
    });

    socket.on("connect_error", (err) => {
      // setError("WebSocket connection failed."); // for now, hide the error
      console.error("WebSocket connection failed: ", err);
      setLoading(false);
    });

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    return () => {
      socket.off("new_message");
      socket.off("connect_error");
    };
  }, [step, totalSteps, messages]);

  const handleSendMessage = (context = "") => {
    setLoading(true);
    const input = context.trim() ? context.trim() : inputMessage.trim();

    if (!input) {
      setError("Please enter a message.");
      setLoading(false);
      return;
    }

    const messageType =
      step + 1 <= -1
        ? "clarification"
        : step < 0
        ? "englishOutline"
        : step === totalSteps
        ? "finalCode"
        : "codeStep";

    const fileToSend = isFileUploaded ? files[files.length - 1] : null; // Get the last file

    const sendInput = () => {
      socket.emit("send_input", {
        input: input,
        step: step + 1,
        type: messageType,
        fileData: fileToSend ? fileToSend.data : undefined, // Ensure file data is attached if available
        fileName: fileToSend ? fileToSend.name : undefined,
        fileType: fileToSend ? fileToSend.type : undefined,
      });

      // Update the messages state with the new message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: input,
          sender: "user",
          type: messageType,
          step: step,
          fileName: fileToSend ? fileToSend.name : null,
          fileType: fileToSend ? fileToSend.type : null,
        },
      ]);
      setIsFileUploaded(false);
      setInputMessage(""); // Clear the input message
      setStep((prevStep) => prevStep + 1); // Increment the step
    };

    if (fileToSend) {
      const reader = new FileReader();
      reader.onload = (event) => {
        fileToSend.data = event.target.result; // Prepare file data as base64
        sendInput();
      };
      reader.readAsDataURL(fileToSend); // Read the file as Data URL (base64)
    } else {
      sendInput();
    }
  };

  const handleUploadFileClick = () => {
    fileInputRef.current.click();
  };

  const calculateTotalSteps = (englishOutline) => {
    // parse through headers and find number of headers = number of steps
    setTotalSteps(englishOutline.split("#####").length - 1);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Check file type, ensure it is a csv, txt, or pdf
      if (
        file.type !== "text/csv" &&
        file.type !== "text/plain" &&
        file.type !== "application/pdf"
      ) {
        toast({
          title: "Invalid file type.",
          description: "Please upload a .csv, .txt, or .pdf file.",
          status: "error",
          duration: 1500,
          isClosable: true,
        });
        setIsFileUploaded(false);
        return;
      }

      // Prepare the file for upload but do not send yet
      setFiles([...files, file]);
      setIsFileUploaded(true);

      // Notify successful file preparation
      toast({
        title: "File ready to be uploaded.",
        description: file.name,
        status: "info",
        duration: 1500,
        isClosable: true,
      });

      // Clear the file input to allow for new uploads
      event.target.value = null;
    }
  };

  console.log(messages);
  return (
    <Box
      bg="lightBackgroundColor"
      color="primaryColor"
      h="100vh"
      position="relative"
      py="2%"
    >
      <VStack
        spacing={4}
        align="stretch"
        px="10%"
        overflow="auto"
        height={step <= -1 ? "75%" : "95%"}
      >
        {messages.length === 0 && <NewChatDesign mt="15%" />}
        {messages.map((msg, index) => (
          <Center>
            <Box width="100%" key={index} p={5} borderRadius="md">
              <ChatHeader sender={msg.sender} />
              {msg.sender === "user" ? (
                <Flex flexDirection="column" mt="1%" ml="5%">
                  <Text fontSize="md">{msg.text}</Text>
                  {msg.fileName !== null && (
                    <Text fontSize="sm" mt="1%">
                      File uploaded: {msg.fileName}
                    </Text>
                  )}
                </Flex>
              ) : msg.type === "clarification" ? (
                <MarkdownCasing
                  mt="2.5%"
                  ml="4%"
                  py="5"
                  px="10"
                  msgType="clarification"
                  markdownContent={msg.text}
                  onContinue={handleSendMessage}
                  step={step}
                  totalSteps={totalSteps}
                />
              ) : msg.type === "englishOutline" ? (
                <EnglishOutline
                  outlineContent={msg.text}
                  onContinue={handleSendMessage}
                  totalSteps={totalSteps}
                />
              ) : (
                <CodeStep
                  content={msg.text}
                  onContinue={handleSendMessage}
                  step={msg.step}
                  totalSteps={totalSteps}
                  msgType={msg.type}
                />
              )}
            </Box>
          </Center>
        ))}
        <div ref={messagesEndRef} />
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
        {loading && (
          <VStack justifyContent="center" py="5%">
            <Spinner color="primaryColor" />
            <Text>Hmmm...</Text>
          </VStack>
        )}
      </VStack>

      <UserInput
        step={step}
        isFileUploaded={isFileUploaded}
        handleUploadFileClick={handleUploadFileClick}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        position="absolute"
        bottom="2%"
        width="50%"
        left="25%"
      />
    </Box>
  );
};

export default ChatInterface;
