import { hideLegendBoxes } from "./monthlycharts.js";
import { createChartElement, formatBackendDateData } from "../dashboards/prDash.js";
import { endpoint as end, colors } from "../config.js";
import { f } from "../lifterSidebar.js";


//-----------------------------------------------------------------------------
// logic for drawing historical rep pr chart data
//-----------------------------------------------------------------------------
export async function drawRepPrHistoryChart(dataForPr){
    // dataForPr :  idUser, idExercise, reps
    const idUser     = dataForPr.idUser;
    const idExercise = dataForPr.idExercise;
    const reps       = dataForPr.reps;
    const liftName   = dataForPr.liftName;
    // elements needed for chart creation
    const prDash = document.querySelector('.prDash');
    const chartTitle = `LIFT HISTORY - SETS OF ( ${reps} ) ON: ${liftName}`;
    const chartName = `repHistoryChartFor${reps}of${liftName}`;
    createChartElement(prDash, chartName, chartTitle);
    // get the pr data from DB
    const liftData = await f.post(end.GET_PR_DATA_FOR_LIFT, {idUser, "lift" : idExercise});
    // filter lift data for desired rep ranges and for prs
    const LiftsOfDesiredRepRange = liftData.filter(data=>data.reps === parseInt(reps));
    // sort by date
    LiftsOfDesiredRepRange.sort((a, b) => new Date(a.date) - new Date(b.date)); 
    // get only sets of this rep range that were PRs 
    const desiredRepRangePrs = filterPRs(LiftsOfDesiredRepRange);
    // create the chart js data structure for the PR sets
    const dateWeightObjsPrs = createChartJSDataStructureForPrSets(desiredRepRangePrs);
    // create the chart js data structure for every set ever lifted after this rep range
    const dateWeightObjsAllSets = createChartJSDataStructureForPrSets(LiftsOfDesiredRepRange);
    // event lsitener for x
    addCloseEventListener(reps, liftName, chartName);
    const chartCanvas = document.getElementById(`canvasFor${chartName}`);
    new Chart(chartCanvas, {
        data : {
            datasets: [ 
                {
                data : dateWeightObjsPrs,
                type: 'line',
                showLine : true,
                borderColor: 'brown',
                backgroundColor : 'oranredge',
                borderWidth: 1
                },
                {
                data : dateWeightObjsAllSets,
                type: 'line',
                showLine : false,
                backgroundColor : 'purple'
                }
            ]
        }, 
        options : {
            plugins: pluginsConfig,
            scales: {
                y: yConfig,
                x: xConfig,
            },
            layout: {
                padding: 0
            }
        }
    });

    setTimeout(()=>{chartCanvas.scrollIntoView({behavior : "smooth"})}, 300);
}
//-----------------------------------------------------------------------------
// logic for filtering out only sets that were a PR for this rep range 
//-----------------------------------------------------------------------------
function filterPRs(desiredRepRangeLifts){
    let max = 0;
    const desiredRepRangePrs = [];
    for (let i = 0 ; i < desiredRepRangeLifts.length ; i ++ ){
        if (parseInt(desiredRepRangeLifts[i].weight) > max){
            max = desiredRepRangeLifts[i].weight;
            desiredRepRangePrs.push(desiredRepRangeLifts[i]);
        }
    }
    return desiredRepRangePrs;
}
//-----------------------------------------------------------------------------
function createChartJSDataStructureForPrSets(desiredRepRangePrs){
    const dateLabels = desiredRepRangePrs.map(liftData=>new Date(formatBackendDateData(liftData.date)));
    const prWeightData = desiredRepRangePrs.map(liftData=>liftData.weight);
    const dateWeightObjs = [];
    for (let i = 0 ; i < dateLabels.length ; i ++){
        const dateWeightObj = {
            x: dateLabels[i],
            y: prWeightData[i]
        }
        dateWeightObjs.push(dateWeightObj);
    }   
    return dateWeightObjs;
}
function addCloseEventListener(reps, liftName, chartName){
    const x = document.getElementById(`prChartXforrepHistoryChartFor${reps}of${liftName}`);
    x.addEventListener("click",  ()=>{
        const repPrChart = document.getElementById(`prChartWrapperFor${chartName}`);
        repPrChart.parentNode.removeChild(repPrChart);
    });
}
//-----------------------------------------------------------------------------
// chart setup stuff
//-----------------------------------------------------------------------------
const xConfig = {
    type: 'time',
    time: {
        unit: 'day'
    },
    ticks : {
        padding: 4,
        color : 'mintcream',
        font: {
            size: 8,       
            family: 'Arial', 
        }
    }
};
const yConfig = {
    ticks: {
        padding: 5,
        color : '#CCC',
        font: {
            size: 9,       
            family: 'Arial', 
        }
    },
};
const pluginsConfig = {
    legend: {
        display: false,
        labels: {
            generateLabels: hideLegendBoxes,
            color: "mintcream",
        },
        align: "center",
    },
};