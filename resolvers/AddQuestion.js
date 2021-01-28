const sqli=require('../utils/sqli')
const validate_form=require('../utils/validate_form')

module.exports=(parent,args,req)=>{
    // if(!req.isAuth) return{success:false,err_msg:'Not Authroized'}
    if (!req.isAuth) throw new Error('Not Authorized')
    user_id=req.User.id
    console.log(user_id)
    var {question,img,choices,answer}=args
    choices=choices.filter(v=>v!='')
    console.log(choices)
    form_err=validate_form([[question,'Question Text|T|1|1000'],[choices,'Choices|A|2|10'],[answer,'Answer|I|0|10']])
    if(form_err.err){
        return {success:false,err_msg}
    }
    var [ans_a,ans_b,ans_c,ans_d,ans_e,ans_f,ans_g,ans_h]=choices
    var ans_num=choices.length;
    var [user_id,question,ans_a,ans_b,ans_c,ans_d,ans_e,ans_f,ans_g,ans_h,ans_num,img,answer] = sqli(user_id,question,ans_a,ans_b,ans_c,ans_d,ans_e,ans_f,ans_g,ans_h,ans_num,img,answer)
    return client.query(`INSERT INTO QUESTIONS (user_id,question,ans_a,ans_b,ans_c,ans_d,ans_e,ans_f,ans_g,ans_h,ans_num,img,answer) VALUES (${user_id},${question},${ans_a},${ans_b},${ans_c},${ans_d},${ans_e},${ans_f},${ans_g},${ans_h},${ans_num},${img},${answer}) returning id`)
    .then(RES=>({id:RES.rows[0].id,success:true}))
    .catch(err=>({success:false,err_msg:'Something Went Wrong'}))
}