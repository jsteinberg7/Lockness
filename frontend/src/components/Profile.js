import { Text, Box, Flex } from '@chakra-ui/react';
import { SlOptionsVertical } from "react-icons/sl";


const Profile = ({ authAccountName, profilePicture, ...rest}) =>{



	return (


		<Box position="absolute" bottom={rest.bottom} width={rest.width}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" justifyContent="start" width="80%">
            <Box
              display="inline-block"
              width="40px"
              height="40px"
              borderRadius="50%"
              backgroundImage={profilePicture}
              backgroundSize="cover"
            />

            <Text color="primaryColor" ml="5%" fontSize="12px">
              {authAccountName}
            </Text>
          </Flex>
          <SlOptionsVertical />{" "}
        </Flex>
      </Box>

	);


}

export default Profile;