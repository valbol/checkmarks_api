const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
    getTournamentResults,
    saveTournamentResults,
    fetchSuccessPerQuestion,
    fetchUsersScores,
    fetchTournamentStatistics,
} = require('../../controllers/tournamentStatisticsController');

router.post(
    '/saveResults',
    [
        check('tournamentId', 'tournamentId is required').not().isEmpty(),
        check('startDate', 'start date is required').not().isEmpty(),
        check('endDateTime', 'end date is required').not().isEmpty(),
        check('results', 'results are required').not().isEmpty(),
    ],
    saveTournamentResults
);
router.get('/getResults/:tid', getTournamentResults);
router.get('/fetchSuccessPerQuestion/:tid', fetchSuccessPerQuestion);
router.get('/fetchUsersScores/:tid', fetchUsersScores);
router.get('/fetchTournamentStatistics/:tid', fetchTournamentStatistics);

module.exports = router;
