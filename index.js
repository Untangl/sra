/*
 * State Retirement Age library
 *
 */

'use strict';

var debug = require('debug')('sra:main');
var util  = require('util');
var _     = require('lodash');
var moment = require('moment');
var momentpr = require('moment-precise-range-plugin');

/*
Non trivial retirement date calculations!
 */

/**
 * calcTables1235 - calculation for tables 1, 2 3 and 5
 * @param dob {moment} - date of birth
 * @param startDate {ISO string} - start date for this calculation table segment
 * @param pensionDate {ISO string} - corresponding pension start date
 * @param monthGap {Integer} - the number of months between each change in retirement age
 * @returns {moment} - retirement date
 */
var calcTables1235 = function(dob, startDate, pensionDate, monthGap){
  //calculate the number of months from the start of the table (NB rounds down)
  var dur = dob.diff(moment(startDate), 'months');
  debug("Dur is ", dur," for dob ", dob.toDate(), " dur * monthGap ", dur * monthGap, " pension date ");
  var localDate = moment(pensionDate);
  return localDate.add(dur * monthGap, 'months');
};

/**
 * calcTables4 - calculation for table 4
 * @param dob {moment} - date of birth
 * @param startDate {ISO string} - start date for this calculation table segment
 * @returns {moment} - retirement date
 */

var calcTables4 = function(dob, startDate){
  //calculate the number of months from the start of the table (NB rounds down)
  var dur = dob.diff(moment(startDate), 'months');
  return moment(dob).add(66,'years').add(dur+1,'months');
};

/** Lookup tables based on the 5 Government tables. Given the start dates the algorithm
 * starts at the end (future dates) part of the table and works back to find the correct
 * start date. The defined calcSRD method then calculates the retirement date based
 * on the different algorithms used in the tables.
 *
 * Lookup table
 *
 * startDate - start date for the lookup
 * calcSRD - function to calculate the state pension date
 */
var l1 = [
  //WOMEN
  //before 6/4/50 women retire at 60 so set start to 1900
  {startDate: '1900-04-06', calcSRD:function(dob){ return moment(dob).add(60,'y');} },
  // reference date ranges 6 April 1950 - 5 April 1953 Table 1
  {startDate: '1950-04-06', calcSRD:function(dob){return calcTables1235(dob, '1950-04-06', '2010-05-06', 2)} },
// reference date ranges  6 April 1953 - 5 December 1953 Table 2
  {startDate: '1953-04-06', calcSRD:function(dob){return calcTables1235(dob, '1953-04-06', '2016-07-06', 4)} }
];
var l2 = [
  //MEN
  //before 6/12/53 men retire at 65 so set start to 1900
  {startDate: '1900-04-06', calcSRD:function(dob){ return moment(dob).add(65,'y');} }
];
var l3 = [
  //BOTH
  // reference date ranges 6 December 1953 - 5 October 1954 Table 3
  {startDate: '1953-12-06', calcSRD:function(dob){return calcTables1235(dob, '1953-12-06', '2019-03-06', 2)}},
  // end of Table 3 - retire at 66
  {startDate: '1954-10-06', calcSRD:function(dob){ return moment(dob).add(66,'y');} },
  // reference date ranges 6 April 1960 - 5 March 1961 Table 4
  {startDate: '1960-04-06', calcSRD:function(dob){return calcTables4(dob, '1960-04-06')}},
  // end of Table 4 - retire at 67
  {startDate: '1961-03-06', calcSRD:function(dob){ return moment(dob).add(67,'y');} },
  // reference date ranges 6 April 1977 - 5 April 1978 Table 5
  {startDate: '1977-04-06', calcSRD:function(dob){return calcTables1235(dob, '1977-04-06', '2044-05-06', 2)}},
  // end of Table 5 - retire at 68
  {startDate: '1978-04-06', calcSRD:function(dob){ return moment(dob).add(68,'y');} }
];
//create a single table for each gender
var female = _.union(l1,l3);
var male = _.union(l2,l3);


/**
 * sra - state retirement age calculation
 * @param dob {Date} - date of birth as JavaScript Date object
 * @param gender {string} - either 'male' or 'female'
 * @returns {Date} - date when person reaches state retirement age
 */
var sra = function(dob, gender) {
  if (!_.includes(["male","female"], gender)) {
    gender = "female";
  }
  if (!_.isDate(dob)){
    dob = new Date();
  }
  var mDob = moment(dob);
  var pensionTable = (gender === 'male') ? male : female;
  //iterate over table from youngest to oldest rows
  var spd;
  _.forEachRight(pensionTable, function (row) {
    if (mDob.isSameOrAfter(moment(row.startDate))) {
      spd = row.calcSRD(mDob);
      return false;
    }
  });
  var ao = moment.preciseDiff(spd, mDob, true);

  return {date:spd.toDate(), age:[ao.years, ao.months, ao.days]};
};

module.exports = sra;

