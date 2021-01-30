const GraphQL=require('graphql')
const AddQuestion = require('../resolvers/AddQuestion')
const EditUser = require('../resolvers/EditUser')
const {userType,questionType,mutationType} =require('./types')

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
}=GraphQL

const mutation=new GraphQLObjectType({
    name:'Mutation',
    fields:{
        AddQuestion:{
            type:mutationType,
            args:{
                question:{type:GraphQLString},
                img:{type:GraphQLString},
                choices:{type:new GraphQLList(GraphQLString)},
                answer:{type:GraphQLInt}
            },
            resolve:AddQuestion
        },
        editUser:{
            type:mutationType,
            args:{
                first_name:{type:GraphQLString},
                last_name:{type:GraphQLString},
                email:{type:GraphQLString},
                bio:{type:GraphQLString},
            },
            resolve:EditUser
        }
    }})
module.exports=mutation