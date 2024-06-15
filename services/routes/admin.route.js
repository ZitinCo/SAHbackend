const express = require('express');
const adminRoute = express.Router();
//consuming admin model
const adminModel = require('../models/admin.model');
const base_url = require('../base_url');
//loading json webtoken
let jwt = require('jsonwebtoken');
require("dotenv").config();
//loading bcryptjs
const bcryptjs = require("bcryptjs");
//loading the multer library
const multer = require('multer');
//basic configuration
const multerStorage = multer.diskStorage({
filename:(file,data,cb)=>{
    cb(null,Date.now()+'.jpg')
},
    destination:'public/uploads/'
})
const uploadObject = multer({storage:multerStorage});

//Adding Signup API ------------------------------------------------------------
async function createadmin (req) {
let salt = bcryptjs.genSaltSync(10);
let hashPswd = bcryptjs.hashSync(req.body.pswd,salt);
let newadmin = new adminModel({
    'userId' : req.body.uid, //S000#a#999H
    'pswd' : hashPswd,//req.body.pswd
    // 'profile_pic' : base_url+req.file.filename
})
let response = await newadmin.save(); //Promice
return response;
}
adminRoute.post('/124upsign976',(req,res)=>{
    // res.status(200).json({'message':'Signed Up'});
    let adminData = createadmin(req); //Promice
    adminData.then((adminInfo)=>{
        res.status(200).json({'message':'SignUp successfully!!',adminInfo});
    })
    .catch((err)=>{
        // res.status(200).json(err);
        if (err.keyPattern.userId) {
        res.status(200).json({'message':'Phone number is already registered!!'})
        }
        else if (err.keyPattern.email) {
            res.status(200).json({'message':'Email is already registered!!'})
        }
    })
})


//Adding signin API -------------------------------------------------------------
async function loginValidate (req) {
    let adminInfo = await adminModel.findOne({'userId':req.body.uid}) 
    .exec()
    return adminInfo;
}
adminRoute.post('/741signin963',(req,res)=>{
    let loginResponse = loginValidate(req); //Promise
    
    loginResponse.then((adminData)=>{
        // res.status(200).json(adminData);
        if (adminData){
        // res.status(200).json(adminData);
            let incomingData = req.body.pswd;
            let dbPass = adminData.pswd;
            // conasole.console.log(dbPass, incomingData);
            let result = bcryptjs.compareSync(incomingData, dbPass);
            // console.log(result);
            if(result){
            // console.log(result);
                let token = jwt.sign(
                {'admin':adminData.userId},//payload / data to be encoded 
                process.env.SECRECT_KEY,        //just a random string arguments work as a private key [public-2 ways(encode decode)/private-1 way(only encode)] this is 1 way
                // 'mySecretKey',     //just a random string arguments work as a private key [public-2 ways(encode decode)/private-1 way(only encode)] this is 1 way
                {expiresIn:'1hr'}//how long this token will persist for each admin's login
                );
                res.status(200).json({'message':'Success','activeadmin':adminData.userId, 'token': token});
            }
            else{
                res.status(200).json({'message':'Wrong credential!'});
                // res.status(200).json({'message':'Wrong credential [Password did not matched!]'});
            }
        }
        else {
            res.status(200).json({'message':'Wrong Admin ID!'})
        }
    })
    .catch((err)=>{//for handelling the connectivity problem
        res.status(200).json({'message':err})
    })
})
module.exports = adminRoute;
console.log('admin roure is ready to use')