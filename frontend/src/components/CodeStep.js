import { Text, Flex } from "@chakra-ui/react";
import MarkdownCasing from "./Markdown";

const CodeStep = ({ totalSteps, step, content, onContinue }) => {
  let headerContent = content.split("~~~~")[0];
  let code = content.replace(headerContent, "");

  if (code === "") {
    headerContent = content.split("```")[0];
    code = content.replace(headerContent, "");

    if (code === "") {
      headerContent = content.split("~~~")[0];
      code = content.replace(headerContent, "");
    }
  }

  return (
    <Flex flexDirection="column">
      <Text fontSize="md" mt="1%" ml="5%">
        {headerContent}
      </Text>
      <MarkdownCasing
        onContinue={onContinue}
        markdownContent={code}
        totalSteps={totalSteps}
        step={step}
        mt="2.5%"
        ml="4%"
        py="5"
        px="10"
        backgroundColor="darkBackgroundColor"
        borderRadius="xl"
        msgType="codeStep"
      />
    </Flex>
  );
};

export default CodeStep;
