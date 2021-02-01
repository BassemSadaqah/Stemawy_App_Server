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
const PORT = process.env.PORT || 5000;
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const jwtAccessTokenSecret = '#STEM_METS!123';
app.use(express.static('public'));
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}))
// FacebookStrategy = require('passport-facebook').Strategy;
app.use(passport.initialize());
// app.use(passport.session());
passport.use(new FacebookTokenStrategy({
    clientID: '1266442840182526',
    clientSecret: 'e10a1243fc116ac4cacdcd885fc5cd0b',
    // fbGraphVersion: 'v3.0'
}, function (accessToken, refreshToken, profile, done) {
    // console.log(profile)
    return done(null,profile)
    // User.findOrCreate({
    //     facebookId: profile.id
    // }, function (error, user) {
    //     return done(error, user);
    // });
}));
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// app.use(session({secret: '#STEM_METS!123',saveUninitialized:true,resave:true})); //Check saveUninitialized later in prod
if (process.env.DATABASE_URL){
    pgClient=({connectionString: process.env.DATABASE_URL,ssl: { rejectUnauthorized: false }})
}else{
    pgClient = {
        user: 'lpdmrrbmssaswr',
        password: 'cceced9e79fb4015c02cb75524580bca430a4c126ed4b1b3f59e8c65f2258f9e',
        host: 'ec2-3-231-241-17.compute-1.amazonaws.com',
        database: 'ddqbru3leu2qd9',
        port: 5432,
        ssl: true
    }
}
global.client = new Client(pgClient)

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
            if(payload.fb_id){
                payload.profile_pic = `https://graph.facebook.com/v9.0/${payload.fb_id}/picture?type=large`
            }else{
                payload.profile_pic = 'https://i.stack.imgur.com/l60Hf.png'
            }
            // console.log(payload)
            req.isAuth = true
            req.User = payload
            req.user_id = payload.id
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
        res.json({success:true,user:req.User})
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
    const RES =await client.query(`SELECT id,first_name,last_name,email,bio,points FROM USERS WHERE email=${email} AND password=${password} AND isfb is NULL`)
    if(RES.rows.length==0){
        res.json({success:false,err_msg:'wrong username or password'})
    }else{
        user=RES.rows[0]
        // if(user.fb_id){
        //     user.profile_pic = `https://graph.facebook.com/v9.0/${user.fb_id}/picture`
        // }
        const accessToken = jwt.sign(user, jwtAccessTokenSecret,{
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
    client.query(`INSERT INTO USERS (first_name,last_name,email,password,points) VALUES (${[first_name,last_name,email,password].join(',')},0)  RETURNING id,first_name,last_name,bio,email,points`)
    .then(RES=>{
        const user=RES.rows[0]
        const accessToken = jwt.sign(user, jwtAccessTokenSecret,{
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

app.post('/fb-login', passport.authenticate('facebook-token'), (req, res) => {
            const user=req.user
            // console.log(user)
            var first_name=sqli(user.name.givenName)
            var middle_name=sqli(user.name.middleName)
            var last_name=sqli(user.name.familyName)
            var fb_id=sqli(user.id)
            var email=''
            if(user.emails.length){
                email=sqli(user.emails[0].value)
            }
            var profile_pic=''
            if(user.photos.length){
                profile_pic=sqli(user.photos[0].value)
            }
            client.query(`SELECT id,first_name,last_name,bio,email,fb_id,profile_pic,isfb from users where fb_id=${fb_id} or email=${email}`).then(RES => {
                if(RES.rows.length!=0){
                    var resp={success:false}
                    for(var i=0;i<RES.rows.length;i++){
                        console.log(RES.rows[i].isfb)
                        if(RES.rows[i].isfb==1){
                            let user_data=RES.rows[i]
                            user_data.profile_pic = `https://graph.facebook.com/v9.0/${user_data.fb_id}/picture`
                            const accessToken = jwt.sign(user_data, jwtAccessTokenSecret, {
                                algorithm: "HS256",
                                // expiresIn: process.env.ACCESS_TOKEN_LIFE
                            });
                            resp={success:true,accessToken,user:user_data}
                            break
                        }else {
                            resp={success:false,err_msg:'email already exists'}
                        }
                    }
                    res.json(resp)
                }else{
                    client.query(`INSERT INTO users (first_name,middle_name,last_name,email,profile_pic,fb_id,isfb,points) VALUES(${[first_name,middle_name,last_name,email,profile_pic,fb_id].join(',')},1,0) returning id,first_name,last_name,bio,email,fb_id,profile_pic`).then(RES=>{
                        if(RES.rows.length){
                            const accessToken = jwt.sign(RES.rows[0], jwtAccessTokenSecret,{
                                algorithm: "HS256",
                                // expiresIn: process.env.ACCESS_TOKEN_LIFE
                            });
                            res.json({success:true,accessToken,user:RES.rows[0]})
                        }else{
                            res.json({success:false,err_msg:'something went wrong'})
                        }
                    }).catch(err=>{
                        res.json({success:false,err_msg:'something went wrong'})
                    })
                }
            }).catch(err=>{
                res.json({success:false,err_msg:'Something went wrong'}) 
            })
            // console.log(req.user)
            // do something with req.user
            // res.send(req.user ? 200 : 401);
        }
)

app.listen(PORT,()=>{console.log("Server Started")})