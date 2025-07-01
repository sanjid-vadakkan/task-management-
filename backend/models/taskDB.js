// models/taskDB.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  color: { type: String, default: '#22c55e' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  repeat: {
    enabled: { type: Boolean, default: false }, 
    type: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
    days: { type: [String], default: [] },
  },
  tags: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);



