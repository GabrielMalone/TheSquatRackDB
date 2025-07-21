
//-----------------------------------------------------------------------------
// This is the logic for clicking the addLifter button. makes add window appear
//-----------------------------------------------------------------------------
export function drawMonthlyChart(chartTitle, liftsData, graphElement, graphType){

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
                color: "mintcream"
            }
        }

    if (graphType === "doughnut"){
        xAxisConfig.display = false;
    }

    // Create a chart
    const ctx = document.getElementById(`${graphElement}`).getContext('2d');
    new Chart(ctx, {
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
                        'transparent',
                        'transparent',
                        'transparent',
                        'transparent',
                    ],
                    borderColor: [
                        'green',
                        'cyan',
                        'yellow',
                        'brown',
                    ],
                    borderWidth: 1
                }
            ]
        },

        options: {
            responsive: true,  
            maintainAspectRatio: false, 
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
//  this method hides the weird boxes that show up in the chart lengend
//-----------------------------------------------------------------------------
export function hideLegendBoxes(chart) {
    return Chart.defaults.plugins.legend.labels.generateLabels(chart).map(label => (
        {
        ...label,                      // spread all the oringal label properties
        fillStyle: 'transparent',                        // and just change these
        strokeStyle: 'transparent',
        lineWidth: 0
        })
    );
}