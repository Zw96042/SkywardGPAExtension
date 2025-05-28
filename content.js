// Creates a set of courses that do not have "advanced" in the class name that are weighted as 4.50
let levelIIExceptions = new Set([
  "Editorial Leadership I, II, and III",
  "Anatomy & Physiology ",
  "Mentorship",
  "Health Science Clinical",
  "Practicum in Health Science - Pharmacy or Phlebotomy",
  "Robotics II",
  "Robotics III",
  "Swift Coding",
  "Business Incubator",
  "Business ACCeleratoredu",
  "Anatomy and Physiology",
  "Engineering"
]);

// Creates a set that includes courses that do not have "AP" in the class name but are weighted as 5.0
const levelIIIExceptions = new Set([
  "Multivariable Calculus", 
  "Linear Algebra",
  "Statistics 2: Beyond Statistics",
  "Computer Science II",
  "Computer Science III",
  "Computer Science Ind Study I",
  "Organic Chemistry",
  "Art Historical Methods",
  "Art Historical Methods II",
  "Chinese V Advanced",
  "Chinese VI Advanced",
  "French V Advanced",
  "French VI Advanced",
  "German V Advanced",
  "German VI Advanced",
  "Latin V Advanced",
  "Latin VI Advanced",
  "Heritage, and Immersion Students",
  "Spanish VI"
]);

const noCountException = new Set([
  "AP COMPSCI B LOTE"
]);

const semesterExamWeight = 0.2; // 20%

// Finds the user's exact date, time and timezone
function formatDateAndTime() {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

    const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
    const timeFormatter = new Intl.DateTimeFormat('en-US', timeOptions);

    const formattedDate = dateFormatter.format(now).replace(',', ',');
    const formattedTime = timeFormatter.format(now);

    return `${formattedDate.replace(/ /g, ' ')} at ${formattedTime}`;
}

// Find the user's SM1 Grades
function findGrades (semester, isFourPointScale) {
  let gradesGPA = [];
  let rawGPA = 0;
  let classGrades;
  const classes = findClasses();

  if (semester === 1) {
    classGrades = document.querySelectorAll('[data-bkt="SEM 1"]');
  } else if (semester === 2) {
    classGrades = document.querySelectorAll('[data-bkt="SEM 2"]');
  }

  for (let i = 0; i < classGrades.length; i++) {
    const currClassGrade = classGrades[i];
    const gradeNum = currClassGrade.textContent.trim();

  
    let calculatedGPADifference = 0;
    if (gradeNum > 0) {
      // Src: https://bigfuture.collegeboard.org/plan-for-college/get-started/how-to-convert-gpa-4.0-scale
      // Ifs needed for non linear conversion
      if (isFourPointScale) {
        if (gradeNum >= 93) {
          calculatedGPADifference = 4.0 - 4.0;
        } else if (gradeNum >= 90) {
          calculatedGPADifference = 4.0 - 3.7;
        } else if (gradeNum >= 87) {
          calculatedGPADifference = 4.0 - 3.3;
        } else if (gradeNum >= 83) {
          calculatedGPADifference = 4.0 - 3.0;
        } else if (gradeNum >= 80) {
          calculatedGPADifference = 4.0 - 2.7;
        } else if (gradeNum >= 77) {
          calculatedGPADifference = 4.0 - 2.3;
        } else if (gradeNum >= 73) {
          calculatedGPADifference = 4.0 - 2.0;
        } else if (gradeNum >= 70) {
          calculatedGPADifference = 4.0 - 1.7;
        } else if (gradeNum >= 77) {
          calculatedGPADifference = 4.0 - 1.3;
        } else if (gradeNum >= 65) {
          calculatedGPADifference = 4.0 - 1.0;
        } else {
          calculatedGPADifference = 4.0 - 0.0;
        }
      }
      else calculatedGPADifference = (100 - gradeNum);
    } else if (gradeNum == "") calculatedGPADifference = 0;
    
    if (!noCountException.has(classes[i])) {
      gradesGPA.push(calculatedGPADifference);
      rawGPA += calculatedGPADifference;
    }
  }
  
  return [rawGPA, gradesGPA.length];
}

// Finds the user's classes
function findClasses() {
  let classes = [];
  const classNames = document.querySelectorAll('table tbody tr');

  classNames.forEach((row) => {
    const courseNameElement = row.querySelector('.classDesc a[href="javascript:void(0)"]');
    if (courseNameElement) {
      const courseName = courseNameElement.textContent.trim();

      if (!courseName.includes("DC") && !courseName.includes("BM")) {
        if (classes[classes.length - 1] !== courseName) {
          classes.push(courseName);
        }
      }
    }
  });

  return classes;
}

const [GPADifference1, numOfClasses] = findGrades(1, true);
const [GPADifference2, numOfClasses2] = findGrades(2, true);

const [GPADifference1st100, numOfClasses1st100] = findGrades(1, false);
const [GPADifference2nd100, numOfClasses2nd100] = findGrades(2, false);

// Calculates the unweighted GPA of the student
function calculateUnweighted() {
  if (numOfClasses === 0) {
    return 0.00;
  }
  // const unweightedRaw1 = (numOfClasses * 4 - GPADifference1) / numOfClasses;
  // const unweightedRaw2 = (numOfClasses * 4 - GPADifference2) / numOfClasses;

  const unweightedRaw1st100 = (numOfClasses * 100 - GPADifference1st100) / (numOfClasses);
  const unweightedRaw2nd100 = (numOfClasses * 100 - GPADifference2nd100) / (numOfClasses);


  return [roundNumber(unweightedRaw1st100, 3), roundNumber(unweightedRaw2nd100, 3)];
}

// Finds the weight of a specific class
function findWeight(className) {
  let classNameLower = className.toLowerCase();

  if (levelIIExceptions.has(className)) return 105;
  if (levelIIIExceptions.has(className)) return 110;
  if (noCountException.has(className)) return 0;
  
  const isHonors = classNameLower.includes("honors");
  const isAP = classNameLower.includes("ap");

  if (isAP) return 110;
  else if (isHonors) return 105;
  else return 100;
}

const classes = findClasses();
const formattedDateTime = formatDateAndTime();

// Calculates the weighted GPA of the student
function calculateWeighted() {
  if (numOfClasses === 0) {
    return 0.00;
  }

  let sumOfWeights100 = 0;

  for (let i = 0; i < classes.length; i++) {
    const currWeight100 = findWeight(classes[i]);
    sumOfWeights100 += currWeight100;
  }

  let weightedRaw1st100 = (sumOfWeights100 - GPADifference1st100) / numOfClasses;
  let weightedRaw2nd100 = (sumOfWeights100 - GPADifference2nd100) / numOfClasses;

  return [roundNumber(weightedRaw1st100, 3), roundNumber(weightedRaw2nd100, 3)];
}

const [sem1UW100, sem2UW100] = calculateUnweighted();
const [sem1W100, sem2W100] = calculateWeighted();

// const averageUW = roundNumber((parseFloat(sem1UW) + parseFloat(sem2UW))*0.5, 3);
// const averageW = roundNumber((parseFloat(sem1W) + parseFloat(sem2W))*0.5, 3);

const averageUW100 = roundNumber((parseFloat(sem1UW100) + parseFloat(sem2UW100))*0.5, 3);
const averageW100 = roundNumber((parseFloat(sem1W100) + parseFloat(sem2W100))*0.5, 3);

// HTML to be in added to the website
// Function to determine if only Semester 1 should be shown
function isInSemester1() {
  const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)

  // Return true if the current month is between August (8) and December (12)
  return currentMonth >= 8 && currentMonth <= 12;
}

const currentYear = new Date().getFullYear();

const isSemester1 = isInSemester1();

const gradeYear = isSemester1 ? currentYear+1 : currentYear;

// Prepare the HTML to be injected based on the current month
const injectedHTML = `
    <div id="missingAssignmentsModuleWrapper">
        <div id="grid_missingAssignmentsModule_gridWrap" grid-theme="summary" class="gridWrap">
            <div class="sf_gridTableWrap">
                <table vpaginate="no" id="grid_missingAssignmentsModule" grid-table="summary" zebra="false">
                  <thead>
                    <tr>
                      <th scope="col">Grade Point Average ${gradeYear-1}-${gradeYear}</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="">
                      <td scope="row">
                          SM1 Unweighted GPA
                          <span style="color: #1b63aa; font-weight: bold;">${sem1UW100}</span> <b>(100.0)</b>
                          |
                          <span style="color: #1b63aa; font-weight: bold;">${roundNumber(sem1UW100/25, 2).toFixed(2)}</span> <b>(4.0)</b>
                          <br/>
                          SM1 Weighted GPA
                          <span style="color: #1b63aa; font-weight: bold;">${sem1W100}</span> <b>(100.0)</b>
                          |
                          <span style="color: #1b63aa; font-weight: bold;">${roundNumber(sem1W100/25, 2).toFixed(2)}</span> <b>(4.0)</b>
                      </td>
                      <td scope="row">
                        SM2 Unweighted GPA
                        <span style="color: #1b63aa; font-weight: bold;">${sem2UW100}</span> <b>(100.0)</b>
                        |
                        <span style="color: #1b63aa; font-weight: bold;">${roundNumber(sem2UW100/25, 2).toFixed(2)}</span> <b>(4.0)</b>
                        </br>
                        SM2 Weighted GPA
                        <span style="color: #1b63aa; font-weight: bold;">${sem2W100}</span> <b>(100.0)</b>
                        |
                        <span style="color: #1b63aa; font-weight: bold;">${roundNumber(sem2W100/25, 2).toFixed(2)}</span> <b>(4.0)</b>
                      </td>
                      <td scope="row">
                          <div style="">
                            <span>
                              FIN Unweighted:
                              <span style="color: #1b63aa; font-weight: bold;">${averageUW100}</span> <b>(100.0)</b>
                              |
                              <span style="color: #1b63aa; font-weight: bold;">${roundNumber(averageUW100/25, 2).toFixed(2)}</span> <b>(4.0)</b>
                              </br>
                              FIN Weighted:
                              <span style="color: #1b63aa; font-weight: bold;">${averageW100}</span> <b>(100.0)</b>
                              |
                              <span style="color: #1b63aa; font-weight: bold;">${roundNumber(averageW100/25, 2).toFixed(2)}</span> <b>(4.0)</b>
                            </span>
                          </div>
                      </td>
                      <tr>
                        <td>
                          <span class="fXs fIl" style="float: left;" >Last calculated on ${formattedDateTime}</span>
                        </td>
                        <td></td>
                        <td>
                          <button id="download-btn" style="float: inline-end; height: 15px; padding: 2px 2px 12px 2px; font-size: smaller;">Download CSV</button>
                        </td>
                      </tr>
                    </tr>
                  </tbody>
                </table>
            </div>
        </div>
    </div>
`;

// &nbsp&nbsp&#8201


// Function to inject the HTML
function injectGPA() {
  const targetDiv = document.getElementById("missingAssignmentsModuleWrapper");

  if (targetDiv) {
    const container = document.createElement('div');
    container.innerHTML = injectedHTML;
    targetDiv.insertAdjacentElement('afterend', container);
  }
}

const csvData = generateCSV({
  SM1: [roundNumber(sem1UW100, 3).toFixed(3), roundNumber(sem1W100, 3).toFixed(3)],
  SM2: [roundNumber(sem2UW100, 3).toFixed(3), roundNumber(sem2W100, 3).toFixed(3)],
  FIN: [roundNumber(averageUW100, 3).toFixed(3), roundNumber(averageW100, 3).toFixed(3)]
});
let studentName = document.getElementById("sf_StudentLabel").innerText;
studentName = studentName.split(" ").length > 2 ? studentName.split(" ")[2]: studentName.split(" ")[1];

function roundNumber(num, scale) {
  if(!("" + num).includes("e")) {
    return +(Math.round(num + "e+" + scale)  + "e-" + scale);
  } else {
    var arr = ("" + num).split("e");
    var sig = ""
    if(+arr[1] + scale > 0) {
      sig = "+";
    }
    return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
  }
}

function generateCSV(data) {
  const { SM1, SM2, FIN } = data;

  // Header row
  const header = ",SM1,SM2,FIN\n";

  // Data rows with labels
  const rows = [
      `Unweighted,${SM1[0]},${SM2[0]},${FIN[0]}`,
      `Weighted,${SM1[1]},${SM2[1]},${FIN[1]}`
  ].join("\n");

  return header + rows;
}


function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Define targetURL and ensure that the user is on the correct URL before injecting HTML (failsafe)
const targetURL = "https://skyward.iscorp.com/scripts/wsisa.dll/WService=";

// Make sure we're on skyward and at the gradebook
if (window.location.href.split(".")[1].startsWith(targetURL.split(".")[1]) && (window.location.href.endsWith("sfgradebook001.w") || window.location.href.endsWith("sfhome01.w"))) {
  injectGPA();

  document.getElementById("download-btn").addEventListener("click", () => {
      downloadCSV(csvData, `${studentName}_${(gradeYear-1) % 100}-${gradeYear % 100}_GPA`);
  });
}