const db = require('./db')
const jwt = require('jsonwebtoken')


const register = (uname, acno, password) => {

    return db.User.findOne({acno})
        .then(user => {
            if (user) {
                return {
                    statuscode: 422,
                    status: false,
                    message: "User already exist"
                }
            }
            else {
                const newUser = new db.User({
                    uname,
                    acno,
                    password,
                    balance: 0,
                    transactions: []
                })
                newUser.save()
                return {
                    statuscode: 200,
                    status: true,
                    message: "Registration complete"
                }
            }
        })
}

const login = (acno, password) => {
    return db.User.findOne({acno,password})
    .then(user=>{
        if(user){
            const token = jwt.sign({
                currentNo: acno
            }, 'spersecretkey123123')
            return {
                statuscode: 200,
                status: true,
                message: "Login success",
                token,
                currentuser:user.uname
            }
        }
        else{
            return {
                statuscode: 422,
                status: false,
                message: "Invalid password"
            }
        }
    })
}


const deposit = (acno, password, amount) => {
    var amt = parseInt(amount)
    return db.User.findOne({acno,password})
    .then(user=>{
        if(!user){
            return {
                statuscode: 422,
                status: false,
                message: "invalid credentials"
            }
        }
        user.balance+=amt
        
        user.transactions.push({
            amount: amt,
                type: "Credit"
        })
        user.save()
        return {
            statuscode: 200,
            status: true,
            message: amt + "Deposit successfully & new balance is" + user.balance
        }
    })
}



const withdraw = (acno, password, amount) => {
    var amt = parseInt(amount)
    return db.User.findOne({acno,password})
    .then(user=>{
        if(!user){
            return {
                statuscode: 422,
                status: false,
                message: "invalid credentials"
            }
        }
        if(user.balance<amt){
            return {
                statuscode: 422,
                status: false,
                message: "Insuficient balance"
            }
        }
        user.balance-=amt
        user.transactions.push({
            amount: amt,
                type: "Debit"
            })
            user.save()
        return {
            statuscode: 200,
            status: true,
            message: amt + "Withdrawl successfully & new balance is" + user.balance
        }
    })
}

const gettransactions = (acno) => {
    return db.User.findOne({acno})
    .then(user=>{
        if(user){
            return {
                statuscode: 200,
                status: true,
                transactions: user.transactions
            }
        }
        else {
            return {
                statuscode: 422,
                status: false,
                message: "user not found"
            }

        }
    })   
}

const deleteAcc=(acno)=>{
    return db.User.deleteOne({acno})
    .then(user=>{
        if(user){
            return {
                statuscode: 200,
                status: true,
                message:"Account deleted"
            }
        }
        else{
            return {
                statuscode: 422,
                status: false,
                message: "invalid operation"
            }
        }
    })
}

module.exports = {
    register,
    login,
    deposit,
    withdraw,
    gettransactions,
    deleteAcc
}