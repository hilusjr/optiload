const addCriterionBtn = document.querySelector('.add-criterion-btn')
const criteriaSection = document.querySelector('.criteria-section')
const otherFactorsElement = document.querySelector('.other-criteria-element')
const otherFactorsValue = document.querySelector('.other-factors-value')

const criteriaOptions = [
  'Volume',
  'Weight',
  'Remaining delivery time',
  'Distance',
]
let availableCriteriaOptions = [...criteriaOptions] // dynamic list
const criteria = []

addCriterionBtn.addEventListener('click', openAddCriterionDialog)

function openAddCriterionDialog() {
  const dialogHeader = createElement('span', {
    textContent: 'Add new criterion',
  })

  const criteriaSelection = createCriteriaSelect()
  const valueInput = createElement('input', {
    type: 'number',
    placeholder: 'Value',
    classList: ['criteria-value-input'],
  })

  const confirmButton = createElement('button', {
    textContent: 'Add',
  })

  let criteriaData = {
    title: availableCriteriaOptions[0] || '',
    value: null,
  }

  dialogWindow.append(
    dialogHeader,
    criteriaSelection,
    valueInput,
    confirmButton
  )
  dialogElement.style.display = 'flex'

  criteriaSelection.addEventListener('change', () => {
    criteriaData.title =
      availableCriteriaOptions[criteriaSelection.selectedIndex]
  })

  valueInput.addEventListener('input', () => {
    valueInput.classList.remove('error')
    criteriaData.value = valueInput.value
  })

  confirmButton.addEventListener('click', () => {
    if (!validateCriterionValue(valueInput, criteriaData)) return

    criteria.push({ ...criteriaData })

    // Remove selected option from available
    availableCriteriaOptions = availableCriteriaOptions.filter(
      item => item !== criteriaData.title
    )

    refreshCriteriaList()
    closeDialog()
  })
}

function validateCriterionValue(inputElement, data) {
  const rawValue = String(data.value || '')
  const normalized = rawValue.replace(',', '.')

  const formatted = /^0(?![.,])\d+/.test(normalized)
    ? '0.' + normalized.slice(1)
    : normalized

  const numericValue = Number(formatted)

  const isInvalid = !numericValue || numericValue <= 0 || numericValue >= 1

  data.value = numericValue
  inputElement.classList.toggle('error-outline', isInvalid)
  inputElement.classList.toggle('error-text', isInvalid)

  return !isInvalid
}

function refreshCriteriaList() {
  const criteriaList = document.querySelector('.criteria-list')
  criteriaList.innerHTML = ''
  criteriaSection.style.display = 'none'

  criteria.forEach((item, index) => {
    const title = createElement('div', {
      textContent: item.title,
      classList: ['criterion-title'],
    })

    const value = createElement('div', { textContent: item.value })

    const deleteBtn = createElement('div', {
      classList: ['criterion-delete-btn'],
      innerHTML: "<i class='bx bx-x'></i>",
    })

    deleteBtn.addEventListener('click', () => {
      // Return criterion back to available options
      availableCriteriaOptions.push(item.title)
      availableCriteriaOptions.sort(
        (a, b) => criteriaOptions.indexOf(a) - criteriaOptions.indexOf(b)
      )

      criteria.splice(index, 1)
      refreshCriteriaList()
    })

    const itemElement = createElement('div', {
      classList: ['criterion-element'],
    })

    itemElement.append(title, value, deleteBtn)
    criteriaList.appendChild(itemElement)
    criteriaSection.style.display = 'block'
  })

  renderUtilities()
  renderOtherFactorsValue()
}

function renderOtherFactorsValue() {
  const total = criteria.reduce((sum, c) => sum + c.value, 0)
  const remainder = Math.round((1 - total) * 1000) / 1000

  otherFactorsValue.textContent = remainder
  otherFactorsElement.style.display = 'flex'

  const isError = remainder < 0
  otherFactorsElement.classList.toggle('error-bg', isError)
  otherFactorsValue.classList.toggle('error-text', isError)
}

function closeDialog() {
  dialogWindow.innerHTML = ''
  dialogElement.style.display = 'none'
}

function createElement(tag, props = {}) {
  const el = document.createElement(tag)
  for (const [key, value] of Object.entries(props)) {
    if (key === 'classList') {
      value.forEach(cls => el.classList.add(cls))
    } else {
      el[key] = value
    }
  }
  return el
}

function createCriteriaSelect() {
  const select = document.createElement('select')
  availableCriteriaOptions.forEach((optionText, index) => {
    const option = createElement('option', {
      value: index,
      textContent: optionText,
    })
    select.appendChild(option)
  })
  return select
}
