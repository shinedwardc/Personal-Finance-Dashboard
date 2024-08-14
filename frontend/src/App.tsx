import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import axios from 'axios';
import './App.css'
import Sidebar from './components/sidebar';
import Breakdown from './components/breakdown';
import List from './components/list';




function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div>
          <Routes>
            <Route path="/" element={<Breakdown/>}/>
            <Route path="/expenses" element={<List/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
