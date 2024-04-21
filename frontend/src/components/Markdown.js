import React, { useState, useEffect } from "react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

const MarkdownCasing = ({
  markdownContent,
  onContinue = () => { },
  step,
  totalSteps,
}) => {
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
        {step <= totalSteps && (
          <Button
            cursor={"pointer"}
            onClick={async () => {
              await onContinue(markdownContent); // Wait for any asynchronous operations to complete
              setTimeout(() => {
                window.scrollTo({
                  top: 1000,
                  behavior: "smooth",
                });
              }, 500);
              console.log(
                "ScrollHeight:",
                1000
              );
              // Give a little time for the DOM to update after the data is loaded
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
            <Text color="darkBackgroundColor">
              {step === totalSteps ? "Finish code" : "Looks good, continue"}
            </Text>
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default MarkdownCasing;
