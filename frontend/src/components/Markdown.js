import React, { useState, useEffect } from "react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";

import { Box } from "@chakra-ui/react";

const MarkdownCasing = ({ markdownContent }) => {
  return (
    <Box mt = "2.5%" ml="4%" py="5" px="10" backgroundColor="black" borderRadius="xl">
      <ReactMarkdown
        py="5"
        px="10"
        backgroundColor="black"
        borderRadius="xl"
        components={ChakraUIRenderer()}
        children={markdownContent}
      />
    </Box>
  );
};

export default MarkdownCasing;
