const mySql=require('mysql2');


const con=mySql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"test"
})

con.connect(function(err)
{
    if(err) throw err;
    console.log("Connected");
})