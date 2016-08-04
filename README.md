# sra - UK State Pension/Retirement Age library
A straightforward(!) UK State Retirement Age calculation library that we thought might be useful for someone out there.

## Installation
```
$ npm install sra
```
## Usage
Simply invoke the exported function passing it
 * date of birth - as a JavaScript Date object (if missing or not a Date current date will be used)
 * gender - enumerated string 'male or 'female' (if missing or illegal value supplied will be set to 'female')
 
 and get back an object with properties:
 * date - Date object corresponding to the retirement date
 * age - Array containing age at retirement [y,m,d]

Example:
```
var sra = require('sra');

var dob = new Date('1959-02-20');
var gender = 'male';

var result = sra(dob, gender);

var d = result.date
// 2025-02-20

var a = result.age
var retirementAge = a[0]" years "+a[1]+" months "+a[2]+" days"
//  66 years 0 months 0 days

```

## Specification
This module is based on [HM Government State Pension Age](https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/310231/spa-timetable.pdf) timetable published by the Department for Work and Pensions update 15 May 2014 under the [Open Government Licence v3.0](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

The timetable is complicated because the government is both trying to unify retirement ages for men and women and also extend retirement age for both. The timetable is broken into specific tables applicable to different birth dates as follows:

Women

<table>
<tr>
<td> < 6/4/1950</td>
<td>60th birthday</td>
</tr>
<tr>
<td>6/4/1950 - 5/12/1953</td>
<td>specified in table 1 and 2</td>
</tr>
</table>

Men

<table>
<tr>
<td> < 6/12/1953</td>
<td>65th birthday</td>
</tr>
</table>

Men and Women

<table>
<tr>
<td>6/12/1953 - 5/10/1954</td>
<td>specified in table 3</td>
</tr>
<tr>
<td>6/10/1954 - 5/4/1960</td>
<td>66th birthday</td>
</tr>
<tr>
<td>6/4/1960 - 5/3/1961</td>
<td>specified in table 4</td>
</tr>
<tr>
<td>6/3/1961 - 5/4/1977</td>
<td>67th birthday</td>
</tr>
<tr>
<td>6/4/1977 - 5/4/1978</td>
<td>specified in table 5</td>
</tr>
<tr>
<td> > 5/4/1978</td>
<td>68th birthday</td>
</tr>
</table>

## Author
Steve Carter (ported from a previous implementation by Alttaf Hussain)

## License
This software is made available under the MIT license.