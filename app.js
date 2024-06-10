// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let BelleyResult = metadata.filter(metaObject => metaObject.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
      panel.html("");


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(BelleyResult).forEach(([key, value]) => {
      panel.append("p")
           .style("color", "red")
           .text(`${key}: ${value}`);

    })
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const sampleArray = samples.filter(Samp => Samp.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = sampleArray.otu_ids;
    const otu_labels = sampleArray.otu_labels;
    const sampleValues = sampleArray.sample_values;

    // Build a Bubble Chart
    const bubblesData = [{
      x: otu_ids,
      y: sampleValues,
      text: otu_labels,
      mode: 'markers',
      marker: {
      size: sampleValues,
      color: otu_ids,
      colorscale: 'Plasma'}}]
    const Layout = {
      title: "Bacteria per sample",
      xaxis: { title: 'Number of Bacteria' },
      yaxis: { title: 'OTU ID' }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubblesData, Layout)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();

    // Build a Bar Chart
    const barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];
    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
      yaxis: { title: 'OTU ID' }
    };
    


    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropmenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    dropmenu.selectAll("option")
    .data(names)
    .enter()
    .append("option")
    .text(d => d )
    .attr("value", d => d);

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
