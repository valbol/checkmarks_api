const assert = require('chai').assert;
const {
    calculateScore,
    getAmountCorrectQuestions,
    countCorrectQuestions,
    flatNestedData,
} = require('../utils/utils');

const TEST_DATA = {
    tournamentId: 57,
    startDate: '2022-05-03T09:35:35+00:00',
    endDateTime: '2022-05-03T12:35:35+00:00',
    results: [
        {
            userId: 62,
            correctQuestions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            incorrectQuestions: [],
        },
        {
            userId: 12,
            correctQuestions: [1, 2, 3, 4, 5, 6],
            incorrectQuestions: [7, 8, 9, 10],
        },
        {
            userId: 13,
            correctQuestions: [1, 2, 3, 4, 5, 6, 8, 10],
            incorrectQuestions: [7, 9],
        },
        {
            userId: 22,
            correctQuestions: [1],
            incorrectQuestions: [2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        {
            userId: 1,
            correctQuestions: [3, 6, 10],
            incorrectQuestions: [2, 4, 5, 7, 8, 9],
        },
    ],
};

describe('Utils tests', () => {
    describe('calculateScore()', () => {
        it('calculateScore should calculate user score (A,B,C,D)', () => {
            assert.equal(calculateScore(1), 'A');
            assert.equal(calculateScore(0.85), 'B');
            assert.equal(calculateScore(0.75), 'C');
            assert.equal(calculateScore(0.55), 'D');
        });
        it('calculateScore should return String', () => {
            assert.typeOf(calculateScore(0.5), 'string');
        });
    });
    describe('getAmountCorrectQuestions()', () => {
        it('getAmountCorrectQuestions should return score per user', () => {
            const expectedResult = {
                1: 'D',
                12: 'C',
                13: 'B',
                22: 'D',
                62: 'A',
            };
            assert.deepEqual(
                getAmountCorrectQuestions(TEST_DATA),
                expectedResult
            );
        });
        it('getAmountCorrectQuestions should return object ', () => {
            assert.typeOf(getAmountCorrectQuestions(TEST_DATA), 'Object');
        });
    });
    describe('countCorrectQuestions()', () => {
        it('countCorrectQuestions should calculate % of correct questions', () => {
            const expectedResult = {
                1: '80%',
                2: '60%',
                3: '80%',
                4: '60%',
                5: '60%',
                6: '80%',
                7: '20%',
                8: '40%',
                9: '20%',
                10: '60%',
            };
            assert.deepEqual(countCorrectQuestions(TEST_DATA), expectedResult);
        });
        it('countCorrectQuestions should return object ', () => {
            assert.typeOf(countCorrectQuestions(TEST_DATA), 'Object');
        });
    });
    describe('flatNestedData()', () => {
        it('flatNestedData should return flat array and count how many users attended', () => {
            const expectedResult = [
                [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4,
                    5, 6, 8, 10, 1, 3, 6, 10,
                ],
                5,
            ];
            assert.deepEqual(flatNestedData(TEST_DATA), expectedResult);
        });
        it('flatNestedData should return array ', () => {
            assert.typeOf(flatNestedData(TEST_DATA), 'array');
        });
    });
});
