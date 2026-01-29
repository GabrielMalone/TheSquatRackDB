import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './components/login/Login.jsx';
import { AuthContext } from './components/login/authContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
//------------------------------------------------------------------------------
export default function Main(){

  const [ userData, setUserData ] = useState(null); // stores idUser and userName

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthContext.Provider value={{
            userData, 
            setUserData,
            }}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<App />} />
            </Routes>
          </AuthContext.Provider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );

}

createRoot(document.getElementById('root')).render(
    <Main />
);
