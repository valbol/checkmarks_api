const { validationResult } = require('express-validator');
const Tournament = require('../models/tournament');
const UserStats = require('../models/userStats');

const TOTAL_QUESTIONS = 10;

const getTournamentId = (req, res) => {
    console.log(`id= ${req.params.tid}`);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return parseInt(req.params.tid);
};

const getTournamentData = async (tournamentId) => {
    let tournament;
    try {
        tournament = await Tournament.findOne({ tournamentId }).populate({
            path: 'results',
            select: '-_id -__v',
        });
    } catch (err) {
        console.error(err.message);
        throw new Error(err.message);
    }
    return tournament;
};

const flatNestedData = (tournament) => {
    const mainData = [];
    let totalUSersInTournament = 0;
    try {
        for (let user of tournament?.results) {
            totalUSersInTournament++;
            for (let correctQ of user?.correctQuestions) {
                try {
                    mainData.push(correctQ);
                } catch (err) {
                    throw new Error(err.message);
                }
            }
        }
    } catch (err) {
        throw err;
    }
    return [mainData, totalUSersInTournament];
};
//! exported only for testing 
exports.flatNestedData = flatNestedData; 
const countCorrectQuestions = (tournament) => {
    const successPerQuestion = {};
    [mainData, scoreAmount] = flatNestedData(tournament);
    mainData.forEach((x) => {
        successPerQuestion[x] = (successPerQuestion[x] || 0) + 1;
    });
    for (const question in successPerQuestion) {
        successPerQuestion[question] = `${
            (successPerQuestion[question] / scoreAmount) * 100
        }%`;
    }
    return successPerQuestion;
};

const calculateScore = (userPercent) => {
    switch (true) {
        case userPercent > 0.9:
            return 'A';
        case userPercent > 0.75 && userPercent <= 0.9:
            return 'B';
        case userPercent >= 0.6 && userPercent <= 0.75:
            return 'C';
        case userPercent < 0.6:
            return 'D';
    }
};

const checkIfExist = async (tournamentId) => {
    let tournament = await Tournament.findOne({ tournamentId });
    if (tournament) {
        throw new Error('Tournament ID already exist');
    }
};

const getAmountCorrectQuestions = (tournament) => {
    const userScore = {};
    try {
        for (let user of tournament?.results) {
            const userId = user?.userId;
            const correct = user?.correctQuestions;
            userScore[userId] = calculateScore(
                Object.keys(correct).length / TOTAL_QUESTIONS
            );
        }
    } catch (err) {
        throw err;
    }
    return userScore;
};

const createStats = (result) => {
    const { userId, correctQuestions, incorrectQuestions } = result;
    try {
        let userStats = new UserStats({
            userId,
            correctQuestions,
            incorrectQuestions,
        });
        userStats.save();
        return userStats;
    } catch (err) {
        console.error(err.message);
        throw new Error({ error: [{ msg: 'Server error' }] });
    }
};

exports.createStats = createStats;
exports.getTournamentId = getTournamentId;
exports.getTournamentData = getTournamentData;
exports.calculateScore = calculateScore;
exports.getAmountCorrectQuestions = getAmountCorrectQuestions;
exports.checkIfExist = checkIfExist;
exports.countCorrectQuestions = countCorrectQuestions;
