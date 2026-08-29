import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <Router>
          <AppRoutes />
          <ToastContainer position="bottom-right" theme="dark" />
        </Router>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;

