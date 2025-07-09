const beginOptimizationBtn = document.querySelector('.begin-optimization-btn')
const logElement = document.querySelector('.log-element')

const packages = JSON.parse(sessionStorage.getItem('packages'))

const inputMappings = [
  { selector: '.cargo-space-length-in', key: 'length' },
  { selector: '.cargo-space-width-in', key: 'width' },
  { selector: '.cargo-space-height-in', key: 'height' },
  { selector: '.max-weight-in', key: 'weight' },
]

const spaceParams = {
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
}

inputMappings.forEach(({ selector, key }) => {
  const input = document.querySelector(selector)
  input.addEventListener('keyup', () => {
    spaceParams[key] = parseFloat(input.value) || 0
  })
})

beginOptimizationBtn.addEventListener('click', () => {
  const maxDistance = Math.max(...packages.map(p => p.distance))
  const maxObjective = Math.max(...packages.map(p => p.objectiveValue))

  // Normalize and bucket
  const distanceBuckets = {}

  packages.forEach(pkg => {
    pkg.normDistance = pkg.distance / maxDistance
    pkg.normValue = pkg.objectiveValue / maxObjective

    const bucketKey = Math.round(pkg.normDistance * 20) / 20 // group into 5% buckets
    if (!distanceBuckets[bucketKey]) distanceBuckets[bucketKey] = []
    distanceBuckets[bucketKey].push(pkg)
  })

  // Filter and sort within buckets
  const valueThreshold = 0.2
  Object.keys(distanceBuckets).forEach(bucket => {
    distanceBuckets[bucket] = distanceBuckets[bucket]
      .filter(p => p.normValue >= valueThreshold)
      .sort((a, b) => b.normValue - a.normValue)
  })

  // Flatten and sort buckets by descending distance
  const optimizedPackages = Object.keys(distanceBuckets)
    .sort((a, b) => b - a)
    .flatMap(bucket => distanceBuckets[bucket])

  sessionStorage.setItem('optimizedPackages', JSON.stringify(optimizedPackages))
  sessionStorage.setItem('spaceParams', JSON.stringify(spaceParams))
  console.log(optimizedPackages)

  logElement.style.display = 'flex'
  convertPkgDimToCm()
})
