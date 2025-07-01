var express = require('express');
var router = express.Router();
const authentication = require('../middilwear/authentication');
const TaskHelper = require('../helpers/taskHelper');
const Task = require('../models/taskDB');


/* GET home page. */


router.post('/add-task', authentication, function(req, res, next) {

    TaskHelper.addTask(req.body, req.user.id)
        .then(task => {
            console.log('datas:', req.body);
            console.log('id:', req.user.id);
            res.status(201).json({ message: "Task received", task });
        })
        .catch(err => {
            console.error('Error adding task:', err);
            res.status(500).json({ message: "Error adding task", error: err });
        });
});
router.get('/get-all-tasks', authentication, function(req, res, next) {
    TaskHelper.getAllTasks(req.user.id)
        .then(tasks => {
            console.log(tasks);
            
            res.status(200).json({ message: "Tasks retrieved", tasks });
        })
        .catch(err => {
            console.error('Error retrieving tasks:', err);
            res.status(500).json({ message: "Error retrieving tasks", error: err });
        });
});

router.get('/get-task/:id', authentication, function(req, res, next) {  
   console.log(req.params.id);
   
    const taskId = req.params.id;
    TaskHelper.getTasks(taskId)
        .then(task => {
          
            if (task) {
                console.log('Task found:', task);

                res.status(200).json({ message: "Task retrieved", task });
            } else {
                res.status(404).json({ message: "Task not found" });
            }
        })
        .catch(err => {
            console.error('Error retrieving task:', err);
            res.status(500).json({ message: "Error retrieving task", error: err });
        });
});
router.put('/edit-task', authentication, function(req, res, next) {
   TaskHelper.editTask(req.body)
        .then(task => {
           
            
            if (task) {
                console.log('Task updated:', task);
                res.status(200).json({ message: "Task updated", task });
            } else {
                res.status(404).json({ message: "Task not found" });
            }
        })
        .catch(err => {
            console.error('Error updating task:', err);
            res.status(500).json({ message: "Error updating task", error: err });
        });
});

router.delete('/delete-task/:id', authentication, function(req, res, next) {
    console.log('hi');
    const taskId = req.params.id;
    TaskHelper.deleteTask(taskId)
        .then(result => {
            if (result) {
                console.log('Task deleted:', taskId);
                res.status(200).json({ message: "Task deleted" });
            } else {
                res.status(404).json({ message: "Task not found" });
            }
        })
        .catch(err => {
            console.error('Error deleting task:', err);
            res.status(500).json({ message: "Error deleting task", error: err });
        });
});





module.exports = router;
