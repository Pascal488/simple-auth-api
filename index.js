import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"
import {connect} from "mongoose"
import { resolvers} from "./src/resolvers/index.js"
import {  typeDefs } from "./src/typedefs/index.js"

const server = new ApolloServer({
        resolvers,
        typeDefs
})
try {
        await connect('MOGDBURIHERE', { 
                useNewUrlParser: true,
                useUnifiedTopology: true,
        }
        )
        console.log("Connected to MONGODB SUCESS")

} catch (error) {
        console.log(error)
}


const { url } = await startStandaloneServer(server, {
        listen: {port:8000}
})

console.log(`Server started at ${url}`)