import { Box, Flex, useToast } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import React from "react";
import ReactMarkdown from "react-markdown";
import MarkdownButton from "./MarkdownButton";

const MarkdownCasing = ({
  markdownContent,
  msgType,
  onContinue = () => { },
  step,
  totalSteps,
  ...rest
}) => {

  const toast = useToast();

  console.log("MarkdownCasing: current step, total steps", step, totalSteps);

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
            width="150px"
            backgroundColor="lightBackgroundColor"
            buttonText="Fix"
            onClick={() => {
              console.log("Something's wrong..."); // TODO: Show input box, prompt llm to fix the output
              // show a coming soon message using toast
              toast({
                title: "Coming soon!",
                description: "This feature is not available yet.",
                status: "info",
                duration: 9000,
                isClosable: true,
              });
            }}
            textColor="primaryColor"
          />
          <MarkdownButton
            ml="1.5%"
            width="150px"
            backgroundColor="lightBackgroundColor"
            buttonText="Ask question"
            onClick={() => {
              console.log("Ask a question..."); // TODO: Prompt llm to explain the output
              toast({
                title: "Coming soon!",
                description: "This feature is not available yet.",
                status: "info",
                duration: 9000,
                isClosable: true,
              });
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
                  ? "Generate full query"
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
