let express = require("express");
let bodyParser = require("body-parser");
let fs = require("fs");
let app = express();
let jsonParser = bodyParser.json();

app.use(express.static(__dirname + "/public"));

app.get("/api/users", function(req, res){
    fs.readFile(__dirname +"/users.json", "utf8", (err, data) => {
        if (err) throw err;
        let users = JSON.parse(data)
        res.send(users)
});
});

app.put("/api/users",jsonParser,function(req, res){
    let id = req.body.id
    let name = req.body.name
    let age = req.body.age;
    fs.readFile(__dirname +"/users.json", "utf8", (err, data) => {
        if (err) throw err;
        let users = JSON.parse(data);
        users[id-1].name = name;
        users[id-1].age = age;
        writeUsers = JSON.stringify(users)
        fs.writeFile(__dirname +"/users.json", writeUsers, (err, data) => {
            if (err) throw err;
            res.send(req.body)
    });
});
});

app.post("/api/CreateUser",jsonParser, function(req, res){
    let users
    
    fs.readFile(__dirname +"/users.json", "utf8", (err, data) => {
        if (err) throw err;
        users = JSON.parse(data)
        let id = Math.max.apply(Math,users.map(function(o){return o.id;}))
        if(id==null || id==-Infinity)
        {id=0} 
        id++
        let newUser = {
            id:id,
            name:req.body.name,
            age:req.body.age
        }
        users.push(newUser)
        res.send(newUser)
        let writeUsers = JSON.stringify(users)
        fs.writeFile(__dirname +"/users.json", writeUsers, (err, data) => {
                if (err) throw err;
        });
        
    });
});

app.delete("/api/users/:id", function(req, res){   
    let id = req.params.id.split('-')[1]; 
    let users 
    fs.readFile(__dirname +"/users.json", "utf8", (err, data) => {
        if (err) throw err;
        users = JSON.parse(data)
        delUser = users.splice(id-1,1)
        for(let i=0;i<users.length;i++)
        {
            users[i].id=i+1;
        }
        writeUsers = JSON.stringify(users)
        fs.writeFile(__dirname +"/users.json", writeUsers, (err, data) => {
            if (err) throw err;
        });
        console.log(delUser);
        res.send(delUser)  
    });
})
app.get("/api/user/:id", function(req, res){
    let id = req.params.id;
    let user
    fs.readFile(__dirname +"/users.json", "utf8", (err, data) => {
        if (err) throw err;
        let users = JSON.parse(data)
        user = users[id-1]
        res.send(user)
        
    });
})

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});