import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BrowsePosts from './pages/BrowsePosts';
import CreatePost from './pages/CreatePost';
import PostDetailsPage from './pages/PostDetailsPage';
import EditPost from './pages/EditPost';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#000',
              fontSize: '15px',
              fontWeight: '700',
              fontFamily: 'Satoshi, sans-serif',
              borderRadius: '0px',
              padding: '16px 24px',
              border: '2px solid #000',
              boxShadow: '4px 4px 0px 0px #000',
            },
            success: {
              iconTheme: { primary: '#28C840', secondary: '#000' },
            },
            error: {
              iconTheme: { primary: '#FF5F57', secondary: '#fff' },
            }
          }}
        />
        
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes Wrapper */}
          <Route element={
            <div className="flex flex-col min-h-screen bg-slate-50 relative selection:bg-indigo-100 selection:text-indigo-900">
              <Navbar />
              <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <ProtectedRoute />
              </main>
              <Footer />
            </div>
          }>
            <Route path="/home" element={<Home />} />
            <Route path="/browse" element={<BrowsePosts />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetailsPage />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
