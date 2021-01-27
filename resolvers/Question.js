const sqli=require('../utils/sqli')
const validate_form=require('../utils/validate_form')
const JsonError = require('./JsonError')

module.exports=(parent,args,req)=>{
    // if(!req.isAuth) throw new JsonError({code:400,msg:'Not Authorized'})
    question_id=sqli(args.id)
    return client.query(`SELECT * FROM questions where id=${question_id}`)
    .then(RES=>{
        if(RES.rows.length==0) throw new Error('Question Not Found')
        let data=RES.rows[0]
        let choices = [data.ans_a, data.ans_b, data.ans_c, data.ans_d, data.ans_e, data.ans_f, data.ans_g, data.ans_h].splice(0,data.ans_num)
        return {...data,choices}
        // RES.rows[0].choices=RES.rows[0].choices.split(',')
        return RES.rows[0]  
    }).catch(err=>{
        throw new Error('Something Went Wrong')
    })
}