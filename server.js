const express = require('express');
const {response} = require('express');
const app = express();
const database = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { json } = require('body-parser');
const port = 5811;

//connect database
let connection = database.createConnection({
    host:'localhost',
    user:"root",
    password:"",
    database:"People"
});
// check db connection
connection.connect(err=>{
    if(err){
        console.log(err);
    }
    else{
        console.log('database connected');
    }
})
app.set('view engine','ejs');
app.use(express.static("public"));
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/admin',(req,res)=>{
    if (req.cookies.email) {
        res.render('admin',{"status":200});
      } else {
        res.render('loginSignUp');
      }
    
})
app.get('/login',(req,res)=>{
    if (req.cookies.email) {
        if(req.query.company != ""){
            let code = 200;
            res.render('admin',{code});
        }
        else{
            let code = 429;
            res.render('admin',{code});    
        }
       
      } else {
        res.render('loginSignUp');
      }
});
app.post('/signup',(req,res)=>{
    console.log(req.body);
    let userData = req.body.UserData;
    console.log(userData.email);
    let enumData = userData.role == 'Admin'?'A':'U';
    let sql = `insert into UserTablePeople(Email,password,Type)values('${userData.email}','${userData.password}','${enumData}')`;
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            let oneDay = 24*60*60*1000;
                const expirationTime = new Date(Date.now() + oneDay);
                res.cookie("email", userData.email,{expires:expirationTime})
              res.send(200);
            console.log(result);
        }
        })
    })
    app.post('/login',(req,res)=>{
        console.log(req.body)
        let userData = req.body.UserData;
        let email =userData.email;
        let password = userData.password;
        console.log(userData);
        const sqlSearch = `SELECT * from UserTablePeople where Email= '${email}';`;
        const search_query = database.format(sqlSearch,[email]);
        connection.query(search_query,((err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(result)
                if(result.length == 0){
                   res.send(409);
                }
                else{
                    let id= result[0].id ;
                    let sql = `select AdminId from CompanyDetails where AdminId = ${id}`;
                    connection.query(sql,(err,result)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(result)
                            let oneDay = 24*60*60*1000;
                            const expirationTime = new Date(Date.now() + oneDay);
                            res.cookie("email",email,{expires:expirationTime})
                            console.log(email)
                            if(result == 0){
                               res.send(JSON.stringify({status:429,id:id}));
                            }
                            else{
                                res.send(JSON.stringify({status:200,id:id}));
                            }
                           }
                    });
                }
            }
        }))
    })

    app.post('/addCompanyDetail',(req,res)=>{
        console.log(req.body)
        let companyDetails= req.body.companyDetails;
       let sql = `insert into CompanyDetails(AdminId,CompanyName,industryType,phoneNo)values(${companyDetails.AdminId},'${companyDetails.companyName}','${companyDetails.industryDesc}','${companyDetails.phoneNo}')`;
       connection.query(sql,(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            res.send(200);
        }
       })
      
    })
app.post('/admin', urlencodedParser,(req,res)=>{
    console.log(req.body);
    // res.send(200)
    // res.redirect('/admin');
})
app.get('/organization',(req,res)=>{
    res.render('organization');
})
    app.get('/users',(req,res)=>{
        res.render('users');
    })
    app.get('/Home',(req,res)=>{
        res.render('Home');
    })
    app.get('/service',(req,res)=>{
        res.render('service');
    })

// listen port
app.listen(port,()=>{
    console.log(`server up on ${port}`)
})
