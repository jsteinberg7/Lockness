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
  return (
    <Flex flexDirection="column">
      <Text fontSize="md" mt="1%" ml="5%">
        {outlineContent.split("####")[0]}
      </Text>
      <MarkdownCasing
        onContinue={onContinue}
        markdownContent={outlineContent.replace(
          outlineContent.split("####")[0].trim(),
          ""
        )}
      />
    </Flex>
  );
};

export default EnglishOutline;
