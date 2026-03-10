addListeners();
const anim = animaster()
function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.fadeIn(block, 5000);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anim.fadeOut(block, 5000);
        });
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anim.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.scale(block, 1000, 1.25);
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

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeating(block);
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */


/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */


/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */


function animaster() {
    return {
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        }

    };
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
 */
function heartBeating(element) {
    // Сбросим возможные старые интервалы (чтобы при повторном нажатии не плодились)
    if (element.dataset.heartBeatInterval) {
        clearInterval(element.dataset.heartBeatInterval);
    }

    const step1 = () => {
        element.style.transitionDuration = '500ms';
        element.style.transform = getTransform(null, 1.4);
    };

    const step2 = () => {
        element.style.transitionDuration = '500ms';
        element.style.transform = getTransform(null, 1);
    };

    // Запускаем циклически
    step1(); // сразу первый удар
    const intervalId = setInterval(() => {
        step1();
        setTimeout(step2, 500); // через 0.5 сек возвращаем
    }, 1000); // полный цикл удара

    // Сохраняем id, чтобы можно было остановить позже (если потребуется)
    element.dataset.heartBeatInterval = intervalId;
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
