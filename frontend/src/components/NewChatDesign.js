// NotFound.js
import React from "react";
import { Box,Flex, Text } from "@chakra-ui/react";
import logo from "../assets/locknessLogo.png";


const NewChatDesign = () => {
  return (
	<Flex
	alignItems="center"
	justifyContent="center"
	flexDirection="column"
	mt="15%"
  >
	<Box
	  display="inline-block"
	  width="65px"
	  height="65px"
	  borderRadius="50%"
	  backgroundImage={logo}
	  backgroundSize="cover"
	/>

	<Text fontSize="xl" fontWeight="bold" mt="2%">
	  How can I help you with your research today?
	</Text>
  </Flex>
);
};

export default NewChatDesign;
