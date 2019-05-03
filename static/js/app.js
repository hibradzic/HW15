function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(data) {
    // console.log(data);
    // Use d3 to select the panel with id of `#sample-metadata`
    var myData = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    myData.html("")

    
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      // console.log(`Key: ${key} and Value ${value}`);
      cell = myData.append("h6");
      cell.text(`${key}:${value}`);
    });
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
     var otu_ids = data['otu_ids'];
     var otu_labels = data['otu_labels'];
     var sample_values = data['sample_values'];

    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels, 
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };
    
    var dataBub = [trace1];
    
    var layout1 = {
      title: 'Marker Size',
      showlegend: false,
      size: "auto"
    };
    
    Plotly.newPlot('bubble', dataBub, layout1);

    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pie_data = [];
    for (var j = 0; j < data.sample_values.length; j++)
    pie_data.push({'id': data.otu_ids[j], 'value': data.sample_values[j], 'hover': data.otu_labels[j]});

    pie_data.sort(function(a, b) {
      return (b.value - a.value);
    })

    top10 = pie_data.slice(0,10);

     var trace1 = {
       labels: top10.map(y => y.id),
       values: top10.map(y => y.value),
       type: 'pie',
       text: top10.map(y => y.hover), 
       hoverinfo: "text",
       textinfo: "percent"
     };
     
     var data_pnt = [trace1];
     
     var layout = {
       size: "auto",
       showlegend: true
     };
     
     Plotly.newPlot("pie", data_pnt, layout);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
