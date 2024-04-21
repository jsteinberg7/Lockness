// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primaryColor: "#E8F2FC",
    lightBackgroundColor: "#223042",
    darkBackgroundColor: "#172538",
    placeHolderColor: "#B4B4B4",
  },
  styles: {
    global: {
      body: {
        backgroundColor: "#202C3B",
      },
    },
  },

  components: {
    Button: {
      baseStyle: {
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: "translateY(0)",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
      variants: {
        solid: {
          // Assuming you want these effects on the 'solid' variant; adjust accordingly
          _hover: {
            transform: "scale(1.05)",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          },
          _focus: {
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          },
          _active: {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
  },
});

export default theme;
