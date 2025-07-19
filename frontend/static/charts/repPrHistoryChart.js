import { hideLegendBoxes } from "./monthlycharts.js";
import { createChartElement, formatBackendDateData } from "../dashboards/prDash.js";
import { endpoint as end, colors } from "../config.js";
import { f } from "../lifterSidebar.js";


export async function drawRepPrHistoryChart(dataForPr){
    // dataForPr :  idUser, idExercise, reps
    const idUser     = dataForPr.idUser;
    const idExercise = dataForPr.idExercise;
    const reps       = dataForPr.reps;
    const liftName   = dataForPr.liftName;

    const prs = await f.post(end.GET_PR_DATA_FOR_LIFT, {idUser, "lift" : idExercise});
    const desiredRepRangePrs = prs.filter(pr=>pr.reps === parseInt(reps));
    const chartTitle = `Lift History for ${reps} rep(s) of ${liftName}`;
    const chartName = 'repHistoryChart';
    const prDash = document.querySelector('.prDash');

    createChartElement(prDash, chartName ,chartTitle);

    desiredRepRangePrs.sort((a, b) => new Date(a.date) - new Date(b.date)); // sort by date

    const dateLabels = desiredRepRangePrs.map(prs=>formatBackendDateData(prs.date));
    const prWeightData = desiredRepRangePrs.map(prs=>prs.weight);

    const dateWeightObjs = [];

    for (let i = 0 ; i < dateLabels.length ; i ++){
        const dateWeightObj = {
            x: dateLabels[i],
            y: prWeightData[i]
        }
        dateWeightObjs.push(dateWeightObj);
    }   
    
    const repPrHistoryChartCanvas = document.getElementById(`${chartTitle}`);

    new Chart(repPrHistoryChartCanvas, {
        type: 'line',
        data : {
            datasets: [ {
                data : dateWeightObjs,
                showLine: false
            }]
        }, 
        options : {
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
            },
            scales: {
                y: {
                    ticks: {
                        padding: 40
                    },
                },
                x: {
                    ticks : {
                        padding: 40,
                    }
                },
            },
            layout: {
                padding: 0
            }
        }
    });

}