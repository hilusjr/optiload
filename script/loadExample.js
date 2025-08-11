function loadExampleScenario() {
  fetch('example.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load scenario file.')
      return response.json()
    })
    .then(scenario => {
      sessionStorage.setItem(
        'spaceParams',
        JSON.stringify(scenario.spaceParams)
      )
      sessionStorage.setItem('packages', JSON.stringify(scenario.packages))
      sessionStorage.setItem('criteria', JSON.stringify(scenario.criteria))
      sessionStorage.setItem(
        'placedPackages',
        JSON.stringify(scenario.placedPackages)
      )
      sessionStorage.setItem(
        'failedToPlace',
        JSON.stringify(scenario.failedToPlace)
      )
      sessionStorage.setItem(
        'optimizedPackages',
        JSON.stringify(scenario.optimizedPackages)
      )
      location.href = '/subpages/optimization-results.html'
    })
    .catch(err => {
      console.error('Error loading scenario:', err)
      alert('Failed to load scenario.')
    })
}
