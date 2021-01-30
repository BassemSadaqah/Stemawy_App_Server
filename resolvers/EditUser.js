const sqli = require('../utils/sqli')
const validate_form = require('../utils/validate_form')

module.exports = (parent, args, req) => {
        // if(!req.isAuth) return{success:false,err_msg:'Not Authroized'}
        if (!req.isAuth) throw new Error('Not Authorized')
        var {first_name,last_name,email,bio}=args
        console.log(req.user_id)
        form_err=validate_form([[first_name,'First Name|T|1|15'],[last_name,'Last Name|T|1|15'],[email,'Email|E|5|50'],[bio,'Bio|T|0|50']])
        if(form_err.err){
            return {success:false,err_msg:form_err.err_msg}
        }else{
            [first_name,last_name,email,bio]=sqli(first_name,last_name,email,bio)
            return client.query(`UPDATE users set first_name=${first_name},last_name=${last_name},email=${email},bio=${bio} where id=${req.user_id}`).then(RES=>{
                if(RES.rowCount==1){
                    return {success:true,err_msg:''}
                }
                return {success:false,err_msg:'Something Went Wrong'}
            }).catch(err=>{
                console.log(err)
                if(err.code==23505){
                    return {success:false,err_msg:'Email already exists'} 
                }
                return {success:false,err_msg:'Something Went Wrong'}
            })
        }
        console.log(form_err)
        user_id = req.User.id
        console.log(args)
}