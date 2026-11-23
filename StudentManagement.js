
const express = require("express");
const app = express();

app.use(express.json());


let students = [
    {
        id: 201,
        rollNumber: "CSE2401",
        name: "Aarav Sharma",
        branch: "CSE",
        semester: 3,
        email: "aarav@example.com"
    },
    {
        id: 202,
        rollNumber: "ECE2402",
        name: "Diya Verma",
        branch: "ECE",
        semester: 3,
        email: "diya@example.com"
    },
    {
        id: 203,
        rollNumber: "CSE2403",
        name: "Kabir Singh",
        branch: "CSE",
        semester: 3,
        email: "kabir@example.com"
    }
];


function validStudent(data) {
    return data &&
        typeof data.rollNumber === "string" &&
        data.rollNumber.trim() !== "" &&
        typeof data.name === "string" &&
        data.name.trim() !== "" &&
        typeof data.branch === "string" &&
        data.branch.trim() !== "" &&
        Number.isInteger(data.semester) &&
        data.semester > 0 &&
        typeof data.email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
}


app.get("/api/students", (req, res) => {
    res.status(200).json(students);
});


app.post("/api/students", (req, res) => {
    if (!validStudent(req.body)) {
        return res.status(400).json({
            message: "Invalid student details"
        });
    }

    const newStudent = {
        id: Math.max(...students.map(s => s.id), 200) + 1,
        ...req.body
    };

    students.push(newStudent);

    res.status(201).json(newStudent);
});


app.get("/api/students/filter", (req, res) => {
    const branch = req.query.branch;

    if (!branch) {
        return res.status(400).json({
            message: "Please provide a branch"
        });
    }

    const result = students.filter(student =>
        student.branch.toLowerCase() === branch.toLowerCase()
    );

    res.status(200).json(result);
});


app.get("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});


app.put("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    if (!validStudent(req.body)) {
        return res.status(400).json({
            message: "Invalid student details"
        });
    }

    students[index] = {
        id: id,
        ...req.body
    };

    res.status(200).json(students[index]);
});


app.delete("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully"
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
