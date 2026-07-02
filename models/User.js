const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false // do not return password field by default when querying users
  }
});

// hash password before saving user document
userSchema.pre('save', async function() {
  // run if password is modified or new user is created
  if (!this.isModified('password')) return;

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
});

//  compare candidate password with hashed password in DB
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);