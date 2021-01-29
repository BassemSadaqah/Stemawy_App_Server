const sqli=require('../utils/sqli')
const validate_form=require('../utils/validate_form')
const JsonError = require('./JsonError')

module.exports=(parent,args,req)=>{
    // if(!req.isAuth) throw new JsonError({code:400,msg:'Not Authorized'})
    var count=count?sqli(args.count):10
    return client.query(`SELECT id,first_name,last_name,email,fb_id,points FROM users where points is not NULL ORDER BY points DESC limit 10`)
    .then(RES=>{
        if(RES.rows.length==0) return []
        let users=RES.rows
        users=users.map(u=>{
            if(u.fb_id){
                return {...u,profile_pic:`https://graph.facebook.com/v9.0/${u.fb_id}/picture`}
            }
            return {...u,profile_pic:'https://i.stack.imgur.com/l60Hf.png'}
        })
        return users
    }).catch(err=>{
        throw new Error('Something Went Wrong')
    })
}