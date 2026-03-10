const heartBeatingAnimations = new Map();
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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (heartBeatingAnimations.has(block)) {
                heartBeatingAnimations.get(block).stop();
            }
            const controller = heartBeating(block);
            heartBeatingAnimations.set(block, controller);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (heartBeatingAnimations.has(block)) {
                heartBeatingAnimations.get(block).stop();
                heartBeatingAnimations.delete(block);
                block.style.transform = getTransform(null, 1);
            }
        });
}

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
        },
        moveAndHide(element, duration) {
            const moveTime = (duration / 5) * 2;
            const hideTime = (duration / 5) * 3;

            element.style.transitionDuration = moveTime + 'ms';
            element.style.transform = getTransform({x: 100, y: 20}, null);

            setTimeout(() => {
                element.style.transitionDuration = hideTime + 'ms';
                element.style.opacity = '0';
            }, moveTime);
        },
        showAndHide(element, duration) {
            const stepTime = duration / 3;
            element.style.transitionDuration = stepTime + 'ms';
            element.classList.remove('hide');
            element.classList.add('show');
            setTimeout(() => {
                element.style.transitionDuration = stepTime + 'ms';
                element.classList.remove('show');
                element.classList.add('hide');
            }, stepTime * 2);
        },
    };
}


function heartBeating(element) {
    let intervalId = null;
    let timeoutId = null;
    let isActive = true;

    const step1 = () => {
        if (!isActive)
            return;
        element.style.transitionDuration = '500ms';
        element.style.transform = getTransform(null, 1.4);
    };

    const step2 = () => {
        if (!isActive)
            return;
        element.style.transitionDuration = '500ms';
        element.style.transform = getTransform(null, 1);
    };

    const startBeat = () => {
        if (!isActive)
            return;
        step1();
        timeoutId = setTimeout(() => {
            step2();
        }, 500);
    };

    startBeat();
    intervalId = setInterval(() => {
        startBeat();
    }, 1000);

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
