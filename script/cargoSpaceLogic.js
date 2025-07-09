const proceedToResultsBtn = document.querySelector('.proceed-to-results')

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

  placePackages(optimizedPackages)
}

async function placePackages(optimizedPackages) {
  const cellSize = 1 // 1 cm³ cells

  const spaceParams = JSON.parse(sessionStorage.getItem('spaceParams'))
  const maxWeight = spaceParams.weight * 1000

  const cargoSpace = {
    length: spaceParams.length,
    width: spaceParams.width,
    height: spaceParams.height,
  }

  const occupiedCells = new Set()
  const successfullyPlaced = []
  const failedToPlace = []

  let currentWeight = 0

  const logContainer = document.querySelector('.log-content')

  function delay(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

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
          const key = `${x},${y},${z}`
          occupiedCells.add(key)
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
          const key = `${x},${y},${z}`
          if (occupiedCells.has(key)) return false
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
        `⚠️ Skipped package due to weight limit: Package #${pkg.id} (${pkg.weight}kg)`
      )
      await delay(10)
      continue
    }

    const dimsCm = pkg.dimensions
    const cellDims = {
      x: Math.ceil(dimsCm.length),
      y: Math.ceil(dimsCm.width),
      z: Math.ceil(dimsCm.height),
    }

    let placed = false

    for (let x = 0; x <= cargoSpace.length - cellDims.x; x++) {
      for (let y = 0; y <= cargoSpace.width - cellDims.y; y++) {
        for (let z = 0; z <= cargoSpace.height - cellDims.z; z++) {
          const start = { x, y, z }

          if (checkFits(start, cellDims)) {
            occupyCells(start, cellDims)
            pkg.position = start
            pkg.placed = true
            currentWeight += pkg.weight
            successfullyPlaced.push(pkg)
            log(
              `✅ Placed package ${pkg.id} at (${x},${y},${z}) — total weight: ${currentWeight}/${maxWeight}kg`
            )
            placed = true
            break
          }
        }
        if (placed) break
      }
      if (placed) break
    }

    if (!placed && pkg.placed !== false) {
      pkg.placed = false
      failedToPlace.push(pkg)
      warn(`❌ Could not place package due to space: Package #${pkg.id}`)
    }

    await delay(10) // allow UI to update after each package
  }

  log(`📦 Occupied cells: ${occupiedCells.size}`)
  log(`✅ Successfully placed packages: ${successfullyPlaced.length}`)
  log(`❌ Unplaced packages: ${failedToPlace.length}`)

  sessionStorage.setItem(
    'successfullyPlacedPackages',
    JSON.stringify(successfullyPlaced)
  )
  sessionStorage.setItem('failedToPlace', JSON.stringify(failedToPlace))

  proceedToResultsBtn.style.display = 'block'
}

proceedToResultsBtn.addEventListener('click', () => {
  window.location.href = 'optimization-results.html'
})
