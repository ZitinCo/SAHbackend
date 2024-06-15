const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
'userId' : {type:String, require:true},
'pswd' : {type:String, require:true},
},{versionKey:false});
module.exports = mongoose.model('adminModel',adminSchema,'admin');
console.log('User Model is ready to use');