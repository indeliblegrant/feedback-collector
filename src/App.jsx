import { useState } from 'react';
import NavBar from './components/NavBar';
import SubmitPage from './components/SubmitPage';
import AdminPage from './components/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState('submit');

  return (
    <>
      <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="page">
        {currentPage === 'submit' ? <SubmitPage /> : <AdminPage />}
      </main>
    </>
  );
}

export default App;
