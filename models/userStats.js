const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userStatsSchema = new Schema({
    //_id: Schema.Types.ObjectId,
    userId: { type: Number, required: true },
    correctQuestions: { type: [Number], required: true },
    incorrectQuestions: { type: [Number], required: true },
});
userStatsSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserStats', userStatsSchema);
