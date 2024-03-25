import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Space from './view/space'

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Space />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
