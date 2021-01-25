module.exports=function validate_form(array){
    err:false
    err_msg=''
    
    array.every(arr => {
        form_err=validate(arr[0],arr[1])
        if(form_err.err){
            err=true
            err_msg=form_err.err_msg
            return false
        }
        return true
    
    });
    return{err,err_msg}
}
function validate(value,filter){
        const email_re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        err=false
        err_msg=''
        value=value?value:''
        var filters=filter.split('|')
        filters[1]=filters[1].toLowerCase()
        filters[2]=Number(filters[2])
        filters[3]=Number(filters[3])
        if((filters[1]=='e'||filters[1]=='email') && !email_re.test(value.toLowerCase())){
            err=true
            err_msg='Please Enter a valid mail'
            return{err,err_msg}
        }
        if(filters[0]!='I' && value.length<filters[2]){
            err=true
            err_msg=`${filters[0]} Should be at least ${filters[2]} characters`
            return{err,err_msg}
        }
        if(filters[0]!='I' && value.length>filters[3]){
            err=true
            err_msg=`${filters[0]} Should not increase ${filters[3]} characters`
            return{err,err_msg}
        }
        if(filters[0]=='I' && value<filters[2]){
            err=true
            err_msg=`${filters[0]} Should be at least ${filters[2]}`
            return{err,err_msg}
        }
        if(filters[0]=='I' && value>filters[3]){
            err=true
            err_msg=`${filters[0]} Should not increase ${filters[3]}`
            return{err,err_msg}
        }
        return {err,err_msg}
    }