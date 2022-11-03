import { GlobalContext } from "../../context";
import { useContext, useState } from "react";

const Cart = () => {


  let { state, dispatch } = useContext(GlobalContext);
   let cart = state.cart
  return (
    <div>

      {/* <div>
                    
                    
                  <h2> {state.cart?.name}</h2>  
                   
                  <p>
                   <b>quantity</b>
                    {state.cart?.quantity}
                  </p>
                  <p>
                   <b>price</b> {state.cart?.price}
                  </p>
                <p> <b>total amount</b>
                     {state.bill}</p>
                
                </div>  */}

    

        {cart.map(eachProduct => (
          <div>
            <div className='product'>
              {/* <img className="productimg" width="120px" src={eachProduct.productimage} alt="" /> */}
              <h4>{eachProduct.title}</h4>
              {/* <p className='description'>{eachProduct.description}</p>
                          <p ><span className='price'>{eachProduct.price}</span><span>pkr</span></p>
                          */}

              <hr />
            </div>
          </div> ))}
       

     


    </div>

  )
}

export default Cart;