//===================================
//======= INPUT & OUTPUT
//===================================

const colorForm = document.querySelector('#colorForm');
const colorBtn = document.querySelector('#colorBtn');
const secondaryForm = document.querySelector('#secondaryForm');
const secondaryBtn = document.querySelector('#secondaryBtn');
const paletteCopy = document.querySelectorAll('.copyPaletteBtn');
const tooltip = document.querySelectorAll('.clipboardTooltip');

// Receives user input from color form and
// begins the palette generator process
colorForm.addEventListener('submit', function(event) {
  event.preventDefault();
  colorBtn.blur();
  const color = this.elements.colorInput.value;
  generateColors(color);
  if (colorBar.currentPage === 'colorWheel') {
    updateUI('complementaryTab');
  } else {
    applyPalette(colorBar.currentPage);
  }
  const hexText = document.querySelector('#hexText');
  hexText.innerHTML = colorBar.currentKeyColor;
});

colorForm.addEventListener('change', function() { colorBtn.focus(); });

// Receives user input for creating gradient palette
secondaryForm.addEventListener('submit', function(event) {
  event.preventDefault();
  secondaryBtn.blur();
  const secondColor = this.elements.secondaryInput.value;
  colorBar.setCurrentSecondaryColor(secondColor);
  document.querySelector('#keyGradients').innerHTML = '';
  document.querySelector('#secondaryGradients').innerHTML = '';
  generateColors(colorBar.currentKeyColor);
  const secHexText = document.querySelector('#secHexText');
  secHexText.innerHTML = secondColor;
  if (colorBar.colorList.includes(secondColor)) return;
  colorBar.setCurrentKeyColor(secondColor);
});

secondaryForm.addEventListener('change', function() { secondaryBtn.focus(); });

// Functionality for clipboard
for (let ii of paletteCopy) {
  ii.addEventListener('click', function(ev) {
    navigator.clipboard.writeText(colorBar.getCSSFormat(ev.target.dataset['combobox']));
    const toast = document.querySelector('#clipboardToast');
    toast.innerHTML = `Palettes for key color ${colorBar.currentKeyColor} have been saved to your clipboard`
    toast.setAttribute('class', 'toastSlideIn');
    return setTimeout(() => toast.setAttribute('class', 'toastSlideOut'), 3000);
  });
  ii.addEventListener('mouseover', function(ev) {
    const ttip = ev.target.querySelector('h6') || ev.target;
    ttip.classList.remove('tooltipLeave');
    ttip.classList.add('tooltipEnter');
  });
  ii.addEventListener('mouseout', function(ev) {
    const ttip = ev.target.querySelector('h6') || ev.target;
    ttip.classList.remove('tooltipEnter');
    ttip.classList.add('tooltipLeave');
  });
}

// Clickable color squares-as-a-button - Send background color to the color bar.
// Use event delegation at 'body' level
document.querySelector('body').addEventListener('click', function(ev) {
  const tgt = ev.target;
  if (tgt.classList.contains('colorSquare')) {
    const [_, __, r, g, b] = /(\((.+),(.+),(.+)\))/.exec(tgt.style.backgroundColor);
    colorBar.addColor(RGBtoHEX([Number(r), Number(g), Number(b)]));
  }
});

// Functionality for creating individual palettes
function generateColors(input) {
  clearContainers();
  colorBar.setCurrentKeyColor(input);
  let colorData = {};
  colorData.complementary = setDesignPalette(input, [180], 'complementary');
  colorData.splitComplementary = setDesignPalette(input, [150, 210], 'splitComplementary');
  colorData.analogous = setDesignPalette(input, [30, 330], 'analogous');
  colorData.triad = setDesignPalette(input, [120, 240], 'triad');
  colorData.tetrad = setDesignPalette(input, [90, 180, 270], 'tetrad');
  colorData.monochrome = setVariants(input, 'monochrome');
  colorData.tints = setVariants(input, 'tints');
  colorData.shades = setVariants(input, 'shades');
  colorData.warmGrays = setGrayshades(input, 'warm');
  colorData.coolGrays = setGrayshades(input, 'cool');
  colorData.gradations = setGradations(input, colorBar.currentSecondaryColor);
  colorBar.setCurrentColorChart(colorData);
  return colorBar.setCSSFormat(createCSSFormat(input, colorData));
};

function clearContainers() {
  return Array.from(document.getElementsByClassName('colorRow'))
    .forEach(child => document.querySelector(`#${child.id}`).innerHTML = '');
};

// Prints color palettes to the UI
function createContainers(colorArray, parentDiv, labelArray) {
  colorArray.forEach((color, idx) => {
    const formattedColor = formatColor(color);
    const { hsl } = formattedColor;
    formattedColor.hsl = hsl.map((val, idx) => {
      return (idx === 0) ? val : (Math.round(val * 100) + '%');
    });
    const palettes = ['keyColor', 'complementary', 'splitComplementary', 'analogous', 'triad', 'tetrad', 'keyGradients'];
    const paletteKey = palettes.includes(parentDiv) && (idx === 0);
    const monochromeKey = /monochrome/.test(parentDiv) && (idx === 2);
    const keyIcon = (paletteKey || monochromeKey) ? '🔑' : '';
    const keyClass = keyIcon ? '' : 'keySpace';
    const label = (labelArray) ? `<h3>${labelArray[idx]}</h3>` : '';
    const elParentDiv = document.querySelector(`#${parentDiv}`);
    const containerDiv = document.createElement('div');
    containerDiv.setAttribute('class', 'colorContainer');
    containerDiv.innerHTML = `
      <div class="colorSquare" style="background-color:${color}"></div>
      ${label}
      <h3 class=${keyClass}>${formattedColor.hex}<span class="keyIcon"><sup>${keyIcon}</sup></span></h3>
      <h3>rgb(${formattedColor.rgb})</h3>
      <h3>hsl(${formattedColor.hsl})</h3>
    `;
    elParentDiv.appendChild(containerDiv);
    return formattedColor;
  });
  const relInfoId = `${parentDiv}InfoId`;
  if (!document.querySelector(`#${relInfoId}`)) {
    const relInfoEl = document.createElement('div');
    const info = colorData.reduce(
      (lv, el) => el.infoFor === parentDiv ? el.description : lv,
      ""
    );
    relInfoEl.id = relInfoId;
    relInfoEl.innerHTML = info;
    document.querySelector(`#${parentDiv}`).parentElement.appendChild(relInfoEl);
  }
  return colorArray;
};

// Creates gray 'base' palettes on load
(function defaultContainers() {
  return generateColors('#c8c8c8');
})();

//===================================
//======= COLOR SETTERS
//===================================

function setDesignPalette(color, degArray, type) {
  const hsl = convertToHSL(color);
  const paletteArray = degArray.map(deg => {
    const paletteColor = turnColorWheel(hsl, deg);
    return convertToHEX(paletteColor);
  });
  const paletteResult = createContainers([color, ...paletteArray], type);
  return paletteResult;
}

function setVariants(color, type) {
  const hsl = convertToHSL(color);
  const variantArray = HSLArrayMaker(hsl, type).map((variant, idx) => {
    const midKey = ((type === 'monochrome') && (idx === 2)) ? color : null;
    return midKey || convertToHEX(variant);
  });
  const variantResult = createContainers(variantArray, type);
  return variantResult;
};

function HSLArrayMaker(hsl, type) {
  const value1 = (type === 'tints')
    ? [hsl[0], hsl[1], +(((1 - hsl[2]) * .9) + hsl[2]).toFixed(2)]
    : (type === 'shades')
      ? [hsl[0], hsl[1], +(hsl[2] - (hsl[2] * .5)).toFixed(2)]
      : [hsl[0], hsl[1], +(((1 - hsl[2]) * .4) + hsl[2]).toFixed(2)];
  const value2 = (type === 'tints')
    ? [hsl[0], hsl[1], +(((1 - hsl[2]) * .825) + hsl[2]).toFixed(2)]
    : (type === 'shades')
      ? [hsl[0], hsl[1], +(hsl[2] - (hsl[2] * .575)).toFixed(2)]
      : [hsl[0], hsl[1], +(((1 - hsl[2]) * .2) + hsl[2]).toFixed(2)];
  const value3 = (type === 'tints')
    ? [hsl[0], hsl[1], +(((1 - hsl[2]) * .75) + hsl[2]).toFixed(2)]
    : (type === 'shades')
      ? [hsl[0], hsl[1], +(hsl[2] - (hsl[2] * .65)).toFixed(2)]
      : [hsl[0], hsl[1], hsl[2]];
  const value4 = (type === 'tints')
    ? [hsl[0], hsl[1], +(((1 - hsl[2]) * .675) + hsl[2]).toFixed(2)]
    : (type === 'shades')
      ? [hsl[0], hsl[1], +(hsl[2] - (hsl[2] * .725)).toFixed(2)]
      : [hsl[0], hsl[1], +(hsl[2] - (hsl[2] * .2)).toFixed(2)];
  const value5 = (type === 'tints')
    ? [hsl[0], hsl[1], +(((1 - hsl[2]) * .6) + hsl[2]).toFixed(2)]
    : (type === 'shades')
      ? [hsl[0], hsl[1], +(hsl[2] - (hsl[2] * .8)).toFixed(2)]
      : [hsl[0], hsl[1], +(hsl[2] - (hsl[2] * .4)).toFixed(2)];
  return [value1, value2, value3, value4, value5];
};

function setGrayshades(color, temp) {
  const rgb = HEXtoRGB(color);
  const minIndex = rgb.indexOf(Math.min(...rgb));
  const maxIndex = rgb.indexOf(Math.max(...rgb));
  const baseShades = [42, 84, 126, 168, 210];
  const tempWeight = (temp === 'warm') ? 3 : 7;
  const rgbArrays = baseShades.map(shade => {
    return (temp === 'warm')
      ? [(shade + tempWeight), (shade + tempWeight), shade]
      : [shade, shade, (shade + tempWeight)];
  });
  const adjustedRGBs = rgbArrays.map(arr => {
    let adjArr = [...arr];
    adjArr[minIndex] = arr[minIndex] - tempWeight;
    adjArr[maxIndex] = arr[maxIndex] - tempWeight;
    if (adjArr.every((elem, _, array) => elem === array[0])) {
      adjArr = (temp === 'warm')
        ? [
          ((adjArr[0] + tempWeight) <= 255) ? adjArr[0] + tempWeight : 255,
          ((adjArr[1] + tempWeight) <= 255) ? adjArr[1] + tempWeight : 255,
          adjArr[2]
        ]
        : [
          adjArr[0],
          adjArr[1],
          ((adjArr[2] + tempWeight) <= 255) ? adjArr[2] + tempWeight : 255,
        ];
    }
    return adjArr;
  });
  const hexArray = adjustedRGBs.map(colorArr => RGBtoHEX(colorArr)).reverse();
  const grayTemp = (temp === 'warm') ? 'warmGrayscales' : 'coolGrayscales';
  const grayResult = createContainers(hexArray, grayTemp);
  return grayResult;
};

function setGradations(keyColor, secondColor) {
  const rgbKey = HEXtoRGB(keyColor);
  const rgbSecond = HEXtoRGB(secondColor);
  const firstGrad = Math.floor((rgbKey[0] - rgbSecond[0]) / 9);
  const secondGrad = Math.floor((rgbKey[1] - rgbSecond[1]) / 9);
  const thirdGrad = Math.floor((rgbKey[2] - rgbSecond[2]) / 9);
  const rgbArray = Array(8).fill(null).map((_, idx) => {
    const gradientPrint = [
      (firstGrad < 0)
        ? (rgbKey[0] + (Math.abs(firstGrad) * (idx + 1)))
        : (rgbKey[0] - (Math.abs(firstGrad) * (idx + 1)))
      ,
      (secondGrad < 0)
        ? (rgbKey[1] + (Math.abs(secondGrad) * (idx + 1)))
        : (rgbKey[1] - (Math.abs(secondGrad) * (idx + 1)))
      ,
      (thirdGrad < 0)
        ? (rgbKey[2] + (Math.abs(thirdGrad) * (idx + 1)))
        : (rgbKey[2] - (Math.abs(thirdGrad) * (idx + 1)))
      ,
    ];
    return gradientPrint;
  });
  const gradientArray = [rgbKey, ...rgbArray, rgbSecond].map(arr => RGBtoHEX(arr));
  const keyGradArray = gradientArray.slice(0, 5);
  const secondGradArray = gradientArray.slice(5).reverse();
  createContainers(keyGradArray, 'keyGradients');
  createContainers(secondGradArray, 'secondaryGradients');
  return gradientArray;
};

//===================================
//======= FORMAT CONVERTERS
//===================================

function formatColor(hex) {
  const rgb = HEXtoRGB(hex);
  const hsl = RGBtoHSL(rgb);
  return {hex, rgb, hsl};
};

function convertToHSL(hex) {
  const rgb = HEXtoRGB(hex);
  const hsl = RGBtoHSL(rgb);
  return hsl;
};

function convertToHEX(hsl) {
  const rgb = HSLtoRGB(hsl);
  const hex = RGBtoHEX(rgb);
  return hex;
};

function turnColorWheel(hsl, degrees) {
  let [ h, ...rest ] = hsl;
  h += degrees;
  if (h > 360) h -= 360;
  return [h, ...rest];
};

// Converts a binary String to decimal values
function HEXtoRGB(hex) {
  const rgb = [
    hex.slice(1, 3), hex.slice(3, 5), hex.slice(5)
  ].map(value => parseInt((hex.slice(1).length % 2) ? (value * 2) : value, 16));
  return rgb;
};

function RGBtoHSL(rgb) {
  let [ r, g, b ] = rgb;
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = ((max + min) / 2.0);
  if(max !== min) {
    let diff = (max - min);
    s = (l > 0.5) ? (diff / (2.0 - max - min)) : (diff / (max + min));
    if((max === r) && (g >= b)) {
      h = 1.0472 * ((g - b) / diff);
    } else if((max === r) && (g < b)) {
      h = 1.0472 * (g - b) / diff + 6.2832;
    } else if(max === g) {
      h = 1.0472 * (b - r) / diff + 2.0944;
    } else if(max === b) {
      h = 1.0472 * (r - g) / diff + 4.1888;
    }
  }
  h = (h / 6.2832) * (360.0 + 0);
  return [Math.ceil(h), +s.toFixed(2), +l.toFixed(2)];
};

function HSLtoRGB(hsl) {
  let r, g, b;
  let [ h, s, l ] = hsl;
  h /= 360;
  if(s === 0) {
    r = g = b = l;
  } else {
    function hueToRGB(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    let q = (l < 0.5) ? (l * (1 + s)) : (l + s - l * s);
    let p = 2 * l - q;
    r = hueToRGB(p, q, h + 1/3);
    g = hueToRGB(p, q, h);
    b = hueToRGB(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// Converts decimal values to a binary string
function RGBtoHEX(rgb) {
  return '#' + rgb.map(value => {
    const hex = value.toString(16);
    return (hex.length === 1) ? ('0' + hex) : hex;
  }).join('');
};
