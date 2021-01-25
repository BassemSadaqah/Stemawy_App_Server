const GraphQL=require('graphql')
const GetQuestion=require('../resolvers/Question')
const AddQuestion=require('../resolvers/AddQuestion')
const RootQuery=require('./root')
const mutation=require('./mutation')
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
}=GraphQL




module.exports=new GraphQLSchema({query:RootQuery,mutation})