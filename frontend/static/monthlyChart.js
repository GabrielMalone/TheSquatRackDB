
import { f } from "./lifterActions.js";
import { config } from "./config.js";
import { months } from "./config.js";
//-----------------------------------------------------------------------------
// method to get the monthly training volume for the main compounds plus accessory
//-----------------------------------------------------------------------------
export function loadMonthlyCharts(idUser, month, year){
    // not really worth having this as one method, 
    //need to be able to customize the chart for each query more easily
    let chartNumber = 1;

    const types = 
    [ ["monthlyVolume",  `${months[month]} ${year} Volume`,    ["monthly volume", "bar"]], 
    ["monthlyFrequency", `${months[month]} ${year} Frequency`, ["monthly frequency", "line"]], 
    ["monthlyInetensity",`${months[month]} ${year} Inetensity`,["monthly intensity", "bar"]]]

    types.forEach(type=>{
        const ExerciseCategories = ["squat","bench","deadlift", "accessory"]
        f.post(config[`${type[0]}`], {idUser, ExerciseCategories, month, year})
        .then(categories=>{
            createChartElement(type[0], type[1], chartNumber);
            const data = categories.result.map(data=>data);
            const dataTotals = data.reduce((accumulator, data)=>{
                return accumulator+=data
            },0); // might use the total data in the future
            // need to pull draChart out of loop in future if want 
            // the order tos tay consistent in output
            drawChart(type[1], data, `chart${type[0]}`, type[2][1]);  
            chartNumber ++ ;
        });
    })
}
//-----------------------------------------------------------------------------
// create the HTML element that will hold the chart display
//-----------------------------------------------------------------------------
function createChartElement(chartType, chartTitle, chartNumber){

    const monthlyChartDash = document.querySelector(".monthlyChartDash");
    const chart = document.createElement("div");
    chart.classList.add("monthlyChartWrapper");
    chart.setAttribute("id", `monthlychartWrapper${chartNumber}`);
    chart.classList.add("monthlyChartWrapperVisible");
    chart.insertAdjacentHTML("beforeend",
        `<div class="monthlyChartTitle">${chartTitle} 
            <div class="${chartType}Total"></div>
        </div>
        <canvas class="monthlyChart" id="chart${chartType}"></canvas>`);
        monthlyChartDash.appendChild(chart); 
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
                    to: 0,
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
                  align: "center",
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
                            // can set conditionals here for data type
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
    const monthlyChartDash = document.querySelector(".monthlyChartDash"); 
    monthlyChartDash.innerHTML = ``;
    const chart = document.querySelector(".monthlyChart");
    if (chart){
        Chart.getChart(chart)?.destroy();
    }
}