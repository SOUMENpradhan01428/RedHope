import { Router } from "express";
const userRouter=Router();
userRouter.get("/register",(req,res)=>{
    res.send("Hello World");
});
userRouter.get("/login",(req,res)=>{
    res.send("Hello World");
});
userRouter.get("/logout",(req,res)=>{
    res.send("Hello World");
});
userRouter.get("/profile",(req,res)=>{
    res.send("Hello World");
});
userRouter.get("/update-profile",(req,res)=>{
    res.send("Hello World");
});
userRouter.get("/delete-profile",(req,res)=>{
    res.send("Hello World");
});
export default userRouter;