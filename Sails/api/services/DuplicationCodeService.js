/**
 * StoryService
 *
 * @description :: Business-side logic for managing stories
 * 
 */
var Promise = require("bluebird"),
    utilService = require('./UtilService'),
    constant = require('../constant/constant');;
module.exports = {
    _getJsRedundantCodeBlockCount: function (reqParams) {
        return new Promise(function (resolve, reject) {
            var storyId = reqParams.storyId;
            RedundantCodeMetrics.native(function (err, collection) {
                if (err) {
                    reject({ error: "Failed to get duplication code total count." });
                } else {
                    collection.aggregate([
                        { $match: { storyId: storyId } },
                        { $unwind: '$data' },
                        { $unwind: '$data.instances' },
                        {
                            $group: {
                                _id: '$data.instances.path',
                                "count": { $sum: 1 }
                            }
                        }
                    ]).toArray(function (err, data) {
                        resolve(data);
                    });
                }
            });
        });
    },
    _getRubyRedundantCodeBlockCount: function (reqParams) {
        return new Promise(function (resolve, reject) {
            var storyId = reqParams.storyId;
            RubyDuplication.native(function (err, collection) {
                if (err) {
                    reject({ error: "Failed to get duplication code total count." });
                } else {
                    collection.aggregate([
                        { $match: { storyId: storyId } },
                        { $unwind: '$data.analysed_modules' },
                        { $unwind: '$data.analysed_modules.smells' },
                        {
                            $group: {
                                _id: '$data.analysed_modules.path',
                                "count": { $sum: 1 }
                            }
                        }
                    ]).toArray(function (err, data) {
                        resolve(data);
                    });
                }
            });
        });
    },
    _getJavaRedundantCodeBlockCount: function (reqParams) {
        return new Promise(function (resolve, reject) {
            var storyId = reqParams.storyId;
            JavaDuplication.native(function (err, collection) {
                if (err) {
                    reject({ error: "Failed to get duplication code total count." });
                } else {
                    collection.aggregate([
                        { $match: { storyId: storyId } },
                        { $unwind: '$data' },
                        { $unwind: '$data.pmd-cpd' },
                        { $unwind: '$data.pmd-cpd.duplication' },
                         { $unwind: '$data.pmd-cpd.duplication.file' },
                        {
                            $group: {
                                _id: '$data.pmd-cpd.duplication.file.path',
                                "count": { $sum: 1 }
                            }
                        }
                    ]).toArray(function (err, data) {
                        resolve(data);
                    });
                }
            });
        });
    },
    _getJsRedundantCodeLinesCount: function () {

    },
    getRedundantCodeBlockCount: function (reqParams) {
        var lang = reqParams.lang;
        switch (lang) {
            case constant.REPORTS.LANG.JS:
                return this._getJsRedundantCodeBlockCount(reqParams);
            case constant.REPORTS.LANG.RUBY:
                return this._getRubyRedundantCodeBlockCount(reqParams);
            case constant.REPORTS.LANG.JAVA:
                return this._getJavaRedundantCodeBlockCount(reqParams);
            default:
                return new Promise(function (resolve, reject) {
                    reject({ error: utilService.stringFormat('`%s` language is not supported to get RedundantCodeBlockCount', lang) });
                });
        }
    },
    _getJsRedundantCodeLinesCount: function (reqParams) {
         return new Promise(function (resolve, reject) {
            var storyId = reqParams.storyId;
            RedundantCodeMetrics.native(function (err, collection) {
                if (err) {
                    return reject({ error: "Failed to get duplication lines of code count." });
                    //return res.send(err, 500);
                } else {
                    collection.aggregate([
                        { $match: { storyId: storyId } },
                        { $unwind: { path: '$data', preserveNullAndEmptyArrays: true, includeArrayIndex: 'dataIndex' } },
                        { $unwind: { path: '$data.instances', preserveNullAndEmptyArrays: true, includeArrayIndex: 'instanceIndex' } },
                        { $unwind: { path: '$data.instances.lines', preserveNullAndEmptyArrays: true, includeArrayIndex: 'lineIndex' } },
                        {
                            $group:
                            {
                                _id: { id: "$data.id", instanceInd: "$instanceIndex", path: '$data.instances.path' },
                                start: { $first: "$data.instances.lines" },
                                end: { $last: "$data.instances.lines" }
                            }
                        },
                        {
                            $group: {
                                _id: '$_id.path',
                                numberOfDups: { $sum: 1 },
                                totalDuplicatedLines: { $sum: { $subtract: ["$end", "$start"] } }
                            }
                        },
                        {
                            "$project": {
                                "_id": 0,
                                "path": "$_id",
                                "totalDuplicatedLines": "$totalDuplicatedLines",
                                "numberOfDups": "$numberOfDups",
                            }
                        }
                    ]).toArray(function (err, data) {
                        resolve(data);
                        //return res.json(data);
                    });
                }
            });
        });

    },
    _getRubyRedundantCodeLinesCount: function (reqParams) {
         return new Promise(function (resolve, reject) {
            var storyId = reqParams.storyId;
            RubyDuplication.native(function (err, collection) {
                if (err) {
                    return reject({ error: "Failed to get duplication lines of code count." });
                    //return res.send(err, 500);
                } else {
                    collection.aggregate([
                        { $match: { storyId:storyId } },
                        { $unwind: { path: '$data', preserveNullAndEmptyArrays: true, includeArrayIndex: 'dataIndex' } },
                        { $unwind: { path: '$data.analysed_modules', preserveNullAndEmptyArrays: true, includeArrayIndex: 'instanceIndex' } },
                        { $unwind: { path: '$data.analysed_modules.smells', preserveNullAndEmptyArrays: true, includeArrayIndex: 'smellIndex' } },
                        { $unwind: { path: '$data.analysed_modules.smells.locations', preserveNullAndEmptyArrays: true, includeArrayIndex: 'locationIndex' } },
                        { $unwind: { path: '$data.analysed_modules.smells.locations', preserveNullAndEmptyArrays: true, includeArrayIndex: 'locationIndex' } },
                        {
                            $group:
                            {
                                _id: { id: "$data.id", instanceInd: "$instanceIndex", path: '$data.analysed_modules.smells.locations.path' },
                                start: { $first: "$data.analysed_modules.smells.score" },
                               
                            }
                        },
                        {
                            $group: {
                                _id: '$_id.path',
                                numberOfDups: { $sum: 1 },
                                totalDuplicatedLines: { $sum:"$start" }
                            }
                        },
                        {
                            "$project": {
                                "_id": 0,
                                "path": "$_id",
                                "totalDuplicatedLines": "$totalDuplicatedLines",
                                "numberOfDups": "$numberOfDups",
                            }
                        }
                    ]).toArray(function (err, data) {
                        resolve(data);
                        //return res.json(data);
                    });
                }
            });
        });

    },
    
    getRedundantCodeLinesCount: function (reqParams) {
       var lang = reqParams.lang;
        switch (lang) {
            case constant.REPORTS.LANG.JS:
                return this. _getJsRedundantCodeLinesCount(reqParams);
            case constant.REPORTS.LANG.RUBY:
                return this. _getRubyRedundantCodeLinesCount(reqParams);    
           
            default:
                return new Promise(function (resolve, reject) {
                    reject({ error: utilService.stringFormat('`%s` language is not supported to get RedundantCodeBlockCount', lang) });
                });
        }
       
    }
};