const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs");

// custom error
const errorMiddleware = require("./middleware/error.middleware");

// router imports
const authRouter = require("./router/auth.router");
const categoryRouter = require("./router/category.router");
const carRouter = require("./router/car.router");

const app = express()
const PORT = process.env.PORT || 4001
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// YAML faylni yuklash
const swaggerDocument = YAML.load("./docs/swagger.yaml");

// Swagger UI endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// mongodb atlas
connectDB()

// image
app.use('/images', express.static('./upload/images')) 

// router
app.use(authRouter);
app.use(categoryRouter);
app.use(carRouter);

// custom error
app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log("Server is running at ", PORT);
})