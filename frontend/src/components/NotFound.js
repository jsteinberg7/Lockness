// NotFound.js
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const NotFound = () => {
  return (
    <Box textAlign="center" mt="100px">
      <Text fontSize="xl" fontWeight="bold" color="primaryColor">
        You're not supposed to be here!
      </Text>
    </Box>
  );
};

export default NotFound;
