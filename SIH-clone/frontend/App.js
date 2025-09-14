import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to SIH MERN App</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '30px' }}>
        <button style={{ fontSize: '1.5rem' }} onClick={() => navigate('/maps')}>Go to Maps</button>
        <button style={{ fontSize: '1.5rem' }} onClick={() => navigate('/tourism')}>Go to Tourism</button>
        <button style={{ fontSize: '1.5rem' }} onClick={() => navigate('/chatbot')}>Go to Chatbot</button>
      </div>
    </div>
  );
}

function Maps() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Maps Page</h2>
      <div style={{ fontSize: '2rem', marginTop: '20px' }}>A B C</div>
    </div>
  );
}
function Tourism() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Tourism Page</h2>
      <div style={{ fontSize: '2rem', marginTop: '20px' }}>A B C</div>
    </div>
  );
}
function Chatbot() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Chatbot Page</h2>
      <div style={{ fontSize: '2rem', marginTop: '20px' }}>A B C</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/tourism" element={<Tourism />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
