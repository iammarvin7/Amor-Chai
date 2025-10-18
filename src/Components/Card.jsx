import '../App.css'
import { useState, useEffect } from 'react'

const Card = ({product}) => {
    const ImageURL = product.image;

    return(
        <div className="product-card">
            <img className="product-image" src={ImageURL} alt={product.name} />
            
            <div className="card-details">
                <h3 className="product-name">{product.name}</h3>
                {product.size && (
                   <h4 className="product-size">{product.size}</h4>
                )}
                <h4 className="product-price">Starting at ${product.price}</h4>
                <p className="product-description">Ingredients: {product.description}</p>
                {product.flavors && (
                   <p className="product-flavors">Flavors: {product.flavors.join(', ')}</p>
                )}
            </div>
        </div>
    )
}

export default Card