
import axios from 'axios';
import { useEffect, useState } from "react";
import "./index.css"


function Product() {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [editProduct, setEditProduct] = useState(null)

  const [users, setUsers] = useState([])
  const [toggleRefresh, setToggleRefresh] = useState(true)

  useEffect(() => {

    let getAllUsers = async () => {
     //  let response = await axios.get('https://storage-bucket-production.up.railway.app/products');
     let response = await axios.get('http://localhost:5000/items');

      setUsers(response.data)
    }
    getAllUsers();

  }, [toggleRefresh])





  const producthandler = async (e) => {
    e.preventDefault();

    


    

    axios.post('http://localhost:5000/item',
    {
      
        title : title,
      description : description,
        price : price,
     
      
    },{withCredentials:true}
    )
      .then(res => {
        console.log(`upload Success` + res.data);
        setToggleRefresh(!toggleRefresh)
      })
      .catch(err => {
        console.log(err , "failed to upload product");

      })
  }

  

  let edithandler = (e) => {
    e.preventDefault();




    axios.put(`http://localhost:5000/item/${editProduct?._id}`,
    
   // axios.put(`https://storage-bucket-production.up.railway.app/product/${editProduct?._id}`,
      {
        title: editProduct.title,
        price: editProduct.price,
        description: editProduct.description,
        
      }
    )
      .then(function (response) {
        console.log("updated: ", response.data);

        setToggleRefresh(!toggleRefresh);
        setEditProduct(null);

      })


      .catch(function (e) {
        console.log("Error in api call: ", e);

      }


      )
  }


  return (
    <div className='products'>
      <div className="head">
        <form onSubmit={producthandler}>
          <h1>PRODUCT FORM</h1>
          title: <input name="title" type="text"value={title} placeholder="title" id='title' onChange={(e) => { setTitle(e.target.value) }} />
          <br />
          description: <input name="description" type="text" placeholder="description" id='description' onChange={(e) => { setDescription(e.target.value) }} />
          <br />
          price: <input name="price" type="Number" placeholder="price" id='price' onChange={(e) => { setPrice(e.target.value) }} />
          <br />

        


         

          <br />
          <button type='submit'>product add</button>

        </form>
        <hr />
        {(editProduct !== null) ?
          (<div>
            <form onSubmit={edithandler}>
            <h1>EDIT FORM</h1>
              title : <input type="text" onChange={(e) => {
                setEditProduct({ ...editProduct, title: e.target.value })
              }} value={editProduct?.title} /> <br />

              description : <input type="text" onChange={(e) => {
                setEditProduct({ ...editProduct, description: e.target.value })
              }} value={editProduct?.description} /> <br />

              price : <input type="number" onChange={(e) => {
                setEditProduct({ ...editProduct, price: e.target.value })
              }} value={editProduct?.price} /> <br />

              <button>edit product</button>
            </form>
          </div>) : null
        }
      </div>


      <h1>item List: </h1>

      <div className='productlist'>
        {users.map(eachProduct => (
          <div key={eachProduct.id}>
            <div className='product'>
              {/* <img className="productimg" width="120px" src={eachProduct.productimage} alt="" /> */}
              <h4>{eachProduct.title}</h4>
              <p className='description'>{eachProduct.description}</p>
              <p ><span className='price'>{eachProduct.price}</span><span>pkr</span></p>
              <button onClick={() => {
                axios({
                  url: `http://localhost:5000/item/${eachProduct._id}`,
                  // url: `https://storage-bucket-production.up.railway.app/product/${eachProduct._id}`,
                  method: "delete",

                })
                  .then(function (response) {
                    console.log(response.data)
                    setToggleRefresh(!toggleRefresh)
                  })
                  .catch(function (error) {
                    console.log('error', error)
                  })



              }

              }>delete</button> <br />
              <button onClick={() => {
                setEditProduct({
                  _id : eachProduct?._id,
                  title: eachProduct?.title,
                  description: eachProduct?.description,
                  price: eachProduct?.price,
                
                })
              }}>edit product</button>

             

              <hr />
            </div>
          </div>
        ))}
      </div>





        </div>
  );
}

export default Product;