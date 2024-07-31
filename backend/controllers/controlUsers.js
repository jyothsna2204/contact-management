const { userModel } = require("../mongoConnection");
const jwt=require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        let exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(400).send("User already exists");
        }
        let newUser = new userModel({
            userName,
            email,
            password
        });
        await newUser.save();
        res.status(200).send("Registered successfully");
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};

const login = async (req, res) => {
    try{
        const {email,password}=req.body;
        let exist=await userModel.findOne({email});
        if(!exist){
            return res.status(400).send("user not found")
        }
        if(exist.password!==password){
            return res.status(400).send("invalid password");
        }
        let payload={
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload,"jwtSecret",{expiresIn:400000},
            (err,token)=>{
                if (err) throw err;
                return res.json({token})
            }
        )
    }
    catch{
        console.log(err);
        return res.status(500).send("Internal server error");
    }
};

const currentUser = async(req, res) => {
    try{
        let exist=await userModel.findById(req.user.id);
        if(!exist){
            return res.status(400).send("user not found");
        }
        res.json(exist);
    }
    catch(err){
        console.log(err);
        return res.status(500).send('Authenthication failed')
    }
};

module.exports = { register, login, currentUser };
