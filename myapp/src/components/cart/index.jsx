import { GlobalContext } from "../../context";
import { useContext, useState, useEffect } from "react";
import axios from "axios";


const Cart = () => {

  let [Cart, setCart] = useState([])
  let [Carts, setCarts] = useState([])
  const [toggleRefresh, setToggleRefresh] = useState(false)


  // let { state, dispatch } = useContext(GlobalContext);
  //  let cart = state.cart

  useEffect(() => {

    let getAllcarts = async () => {
      //let response = await axios.get('https://storage-bucket-production.up.railway.app/products');
      let response = await axios.get('http://localhost:5000/carts', { withCredentials: true });

      setCarts(response.data.data)

      console.log(response.data.data, "cart")
    }
    getAllcarts();

  }, [toggleRefresh])

 



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

<div>
              
              {Carts.map(eachProduct => (
                  <div key={eachProduct._id}>
                      <div className='product'>
                           <h1>{eachProduct.items[0].name}</h1>
                           <p> <b>QUANTITY</b> {eachProduct.items[0].quantity}</p>
                           <p> <b>PRICE</b> {eachProduct.items[0].price} /-</p>
                           <p ><span className='price'> TOTAL {eachProduct.bill}</span><span>pkr</span></p>
                           
                          <hr />
                      </div>
                  </div>
              ))}

          </div>




    </div>

  )
}

export default Cart;