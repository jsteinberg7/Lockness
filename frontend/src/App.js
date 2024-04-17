import logo from './logo.svg';
import './App.css';
import ChatInterface from './ChatInterface';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <ChatInterface />
    </ChakraProvider >
  );
}

export default App;
