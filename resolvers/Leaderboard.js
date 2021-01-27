const sqli=require('../utils/sqli')
const validate_form=require('../utils/validate_form')
const JsonError = require('./JsonError')

module.exports=(parent,args,req)=>{
    // if(!req.isAuth) throw new JsonError({code:400,msg:'Not Authorized'})
    var count=count?sqli(args.count):10
    return client.query(`SELECT first_name,last_name,email,profile_pic,points FROM users where points is not NULL ORDER BY points DESC limit 10`)
    .then(RES=>{
        if(RES.rows.length==0) return []
        return RES.rows
    }).catch(err=>{
        throw new Error('Something Went Wrong')
    })
}