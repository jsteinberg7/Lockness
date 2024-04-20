import React, { useState, useEffect } from "react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

const MarkdownCasing = ({ markdownContent, onContinue = () => {} }) => {
  return (
    <Box
      mt="2.5%"
      ml="4%"
      py="5"
      px="10"
      backgroundColor="darkBackgroundColor"
      borderRadius="xl"
    >
      <ReactMarkdown
        py="5"
        px="10"
        backgroundColor="black"
        borderRadius="xl"
        components={ChakraUIRenderer()}
        children={markdownContent}
      />
      <Flex justifyContent="end" alignItems="center" mt="3%" mb="1%">
        <Button
          onClick={() => {
            console.log("Turning on editing for this outline");
          }}
          width="100px"
          backgroundColor="lightBackgroundColor"
          _active={{
            backgroundColor: "lightBackgroundColor",
          }}
          _focus={{
            boxShadow: "none", // Optional: removes the focus outline if you want
            backgroundColor: "lightBackgroundColor",
          }}
          _hover={{
            transform: "scale(1.05)",
          }}
        >
          <Text color="primaryColor">Edit</Text>
        </Button>
        <Button
          onClick={() => {
            onContinue(markdownContent); // pass overview back into prompt
            window.scrollTo({
              bottom: document.documentElement.scrollHeight,
              behavior: "smooth", // Optional: defines the transition animation
            });
          }}
          backgroundColor="primaryColor"
          ml="2.5%"
          _active={{
            backgroundColor: "primaryColor",
          }}
          _focus={{
            boxShadow: "none", // Optional: removes the focus outline if you want
            backgroundColor: "primaryColor",
          }}
          _hover={{
            transform: "scale(1.05)",
          }}
        >
          <Text color="darkBackgroundColor">Looks good, continue</Text>
        </Button>
      </Flex>
    </Box>
  );
};

export default MarkdownCasing;
