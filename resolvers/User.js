const sqli=require('../utils/sqli')
const validate_form=require('../utils/validate_form')

module.exports=(parent,args,req)=>{
    // if(!req.isAuth) throw new JsonError({code:400,msg:'Not Authorized'})
    // if(parent.id){
    //     var id=sqli(args.parent.id)
    // }
    var id=sqli(args.id)!='NULL'?sqli(args.id):sqli(parent.user_id)
    if(id=='NULL' && req.user_id){
        id=user_id
    }else{
        throw new Error('Invalid ID')
    }
    console.log(id)
    return client.query(`select * from (select id,first_name,last_name,email,fb_id,profile_pic,points,rank() over (order by points desc) as rank from users) t where id=${id}`)
    .then(RES=>{
        if(RES.rows.length==0) throw new Error('User Not Found') //will never react to the front-end
        let data=RES.rows[0]
        if(data.fb_id){
            return {...data,profile_pic:`https://graph.facebook.com/v9.0/${data.fb_id}/picture`}
        }else{
            return {...data,profile_pic:'https://i.stack.imgur.com/l60Hf.png'}
        }
    }).catch(err=>{
        console.log(err)
        throw new Error('Something Went Wrong')
    })
}