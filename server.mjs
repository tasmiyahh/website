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
import fs from 'fs'
import admin from "firebase-admin";


import multer from 'multer';
const storageConfig = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {

        console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
var upload = multer({ storage: storageConfig })

var serviceAccount = { //ye hum apna laye h storagebucket k siide pe project seting me service account generate krk

    "type": "service_account",
    "project_id": "website-45ab7",
    "private_key_id": "3e377522299d45dbe4fd9afe421902a523c64a2c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDD/fCPQYyw3Mt5\nlOKYbYdj3zVqqWzZ/Ob/VUabKQB1ikAp7hgeNCpKMP2HeKxBLjWKA8d+emkyhHtf\n8gBQ2JdEr7rLIjKx12DeUe1xmZlnXAQsCJuQIzjQMaCitUHup148CRIHE7AvDVTC\nqGGPuggNkB2aOv4mMpNaoaY3cqwyDcaS006dBzAX6/UvazHuNxIzsTxeKyFo8TTI\nXlTc1K1PiI6lCk0sxyPXZ+raFiCacqZ4UF5esP6qsGbrZyVIY7rgacKkYsfhOSgL\ncBcO5XTTTPw7UHjml1KGhzr0R8Zwzj3nGVJZNdRXWgD7TNiFJMkhlEVlJJrSJins\nGHjKJL/NAgMBAAECggEABVvsN/6S2kMvTSPFDmXwTcrMqx322/8OUe0DATsdyBj/\nqCXagvjqLx0n0Yx7KU0aKavwyISQW9FDjlwPpiZF/JrRgLxupm49N9cFpxWMHEdn\n1cxmdIqCAy9YNRq/ssbgzMNyur7PEnpK1wfDoypzDevi41S5nlHDtba11M5N5xBt\nGQPwIXhDye8wi86qGGcZEFyHKQKOK2EVxkRZzHzCnBOFEJ3XNMXWInCc41ze38wy\n4l+n7ip3xYQKTXDxwqQ1oc0K4z2cGqAOdl0cngnuQBx+suf1UO4XYXdVCvjzOgtT\nT6so1KUAk2ogGmmX4cBbOuJO8u6vvM4RE1axtaugAQKBgQDsg1uqdRbYNK07lj8w\nKFVWsFH0ZF+WBn3YQNTfBUpieRymMgthiFN5fIQtp8LP/AeuS+Cv7SbWoUIDoaHC\nWJdHKS/EFk1shrEXAck/ddXZElXmXehYuLPTcrgtg+mo58gkX+Jy5LUGIaXmfU9D\n7wze+3ouS5ByXoi4tZOu82QreQKBgQDUI+QMhr1Obj+DdLaXntqqcpLHL0OpZNfE\nnzu8lFFHSh4H27k7RN/SUMhoDqVH87FxhTdaLulO5XVFXLxbkTtFJI8J8XDhCMtW\n+kizuCAjdkmKhZk8n7AF/2vWQKeD9vHn9SWooD3GJnXi/Jr3iXzq1Cr4ow80hjbj\nTEQRNyIN9QKBgHQLz8JHSTo0PntqMP7UC2tJgCzFwxC9hqnAxbHXyrOecSwqieMF\nHNATBFfSZIfgRXSDzm8DkXbmEJnviIrvJOrJjqJLvxlszR9YxQHaM18a3AL4OLSv\ni6xIMY5DlzZE47LVSSrOhPPJNrls6qOOe2Y9RanJccpsD/FxRlElIxUhAoGBALSh\ntt1/oRN2RnhtWcgyh+hYVGhr80X6Ssrt9tR0ydxU3Ms+KTOxSo9vH6WSyuNAOhf6\nIY6VoSz/rmIYO34QZJJUNcN2pPHIJjPyOxNkNWFcp/PeHAOFyUDiIvU06i4wh/xF\nPgKeJtthBkH3axBZLldZvxkk5p6HpZbW6qJp+oI9AoGBANmGIuVjzZaz/rlV3Ljd\ndHZglt9xH9zdbNBTFO5z+sNy6nq5YJPO9pYsP22bxUSvUXZPkE4oTe0hF50RQ7lb\nllVw0Obijf/0f31ATk+PQwIZz7+DlZeOLcDYc5n1+ufUTgmMteGhDeiL+JGpTaZA\nUjdifQi5uWu0O9yLYqKsJAzv\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-tj38b@website-45ab7.iam.gserviceaccount.com",
    "client_id": "109732218905582444559",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tj38b%40website-45ab7.iam.gserviceaccount.com"
  }
  


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://website-45ab7.firebaseio.com" //apni project ki id lgo
});
const bucket = admin.storage().bucket("gs://website-45ab7.appspot.com");






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
    productimage: { type: String, required: true },
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
        price: Number,
        productimage: { type: String, required: true },
  
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

// app.post("/item" ,(req,res) => {
//     const newItem = new Item(req.body);
//     console.log("item add")
//     newItem.save().then(item => res.send(item))
    
// })




app.post('/item', upload.any(), async(req, res) => {
    console.log("product received", req.body)

    console.log("files", req.files[0])


  

    bucket.upload(
        req.files[0].path,
        {
            destination: `productPhotos/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        },
        function (err, file, apiResponse ) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then(async (urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                        // delete file from folder before sending response back to client (optional but recommended)
                        // optional because it is gonna delete automatically sooner or later
                        // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }


                        let newProduct = new Item({
                            title: req.body.title,
                            description: req.body.description,
                            price: req.body.price,
                           productimage : urlData[0],
                             })
                          try {
                            let response = await newProduct.save()
                            console.log("product added", response)
                            console.log(urlData[0])
                            res.send({
                              message: "product added",
                              data: {
                                title: req.body.tite,
                                description: req.body.description,
                                price : req.body.price,
                                productimage: urlData[0],
                                 }
                            })
                        
                          }
                        
                          catch (error) {
                            console.log("failed to add product" , error)
                            res.status(500).send({
                              message: "failed to add product"
                            })
                          }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });

    })


   


  

   
   


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


app.get("/carts", async (req, res) => { //this part is used jb pg refresh bhi kren or data show ho

    try {
        let carts = await Cart.find({}).exec();
        res.send({
           data : carts
        });  //user means single user ye reducer wala nh h

    } catch (error) {
        res.status(500).send({ message: "error getting carts" });
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
        const productimage = item.productimage

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
                cart.items.push({ productId, name, quantity, price , productimage });
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




