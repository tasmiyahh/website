import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import { GlobalContext } from "../../context"
import { useContext } from "react"


const Shop = () => {
    const [toggleRefresh, setToggleRefresh] = useState(false)
    const [product, setProducts] = useState([])
    const [cart, setCart] = useState(null)
    const [quantity , setQuantity] = useState(0)
    let { state, dispatch } = useContext(GlobalContext);
    console.log("here is quantity",quantity)

    useEffect(() => {

        let getAllProducts = async () => {
            //let response = await axios.get('https://storage-bucket-production.up.railway.app/products');
            let response = await axios.get('http://localhost:5000/items');

            setProducts(response.data)
        }
        getAllProducts();

    }, [toggleRefresh])




    // let carthandler = () => {


    //     axios.post(`http://localhost:5000/cart/${cart._id}`,

    //         {
    //             title: cart.title,
    //             productId: cart._id,
    //             price: cart.price,
    //             productimage : cart.productimage,
    //             quantity: Number(quantity),
    //             bill: quantity * cart.price
              


    //         }, { withCredentials: true }
    //     )
    //         .then(function (response) {
    //             console.log(" cart post: ", response.data);
    //            console.log(cart.productimage , "here islink")


    //             setToggleRefresh(!toggleRefresh)


    //         })


    //         .catch(function (e) {
    //             console.log("Error in api call: ", e);

    //         }


    //         )



    // }


    const carthandler = async (e) => {
        e.preventDefault();
    
      
    
    
        let formData = new FormData();
        // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax
    
    
        formData.append("title", cart.title); // this is how you add some text data along with file
        formData.append("price", cart.price); // this is how you add some text data along with file
        formData.append("price", cart.price); // this is how you add some text data along with file
        formData.append("productimage", cart.productimage); // file input is for browser only, use fs to read file in nodejs client
    
    
        axios({
          method: 'post',
          //url: "https://storage-bucket-production.up.railway.app/product",
          url: "http://localhost:5000/cart",
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        })
          .then(res => {
            console.log( "here is cart"+ res.data);
            setToggleRefresh(!toggleRefresh)
          })
          .catch(err => {
            console.log(err);
          })
      }
    

    let displayHandler = () => {
        axios.get(`http://localhost:5000/cart/${cart._id}`, { withCredentials: true })
            .then(function (response) {
                // handle success

                console.log("get cart", response.data)
                dispatch({
                    type: "cartGet",
                    payload: response.data.items

                })
                dispatch({
                    type: "total",
                    payload: response.data.data.bill
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
                             <img className="productimg" width="120px" src={eachProduct.productimage} alt="" /> 
                            <h4>{eachProduct.title}</h4>
                            <p className='description'>{eachProduct.description}</p>
                            <p ><span className='price'>{eachProduct.price}</span><span>pkr</span></p>
                            <button
                                onClick={() => {
                                    setCart({
                                        _id: eachProduct?._id,
                                        title: eachProduct?.title,
                                        description: eachProduct?.description,
                                        price: eachProduct?.price,
                                        productimage : eachProduct?.productimage




                                    })
                                        ; carthandler();
                                    displayHandler();


                                }}>add to cart</button> <br />
                            <label for="quantity">quantity</label>

                           <input type="number"  onChange={(e) => { setQuantity(e.target.value) }}/>
                        </div>
                    </div>
                ))}

            </div>
















        </div>
    )

}





export default Shop;