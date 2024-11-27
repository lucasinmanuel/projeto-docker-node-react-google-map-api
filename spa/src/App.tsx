import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RideEstimatePage from './pages/RideEstimate';
import RideConfirmPage from './pages/RideConfirm';
import RideHistoryPage from './pages/RideHistory';
import { RideContextProvider } from './contexts/RideContext';

function App() {
  return (
    <RideContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RideEstimatePage />} />
          <Route path="/ride/confirm" element={<RideConfirmPage />} />
          <Route path="/ride/history" element={<RideHistoryPage />} />
        </Routes>
      </Router>
    </RideContextProvider>
  );
}

export default App;