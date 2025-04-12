const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: Number },
  name: { type: String, required: true },
  email: { type: String, required: true },
  login: { type: String, required: true }
}, { toJSON: { virtuals: true } });

userSchema.virtual('id').get(function() {
  return this._id.toString();
});

userSchema.virtual('todos', {
  ref: 'Todo',
  localField: '_id',
  foreignField: 'userId'
});

const todoSchema = new mongoose.Schema({
  _id: { type: Number },
  title: { type: String, required: true },
  completed: { type: Boolean, required: true },
  userId: { type: Number, required: true, ref: 'User' }
}, { toJSON: { virtuals: true } });

todoSchema.virtual('id').get(function() {
  return this._id.toString();
});

todoSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);

module.exports = { User, Todo };