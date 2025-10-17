import '../App.css'
import Card from './Card'
import products from '../products.json'


const ProductsPage = () => {
    return(
        <div className="products-wrapper">
            <h1 className="products-page-title">Featured Products</h1>
            <div className="products-grid">
                {products.map(product => (
                    <Card key={product.id} product={product}/>
                ))}
            </div>
            
        </div>
    )
}

export default ProductsPage
