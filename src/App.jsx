import './App.css'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Header from './components/header/Header'
import UserContext from './kontekst'
import { useState, useEffect } from 'react'
import Radionice from './pages/radionice/Radionice'
import Predavaci from './pages/predavaci/Predavaci'
import Administracija from './pages/administracija/Administracija'
import PrikazRadionica from './components/akcije/procitaj/PrikazRadionica'
import Organizacije from './pages/administracija/Organizacije'
import Prijave from './pages/administracija/Prijave'
import SazetakRadionica from './pages/administracija/SazetakRadionica'
import SazetakPredavaci from './pages/administracija/SazetakPredavaci'

function App() {
  const [logiraniKorisnik, postaviLogiranogKorisnika] = useState('korisnik');
  const navigate = useNavigate();

  const handleDataFromLogIn = (korisnik) => {
    postaviLogiranogKorisnika(korisnik);
  }

  useEffect(() => {
    navigate('/', { replace: true });
  }, []);

  return (
    <>
      <UserContext.Provider value={logiraniKorisnik}>
        <Header sendDataToParent={handleDataFromLogIn} />
        <Routes>
          <Route path='/' element={<Radionice />} />
          <Route path='/predavaci'>
            <Route index element={<Predavaci />} />
            <Route path=':id' element={<PrikazRadionica />} />
          </Route>
          <Route path='/administracija/*'>
            <Route index element={<Navigate to={'radionice'} />} />
            <Route path='radionice' element={<SazetakRadionica />} />
            <Route path='predavaci' element={<SazetakPredavaci />} />
            <Route path='organizacije' element={<Organizacije />} />
            <Route path='prijave' element={<Prijave />} />
          </Route>
          <Route path='/administracija' element={<Administracija />} />
        </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
