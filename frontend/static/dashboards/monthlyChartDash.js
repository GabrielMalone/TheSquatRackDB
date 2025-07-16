
import { currLifter, f } from "../lifterSidebar.js";
import { MONTHLY_CHARTS_DASH_VARIABLES as c, endpoint as e } from "../config.js";
import { months } from "../config.js";

let curmonth;
let curyear;

//-----------------------------------------------------------------------------
// get monthly training volume/intensity/frequency for main compounds/accessory
//-----------------------------------------------------------------------------
export async function loadMonthlyCharts(idUser, month, year){
    curmonth = month;
    curyear = year;
    let chartNumber = 1;
    clearCharts();
    const types = 
    [ ["monthlyVolume",  `${months[month]} ${year} Volume`,    ["monthly volume", "bar"]], 
    ["monthlyFrequency", `${months[month]} ${year} Frequency`, ["monthly frequency", "doughnut"]], 
    ["monthlyInetensity",`${months[month]} ${year} Inetensity`,["monthly intensity", "line"]]]

    for (const type of types) {
        // enhanced for loop istead of foreach, foreach will not pause ierations for the async stuff
        const ExerciseCategories = ["squat","bench","deadlift", "accessory"]

        try {
        
            const response = await f.post(e[`${type[0]}`], {idUser, ExerciseCategories, month, year});
            // returns a promise and pauses code until promise resolves. otherwise the order is not guaranteed
            const categories = response;
    
            createChartElement(type[0], type[1], chartNumber);
            const data = categories.result.map(data=>data);
            const dataTotals = data.reduce((accumulator, data)=>{
                return accumulator+=data
            },0);
            if (dataTotals === 0) {
                const monthlyChartDash = document.querySelector(".monthlyChartDash");
                monthlyChartDash.innerHTML = ``;
                return;
            }
            drawChart(type[1], data, `chart${type[0]}`, type[2][1]);  
            chartNumber ++ ;
  
        } catch (err) {
            console.error(err);
        }
    }  
    buildChartHeader(); 
    
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
function buildChartHeader(){
    const chart = document.querySelector(`.monthlyChartDashWrapper`);
    chart.insertAdjacentHTML("afterbegin",
        `<div class="${c.mChartDashHeaderClass}" id="${c.mChartDashHeaderId}">
            <div class="${c.mChartDashHeaderTitleClass}">${c.mChartDashText}</div>
            <div class="${c.mChartMinimizerClass}" id="${c.mChartMinimizerId}">${c.mChartMinimizerIcon}</div>
        </div>`);
    const width = chart.offsetWidth;
    const mChartDashHeader = document.querySelector(`.${c.mChartDashClass}`);
    mChartDashHeader.style.width = `${width}px`;
    const miniMizer = document.getElementById(c.mChartMinimizerId);
    miniMizer.addEventListener("click", minimizeMchartDash);
}
function minimizeMchartDash(){
    const mChartDash = document.querySelector(`.${c.mChartDashClass}`);
    mChartDash.classList.toggle(`${c.mChartDashClassVisible}`);
    // if dont reload after minimize, the charts redraw too small, dunno why
    if (!mChartDash.classList.contains("monthlyChartDashVisible")){
        clearCharts();
        loadMonthlyCharts(currLifter.id, curmonth, curyear);
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
   
    const xAxisConfig =
        {
            display: true,
            offset: true,
            ticks : {
                align: 'center',
                padding: 5,
                color: "gray"
            }
        }

    if (graphType === "doughnut"){
        xAxisConfig.display = false;
    }

    // Create a chart
    const ctx = document.getElementById(`${graphElement}`).getContext('2d');
    console.log(ctx);
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

                x: xAxisConfig,
            },

            layout: {
                padding: 0
            }
        }
    });     // end new chart instantiation

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
    const charts = [...document.querySelectorAll(".monthlyChart")];
    if (charts){
        charts.forEach(chart=>{
            if (chart){
                Chart.getChart(chart).destroy();
            }
        });
    }
    const monthlyChartDash = document.querySelector(".monthlyChartDash"); 
    if(monthlyChartDash){
        console.log("here?");
        monthlyChartDash.innerHTML = ``;
    }
    const mChartDashHeader = document.getElementById(`${c.mChartMinimizerId}`);
    if (mChartDashHeader){
        mChartDashHeader.parentElement.remove(mChartDashHeader);
    }
}