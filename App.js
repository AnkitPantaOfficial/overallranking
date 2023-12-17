import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Overall from './overall/overall.js';
import Overall2 from './overall/overall2.js';
import Overall3 from './overall/overall3.js';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/overall"><h1>Overall</h1></Link>
            </li>
            <li>
              <Link to="/overall2"><h1 >Overall2</h1></Link>
            </li>
            <li>
              <Link to="/overall3"><h1 >Overall3</h1></Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/overall" element={<Overall />} />
          <Route path="/overall2" element={<Overall2 />} />
          <Route path="/overall3" element={<Overall3 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
