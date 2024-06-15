const express = require('express');
require('dotenv').config();
//loading the cors module to make cors free
const cors = require('cors');
const formRouter = require('./services/routes/form.route');//consuming form router
const adminRouter = require('./services/routes/admin.route');//consuming admin router

// loading the mongoose library
const mongoose = require('mongoose');

//conecting to local database:-
// const dbURL = "mongodb://127.0.0.1:27017/ServiceAreaHubDB";
//mongoDB database url pattern:-
const dbURL = process.env.dbURL;
// const dbURL = "mongodb+srv://zitin:phYrmZYyKGw1FuCC@cluster0.mn1zhic.mongodb.net/ServiceAreaHubDB?retryWrites=true&w=majority&appName=Cluster0";
const connection = mongoose.connect(dbURL)
.then(()=>{ //resolve block (try block)
    console.log('Connected to mongoDB');
})
.catch((err)=>{ //reject block (catch block)
    console.log('Error msg'+err);
});
// mongoose.connect(dbURL,(err)=>{
// if(err) throw err;
// else{
// console.log('Successfully connected to MongoDB')
// 

// const port = 5000;
// const port = 8080;
const port = process.env.PORT;
const app = express();

app.use(cors());//making the entire API available to frontend clints
//express to accept url encoded form-data or raw data directly
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//let express to share its static resourse to client
app.use(express.static('public'));
app.use('/form', formRouter);
app.use('/adm852', adminRouter);
// app.use('/api', foodRouter);
// app.use('/users', userRouter);
// app.use('/orders', orderRouter)

app.get('/', (req,res)=>{
    res.send(`<h1>Welcome to ServiceAreaHub api</h1>`);
});
app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = {connection}