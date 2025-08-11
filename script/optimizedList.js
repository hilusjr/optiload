const optimizedListElements = document.querySelector('.optimized-list-elements')
const proceedToFinal = document.querySelector('.proceed-to-final')
const packages = JSON.parse(sessionStorage.getItem('packages'))
const utilityParams = JSON.parse(sessionStorage.getItem('utilityParams'))

window.addEventListener('load', () => {
  packages.forEach(pkg => {
    const pkgElement = document.createElement('div')
    pkgElement.classList.add('optimized-list-item')

    const packageLabel = document.createElement('div')
    packageLabel.textContent = `Package #${pkg.id}`

    const dimensionsLabel = document.createElement('div')
    dimensionsLabel.textContent = `${pkg.dimensions.width}x${pkg.dimensions.length}x${pkg.dimensions.height}`

    const weightLabel = document.createElement('div')
    weightLabel.textContent = `${pkg.weight} kg`

    const daysLeftLabel = document.createElement('div')
    daysLeftLabel.textContent = `${pkg.daysLeft} ${
      pkg.daysLeft === 1 ? 'day' : 'days'
    }`

    const distanceLabel = document.createElement('div')
    distanceLabel.textContent = `${pkg.distance} km`

    const objVal = document.createElement('div')
    objVal.textContent = pkg.objectiveValue

    pkgElement.appendChild(packageLabel)
    pkgElement.appendChild(dimensionsLabel)
    pkgElement.appendChild(weightLabel)
    pkgElement.appendChild(daysLeftLabel)
    pkgElement.appendChild(distanceLabel)
    pkgElement.appendChild(objVal)

    optimizedListElements.appendChild(pkgElement)
  })
})

proceedToFinal.addEventListener('click', () => {
  window.location.href = 'space-optimization.html'
})
