const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose");
const Student = require("./models/Student")

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error", error);
    })

let students = [
    {
        id:1,
        name: "Juan dela cruz",
        course: "BSIT",
        age: 20
    }
]

app.get('/', (req,res) => {
    res.send("server is running")
});

app.get('/students', async (req,res) => {
    const students = await Student.find();
    res.json(students);
});

app.post('/students', async (req,res) => {
    try {
        const student = await Student.create({
            name: req.body.name,
            course: req.body.course,
            age: req.body.age
        });
        res.sendStatus(201).json(student);

    }catch(error) {
        console.error(`error at ${error}`)
        res.sendStatus(404);
    }

    
})

app.delete('/students/:id', async (req,res) => {
    try {
        const id = req.params.id;
        await Student.findByIdAndDelete(id);
        res.sendStatus(200);

    }catch(error) {
        console.error(error)
        res.sendStatus(404);
    }
})

app.put('/students/:id', async (req,res) => {
    try {
        const student = {
            name: req.body.name,
            course: req.body.course,
            age: req.body.age
        }
        const id = req.params.id;
        const doc = await Student.findById(id);
        console.log(doc);

        console.log(`payload name is ${student.name}`);

        doc.name = student.name;
        doc.course = student.course;
        doc.age = student.age

        console.log(`doc name changed is ${doc.name}`);

        await doc.save();
        
        console.log(`finished editing`)

        res.sendStatus(200)

    }catch(error) {
        console.error(error)
        res.sendStatus(404);
    }
})



app.listen(5000, () => {
    console.log("Server running at port 5000")
});




