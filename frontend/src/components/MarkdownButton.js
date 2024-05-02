import { Button, Text } from "@chakra-ui/react";
import React from "react";

const MarkdownButton = ({ onClick, ...rest }) => {
  return (
    <Button
      ml={rest.ml}
      onClick={() => {
        console.log("Turning on editing for this outline");
        onClick(); // Make sure to call the onClick prop if it's provided
      }}
      width={rest.width}
      backgroundColor={rest.backgroundColor}
      _active={{
        backgroundColor: rest.backgroundColor,
      }}
      _focus={{
        boxShadow: "none",
        backgroundColor: rest.backgroundColor,
      }}
      _hover={{
        transform: "scale(1.05)",
      }}
    >
      <Text color={rest.textColor}>{rest.buttonText}</Text>
    </Button>
  );
};

export default MarkdownButton;
