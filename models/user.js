const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Unauthorized = require('../utils/errors/Unauthorized');

// создаём схему пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Имя',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'О себе',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    minlength: 4,
    validate: {
      validator: (correct) => validator.isURL(correct),
      message: 'Не удалось загрузить аватар',
    },
  },
  email: {
    type: String,
    minlength: 4,
    maxlength: 50,
    validate: {
      validator: (correct) => validator.isEmail(correct),
      message: 'Неверный формат почты',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((selectedUser) => {
      if (!selectedUser) { return Promise.reject(new Unauthorized('Неверное имя пользователя и/или пароль')); }
      return bcrypt.compare(password, selectedUser.password).then((correct) => {
        if (!correct) { return Promise.reject(new Unauthorized('Неверное имя пользователя и/или пароль')); }
        return selectedUser;
      });
    });
};

module.exports = mongoose.model('user', userSchema);