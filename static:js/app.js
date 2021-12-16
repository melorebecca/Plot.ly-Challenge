//creating function the demographic info
function demographic(demoInfo){
    d3.json("samples.json").then((data)=> {
        var metadata = data.metadata;
        console.log(metadata);

        // filter demo info data by id
        var resultarray = metadata.filter(info => info.id.toString() === demoInfo)[0];
        var panelData = d3.select("#sample-metadata");

        panelData.html("");

        Object.entries(resultarray).forEach((key) => {
            panelData.append("p").text(key[0] + ":" + key[1]);
        });
    });
};

//create function for all plots
function plots(demoInfo) {
    d3.json("samples.json").then((data)=> {
        //console.log(data)
        
        //filter wash frequency value by id
        var wfreq = data.metadata.filter(wf => wf.id.toString() === demoInfo)[0];
        wfreq = wfreq.wfreq;
        console.log("Washing Freq: " + wfreq);
        
        // filter samples values by id 
        var samples = data.samples.filter(sample => sample.id.toString() === demoInfo)[0];
  
        // getting top 10 sample values
        var sampleValues = samples.sample_values.slice(0, 10).reverse();
        console.log("top 10 sample: " + sampleValues);
  
        // get only top 10 otu ids for the plot 
        var otu = (samples.otu_ids.slice(0, 10)).reverse();
        var otu_id = otu.map(no => "OTU " + no)
        console.log("OTU IDS: " + otu_id);
  
  
        // getting top 10 labels the plot
        var labels = samples.otu_labels.slice(0, 10).reverse();
        console.log("labels: " + labels);
  
        // bar chart
        var barChart = {
            x: sampleValues,
            y: otu_id,
            text: labels,
            type:"bar",
            orientation: "h",
        };
  
        var barData = [barChart];
  
        Plotly.newPlot("bar", barData);
      
        // bubble chart
        var bubbleChart = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
            },
            text: samples.otu_labels
  
        };
  
        var bubbleLayout = {
            xaxis:{title: "OTU ID"},
            height: 550,
            width: 1050
        };
  
        var bubbleData = [bubbleChart];
  
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
        // Bonus: Guage chart
        var gaugeChart = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: {text: `Belly Button Washing Frequency`},
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { 
              axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },
              bar: { color: "green" },
              bgcolor: "black",
              borderwidth: 4,
                   steps: [
                    {range: [0, 1], color: "white"},
                    {range: [1, 2], color: "white"},
                    {range: [2, 3], color: "white"},
                    {range: [3, 4], color: "white"},
                    {range: [4, 5], color: "white"},
                    {range: [5, 6], color: "white"},
                    {range: [6, 7], color: "white"},
                    {range: [7, 8], color: "white"},
                    {range: [8, 9], color: "white"}
                  ]}
              
          }
        ];
        var gaugeLayout = { 
            width: 500, 
            height: 400, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", gaugeChart, gaugeLayout);
      });
  }  

function init() {
    //read the data
    d3.json("samples.json").then((data)=> {

        //get name id to the dropdown
        data.names.forEach((name) => {
            d3
            .select("#selDataset")
            .append("option")
            .text(name)
            .property("value");
        });
        plots(data.names[0]);
        demographic(data.names[0]);
    });
};
init();

//change event function
function optionChanged(demoInfo){
    plots(demoInfo);
    demographic(demoInfo);
};