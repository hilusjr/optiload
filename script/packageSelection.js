const packageSelectionBtn = document.querySelector('.package-selection-btn')

const titleToPropertyMap = {
  Volume: 'volume',
  Weight: 'weight',
  Distance: 'distance',
  'Remaining delivery time': 'daysLeft',
}

packageSelectionBtn.addEventListener('click', () => {
  calculateUtilityFunctionValue()
  calculateObjectiveFunctionValue()
  packages.sort((a, b) => b.objectiveValue - a.objectiveValue)
  sessionStorage.setItem('packages', JSON.stringify(packages))
  sessionStorage.setItem('criteria', JSON.stringify(criteria))
  sessionStorage.setItem('utilityParams', JSON.stringify(utilityParams))
  window.location.href = 'subpages/optimized-selection.html'
})

function calculateUtilityFunctionValue() {
  const increasingUtilityCriteria = ['Volume', 'Weight', 'Distance']

  packages.forEach(pkg => {
    pkg.utilityValues = {} // store results per criterion

    criteria.forEach(criterion => {
      const title = criterion.title
      const property = titleToPropertyMap[title]
      const value = pkg[property] // e.g., pkg.weight for "Weight"
      const maxValue = utilityParams[title]?.maxValue || 100
      const exponent = utilityParams[title]?.exponent || 1
      const isIncreasing = increasingUtilityCriteria.includes(title)

      // Avoid divide-by-zero
      if (maxValue === 0) {
        pkg.utilityValues[title] = 0
        return
      }

      // Utility calculation
      let utility
      if (isIncreasing) {
        utility = Math.pow(value / maxValue, exponent)
      } else {
        utility = Math.pow((maxValue - value) / maxValue, exponent)
      }

      // Clamp between 0 and 1 (just in case)
      utility = Math.max(0, Math.min(utility, 1))

      pkg.utilityValues[title] = utility
    })
  })
}

function calculateObjectiveFunctionValue() {
  packages.forEach(pkg => {
    let objectiveValue = 0

    criteria.forEach(criterion => {
      const title = criterion.title
      const weight = criterion.value || 0 // Make sure the criterion has a weight
      const utility = pkg.utilityValues?.[title] || 0
      console.log(title, weight, utility)

      objectiveValue += weight * utility
    })

    pkg.objectiveValue = parseFloat(objectiveValue.toFixed(6)) // Optional rounding
  })
}
