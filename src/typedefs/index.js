export const typeDefs = `#graphql
        type User {
             username:String
             email:String
             password: String
             token: String
        }

        input LoginInput {
                email: String
                password: String
        }
        input RegisterInput {
                username: String
                email: String
                password: String

        }

        type Query {
                getAllusers:[User!]
                getUserByEmail(email:String!): User
        }

        type Mutation {
                registerUser(registerInput:RegisterInput!) : User!
                loginUser(loginInput:LoginInput!) : User!
        }







`