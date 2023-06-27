const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, MONGODB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

// Защита сервера
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Роуты
const mainRouter = require('./routes/index');

const app = express();

// https://www.npmjs.com/package/express-rate-limit 
// Для ограничения кол-ва запросов. Для защиты от DoS-атак.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const responseHandler = require('./middlewares/res-handler');

mongoose.connect(MONGODB);

app.use(express.json());
app.use(limiter);
app.use(helmet());

app.use(mainRouter);

app.use(errors());
app.use(responseHandler);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});