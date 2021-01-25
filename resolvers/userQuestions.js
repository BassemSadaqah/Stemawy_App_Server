const sqli=require('../utils/sqli')
const validate_form=require('../utils/validate_form')
const JsonError = require('./JsonError')

module.exports=(parent,args,req)=>{
    if(!req.isAuth) throw new JsonError({code:400,msg:'Not Authorized'})
    const [user_id,limit]=sqli(args.user_id,args.limit)
    console.log(user_id)
    return client.query(`SELECT * FROM questions where user_id=${user_id} ORDER BY time DESC limit ${limit}`)
    .then(RES=>{
        var data=RES.rows
        if (data.length == 0) return []
        data=data.map(r=>{
            let choices = [r.ans_a, r.ans_b, r.ans_c, r.ans_d, r.ans_e, r.ans_f, r.ans_g, r.ans_h].splice(0, r.ans_num)
            return {...r,choices}
        })
        // RES.rows[0].choices=RES.rows[0].choices.split(',')
        return data
    }).catch(err=>{
        console.log(err)
        throw new Error('Something Went Wrong')
    })
}