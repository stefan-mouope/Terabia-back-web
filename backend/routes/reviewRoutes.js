const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.createReview);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.get('/', reviewController.getAllReviews);
router.get('/reviewee/:reviewee_id', reviewController.getReviewsByRevieweeId);

module.exports = router;
