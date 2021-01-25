const express = require("express");
// const cookieParser = require('cookie-parser');
const { Client } = require('pg')
const bodyParser = require('body-parser');
// const session = require('express-session');
const ash=require('express-async-handler')
const sqli=require('./utils/sqli')
const validate_form=require('./utils/validate_form')
const app = express();
const jwt = require('jsonwebtoken');
// app.use(cookieParser());
const expressGraphQL=require('express-graphql').graphqlHTTP
const schema=require('./schema/schema');
const e = require("express");
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}))

const jwtAccessTokenSecret = '#STEM_METS!123';

// app.use(session({secret: '#STEM_METS!123',saveUninitialized:true,resave:true})); //Check saveUninitialized later in prod

global.client = new Client({
    user:'lpdmrrbmssaswr',
    password:'cceced9e79fb4015c02cb75524580bca430a4c126ed4b1b3f59e8c65f2258f9e',
    host:'ec2-3-231-241-17.compute-1.amazonaws.com',
    database:'ddqbru3leu2qd9',
    port:5432,
    ssl:true
})
client.connect()

// const update_points = (data,i) => {
//         const id=data[i].id
//         console.log(id)
//         client.query(`update users set points=(select Sum(user_points) from users_answers where user_id=${id}) where id=${id}`).then(R => {
//             i++
//             update_points(data,i)
// })
// }

// client.query('SELECT id from users').then(RES=>{
//     data=RES.rows
//     i=0
//     update_points(data,i)
// })


const isAuthMiddleware=(req,res,next)=>{
    const accessToken=req.headers.authorization
    if (accessToken) {
        try {
            payload = jwt.verify(accessToken,jwtAccessTokenSecret,{algorithms:['HS256']})
            console.log(payload)
            req.isAuth = true
            req.user = payload
        } catch (e) {
            console.log('jwt error')
            req.isAuth = false
        }
    }else{
        req.isAuth=false
    }
    next()
}
app.use(isAuthMiddleware)
app.use('/graphql',expressGraphQL({
    graphiql:true,
    schema,
    customFormatErrorFn:(err)=>{
        return err
    }
//     customFormatErrorFn: (err) => {
//         console.log(err)
//         if(err.message.code){
//             return err.message
//         }else{
//             return {code:0,message:err.message}
//         }
//     // const error = getErrorCode(err.message)
//     // return ({ message: error.message, statusCode: error.statusCode })
// }
}))

app.get('/user',function(req,res){
    if(req.isAuth){
        res.json({success:true,user:req.user})
    }else{
        res.json({success:false,err_msg:'Not Authorized'})
    }
})
app.post('/login',ash(async(req,res)=>{
    var {email,password}=req.body
    email=email.toLowerCase()
    form_err=validate_form([[email,'Email|E|5|50'],[password,'Password|T|6|50']])
    if(form_err.err){
        res.json({success:false,err_msg:form_err.err_msg})
        return
    }
    var [email,password]=sqli(email,password)
    const RES =await client.query(`SELECT id,first_name,last_name,email,points FROM USERS WHERE email=${email} AND password=${password}`)
    if(RES.rows.length==0){
        res.json({success:false,err_msg:'wrong username or password'})
    }else{
        user=RES.rows[0]
        const accessToken = jwt.sign({id:user.id, first_name: user.first_name, last_name:user.last_name,email:user.email }, jwtAccessTokenSecret,{
            algorithm: "HS256",
            // expiresIn: process.env.ACCESS_TOKEN_LIFE
        });
        res.json({success:true,userId:user.id,user,accessToken})   
    }
    
}))

app.post('/register',(req,res)=>{
    var {first_name,last_name,email,password}=req.body
    console.log(first_name)
    email=email?email.toLowerCase():''
    form_err=validate_form([[first_name,'First Name|T|1|15'],[last_name,'Last Name|T|1|15'],[email,'Email|E|5|50'],[password,'Password|T|6|50']])
    if(form_err.err){
        res.json({success:false,err_msg:form_err.err_msg})
        return
    }
    var [first_name,last_name,email,password]=sqli(first_name,last_name,email,password)
    client.query(`INSERT INTO USERS (first_name,last_name,email,password) VALUES (${[first_name,last_name,email,password].join(',')})  RETURNING id,first_name,last_name,email,points`)
    .then(RES=>{
        const user=RES.rows[0]
        const accessToken = jwt.sign({id:user.id, first_name: user.first_name, last_name:user.last_name,email:user.email }, jwtAccessTokenSecret,{
            algorithm: "HS256",
            // expiresIn: process.env.ACCESS_TOKEN_LIFE
        });
        res.json({success:true,accessToken,user})
    })
    .catch((err)=>{
        console.log(err)
        if(err.code==23505){
            res.json({success:false,err_msg:'Email already exists'})
        }else{
            res.json({success:false,err_msg:'Something went wrong'})
        }
    })
})

app.listen(5000,()=>{console.log("Server Started")})