// src/theme.js or wherever you manage your Chakra theme
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      // Apply styles globally across all elements
      body: {
        backgroundColor: "#3E4B5C", // Replace with your desired color
      }
    }
  }
});

export default theme;
