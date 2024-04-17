import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Input, Button, Text, FormControl, Textarea } from '@chakra-ui/react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import logo from './assets/favicon.png';
import { ArrowUpIcon } from '@chakra-ui/icons';

const ChatInterface = () => {
    const [messages, setMessages] = useState([{ text: 'Hello! How can I help you today?', sender: 'bot' }]);
    const [inputMessage, setInputMessage] = useState('');
    const [error, setError] = useState(null);
    const [source, setSource] = useState(null);

    // Function to send the user's prompt to the backend
    const sendPromptToBackend = (prompt) => {
        fetch('http://localhost:5001/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // show the response in the console
                console.log('Response:', response);
                return response;
            })
            .catch((error) => {
                console.error('Failed to send message:', error);
                setError(error.message);
            });
    };

    useEffect(() => {
        if (!source) {
            initializeEventSource();
        }
        return () => {
            if (source) {
                source.close();
            }
        };
    }, [source]); // Only run when source changes

    // Function to initialize the EventSource connection
    // Modify the sendMessage function
    const handleSendMessage = () => {
        setError(null);
        if (!inputMessage.trim()) {
            setError('Please enter a message.');
            return;
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputMessage, sender: 'user' }
        ]);

        sendPromptToBackend(inputMessage);

        setInputMessage('');
    };

    // Separate function to handle EventSource initialization
    const initializeEventSource = () => {
        const eventSource = new EventSourcePolyfill('http://localhost:5001/chat');
        eventSource.onmessage = (event) => {
            console.log('Received message!');
            console.log(event);
            const data = JSON.parse(event.data);
            console.log('Received message:', data.text);
            setMessages((prevMessages) => [...prevMessages, { text: data.text, sender: 'bot' }]);
        };
        eventSource.onerror = (event) => {
            console.error('EventSource failed:', event);
            setError('An error occurred while streaming the response.');
            eventSource.close();
        };
        setSource(eventSource);
    };

    // Cleanup EventSource when component unmounts
    useEffect(() => {
        return () => {
            if (source) {
                source.close();
            }
        };
    }, [source]);

    return (
        <Box p={4}
            bg="gray.800"
            color="white"
            h="100vh"
            overflow="scroll"
            borderRadius="lg"
            boxShadow="base"
            position="relative"
            backgroundImage={`url(${logo})`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="200px"
        >
            <VStack spacing={4} align="stretch" px="10%">
                {messages.map((message, index) => (
                    <Box
                        key={index}
                        bg={message.sender === 'user' ? 'blue.500' : 'gray.600'}
                        p={3}
                        borderRadius="md"
                    >
                        <Text fontSize="sm"><b>{message.sender === 'user' ? 'You' : 'Lochness'}:</b> {message.text}</Text>
                    </Box>
                ))}
                {error && <Text color="red.500" mb={4}>An error has occurred: {error}</Text>}
            </VStack>
            <HStack mt={4} position="absolute" spacing="5"
                bottom="10" left="40" right="40">
                <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Enter your message..."
                    colorScheme='white'
                    autoFocus={true}
                    size="md"
                    color="white"
                    outlineColor="white"
                    borderRadius="md"
                    onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            handleSendMessage();
                            e.preventDefault();
                        }
                    }}
                />
                <Button colorScheme="white" type="submit" borderRadius="md" outlineColor="white" onClick={handleSendMessage}>
                    <ArrowUpIcon />
                </Button>
            </HStack>
        </Box >
    );
};

export default ChatInterface;
