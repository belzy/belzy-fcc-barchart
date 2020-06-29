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
        

        const w = 1200;
        const h = 600;

        const chartPadding = 40;
        const barPadding = 0.19;
        const minYear = dataset[0][0].split('-')[0];
        const maxYear = dataset[dataset.length - 1][0].split('-')[0];
        const minGdp = 0; // dataset[0][1];
        const maxGdp = dataset[dataset.length - 1][1];

        // Scale X
        const scaleX = d3.scaleBand();
        scaleX.paddingInner(barPadding);
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
        svgBarChart.selectAll('rects')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        
        .attr('width', d => (scaleX.bandwidth()))
        .attr('height', d => h - scaleY(d[1]) - chartPadding)

        .attr('x', d => scaleX(d[0]))
        .attr('y', d => scaleY(d[1]))
        .on('mouseenter', (d, i) => {
            d3.select('#tooltip')
                .style('left', `${scaleX(d[0]) + 20}px`)
                .style('opacity', '0.8')
                .attr('data-date', d[0])

            d3.select('#tooltip-date')
                .text(() => {

                    let dateArr = d[0].split('-').map(el => parseInt(el));
                    let monthNum = dateArr[1];
                    let yearNum = dateArr[0];
                    let quarter = 1;

                    switch(monthNum) {
                        case 4:
                            quarter = 2;
                            break;
                        case 7:
                            quarter = 3;
                            break;
                        case 10:
                            quarter = 4;
                            break;
                        default:
                            break;
                    }

                    return `${yearNum} Q${quarter}`;
                })
                
            d3.select('#tooltip')
                .select('#tooltip-value')
                .text(() => {
                    return `$${d[1]} Billion`;
                })
        })
        .on('mouseout', (d, i) => {
            d3.select('#tooltip')
                .style('opacity', '0')
        })

    });

})();