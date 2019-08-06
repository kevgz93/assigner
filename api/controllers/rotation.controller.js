var rotationModel = require('../data/rotation.model.js');
var userModel = require('../data/user.model.js');
var mongoose = require('mongoose');
var q = require('q');

var db = mongoose.model('rotation');
var users = mongoose.model('user');
var rotation = {};


rotation.createRotation = function (req, res) {
    console.log(req.body.user_id);

    if(!req.body.monday)
    {
        res.status(400);
        res.send({status:'error',error:'Values missing.'});
    }

    db.create({ 
        monday :{
            morning:req.body.monday.morning,
            afternoon:req.body.monday.afternoon
        } ,
        tuesday : {
            morning:req.body.tuesday.morning,
            afternoon:req.body.tuesday.afternoon
        },
        wednesday: {
            morning:req.body.wednesday.morning,
            afternoon:req.body.wednesday.afternoon
        },
        thursday: {
            morning:req.body.thursday.morning,
            afternoon:req.body.thursday.afternoon
        },
        friday: {
            morning:req.body.friday.morning,
            afternoon:req.body.friday.afternoon
        }

    }, function(err, user) { //this will run when create is completed
      if(err) {
        console.log("Error creating a Rotation Calendar");
        res
          .status(400)
          .json(err);

      } else {
        console.log("Rotation Calendar created");
        console.log(user);

        res
          .status(201)
          .json({status:201,body:user});

      }
  })
}


//Get all rotation table
rotation.getAllRotation = function(req, res){
    var rotat = rotation.getRotation()
    rotat.then(function(rotati){
        console.log(rotati);
            res.send({status: 200, body: rotati});
        }, function(){
            res.send({status: 404,error:'Error occured while fetching data from database.'});
        });
    
    }

rotation.getRotation = function(week){
    var results = q.defer();

    db.find({},function(err, dbuser) {
        if (dbuser){
        results.resolve(dbuser);

    }  else{
            var response = {};
            response.status = 'error';
            response.error = 'Rotation not found it';
            results.resolve(response);
        }
    });

    return results.promise;
}

//get users to dropdown in rotation component
rotation.getUsersToMonitor = function(req, res) {

    var engineer = rotation.loadEnginners()
    engineer.then(function(engineers){
      console.log(engineers);
      //jso = engineers;
      //next()
      res.send(engineers);
    }, function(){
      res.send({status:'error',error:'Error occured while fetching data from database.'});
    });
  
  };
  
  rotation.loadEnginners = function(){
    var results = q.defer();
  
  
    users.aggregate(
      [
        {
          $match:{
            "status":true
          }
        },
          { "$project": {
            "_id": 1,
            "name":1,
            "last_name":1,
          }
        }
      ],function(err, engi) {
        
        if (err){
          results.reject(err);
        }
        results.resolve(engi);
        
      });
      
      return results.promise;
  
    }

    
//Find the user and send it again to getUserBySessionID

rotation.getRotationByWeek = function(req, res){
    var rotat = rotation.findWeek(req.query.week)
    rotat.then(function(rotati){
        console.log(rotati);
            res.send({status: 200, body: rotati});
        }, function(){
            res.send({status: 404,error:'Error occured while fetching data from database.'});
        });
    
    }
rotation.findWeek = function(week){
    var results = q.defer();

    db.findOne({"week": week},function(err, dbuser) {
        if (dbuser){
        results.resolve(dbuser);

    }  else{
            var response = {};
            response.status = 'error';
            response.error = 'Week not found it';
            results.resolve(response);
        }
    });

    return results.promise;
}


    
//Find the current status getRotationByStatus


rotation.getRotationByStatus = function(req, res){
    var rotat = rotation.findWeekByStatus()
    rotat.then(function(rotati){
        console.log(rotati);
            res.send({status: 200, body: rotati});
        }, function(){
            res.send({status: 404,error:'Error occured while fetching data from database.'});
        });
    
    }
rotation.findWeekByStatus = function(){
    var results = q.defer();

    db.findOne({"active.status": true},function(err, dbuser) {
        if (dbuser){
        results.resolve(dbuser);

    }  else{
            var response = {};
            response.status = 'error';
            response.error = 'Schedule not found it';
            results.resolve(response);
        }
    });

    return results.promise;
}

// update the day on the current week
rotation.updateDayOnWeek = function(req, res) {
    var day = req.body.day;
    var week = req.body.week;
    let auxWeek;
    if (week != 6){
        auxWeek = week +1;
        //console.log("nuevo week",auxWeek);
        rotation.updateStatusOnWeek(auxWeek);
    }
    else {
        auxWeek = 1;
        rotation.updateStatusOnWeek(auxWeek);
    }
console.log("Get week" + week);

    db
        .findOne({week : week})
        .exec(function(err, doc){
        var response = {
            status: 200,
            message: doc
        };

        if (err) {
            console.log("Error finding week");
            response.status = 500;
            response.message = err;
        } else if(!doc){
            response.status= 404;
            response.message = {
            "message":"week not found"
            };
        }

        if (response.status != 200) {
            res
            .status(response.status)
            .json(response.message);
        } else {
            doc.active.day = day,
            doc.active.status = false

        };

        doc.save(function(err, Updated) {
            if (err) {
            res
                .send({status: 500});

            } else {
            res
            .send({status:204});

            }
        })
    })
}

rotation.updateStatusOnWeek = function(week) {

console.log("Get week" + week);

    db
        .findOne({week : week})
        .exec(function(err, doc){
        var response = {
            status: 200,
            message: doc
        };

        if (err) {
            console.log("Error finding week");
            response.status = 500;
            response.message = err;
        } else if(!doc){
            response.status= 404;
            response.message = {
            "message":"week not found"
            };
        }

        if (response.status != 200) {
            console.log(response);
        } else {
            doc.active.status = true

        };

        doc.save(function(err, Updated) {
            if (err) {
                console.log("Status saved", updated);

            } else {
                console.log("Status not saved");
            }
        });
    })
}

rotation.updateRotation = function (req, res) {

//var week = req.body.week;
let id = req.body._id;
//console.log("Get week" + week);

    db
        .findOneAndUpdate({_id : id})
        .exec(function(err, doc){
        var response = {
            status: 200,
            message: doc
        };

        if (err) {
            console.log("Error finding week");
            response.status = 500;
            response.message = err;
        } else if(!doc){
            response.status= 404;
            response.message = {
            "message":"week not found"
            };
        }

        if (response.status != 200) {
            res
            .status(response.status)
            .json(response.message);
        } else {
            doc.monday.morning = req.body.monday.morning,
            doc.monday.afternoon = req.body.monday.afternoon,
            doc.tuesday.morning= req.body.tuesday.morning,
            doc.tuesday.afternoon= req.body.tuesday.afternoon,
            doc.wednesday.morning= req.body.wednesday.morning,
            doc.wednesday.afternoon= req.body.wednesday.afternoon,
            doc.thursday.morning = req.body.thursday.morning,
            doc.thursday.afternoon = req.body.thursday.afternoon,
            doc.friday.morning= req.body.friday.morning,
            doc.friday.afternoon= req.body.friday.afternoon
            //doc.status = req.body.status

        };

        doc.save(function(err, Updated) {
            if (err) {
            res
                .send({status: 500});

            } else {
            res
            .send({status:204});

            }
        })
    })
}

module.exports = rotation;