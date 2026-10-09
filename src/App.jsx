import './App.css'
import axios from 'axios';
import { useEffect, useState } from "react";
//jethrojosephdida_db_user & IASQ5n1wL16eElCb
//mongodb+srv://<db_username>:IASQ5n1wL16eElCb@cluster0.jyy8rha.mongodb.net/?appName=Cluster0

function App() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState({})

  function handleChange(setter) {
    return function (e) {
      setter(e.target.value);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (editing) {
      handleUpdate(editingStudent._id);
      return;
    }


    try {
      const response = await axios.post("https://practical-web-crud-3oa3.vercel.app/students", {
        name,
        course,
        age: Number(age)
      });

      setStudents((prev) => [...prev, response.data]);
      setName("");
      setCourse("");
      setAge("");
    } catch (error) {
      console.error(`error found at ${error}`)
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`https://practical-web-crud-3oa3.vercel.app//${id}`);
      console.log("delete finished")
      setStudents((prev) => prev.filter((student) => student._id !== id));
    } catch (error) {
      console.error(`error found at ${error}`)
    }
  }

  function setEdit(id) {
    setEditing(true);
    const editStudent = students.filter((student) => student._id === id);

    setName(editStudent[0].name);
    setCourse(editStudent[0].course);
    setAge(editStudent[0].age);
    setEditingStudent(editStudent[0]);
    console.log(editingStudent);
  }
  async function handleUpdate(id) {
    try {
      await axios.put(`https://practical-web-crud-3oa3.vercel.app/${id}`, {
        name,
        course,
        age: Number(age)
      })
      console.log(`edit finished`);
      console.log(editingStudent);

      setEditing(false);
      setName("");
      setCourse("");
      setAge("");
      setStudents((prev) => prev.map((student) => student._id === id ?
        { ...student, name, course, age: Number(age) } :
        student))

    } catch (error) {
      console.error(`error found at ${error}`)
    }
  }


  useEffect(() => {

    axios
      .get("https://practical-web-crud-3oa3.vercel.app/")
      .then((response) => {
        console.log(response.data)
        setStudents(response.data)
      });
  }, []);

  return (
    <div>
      <h1>
        Student Management System
      </h1>
      <form onSubmit={handleSubmit}>
        <h2>Add student</h2>
        <input type="text" placeholder='name' value={name} onChange={handleChange(setName)} />

        <br />

        <input type="text" placeholder='course' value={course} onChange={handleChange(setCourse)} />
        <br />
        <input type="text" placeholder='age' value={age} onChange={handleChange(setAge)} />
        <br />
        <button type="submit">Add student</button>
      </form>


      <h2>Students</h2>
      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
          <button onClick={() => setEdit(student._id)}>Edit</button>
          <button onClick={() => handleDelete(student._id)}>Delete</button>

        </div>
      ))}


    </div>
  )
}

export default App
