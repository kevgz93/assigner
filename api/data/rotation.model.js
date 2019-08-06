var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var engi = new ObjectId;
//defining schema for users table
var rotationSchema = new mongoose.Schema({
    monday: {morning:String,afternoon:String},
    tuesday : {morning:String,afternoon:String},
    wednesday: {morning:String,afternoon:String},
    thursday: {morning:String,afternoon:String},
    friday: {morning:String,afternoon:String},
});


//MODEL for Users using SCHEMA HOTELS {_id:String,name:String,last_name:String}

mongoose.model('rotation', rotationSchema, 'rotations')