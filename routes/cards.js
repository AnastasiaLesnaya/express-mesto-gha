const cardRouter = require('express').Router();

// переменные действий с карточками
// (получить, создать, поставить лайк, убрать лайк, удалить карточку)
const {
  getCardList, createCard, likeCard, removeLikeCard, deleteCard,
} = require('../controllers/cards');

cardRouter.get('/', getCardList);
cardRouter.post('/', createCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', removeLikeCard);
cardRouter.delete('/:cardId', deleteCard);

module.exports = cardRouter;