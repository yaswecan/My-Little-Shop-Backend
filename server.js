//Packages
require("dotenv/config");
const mongoose = require("mongoose");
const { graphqlUploadExpress } = require("graphql-upload");

//App & ApolloServer
const app = require("./app");
const apolloServer = require("./apollo");

async function startServer() {
    app.use(graphqlUploadExpress())
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/ebuy' });
    app.use("/", (req, res) => {
        res.send("Welcome to ebuy platform")
    })
}
//StartServer
startServer();
mongoose.connect(process.env.MONGODB_LOCAL_URL)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log("MognoDB Connetion Failed!"));
//Server Creations
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
    console.log(`GraphQl EndPoint path: /ebuy`);
})