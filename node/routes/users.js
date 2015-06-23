var express = require('express');
var router = express.Router();
var async = require('async');
var Promise = require("bluebird");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/updatedb', function(req, res) {
    var db = req.db;
    var collection = db.get('Fatalities_with_LGA');
    pedestrian_count = 0;
    var user_grouping = [];
    collection.find({}, function(err, data){
        data.forEach(function(d){
            split_time = d.time_of_accident_tx.split(" to ");
            var from_time,to_time ="UNKNOWN";
            if(split_time !== "UNKNOWN"){
                 from_time = convertToMinutes(split_time[0]);
                 to_time = convertToMinutes(split_time[1]);
            }
            collection.update({"_id":d._id},{$set:{"from":from_time,"to":to_time}},function(err,res){
                console.log(res);
            })
        });
    });
});

function convertToMinutes(from_time){
    var minutes = 0;
    if(from_time === "UNKNOWN" || from_time === undefined){
        minutes = "UNKNOWN";
    }else{
        console.log(from_time);
        var time = from_time.split(":");
        minutes = parseInt( time[0] + 60*parseInt(time[1]) );
    }
    return minutes;
}

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('Fatalities_with_LGA');
    pedestrian_count = 0;
    var user_grouping = [];

    var resJson = [];
    // get all the road_user_grouping_tx = [PASSENGER, PEDESTRIAN]
    collection.distinct("road_user_grouping_tx", function(err, data){
        //console.log(data);
        return data;
    }).then(function(user_grouping){

        console.log(user_grouping);
        var group_counter=0;
      var loop =[];
        user_grouping.forEach(function(user_group){

            var timeDiff = [

            "09:00 to 12:00",
            "12:00 to 15:00",
            "15:00 to 19:00",
            "19:00 to 23:59",
            "00:00 to 03:00",
            "03:00 to 06:00",
            "06:00 to 09:00"
                            ];
            //async.each(timeDiff, function(timeDiff){
            //async.eachSeries(timeDiff, timeDiff, function(){

            timeDiff.forEach(function(timeDiffVal){
                console.log("group_counter1="+group_counter);
                var between = timeDiffVal.split(" to ");
                var from_time = convertToMinutes(between[0]);
                var to_time = convertToMinutes(between[1]);
                var value = 0;

                var l = collection.count({"road_user_grouping_tx":user_group, "from":{$gte:from_time}, "to":{$lte:to_time}});
                var l1 = l.then(function(doc){
                     var tempObj= createTempObj(user_group, doc, timeDiffVal);
                    //console.log(user_group+" "+result+" "+timeDiffVal);
                    //console.log("group_counter2= "+group_counter);
                    console.log(tempObj);
                    //resJson.push(tempObj);
                    return tempObj;
                })
                loop.push(l1);
            });
            group_counter = group_counter + 1;
            if(group_counter === user_grouping.length){

            }

      });
        Promise.all(loop).then(function(result){
                    res.json(result);
        });
    });


    // Promise.all([
    //         collection.count({"road_user_grouping_tx":"PASSENGER"}, function(err,data){
    //             pedestrian_count = data;
    //         }),
    // ]).then(function(docs){
    //     var response = {
    //         "Pedestrian":pedestrian_count
    //     }
    //     //console.log(docs);
    //     // console.log(pedestrian_count);
    //      res.json(pedestrian_count);
    // });
});

var createTempObj = function(user_group, value, timeDiffVal){
    var tempObj = {};
    tempObj.type = user_group;
    tempObj.value = value;
    tempObj.timeval = timeDiffVal;
    return tempObj;
}


var getGroups = function(req, user_group, from, to){
        var db = req.db;
        var collection = db.get('Fatalities_with_LGA');
        var countvalue = 0;
        var countVal = collection.count({"road_user_grouping_tx":user_group, "from":from, "to":to}, function(err, value){
              var tempObj = {};
                tempObj.type = user_group;
                tempObj.value = result;
                tempObj.timeval = timeDiff[i];
        });
}

module.exports = router;
