const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('../models/taskDB');


module.exports = {
  addTask: (taskData, userId) => {
    return new Promise(async (resolve, reject) => {
      
       
        try {
         const { title, status, description, color, repeat, tags } = taskData;
          const newTask = new Task({
            userId: userId,
            title,
            status,
            description,
            color,
            repeat,
            tags,
            // Assuming req.user.id is the authenticated user's ID
          });

          const savedTask = await newTask.save();
          resolve(savedTask);
        } catch (error) {
          console.error("Error saving task:", error);
          reject(new Error("Failed to save task. Please try again."));
        }           
    });
  },
  getAllTasks: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const tasks = await Task.find({ userId: userId })
          .populate('userId', 'name email') // Populate user details if needed
        resolve(tasks);
      } catch (error) {
        console.error("Error retrieving tasks:", error);
        reject(new Error("Failed to retrieve tasks. Please try again."));
      }
    });
  },
  getTasks: (taskId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const task = await Task.find({ _id: taskId })
           // Populate user details if needed      
        resolve(task);
      } catch (error) {
        console.error("Error retrieving tasks:", error);
        reject(new Error("Failed to retrieve tasks. Please try again."));
      }
    });
  },  
  editTask: (taskData) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { id, title, status, description, color, repeat, tags } = taskData;
        console.log(taskData);
        
        const updatedTask = await Task.findByIdAndUpdate(
          id,
          { title, status, description, color, repeat, tags },
          { new: true }
        );
        if (updatedTask) {
          resolve(updatedTask);
        } else {
          reject(new Error("Task not found"));
        }
      } catch (error) {
        console.error("Error updating task:", error);
        reject(new Error("Failed to update task. Please try again."));
      }
    });
  },
  deleteTask: (id) => {
    return new Promise(async (resolve, reject) => {
      
      
      try {
        const deletedTask = await Task.deleteOne({ _id: id });
        // Log the deleted task for debugging
        console.log(deletedTask);
        
        if (deletedTask) {
          resolve(deletedTask);
        } else {
          reject(new Error("Task not found"));
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        reject(new Error("Failed to delete task. Please try again."));
      }
    });
  }




}
