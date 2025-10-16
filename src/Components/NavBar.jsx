import '../App.css'
import logo from '../assets/logo.png'
import instagramIcon from '../assets/instagram.png'


const NavBar = () => {
  const instagramUrl = "https://www.instagram.com/drinkamorchai/";
    return (
      <div className="navbar">
        <img className="website-logo" src={logo} alt="logo" />
        
        <div className="nav-links">

          <div className="nav-links-left">
            <h1 className="nav-button">MENU</h1>
            <h1 className="nav-button">OFFERS</h1>
            <h1 className="nav-button">RECIPES</h1>
            <h1 className="nav-button">WHO ARE WE?</h1>
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