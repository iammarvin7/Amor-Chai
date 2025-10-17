import '../App.css'
import img1 from '../assets/sigChaiMasala.png'
import img2 from '../assets/LavChaiMasala.png'
import img3 from '../assets/MintChaiMasala.png'
import img4 from '../assets/RoseChaiMasala.png'

const RecipePage = () => {
    return(
        <div className="recipe-wrapper">
            <h1 className="recipe-page-title">Crafting the Chai Experience: Recipes Featuring Our Loose Tea Blends</h1>
            <div className='recipe-page'>
                <img className='recipe-img' src={img1} alt="recipe_1"/>
                <img className='recipe-img' src={img2} alt="recipe_2"/>
                <img className='recipe-img' src={img3} alt="recipe_3"/>
                <img className='recipe-img' src={img4} alt="recipe_4"/>
            </div>
        </div>
    )
}

export default RecipePage