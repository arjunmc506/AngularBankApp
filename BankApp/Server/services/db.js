const mongoose= require("mongoose");

mongoose.connect('mongodb://localhost:27017/bankapp',{
    useNewUrlParser:true
})

const User=mongoose.model('User',{
    uname:String,
    acno:Number,
    password:String,
    balance:Number,
    transactions:[]
})

module.exports={
    User
}