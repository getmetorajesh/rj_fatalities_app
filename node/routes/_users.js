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
        var listPromises =[];

        for(var i in user_grouping){
            listPromises.push( getData(req, user_grouping[i]));
        }

        Promise.all(listPromises).then(function(dataArr){
            res.json(dataArr);
        });
        /*user_grouping.forEach(function(user_group){

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
            group_counter = group_counter + 1;
            var loop =[];
            for(var i=0; i<timeDiff.length; i++){
                console.log("group_counter1="+group_counter);
                var between = timeDiff[i].split(":");
                var from_time = convertToMinutes(between.from);
                var to_time = convertToMinutes(between.to);
                var value = 0;

                 collection.count({"road_user_grouping_tx":user_group, "from":from_time, "to":to_time}, function(err, result){
                    var tempObj = {};
                        tempObj.type = user_group;
                        tempObj.value = result;

                        tempObj.timeval = timeDiff[i];
                        resJson.push(tempObj);
                        console.log(group_counter);
                        if(group_counter === user_grouping.length){
                           // res.json(resJson);
                        }
                });
                    //var grp = getGroups(req, user_group, from_time, to_time);
                console.log("group_counter= "+group_counter);
            }
           //res.json(resJson);
             //res.json(resJson);



        });
        });*/


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

function getData(req, user_group){
    return new Promise(function(resolve, reject){

        var timeDiff = [
            "09:00 to 12:00",
            "12:00 to 15:00",
            "15:00 to 19:00",
            "19:00 to 23:59",
            "00:00 to 03:00",
            "03:00 to 06:00",
            "06:00 to 09:00"
            ];

        var listLoop=[];
        for(var i=0; i<timeDiff.length; i++){

            var between = timeDiff[i].split(":");
            var from_time = convertToMinutes(between.from);
            var to_time = convertToMinutes(between.to);

            listLoop.push( req, user_group,from_time, to_time);
        }
        var res = Promise.all(promises)
        resolve(res);
    });
}


function getGroups(req, user_group, from, to){
    return new Promise(function(resolve, reject){
        var db = req.db;
        var collection = db.get('Fatalities_with_LGA');
        var countvalue = 0;
        var countVal = collection.count({"road_user_grouping_tx":user_group, "from":from, "to":to}, function(err, value){
              var tempObj = {};
                tempObj.type = user_group;
                tempObj.value = result;
                tempObj.timeval = timeDiff[i];
                resolve(tempObj);
        });
    });

}

module.exports = router;
