import {
  Box,
  Center,
  Spinner,
  Flex,
  Text,
  VStack,
  useToast,
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
// const domain = window.location.hostname;

// const socket = domain.includes("localhost")
//   ? io("http://localhost:5001")
//   : io("https://lockness-420607.uc.r.appspot.com");

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [totalSteps, setTotalSteps] = useState(4);
  const [socket, setSocket] = useState(null);

  const toast = useToast();

  const messagesEndRef = useRef(null); // Ref to maintain scrolling position

  // Define the step state to manage the chatbot steps
  // Step 0 is English outline
  // All other steps are for code generation
  // Note: We start at -1 to indicate that the user has not yet started the chat
  const [step, setStep] = useState(-2); // -2 is the start

  const handleUploadFileClick = () => {
    fileInputRef.current.click();
  };

  const calculateTotalSteps = (englishOutline) => {
    // parse through headers and find number of headers = number of steps
    setTotalSteps(englishOutline.split("#####").length - 1);
  };

  // add file to the staging area - file will be uploaded with the message
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // check file type, ensure it is a csv file, txt file, or pdf
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
        return;
      }

      // add file to the staging area, by appending to the files array
      setFiles([...files, file]);
      // clear the file input
      event.target.value = null;

      toast({
        title: "File uploaded successfully.",
        description: file.name,
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  };

//   useEffect(() => {
//     const domain = window.location.hostname.includes("localhost")
//       ? "http://localhost:5001"
//       : "https://lockness-420607.uc.r.appspot.com";
//     const newSocket = io(domain);
//     setSocket(newSocket);
//     newSocket.on("new_message", (data) => {
//       setMessages((prevMessages) => {
//         // Check if there are any messages and if the last message is from the bot
//         if (
//           prevMessages.length > 0 &&
//           prevMessages[prevMessages.length - 1].sender === "bot"
//         ) {
//           // Clone the last message and append the new text
//           const updatedLastMessage = {
//             ...prevMessages[prevMessages.length - 1],
//             text: prevMessages[prevMessages.length - 1].text + data.text,
//           };

//           // Return the array with the updated last message
//           return [...prevMessages.slice(0, -1), updatedLastMessage];
//         } else {
//           // If the last message is not from the bot, add a new message object
//           return [
//             ...prevMessages,
//             {
//               text: data.text,
//               sender: "bot",
//               type: getStepType(),
//               step: step + 1,
//             },
//           ];
//         }
//       });

//       if (data.final) {
//         setStep((prevStep) => prevStep + 1); // Update the step state
//         setLoading(false); // Turn off loading when stream ends
//       }
//     });

//     return () => {
//       newSocket.close();
//     };
//   }, []);    CORRECT WORKING STREAM


useEffect(() => {
    const domain = window.location.hostname.includes("localhost")
      ? "http://localhost:5001"
      : "https://lockness-420607.uc.r.appspot.com";
    const newSocket = io(domain);
    setSocket(newSocket);
  
    newSocket.on("new_message", (data) => {
      setMessages((prevMessages) => {
        const lastMessage = prevMessages.length > 0 ? prevMessages[prevMessages.length - 1] : null;
  
        if (lastMessage && lastMessage.sender === "bot") {
          // Update the last bot message
          const updatedLastMessage = {
            ...lastMessage,
            text: lastMessage.text + data.text,
          };
          return [...prevMessages.slice(0, -1), updatedLastMessage];
        } else {
          // Add a new bot message
          return [...prevMessages, {
            text: data.text,
            sender: "bot",
            type: getStepType(),
            step: prevMessages.length > 0 ? prevMessages[prevMessages.length - 1].step + 1 : 1,
          }];
        }
      });
  
      if (data.final) {
        setStep(prevStep => prevStep + 1);
        setLoading(false);
      }
    });
  
    return () => {
      newSocket.close();
    };
  }, []); // Review if dependencies like `getStepType` or others need to be included
  

  console.log(messages);

  const getStepType = () => {
  
    if (step === -2) {
      return "clarification";
    }
    if (step === -1) {
      return "userInput";
    } else if (step === 0) {
      return "englishOutline";
    } else if (step === totalSteps) {
      return "finalCode";
    } else {
      return "codeStep";
    }
  };
  
  //   const handleSendMessage = (context = "") => {
  //     setStep((prevStep) => prevStep + 1); // Update the step state

  //     // Thsi one streams incrementally
  //     if (!inputMessage.trim() && !context.trim()) {
  //       alert("Please enter a message.");
  //       return;
  //     }

  //     const input = context ? context : inputMessage;

  //     socket.emit("send_input", {
  //       input: input,
  //       step: step + 1,
  //       type: getStepType(),
  //     });

  //     // Update UI and state accordingly
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         text: input,
  //         sender: "user",
  //         type: "userInput",
  //         step: step
  //       },
  //     ]);

  //     setInputMessage("");
  //     setLoading(true);
  //   };

  const handleSendMessage = (context = "") => {
    if (!inputMessage.trim() && !context.trim()) {
        alert("Please enter a message.");
        return;
    }

    const input = context ? context : inputMessage;
    const nextStep = step + 1; // Create a local variable for immediate use

    // Emit to socket with the next step
    
    console.log("Step before sending message:", step);
    socket.emit("send_input", {
      input: input,
      step: nextStep,
      type: getStepType(),
    });
    console.log("Step after sending message:", step);
        // Update the messages array
    setMessages((prevMessages) => [
        ...prevMessages,
        {
            text: input,
            sender: "user",
            type: "userInput",
            step: step,  // use current step for display purposes
        },
    ]);

    // Update input state and increment step
    setInputMessage("");
    setLoading(true);
    setStep(nextStep); // Set the step state after using the local variable
};


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
                <Text fontSize="md" mt="1%" ml="5%">
                  {msg.text}
                </Text>
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
                <Text fontSize="md" mt="1%" ml="5%">
                  {msg.text}
                </Text>

                // <CodeStep
                //content={msg.text}
                //onContinue={handleSendMessage}
                //step={msg.step}
                //totalSteps={totalSteps}
                //msgType={msg.type}
                ///>
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

      <Text>{step}</Text>

      <UserInput
        step={step}
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
