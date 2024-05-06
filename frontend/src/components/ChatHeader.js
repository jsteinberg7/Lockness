import { Box, Flex, Text } from "@chakra-ui/react";

import defaultProfilePicture from "../assets/defaultProfilePicture.jpeg";
import logo from "../assets/locknessLogo.png";

const ChatHeader = ({ is_system }) => {
  return (
    <Flex alignItems="center" justifyContent="start">
      <Box
        display="inline-block"
        width="40px"
        height="40px"
        borderRadius="50%"
        backgroundImage={is_system ? logo : defaultProfilePicture}
        backgroundSize="cover"
      />
      <Text ml="1.5%" size="lg" fontWeight="bold">
        {is_system ? "Lockness AI" : "You"}
      </Text>
    </Flex>
  );
};

export default ChatHeader;
