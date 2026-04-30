const express = require('express');
const router  = express.Router();

const {
  submitFeedback, getUserFeedback, getMyFeedback, deleteFeedback,
} = require('../controllers/feedbackController');

const { protect }   = require('../middlewares/auth');
const { feedbackRules, validate } = require('../middlewares/validators');

router.post('/',             protect, feedbackRules, validate, submitFeedback);
router.get('/user/:userId',  getUserFeedback);        // public
router.get('/my',            protect, getMyFeedback);
router.delete('/:id',        protect, deleteFeedback);

module.exports = router;
