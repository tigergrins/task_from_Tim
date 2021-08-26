'use strict'

const input = document.querySelector('.input')
const list = document.querySelector('.list')
let index = 1
let total = 0

function createElement() {
    const li = document.createElement('li')
    const span = document.createElement('span')
    span.innerText = `№ ${index} Random number: ${Math.floor(Math.random() * 10)}`
    li.append(span)
    return li
}

input.addEventListener('change', (event) => {
    index = 1
    total = +event.currentTarget.value

    // Зачищаем список и убираем предупреждение об неккорекном значении
    list.innerHTML = ''
    input.style.background = 'none'

    // Проверяем на некорректное значение
    if (event.currentTarget.value < 0) {
        input.style.background = '#f54c4c'
        return console.log('Incorrect value')
    }

    // Создаём первую партию элементов, которая помещается в видимую часть браузера
    for (let i = 0; i < +event.currentTarget.value; i++) {
        const element = createElement()
        list.append(element)

        index++
        total--

        if (element.offsetTop > window.innerHeight) {
            break
        }
    }
})

// При скроле добавляем элементы, пока total не будет равен 0
const scrollHandler = () => {
    if (total > 0) {
        const element = createElement()
        list.append(element)

        index++
        total--
    }
}

document.addEventListener('scroll', scrollHandler)
