const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const tournamentSchema = new Schema({
    tournamentId: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDateTime: { type: String, required: true },
    results: [{ type: mongoose.Types.ObjectId, ref: 'UserStats' }],
});
tournamentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Tournament', tournamentSchema);
