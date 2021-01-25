const GraphQL=require('graphql')
const {userType,questionType} =require('./types')
const Question=require('../resolvers/Question')
const userQuestions=require('../resolvers/userQuestions')
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
}=GraphQL

const RootQuery=new GraphQLObjectType({
    name:'Root',
    fields:{
        user:{
            type:userType,
            args:{id:{type:GraphQLInt}},
            resolve(parent,args,req){
                return {id:args.id,name:'Bassem'}
            }
        },
        question:{
            type:questionType,
            args:{id:{type:GraphQLInt}},
            resolve:Question
        },
        userQuestions:{
            type:new GraphQLList(questionType),
            args:{user_id:{type:GraphQLInt},limit:{type:GraphQLInt}},
            resolve:userQuestions
        }
    }
})
module.exports=RootQuery