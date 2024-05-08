const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "********",
    database: "page"
})
db.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log("Connected To Database!");
    }
})


const app = express();
app.use(express.urlencoded());


app.get('/',(req,res) => {
    res.sendFile('./views/home.html', {root: __dirname});
})

app.get('/signup',(req,res) => {
    res.sendFile('./views/signup.html', {root: __dirname});
})

app.post('/signup', async (req,res) => {
    const {username,password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (username,password) VALUES (?,?)', [username,hashedPassword] ,(err,result) => {
            if (err) {
                console.log('error',err);
            } else {
                res.sendFile("./views/created.html",{root:__dirname});
            };
        })
    }
    catch (error) {
        console.error('Error:',error);
        res.status(500).send('ErrorSignup')
    }
})
app.get('/login',(req,res) => {
    res.sendFile('./views/login.html', {root: __dirname});
})
app.post('/login',async (req,res) => {
    const {username,password} =req.body;
    try {
        db.query('SELECT * FROM users WHERE username = ?',[username],async(error,result) => {
            if (error) {
                console.error('Error:', error);
                res.status(500).send('Error Logining in!')
            } else {
               if (result.length > 0) {
                const match = await bcrypt.compare(password,result[0].password);
                if (match) {
                    res.sendFile("./views/welcome.html",{root:__dirname});
                } else {
                    res.status(401).send("Invaild Password");
                };
               };
            };
        })}
    catch(err){
        console.error('Error',error);
        res.status(500).send('error loggin in!')
    }
});

app.get('/logout',(req, res) => {
    res.redirect('/login');
})
app.get('/created',(req, res) => {
    res.redirect('/login');
})

app.listen(5000, () => {
    console.log("app listening on 5000");
}) 
