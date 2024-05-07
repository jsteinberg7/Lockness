// NotFound.js
import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import logo from "../assets/locknessLogo.png";


const NewChatDesign = ({ ...rest }) => {
	return (
		<Flex
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
			{...rest}
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
