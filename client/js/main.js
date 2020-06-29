(function() {
    
    // Functions
    const getData = (done) => {

        // Get json data.
        const resource = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
        const init = {
            method: 'GET',
        };

        fetch(resource, init)
            .then(response => response.json())
            .then(data => {

                done(data);

            }).catch(err => console.log(err));

    }

    

    getData(data => {

        let dataset = data['data'];
        // console.log(dataset);
        // dataset = dataset.slice(0, 60);



       const dateArr = dataset.map(arr => arr[0]);
       console.log(dateArr);
        

        const w = 500;
        const h = 500;

        const chartPadding = 40;
        const barPadding = 0.5;
        const minYear = dataset[0][0].split('-')[0];
        const maxYear = dataset[dataset.length - 1][0].split('-')[0];
        const minGdp = 0; // dataset[0][1];
        const maxGdp = dataset[dataset.length - 1][1];

        // Scale X
        const scaleX = d3.scaleBand();
        scaleX.domain(dateArr).range([chartPadding, w - chartPadding]);

        // Scale Y
        const scaleY = d3.scaleLinear();
        scaleY.domain([minGdp, maxGdp]).range([h - chartPadding, chartPadding]);

        const getYearNumFromDate = date => parseInt(date.split('-')[0]);

        const getTickValuesFrom = dateArr => {

            const newDateArr = [];
            const yearNumArr = [];

            dateArr.forEach(date => {

                const yearNum = getYearNumFromDate(date);

                if (yearNum % 5 === 0 && yearNumArr.indexOf(yearNum) === -1) {
                    yearNumArr.push(yearNum);
                    newDateArr.push(date);
                }

            });

            return newDateArr;

        }

        // Axes
        let prevYear = 0;
        const xAxis = d3.axisBottom(scaleX)
        .tickValues(getTickValuesFrom(dateArr))
        .tickFormat(d => getYearNumFromDate(d));

        xAxis.ticks(dataset.length / 5);
        const yAxis = d3.axisLeft(scaleY)

        const svgBarChart = d3.select('#title')
            .attr('width', w)
            .attr('height', h)

            

            

        // Render X Axis
        svgBarChart.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${h - chartPadding})`)
            .call(xAxis);

        // Render Y Axis
        svgBarChart.append('g')
            .attr('id', 'y-axis')
            .attr('transform', `translate(${chartPadding}, 0)`)
            .call(yAxis);


        // Rects
        // let quarter = 0;
        svgBarChart.selectAll('rects')
        .data(dataset)
        .enter()
        .append('rect')


        .attr('width', d => (scaleX.bandwidth()))
        .attr('height', d => scaleY(d[1]))

        .attr('x', d => {
            // console.log(d)
            // console.log(scaleX(d[0]))
            return scaleX(d[0])}
        )

        // .attr('width', (w - (chartPadding * 2)) / dataset.length)
        // .attr('height', (d, i) => d[1])
        // .attr('x', (d, i) => i * chartPadding + ((w - (chartPadding * 2)) / dataset.length))

        // The y coordinate that is y = heightOfSVG - heightOfBar 
        // would place the bars right-side-up. h - d[1] / 40
        // .attr('y', (d, i) => h - d[1])
        // .attr('fill', 'navy')
        // .append('title')
        // .text((d, i) => d)





    });

})();