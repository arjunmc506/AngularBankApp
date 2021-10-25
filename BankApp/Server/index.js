const express=require('express')
const dataservice=require('./services/data.service')
const app=express()
const session=require("express-session")
const jwt=require('jsonwebtoken')
const cors=require('cors')
app.use(express.json())
app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}))
app.use(session({
    secret:'randomsecretkey',
    resave:false,
    saveUninitialized:false
}))
app.use((req,res,next)=>{
    console.log("middleware");
    next()
})
const authmiddleware=(req,res,next)=>{
    if (!req.session.currentNo) {
        const result=({
            statuscode: 401,
            status: false,
            message: "Please login"
        })
        res.status(result.statuscode).json(result)
    }
    else{
        next()
    }
}

const jwtmiddleware=(req,res,next)=>{
    try{
        const token=req.headers["x-access-token"]
    const data=jwt.verify(token,'spersecretkey123123')
    req.currentacc=data.currentNo
    next()
    }
    catch{
        const result=({
            statuscode: 401,
            status: false,
            message: "Please login"
        })
        res.status(result.statuscode).json(result)
    }
}


app.post('/token',jwtmiddleware,(req,res)=>{
    res.send("Current Account Number: "+req.currentacc)
})
app.get('/',(req,res)=>{
    res.status(401).send("Get method")
})
app.post('/',(req,res)=>{
    res.send("Post method")
})
app.put('/',(req,res)=>{
    res.send("Put method")
})
app.patch('/',(req,res)=>{
    res.send("Patch method")
})
app.delete('/',(req,res)=>{
    res.send("Delete method")
})

app.post('/register',(req,res)=>{
    dataservice.register(req.body.uname,req.body.acno,req.body.password)
    .then(result=>{
        res.status(result.statuscode).json(result)
    })
})

app.post('/login',(req,res)=>{
    dataservice.login(req.body.acno,req.body.password)
    .then(result=>{
        res.status(result.statuscode).json(result)
    })
    
})

app.post('/deposit',jwtmiddleware,(req,res)=>{
    dataservice.deposit(req.body.acno,req.body.password,req.body.amount)
    .then(result=>{
        res.status(result.statuscode).json(result)
    })  
})
app.post('/withdraw',jwtmiddleware,(req,res)=>{
    dataservice.withdraw(req.body.acno,req.body.password,req.body.amount)
    .then(result=>{
        res.status(result.statuscode).json(result)
    })
    
})

app.post('/transaction',jwtmiddleware,(req,res)=>{
    dataservice.gettransactions(req.body.acno)
    .then(result=>{
        res.status(result.statuscode).json(result)
    })
   
})

app.delete('/deleteAcc/:acno',jwtmiddleware,(req,res)=>{
    dataservice.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statuscode).json(result)
    })
   
})

app.listen(3000,()=>{
    console.log("server running");
})


