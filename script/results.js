const openRender = document.querySelector('.open-render')
const successfullyPlacedList = document.querySelector(
  '.successfully-placed-list'
)

const packages = JSON.parse(sessionStorage.getItem('packages'))
const successfullyPlacedPackages = JSON.parse(
  sessionStorage.getItem('successfullyPlacedPackages')
)
const failedToPlace = JSON.parse(sessionStorage.getItem('failedToPlace'))

openRender.addEventListener('click', () => {
  window.location.href = 'simulation-render.html'
})

window.addEventListener('load', () => {
  successfullyPlacedPackages.forEach(pkg => {
    const pkgElement = document.createElement('div')
    pkgElement.classList.add('package-item')

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

    pkgElement.appendChild(packageLabel)
    pkgElement.appendChild(dimensionsLabel)
    pkgElement.appendChild(weightLabel)
    pkgElement.appendChild(daysLeftLabel)
    pkgElement.appendChild(distanceLabel)

    successfullyPlacedList.appendChild(pkgElement)
  })
})
