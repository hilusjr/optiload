const proceedToResultsBtn = document.querySelector('.proceed-to-results')

// Configurable grid cell size in cm
const cellSize = 5

let failedAmount = null

function convertPkgDimToCm() {
  const optimizedPackages = JSON.parse(
    sessionStorage.getItem('optimizedPackages')
  )

  optimizedPackages.forEach(pkg => {
    pkg.dimensions = {
      length: pkg.dimensions.length / 10,
      width: pkg.dimensions.width / 10,
      height: pkg.dimensions.height / 10,
    }
  })

  // Run placement without specifying effectiveHeight (full height)
  placePackages(optimizedPackages)
}

function randomDelay(isWeightLimitReached = false) {
  if (isWeightLimitReached) {
    return 5 // fixed 5ms delay after weight limit reached
  }
  // 85% chance to be short (5-100ms), 15% chance to be longer (100-500ms)
  if (Math.random() < 0.85) {
    return 5 + Math.random() * 95 // 5 to 100 ms
  } else {
    return 100 + Math.random() * 400 // 100 to 500 ms
  }
}

function delayRandom(isWeightLimitReached = false) {
  return new Promise(resolve =>
    setTimeout(resolve, randomDelay(isWeightLimitReached))
  )
}

async function placePackages(
  optimizedPackages,
  effectiveHeight = null,
  rerun = false
) {
  const spaceParams = JSON.parse(sessionStorage.getItem('spaceParams'))
  const maxWeight = spaceParams.weight * 1000 // weight in grams

  const cargoSpace = {
    length: Math.floor(spaceParams.length / cellSize),
    width: Math.floor(spaceParams.width / cellSize),
    height:
      effectiveHeight !== null
        ? effectiveHeight
        : Math.floor(spaceParams.height / cellSize),
  }

  const occupiedCells = new Set()
  const successfullyPlaced = []
  const failedToPlace = []

  let currentWeight = 0
  let weightWarningOccurred = false // NEW flag here

  const logContainer = document.querySelector('.log-content')

  function logToUI(message, type = 'log') {
    if (!logContainer) return
    const entry = document.createElement('div')
    entry.textContent = message
    entry.style.whiteSpace = 'pre-wrap'
    if (type === 'warn') entry.style.color = 'orange'
    else if (type === 'error') entry.style.color = 'red'
    logContainer.appendChild(entry)
    logContainer.scrollTop = logContainer.scrollHeight
  }

  function log(...args) {
    console.log(...args)
    logToUI(args.map(format).join(' '), 'log')
  }

  function warn(...args) {
    console.warn(...args)
    logToUI(args.map(format).join(' '), 'warn')
  }

  function format(arg) {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2)
      } catch {
        return '[object]'
      }
    }
    return String(arg)
  }

  function occupyCells(start, dims) {
    for (let x = start.x; x < start.x + dims.x; x++) {
      for (let y = start.y; y < start.y + dims.y; y++) {
        for (let z = start.z; z < start.z + dims.z; z++) {
          occupiedCells.add(`${x},${y},${z}`)
        }
      }
    }
  }

  function checkFits(start, dims) {
    if (
      start.x + dims.x > cargoSpace.length ||
      start.y + dims.y > cargoSpace.width ||
      start.z + dims.z > cargoSpace.height
    )
      return false

    for (let x = start.x; x < start.x + dims.x; x++) {
      for (let y = start.y; y < start.y + dims.y; y++) {
        for (let z = start.z; z < start.z + dims.z; z++) {
          if (occupiedCells.has(`${x},${y},${z}`)) return false
        }
      }
    }
    return true
  }

  for (const pkg of optimizedPackages) {
    if (currentWeight + pkg.weight > maxWeight) {
      pkg.placed = false
      failedToPlace.push(pkg)
      warn(
        `⚠️ Skipped package due to weight limit: Package #${pkg.id} (${pkg.weight} kg)`
      )
      weightWarningOccurred = true // <-- mark that a weight warning occurred
      // Delay fixed to 5ms if weight limit reached
      await delayRandom(true)
      continue
    }

    const cellDims = {
      x: Math.ceil(pkg.dimensions.length / cellSize),
      y: Math.ceil(pkg.dimensions.width / cellSize),
      z: Math.ceil(pkg.dimensions.height / cellSize),
    }

    let placed = false

    outer: for (let x = 0; x <= cargoSpace.length - cellDims.x; x++) {
      for (let y = 0; y <= cargoSpace.width - cellDims.y; y++) {
        for (let z = 0; z <= cargoSpace.height - cellDims.z; z++) {
          const start = { x, y, z }

          if (checkFits(start, cellDims)) {
            occupyCells(start, cellDims)
            pkg.position = {
              x: x * cellSize,
              y: y * cellSize,
              z: z * cellSize,
            }
            pkg.placed = true
            currentWeight += pkg.weight
            successfullyPlaced.push(pkg)
            log(
              `✅ Placed package ${pkg.id} at (${pkg.position.x},${pkg.position.y},${pkg.position.z}) — total weight: ${currentWeight}/${maxWeight} kg`
            )
            placed = true
            break outer
          }
        }
      }
    }

    if (!placed && pkg.placed !== false) {
      pkg.placed = false
      failedToPlace.push(pkg)
      warn(`❌ Could not place package due to space: Package #${pkg.id}`)
    }

    // Use regular random delay only for placed packages
    await delayRandom(false)
  }

  log(`📦 Occupied cells [ 1 dm³ ]: ${occupiedCells.size}`)
  log(`✅ Successfully placed packages: ${successfullyPlaced.length}`)
  if (!rerun) {
    sessionStorage.setItem('failedToPlace', JSON.stringify(failedToPlace))
    failedAmount = failedToPlace.length
  }

  log(`❌ Unplaced packages: ${failedAmount}`)

  // Rerun if first run, and either weight limit reached OR weight warning occurred (some package skipped)
  if (
    !rerun &&
    successfullyPlaced.length > 0 &&
    (currentWeight >= maxWeight || weightWarningOccurred)
  ) {
    const floorCells = new Set(
      Array.from(occupiedCells).map(key => {
        const [x, y] = key.split(',')
        return `${x},${y}`
      })
    )
    const floorCoverageRatio =
      floorCells.size / (cargoSpace.length * cargoSpace.width)

    const newHeight = Math.max(
      1,
      Math.floor(cargoSpace.height * floorCoverageRatio) + 1
    )

    log(
      `🔄 Weight limit reached or warning occurred. Re-running placement to spread packages across available cargo space.`
    )

    optimizedPackages.forEach(pkg => {
      delete pkg.position
      pkg.placed = false
    })

    await placePackages(successfullyPlaced, newHeight, true)
    return
  }

  sessionStorage.setItem('placedPackages', JSON.stringify(successfullyPlaced))

  proceedToResultsBtn.style.display = 'block'
}

proceedToResultsBtn.addEventListener('click', () => {
  window.location.href = 'optimization-results.html'
})
