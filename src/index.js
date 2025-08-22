const{response}= require('express');
const express=require('express');

const app=express();

app.get("/inicio",(request,response) =>{
    return response.send("inicio");
});
app.get("/fim",(request,response) =>{
    return response.send("fim");
});

app.listen(3000);
