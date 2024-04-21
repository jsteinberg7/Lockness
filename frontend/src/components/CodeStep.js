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

const CodeStep = ({ totalSteps, step, type, content, onContinue }) => {
  const headerContent = content.split("~~~")[0];

  const code = content
    .replace(headerContent, "")

  return (
    <Flex flexDirection="column">
      <Text fontSize="md" mt="1%" ml="5%">
        {headerContent}
      </Text>
      <MarkdownCasing onContinue={onContinue} markdownContent={code} totalSteps={totalSteps} step={step} />
    </Flex>
  );
};

export default CodeStep;
