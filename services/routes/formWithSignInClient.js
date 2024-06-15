//loading the express 
const express = require('express');
const multer = require('multer');
const formRouter = express.Router();
//Consuming the middleware 
const checkAuth = require('../middleware/check-auth');
//consuming BASE_URL
const base_url = require('../base_url');
//basic configuration for multer
const multerStorage = multer.diskStorage({
    destination:'public/uploads/',
    filename: (file,data,cb)=>{
        cb(null,Date.now()+'.jpg');
    }
});
const uploadObject = multer({storage:multerStorage});
console.log('Multer is configured & Ready to Use...');
//Consuming form MOdel
const formModel = require('../models/form.model');
//form related all APIs will be defined here
async function formCheck (lim1,lim2,inst) {
    if ((lim1 == '') && (lim2 == '') && (inst == '')) {
        let formList = await formModel.find({}) //Promise
        .exec()
        return formList;
    }
    else if ((! lim1 == '') && (lim2 == '') && (inst == '')) {
        return await formModel.findOne({'_id': lim1}) //Promise
        .exec()
    }
    else if ((! lim1 == '') && (!lim2 == '') && (inst == '')) {
        return await formModel.find({$and:[{'form_price':{$gte : lim1}},{'form_price':{$lte : lim2}}]}) //Promice
        .exec()
    }
    else if ((! lim1 == '') && (! lim2 == '') && (inst == 'notin')) {
        return await formModel.find({$or:[{'form_price':{$lt : lim1}},{'form_price':{$gt : lim2}}]})
        .exec()
    }
}
formRouter.get('/forms', checkAuth, (req,res)=>{
let formView = formCheck('', '', '')
// formModel.find({}) //Promise
// .exec()
formView.then((formData)=>{
res.status(200).json(formData);
})
.catch((err)=>{
res.status(200).json({'message':err});
})
// formModel.find({})
// .exec((err,formData)=>{
// if(err) res.status(200).json({'message':err});
// else{
// res.status(200).json(formData)
// }
// })
// res.status(200).json({'message':'this is formsDetail'})
});
formRouter.get('/forms/:id', checkAuth, (req,res)=>{
let formView = formCheck(req.params.id,'', '') //Promice
// formModel.findOne({'_id': req.params.id}) //Promise
// .exec()
formView.then((formDataById)=>{
res.status(200).json({'message':formDataById})
})
.catch((err)=>{
if (err.name == 'CastError'){
res.status(200).json({'message':'Sorry! Something went wrong...'})
}
else
res.status(200).json(err);
})
// if(formDataById.affectedRows==1){
// if(!formDataById){
// res.status(200).json({'message':'Sorry! Something went wrong...'})
// }
// else{
// res.status(200).json({'message':formDataById})
// }
// })
// .catch((err)=>{
// res.status(200).json(err);
// })
});
//Getting specific form depending on price range provided by front end users
formRouter.get('/forms/:lim1/:lim2', checkAuth, (req,res)=>{
let lim1 = req.params.lim1;
let lim2 = req.params.lim2;
let formView = formCheck(lim1, lim2, '') //Promice
// formModel.find({$and:[{'form_price':{$gte : lim1}},{'form_price':{$lte : lim2}}]})
// .exec()
formView.then((formDataByPrice)=>{
res.status(200).json({'message':formDataByPrice})
})
.catch((err)=>{
res.status(200).json({'message':err})
})
})
//less than limit 1 and more than limit 2...EXCLUDING THE SPECIFIC PRICE RANGE.... opp of the last one
formRouter.get('/forms/notin/:lim1/:lim2', checkAuth, (req,res)=>{
let lim1 = req.params.lim1;
let lim2 = req.params.lim2;
let formView = formCheck(lim1, lim2, 'notin') //Promise
// 
formModel.find({$and:[{'form_price':{$lt:lim1}},{'form_price':{$gt:lim2}}]})
// formModel.find({$or:[{'form_price':{$lt : lim1}},{'form_price':{$gt : lim2}}]})
// .exec()
formView.then((formDataByPrice)=>{
res.status(200).json({'message':formDataByPrice})
})
.catch((err)=>{
res.status(200).json({'message':err})
})
})
//adding a post request
formRouter.post('/forms', checkAuth, 
uploadObject.single('avatar'),(req,res)=>{
//creating an object of formModel
const newform = async () => {
let newformModel = new formModel({
'form_name' : req.body.fName,
'form_desc' : req.body.fDesc,
'form_price': req.body.fPrice,
'form_image': base_url+req.file.filename
})
return await newformModel.save() //Promise
}
let savedform = newform(); //Promise
// let newformModel = new formModel({
// 'form_name' : req.body.fName,
// 'form_desc' : req.body.fDesc,
// 'form_price': req.body.fPrice,
// 'form_image': base_url+req.file.filename
// })
// newformModel.save()
savedform.then((result)=>{
res.status(200).json({
'message':'One form item has been successfully added...',
'result':result
})
})
.catch((err)=>{res.status(200).json({'message':err})})
});


// Deleting form Item -------------------------------------------------------------------
formRouter.delete('/forms/:id', checkAuth, (req,res)=>{
    // formModel.deleteOne({'_id' : req.params.id})
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
            res.status(200).json({'message':'ID not found OR the form item has already been deleted!!'})
        }
    })
    .catch((err)=>{
        res.status(200).json({'message':err})
    })
});

// Updating ----------------------------------------------------------
formRouter.all('/forms/:id', checkAuth, 
uploadObject.single('avatar'),(req,res)=>{
    if(req.method=='PUT' || req.method=='PATCH'){
        let id = req.params.id;
        const formUpdate = async (Id) => {
            return await formModel.updateOne({'_id':Id}, {$set:{
                'form_name' : req.body.fName,
                'form_desc' : req.body.fDesc,
                'form_price': req.body.fPrice,
                'form_image': base_url+req.file.filename
            }})
        }
        // formModel.updateOne({'_id':id}, {$set:{
        // 'form_name' : req.body.fName,
        // 'form_desc' : req.body.fDesc,
        // 'form_price': req.body.fPrice,
        // 'form_image': base_url+req.file.filename
        // }})
        let formUpdated = formUpdate(id); //Promise
        formUpdated.then((updatedform)=>{
            if(updatedform.matchedCount && updatedform.modifiedCount){
                res.status(200).json({'massage':'Modified successfuly'})
            }
            else res.status(200).json({'message':'Id missmatched OR item not modified!!'})
        })
        .catch((err)=>{
            res.status(200).json({'message':err})
        })
    }
});
module.exports = formRouter;//making form router available in entire application
console.log('form router is ready to use...')