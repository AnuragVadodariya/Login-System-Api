const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true
    },
    Email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        tolowercase:true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error('Email is invalid');
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
      }
})

//password Hashing

UserSchema.pre('save',async function(next){
    const user=this;

    user.password=await bcrypt.hash(user.password,8);
    next();
})

const User=mongoose.model('user',UserSchema);

module.exports=User;