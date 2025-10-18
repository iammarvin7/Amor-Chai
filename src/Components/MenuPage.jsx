import '../App.css'
import Menu1 from '/assets/Menu1.png'
import Menu2 from '/assets/Menu2.png'

const MenuPage = () => {
    return(
        <div className='menu'>
            <img className="menu-img" src={Menu1} alt='Menu1'/>
            <img className="menu-img" src={Menu2} alt='Menu2'/>
        </div>
    )
}

export default MenuPage