function exportScenario() {
  const scenario = {
    spaceParams: JSON.parse(sessionStorage.getItem('spaceParams')),
    packages: JSON.parse(sessionStorage.getItem('packages')),
    criteria: JSON.parse(sessionStorage.getItem('criteria')),
    placedPackages: JSON.parse(sessionStorage.getItem('placedPackages')),
    failedToPlace: JSON.parse(sessionStorage.getItem('failedToPlace')),
    optimizedPackages: JSON.parse(sessionStorage.getItem('optimizedPackages')),
  }

  const blob = new Blob([JSON.stringify(scenario, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'example.json'
  a.click()

  URL.revokeObjectURL(url)
}
