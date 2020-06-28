const express=require('express');
require('./DB/mongoose');
const app=new express();
const expLayout=require('express-ejs-layouts');

//For Ejs
app.use(expLayout);
app.set('view engine','ejs');


const UserRouter=require('./router/UserRouter');

app.use(express.json());

app.use(UserRouter);

const port=process.env.PORT || 8080;

app.listen(port,() => console.log('server is up on port '+port));
