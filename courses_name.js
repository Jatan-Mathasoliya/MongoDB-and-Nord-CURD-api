const e = require("express")
const express = require("express")
const { MongoClient } = require("mongodb")

const app = express()
const port = 3000
const url = "mongodb://localhost:27017"
const dbName = "CodingGita"

app.use(express.json());

let db,courses;

async function main(){
    try{
        const client = await MongoClient.connect(url, {useUnifiedTopology:true})
        console.log("MongoDB Connected")
    
        db = client.db(dbName)
        courses = db.collection("courses")
    
        app.listen(port, ()=>{
            console.log(`Server is running on port ${port}`)
        })
    }catch(err){
        console.error(err)
    }
}
main()

app.get('/courses', async(req, res)=>{
    try{
        const result = await courses.find().toArray()
        res.status(200).json(result)
    }catch(err){
        res.status(400).send("Eror", err)
    }
})

app.post('/courses', async(req, res)=>{
    try{
        const course = req.body;
        const result = await courses.insertOne(course);
        res.status(201).json("Course Added...");
    }catch(err){
        res.send("Error",err)
    }
})

app.put('/courses/:courseName', async(req, res)=>{
    try{
        const name = req.params.courseName;
        const update = req.body;
        const result = await courses.replaceOne({"courseName":name},update)
        res.status(201).send("Updated....")
    }catch(err){
        res.status(400).send("Error",err)
    }
})

app.patch('/courses/:name', async(req, res)=>{
    try{
        const name = req.params.name;
        const update = req.body;
        const result = await courses.updateOne({"courseName":name},{$set:update})
        res.status(201).send("Updated...")
    }catch(err){
        res.status(400).send("Error",err)   
    }
})

app.delete('/courses/:name', async(req, res)=>{
    try{
        const name = req.params.name
        const result = courses.deleteOne({"courseName":name})
        res.status(201).send("Course deleted")
    }catch(err){
        res.status(400).send("Error",err)
    }
})