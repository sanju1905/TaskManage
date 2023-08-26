const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const mySql=require("mysql2");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const con = mySql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

;
app.get('/',(req,res)=>
{
  
  res.render('home')
})
// Render the form
app.get('/task-form', (req, res) => {
  res.render('taskForm');
});

// Render the Update form
app.get('/update-form', (req, res) => {
    res.render('updateTask');
  });



// Display the Whole Data
app.get('/tasks', (req, res) => {
    const selectQuery = "SELECT * FROM registration";
    
    con.query(selectQuery, (err, tasks) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            res.status(500).send("Error fetching tasks");
        } else {
            res.render('tasks', { tasks }); // Pass the tasks data to the template
        }
    });
});

// Handle form submission
app.post('/add-task', (req, res) => {
    const { name, description, status } = req.body;

    const insertQuery = "INSERT INTO registration (task, description, status) VALUES (?, ?, ?)";
    const values = [name, description, status];

    con.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).send("Error inserting data");
        } else {
            console.log("Data inserted successfully");
            res.redirect('/tasks');
            //res.send("Data inserted successfully");
        }
    });
});
//delete the task
app.delete('/delete-task/:taskId', (req, res) => {
  const taskIdToDelete = req.params.taskId;

  const deleteQuery = "DELETE FROM registration WHERE task = ?";
  const values = [taskIdToDelete];

  con.query(deleteQuery, values, (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      res.status(500).send("Error deleting task");
    } else {
      console.log("Task deleted successfully");
      res.sendStatus(204); // Successful deletion, no content
    }
  });
});


//Update The Task
app.post('/update-task', (req, res) => {
  const { task, description, status } = req.body;

  const updateQuery = "UPDATE registration SET description = ?, status = ? WHERE task = ?";
  const values = [description, status, task];

  con.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      res.status(500).send("Error updating data");
    } else {
      if (result.affectedRows === 0) {
        console.log("Task not found");
        res.send("Task not found");
      } else {
        console.log("Data deleted successfully");
        //res.send("Data deleted successfully");
        res.redirect('/tasks');
      }
    }
  });
});

  



  




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
