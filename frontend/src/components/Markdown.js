import { Box, Flex, useToast, Button } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import React from "react";
import ReactMarkdown from "react-markdown";
import MarkdownButton from "./MarkdownButton";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import { twilight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyIcon } from '@chakra-ui/icons';

SyntaxHighlighter.registerLanguage('sql', sql);

const MarkdownCasing = ({
  markdownContent,
  msgType,
  onContinue = () => { },
  step,
  totalSteps,
  ...rest
}) => {
  const toast = useToast();

  const newTheme = {
    ...ChakraUIRenderer(),
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <Box position="relative">
          <SyntaxHighlighter
            style={twilight}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
          <CopyToClipboard text={String(children).replace(/\n$/, '')}
            onCopy={() => toast({
              title: "Code Copied",
              description: "Code has been copied to clipboard",
              status: "success",
              duration: 2000,
              isClosable: true,
            })}
          >
            <Button size="xs" position="absolute" top="0" right="0" m="2">
              <CopyIcon mr="2" /> Copy Code
            </Button>
          </CopyToClipboard>
        </Box>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
  };

  return (
    <Box
      backgroundColor="darkBackgroundColor"
      borderRadius="xl"
      {...rest}
    >
      <ReactMarkdown
        py="5"
        px="10"
        backgroundColor="black"
        borderRadius="xl"
        components={newTheme}
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
                step === totalSteps && totalSteps > 1
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
