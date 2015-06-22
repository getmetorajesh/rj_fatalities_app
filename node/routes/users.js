var express = require('express');
var router = express.Router();
var async = require('async');
var Promise = require("bluebird");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('Fatalities_with_LGA');
    pedestrian_count = 0;
    var user_grouping = [];

    // get all the road_user_grouping_tx = [PASSENGER, PEDESTRIAN]
    collection.distinct("road_user_grouping_tx", function(err, data){
        //console.log(data);
        user_grouping = data;
    }).then(function(){

        user_grouping.forEach(function(user_group){
            var timeDiff = [{"from":"9:00", "to":"18:00"}];
            for(i=0; i< timeDiff.length; i++){

            }
        })
    });



    Promise.all([
            collection.count({"road_user_grouping_tx":"PASSENGER"}, function(err,data){
                pedestrian_count = data;
            }),
    ]).then(function(docs){
        var response = {
            "Pedestrian":pedestrian_count
        }
        //console.log(docs);
        // console.log(pedestrian_count);
         res.json(pedestrian_count);
    });

    //collection.find({},{},function(e,docs){

    //});
});


function getGroups(req, user_grouping, to, from){
    var db = req.db;
    var collection = db.get('Fatalities_with_LGA');
    collection.count({"road_user_grouping_tx":"PASSENGER"}, function(err,data){
       // console.log(data);
        return data;
    });
}

module.exports = router;
