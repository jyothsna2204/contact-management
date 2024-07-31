const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.port||5000;


const { getall, getcontact, postcontact, putcontact, deletecontact } = require('./controllers/controlContact');
const {register,login,currentUser}=require('./controllers/controlUsers');
const errorHandler = require('./middlewares/errorhadler');
const { connectDB } = require('./mongoConnection');
const authenicated=require('./middlewares/Authenication');



app.use(express.json());


app.post('/users/register',register);
app.post('/users/login',login);
app.get('/users/currentUser',authenicated,currentUser);

app.use(authenicated);

app.get('/contacts',getall);
app.get('/contacts/:id',getcontact);
app.post('/contacts',postcontact);
app.put('/contacts/:id',putcontact);
app.delete('/contacts/:id',deletecontact);



//Catch-all route for handling 404 errors
app.use((req, res, next) => {
    const error = new Error("Not Found");
    res.status(404);
    next(error);
});
app.use(errorHandler);




connectDB().then(()=>{
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });    
})
