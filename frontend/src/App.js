// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import logo from "./logo.svg"; // Assuming you might use it somewhere else
import "./App.css";
import ChatInterface from "./components/ChatInterface";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "./components/Layout";
import theme from "./design/theme"; // Make sure the path is correct
import NotFound from "./components/NotFound";
import OldChat from "./components/OldChat";

function App() {
  return (
    <React.StrictMode>

    <ChakraProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate replace to="/new-chat" />} />
            <Route path="/new-chat" element={<ChatInterface />} />
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
