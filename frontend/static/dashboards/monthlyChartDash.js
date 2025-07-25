
import { currLifter, f } from "../lifterSidebar.js";
import { MONTHLY_CHARTS_DASH_VARIABLES as c, endpoint as e, DASH_HEADER_VARS as d } from "../config.js";
import { months } from "../config.js";
import { drawMonthlyChart } from "../charts/monthlycharts.js";

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
    ["monthlyFrequency", `${months[month]} ${year} Frequency`, ["monthly frequency", "bar"]], 
    ["monthlyInetensity",`${months[month]} ${year} Inetensity`,["monthly intensity", "bar"]]]

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
            drawMonthlyChart(type[1], data, `chart${type[0]}`, type[2][1]);  
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
    const minimizerWrapper = document.getElementById(`${c.mChartMinimizerId}`);
    if (minimizerWrapper.innerHTML === `${d.minimizerIcon}`){
        minimizerWrapper.innerHTML = `${d.expanderIcon}`;
    } else {
        minimizerWrapper.innerHTML = `${d.minimizerIcon}`;
    }
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
        monthlyChartDash.innerHTML = ``;
    }
    const mChartDashHeader = document.getElementById(`${c.mChartMinimizerId}`);
    if (mChartDashHeader){
        mChartDashHeader.parentElement.remove(mChartDashHeader);
    }
}