addListeners();

function addListeners() {

  document.getElementById("fadeInPlay").addEventListener("click", () => {
    const block = document.getElementById("fadeInBlock");
    animaster().fadeIn(block, 500);
  });

  document.getElementById("fadeInReset").addEventListener("click", () => {
    const block = document.getElementById("fadeInBlock");
    animaster().resetFadeIn(block);
  });

  document.getElementById("fadeOutPlay").addEventListener("click", () => {
    const block = document.getElementById("fadeOutBlock");
    animaster().fadeOut(block, 500);
  });

  document.getElementById("fadeOutReset").addEventListener("click", () => {
    const block = document.getElementById("fadeOutBlock");
    animaster().resetFadeOut(block);
  });

  document.getElementById("movePlay").addEventListener("click", () => {
    const block = document.getElementById("moveBlock");
    animaster().move(block, 500, {x:100, y:20});
  });

  document.getElementById("moveReset").addEventListener("click", () => {
    const block = document.getElementById("moveBlock");
    animaster().resetMoveAndScale(block);
  });

  document.getElementById("scalePlay").addEventListener("click", () => {
    const block = document.getElementById("scaleBlock");
    animaster().scale(block, 500, 1.25);
  });

  document.getElementById("scaleReset").addEventListener("click", () => {
    const block = document.getElementById("scaleBlock");
    animaster().resetMoveAndScale(block);
  });

  document.getElementById("moveAndHidePlay").addEventListener("click", () => {
    const block = document.getElementById("moveAndHideBlock");
    animaster().moveAndHide(2000).play(block);
  });

  document.getElementById("moveAndHideReset").addEventListener("click", () => {
    const block = document.getElementById("moveAndHideBlock");
    animaster().resetFadeOut(block);
    animaster().resetMoveAndScale(block);
  });

  document.getElementById("showAndHidePlay").addEventListener("click", () => {
    const block = document.getElementById("showAndHideBlock");
    animaster().showAndHide(3000).play(block);
  });

  document.getElementById("showAndHideReset").addEventListener("click", () => {
    const block = document.getElementById("showAndHideBlock");
    animaster().resetFadeOut(block);
    animaster().resetFadeIn(block);
  });

  const heartBlock = document.getElementById("heartBeatingBlock");
  let heartController = null;

  document.getElementById("heartBeatingPlay").addEventListener("click", () => {
    heartController = animaster().heartBeating().play(heartBlock, true);
  });

  document.getElementById("heartBeatingStop").addEventListener("click", () => {
    if (heartController) heartController.stop();
  });

  document.getElementById("heartBeatingReset").addEventListener("click", () => {
    if (heartController) heartController.reset();
  });

  const worryAnimationHandler = animaster()
    .addMove(200, {x:80,y:0})
    .addMove(200, {x:0,y:0})
    .addMove(200, {x:80,y:0})
    .addMove(200, {x:0,y:0})
    .buildHandler();

  document
    .getElementById("worryBlock")
    .addEventListener("click", worryAnimationHandler);
}

function animaster() {

  function resetFadeIn(element){
    element.classList.remove("show");
    element.classList.add("hide");
    element.style.transitionDuration = null;
  }

  function resetFadeOut(element){
    element.classList.remove("hide");
    element.classList.add("show");
    element.style.transitionDuration = null;
  }

  function resetMoveAndScale(element){
    element.style.transform = null;
    element.style.transitionDuration = null;
  }

  function getTransform(translation, scale){
    const result = [];
    if(translation){
      result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if(scale){
      result.push(`scale(${scale})`);
    }
    return result.join(" ");
  }

  function clone(anim){
    const newAnim = animaster();
    newAnim._steps = [...anim._steps];
    return newAnim;
  }

  return {

    _steps: [],
    resetFadeIn,
    resetFadeOut,
    resetMoveAndScale,

    fadeIn(element,duration){
      return this.addFadeIn(duration).play(element);
    },

    fadeOut(element,duration){
      return this.addFadeOut(duration).play(element);
    },

    move(element,duration,translation){
      return this.addMove(duration,translation).play(element);
    },

    scale(element,duration,ratio){
      return this.addScale(duration,ratio).play(element);
    },

    addMove(duration, translation){
      const newAnim = clone(this);
      newAnim._steps.push({
        type:"move",
        duration,
        params:translation
      });
      return newAnim;
    },

    addFadeIn(duration){
      const newAnim = clone(this);
      newAnim._steps.push({
        type:"fadeIn",
        duration
      });
      return newAnim;
    },

    addFadeOut(duration){
      const newAnim = clone(this);
      newAnim._steps.push({
        type:"fadeOut",
        duration
      });
      return newAnim;
    },

    addScale(duration,ratio){
      const newAnim = clone(this);
      newAnim._steps.push({
        type:"scale",
        duration,
        params:ratio
      });
      return newAnim;
    },

    addDelay(duration){
      const newAnim = clone(this);
      newAnim._steps.push({
        type:"delay",
        duration
      });
      return newAnim;
    },

    play(element, cycled=false){

      let stepIndex = 0;
      let timer = null;
      const steps = this._steps;

      function run(){
        const step = steps[stepIndex];

        if(!step){
          if(cycled){
            stepIndex = 0;
            run();
          }
          return;
        }

        element.style.transitionDuration = `${step.duration}ms`;

        if(step.type === "move"){
          element.style.transform = getTransform(step.params,null);
        }

        if(step.type === "scale"){
          element.style.transform = getTransform(null,step.params);
        }

        if(step.type === "fadeIn"){
          element.classList.remove("hide");
          element.classList.add("show");
        }

        if(step.type === "fadeOut"){
          element.classList.remove("show");
          element.classList.add("hide");
        }

        stepIndex++;
        timer = setTimeout(run, step.duration);
      }

      run();

      return {

        stop(){
          clearTimeout(timer);
        },

        reset(){
          clearTimeout(timer);
          resetFadeIn(element);
          resetFadeOut(element);
          resetMoveAndScale(element);
        }

      }
    },

    moveAndHide(duration){

      const moveTime = duration * 2/5;
      const hideTime = duration * 3/5;

      return animaster()
        .addMove(moveTime,{x:100,y:20})
        .addFadeOut(hideTime);
    },

    showAndHide(duration){

      const step = duration/3;

      return animaster()
        .addFadeIn(step)
        .addDelay(step)
        .addFadeOut(step);
    },

    heartBeating(){

      return animaster()
        .addScale(500,1.4)
        .addScale(500,1);
    },

    buildHandler(){
      const animation = this;
      return function(){
        animation.play(this);
      }
    }

  };
}
