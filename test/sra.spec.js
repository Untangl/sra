/**
 * Quick tests that exercise a sample of the possible dates in the state
 * retirement age tables.
 *
 */
'use strict';

var should = require('should');
var debug = require('debug')('sra:test');
var _     = require('lodash');
var util  = require('util');
var moment  = require('moment');
//enables us to put it statements in loops driven by an array of data
var datadriven = require('data-driven');

var sra = require('../index.js');


//An array of tests, each object is one test
var testData = [
  { //1 me!
    gender: 'male',
    dob:'1959-02-20',
    expectedSRA: '2025-02-20'
  },
  { //2 off the start of the table female
    gender: 'female',
    dob:'1950-04-05',
    expectedSRA: '2010-04-05'
  },
  { //3 off the start of the table male
    gender: 'male',
    dob:'1953-12-05',
    expectedSRA: '2018-12-05'
  },
  /*table 1*/
  { //4 early table1
    gender: 'female',
    dob:'1950-05-06',
    expectedSRA: '2010-07-06'
  },
  { //5 mid table1
    gender: 'female',
    dob:'1951-08-05',
    expectedSRA: '2012-11-06'
  },
  { //6 late table1
    gender: 'female',
    dob:'1953-04-05',
    expectedSRA: '2016-03-06'
  },
  /*table 2*/
  { //7 early table2
    gender: 'female',
    dob:'1953-04-06',
    expectedSRA: '2016-07-06'
  },
  { //8 late table2
    gender: 'female',
    dob:'1953-12-05',
    expectedSRA: '2018-11-06'
  },
  /*table 3*/
  { //9 early table3
    gender: 'male',
    dob:'1953-12-06',
    expectedSRA: '2019-03-06'
  },
  { //10 late table3
    gender: 'female',
    dob:'1954-10-05',
    expectedSRA: '2020-09-06'
  },
  { //11 end table3
    gender: 'female',
    dob:'1954-10-06',
    expectedSRA: '2020-10-06'
  },
  { //12 end table3
    gender: 'male',
    dob:'1960-04-05',
    expectedSRA: '2026-04-05'
  },

  /*table 4*/
  { //13 mid table4
    gender: 'female',
    dob:'1960-10-05',
    expectedSRA: '2027-04-05'
  },
  { //14 table4 note 1
    gender: 'male',
    dob:'1960-07-31',
    expectedSRA: '2026-11-30'
  },
  { //15 table4 note 2
    gender: 'male',
    dob:'1960-12-31',
    expectedSRA: '2027-09-30'
  },
  { //16 table4 note 3
    gender: 'male',
    dob:'1961-01-31',
    expectedSRA: '2027-11-30'
  },
  { //17 table4
    gender: 'male',
    dob:'1961-03-06',
    expectedSRA: '2028-03-06'
  },
  { //18 table5
    gender: 'female',
    dob:'1977-04-06',
    expectedSRA: '2044-05-06'
  },
  { //19 table5
    gender: 'female',
    dob:'1978-01-05',
    expectedSRA: '2045-09-06'
  },

  { //20 off the end of the table
    gender: 'female',
    dob:'1978-04-06',
    expectedSRA: '2046-04-06'
  },
  { //21 off the end of the table
    gender: 'male',
    dob:'1978-04-07',
    expectedSRA: '2046-04-07'
  }

];

describe('SRA library unit tests - date', function () {
  datadriven(testData, function(){
    it('Gender: {gender} DoB: {dob} SRA: {expectedSRA}', function(ctx){

      var r = sra(moment(ctx.dob).toDate(), ctx.gender);
      //debug('***AGE***', r.age);
      moment(r.date).format('YYYY-MM-DD').should.eql(ctx.expectedSRA);
      // debug('r: ', util.inspect(r, false, null));

    })
  });
});

describe('SRA library unit tests - age', function(){
  it('Gender: female DoB: 1951-08-05 SRA: 2012-11-06', function() {
    var r = sra(moment('1951-08-05').toDate(), 'female');
    r.age.should.eql([61,3,1]);
  });

});
