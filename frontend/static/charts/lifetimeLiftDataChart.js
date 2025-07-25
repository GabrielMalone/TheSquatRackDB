import { hideLegendBoxes } from "./monthlycharts.js";
import { formatBackendDateData, createChartElement } from "../dashboards/prDash.js";
import { colors } from "../config.js";

let historicalChart = null;
//-----------------------------------------------------------------------------
// logic for drawing historical chart data
//-----------------------------------------------------------------------------
export function drawHistoricalChart(prDash, dataforPr){

    // elements needed for chart creation
    const chartTitle = `LIFT HISTORY - ALL SETS`;
 
    createChartElement(prDash, "historicalPrChart", chartTitle);

    const liftNames = Object.keys(dataforPr);
    const prData = Object.values(dataforPr);
    // pr Data is an array of arrays. each array contains pr objects for a lift
    // {date: "Tue, 01 Jul 2025 00:00:00 GMT", idWorkout: 1, reps: 1, weight: 901}
    // ....
    const prDatasets = [];          // array to hold the final chart js objects
    for (let i = 0 ; i < prData.length ; i ++ ){  // iterate through pr objects
        const color = colors[i];
        const prDataSet = prData[i];
        const liftName = liftNames[i];
        const weightAtReps = {};                                                // set this up so that weights are on x axis // and reps are on y axis // and frequncy of rep range completed at that weight is r 
        createWeightRepsObjects(weightAtReps, prDataSet, liftName) ;            // all the weights a user has lifted for this exercise       
        const weightLabels = Object.keys(weightAtReps);                         // all reps completed at this weight for this exercise
        const repDataSets  = Object.values(weightAtReps);                       // set r radius based on how many times rep range hit for this weight
        setRadius(repDataSets);                                                 // how many times has a weight been done for this lift at these reps
        const datasetObj = createChartJSdatasetObject(weightLabels, repDataSets, color)// create the object that Chart js wants data : dataset [{},{},{}]  
        prDatasets.push(datasetObj);
    }    
    if (historicalChart){                              // destroy before redraw
        historicalChart.destroy();
    }
    historicalChart = new Chart(document.getElementById(`canvasForhistoricalPrChart`), {
        type: 'bubble', 
        data: {     // map can take two arguments: item in arry, and index val
            datasets: prDatasets.flat() // need just one array of all datasetObjects
        },
        options: options      
    }); 
    addCloseEventListener('historicalPrChart');
}
//-----------------------------------------------------------------------------
function setRadius(repDataSets){
    for (let i = 0 ; i < repDataSets.length ; i ++){
        for (let j = 0 ; j < repDataSets[i].length ; j ++){
            repDataSets[i][j].r = repDataSets[i].length * 3; 
        }
    }
}
//-----------------------------------------------------------------------------
function createWeightRepsObjects(weightAtReps, prDataSet, liftName){
    for (let i = 0; i < prDataSet.length ; i ++ ){
        if (!weightAtReps[prDataSet[i].weight]){ 
            weightAtReps[prDataSet[i].weight] = [
                {   y:prDataSet[i].weight,x:prDataSet[i].reps, 
                    date: formatBackendDateData(prDataSet[i].date), 
                    name: liftName  }];
        } else { 
            weightAtReps[prDataSet[i].weight].push(
                {   y:prDataSet[i].weight,
                    x:prDataSet[i].reps, 
                    date: formatBackendDateData(prDataSet[i].date), 
                    name: liftName  });
        }
    }   
}
//-----------------------------------------------------------------------------
function createChartJSdatasetObject(weightLabels, repDataSets, color){
    const datasetObj = repDataSets.map((points, idx) => ({
        label: weightLabels[idx],
        data: points,
        backgroundColor: color,
        borderColor: color
    }))
    return datasetObj;
}
//-----------------------------------------------------------------------------
function addCloseEventListener(chartName){
    const x = document.getElementById(`prChartXfor${chartName}`);
    x.addEventListener("click",  ()=>{
        const repPrChart = document.getElementById(`prChartWrapperFor${chartName}`);
        repPrChart.parentNode.removeChild(repPrChart);
    });
}
//-----------------------------------------------------------------------------
const xConfig = {
    display: true,
    grid: {
        display: false,  
    },
    min: 0,
    ticks : {
        stepSize: 1,
        color: "#ccc",
        font: {
            size: 10 
        },
        padding: 15
    }
}
//-----------------------------------------------------------------------------
const yConfig = {
    display: true,
    grid: {
        display: false,  
    },
    ticks: {
        padding: 15, 
        color: "#ccc",
        stepSize: 5,
        font: {
            size: 10 
        },
    },
}
//-----------------------------------------------------------------------------
const toolTipLabel = {
    label: function(context) { 
        const x = context.parsed.x;
        const y = context.parsed.y;
        const r = context.raw.date;
        const name = context.raw.name;
        return `${name} : ${x} rep(s) x ${y} on ${r}`; // No r here
    }
}
//-----------------------------------------------------------------------------
const options = {
    aspectRatio: 2,
    plugins: {
        legend: {
            display: false,
            labels: {
                generateLabels: hideLegendBoxes,
            },
        },
        tooltip: {
            callbacks: toolTipLabel
        }
    },
    scales: {
        y: yConfig,
        x: xConfig
    },
    layout: {
        padding: 0
    }
}