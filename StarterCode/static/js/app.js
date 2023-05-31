
url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//read in samples.json using the D3 library 
d3.json(url).then(function(data){
    console.log(data);
});

//initialize the dashboard
function init() {

    let dropdown = d3.select("#selDataset");

    d3.json(url).then((data) => {
        
        //create array 
        let names = data.names;

        //iterate through the array
        names.forEach((id) => {
            console.log(id);
            dropdown.append("option").text(id).property("value",id);
        });
        
        //get the first index from the array
        let id = names[0];

        // call to the functions
        metadata(id);
        barChart(id);
        bubbleChart(id);
    });
};

// function for the metadata info
//display the sample metadata, i.e., an individual's demographic information.
function metadata(id) {

    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        //array for sample data
        let metadata = data.metadata;

        //filter the data 
        let value = metadata.filter(result => result.id == id);

        //get the first index from the array
        let obj = value[0];

        d3.select("#sample-metadata").html("");

        Object.entries(obj).forEach(([key,value]) => {
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

//funtion for the bar chart
//create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
function barChart(id) {

    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        //array for sample data
        let sampledata = data.samples;

        //filter the data 
        let value = sampledata.filter(result => result.id === id);

        //get the first index from the array
        let obj = value[0];

        let trace = [{
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        
        Plotly.newPlot("bar", trace);
    });
};

//function for the bubble chart
//create a bubble chart that displays each sample
function bubbleChart(id) {

    d3.json(url).then((data) => {
        
        let sampledata = data.samples;

        let value = sampledata.filter(result => result.id == id);

        let obj = value[0];
        
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Earth"
            }
        }];
    
        let layout = {
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", trace, layout);
    });
};

//function to update the dashboard when ID is changed
//update all the plots when a new sample is selected
function optionChanged(value) { 

    // Call all functions 
    metadata(value);
    barChart(value);
    bubbleChart(value);
};

//call the initial function
init();
