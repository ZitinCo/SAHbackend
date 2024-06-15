const jwt = require('jsonwebtoken');
require("dotenv").config();
let checkAuth = (req,res,next)=>{
try{
jwt.verify(req.headers.token, process.env.SECRECT_KEY);
// jwt.verify(req.headers.token, 'mySecretKey');
}
catch(err){
// console.log(err);
return res.status(200).json({'message':'Invalid or removed, please Login to contiue'});
}
next();//next is a function, which is used to redirect to the next available resourse
};
module.exports = checkAuth;
console.log('Middleware is ready to use')