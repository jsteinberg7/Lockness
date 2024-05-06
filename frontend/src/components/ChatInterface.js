import {
  Box,
  Center,
  Flex,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import ChatHeader from "./ChatHeader";
import CodeStep from "./CodeStep";
import EnglishOutline from "./EnglishOutline";
import MarkdownCasing from "./Markdown";
import NewChatDesign from "./NewChatDesign";
import UserInput from "./UserInput";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [socket, setSocket] = useState(null);

  const toast = useToast();

  const messagesEndRef = useRef(null); // Ref to maintain scrolling position

  // Define the step state to manage the chatbot steps
  // Step 0 is English outline
  // All other steps are for code generation

  const [step, setStep] = useState(-1); // -1 is the start

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

      toast({
        title: "File uploaded successfully.",
        description: file.name,
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const domain = window.location.hostname.includes("localhost")
      ? "http://localhost:5001"
      : "https://lockness-420607.uc.r.appspot.com";
    const newSocket = io(domain);
    setSocket(newSocket);

    newSocket.on("new_message", (data) => {
      setLoading(false);
      setError(null);

      setMessages((prevMessages) => {
        const lastMessage =
          prevMessages.length > 0
            ? prevMessages[prevMessages.length - 1]
            : null;

        if (data.type === "englishOutline" && data.final) {
          // This means we have just gotten the full English Outline, so we can use the latest message to calculate the total steps
          calculateTotalSteps(lastMessage.text);
        }

        if (lastMessage && lastMessage.sender === "bot") {
          // Update the last bot message
          const updatedLastMessage = {
            ...lastMessage,
            text: lastMessage.text + data.text,
          };
          return [...prevMessages.slice(0, -1), updatedLastMessage];
        } else {
          // Add a new bot message
          return [
            ...prevMessages,
            {
              text: data.text,
              sender: "bot",
              type: data.type,
              step: data.step,
            },
          ];
        }
      });

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => {
      newSocket.close();
    };
  }, []); // Review if dependencies like `getStepType` or others need to be included

  console.log(messages);

  const getStepType = (msgStep = step) => {
    if (msgStep === -1) {
      return "clarification";
    } else if (msgStep === 0) {
      return "englishOutline";
    } else if (msgStep === totalSteps + 1) {
      return "finalCode";
    } else {
      return "codeStep";
    }
  };

  const handleSendMessage = (context = "", type = "") => {
    if (!inputMessage.trim() && !context.trim()) {
      setError("Please enter a message.");
      return;
    }

    const input = context ? context : inputMessage;
    const msgType = type !== "" ? type : getStepType();

    // Prepare to handle file upload if any
    const fileToSend = isFileUploaded ? files[files.length - 1] : null;

    const sendInput = () => {
      // Object to send
      const dataToSend = {
        input: input,
        step: step,
        type: msgType,
      };

      // Include file data if available
      if (fileToSend) {
        dataToSend.fileData = fileToSend.data; // File data prepared as base64
        dataToSend.fileName = fileToSend.name;
        dataToSend.fileType = fileToSend.type;
      }


      socket.emit("send_input", dataToSend);

      setMessages((prevMessages) => [   // handle "explanation" type here?? what to do?
        ...prevMessages,
        {
          text:
            msgType === "clarification" || msgType === "englishOutline" || msgType === "explanation"
              ? inputMessage
              : "Looks good, " +
                ((msgType === "finalCode"
                  ? "generate the full query"
                  : "continue to step " + step) +
                  "..."),
          sender: "user",
          type: msgType,
          step: step,
          fileName: fileToSend ? fileToSend.name : null,
          fileType: fileToSend ? fileToSend.type : null,
        },
      ]);

      setInputMessage("");
      setIsFileUploaded(false);
      setLoading(true);
      setStep(step + 1);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
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

  console.log(files);

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
        height={step <= 0 ? "75%" : "95%"}
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
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  handleSendMessage={handleSendMessage}
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

      {step <= 0 && (
        <UserInput
          handleUploadFileClick={handleUploadFileClick}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isFileUploaded={isFileUploaded}
          position="absolute"
          bottom="2%"
          mt="2%"
          width="50%"
          left="25%"
        />
      )}
    </Box>
  );
};

export default ChatInterface;
