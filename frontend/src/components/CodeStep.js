import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Textarea,
  Spinner,
  Flex,
  Center,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import MarkdownCasing from "./Markdown";

const CodeStep = ({ step, stepContent, onContinue }) => {
  const headerContent = stepContent.split("~~~")[0];

  const code = stepContent
    .replace(headerContent, "")

  return (
    <Flex flexDirection="column">
      <Text fontSize="md" mt="1%" ml="5%">
        {headerContent}
      </Text>
      <MarkdownCasing onContinue={onContinue} markdownContent={code} />
      {/* <Text fontSize="md" fontWeight="bold" mt="2.5%" ml="5%">
        Explanation
      </Text> */}
      {/* <Text fontSize="md" mt="1%" ml="5%">
        {footerContent}
      </Text> */}
    </Flex>
  );
};

export default CodeStep;
