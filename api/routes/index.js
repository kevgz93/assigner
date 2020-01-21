var express = require('express');
var router = express.Router();
var helpers = require('../helper/helperFunctions');


var ctrlTicket = require('../controllers/ticket.controller.js');
var ctrlUsers = require('../controllers/user.controller.js');
var ctrlReport_case = require('../controllers/report_case.controller.js');
var ctrlSchedule = require('../controllers/schedule.controller.js');
var ctrlRotation = require('../controllers/rotation.controller.js');



router
  .route('/login/register')
  .post(helpers.isAdmin,ctrlUsers.register);

router
  .route('/checksession')
  .get(ctrlUsers.getBySessionId);

router
  .route('/login/schedule')
  .post(ctrlSchedule.createSchedule);

router
  .route('/schedule')
  .get(ctrlSchedule.getScheduleId)
  .post(helpers.isAdmin,ctrlSchedule.createSchedule)
  .put(helpers.isAdmin,ctrlSchedule.updateSchedule);
  

router
  .route('/login')
  .post(ctrlUsers.auth);

  router
  .route('/logout')
  .post(ctrlUsers.logout);

router
  .route('/user')
  .get(ctrlUsers.userGetOne)
  .put(ctrlUsers.usersUpdateOne)
  .delete(helpers.isAdmin,ctrlUsers.usersDeleteOne);

  router
  .route('/getusers')
  .get(ctrlUsers.getUsersToModify);

  router
  .route('/check')
  .get(ctrlUsers.getUserBySessionId);

router
.route('/ticket/')
.get(helpers.isAuthenticated, ctrlTicket.loadEnginner) //helpers.isAuthenticated,
.post(ctrlTicket.addTicket)
.put(ctrlTicket.ticketDelete);

router
.route('/reports/case')
.post(helpers.isAdmin,ctrlReport_case.generateReports) //helpers.isAdmin

router
.route('/rotation/')
.get(ctrlRotation.getRotationByWeek) //helpers.isAuthenticated,
.post(helpers.isAdmin,ctrlRotation.createRotation)
.put(helpers.isAdmin,ctrlRotation.updateRotation);

router
.route('/rotation/users')
.get(ctrlRotation.getUsersToMonitor)

router
.route('/rotations/')
.get(ctrlRotation.getAllRotation) //helpers.isAuthenticated,


router
.route('/checkrotation/')
.get(ctrlRotation.getRotationByStatus);

router
.route('/updateday/')
.put(ctrlRotation.updateDayOnWeek)//helpers.isAuthenticated,

router
.route('/timeoff/')
.put(ctrlSchedule.createTimeOff)//helpers.isAuthenticated,



module.exports = router;
