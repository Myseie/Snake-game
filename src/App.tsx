import React from 'react'
import SnakeGame from './components/SnakeGame'


const App: React.FC = () => {
  return (
    
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <SnakeGame />
    </div>
  );
};

export default App;

