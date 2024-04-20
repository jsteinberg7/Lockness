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

const EnglishOutline = ({ outlineContent, onContinue }) => {
  if (outlineContent === '' || outlineContent === undefined) {
    return <Text>Unable to load data</Text>;
  }

  // Splitting the content for further use in MarkdownCasing
  const splitContent = outlineContent.split("###") ?? "unable to split";
  const firstPart = splitContent[0] ?? outlineContent; // Safe fallback
  const restOfContent = outlineContent.replace(firstPart.trim(), "") ?? "unable to replace";

  return (
    <Flex flexDirection="column">
      <Text fontSize="md" mt="1%" ml="5%">
        {firstPart}
      </Text>
      <MarkdownCasing onContinue={onContinue} markdownContent={restOfContent} />
    </Flex>
  );
};

export default EnglishOutline;
