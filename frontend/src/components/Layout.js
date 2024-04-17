import { Box } from "@chakra-ui/react";
import SideNavigationBar from "./SideNavigationBar";

const Layout = ({ children }) => {
  return (
    <Box>
      <Box ml="15%" >
        <SideNavigationBar/>
      </Box>
	  <Box ml="15%" w="85%">  
        {children}
      </Box>

    </Box>
  );
};

export default Layout;
