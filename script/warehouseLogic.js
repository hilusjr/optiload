const warehouseStock = document.querySelector('.warehouse-stock')
const warehouseContainer = document.querySelector('.warehouse-container')
const closeWarehouseCardBtn = document.querySelector(
  '.close-warehouse-card-btn'
)
const seeWarehouseStockBtn = document.querySelector('.see-stock-btn')
const deleteStockBtn = document.querySelector('.delete-stock-btn')

const packages = []
const dimensions = [
  { width: 100, length: 200, height: 100 },
  { width: 300, length: 400, height: 200 },
  { width: 150, length: 300, height: 200 },
  { width: 400, length: 500, height: 300 },
  { width: 500, length: 800, height: 350 },
]

let isStockGenerated = false
let packageID = 1

seeWarehouseStockBtn.addEventListener('click', () => {
  if (!isStockGenerated) return
  renderPackages()
  warehouseContainer.style.display = 'flex'
})

deleteStockBtn.addEventListener('click', () => {
  packages.length = 0
  packageID = 1
  isStockGenerated = false
  seeWarehouseStockBtn.classList.add('deactivated')
  closeWarehouseCard()
})

closeWarehouseCardBtn.addEventListener('click', closeWarehouseCard)

function closeWarehouseCard() {
  warehouseContainer.style.display = 'none'
  warehouseStock.innerHTML = ''
}

function displayGenerationSuccessDialog() {
  const dialogHeader = document.createElement('span')
  const messageDiv = document.createElement('div')
  const confirmButton = document.createElement('button')

  dialogHeader.textContent = 'Stock generated'
  messageDiv.textContent =
    'The stock was successfuly generated, it is now accessible when pressing "See warehouse stock" button.'
  confirmButton.textContent = 'ok'

  dialogWindow.append(dialogHeader, messageDiv, confirmButton)
  dialogElement.style.display = 'flex'

  confirmButton.addEventListener('click', () => {
    dialogWindow.innerHTML = ''
    dialogElement.style.display = 'none'
  })

  seeWarehouseStockBtn.classList.remove('deactivated')
}

function renderPackages() {
  packages.forEach(pkg => {
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

    warehouseStock.appendChild(pkgElement)
  })
}
