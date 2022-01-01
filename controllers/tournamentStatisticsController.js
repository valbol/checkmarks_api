const { validationResult } = require('express-validator');

const {
    getTournamentId,
    getAmountCorrectQuestions,
    getTournamentData,
    checkIfExist,
    createStats,
    countCorrectQuestions,
} = require('../utils/utils');

const Tournament = require('../models/tournament');

const usersScores = async (req, res) => {
    let userScore;

    const tournamentId = getTournamentId(req, res);
    const tournament = await getTournamentData(tournamentId);
    userScore = getAmountCorrectQuestions(tournament);

    return userScore;
};

const successPerQuestion = async (req) => {
    let tournament;
    let successPerQuestion;

    const tournamentId = getTournamentId(req);
    tournament = await getTournamentData(tournamentId);
    successPerQuestion = countCorrectQuestions(tournament);

    return successPerQuestion;
};

const saveTournamentResults = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { tournamentId, startDate, endDateTime, results } = req.body;
    let createTournament;
    let createResults;
    //Check if already exists
    try {
        await checkIfExist(tournamentId);
        createResults = results.map((result) => createStats(result));
        createTournament = new Tournament({
            tournamentId,
            startDate,
            endDateTime,
            results: createResults,
        });
        await createTournament.save();
    } catch (err) {
        console.error(
            `${JSON.stringify(err.name)}: ${JSON.stringify(err.message)}`
        );
        return res.status(500).json({ error: [{ msg: 'Server error' }] });
    }
    res.status(201).json({ result: createTournament });
};

const getTournamentResults = async (req, res) => {
    const tournamentId = getTournamentId(req);
    const tournamentResults = await getTournamentData(tournamentId);
    res.status(200).json({ result: tournamentResults });
};

const fetchSuccessPerQuestion = async (req, res) => {
    let successPerQuestionResult;
    try {
        successPerQuestionResult = await successPerQuestion(req);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: [{ msg: 'Server error' }] });
    }
    res.status(200).json(successPerQuestionResult);
};

const fetchUsersScores = async (req, res) => {
    let userScoreResult;

    try {
        userScoreResult = await usersScores(req, res);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: [{ msg: 'Server error' }] });
    }
    res.status(200).json(userScoreResult);
};


const fetchTournamentStatistics = async (req, res) => {
    let userScoreResult;
    let successPerQuestionResult;

    try {
        userScoreResult = await usersScores(req, res);
        successPerQuestionResult = await successPerQuestion(req);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: [{ msg: 'Server error' }] });
    }
    const fullScore = {
        users: userScoreResult,
        perQuestion: successPerQuestionResult,
    };
    console.log(fullScore);
    res.status(200).json(fullScore);
};

exports.saveTournamentResults = saveTournamentResults;
exports.getTournamentResults = getTournamentResults;
exports.fetchSuccessPerQuestion = fetchSuccessPerQuestion;
exports.fetchUsersScores = fetchUsersScores;
exports.fetchTournamentStatistics = fetchTournamentStatistics;
