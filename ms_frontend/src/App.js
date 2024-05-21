import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProblemList from './Components/ProblemList';
import Results from './Components/Results';
import Analytics from './Components/Analytics';
import Home from './Components/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/results" element={<Results />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;