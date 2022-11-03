import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import { GlobalContext } from "../../context"
import { useContext } from "react"


const Shop = () => {
    const [toggleRefresh, setToggleRefresh] = useState(false)
    const [product, setProducts] = useState([])
    const [cart, setCart] = useState(null)
    let { state, dispatch } = useContext(GlobalContext);


    useEffect(() => {

        let getAllProducts = async () => {
            //let response = await axios.get('https://storage-bucket-production.up.railway.app/products');
            let response = await axios.get('http://localhost:5000/items');

            setProducts(response.data)
        }
        getAllProducts();

    }, [toggleRefresh])




    let carthandler = () => {


        axios.post(`http://localhost:5000/cart/${cart._id}`,

            {
                title : cart.title,
                productId: cart._id,
                price : cart.price,
                quantity: 2,
                bill: 2 * cart.price
                

            }, { withCredentials: true }
        )
            .then(function (response) {
                console.log(" cart post: ", response.data);


                setToggleRefresh(!toggleRefresh)


            })


            .catch(function (e) {
                console.log("Error in api call: ", e);

            }


            )



    }

    let displayHandler = () => {
        axios.get(`http://localhost:5000/cart/${cart._id}`, { withCredentials: true })
            .then(function (response) {
                // handle success

                console.log("get cart", response.data.data.bill)
                dispatch({
                   type : "cartGet",
                payload : response.data.items[0]

                })
                dispatch({
                    type : "total",
                    payload : response.data.data.bill
                })

                
                setToggleRefresh(!toggleRefresh)

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }



    return (
        <div>
            <hr />
          
            <div>
              
                {product.map(eachProduct => (
                    <div key={eachProduct._id}>
                        <div className='product'>
                            {/* <img className="productimg" width="120px" src={eachProduct.productimage} alt="" /> */}
                            <h4>{eachProduct.title}</h4>
                            <p className='description'>{eachProduct.description}</p>
                            <p ><span className='price'>{eachProduct.price}</span><span>pkr</span></p>
                            <button
                                onClick={() => {
                                    setCart({
                                        _id: eachProduct?._id,
                                        title: eachProduct?.title,
                                        description: eachProduct?.description,
                                        price: eachProduct?.price




                                    })
                                        ; carthandler();
                                    displayHandler();


                                }}>add to cart</button>
                               

                            <hr />
                        </div>
                    </div>
                ))}

            </div>

       














        </div>
    )

}





export default Shop;