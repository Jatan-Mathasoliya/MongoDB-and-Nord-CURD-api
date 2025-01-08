const e = require('express');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express()
const port = 3000
const url = "mongodb://127.0.0.1:27017"
const dbName = "CodingGita";

app.use(express.json())

let db, courses;

async function dbConnection() {
    try{
        const client = await MongoClient.connect(url,{useUnifiedTopology:true});
        console.log("MongoDB Connected")

        db = client.db(dbName)
        courses = db.collection("courses");

        app.listen(port, ()=>{
            console.log(`Server is running on port ${port}`)
        })
    }catch(err){
        console.error(err)
        process.exit(1);
    }
}
dbConnection()


app.get('/courses', async(req, res)=>{
    try{
        const coursesData = await courses.find().toArray()
        res.status(200).json(coursesData);
    }catch(err){
        res.status(400).send("Error Occured : " , err)
    }
})

app.post('/courses', async(req, res)=>{
    try{
        const course = req.body;
        const result = await courses.insertOne(course);
        res.status(201).json("Course Added...");
    }catch(err){
        res.send(400).send("Error",err)
    }
})

app.put('/courses/:id', async(req, res)=>{
    try{
        const id = req.params.id
        const update = req.body;
        const result = await courses.replaceOne({_id:new ObjectId(id)},update)
        res.status(200).json("Course Updated");
    }catch(err){
        res.status(400).send("Error Occuredd", err)
    }
})

app.patch('/courses/:id',async(req, res)=>{
    try{
        const id = req.params.id
        const update = req.body;
        const result = await courses.updateOne({_id: new ObjectId(id)}, {$set:update})
        res.status(200).json("Course Updated");
    }catch(err){
        res.status(400),send("Error", err)
    }
})

app.delete('/courses/:id', async(req, res)=>{
    try{
        const id = req.params.id
        const result = await courses.deleteOne({_id:new ObjectId(id)})
        res.status(200).send("User Deleted")
    }catch(err){
        res.status(400).send("Error", err)
    }
})