import { GraphQLError } from 'graphql';
import { User } from "../modules/User.js"
import bcrypt from "bcrypt"
import  Jwt from 'jsonwebtoken';

export const resolvers = {

        Query: {
                async getAllusers(_,args,context) {
                        const users = User.find({}).select("-password")
                        if (!users && users?.length < 1) {
                                throw new GraphQLError('No user found');
                        
                        }
                        return users
                },
                async getUserByEmail(_, {email}, context) {
                        const user = await User.findOne({ email }).select("-password")
                        if (!user ) {
                                throw new GraphQLError("User not found")
                        } else if (!user.email) {
                                throw new GraphQLError("User id must be provided")

                        } else {
                                return {
                                        id: user._id,
                                        ...user._doc
                                }
                        }

                        
                }

        },
        Mutation: {
                async registerUser(_, { registerInput: { username, email, password } }) {
                        const existUser = await User.findOne({ email })
                        if (existUser) {
                                throw new GraphQLError(`User with this ${email} email is already exist`)
                        } if (!username || !email || !password) {
                                throw new GraphQLError("Please fill all the values required")

                        }else {
                                const hashedPassword = await bcrypt.hash(password,10)
                                const user = new User({
                                        username:username,
                                        email: email,
                                        password:hashedPassword
                                })
                                const token = Jwt.sign({
                                        user_id: user._id,
                                        email,
                                },
                                        "SECRET",
                                        {
                                                expiresIn:"2h"
                                        }
                                )
                                user.token = token
                                
                                const res = await user.save()

                                return {
                                        id: res.id,
                                        ...res._doc
                                }
                        }

                },
                async loginUser(_, {loginInput:{email,password}}) {
                        const user = await User.findOne({ email })
                        if (user && (await user.comparePassword(password))) {
                                const token = Jwt.sign({
                                        user_id: user._id,
                                        email
                                },
                                          "SECRET",
                                        {
                                                expiresIn: "2h"
                                        }
                                
                                )
                                user.token = token

                                return {
                                        id: user._id,
                                        ...user._doc
                                }
                        } else {
                                throw new GraphQLError('Invalid email or password')
                        }
                }
        }
       
}