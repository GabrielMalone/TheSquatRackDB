
import { f } from "./lifterActions.js";
import { config } from "./config.js";


//-----------------------------------------------------------------------------
// method to get the monthly training volume for the main compounds plus accessory
//-----------------------------------------------------------------------------
export async function loadMonthlyChart(chartTitle, idUser, month, year){

    let squatVolume;
    f.post(config.GET_MONTHLY_VOLUME, {idUser, ExerciseCategory : "squat", month, year})
    .then(res=>{
        squatVolume = res.result.total_volume;
    })
    .catch(err=>console.error(err));
    //-------------------------------------------------------------------------
    let benchVolume;
    f.post(config.GET_MONTHLY_VOLUME, {idUser, ExerciseCategory : "bench", month, year})
    .then(res=>{
        benchVolume = res.result.total_volume;
    })
    .catch(err=>console.error(err));
    //-------------------------------------------------------------------------
    let deadliftVolume;
    f.post(config.GET_MONTHLY_VOLUME, {idUser, ExerciseCategory : "deadlift", month, year})
    .then(res=>{
        deadliftVolume = res.result.total_volume;
    })
    .catch(err=>console.error(err));
    //-------------------------------------------------------------------------
    let accessoryVolume;
    f.post(config.GET_MONTHLY_VOLUME, {idUser, ExerciseCategory : "accessory", month, year})
    .then(res=>{
        accessoryVolume = res.result.total_volume;
        const totalVolume = squatVolume + benchVolume + deadliftVolume + accessoryVolume;
        if (totalVolume){
            drawChart(chartTitle, squatVolume, benchVolume, deadliftVolume, accessoryVolume, totalVolume);
        }
    })
    .catch(err=>console.error(err));



    
}

//-----------------------------------------------------------------------------
// This is the logic for clicking the addLifter button. makes add window appear
//-----------------------------------------------------------------------------
function drawChart(chartTitle, squatVolume, benchVolume, deadliftVolume, accessoryVolume, totalVolume){

    const monthlyChartDisplay = document.querySelector(".monthlyChart"); 
    monthlyChartDisplay.classList.add("monthlyChartVisible");
    const ctx = monthlyChartDisplay.getContext('2d');

    // Create a chart
    const monthlyVolumeIntensity = new Chart(ctx, {
        type: 'bar', 
    
        data: {
            // can call a function like data.map(row => row.year) to make the labels array
            labels: ['Squat', 'Bench', 'Deadlift', 'Accessory'],
            
            datasets: [
                // can have multiple sets of data to overlap
                {
                label: chartTitle,
                // can also call a function like data: data.map(row => row.count) to make the data array
                data: [squatVolume, benchVolume, deadliftVolume, accessoryVolume],
        
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
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: false
                }
            },
            plugins: {
                legend: {
                  display: true,
                  labels: {
                    // remove the little color box next to the title of the chart
                    generateLabels: hideLegendBoxes,
                    color: "mintcream",
                  }
                },
                tooltip: {
                    enabled: true
                }
            },

            scales: {

                y: {
                    beginAtZero: true,
                    max: totalVolume,
                    ticks: {
                            stepSize: 1000,
                            precision: 0,  // No decimal places
                            callback: value => `${Math.ceil(value/100)}k lbs`,
                            color: "mintcream"
                         }
                },
                x: {
                    offset: true,
                    ticks : {
                        align: 'center',
                        padding: 10,
                        color: "gray"
                    }
                }
            },

            layout: {
                padding: {
                    bottom : 50,
                    right: 20,
                    left: 40,
                    top: 0
                }
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
            }
        )
    );
  }
