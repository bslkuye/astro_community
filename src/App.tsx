import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Space from './view/space'
import { RecoilRoot } from 'recoil'

function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Space />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  )
}

export default App
