const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;

const { ERROR_NOT_FOUND } = require('./utils/response');

const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const mestodb = 'mongodb://127.0.0.1:27017/mestodb';
mongoose.set('strictQuery', false);
mongoose.connect(mestodb);

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
  console.log(`Сервер — http://${BASE_PATH}:${PORT}`);
});