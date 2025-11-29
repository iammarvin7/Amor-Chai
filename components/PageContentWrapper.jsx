'use client';
import { useCart } from './CartContext';

const PageContentWrapper = ({ children }) => {
    const { isOpen } = useCart();

    return (
        <div 
            className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'mr-0 md:mr-[28rem]' : 'mr-0'
            }`}
        >
            {children}
        </div>
    );
};

export default PageContentWrapper;
