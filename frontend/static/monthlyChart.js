
import { f } from "./lifterActions.js";
import { config } from "./config.js";

const calendarWrapper  = document.querySelector(".calendarWrapper");
//-----------------------------------------------------------------------------
// method to get the monthly training volume for the main compounds plus accessory
//-----------------------------------------------------------------------------
export function loadMonthlyCharts(idUser, month, year){


    let chartNumber = 1;

    const types = [ ["monthlyVolume",    ["monthly volume", "bar"]], 
                    ["monthlyFrequency", ["monthly frequency", "line"]], 
                    ["monthlyInetensity",["monthly intensity", "bar"]]  ]

    types.forEach(type=>{
        const ExerciseCategories = ["squat","bench","deadlift", "accessory"]
        f.post(config[`${type[0]}`], {idUser, ExerciseCategories, month, year})
        .then(categories=>{
            createChartElement(type[0], type[1][0], chartNumber);
            const data = categories.result.map(data=>data);
            const dataTotals = data.reduce((accumulator, data)=>{
                return accumulator+=data
            },0); // might use the total data in the future
            drawChart(type, data, `chart${type[0]}`, type[1][1]);  
            chartNumber ++ ;
        });
    })
}
//-----------------------------------------------------------------------------
// create the HTML element that will hold the chart display
//-----------------------------------------------------------------------------
function createChartElement(chartType, chartTitle, chartNumber){
    const monthlyChartDash = [...document.querySelectorAll(".monthlyChartDash")];
    const chart = document.createElement("div");
    chart.classList.add("monthlyChartWrapper");
    chart.setAttribute("id", `monthlychartWrapper${chartNumber}`);
    chart.classList.add("monthlyChartWrapperVisible");
    chart.insertAdjacentHTML("beforeend",
        `<div class="monthlyChartTitle">${chartTitle} 
            <div class="${chartType}Total"></div>
        </div>
        <canvas class="monthlyChart" id="chart${chartType}"></canvas>`);
    // if the chartnumber is evenly divisble by 3, start a new column
    if (chartNumber % 3 === 0){
        const newChartWrapper = document.createElement('div');
        newChartWrapper.classList.add("monthlyChartDash");
        calendarWrapper.appendChild(newChartWrapper);
        newChartWrapper.appendChild(chart);
    } else {
        monthlyChartDash.at(-1).appendChild(chart); 
    }
}
//-----------------------------------------------------------------------------
// This is the logic for clicking the addLifter button. makes add window appear
//-----------------------------------------------------------------------------
function drawChart(chartTitle, liftsData, graphElement, graphType){

    const squatData     = liftsData[0];
    const benchData     = liftsData[1];
    const deadliftData  = liftsData[2];
    const accessoryData = liftsData[3];
   
    // Create a chart
    const ctx = document.getElementById(`${graphElement}`).getContext('2d');
    const chart = new Chart(ctx, {
        type: graphType, 
    
        data: {
            // can call a function like data.map(row => row.year) to make the labels array
            labels: ['Squat', 'Bench', 'Deadlift', 'Accessory'],
            
            datasets: [
                // can have multiple sets of data to overlap
                {
                label: chartTitle,
                // can also call a function like data: data.map(row => row.count) to make the data array
                data: [squatData, benchData, deadliftData, accessoryData],
        
                backgroundColor: [
                    'palegreen',
                    'paleturquoise',
                    'palegoldenrod',
                    'palevioletred',
                ],
                borderColor: [
                    'palegreen',
                    'paleturquoise',
                    'palegoldenrod',
                    'palevioletred',
                ],
                borderWidth: 1
                }
            ]
        },

        options: {

            aspectRatio: 2,
            animations : {
                tension: {
                    duration: 400,
                    easing: 'easeInSine',
                    from: 1,
                    to: 0.25,
                    loop: false
                }
            },

            plugins: {

                legend: {
                  display: false,
                  labels: {
                    // remove the little color box next to the title of the chart
                    generateLabels: hideLegendBoxes,
                    color: "mintcream",
                  },
                  align: "start",
                },

                tooltip: {
                    enabled: true
                }
            },

            scales: {

                y: {
                    display: false,
                    beginAtZero: true,
                    // max: totalVolume,
                    ticks: {
                            stepSize: 1000,
                            precision: 0,  // No decimal places
                            callback: value => `${Math.ceil(value/100)}k lbs`,
                            color: "mintcream",
                            padding: 0
                         }
                },
                x: {
                    offset: true,
                    ticks : {
                        align: 'center',
                        padding: 5,
                        color: "gray"
                    }
                }
            },

            layout: {

                padding: 0
            }
        }
    
    });    
}

//-----------------------------------------------------------------------------
// This is the logic for clicking the addLifter button. makes add window appear
//-----------------------------------------------------------------------------
function hideLegendBoxes(chart) {
    return Chart.defaults.plugins.legend.labels.generateLabels(chart).map(label => (
        {
        ...label,                      // spread all the oringal label properties
        fillStyle: 'transparent',                        // and just change these
        strokeStyle: 'transparent',
        lineWidth: 0
        })
    );
  }
//-----------------------------------------------------------------------------
// method to clear the charts from the main dashboard when needed
//-----------------------------------------------------------------------------
export function clearCharts(){
    const monthlyChartWrapper = document.querySelectorAll(".monthlyChartDash"); 
    if (monthlyChartWrapper.length > 1){
        const calendarWrapper  = document.querySelector(".calendarWrapper");
        let dashes = document.querySelectorAll(".monthlyChartDash");
        // clearing out the dashes involves removing monthlyChartDashes 
        // (multiple of them exist to be stacked 2 at a time)
        dashes.forEach(dash=>{ 
            calendarWrapper.removeChild(dash);
        });
        // when done need to reattach one dash to be able to hold future graphs
        calendarWrapper.insertAdjacentHTML("beforeend", `<div class="monthlyChartDash"></div>`);
    }
    const chart = document.querySelector(".monthlyChart");
    if (chart){
        Chart.getChart(chart)?.destroy();
    }
}