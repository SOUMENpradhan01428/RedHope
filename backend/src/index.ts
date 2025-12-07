import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes";
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello World");
});
app.use("/api/v1/user",userRouter);
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
