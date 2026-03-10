// Хранилище активных анимаций сердцебиения
const heartBeatingAnimations = new Map();

addListeners();

function addListeners() {
    // Старые анимации
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            scale(block, 1000, 1.25);
        });

    // Новые анимации
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            showAndHide(block, 3000);
        });

    // Анимация сердцебиения с возможностью остановки
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            
            // Останавливаем предыдущую анимацию для этого блока, если она была
            if (heartBeatingAnimations.has(block)) {
                heartBeatingAnimations.get(block).stop();
            }
            
            // Запускаем новую и сохраняем контроллер
            const controller = heartBeating(block);
            heartBeatingAnimations.set(block, controller);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            
            // Останавливаем анимацию, если она есть
            if (heartBeatingAnimations.has(block)) {
                heartBeatingAnimations.get(block).stop();
                heartBeatingAnimations.delete(block);
                
                // Возвращаем блок в исходное состояние
                block.style.transform = getTransform(null, 1);
            }
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
function fadeIn(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
}

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */
function move(element, duration, translation) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
}

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
function scale(element, duration, ratio) {
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
}

/**
 * Блок двигается (2/5 времени) и исчезает (3/5 времени).
 * @param element — HTMLElement
 * @param duration — общая продолжительность в мс
 */
function moveAndHide(element, duration) {
    const moveTime = (duration / 5) * 2;
    const hideTime = (duration / 5) * 3;

    // Движение
    element.style.transitionDuration = moveTime + 'ms';
    element.style.transform = getTransform({x: 100, y: 20}, null);

    // Исчезновение
    setTimeout(() => {
        element.style.transitionDuration = hideTime + 'ms';
        element.style.opacity = '0';
    }, moveTime);
}

/**
 * Блок появляется, ждёт, исчезает.
 * @param element — HTMLElement
 * @param duration — общая продолжительность в мс
 */
function showAndHide(element, duration) {
    const stepTime = duration / 3;

    // Появление
    element.style.transitionDuration = stepTime + 'ms';
    element.classList.remove('hide');
    element.classList.add('show');

    // Ожидание (ничего не меняем)
    setTimeout(() => {
        // Исчезновение
        element.style.transitionDuration = stepTime + 'ms';
        element.classList.remove('show');
        element.classList.add('hide');
    }, stepTime * 2); // ждём появление + паузу
}

/**
 * Бесконечное сердцебиение: увеличение до 1.4, потом назад до 1.
 * Каждый шаг длится 0.5 секунды.
 * @param element — HTMLElement
 * @returns {Object} контроллер с методом stop для остановки анимации
 */
function heartBeating(element) {
    let intervalId = null;
    let timeoutId = null;
    let isActive = true;

    const step1 = () => {
        if (!isActive) return;
        element.style.transitionDuration = '500ms';
        element.style.transform = getTransform(null, 1.4);
    };

    const step2 = () => {
        if (!isActive) return;
        element.style.transitionDuration = '500ms';
        element.style.transform = getTransform(null, 1);
    };

    // Функция для запуска цикла
    const startBeat = () => {
        if (!isActive) return;
        
        step1();
        timeoutId = setTimeout(() => {
            step2();
        }, 500);
    };

    // Запускаем первый удар
    startBeat();

    // Запускаем интервал для повторения
    intervalId = setInterval(() => {
        startBeat();
    }, 1000);

    // Возвращаем объект с методом stop
    return {
        stop: function() {
            isActive = false;
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            
            // Сбрасываем трансформацию
            element.style.transitionDuration = '300ms';
            element.style.transform = getTransform(null, 1);
        }
    };
}

/**
 * Вспомогательная функция для формирования transform
 */
function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
