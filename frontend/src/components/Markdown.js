import React, { useState, useEffect } from "react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import MarkdownButton from "./MarkdownButton";

const MarkdownCasing = ({
  markdownContent,
  msgType,
  onContinue = () => { },
  step,
  totalSteps,
  ...rest
}) => {

  return (
    <Box
      mt={rest.mt}
      ml={rest.ml}
      py={rest.py}
      px={rest.px}
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
      {msgType !== "clarification" && (
        <Flex justifyContent="end" alignItems="center" mt="3%" mb="1%">
          <MarkdownButton
            width="100px"
            backgroundColor="lightBackgroundColor"
            buttonText="Edit"
            onClick={() => {
              console.log("Turning on editing for this outline");
            }}
            textColor="primaryColor"
          />

          {step <= totalSteps && (
            <MarkdownButton
              width="200px"
              backgroundColor="primaryColor"
              textColor="darkBackgroundColor"
              buttonText={
                step === totalSteps
                  ? "Final code"
                  : "Continue to step " + (step + 1)
              }
              onClick={() => {
                onContinue(markdownContent);
              }}
              ml="2.5%"
            />
          )}
        </Flex>
      )}
    </Box>
  );
};

export default MarkdownCasing;
