
import './App.css'
import NavBar from './Components/NavBar'
import Footer from './Components/Footer'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Components/HomePage'
import MenuPage from './Components/MenuPage'
import Offers from './Components/OffersPage'
import Recipe from './Components/RecipePage'
import Products from './Components/ProductsPage'
import WhoAreWe from './Components/WhoAreWePage'

const App = () => {
 

  return (
    <div>
      <NavBar/>
      <div className='main-content'>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/Menu" element={<MenuPage/>}/>
          <Route path="/Offers" element={<Offers/>}/>
          <Route path="/Recipes" element={<Recipe/>}/>
          <Route path="/Products" element={<Products/>}/>
          <Route path="/WhoAreWe" element={<WhoAreWe/>}/>
        </Routes>
      </div>
      
      <Footer/>
    </div>
  )
}

export default App
