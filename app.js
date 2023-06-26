const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, MONGODB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

// Защита сервера
const helmet = require('helmet');

// Роуты
const mainRouter = require('./routes/index');

const app = express();

const responseHandler = require('./middlewares/res-handler');

mongoose.connect(MONGODB);

app.use(express.json());
app.use(helmet());

app.use(mainRouter);

app.use(errors());
app.use(responseHandler);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});