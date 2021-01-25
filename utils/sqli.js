module.exports=function(){
    args=Object.values(arguments)
    const escape= (v)=>((v==undefined)?"NULL":("'" + ('' + v).replace(/\\/g, '\\\\').replace(/'/g, "''") + "'"))
    if(args.length==1){
        return escape(args[0])
    }else{
        return args.map(v=>escape(v))
    }
}