// creating the array for how many people come
const peopleArray = [];

// an array that will store objects representing each person
const peopleData = [];

// function to load data from local storage
function loadDataFromLocalStorage() {
  const storedData = localStorage.getItem('peopleData');

  if (storedData) {
    const parsedData = JSON.parse(storedData);
    peopleData.push(...parsedData);
  }
}

// function to save data to local storage
function saveDataToLocalStorage() {
  localStorage.setItem('peopleData', JSON.stringify(peopleData));
}

// function for adding the people to array and data
function addPeople() {
  const inputForPeopleElement = document.querySelector('.howManyPeople');
  const people = Number(inputForPeopleElement.value);

  // adding the number of people to the array (including the name and time)
  for (let i = 0; i < people; i++) {
    peopleArray.push(i);
    peopleData.push({
      name: '',
      time: 0,
    });
  }

  // doing the value 0/nothing when user gonna inputs new people 
  inputForPeopleElement.value = '';

  // calling the 2 functions when adding the people
  updateTimers();
  howManyHours();

  // save data to local storage
  saveDataToLocalStorage();
}

/* reading the button by the id and if user clicks
it does two actions  
*/
let acceptButton = document.getElementById('js-accept');
acceptButton.addEventListener('click', addPeople);
acceptButton.addEventListener('click', acceptedClickForPeople);

/*
creating function for knowing if user clicks innit 
the button changes 
*/
function acceptedClickForPeople() {
  const changeAcceptanceElement = document.querySelector('.accept');
  if (changeAcceptanceElement.innerText === 'Принять') {
    changeAcceptanceElement.innerText = 'Принято';
  }
  // add a setTimeout function to revert the button text after a delay
  setTimeout(function () {
    changeAcceptanceElement.innerText = 'Принять';
  }, 1000); // Change the delay value (in milliseconds) as needed
}

// doing the same function but for names
function acceptedClickForName(buttonChangeElement) {
  const changedButtonForName = buttonChangeElement;
  if (changedButtonForName.innerText === 'Сохранить') {
    changedButtonForName.innerText = 'Сохранено';
    setTimeout(function () {
      changedButtonForName.innerText = 'Сохранить';
      clearNameInput(buttonChangeElement);
    }, 1000);
  }
}

// function to clear the name input field
function clearNameInput(buttonChangeElement) {
  const inputForNameElement = buttonChangeElement.parentNode.querySelector('.inputForName');
  inputForNameElement.value = '';
}

// same as usual but for time button changing
function acceptedClickForTime(buttonChangeElementForTime) {
  const changedButtonForTime = buttonChangeElementForTime;
  if (changedButtonForTime.innerText === 'Добавить время') {
    changedButtonForTime.innerText = 'Добавлено';
  }
  setTimeout(function () {
    changedButtonForTime.innerText = 'Добавить время';
    clearTimeInput(buttonChangeElementForTime);
  }, 1000);
}

// function to clear the minutes input field
function clearTimeInput(buttonChangeElementForTime) {
  const inputForTimeElement = buttonChangeElementForTime.parentNode.querySelector('.inputForTime');
  inputForTimeElement.value = '';
}

function acceptedClickForDeleteTime(buttonDeleteTimeElements) {
  const changedButtonForDeleteTime = buttonDeleteTimeElements;
  if (changedButtonForDeleteTime.innerText === 'Удалить время') {
    changedButtonForDeleteTime.innerText = 'Удалено';
  }
  setTimeout(function () {
    changedButtonForDeleteTime.innerText = 'Удалить время';
  }, 1000);
}

function acceptedClickForDelEverything() {
  const acceptedOrNot = document.querySelector('.delete-btn');
  if (acceptedOrNot.innerText === 'Удалить всё') {
    acceptedOrNot.innerText = 'Удалено';
  }
  setTimeout(function () {
    acceptedOrNot.innerText = 'Удалить всё';
  }, 1000);
}

// creating a function for showing the name that user inputted
function showTheName(buttonChangeElement) {
  const inputForNameElement = buttonChangeElement.parentNode.querySelector('.inputForName');
  const showNameElement = buttonChangeElement.parentNode.querySelector('.showName');
  showNameElement.textContent = inputForNameElement.value;
}

// function is responsible for updating the HTML display
function howManyHours() {
  const htmlContainer = document.querySelector('.js-howManyHours'); // getting the div 
  htmlContainer.innerHTML = ''; // Clear the existing HTML

  peopleData.forEach((person, index) => {
    const personHtml = `
      <p class = "personIndex">${index + 1} человек</p>
      <div id="timer-${index}" class="timer">
        <input placeholder="Имя" class="inputForName" value="${person.name}" onkeydown="handleNameInput(event, ${index})">
        <button class="buttonChange" id="js-buttonChange">Сохранить</button>
        <div>
          <p class="showName">${person.name}</p>
          <p class="timerValue">${formatTime(person.time)}</p>
        </div>
        <input placeholder="Минуты" class="inputForTime" onkeydown="handleTimeInput(event, ${index})">
        <button class="buttonForTimer" id="js-buttonForTimer">Добавить время</button>
        <button class="buttonForDeleteTime" id="js-buttonForDeleteTime">Удалить время</button>
      </div>
    `;

    htmlContainer.innerHTML += personHtml;   // combining all of the html together
  });

  // queries will return a NodeList containing all the elements that match the selector
  // the resulting NodeList is then stored in the variables buttonChangeElements and buttonForTimes
  const buttonChangeElements = document.querySelectorAll('.buttonChange');
  const buttonForTimes = document.querySelectorAll('.buttonForTimer');
  const buttonDeleteTimeElements = document.querySelectorAll('.buttonForDeleteTime');

  buttonDeleteTimeElements.forEach((buttonDeleteTime, index) => {
    buttonDeleteTime.addEventListener('click', () => {
      acceptedClickForDeleteTime(buttonDeleteTime);
      peopleData[index].time = 0; // Reset the time to 0
      updateTimerInterval(index); // Update the timer interval

      // save data to local storage
      saveDataToLocalStorage();
    });
  });

  /*using the forEach for iterate each element in the buttonChangeElements array, that contains
  collection of buttons with the class buttonChange
  */
  buttonChangeElements.forEach((buttonChangeElement, index) => {
    buttonChangeElement.addEventListener('click', () => {
      acceptedClickForName(buttonChangeElement); // changing the name of the button when user clicks it
      showTheName(buttonChangeElement); // showing the name that user inputted
      //  it selects the input element with the class "inputForName" that is a sibling of the clicked button
      const inputForNameElement = buttonChangeElement.parentNode.querySelector('.inputForName');
      peopleData[index].name = inputForNameElement.value; // this allows to store and update the name associated with each button or person

      // save data to local storage
      saveDataToLocalStorage();
    });
  });

  // doing the same but for buttonForTime
  buttonForTimes.forEach((buttonForTime, index) => {
    buttonForTime.addEventListener('click', () => {
      acceptedClickForTime(buttonForTime); // changing the button time
      //  it selects the input element with the class "inputForTime" that is a sibling of the clicked button
      const inputForTimeElement = buttonForTime.parentNode.querySelector('.inputForTime');
      //  selects the element with the class "timerValue" that is a sibling of the clicked button
      const timerValueElement = buttonForTime.parentNode.querySelector('.timerValue');
      // retrieves the value entered in the input element and converts it to a number using the Number function
      const minutes = Number(inputForTimeElement.value);

      //  checks if the minutes value is a valid number and greater than zero. 
      if (!isNaN(minutes) && minutes > 0) {
        const secondsToAdd = minutes * 60;
        peopleData[index].time += secondsToAdd; // this updates the total time associated with the person
        // function is responsible for updating the timer interval for the person at the given index, ensuring that the timer continues to count down
        updateTimerInterval(index);

        // save data to local storage 
        saveDataToLocalStorage();
      }
    });
  });
}

// this function helps to maintain the running timers for each person even after adding new people
function updateTimers() {
  peopleData.forEach((person, index) => {
    if (person.time > 0) {
      updateTimerInterval(index);
    }
  });
}

function updateTimerInterval(index) {
  //  it retrieves the person object at the specified index from the peopleData array and assigns it to the person variable
  const person = peopleData[index];

  //  ensuring that any existing timer interval for the person is stopped before creating a new one
  clearInterval(person.timerInterval);

  if (person.time > 0) {
    person.timerInterval = setInterval(() => {
      person.time--;

      // this allows updating the displayed timer value
      const timerValueElement = document.querySelector(`#timer-${index} .timerValue`);
      //  this reflects the current time remaining for the person
      timerValueElement.textContent = formatTime(person.time);

      // if the condition is true, timer interval is cleared and displaying the message
      if (person.time <= 0) {
        clearInterval(person.timerInterval);
        timerValueElement.textContent = 'Время закончилось!';

        // add sound effect
        playSound();
      }
    }, 1000);
  } else {
    // timer is reset, update the display to 00:00:00
    const timerValueElement = document.querySelector(`#timer-${index} .timerValue`);
    timerValueElement.textContent = '00:00:00';
  }
}

// function for HH:MM:SS converting
function formatTime(seconds) {
  // just straight math
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  /*
  It converts the hours into a string representation and uses the padStart 
  method to ensure that the string is at least two characters long.
  If the string is shorter than two characters, it pads it with a leading '0'.
  */
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// function to handle keydown event for name input
function handleNameInput(event, index) {
  if (event.key === 'Enter') {
    const buttonChangeElement = document.querySelector(`#timer-${index} .buttonChange`);
    acceptedClickForName(buttonChangeElement); // changing the name of the button when user clicks it
    showTheName(buttonChangeElement); // showing the name that user inputted
    const inputForNameElement = event.target;
    peopleData[index].name = inputForNameElement.value; // this allows to store and update the name associated with each button or person

    // save data to local storage
    saveDataToLocalStorage();
  }
}

// function to handle keydown event for time input
function handleTimeInput(event, index) {
  if (event.key === 'Enter') {
    const buttonForTime = document.querySelector(`#timer-${index} .buttonForTimer`);
    acceptedClickForTime(buttonForTime); // changing the button time
    const inputForTimeElement = event.target;
    const timerValueElement = document.querySelector(`#timer-${index} .timerValue`);
    const minutes = Number(inputForTimeElement.value);

    if (!isNaN(minutes) && minutes > 0) {
      const secondsToAdd = minutes * 60;
      peopleData[index].time += secondsToAdd; // this updates the total time associated with the person
      updateTimerInterval(index);

      // save data to local storage 
      saveDataToLocalStorage();
    }
  }
}

// load data from local storage
loadDataFromLocalStorage();
// update the timers and display
updateTimers();
howManyHours();


const inputForPeopleElement = document.querySelector('.howManyPeople');
// getting the addEventListener for 'keydown' and Enter its 13 button
inputForPeopleElement.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    acceptButton.click();
  }
});


// function to delete all people and their timers
function deleteAllPeople() {
  // clear the arrays
  peopleArray.length = 0;
  peopleData.length = 0;

  // clear the local storage
  localStorage.removeItem('peopleData');

  // update the timers and display
  updateTimers();
  howManyHours();
}

// tet the delete button element
const deleteButton = document.getElementById('js-delete-btn');
deleteButton.addEventListener('click', deleteAllPeople);
deleteButton.addEventListener('click', acceptedClickForDelEverything);

// function to play sound effect
function playSound() {
  const audio = new Audio('sound-effect.wav');
  audio.play();
}

