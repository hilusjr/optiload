const manualGenBtn = document.querySelector('.manual-gen-btn')
const manualGenSection = document.querySelector('.manual-gen-section')
const genBtn = document.querySelector('.gen-btn')
const dimensionsSelect = document.querySelector('.gen-dimensions-in')
const weightInput = document.querySelector('.gen-weight-in')
const timeInput = document.querySelector('.gen-time-in')
const distanceInput = document.querySelector('.gen-distance-in')
const amountInput = document.querySelector('.gen-amount-in')

const inputs = [
  { el: weightInput, max: 10, key: 'weightManGen' },
  { el: timeInput, max: 14, key: 'timeManGen' },
  { el: distanceInput, max: 30, key: 'distanceManGen' },
  { el: amountInput, max: Infinity, key: 'amountManGen' },
]

const manualGenData = {
  weightManGen: null,
  timeManGen: null,
  distanceManGen: null,
  amountManGen: null,
}

const manualGenValidity = {
  weightManGen: false,
  timeManGen: false,
  distanceManGen: false,
  amountManGen: false,
}

manualGenBtn.addEventListener('click', () => {
  manualGenSection.style.display = 'flex'
  const dimensionsSelect = manualGenSection.querySelector('.gen-dimensions-in')

  dimensions.forEach((dim, index) => {
    const option = document.createElement('option')
    option.value = index
    option.textContent = `${dim.width}x${dim.length}x${dim.height}`
    dimensionsSelect.appendChild(option)
  })
})

dimensionsSelect.addEventListener('click', () => {
  const selectedIndex = dimensionsSelect.selectedIndex
  manualGenData.dimensionsManGen = dimensions[selectedIndex]
})

inputs.forEach(({ el, max, key }) => {
  el.addEventListener('keyup', () => {
    const value = parseFloat(el.value)
    el.classList.remove('error-outline')
    el.classList.remove('error-text')

    if (value > 0 && value <= max) {
      manualGenData[key] = value
      manualGenValidity[key] = true
    } else {
      el.classList.add('error-outline')
      el.classList.add('error-text')
      manualGenValidity[key] = false
    }

    activateManualGenBtn()
  })
})

function activateManualGenBtn() {
  const allValid = Object.values(manualGenValidity).every(Boolean)
  genBtn.classList.toggle('deactivated', !allValid)

  if (allValid) {
    genBtn.addEventListener('click', handleManualGeneration)
  } else genBtn.removeEventListener('click', handleManualGeneration)
}

function handleManualGeneration() {
  for (let i = 0; i < manualGenData.amountManGen; i++) {
    const dims = manualGenData.dimensionsManGen || dimensions[0]
    const volume = (dims.width * dims.height * dims.length) / 1e6 // m³ converted to liters or similar unit

    const pkg = {
      id: packageID++,
      dimensions: dims,
      volume, // new property added
      weight: manualGenData.weightManGen,
      daysLeft: manualGenData.timeManGen,
      distance: manualGenData.distanceManGen,
    }

    packages.push(pkg)
  }

  displayGenerationSuccessDialog()
  isStockGenerated = true

  dimensionsSelect.innerHTML = ''
  weightInput.value = null
  timeInput.value = null
  distanceInput.value = null
  amountInput.value = null
  manualGenSection.style.display = 'none'
}
