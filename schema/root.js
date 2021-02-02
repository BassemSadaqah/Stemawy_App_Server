const GraphQL=require('graphql')
const {userType,questionType} =require('./types')
const User=require('../resolvers/User')
const Question=require('../resolvers/Question')
const Leaderboard=require('../resolvers/Leaderboard')
const userQuestions=require('../resolvers/userQuestions')
const FeedQuestions = require('../resolvers/FeedQuestions')
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
}=GraphQL

const RootQuery=new GraphQLObjectType({
    name:'Root',
    fields:{
        user:{
            type:userType,
            args:{id:{type:GraphQLInt}},
            resolve:User
        },
        question:{
            type:questionType,
            args:{id:{type:GraphQLInt}},
            resolve:Question
        },
        leaderboard:{
            type:new GraphQLList(userType),
            args:{count:{type:GraphQLInt}},
            resolve:Leaderboard
        },
        feedQuestions:{
            type:new GraphQLList(questionType),
            args:{limit:{type:GraphQLInt}},
            resolve:FeedQuestions
        }
    }
})
module.exports=RootQuery