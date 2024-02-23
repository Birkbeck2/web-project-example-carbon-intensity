
//empty arrays which allow data to be pushed into them// 


let APIData = [];
let forecastAPIData = [];
let carbonDataActual = [];
let jsonDates = [];

let selectedDate

let lowInsensity = 100;

let myLineGraph;


function getDate() {
  const datePicker = document.getElementById("date");
  selectedDate = datePicker.value;
  console.log(selectedDate);
}



//this event listener and function allows the page to reload - which will then reset the chart.js historic graph, allowing users to change the date//


const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", function() {
  location.reload();
});


//used to find the current carbon intensity rate// 

function lastItem(array) {
  let data = array[array.length - 1];
  return data
}


// used to produce the margin of error data point// 

function marginOfError(current, forecasted) {
  return current - forecasted
}

//a function that easily variables to be inserted into the DOM// 

function changingHTMLtoValue(id, value) {
  document.getElementById(id).innerHTML = value;
}


//removes an array value this will be used later to remove the values created by a fetch API function // 

function removeDataFromArray(arr) {
  arr.splice(0, arr.length);
}


//buttons to control what is displayed// 


//this section of code refers to the options bar, and the different stylings which will occur when the options bar is opened or closed// 


const carbonDescription = document.getElementById('descriptionbox'); 

const infoButton = document.getElementById("carbonintensityinfo");

function showDescription ()  {
  carbonDescription.style.display = "block";
  }
 

const mainArea = document.getElementById('grid-container');

const sideMenu = document.querySelector("aside");

const menuBtn = document.getElementById('menubtn');
const closeBtn = document.getElementById('closebtn');

const mainItems =document.getElementsByClassName('mainsection-item')

//this code adds an event listener to the menu button, which then returns the styling to its original format. // 

menuBtn.addEventListener('click', () => {
  sideMenu.style.display = 'block';
  mainArea.style.gridTemplateColumns = '20% 80%'
  mainArea.style.paddingLeft = '20px'; 
})

//this event listener  closes the options bar, and restyles the dashboard, so that it is able to take up the whole screen// 

closeBtn.addEventListener('click', () => {
  sideMenu.style.display = 'none';
  mainArea.style.gridTemplateColumns = '100%';
  mainArea.style.paddingLeft = '40px';
 
})






//hiding and showing the displays found on the left hand side// 


function toggleContent() {
  var checkbox = document.getElementById("checkboxone");
  var content = document.getElementById("currentdataforecast");
  if (checkbox.checked) {
    content.style.display = "block";
  } else {
    content.style.display = "none";
  }
}
toggleContent(); 
document.getElementById("checkboxone").addEventListener("change", toggleContent)


function toggleContent2() {
  var checkbox = document.getElementById("checkboxtwo");
  var content = document.getElementById("currentgenerationmix");
  if (checkbox.checked) {
    content.style.display = "block";
  } else {
    content.style.display = "none";
  }
}
toggleContent2(); 
document.getElementById("checkboxtwo").addEventListener("change", toggleContent2)


function toggleContent3() {
  var checkbox = document.getElementById("checkboxthree");
  var content = document.getElementById("forecasthigh");
  if (checkbox.checked) {
    content.style.display = "block";
  } else {
    content.style.display = "none";
  }
}
toggleContent3(); 
document.getElementById("checkboxthree").addEventListener("change", toggleContent3)



//this function allows the creation of an array which adds to the array. I was inspired by this https://stackoverflow.com/questions/72780223/for-loop-to-generate-time-list-in-javascript thread in Stackoverflow, which offered advice on how to create basic functions//


function generateTimeArray() {
  let timeArray = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of ['00', '30']) {
      timeArray.push(`${hour.toString().padStart(2, '0')}:${minute}`);
    }
  }
  return timeArray;
}

let timeArray = generateTimeArray();
console.log(timeArray);



// fetching the carbon data from the API, which is within JSON format and then moving the data from a local variable into a global variable, which can then be manipulated outside of a code block// 



fetch('https://api.carbonintensity.org.uk/intensity/date')
  .then(response => {
    let objectCarbon = response.json();
    return objectCarbon;

  })

  // Once the data has been parsed from a json format to a javascript format, the arrays are located with an object. To work with this data, i decided to extract the data and push it to an empty array which is defined at the start of the code. // 

  //I repeated this for the different datasets that I wanted to use//

  .then(carbonData => {
    let carbonDataNew = carbonData.data;
    for (let i = 0; i < carbonDataNew.length; i++) {
      const forecastData = carbonDataNew[i].intensity.forecast;
      forecastAPIData.push(forecastData);
    }

    for (let i = 0; i < carbonDataNew.length; i++) {
      const carbonDataActualArray = carbonDataNew[i].intensity.actual;
      carbonDataActual.push(carbonDataActualArray);

    }
    for (let i = 0; i < carbonDataNew.length; i++) {
      const carbonDataActualArray = carbonDataNew[i].from;
      jsonDates.push(carbonDataActualArray);
    }

    console.log(forecastAPIData);
    console.log(carbonDataActual);

    function objtoArray(obj) {
      return Object.values(obj)
    }
    let forecastAPIDataArray = objtoArray(forecastAPIData)


    let forecastAPIDataMax = Math.max(...forecastAPIDataArray);
    let carbonDataActualArrayTwo = Object.values(carbonDataActual)

    console.log(carbonDataActualArrayTwo);

    //As the data is live, there are some values that are null. I, therefore, used the filter method with a function to remove the the null parts of the dataset, so that that the graphs, which are created later on have better data sets. // 

    let carbonDataFiltered = carbonDataActualArrayTwo.filter(function (value) {
      return value !== null;
    });

    console.log(carbonDataFiltered);



    // This part of the code uses a simple function that was defined earlier to find the most recent data point// 


    let CarbonDataLastItem = lastItem(carbonDataFiltered);

    //

    let forecastAPIDataLastItem = lastItem(forecastAPIData);

    console.log(CarbonDataLastItem);
    console.log(forecastAPIDataLastItem);

    //I then input the data set using the Inner HTML method to a ID element within the HTML document. 

    document.getElementById('3').innerHTML = CarbonDataLastItem;

    let indexofCarbonDataFiltered = carbonDataFiltered.length;

    //As I wanted to create a comparison between the live and forecast data sets, I used the index values as a way to measure when the data was added to the array//

    //I then find the current carbon index number and then compare against the forecast api number.//

    let forecastAPIDataPredicted = forecastAPIDataArray[indexofCarbonDataFiltered];


    console.log(forecastAPIDataPredicted);


    changingHTMLtoValue(4, forecastAPIDataPredicted);


    let currentMarginofError = marginOfError(CarbonDataLastItem, forecastAPIDataPredicted);

    changingHTMLtoValue(5, currentMarginofError);

    //I used Chart.js to construct a simple line graph, which uses the arrays that were defined earlier in this section. // 


    const ctx2 = document.getElementById("myLineGraph").getContext("2d");

    let myLineGraph = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: timeArray,
        datasets: [{
          label: 'Forecast Carbon Intensity',
          data: forecastAPIData,
          borderColor: 'red',
          borderWidth: 2,
          fill: false
        }, {
          label: 'Carbon Intensity',
          data: carbonDataFiltered,
          borderColor: 'blue',
          borderWidth: 2,
          fill: false
        }]
      },
    });





//this block of code finds the maximum data within this array, and then plugs this into the DOM. // 
    let carbonDataMax = Math.max(...carbonDataActualArrayTwo);

    let carbonMaxText = document.getElementById('1')
    carbonMaxText.innerHTML = carbonDataMax;


    //the if statements defines whether the colour of the variable changes depending on whether it is above a certain amount. // 

    if (carbonDataMax > lowInsensity) {
      document.getElementById('1').style.color = "red";
    } else if (carbonData < 100) {
      document.getElementById('1').style.color = "green";
    }

    if (carbonDataMax > lowInsensity) {
      document.getElementById('2').innerHTML = 'high'
    } else if (carbonData < lowInsensity) {
      document.getElementById('2').innerHTML = 'low';
    }

  })

//Fetch generation mix data, showing the different generators of electricity at a given moment//

/* I am parsing the data from a Json format to javascript, and then converting the data into arrays, which can then be manipulated to create data visualisations. */

fetch('https://api.carbonintensity.org.uk/generation')
  .then(responseGeneration => {
    let generationMix = responseGeneration.json();
    return generationMix;
  })
  .then(carbonGeneration => {

    //create an array with this data within// 

    const labels = [];
    const values = [];

    let carbonGenerationArray = carbonGeneration.data.generationmix;

    //this for loop extracts the values from an object and pushes them into an empty array, which is defined above within this function)

    for (let i = 0; i < carbonGenerationArray.length; i++) {
      labels.push(carbonGenerationArray[i].fuel);
    }
    for (let i = 0; i < carbonGenerationArray.length; i++) {
      values.push(carbonGenerationArray[i].perc);
    }

//created pie chart using chart.js. I have also plugged in the two arrays which i have extracted above into the pie chart. 

    const ctx = document.getElementById("myPieChart").getContext("2d");
    const myPieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          label: "Electricity Generation Mix",
          data: values,
          backgroundColor: ["rgba(255, 204, 204, 1) ",
          "rgba(204, 255, 204, 1) ",
          "rgba(204, 204, 255, 1)",
          "rgba(255, 255, 204, 1",
          "rgba(255, 204, 255, 1) ",
          "rgba(204, 255, 255, 1)",
          "rgba(255, 230, 204, 1) ",
          "rgba(230, 255, 204, 1)",
          "rgba(255, 204, 230, 1)"
          ],

          borderColor: "rgba(0, 0, 0, 1)",
          borderWidth: 2
        }]
      },
    });



    console.log(values);
    console.log(labels);

  })



  //I have created a function which is called when the submit button is pressed on the page// 
  //this function takes the date value and and then adds this to the end of the URL so that the data from a particular date is sourced.
  //Once found it then plugs this into the fetch function, allowing the specific code to be found. // 


const datePicker = document.getElementById("date");
const button = document.getElementById("btn");

function newData() {
  const selectedDate = datePicker.value;
  const baseUrl = "https://api.carbonintensity.org.uk/intensity/date/";
  let url = baseUrl + selectedDate;


  /*As I have copied large areas of the code above including the same variable names, I needed to remove the datasets so that whenever the historical data changes, it does not impact the current datasets, so when this function is activated, I removed the current data.*/


  removeDataFromArray(carbonDataActual);
  removeDataFromArray(forecastAPIData);

  // Make a fetch call to the updated URL
  fetch(url)
    .then(response => {
      let objectCarbon = response.json();
      return objectCarbon;

    })
    .then(carbonData => {
      let carbonDataNew = carbonData.data;

      for (let i = 0; i < carbonDataNew.length; i++) {
        const carbonDataActualArray = carbonDataNew[i].intensity.actual;
        carbonDataActual.push(carbonDataActualArray);

      }

      let carbonDataActualArrayTwo = Object.values(carbonDataActual)

      console.log(carbonDataActualArrayTwo);

      let carbonDataFiltered = carbonDataActualArrayTwo.filter(function (value) {
        return value !== null;
      });

      console.log(carbonDataFiltered);


      let carbonDataMax = Math.max(...carbonDataActualArrayTwo);

      let carbonMaxText = document.getElementById('historic1')
      carbonMaxText.innerHTML = carbonDataMax;


      if (carbonDataMax > lowInsensity) {
        document.getElementById('historic1').style.color = "red";
      } else if (carbonData < 100) {
        document.getElementById('historic1').style.color = "green";
      }

      if (carbonDataMax > lowInsensity) {
        document.getElementById('historic2').innerHTML = 'high'
      } else if (carbonData < lowInsensity) {
        document.getElementById('historic2').innerHTML = 'low';
      }

      console.log(carbonDataMax)
   

      var myLineGraph = document.getElementById("historicdatagraph")


      const ctx3 = document.getElementById("historicdatagraph").getContext("2d")

      let myLineGraph2 = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: timeArray,
          datasets: [{
            label: 'Carbon Intensity',
            data: carbonDataFiltered,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false
          }]
        },
      });




    });

};



