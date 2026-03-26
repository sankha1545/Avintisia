import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import KnowledgeBasePage from './pages/KnowledgeBasePage';

const App = () => {
  const [activeItem, setActiveItem] = useState('knowledge-base');

  return (
    <div className="min-h-screen bg-content-bg">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />

      {/* Main Content Area */}
      <main className="ml-[200px] mt-14 h-[calc(100vh-56px)] flex flex-col bg-content-bg">
        <KnowledgeBasePage />
      </main>
    </div>
  );
};

export default App;
