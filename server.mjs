import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { stringToHash, varifyHash } from "bcrypt-inzi"
import jwt from 'jsonwebtoken';
import stripe from 'stripe'
import cors from 'cors';
import cookieParser from 'cookie-parser';
//import bcrypt from 'bcrypt'
import pkg from 'validator'


const {isEmail} = pkg





const port = process.env.PORT || 5000;
const SECRET = "topsecret"
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000' ,"*"],
    credentials: true
}));

app.use(cookieParser());



/////user schema////



const UserSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true,'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
      
       
    },
    password: {
        type: String,
        required: [true, 'Please enter a valid password'],
        minlength: [6, 'Minimum password length must be 6 characters']
    },
    register_date: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user',UserSchema);

/////item schema////

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    //  category:{
    //      type: String,
    //     required: true
    // }
    
    price: {
        type: Number,
        required: true
    },
    date_added: {
        type: Date,
        default: Date.now
    },
});

const Item = mongoose.model('item',ItemSchema);


/////cart schema////
const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    items: [{
        productId: {
            type: String,
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity can not be less then 1.'],
            default: 1
        },
        price: Number
    }],
    bill: {
        type: Number,
        required: true,
        default: 0
    }
});

const Cart = mongoose.model('cart',CartSchema);


/////orderschema////

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    items: [{
        productId: {
            type: String,
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity can not be less then 1.']
        },
        price: Number
    }],
    bill: {
        type: Number,
        required: true
    },
    date_added: {
        type: Date,
        default: Date.now
    }
})

const Order = mongoose.model('order',OrderSchema);



// app.post('/signup', (req,res) => {
//     const { name, email, password } = req.body;


//     if(!name || !email || !password){
//         res.status(400).send({msg: 'Please enter all fields'});
//     }

//     User.findOne({email})
//     .then(user => {
//         if(user) return res.status(400).send({msg: 'User already exists'});

//         const newUser = new User({ name, email, password });

//         // Create salt and hash
//         bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(password, salt, (err, hash) => {
//                 if(err) throw err;
//                 newUser.password = hash;
//                 newUser.save()
//                     .then(user => {
//                         jwt.sign(
//                             { id: user._id },
//                             { expiresIn: 3600 },
//                             SECRET,
//                             (err, token) => {
//                                 if(err) throw err;
//                                 res.send({
//                                     token,
//                                     user: {
//                                         id: user._id,
//                                         name: user.name,
//                                         email: user.email
//                                     }
//                                 });
//                             }
//                         )
//                     });
//             })
//         })
//     })
// }
// )


app.post("/signup", (req, res) => {

    let body = req.body;

    if (!body.name
        || !body.lastName
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // check if user already exist // query email user
    User.findOne({ email: body.email }, (err, data) => {
        if (!err) {
            console.log("data: ", data);

            if (data) { // user already exist
                console.log("user already exist: ", data);
                res.status(400).send({ message: "user already exist,, please try a different email" });
                return;

            } else { // user not already exist

                stringToHash(body.password).then(hashString => {

                    User.create({
                        name: body.name,
                        lastName : body.lastName,
                         email: body.email,
                         
                        password: hashString
                    },
                        (err, result) => {
                            if (!err) {
                                console.log("data saved: ", result);
                                res.status(201).send({ message: "user is created" });
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "internal server error" });
                            }
                        });
                })

            }
        } else {
            console.log("db error: ", err);
            res.status(500).send({ message: "db error in query" });
            return;
        }
    })
});


app.post("/login", (req, res) => {

    let body = req.body;

    if (!body.email || !body.password) { // null check - undefined, "", 0 , false, null , NaN
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // check if user already exist // query email user
    User.findOne(
        { email: body.email },
        // { email:1, firstName:1, lastName:1, age:1, password:0 },
        "email name lastName age password",
        (err, data) => {
            if (!err) {
                console.log("data: ", data);

                if (data) { // user found
                    varifyHash(body.password, data.password).then(isMatched => {

                        console.log("isMatched: ", isMatched);

                        if (isMatched) {

                            var token = jwt.sign({
                                _id: data._id,
                                email: data.email,
                                iat: Math.floor(Date.now() / 1000) - 30,
                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                            }, SECRET);

                            console.log("token: ", token);

                            res.cookie('Token', token, { //token is value of token here stored in token var see above
                                maxAge: 86_400_000,  //24 hours
                                httpOnly: true
                            });

                            res.send({
                                message: "login successful",
                                profile: {

                                    name: data.name,
                                    lastName : data.lastName,
                                    email: data.email,
                                    _id: data._id
                                }
                            });
                            return;
                        } else {
                            console.log("user not found");
                            res.status(401).send({ message: "Incorrect email or password" });
                            return;
                        }
                    })

                } else { // user not already exist
                    console.log("user not found");
                    res.status(401).send({ message: "Incorrect email or password" });
                    return;
                }
            } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "login failed, please try later" });
                return;
            }
        })



})

app.post("/logout", (req, res) => {

    res.cookie('Token', '', {
        maxAge: 0,
        httpOnly: true
    });

    res.send({ message: "Logout successful" });
})


app.get("/profile/:id", async (req, res) => { //this part is used jb pg refresh bhi kren or data show ho

    try {
        let user = await User.findOne({ _id: req.body.token._id }).exec();
        res.send(user);  //user means single user ye reducer wala nh h

    } catch (error) {
        res.status(500).send({ message: "error getting users" });
    }
})

app.post("/item" ,(req,res) => {
    const newItem = new Item(req.body);
    console.log("item add")
    newItem.save().then(item => res.send(item))
    
})


// app.post('/item', async(req, res) => {
//     console.log("product received", req.body)
//     let newProduct = new Item({
//         title: req.body.title,
//         description: req.body.description,
//         price: req.body.price
      
//          })
//       try {
//         let response = await newProduct.save()
//         console.log("product added", response)
       
//         res.send({
//           message: "product added",
//           data: {
//             title: req.body.title,
//             description: req.body.description,
//             price : req.body.price,
          
//              }
//         })
    
//       }
    
//       catch (error) {
//         console.log("failed to add product" , error)
//         res.status(500).send({
//           message: "failed to add product"
//         })
//       }
// })


   


  

   
   


app.put('/item/:id' , (req,res) => {
    Item.findByIdAndUpdate({_id: req.params.id},req.body).then(function(item){
        Item.findOne({_id: req.params.id}).then(function(item){
            res.send(item);
            console.log("item update")
        });
    });
})


app.delete("/item/:id" , (req,res) => {
    Item.findByIdAndDelete({_id: req.params.id}).then(function(item){
        res.json({success: true});
        console.log("item deleted")
    });
})

app.get("/items" ,(req,res) => {
    Item.find().sort({date:-1}).then(items => res.json(items));
    console.log("all items")

})


////cookie checkpoint///


app.use(function (req, res, next) {
    console.log("req.cookies: ", req.cookies);

    if (!req.cookies.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }
    jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {
                res.status(401).send("token expired")
            } else {

                console.log("token approved");

                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})



app.get("/cart/:id", async (req,res) => { 
    const userId = req.params.id;
    try{
        let cart = await Cart.findOne({userId});
        if(cart && cart.items.length>0){
            res.send({
                items : cart.items,
                data : cart
            });
            console.log("get cart")
        }
        else{
            res.send(null);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})

app.post('/cart/:id' , async (req,res) => { // this id of url is productid
    const userId = req.params.id;
    const { productId, quantity } = req.body;

    try{
        let cart = await Cart.findOne({userId});
        let item = await Item.findOne({_id: productId});
        if(!item){
            res.status(404).send('Item not found!')
        }
        const price = item.price;
        const name = item.title;

        if(cart){
            // if cart exists for the user
            let itemIndex = cart.items.findIndex(p => p.productId == productId);

            // Check if product exists or not
            if(itemIndex > -1)
            {
                let productItem = cart.items[itemIndex];
                productItem.quantity += quantity;
                cart.items[itemIndex] = productItem;
            }
            else {
                cart.items.push({ productId, name, quantity, price });
            }
            cart.bill += quantity*price;
            cart = await cart.save();
            return res.status(201).send(cart);
        }
        else{
            // no cart exists, create one
            const newCart = await Cart.create({
                userId,
                items: [{ productId, name, quantity, price }],
                bill: quantity*price
            });
            console.log("product added in cart")
            return res.status(201).send(newCart);
        }       
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})

app.delete("/cart/:userId/:itemId", async (req,res) => {
    const userId = req.params.userId;
    const productId = req.params.itemId;
    try{
        let cart = await Cart.findOne({userId});
        let itemIndex = cart.items.findIndex(p => p.productId == productId);
        if(itemIndex > -1)
        {
            let productItem = cart.items[itemIndex];
            cart.bill -= productItem.quantity*productItem.price;
            cart.items.splice(itemIndex,1);
        }
        cart = await cart.save();
        console.log("product deleted from cart")
        return res.status(201).send(cart);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})

app.get('/orders/:userId' , async (req,res) => {   //user id in url
    const userId = req.params.id;
    
    Order.find({userId}).sort({date:-1}).then(orders => res.json(orders));
    console.log("order received")
})



app.post("/order/:id" ,async (req,res) => {
    try{
        const userId = req.params.id;
        const {source} = req.body;
        console.log(source , "here is source")
        let cart = await Cart.findOne({userId});
        console.log(cart )
        let user = await User.findOne({_id: userId});
        const email = user.email;
        console.log(email , "here is email")
        if(cart){
            const charge = await stripe.charges.create({
                amount: cart.bill,
                currency: 'inr',
                source: source,
                receipt_email: email
            })
            if(!charge) throw Error('Payment failed');
            if(charge){
                const order = await Order.create({
                    userId,
                    items: cart.items,
                    bill: cart.bill
                });
                const data = await Cart.findByIdAndDelete({_id:cart.id});
                return res.status(201).send(order);
            }
        }
        else{
            res.status(500).send("You do not have items in cart");
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


///========mooboDB=======////

let dbURI = process.env.dbURI || 'mongodb+srv://tasmiyah:web@cluster0.cj82tmo.mongodb.net/website?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});




