import { Button, Text } from "@chakra-ui/react";
import React from "react";

const MarkdownButton = ({ onClick, textColor, buttonText, backgroundColor, ...rest }) => {
  return (
    <Button
      onClick={() => {
        console.log("Turning on editing for this outline");
        onClick(); // Make sure to call the onClick prop if it's provided
      }}
      _active={{
        backgroundColor: backgroundColor,
      }}
      _focus={{
        boxShadow: "none",
        backgroundColor: backgroundColor,
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
