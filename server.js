const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db")

dotenv.config({path: "./config.env"})

const app = express();

connectDB();

app.use(express.json({extended: false, limit: "50mb"}))
app.use(cors());

// Routes 
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users")
const recordRoutes = require("./routes/records");

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/records', recordRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server started on PORT ${PORT}`);
});
