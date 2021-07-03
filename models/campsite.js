const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency; //$$$
const Schema = mongoose.Schema; //shorthand so we can just write Schema

const commentSchema = new Schema({ //a comments schema used to contain comments
    rating: { //kinda cool that we can have a rating that is limited to 1-5
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const campsiteSchema = new Schema({ //literally creating an object schema
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String, //will be a path to the image
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency, //$$$
        required: true,
        min: 0 //-$$$
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema] //now the comments schema is inside the campsite schema...SCHEMACEPTION
}, {
    timestamps: true //will add two properties to schema, showing when it was created and when it is updates
});

const Campsite = mongoose.model('Campsite', campsiteSchema); //creating a model from the Schema

module.exports = Campsite;