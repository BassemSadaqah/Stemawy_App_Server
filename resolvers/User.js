const sqli=require('../utils/sqli')
const validate_form=require('../utils/validate_form')

module.exports=(parent,args,req)=>{
    // if(!req.isAuth) throw new JsonError({code:400,msg:'Not Authorized'})
    var id=sqli(args.id)
    return client.query(`SELECT id,first_name,last_name,email,profile_pic,points FROM users where id=${id}`)
    .then(RES=>{
        if(RES.rows.length==0) throw new Error('User Not Found') //will never react to the front-end
        return RES.rows[0]
    }).catch(err=>{
        throw new Error('Something Went Wrong')
    })
}