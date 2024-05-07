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
import { useLocation } from "react-router-dom";
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
  const [loadingSession, setLoadingSession] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [socket, setSocket] = useState(null);
  const location = useLocation();

  // get session id from url
  const sessionId = location.pathname.split("/").pop();

  const backendDomain = window.location.hostname.includes("localhost")
    ? "http://localhost:5001"
    : "https://lockness-7a7deea4b2f5.herokuapp.com";


  useEffect(() => {
    // reset fields
    setMessages([]);
    setInputMessage("");
    setError(null);
    setLoading(false);
    setFiles([]);
    setIsFileUploaded(false);
    setTotalSteps(0);
    setStep(-1);
    // TODO: reset socket for new session?
    if (!sessionId) {
      const newSessionId = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
      // update local storage, setting the new session id to the front of the list
      const sessionIds = JSON.parse(localStorage.getItem("sessionIds")) || [];
      sessionIds.unshift(newSessionId);
      localStorage.setItem("sessionIds", JSON.stringify(sessionIds));
      // update the url
      window.history.pushState({}, null, `/chat/${newSessionId}`);
    } else {
      // Fetching chat history
      console.log("Fetching chat history");
      console.log(`${backendDomain}/load-session/${sessionId}`);
      setLoadingSession(true);
      fetch(`${backendDomain}/load-session/${sessionId}`, {
        method: "GET",
        headers: { "Authorization": process.env.REACT_APP_BACKEND_API_KEY }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch');
          }
          if (response.status === 201) {
            // Handle the case where no session was found
            console.log("No matching session was found.");
            return null; // or any other appropriate handling
          }
          return response.json();
        })
        .then(data => {
          if (!data) {
            // If no data received (status was 201), handle appropriately
            setLoading(false);
            setLoadingSession(false);
            setMessages([]);
            return;
          }
          setMessages(data);
          // set the message step to the last step
          if (data.length > 0) {
            setStep(data[data.length - 1].step);
          }
          // set the total steps
          for (let i = 0; i < data.length; i++) {
            if (data[i].requested_msg_type === "englishOutline" && data[i].is_system) {
              calculateTotalSteps(data[i].text);
              break;
            }
          }
          setLoading(false);
          setLoadingSession(false);
        })
        .catch(err => {
          console.error("Failed to fetch messages", err);
          setError("Failed to load messages.");
          setLoading(false);
          setLoadingSession(false);
          toast({
            title: "Error",
            description: "Failed to load messages.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    }
  }, [sessionId]);  // Ensure sessionId is a dependency of useEffect


  // TODO: try loading chat history from db


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
    const newSocket = io(backendDomain);
    setSocket(newSocket);

    newSocket.on("new_message", (data) => {
      setLoading(false);
      setError(null);

      setMessages((prevMessages) => {
        const lastMessage =
          prevMessages.length > 0
            ? prevMessages[prevMessages.length - 1]
            : null;

        if (data.requested_msg_type === "englishOutline" && data.final) {
          // This means we have just gotten the full English Outline, so we can use the latest message to calculate the total steps
          calculateTotalSteps(lastMessage.text);
        }

        if (lastMessage && lastMessage.is_system) {
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
              is_system: true,
              requested_msg_type: data.requested_msg_type,
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

  console.log("messages", messages);

  const handleSendMessage = (context = "") => {
    if (!inputMessage.trim() && !context.trim()) {
      setError("Please enter a message.");
      return;
    }

    const input = context ? context : inputMessage;
    const msgType = getStepType();

    // Prepare to handle file upload if any
    const fileToSend = isFileUploaded ? files[files.length - 1] : null;

    const sendInput = () => {
      // Object to send
      const dataToSend = {
        input: input,
        step: step,
        requested_msg_type: msgType,
        session_id: sessionId,
      };

      // Include file data if available
      if (fileToSend) {
        dataToSend.fileData = fileToSend.data;  // File data prepared as base64
        dataToSend.fileName = fileToSend.name;
        dataToSend.fileType = fileToSend.type;
      }

      socket.emit("send_input", dataToSend);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text:
            (msgType === "clarification" || msgType === "englishOutline")
              ? inputMessage
              : "Looks good, " + ((msgType === "finalCode" ? "generate the full query" : "continue to step " + step) + "..."),
          is_system: false,
          requested_msg_type: msgType,
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

  // console.log(files);

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
        {(messages.length === 0 && !loadingSession) && < NewChatDesign mt="15%" />}
        {messages.map((msg, index) => (
          <Center>
            <Box width="100%" key={index} p={5} borderRadius="md">
              <ChatHeader is_system={msg.is_system} />
              {!msg.is_system && msg.file_name ? (
                <Flex flexDirection="column" mt="1%" ml="5%">
                  <Text fontSize="md">{msg.text}</Text>
                  {msg.fileName !== null && (
                    <Text fontSize="sm" mt="1%">
                      File uploaded: {msg.fileName}
                    </Text>
                  )}
                </Flex>
              ) : msg.requested_msg_type === "clarification" && msg.is_system ? (
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
              ) : msg.requested_msg_type === "englishOutline" && msg.is_system ? (
                <EnglishOutline
                  outlineContent={msg.text}
                  onContinue={handleSendMessage}
                  totalSteps={totalSteps}
                />
              ) : ((msg.requested_msg_type === "codeStep" || msg.requested_msg_type === "finalCode") && msg.is_system) ? (
                < CodeStep
                  content={msg.text}
                  onContinue={handleSendMessage}
                  step={msg.step}
                  totalSteps={totalSteps}
                />
              )
                : (
                  <Text fontSize="md" mt="1%" ml="5%">
                    {msg.text}
                  </Text>
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
            <Text>{totalSteps > 0 && step > totalSteps ? "Generating full query.... This may take a few minutes." : "Hmmm..."}</Text>
          </VStack>
        )}
        {loadingSession && (
          <VStack justifyContent="center" py="5%">
            <Spinner color="primaryColor" />
            <Text>Loading chat...</Text>
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
          placeholderText={step < 0 ? "Enter new research prompt here..." : "Answer the clarification questions here..."}
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
