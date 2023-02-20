const sidebarDiv = document.querySelector(".sidebar-container");
const creativeDiv = document.querySelector(".creative-container");
const mainDiv = document.querySelector(".main-container");
const sliderDiv = document.querySelector(".slider");
const animDiv = document.querySelector(".animated-element");
const resultDiv = document.querySelector(".result");

const selects = document.querySelectorAll(".select");
const selectTransform = document.querySelector(".select-transform");
const rangeTransform1 = document.querySelector(".range-transform-1");
const inputRange1 = document.querySelector(".input-range-1");
const rangeTransform2 = document.querySelector(".range-transform-2");
const inputRange2 = document.querySelector(".input-range-2");
const inputDuration = document.querySelector(".input-duration");
const inputDelay = document.querySelector(".input-delay");
const selectTiming = document.querySelector(".select-timing");
const selectFill = document.querySelector(".select-fill");
const selectDirection = document.querySelector(".select-direction");
const radioIteration = document.querySelectorAll(".radio-iteration");
const inputIteration = document.querySelector(".input-iteration");

const inputPerspective = document.querySelector(".input-perspective");
const inputWidth = document.querySelector(".input-width");
const inputHeight = document.querySelector(".input-height");
const buttonUpload = document.querySelector('.input-upload');

let sliderIsActive = false;
let animationIsActive = true;
let perspectiveIsActive = false;
let gridIsActive = false;
let iterationValue = 'infinite';

let perspectiveValue = inputPerspective.value;
const perspectiveCss = () => {
  if (perspectiveIsActive) {
    return `
.element-container {
  perspective: ${perspectiveValue}px;
}
`;
  } else {
    return '';
  }
}

let mouseX = 50;
let mouseY = 50;
let relativeX = 50;
let relativeY = 50;

let currentTransform = 'rotate';
const transformTypes = {
  translateX: {
    min: -100,
    max: 100,
    step: 1,
    unit: '%'
  },
  translateY: {
    min: -100,
    max: 100,
    step: 1,
    unit: '%'
  },
  rotate: {
    min: 0,
    max: 360,
    step: 1,
    unit: 'deg'
  },
  rotateX: {
    min: 0,
    max: 360,
    step: 1,
    unit: 'deg'
  },
  rotateY: {
    min: 0,
    max: 360,
    step: 1,
    unit: 'deg'
  },
  scale: {
    min: 0,
    max: 2,
    step: 0.1,
    unit: ''
  },
  skewX: {
    min: -90,
    max: 90,
    step: 1,
    unit: 'deg'
  },
  skewY: {
    min: -90,
    max: 90,
    step: 1,
    unit: 'deg'
  }
}


/* === Result funtioning === */

const restartAnimation = () => {
  animDiv.style.animationName = `none`;
  window.setTimeout(() => {
    animDiv.style.animationName = `${selectTransform.value}Anim`;
  }, 100);
}

const removeAnimation = () => {
  animDiv.style.removeProperty('animation-name');
  animDiv.style.removeProperty('animation-duration');
  animDiv.style.removeProperty('animation-delay');
  animDiv.style.removeProperty('animation-timing-function');
  animDiv.style.removeProperty('animation-fill-mode');
  animDiv.style.removeProperty('animation-direction');
  animDiv.style.removeProperty('animation-iteration-count');
}

const setAnimationProperties = () => {
  animDiv.style.transformOrigin = `${relativeX}% ${relativeY}%`;
  animDiv.style.transform = `${selectTransform.value}(${inputRange2.value}${transformTypes[currentTransform].unit})`;
  animDiv.style.animationName = `${selectTransform.value}Anim`;
  animDiv.style.animationDuration = `${inputDuration.value}s`;
  animDiv.style.animationDelay = `${inputDelay.value}s`;
  animDiv.style.animationTimingFunction = `${selectTiming.value}`;
  animDiv.style.animationFillMode = `${selectFill.value}`;
  animDiv.style.animationDirection = `${selectDirection.value}`;
  animDiv.style.animationIterationCount = `${iterationValue}`;
}

const displayResult = () => {
  if (animationIsActive) {
    resultDiv.value = `.element {
  transform-origin: ${Math.floor(relativeX)}% ${Math.floor(relativeY)}%;
  animation-name: ${selectTransform.value}Anim;
  animation-duration: ${inputDuration.value}s;
  animation-timing-function: ${selectTiming.value};
  animation-delay: ${inputDelay.value}s;
  animation-fill-mode: ${selectFill.value};
  animation-direction: ${selectDirection.value};
  animation-iteration-count: ${iterationValue};
}
${perspectiveCss()}
@keyframes ${selectTransform.value}Anim {
  from{
    transform: ${selectTransform.value}(${inputRange1.value}${transformTypes[currentTransform].unit});
  }
  to{
    transform: ${selectTransform.value}(${inputRange2.value}${transformTypes[currentTransform].unit});
  }
}`
  } else {
    resultDiv.value = `.element {
  transform: ${selectTransform.value}(${inputRange2.value}${transformTypes[currentTransform].unit});
  transform-origin: ${Math.floor(relativeX)}% ${Math.floor(relativeY)}%
};
${perspectiveCss()}`;
  }
};


/* === Slider functioning === */

function getMouseXY(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

const moveSlider = (valueX, valueY) => {
  sliderDiv.style.left = `${valueX}%`;
  sliderDiv.style.top = `${valueY}%`;
};

const setTransformOrigin = (valueX, valueY) => {
  animDiv.style.transformOrigin = `${valueX}% ${valueY}%`;
};

const pointerAction = (e) => {
  getMouseXY(e);

  // Substract the sidebar.
  mouseX -= creativeDiv.offsetLeft;
  mouseY -= creativeDiv.offsetTop;

  // Add margins because the mainDiv is smaller than creativeDiv.
  mouseX -= (creativeDiv.offsetWidth - mainDiv.offsetWidth) / 2;
  mouseY -= (creativeDiv.offsetHeight - mainDiv.offsetHeight) / 2;
  console.log(mouseX, mouseY);

  relativeX = (mouseX * 100) / mainDiv.offsetWidth;
  relativeY = (mouseY * 100) / mainDiv.offsetHeight;

  moveSlider(relativeX, relativeY);
  setTransformOrigin(relativeX, relativeY);
  displayResult();
}

sliderDiv.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  sliderIsActive = !sliderIsActive;

  if (sliderIsActive) {
    creativeDiv.addEventListener("mousemove", pointerAction);
  } else {
    creativeDiv.removeEventListener("mousemove", pointerAction);
  }
});

/* === Keyframes generation === */

const updateKeyframes = () => {
  cssKeyframes.nodeValue = `@keyframes ${selectTransform.value}Anim { from{ transform: ${selectTransform.value}(${inputRange1.value}${transformTypes[currentTransform].unit}); } to{ transform: ${selectTransform.value}(${inputRange2.value}${transformTypes[currentTransform].unit}); } }`;
}

let keyframesStyle = document.createElement('style');
keyframesStyle.type = 'text/css';
let cssKeyframes = document.createTextNode(`@keyframes ${selectTransform.value}Anim { from{ transform: ${selectTransform.value}(0${transformTypes[currentTransform].unit}); } to{ transform: ${selectTransform.value}(${inputRange2.value}${transformTypes[currentTransform].unit}); } }`);
keyframesStyle.appendChild(cssKeyframes);
document.getElementsByTagName("head")[0].appendChild(keyframesStyle);


/* === Sidebar configurators === */

const updateTransformRange = () => {
  rangeTransform1.setAttribute('max', transformTypes[currentTransform].max);
  rangeTransform1.setAttribute('min', transformTypes[currentTransform].min);
  rangeTransform1.setAttribute('step', transformTypes[currentTransform].step);
  rangeTransform1.value = transformTypes[currentTransform].min;
  inputRange1.value = transformTypes[currentTransform].min;
  rangeTransform2.setAttribute('max', transformTypes[currentTransform].max);
  rangeTransform2.setAttribute('min', transformTypes[currentTransform].min);
  rangeTransform2.setAttribute('step', transformTypes[currentTransform].step);
  rangeTransform2.value = transformTypes[currentTransform].max;
  inputRange2.value = transformTypes[currentTransform].max;
}

selectTransform.addEventListener("change", () => {
  animDiv.style.animationName = `${selectTransform.value}Anim`;
  currentTransform = selectTransform.value;
  updateTransformRange();
  document.querySelector('.range-transform-unit-1').innerHTML = `&nbsp;${transformTypes[currentTransform].unit}`;
  document.querySelector('.range-transform-unit-2').innerHTML = `&nbsp;${transformTypes[currentTransform].unit}`;
});

rangeTransform1.addEventListener("change", () => {
  inputRange1.value = rangeTransform1.value;
  displayResult();
  updateKeyframes();
});

inputRange1.addEventListener("change", () => {
  rangeTransform1.value = inputRange1.value;
  displayResult();
  updateKeyframes();
});

rangeTransform2.addEventListener("change", () => {
  inputRange2.value = rangeTransform2.value;
  animDiv.style.transform = `${selectTransform.value}(${inputRange2.value}${transformTypes[currentTransform].unit})`;
  displayResult();
  updateKeyframes();
});

inputRange2.addEventListener("change", () => {
  rangeTransform2.value = inputRange2.value;
  animDiv.style.transform = `${selectTransform.value}(${inputRange2.value}${transformTypes[currentTransform].unit})`;
  displayResult();
  updateKeyframes();
});

inputDuration.addEventListener("change", () => {
  animDiv.style.animationDuration = `${inputDuration.value}s`;
  displayResult();
  updateKeyframes();
});

inputDelay.addEventListener("change", () => {
  animDiv.style.animationDelay = `${inputDelay.value}s`;
  restartAnimation();
  displayResult();
  updateKeyframes();
});

selectTiming.addEventListener("change", () => {
  animDiv.style.animationTimingFunction = `${selectTiming.value}`;
});

selectFill.addEventListener("change", () => {
  animDiv.style.animationFillMode = `${selectFill.value}`;
});

selectDirection.addEventListener("change", () => {
  animDiv.style.animationDirection = `${selectDirection.value}`;
});

for (const radio of radioIteration) {
  radio.addEventListener("change", () => {
    if ((radio.value == 'infinite') && radio.checked) {
      iterationValue = 'infinite';
    } else {
      iterationValue = inputIteration.value;
    }
    animDiv.style.animationIterationCount = `${iterationValue}`;
    restartAnimation();
    displayResult();
    updateKeyframes();
  });
}

inputIteration.addEventListener("change", () => {
  animDiv.style.animationIterationCount = `${inputIteration.value}`;
  iterationValue = inputIteration.value;
  radioIteration[0].checked = false;
  radioIteration[1].checked = true;
  restartAnimation();
  displayResult();
  updateKeyframes();
});

/* === Common events === */

for (const select of selects) {
  select.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  select.addEventListener("change", () => {
    displayResult();
    updateKeyframes();
  });
}

/* === Upload assets === */

buttonUpload.addEventListener('change', (event) => {

  if (sessionStorage.getItem('asset-background')) {
    sessionStorage.removeItem('asset-background');
  }

  // Save image in Local Storage
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    sessionStorage.setItem('asset-background', reader.result);
    let recentImageDataUrl = sessionStorage.getItem('asset-background');
    animDiv.style.backgroundImage = `url(${recentImageDataUrl})`;
  }, false);
  reader.readAsDataURL(event.target.files[0]);

});

/* === Controls events === */

document.querySelector(".input-animated").addEventListener("change", () => {
  animationIsActive = !animationIsActive;
  //animDiv.style.animationName = animationIsActive ? `${selectTransform.value}Anim` : `none`;
  if (animationIsActive) {
    restartAnimation();
    setAnimationProperties();
    document.querySelector('.range-1-container').style.display = 'flex';
  } else {
    removeAnimation();
    document.querySelector('.range-1-container').style.display = 'none';
  }
  displayResult();
  updateKeyframes();
});

inputPerspective.addEventListener("change", () => {
  perspectiveValue = inputPerspective.value;
  perspectiveIsActive = true;
  document.querySelector(".check-perspective").checked = true;
  mainDiv.style.perspective = perspectiveIsActive ? `${perspectiveValue}px` : 'none';
  displayResult();
});

document.querySelector(".check-perspective").addEventListener("change", () => {
  perspectiveIsActive = !perspectiveIsActive;
  mainDiv.style.perspective = perspectiveIsActive ? `${perspectiveValue}px` : 'none';
  displayResult();
});

document.querySelector(".input-grid").addEventListener("change", () => {
  gridIsActive = !gridIsActive;
  document.querySelector(".grid").style.opacity = gridIsActive ? 1 : 0;
});

inputWidth.addEventListener("change", () => {
  mainDiv.style.width = `${inputWidth.value}px`;
});

inputHeight.addEventListener("change", () => {
  mainDiv.style.height = `${inputHeight.value}px`;
});

document.querySelector(".button-reload").addEventListener("click", () => {
  if (animationIsActive) {
    restartAnimation();
  } else {
    alert('The animation is inactive.');
  }
});


/* === Initial styles === */

setAnimationProperties();
displayResult();

rangeTransform1.setAttribute('max', transformTypes[currentTransform].max);
rangeTransform1.setAttribute('min', transformTypes[currentTransform].min);
rangeTransform1.setAttribute('step', transformTypes[currentTransform].step);
rangeTransform2.setAttribute('max', transformTypes[currentTransform].max);
rangeTransform2.setAttribute('min', transformTypes[currentTransform].min);
rangeTransform2.setAttribute('step', transformTypes[currentTransform].step);
// Range values and rest of parameters are defined in the HTML.

inputWidth.value = mainDiv.offsetWidth;
inputHeight.value = mainDiv.offsetHeight;
