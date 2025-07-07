const express = require('express');
const path=require('path');
var app=express();
app.use(express.urlencoded({extended:false}));
const {check, validationResult} = require('express-validator');
var tax = {
    "Ab": 0.05,
    "Bc": 0.05,
    "Man": 0.05,
    "Nb": 0.15,
    "Nl": 0.15,
    "Nt": 0.05,
    "Ns": 0.15,
    "Nu": 0.05,
    "On": 0.13,
    "Qb": 0.05,
    "Pel": 0.15,
    "Sas": 0.05,
    "Yk":0.05
};

app.set('views',path.join(__dirname,'views'))
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs')

var phoneReg =/^\d{10}$/;
var emailReg =/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.com$/;

app.get('/',(req,res)=>{
    res.render('main');
});

app.post('/',[
    check('name1', 'Name should not be empty').notEmpty(),
    check('add','Address should not be empty').notEmpty(),
    check('city','City should not be empty').notEmpty(),
    check('prov','Province should not be empty').notEmpty(),
    check('pnumb','Phone Number Invalid').matches(phoneReg),
    check('em','Email is Invalid').matches(emailReg),
    // check('fshoe','Shoe Quantity should be 1 or more').isInt(),
    // check('fsocks','Socks Quantity should be 1 or more').isInt(),
    // check('fglove','Gloves Quantity should be 1 or more').isInt(),
    

],(req,res)=>{


    var errors= validationResult(req);
    var price1= 0;
    if (!isNaN(parseInt(req.body.fshoe))) {
        price1 = parseInt(req.body.fshoe)*15;
    }
    var price2= 0;
    if (!isNaN(parseInt(req.body.fsocks))) {
        price2 = parseInt(req.body.fsocks)*5;
    }
    var price3= 0;
    if (!isNaN(parseInt(req.body.fglove))) {
        price3 = parseInt(req.body.fglove)*10;
    }
    var total=price1+price2+price3;
    if(!errors.isEmpty()) {
        if(total < 10) {
            res.render('main',{errors:errors.array(),errorMessage: " Please ensure to buy above 10$"})
        } else {
            res.render('main',{errors:errors.array()})
        }
        // console.log(req.body)
        
    }else{
        if (total>10) {
            var finalTax = total * tax[req.body.prov];
            var toSend={
                name1:req.body.name1,
                prov:req.body.prov,
                add:req.body.add,
                city:req.body.city,
                pnumb:req.body.pnumb,
                em:req.body.em,
                fshoe:req.body.fshoe,
                fsocks:req.body.fsocks,
                fglove:req.body.fglove,
                total: total,
                tax: finalTax,
                finalTotal: (total + finalTax)
            }
            res.render('main',toSend);
        }else{
            res.render('main',{errorMessage: " Please ensure to buy above 10$"});
        }
        
        // console.log(total)
    }

    
});

app.listen(8080);
console.log('Started Listening')