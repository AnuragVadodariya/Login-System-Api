const express=require('express');
const User=require('../models/register');
const bodyParser=require('body-parser');
const bcrypt=require('bcryptjs');
const router=express.Router();
const encoder=bodyParser.urlencoded({extended:false});
var s;
const session=require('express-session');
router.use(session({
    secret: 'Login-System-Api',
    resave: false,
    saveUninitialized: true,
  }))

//for home

router.get('/',async (req,res) => {
    res.render('home')
})

router.get('/home',async (req,res) => {
    res.render('home')
})

//for Register
router.get('/register',async (req,res) => {
    res.render('register')
})

router.post('/register',encoder,async (req,res) => {
    const {unm,email,pass,pass2}=req.body;

    const ar=[];

    if(pass !== pass2){
        ar.push({er:'password do not match'});
    }
    if(pass.length<6){
        ar.push({er:'Password Too Short'});
        
    }

    const findEmail=await User.findOne({Email:email});
    if(findEmail){
        ar.push({er:'Email is Use'});  
    }

    if(ar.length > 0){
        res.render('register', {
            ar,
            unm,
            email,
            pass,
            pass2
          });
    }
    else
    {
    
        const AddUser=new User({
            username:unm,
            Email:email,
            password:pass
          });
        try{
            const us=await AddUser.save();
            res.redirect('login');
        }catch(err){
            res.status(500).send('Server Error')
        }
    
  }
    
})

//for login

router.get('/login',async (req,res) => {
    res.render('login')
})

router.post('/login',encoder,async (req,res) => {
    const {email,password}=req.body;

    const ar=[];

    //check for login

    const userdetails=await User.findOne({Email:email});
    
    if(!userdetails){
        ar.push({er:'Unable to login'});  
        res.render('login', {
            ar,
            email,
            password
          });
    }
    const isMatch=await bcrypt.compare(password,userdetails.password);
    if(!isMatch){
        ar.push({er:'Unable to login'});  
        res.render('login', {
            ar,
            email,
            password
          });
    }
    s=true;
    res.redirect('dashBoard');
})

//for dashBoard

router.get('/dashBoard',async (req,res) => {
    if(s === false){
      res.redirect('home');
    }
    res.render('dashBoard')
})

//for Logout

router.get('/logout',async (req,res) => {
    s=false;
    res.redirect('home');
})


module.exports=router;