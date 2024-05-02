import {
  Flex,
  Text
} from "@chakra-ui/react";
import React from "react";
import MarkdownCasing from "./Markdown";

const EnglishOutline = ({ outlineContent, onContinue, totalSteps }) => {
  if (outlineContent === "" || outlineContent === undefined) {
    return <Text>Unable to load data</Text>;
  }

  // Splitting the content for further use in MarkdownCasing
  const splitContent = outlineContent.split("#####") ?? "unable to split";
  const firstPart = splitContent[0] ?? outlineContent; // Safe fallback
  const restOfContent =
    outlineContent.replace(firstPart.trim(), "") ?? "unable to replace";

  return (
    <Flex flexDirection="column">
      <Text fontSize="md" mt="1%" ml="5%">
        {firstPart}
      </Text>
      <MarkdownCasing
        mt="2.5%"
        ml="4%"
        py="5"
        px="10"
        backgroundColor="darkBackgroundColor"
        borderRadius="xl"
        onContinue={onContinue}
        markdownContent={restOfContent}
        step={0}
        totalSteps={totalSteps}
        msgType="englishOutline"
      />
    </Flex>
  );
};

export default EnglishOutline;
