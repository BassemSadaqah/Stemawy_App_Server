const GraphQL=require('graphql')
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean
}=GraphQL
const userQuestions = require('../resolvers/userQuestions')
const sqli= require('../utils/sqli')
const User = require('../resolvers/User')
const userType=new GraphQLObjectType({
    name:'User',
    fields:()=>({
        id:{type:GraphQLInt},
        first_name:{type:GraphQLString},
        last_name:{type:GraphQLString},
        bio:{type:GraphQLString},
        email:{type:GraphQLString},
        fb_id:{type:GraphQLInt},
        profile_pic:{type:GraphQLString},
        points:{type:GraphQLInt},
        rank:{type:GraphQLInt},
        questions:{
            type:new GraphQLList(questionType),
            args:{limit:{type:GraphQLInt},offset:{type:GraphQLInt}},
            resolve: userQuestions
        }
    })
})

const questionType=new GraphQLObjectType({
    name:'question',
    fields:{
        id:{type:GraphQLInt},
        user:{
            type:userType,
            resolve:User},
            // resolve:(parent,args)=>{
            //     const user_id=sqli(parent.user_id)
            //     return client.query(`SELECT id,first_name,last_name,email,profile_pic,points from users where id=${user_id}`).then((RES)=>(RES.rows[0]))
            // }},
        question:{type:GraphQLString},
        img:{type:GraphQLString},
        question_img:{type:GraphQLString},
        choices:{type:GraphQLList(GraphQLString)},
        answer:{type:GraphQLInt},
        time:{type:GraphQLString}
    }
})

const mutationType=new GraphQLObjectType({
    name:'mutationType',
    fields:{
        success:{type:GraphQLBoolean},
        err_msg:{type:GraphQLString},
        id:{type:GraphQLInt}
    }
})
module.exports={userType,questionType,mutationType}