// App.js
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import ChatInterface from "./components/ChatInterface";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import OldChat from "./components/OldChat";
import theme from "./design/theme"; // Make sure the path is correct

function App() {
  return (
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate replace to="/chat/" />} />
              <Route path="/chat/*" element={<ChatInterface />} />
              <Route path="/queries" element={<OldChat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </ChakraProvider>
    </React.StrictMode>
  );
}

export default App;
