import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RideEstimatePage from './pages/RideEstimate';
import RideConfirmPage from './pages/RideConfirm';
import { RideContextProvider } from './contexts/RideContext';

function App() {
  return (
    <RideContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RideEstimatePage />} />
          <Route path="/ride/confirm" element={<RideConfirmPage />} />
        </Routes>
      </Router>
    </RideContextProvider>
  );
}

export default App;