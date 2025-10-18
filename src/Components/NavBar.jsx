import '../App.css'
import { Link } from 'react-router-dom'
import logo from '/assets/logo.png';
import instagramIcon from '/assets/instagram.png';


const NavBar = () => {
  const instagramUrl = "https://www.instagram.com/drinkamorchai/";
  
    return (
      <div className="navbar">
        <Link to="/">
          <img className="website-logo" src={logo} alt="logo" />
        </Link>
        
        <div className="nav-links">

          <div className="nav-links-left">
            <Link to="/" className="nav-button">HOME</Link>
            <Link to="/Menu" className="nav-button">MENU</Link>
            <Link to="/Offers" className="nav-button">OFFERS</Link>
            <Link to="/Recipes" className="nav-button">RECIPES</Link>
            <Link to="/Products" className="nav-button">PRODUCTS</Link>
            <Link to="/WhoAreWe" className="nav-button">WHO ARE WE?</Link>
          </div>

          <div className="nav-links-right">
            <a 
                className='ig-icon' 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
            >
              <img src={instagramIcon} alt="Instagram" className="instagram-icon" />
            </a>
            
          </div>

        </div>
      </div>
    );
}

export default NavBar