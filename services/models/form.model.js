const mongoose = require('mongoose');
const formSchema = mongoose.Schema({
'client_name' : {type:String, required:true},
'client_email' : {type:String, required:true},
'client_country' : {type:String, required:true},
'client_phone' : {type:String, required:true},
'domain_link' : {type:String, required:false},
// 'multiple_queries': {type:String, required:true},
'web_query': {type:String, required:true},
'mbapp_query': {type:String, required:true},
'mrkt_query': {type:String, required:true},
'webgraph_query': {type:String, required:true},
'cntnt_query': {type:String, required:true},
'ecom_query': {type:String, required:true},
'date' : {type:String, required:true},
'query_description': {type:String, required:false}
// 'project_descriptiion': {type:String, required:false}
},{versionKey:false});
module.exports = mongoose.model('formModel',formSchema,'form');
/*
XYZ --> Just a virtual name of the mongoose model
formModel --> Just a virtual name of the mongoose model
formSchema --> Entire Schema object of the form [Pattern]  
form --> Name of the database collection
*/
// console.log('Form model is ready to use...')