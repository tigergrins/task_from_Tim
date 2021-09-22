'use strict'

const input = document.querySelector('.input')
const wrapper = document.querySelector('.wrapper')
const list = document.querySelector('.list')
let state = {
    index: 1,
    total: 0,
    values: [],
}

let previousY = 0
let previousRatio = 0

function createElement(index, value) {
    const li = document.createElement('li')
    li.id = index
    li.innerHTML = `<span>№ ${index} Random number: ${value}</span>`
    return li
}

function addingData() {
    for (let i = 0; i < 101; i++) {
        state.values.push(Math.floor(Math.random() * 10))
    }
}

input.addEventListener('change', (event) => {
    state = {
        index: 1,
        total: +event.currentTarget.value,
        values: [],
    }

    // Зачищаем список и убираем предупреждение об неккорекном значении
    list.innerHTML = ''
    input.style.background = 'none'

    // Проверяем на некорректное значение
    if (event.currentTarget.value < 0) {
        input.style.background = '#f54c4c'
        return console.log('Incorrect value')
    }

    // Создаём массив данных
    if (+event.currentTarget.value < 100) {
        for (let i = 0; i < +event.currentTarget.value; i++) {
            state.values.push(Math.floor(Math.random() * 10))
        }
    } else {
        addingData()
    }

    // Создаём первую партию элементов, которая помещается в видимую часть браузера
    for (let i = 0; i < +event.currentTarget.value; i++) {
        const element = createElement(state.index, state.values[i])
        list.append(element)
        state.index++
        if (element.offsetTop > (wrapper.offsetHeight + 150)) {
            break
        }
    }

    previousY = 0
    previousRatio = 0

    observerForFirstElement.observe(list.firstElementChild)
    observerForLastElement.observe(list.lastElementChild)
})

// Intersection Observer
const thresholdArray = steps => Array(steps + 1)
    .fill(0)
    .map((_, index) => index / steps || 0)

const handleIntersectForFirstElement = entries => {
    if (entries[0].intersectionRatio <= 0) return

    entries.forEach(entry => {
        const currentY = entry.boundingClientRect.y
        const currentRatio = entry.intersectionRatio
        const isIntersecting = entry.isIntersecting

        if (currentY > previousY && isIntersecting && entries[0].intersectionRatio !== 1) {
            if (currentRatio > previousRatio) {
                if (state.index > 1) {
                    state.index = +list.firstElementChild.id - 1

                    let movingElement = list.lastElementChild
                    movingElement.id = state.index
                    movingElement.innerText = `№ ${state.index} Random number: ${state.values[state.index - 1]}`

                    list.prepend(movingElement)

                    observerForFirstElement.unobserve(entry.target)
                    observerForFirstElement.observe(list.firstElementChild)

                    observerForLastElement.unobserve(entry.target)
                    observerForLastElement.observe(list.lastElementChild)
                }
            }
        }
        previousY = currentY
        previousRatio = currentRatio
    })

}

const handleIntersectForLastElement = entries => {
    if (entries[0].intersectionRatio <= 0) return

    entries.forEach(entry => {
        const currentY = entry.boundingClientRect.y
        const currentRatio = entry.intersectionRatio
        const isIntersecting = entry.isIntersecting

        if (currentY < previousY) {
            if (currentRatio > previousRatio && isIntersecting) {
                if (state.index < state.total) {
                    state.index = +list.lastElementChild.id + 1

                    if (state.index === state.values.length && state.index !== state.total) addingData()

                    let movingElement = list.firstElementChild
                    movingElement.id = state.index
                    movingElement.innerText = `№ ${state.index} Random number: ${state.values[state.index - 1]}`
                    list.appendChild(movingElement)

                    observerForFirstElement.unobserve(entry.target)
                    observerForFirstElement.observe(list.firstElementChild)

                    observerForLastElement.unobserve(entry.target)
                    observerForLastElement.observe(list.lastElementChild)
                }

            }
        }
        previousY = currentY
        previousRatio = currentRatio
    })

}

const observerForFirstElement = new IntersectionObserver(handleIntersectForFirstElement, {
    root: document.querySelector('.wrapper'),
    threshold: thresholdArray(20),
})

const observerForLastElement = new IntersectionObserver(handleIntersectForLastElement, {
    root: document.querySelector('.wrapper'),
    rootMargin: '-10px',
    threshold: thresholdArray(20),
})


