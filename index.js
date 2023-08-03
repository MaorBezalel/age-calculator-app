// -------------------- VARIABLES --------------------
const dayInput = document.getElementById("day_input");
const monthInput = document.getElementById("month_input");
const yearInput = document.getElementById("year_input");

const dayOutput = document.getElementById("day_output");
const monthOutput = document.getElementById("month_output");
const yearOutput = document.getElementById("year_output");

const dateInputForm = document.querySelector(".date_input_form");

const rootStyles = getComputedStyle(document.documentElement);


// -------------------- MAIN --------------------
dateInputForm.addEventListener("submit", handleSubmit);


// -------------------- FUNCTIONS --------------------
function allowOnlyPositiveIntegerInput(event) {
    return (event.charCode != 8 && event.charCode == 0 || (event.charCode >= 48 && event.charCode <= 57))
}

function handleSubmit(event) {
    event.preventDefault();
    resetAllErrorSignals();
    resetLastAgeResults();

    if (isThereAnyEmptyField()) {
        return;
    }

    const validations = getValidationStatusesOfBirthDate(yearInput.value, monthInput.value, dayInput.value);

    if (!isValidBirthDateInput(validations)) {
        return;
    }

    const age = calculateAge(new Date(`${yearInput.value}-${monthInput.value}-${dayInput.value}`));

    yearOutput.innerHTML = age.years;
    monthOutput.innerHTML = age.months;
    dayOutput.innerHTML = age.days;

    console.log(`year: ${age.years}`);
    console.log(`month: ${age.months}`);
    console.log(`day: ${age.days}`);
}

function resetAllErrorSignals() {
    let parent = dayInput.parentElement;
    parent.querySelector("label").style.color = rootStyles.getPropertyValue("--clr-smokey-grey");
    parent.querySelector("input").style.borderColor = rootStyles.getPropertyValue("--clr-light-grey");
    parent.querySelector("small").style.visibility = "hidden";

    parent = monthInput.parentElement;
    parent.querySelector("label").style.color = rootStyles.getPropertyValue("--clr-smokey-grey");
    parent.querySelector("input").style.borderColor = rootStyles.getPropertyValue("--clr-light-grey");
    parent.querySelector("small").style.visibility = "hidden";

    parent = yearInput.parentElement;
    parent.querySelector("label").style.color = rootStyles.getPropertyValue("--clr-smokey-grey");
    parent.querySelector("input").style.borderColor = rootStyles.getPropertyValue("--clr-light-grey");
    parent.querySelector("small").style.visibility = "hidden";
}

function resetLastAgeResults() {
    yearOutput.innerHTML = "- -";
    monthOutput.innerHTML = "- -";
    dayOutput.innerHTML = "- -";

}

function isThereAnyEmptyField() {
    let result = false;

    console.log(`year: ${yearInput.value}`);
    console.log(`month: ${monthInput.value}`);
    console.log(`day: ${dayInput.value}`);

    if (!dayInput.value) {
        result = true;

        const parent = dayInput.parentElement;

        parent.querySelector("label").style.color = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("input").style.borderColor = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("small").innerText = "This field is required";
        parent.querySelector("small").style.visibility = "visible";
    }

    if (!monthInput.value) {
        result = true;

        const parent = monthInput.parentElement;

        parent.querySelector("label").style.color = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("input").style.borderColor = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("small").innerText = "This field is required";
        parent.querySelector("small").style.visibility = "visible";
    }

    if (!yearInput.value) {
        result = true;

        const parent = yearInput.parentElement;

        parent.querySelector("label").style.color = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("input").style.borderColor = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("small").innerText = "This field is required";
        parent.querySelector("small").style.visibility = "visible";
    }

    return result;
}

function getValidationStatusesOfBirthDate(year, month, day) {
    // Check if the date components are valid
    const isValidMonth = !isNaN(month) && month >= 1 && month <= 12;
    const isValidDay = !isNaN(day) && day >= 1 && day <= new Date(year, month, 0).getDate();
  
    // Check if the date is not in the future
    const currentDate = new Date();
    const inputDate = new Date(year, month - 1, day); // Month is 0-indexed
  
    const isPastDate = inputDate.getTime() <= currentDate.getTime();

    return {
        isValidMonth: isValidMonth,
        isValidDay: isValidDay,
        isPastDate: isPastDate
    };
}

function isValidBirthDateInput(validations) {
    if (!validations.isValidDay) {
        const parent = dayInput.parentElement;

        parent.querySelector("label").style.color = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("input").style.borderColor = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("small").innerText = "Must be a valid day";
        parent.querySelector("small").style.visibility = "visible";
    }
    
    if (!validations.isValidMonth) {
        const parent = monthInput.parentElement;

        parent.querySelector("label").style.color = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("input").style.borderColor = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("small").innerText = "Must be a valid month";
        parent.querySelector("small").style.visibility = "visible";
    }

    if (!validations.isPastDate) {
        const parent = yearInput.parentElement;

        parent.querySelector("label").style.color = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("input").style.borderColor = rootStyles.getPropertyValue("--clr-light-red");
        parent.querySelector("small").innerText = "Must be in the past";
        parent.querySelector("small").style.visibility = "visible";
    }

    return validations.isValidMonth && validations.isValidDay && validations.isPastDate;
}

function calculateAge(birthDate) {
    const currentDate = new Date();
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();
  
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
  
    let years = currentYear - birthYear;
    let months = currentMonth - birthMonth;
    let days = currentDay - birthDay;
  
    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
  
    if (days < 0) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      days += new Date(currentYear, prevMonth + 1, 0).getDate();
      months--;
    }
  
    return {
      years: years,
      months: months,
      days: days
    };
}