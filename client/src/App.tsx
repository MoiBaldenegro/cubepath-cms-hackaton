import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './features/auth/presentation/pages/Login/Login';
import { Register } from './features/auth/presentation/pages/Register/Register';
import { Dashboard } from './features/dashboard/presentation/pages/Dashboard/Dashboard';
import { LandingPage } from './features/landing/presentation/pages/LandingPage';
import { FeaturesPage } from './features/landing/presentation/pages/features/FeaturesPage';
import { AuthProvider } from './shared/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
