//loading the express 
const express = require('express');
const multer = require('multer');
const formRouter = express.Router();
//Consuming the middleware 
const checkAuth = require('../middleware/check-auth');
//consuming BASE_URL
const base_url = require('../base_url');

//Consuming form MOdel
const formModel = require('../models/form.model');
//form related all APIs will be defined here

// Form submitting API ----------------------------------------------------------
async function createForm (req) {
    let newForm = new formModel({
        'client_name' : req.body.name,
        'client_email' : req.body.email,
        'client_country' : req.body.country,
        'client_phone' : req.body.phone,
        'domain_link' : req.body.domainLink,
        // 'multiple_queries' : req.body.mulQueries.toLowerCase(),
        'web_query' : req.body.webQuery.toLowerCase(),
        'mbapp_query' : req.body.mbappQuery.toLowerCase(),
        'mrkt_query' : req.body.mrktQuery.toLowerCase(),
        'webgraph_query' : req.body.webgraphQuery.toLowerCase(),
        'cntnt_query' : req.body.cntntQuery.toLowerCase(),
        'ecom_query' : req.body.ecomQuery.toLowerCase(),
        'date' : req.body.date,
        'query_description' : req.body.queryDesc,
        // 'profile_pic' : base_url+req.file.filename
    })
    let response = await newForm.save(); //Promice
    return response;
}
formRouter.post('/submition', (req,res)=>{
    let formData = createForm(req);
    formData.then((formInfo)=>{
        res.status(200).json({'message':'Thanks for showing interest. We will get back to you shortly!',formInfo});
    })
    .catch((err)=>{
        // res.status(200).json(err);
        res.status(200).json({'message':'Kindly fill all the mandatory fields properly!'})
    })
})

// Form checking API ------------------------------------------------------------
async function formCheck (serviceRequired, exactServiceRequired, catg3) {
    if ((serviceRequired=='') && (exactServiceRequired=='') && (catg3=='')){
        let formReceived = await formModel.find({}) // Promise
        .exec();
        return formReceived;
    }
    else if ((!serviceRequired=='') && (exactServiceRequired=='') && (catg3=='')){  // Specific Domain
        serviceRequired = serviceRequired.toLowerCase();
        let webDev = 'web_development';
        let mbAppDev = 'mobile_app_development';
        let digiMark = 'digital_marketing_SEO';
        let webGrphDsgn = 'web_graphic_design';
        let contWrt = 'content_writing';
        let ecom = 'e_commerce';
        let formReceived;

        if((serviceRequired.includes('web'))){
            formReceived = await formModel.find({'web_query' : webDev}) // Promise
            .exec();
        }
        if((serviceRequired.includes('app'))){
            formReceived = await formModel.find({'mbapp_query' : mbAppDev}) // Promise
            .exec();
        }
        if((serviceRequired.includes('digi'))){
            formReceived = await formModel.find({'mrkt_query' : digiMark}) // Promise
            .exec();
        }
        if((serviceRequired.includes('grph'))){
            formReceived = await formModel.find({'webgraph_query' : webGrphDsgn}) // Promise
            .exec();
        }
        if((serviceRequired.includes('cntnt'))){
            formReceived = await formModel.find({'cntnt_query' : contWrt}) // Promise
            .exec();
        }
        if((serviceRequired.includes('ecom'))){
            formReceived = await formModel.find({'ecom_query' : ecom}) // Promise
            .exec();
        }
        return formReceived;
    }
}
    
//  View all forms
formRouter.get('/receivedquery', checkAuth, (req,res)=>{
    let formView = formCheck('','','');
    formView.then((formData)=>{
        res.status(200).json(formData);
    })
    .catch((err)=>{
        res.status(200).json({'message' : err});
    })
})
//  View MULTIPLE domains AND View ONLY specific domain (IF ONLY ONE is SELECTED)
formRouter.get('/receivedquery/:qryabt', checkAuth, (req,res)=>{
    let formView = formCheck(req.params.qryabt,'','');
    formView.then((formData)=>{
        if(formData){
            res.status(200).json(formData);
        }
        else{
            res.status(200).json({'message':'Sorry! No match found.'})
        }
    })
    .catch((err)=>{
        if (err.name == 'CastError'){
            res.status(200).json({'message':'Sorry! Something went wrong...'})
        }
    })
})


// Form deleting API ----------------------------------------------------------
formRouter.delete('/deleteform/:id', checkAuth, (req,res)=>{
    const deleteform = async (id) => {
        return await formModel.deleteOne({'_id' : id}); //Promise
    }
    let deletedform = deleteform(req.params.id); //Promise
    deletedform.then((deletedData)=>{
        if(deletedData.deletedCount){
            res.status(200).json({
                'message':'One form record has been removed successfully',
                'deletedInfo':deletedData
            })
        }
        else{
            res.status(200).json({'message':'ID not found OR the form has already been deleted!'})
        }
    })
    .catch((err)=>{
        res.status(200).json({'message':err})
    })
})
// Form delete ALL API ----------------------------------------------------------
formRouter.delete('/deleteform/', checkAuth, (req,res)=>{
    // db.collection.drop()
    const deleteform = async () => {
        return await formModel.deleteMany(); //Promise
    }
    let deletedform = deleteform(); //Promise
    deletedform.then((deletedData)=>{
        // console.log(deletedData)
        if(deletedData.deletedCount){
            res.status(200).json({
                'message':'Entire form record has been removed successfully',
                'deletedInfo':deletedData
            })
        }
        else{
            res.status(200).json({'message':'No form left to delete OR the forms were already been deleted!!'})
        }
    })
    .catch((err)=>{
        res.status(200).json({'message':err})
    })
})

module.exports = formRouter;//making form router available in entire application
// console.log('form router is ready to use...')