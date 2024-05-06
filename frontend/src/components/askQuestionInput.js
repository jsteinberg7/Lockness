import { ArrowUpIcon, AttachmentIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  InputGroup,
  Text,
  Textarea,
  VStack,
  Center,
  Box,
} from "@chakra-ui/react";

import { useState } from "react";
import ChatHeader from "./ChatHeader";

const AskQuestionInput = ({
  setIsAskingQuestion,
  inputMessage,
  handleSendMessage,
  setInputMessage ,
  ...rest
}) => {

	console.log("ASK QUESTIO setInputMessage type:", typeof setInputMessage);

//   const [inputMessage, setInputMessage] = useState("");

  return (
    <VStack spacing={5} width="100%" mt={rest.mt}>
      (
      <InputGroup size="md">
        <Button
          size="lg"
          color="primaryColor"
          onClick={() => {
            setIsAskingQuestion(false);
          }}
          mr="1rem" // Adjust the margin to align the button as in the design
          borderRadius="lg"
          height="50%"
        >
          <Text py="2" fontSize="12.5px" color="darkBackgroundColor">
            Cancel
          </Text>
        </Button>

        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          bg="darkBackgroundColor"
          placeholder={
            //messages.length === 0
            //?
            "Enter your question here..."
            //: "Message Lockness..."
          }
          style={{
            background: "darkBackgroundColor",
            color: "primaryColor",
            borderRadius: "8px",
            width: "100%",
            height: "15vh",
            resize: "none", // Allows vertical resizing
            overflowY: "auto", // Adds scroll if content overflows
            borderColor: "primaryColor",
            placeholderColor: "placeHolderColor",
            padding: "2%",
            fontSize: "sm",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
				console.log(inputMessage);
              handleSendMessage("", "explanation");
              e.preventDefault();
            }
          }}
        />

        <Button
          size="lg"
          color="primaryColor"
          onClick={(e) => {
            handleSendMessage("", "explanation");
            e.preventDefault();
          }}
          ml="1rem" // Adjust the margin to align the button as in the design
          borderRadius="lg"
          isDisabled={inputMessage === ""}
        >
          <ArrowUpIcon color="black" />
        </Button>

        {/* <Button
          size="lg"
          color="primaryColor"
          onClick={(e) => {
            handleSendMessage();
            e.preventDefault();
          }}
          ml="1rem" // Adjust the margin to align the button as in the design
          borderRadius="lg"
          height="50%"
          isDisabled={inputMessage === ""}
        >
          <ArrowUpIcon color="black" />
        </Button> */}
      </InputGroup>
      ){" "}
    </VStack>
  );
};

export default AskQuestionInput;
