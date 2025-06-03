const utilitiesContainer = document.querySelector('.utilities-container')
const utilityParams = {} // key: criterion title, value: { maxValue, exponent }

function renderUtilities() {
  utilitiesContainer.innerHTML = ''

  criteria.forEach(item => {
    const title = item.title

    // Initialize stored params if missing
    if (!utilityParams[title]) {
      utilityParams[title] = {
        maxValue: 100, // default
        exponent: 1, // default
      }
    }

    const { maxValue, exponent } = utilityParams[title]

    const utilityElement = createElement('div', {
      classList: ['utility-element'],
    })

    const utilityTitle = createElement('div', {
      textContent: title,
      classList: ['utility-title'],
    })

    const maxValuePar = createElement('span', {
      textContent: 'Maximum expected value',
    })
    const maxValueIn = createElement('input', {
      type: 'number',
      value: maxValue,
      min: 1,
      step: 1,
    })

    const exponentPar = createElement('span', {
      textContent: 'Exponent coefficient value',
    })
    const exponentIn = createElement('input', {
      type: 'number',
      value: exponent,
      min: 0.1,
      step: 0.1,
    })

    const graphContainer = createElement('div', {
      classList: ['utility-graph-container'],
    })

    // Initial graph draw
    drawUtilityGraph(graphContainer, maxValue, exponent, title)

    // Event listeners to update params and redraw graph
    const updateGraph = () => {
      const newMax = parseFloat(maxValueIn.value)
      const newExp = parseFloat(exponentIn.value)

      if (newMax > 0 && newExp > 0) {
        utilityParams[title] = {
          maxValue: newMax,
          exponent: newExp,
        }
        drawUtilityGraph(graphContainer, newMax, newExp, title)
      }
    }

    maxValueIn.addEventListener('input', updateGraph)
    exponentIn.addEventListener('input', updateGraph)

    utilityElement.append(
      utilityTitle,
      maxValuePar,
      maxValueIn,
      exponentPar,
      exponentIn,
      graphContainer
    )

    utilitiesContainer.appendChild(utilityElement)
  })
}

function drawUtilityGraph(container, maxValue, exponent, criterionTitle) {
  const increasingUtilityCriteria = ['Volume', 'Weight', 'Distance'] // Add more if needed
  const isIncreasing = increasingUtilityCriteria.includes(criterionTitle)

  const width = 300
  const height = 200
  const margin = { top: 20, right: 20, bottom: 40, left: 50 }

  // Clear previous SVG if any
  container.innerHTML = ''

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const graphWidth = width - margin.left - margin.right
  const graphHeight = height - margin.top - margin.bottom

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // Generate data points
  const data = []
  for (let x = 0; x <= maxValue; x += maxValue / 50) {
    let utility
    if (isIncreasing) {
      utility = Math.pow(x / maxValue, exponent)
    } else {
      utility = Math.pow((maxValue - x) / maxValue, exponent)
    }
    data.push({ x, utility })
  }

  const xScale = d3.scaleLinear().domain([0, maxValue]).range([0, graphWidth])
  const yScale = d3.scaleLinear().domain([0, 1]).range([graphHeight, 0])

  const line = d3
    .line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.utility))

  // Draw line
  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#005366')
    .attr('stroke-width', 2)
    .attr('d', line)

  // Draw axes
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  g.append('g').attr('transform', `translate(0, ${graphHeight})`).call(xAxis)

  g.append('g').call(yAxis)

  // X-axis label
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', height - 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text(criterionTitle)

  // Y-axis label
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text('Utility')
}
