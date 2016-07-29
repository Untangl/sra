var Util;
(function() {
  // Supporting code for calculating Auto Enrollment Pension Eligibility Status (PRIVATE)
  var ELIG_AGE = 22;
  var ENTI_AGE = 16;
  var MAX_AGE = 75;
   // Constants describing worker status
  const ELIG=1, NON_ELIG=2,  ENTI=3,  NON_ENROLLABLE=4;
  const LOWER_EARNINGS_THRESH=5564;
  const AUTO_ENROLMENT_TRIGGER=8105;
  // Supporting code for calculating pensionable age (PRIVATE)
  var pensionData;
 
  // WOMEN ONLY
  const refDateForWomen60 = new Date(1950,3,6);
  // WOMEN ONLY
  // reference date ranges 6 April 1950 - 5 April 1953
  const refDateEnd = new Date(1950,3,6);//threshold end
  const refDatePen = new Date(2010,4,6);//expected date
  // WOMEN ONLY
  // reference date ranges  6 April 1953 - 5 December 1953
  const refDateEnd53 = new Date(1953,3,6);//threshold end
  const refDatePen53 = new Date(2016,6,6);//expected date  
  // WOMEN ONLY
  // reference date ranges 6 December 1953 - 5 October 1954
  const refDateEnd54 = new Date(1953,11,6);//threshold end
  const refDatePen54 = new Date(2019,2,6);//expected date  
  //WOMEN ONLY
  const refDateForWomen66 =  new Date(1954,9,6);//expected date  
  // cut off date for men who can retire at 65
  const refDateForMen65 = new Date(1953,11,6);
  // reference for people born between 6 oct 1954 - 5 april 1968
  const refDateEnd66 = new Date(1968,3,6);//threshold end
  const refDatePen66 = new Date(2034,4,6);//threshold end
  //reference for 1969-1977
  const refDateEnd66_67 = new Date(1969,3,6); 
  // reference for 1954
  const refDateEnd67 = new Date(1977,3,6);//threshold end
  const refDatePen67 = new Date(2044,4,6);//expected window.alert();date  
  const refDateEndFinal = new Date(1978,3,6);//date for 68 onward SPA 
  var prime = [
   {startDate: refDateForWomen60, calcAge:function(dob){ return new Date(dob.getFullYear()+60,dob.getMonth(), dob.getDate()) }},
   {startDate: refDateEnd,        PensionDate:refDatePen,   Window:36,  MnthGap:2},
   {startDate: refDateEnd53,      PensionDate:refDatePen53, Window:9,   MnthGap:4},
   {startDate: refDateEnd54,      PensionDate:refDatePen54, Window:11,  MnthGap:2},
   {startDate: refDateForWomen66, calcAge:function(dob){ return new Date(dob.getFullYear()+66,dob.getMonth(), dob.getDate()) }},
   {startDate: refDateEnd66,      PensionDate:refDatePen66, Window:13,  MnthGap:2},
   {startDate: refDateEnd66_67,   calcAge:function(dob){ return new Date(dob.getFullYear()+67,dob.getMonth(), dob.getDate()) }},
   {startDate: refDateEnd67,      PensionDate:refDatePen67, Window:13,  MnthGap:2},
   {startDate: refDateEndFinal,   calcAge:function(dob){ return new Date(dob.getFullYear()+68,dob.getMonth(), dob.getDate()) }}   
  ];
  var special_male_case = 
   {startDate: refDateForMen65,calcAge:function(dob){ return new Date(dob.getFullYear()+65,dob.getMonth(), dob.getDate()) }};

  function InitialisePensionData() {

    if (pensionData==null) {
      var pensionRulesFemale = [[prime[0]]];
      var pensionRulesMale   = [[special_male_case]];
      
      // initialise the womens array for usage
      prime.forEach(function(p) {
        if (p.calcAge != null)
          pensionRulesFemale.push([p]);
        else
          pensionRulesFemale.push(calculateRanges1(p.startDate, p.PensionDate, p.Window, p.MnthGap));
      });
      // initialise the mens array - which is a special initial rule followed by the rules from the female table 
      // after retirement ages have converged.
      pensionRulesMale = pensionRulesMale.concat(pensionRulesFemale.slice(3));

      pensionData = {'male':pensionRulesMale, 'female':pensionRulesFemale};
    }
    return pensionData;
  }

  /**** This is a test function with a variation of calculate Ranges ****/

  function calculateRanges1( threshDate, PenBegin,threshWindow, mnthGap) {
    // set up the lists to hold the dates and add the values for the first elements 
    var resultArray = [{startDate:threshDate , penDate: PenBegin}];
    var lastTimeDate = threshDate;
    var lastTimePension = PenBegin;

    for (let i=1;i<threshWindow;i++) {
      var tempDateEnd; // this will hold the temp date that will eventually be used for the comparison
      var tempDatePen;

      // check for the month of december and update year value  
      if (lastTimeDate.getMonth() == 11)
        tempDateEnd = new Date(lastTimeDate.getFullYear()+1,0, lastTimeDate.getDate());
      else // add one month to the current month and store in temp end
        tempDateEnd = new Date(lastTimeDate.getFullYear(),lastTimeDate.getMonth()+1, lastTimeDate.getDate());

      //move the pension date along by the required number of months
      var newMonth = lastTimePension.getMonth() + mnthGap;
      if (newMonth > 11)
        tempDatePen = new Date(lastTimePension.getFullYear()+1,newMonth-12, lastTimePension.getDate());
      else
        tempDatePen = new Date(lastTimePension.getFullYear(),newMonth, lastTimePension.getDate());

      // return the date 
      resultArray.push({startDate:tempDateEnd , penDate: tempDatePen});
      lastTimeDate = tempDateEnd;
      lastTimePension = tempDatePen;
    }
    return resultArray;
  }
  
var duPensionDate = function(dob,isMale) {

	var pensionTable = isMale ? pensionData.male : pensionData.female;

	// now we have the tables lets traverse over them
	var pentabLen  = pensionTable.length;

	// Fast simple first test to see whether the transition rules apply
	if (dob < pensionTable[0][0].startDate)
		return pensionTable[0][0].calcAge(dob);

	if (dob >= pensionTable[pentabLen-1][0].startDate)
		return pensionTable[pentabLen-1][0].calcAge(dob);

	// begin traversing the top level pension table
	for (let i=pentabLen-1; i>0;i--) {
		var penRuleLen = pensionTable[i].length;

		// now iterate through the individual table and match the start dates and pension dates
		if (dob >= pensionTable[i][0].startDate) {
			if (penRuleLen==1)
				return pensionTable[i][0].calcAge(dob);
			else {
				for(let j=penRuleLen-1;j>0;j--)
					if(dob >= pensionTable[i][j-1].startDate)
						return pensionTable[i][j-1].penDate;
			}
		}
		// test for the last case in the table which will return a dob as + 68
		//return pensionTable[i][0].penDate;// return zero if none of the conditions are met as the last case
	}
	rb.debug.error("ERROR: pensionAge - input object array, invalid condition");
};
		
