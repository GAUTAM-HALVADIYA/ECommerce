import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_free = 10;
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    
    const addToCart = (itemId, size) => {
        
        let cartData = structuredClone(cartItems)

        if(!size)
        {
            toast.error('Please select product size')
            return
        }

        if(cartData[itemId])
        {
            if(cartData[itemId][size])
                cartData[itemId][size] += 1
            else
                cartData[itemId][size] = 1

        }
        else
        {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setCartItems(cartData)
        
    }

    let getCartCount = () => {
        let totalCount = 0

        for (const productId in cartItems) {
            const sizes = cartItems[productId]

            for (const size in sizes) {
                totalCount += sizes[size]
            }
        }

        return totalCount

    }

    const value = {
        products, currency, delivery_free, search, setSearch, showSearch, setShowSearch,cartItems, addToCart, getCartCount
    }

    useEffect(() => {
        console.log(cartItems)
    }, [cartItems])

    
    

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;