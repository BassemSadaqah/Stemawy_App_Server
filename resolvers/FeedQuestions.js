const sqli = require('../utils/sqli')
const validate_form = require('../utils/validate_form')

module.exports = (parent, args, req) => {
    // if(!req.isAuth) throw new JsonError({code:400,msg:'Not Authorized'})
    // question_id = sqli(args.id)
    var limit=Number(args.limit)<25?Number(args.limit):5
    limit=limit?sqli(limit):5
    return client.query(`SELECT * FROM questions  ORDER BY RANDOM() LIMIT ${limit}`)
        .then(RES => {
            var data = RES.rows
            if (!data) return []
            data = data.map(r => {
                let choices = [r.ans_a, r.ans_b, r.ans_c, r.ans_d, r.ans_e, r.ans_f, r.ans_g, r.ans_h].splice(0, r.ans_num)
                return { ...r, choices }
            })
            return data
        }).catch(err => {
            console.log(err)
            throw new Error('Something Went Wrong')
        })
}