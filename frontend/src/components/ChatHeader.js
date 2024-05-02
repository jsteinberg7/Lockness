import { Box, Flex, Text } from "@chakra-ui/react";

import defaultProfilePicture from "../assets/defaultProfilePicture.jpeg";
import logo from "../assets/locknessLogo.png";

const ChatHeader = ({ sender }) => {
  return (
    <Flex alignItems="center" justifyContent="start">
      <Box
        display="inline-block"
        width="40px"
        height="40px"
        borderRadius="50%"
        backgroundImage={sender === "user" ? defaultProfilePicture : logo}
        backgroundSize="cover"
      />
      <Text ml="1.5%" size="lg" fontWeight="bold">
        {sender === "user" ? "You" : "Lockness AI"}
      </Text>
    </Flex>
  );
};

export default ChatHeader;
