const openRender = document.querySelector('.open-render')
const successfullyPlacedList = document.querySelector(
  '.successfully-placed-list'
)

const failedToPlaceList = document.querySelector('.failed-list')

const packages = JSON.parse(sessionStorage.getItem('packages'))
const criteria = JSON.parse(sessionStorage.getItem('criteria'))
const spaceParams = JSON.parse(sessionStorage.getItem('spaceParams'))
const placedPackages = JSON.parse(sessionStorage.getItem('placedPackages'))
const failedToPlace = JSON.parse(sessionStorage.getItem('failedToPlace'))
const optimizedPackages = JSON.parse(sessionStorage.getItem('optimizedPackages'))

openRender.addEventListener('click', () => {
  window.location.href = 'simulation-render.html'
})

window.addEventListener('load', () => {
  renderSummary()
  renderList('success')
  renderList('failed')
})

function renderSummary() {
  const packagesLabel = document.querySelector('.packages-label')
  const successfullyLabel = document.querySelector('.successfully-label')
  const failedLabel = document.querySelector('.failed-label')
  const weightLabel = document.querySelector('.weight-label')
  const volumeLabel = document.querySelector('.volume-label')
  const criteriaInfo = document.querySelector('.criteria-info')

  let weight = 0
  let volume = 0
  const spaceVolume = parseFloat(
    (
      (spaceParams.width * spaceParams.height * spaceParams.length) /
      1000000
    ).toFixed(2)
  )

  placedPackages.forEach(pkg => {
    weight += pkg.weight
    volume +=
      (pkg.dimensions.width * pkg.dimensions.length * pkg.dimensions.height) /
      1000000
  })
  volume = Math.round(volume * 100) / 100

  criteria.forEach(criterion => {
    const criterionElement = document.createElement('div')
    criterionElement.textContent = `Criterion: ${criterion.title}, criterion weight: ${criterion.value}`
    criteriaInfo.appendChild(criterionElement)
  })

  packagesLabel.textContent = `📦 Packages before optimization: ${packages.length}`
  successfullyLabel.textContent = `✅ Packages placed onto a vehicle: ${placedPackages.length}`
  failedLabel.textContent = `❌ Packages failed to be loaded: ${failedToPlace.length}`
  weightLabel.textContent = `⚖️ Weight of the load: ${weight} kg`
  volumeLabel.textContent = `📐 Volume of occupied cargo space: ${volume} m³ / ${spaceVolume} m³ | ~ ${
    (Math.round((volume / spaceVolume) * 100) / 100) * 100
  }%`
}

function renderList(type) {
  const packagesArray = type === 'success' ? placedPackages : failedToPlace

  const listElement =
    type === 'success' ? successfullyPlacedList : failedToPlaceList

  packagesArray.forEach(pkg => {
    const pkgElement = document.createElement('div')
    pkgElement.classList.add('results-package-item')

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

    const objectiveValueLabel = document.createElement('div')
    objectiveValueLabel.textContent = `${pkg.objectiveValue}`

    pkgElement.appendChild(packageLabel)
    pkgElement.appendChild(dimensionsLabel)
    pkgElement.appendChild(weightLabel)
    pkgElement.appendChild(daysLeftLabel)
    pkgElement.appendChild(distanceLabel)
    pkgElement.appendChild(objectiveValueLabel)

    listElement.appendChild(pkgElement)
  })
}
