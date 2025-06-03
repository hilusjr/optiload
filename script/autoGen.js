const autoGenBtn = document.querySelector('.auto-gen-btn')

autoGenBtn.addEventListener('click', () => {
  for (let i = 0; i < 100; i++) {
    const pickedDimensions =
      dimensions[Math.floor(Math.random() * dimensions.length)]
    const volume =
      (pickedDimensions.width *
        pickedDimensions.height *
        pickedDimensions.length) /
      1e6
    const weight = Math.floor(Math.random() * 25) + 1
    const daysLeft = Math.floor(Math.random() * 14) + 1
    const distance = Math.floor(Math.random() * 30) + 1

    const pkg = {
      id: packageID++,
      dimensions: pickedDimensions,
      volume,
      weight,
      daysLeft,
      distance,
    }

    packages.push(pkg)
  }

  isStockGenerated = true
  displayGenerationSuccessDialog()
})
