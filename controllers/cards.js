const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;

const Card = require('../models/card');

const {
  ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_SERVER, SUCCESS_CREATED,
} = require('../utils/response');

// получаем карточки
const getCardList = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cardList) => res.send({ data: cardList }))
    .catch((error) => res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`));
};

// создаём новые карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardObject) => res.status(SUCCESS_CREATED).send({ data: cardObject }))
    .catch((error) => {
      if (error instanceof ValidationError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};

// ставим лайк карточе
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((selectedCard) => {
      if (selectedCard) {
        res.send({ data: selectedCard });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
    })
    .catch((error) => {
      if (error instanceof CastError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};

// убираем лайк карточки
const removeLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((selectedCard) => {
      if (selectedCard) {
        res.send({ data: selectedCard });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
    })
    .catch((error) => {
      if (error instanceof CastError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятии лайка' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};

// удаляем карточку
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((selectedCard) => {
      if (selectedCard) {
        res.send({ data: selectedCard });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      }
    })
    .catch((error) => {
      if (error instanceof CastError) {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(ERROR_SERVER).send(`На сервере произошла ошибка: ${error}`);
      }
    });
};

module.exports = {
  getCardList, createCard, likeCard, removeLikeCard, deleteCard,
};