import {
    Box,
    Center,
    Spinner,
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

    const toast = useToast();

    const messagesEndRef = useRef(null); // Ref to maintain scrolling position

    // Define the step state to manage the chatbot steps
    // Step 0 is English outline
    // All other steps are for code generation
    // Note: We start at -1 to indicate that the user has not yet started the chat
    const [step, setStep] = useState(-1);

    useEffect(() => {
        let currentMessage = {
            text: "",
            sender: "bot",
            step: step,
            type:
                step <= 0
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
                        step <= 0
                            ? "englishOutline"
                            : step === totalSteps
                                ? "finalCode"
                                : "codeStep",
                    step: step,
                }; // Reset for the next message
            }
        });

        socket.on("connect_error", (err) => {
            setError("WebSocket connection failed.");
            setLoading(false);
        });

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

        return () => {
            socket.off("new_message");
            socket.off("connect_error");
        };
    }, [step, totalSteps, messages]);

    const handleSendMessage = (context = "") => {
        if (!inputMessage.trim() && !context.trim()) {
            setError("Please enter a message.");
            return;
        }

        const prompt = context ? context : inputMessage;

        socket.emit("send_prompt", {
            prompt: prompt,
            step: step + 1,
            type: step + 1 <= 0 ? "englishOutline" : step === totalSteps ? "finalCode" : "codeStep",
            prev_code: step + 1 <= 0
                ? messages
                    .filter((message) => message.type === "codeStep")
                    .map((message) => message.text)
                    .join("")
                : "",
        }, {
            headers: {
                // pass in the authorization token from .env file
                Authorization: `Authorization ${process.env.REACT_APP_BACKEND_API_KEY}`
            }
        },
        );

        setMessages((prevMessages) => [
            ...prevMessages,
            {
                text: step === -1 ? inputMessage : "Looks good, continue...",
                sender: "user",
                type: step === -1 ? "prompt" : "continue",
                step: step,
            },
        ]);

        setStep(step + 1);
        setInputMessage("");
        setLoading(true);
    };


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

    console.log(messages)

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
                height={step === -1 ? "75%" : "95%"}
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
                            ) : msg.type === "englishOutline" ? (
                                <EnglishOutline
                                    outlineContent={msg.text ?? ""}
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