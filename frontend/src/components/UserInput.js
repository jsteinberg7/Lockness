import { ArrowUpIcon, AttachmentIcon, CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  InputGroup,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

const UserInput = ({
  handleUploadFileClick,
  fileInputRef,
  isFileUploaded,
  handleFileChange,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  ...rest
}) => {
  return (
    <Flex
      position={rest.position}
      bottom={rest.bottom}
      justifyContent="center"
      width={rest.width}
      left={rest.left}
    >
      <VStack spacing={5} width="100%">
        (
        <InputGroup size="md">
          <Button
            size="lg"
            color="primaryColor"
            onClick={handleUploadFileClick}
            mr="1rem" // Adjust the margin to align the button as in the design
            borderRadius="lg"
            height="50%"
          >
              {isFileUploaded ? (
                <CheckIcon color="black" />
              ) : (
                <AttachmentIcon color="black" />
              )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </Button>

          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            bg="darkBackgroundColor"
            placeholder={
              //messages.length === 0
              //?
              "Enter new research prompt here..."
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
                handleSendMessage();
                e.preventDefault();
              }
            }}
          />

          <Button
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
          </Button>
        </InputGroup>
        ){" "}
        <Text color="placeHolderColor" fontSize="sm">
          Lockness AI produces results based on the query and the data it has
          access to.
        </Text>
      </VStack>
    </Flex>
  );
};

export default UserInput;
