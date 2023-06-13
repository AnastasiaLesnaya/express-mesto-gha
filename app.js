const express = require('express');
const mongoose = require('mongoose');
const { ERROR_NOT_FOUND } = require('./utils/response');

const { PORT = 3000, MONGODB = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect(MONGODB);
// mongoose.set('strictQuery', false);

app.use(express.json());

// временно захардкодили пользователя
app.use((req, res, next) => {
  req.user = { _id: '648785f2f2bcafc33555b75e' };
  
  next();
});
app.use('/cards', cardRouter);
app.use('/users', userRouter);
app.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});