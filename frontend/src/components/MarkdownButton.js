import React from "react";
import { Button, Text } from "@chakra-ui/react";

const MarkdownButton = ({ onClick, textColor, buttonText, ...rest }) => {
  return (
    <Button
      onClick={() => {
        console.log("Turning on editing for this outline");
        onClick(); // Make sure to call the onClick prop if it's provided
      }}
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
      {...rest}
    >
      <Text color={textColor}>{buttonText}</Text>
    </Button>
  );
};

export default MarkdownButton;
