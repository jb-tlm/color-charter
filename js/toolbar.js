//===================================
//======= HISTORY CONTROLS
//===================================

const sessionHistory = new ColorHistory();

const addHistoryBtn = document.querySelector('#addHistoryBtn');
const removeHistoryBtn = document.querySelector('#removeHistoryBtn');
const colorBar = document.querySelector('#colorBar');

// Functionality to handle History+ and History- buttons
addHistoryBtn.addEventListener('click', updateHistory);
removeHistoryBtn.addEventListener('click', updateHistory);
colorBar.addEventListener('click', function(event) {
  const barSelection = event.target.attributes.data.value;
  sessionHistory.setCurrentKeyColor(barSelection);
  generateColors(barSelection);
  const hexText = document.querySelector('#hexText');
  hexText.innerHTML = sessionHistory.currentKeyColor;
  return sessionHistory.printHistory();
});

// Updates color history to add or remove current color
function updateHistory(event) {
  const historyOperation = event.target.id;
  return historyOperation.includes('addHistory')
    ? sessionHistory.addHistory()
    : sessionHistory.removeHistory();
};

// Contructor function for color history functionality
function ColorHistory() {
  this.historyList = [];
  this.currentKeyColor = '#c8c8c8';
  this.currentSecondaryColor = '#c8c8c8';
  this.currentColorChart = {};
  this.currentPage = 'colorWheel';
  this.cssFormat = '';
  
  this.setCurrentKeyColor = function(color) {
    this.currentKeyColor = color;
  };

  this.setCurrentSecondaryColor = function(color) {
    this.currentSecondaryColor = color;
  };

  this.setCurrentColorChart = function(chart) {
    return this.currentColorChart = chart;
  };

  this.addHistory = function() {
    if (this.historyList.includes(this.currentKeyColor)) return;
    this.historyList = [...this.historyList, this.currentKeyColor];
    return this.updateColorBar();
  };

  this.removeHistory = function() {
    if (!this.historyList.includes(this.currentKeyColor)) return;
    const updatedList = this.historyList.filter(color => color !== this.currentKeyColor);
    this.historyList = updatedList;
    this.currentKeyColor = '#c8c8c8';
    this.updateColorBar();
    return this.printHistory();
  };

  this.updateColorBar = function() {
    colorBar.innerHTML = '';
    const historyList = [...this.historyList];
    historyList.reverse().forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.setAttribute('data', color);
      colorDiv.setAttribute('class', 'colorRibbon');
      colorDiv.style.backgroundColor = color;
      colorBar.appendChild(colorDiv);
    });
  };

  this.printHistory = function() {
    const colorInput = document.querySelector('#colorInput');
    colorInput.value = this.currentKeyColor;
    applyPalette(this.currentPage);
    return generateColors(this.currentKeyColor);
  };

  this.setCSSFormat = function(cssString) {
    return this.cssFormat = cssString;
  };

  this.getCSSFormat = function() {
    return this.cssFormat;
  };

};

//===================================
//======= PALETTE APPLICATION
//===================================

const content = document.querySelector('#content');
const contrastBg = document.querySelector('#contrast');
const descBg = document.querySelector('#description');
const descText = document.querySelector('#paletteDesc');
const keyText = document.querySelector('#secondBgKeyText');
const secondBg = document.querySelector('#secondBgKeyText');
const secondText = document.querySelector('#keyBgSecondText');

// Functionality for printing example colors to the UI
function applyPalette(selection) {
  const [paletteData] = colorData.filter(palette => palette.name === selection);
  if (!paletteData.elementList) return;
  const colorChart = sessionHistory.currentColorChart[selection];
  const paletteColors = (selection === 'monochrome')
    ? [colorChart[2], ...colorChart.slice(0, 2), colorChart[4]]
    : colorChart;
  const paletteValues = [ 'key', 'second', 'third', 'fourth' ]
    .reduce((obj, val, idx) => ( {[val]: paletteColors[idx], ...obj} ), {});
  const { elementList } = paletteData;
  for (const list in elementList) {
    styleElements(paletteValues[list], elementList[list]);
  }
};

function styleElements(colorVal, elemArrs) {
  for (const elemName in elemArrs) {
    const elements = elemArrs[elemName];
    elements.forEach(el => {
      if (el !== null) {
        switch(elemName) {
          case 'background':
            el.style.background = colorVal;
            break;
          case 'text':
            el.style.color = colorVal;
            break;
        }
      }
    })
  }
};

//===================================
//======= PALETTE & OUTPUT INFO
//===================================

const paletteTypes = {
  twoColor: {
    key: {
      background: [contrastBg],
      text: [keyText],
    },
    second: {
      background: [content, secondBg],
      text: [secondText, descText],
    },
  },
  threeColor: {
    key: {
      background: [contrastBg],
      text: [keyText],
    },
    second: {
      background: [content],
      text: [descText],
    },
    third: {
      background: [secondBg],
      text: [secondText],
    },
  },
  fourColor: {
    key: {
      background: [contrastBg],
      text: [keyText],
    },
    second: {
      background: [content],
      text: [descText],
    },
    third: {
      background: [secondBg],
      text: [secondText],
    },
    fourth: {
      background: [descBg],
    },
  }
};

const colorData = [
  {
    name: 'colorWheel',
    elementList: false,
    description: `
      <div class="colorInfo">
        <h2>Welcome to Color Charter</h2>
        <h3>Color Charter is a tool to aid in the design of websites, games, and more. The info button can be used on every menu selection to describe the characteristics of the palette being displayed.</h3>
      </div>
    `,
  },
  {
    name: 'complementary',
    elementList: paletteTypes.twoColor,
    description: `
      <div class="colorInfo">
        <h2>Complementary</h2>
        <h3>Key-complementary color combinations are opposites on the color wheel, and they are the most widely used 2-color design palettes.</h3>
      </div>
    `,
  },
  {
    name: 'splitComplementary',
    elementList: paletteTypes.threeColor,
    description: `
      <div class="colorInfo">
        <h2>Split Complementary</h2>
        <h3>These are the two analogous colors to the complementary color, and they are sometimes called compound colors.</h3>
      </div>
    `,
  },
  {
    name: 'analogous',
    elementList: paletteTypes.threeColor,
    description: `
      <div class="colorInfo">
        <h2>Analogous</h2>
        <h3>These are the two adjacent colors of the color wheel on either side of the key color.</h3>
      </div>
    `,
  },
  {
    name: 'triad',
    elementList: paletteTypes.threeColor,
    description: `
      <div class="colorInfo">
        <h2>Triads</h2>
        <h3>These three colors include the key color and the two colors equidistant from it on the color wheel. It is the most popular 3-color design palette.</h3>
      </div>
    `,
  },
  {
    name: 'tetrad',
    elementList: paletteTypes.fourColor,
    description: `
      <div class="colorInfo">
        <h2>Tetrads</h2>
        <h3>Tetrads are four colors that are equidistant from each other on the color wheel. This combination is a common 4-color design palette.</h3>
      </div>
    `,
  },
  {
    name: 'monochrome',
    elementList: paletteTypes.fourColor,
    description: `
      <div class="colorInfo">
        <h2>Monochromes</h2>
        <h3>A monochromatic color scheme is one that consists of the base color and any number of tints or shades of that color. This palette has two tints lighter than the key color and two shades darker</h3>
      </div>
    `,
  },
  {
    name: 'tintShade',
    elementList: false,
    description: `
      <div class="colorInfo">
        <h2>Tints and Shades</h2>
        <h3>These tints are monochromatic colors that are on the extreme light end of the key color's hue.<br /><br/>The shades are monochromatic colors that are on the extreme dark end of the key color's hue.</h3>
      </div>
    `,
  },
  {
    name: 'grayscale',
    elementList: false,
    description: `
      <div class="colorInfo">
        <h2>Grayscales</h2>
        <h3>A warm color is one that is weighted in the yellow value. These warm grayscales are based on a yellow-weighted grayshade scheme that is additionally weighted in accordance with the key color.<br/><br/>A cool color is one that is weighted in the blue value. These cool grayscales are based on a blue-weighted grayshade scheme that is additionally weighted in accordance with the key color.</h3>
      </div>
    `,
  },
  {
    name: 'common',
    elementList: false,
    description: `
      <div class="colorInfo">
        <h2>Common Colors</h2>
        <h3>These palettes are made of commonly-known shades of white and gray. They have each been additionally weighted with a tincture of the key color.</h3>
      </div>
    `,
  },
  {
    name: 'secondary',
    elementList: false,
    description: `
      <div class="colorInfo">
        <h2>Secondary and Gradients</h2>
        <h3>This palette is bookended with the key color and any other color selection. The 8 colors shown between them are the evenly-spaced gradients from the key to the secondary.</h3>
      </div>
    `,
  }
];

function createCSSFormat(key, data) {
  return `
    /* Drop into your CSS file */\n
    /* Palette for ${key} */\n
    :root {
      /* Complementary palette */
      --key-comp-color: ${data.complementary[0]};
      --second-comp-color: ${data.complementary[1]};
      
      /* Split Complementary palette */
      --key-split-color: ${data.splitComplementary[0]};
      --second-split-color: ${data.splitComplementary[1]};
      --third-split-color: ${data.splitComplementary[2]};
      
      /* Analogous palette */
      --key-analogous-color: ${data.analogous[0]};
      --second-analogous-color: ${data.analogous[1]};
      --third-analogous-color: ${data.analogous[2]};
      
      /* Triads palette */
      --key-triad-color: ${data.triad[0]};
      --second-triad-color: ${data.triad[1]};
      --third-triad-color: ${data.triad[2]};
      
      /* Tetrads palette */
      --key-tetrad-color: ${data.tetrad[0]};
      --second-tetrad-color: ${data.tetrad[1]};
      --third-tetrad-color: ${data.tetrad[2]};
      --fourth-tetrad-color: ${data.tetrad[3]};
      
      /* Monochrome palette */
      --secondLt-monochrome-color: ${data.monochrome[0]};
      --firstLt-monochrome-color: ${data.monochrome[1]};
      --key-monochrome-color: ${data.monochrome[2]};
      --firstDk-monochrome-color: ${data.monochrome[3]};
      --secondDk-monochrome-color: ${data.monochrome[4]};
      
      /* Tints */
      --first-tints-color: ${data.tints[0]};
      --second-tints-color: ${data.tints[1]};
      --third-tints-color: ${data.tints[2]};
      --fourth-tints-color: ${data.tints[3]};
      --fifth-tints-color: ${data.tints[4]};
      
      /* Shades */
      --first-shades-color: ${data.shades[0]};
      --second-shades-color: ${data.shades[1]};
      --third-shades-color: ${data.shades[2]};
      --fourth-shades-color: ${data.shades[3]};
      --fifth-shades-color: ${data.shades[4]};
      
      /* Warm Grayscales */
      --first-warmGrays-color: ${data.warmGrays[0]};
      --second-warmGrays-color: ${data.warmGrays[1]};
      --third-warmGrays-color: ${data.warmGrays[2]};
      --fourth-warmGrays-color: ${data.warmGrays[3]};
      --fifth-warmGrays-color: ${data.warmGrays[4]};
      
      /* Cool Grayscales */
      --first-coolGrays-color: ${data.coolGrays[0]};
      --second-coolGrays-color: ${data.coolGrays[1]};
      --third-coolGrays-color: ${data.coolGrays[2]};
      --fourth-coolGrays-color: ${data.coolGrays[3]};
      --fifth-coolGrays-color: ${data.coolGrays[4]};
      
      /* Common Whites */
      --common-ghostwhite-color: ${data.commonWhites[0]};
      --common-whitesmoke-color: ${data.commonWhites[1]};
      --common-seashell-color: ${data.commonWhites[2]};
      --common-floralwhite-color: ${data.commonWhites[3]};
      --common-antiquewhite-color: ${data.commonWhites[4]};
      
      /* Common Grays */
      --common-gainsboro-color: ${data.commonGrays[0]};
      --common-silver-color: ${data.commonGrays[1]};
      --common-darkgray-color: ${data.commonGrays[2]};
      --common-gray-color: ${data.commonGrays[3]};
      --common-dimgray-color: ${data.commonGrays[4]};

      /* Gradations */
      --key-gradation-color: ${data.gradations[0]};
      --second-gradation-color: ${data.gradations[1]};
      --third-gradation-color: ${data.gradations[2]};
      --fourth-gradation-color: ${data.gradations[3]};
      --fifth-gradation-color: ${data.gradations[4]};
      --sixth-gradation-color: ${data.gradations[5]};
      --seventh-gradation-color: ${data.gradations[6]};
      --eighth-gradation-color: ${data.gradations[7]};
      --ninth-gradation-color: ${data.gradations[8]};
      --secondary-gradation-color: ${data.gradations[9]};
    }
  `;
};

//===================================
//======= MENU CONTROLS
//===================================

const pageMenu = document.querySelector('#pageMenu');
const menuBtn = document.querySelector('#menuBtn');

// Functionality to handle menu selection from dropdown
pageMenu.addEventListener('click', function(event) {
  const selection = event.target.id;
  if (!selection.includes('Tab')) return;
  if (window.innerWidth < 1020) {
    pageMenu.setAttribute('class', 'menuSlideUp');
    setTimeout(() => pageMenu.style.display = 'none', 1000);
  }
  return updateUI(selection);

});

menuBtn.addEventListener('click', function() {
  pageMenu.style.display = 'block';
  pageMenu.setAttribute('class', 'menuSlideDown');
});

// Composite function to update page to new selection
function updateUI(selection) {
  const selectionName = selection.slice(0, -3);
  setActive(selection);
  changePage(selectionName);
  return applyPalette(selectionName);
};

function setActive(active) {
  const menuItems = Array.from(pageMenu.children);
  menuItems.forEach(item => {
    if (item.id && (item.id !== active)) {
      item.setAttribute('class', '');
    } else if (item.id === active) {
      item.setAttribute('class', 'activeTab');
    }
  })
};

function changePage(selection) {
  sessionHistory.currentPage = selection;
  content.style.display = 'none';
  for (page of colorData) {
    if (page.name === selection) {
      document.querySelector(`#${page.name}Page`).style.display = 'block';
      content.style.display = (page.elementList) ? 'flex' : 'none';
    } else {
      document.querySelector(`#${page.name}Page`).style.display = 'none';
    }
  }
};

// Sets menu state based on screen width
function setMenuToggle() { 
  if (window.innerWidth < 1020) {
    menuBtn.style.visibility = 'visible';
    pageMenu.style.display = 'none';
    pageMenu.setAttribute('class', 'menuSlideUp');
  } else {
    menuBtn.style.visibility = 'hidden';
    pageMenu.style.display = 'block';
    pageMenu.setAttribute('class', 'menuSlideDown');
  }
};

window.onresize = setMenuToggle;

// Composite IIFE to set pages on load
(function loadPage() {
  setMenuToggle()
  setActive('colorWheelTab');
  changePage('colorWheel');
})();

//===================================
//======= INFO CONTROLS
//===================================

const infoPanel = document.querySelector('#infoPanel');
const infoBlock = document.querySelector('#infoBlock');

infoPanel.addEventListener('click', function() {
  infoPanel.setAttribute('class', 'panelFadeOut');
  return setTimeout(() => {
    infoPanel.innerHTML = '';
    infoPanel.style.display = 'none'
  }, 1000);
});

(function setInfoPanel() {
  infoPanel.setAttribute('class', 'panelFadeOut');
  infoPanel.innerHTML = '';
  infoPanel.style.display = 'none'
})();

infoBlock.addEventListener('click', function(event) {
  if (event.target.id.includes('Block')) return;
  infoPanel.setAttribute('class', 'panelFadeIn');
  const [data] = colorData.filter(colorObj => {
    return colorObj.name === sessionHistory.currentPage;
  });
  infoPanel.innerHTML = data.description;
  return infoPanel.style.display = 'block';
});

//===================================
//======= CANVAS COLOR WHEEL
//===================================

const canvas = document.querySelector('#colorWheelCanvas');
const context = canvas.getContext('2d');
const colorWheel = [
  '#ff0000',
  '#ff8000',
  '#ffff00',
  '#80ff00',
  '#00ff00',
  '#00ff80',
  '#00ffff',
  '#007fff',
  '#0000ff',
  '#7f00ff',
  '#ff00ff',
  '#ff0080',
];

let lastend = 0;
Array(12).fill(30).forEach((deg, idx) => {
  context.fillStyle = colorWheel[idx];
  context.beginPath();
  context.moveTo(canvas.width / 2, canvas.height / 2);
  context.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.height / 2,
    lastend,
    lastend + (Math.PI * 2 * (deg / 360)),
    false,
  );
  context.lineTo(canvas.width / 2, canvas.height / 2);
  context.fill();
  lastend += Math.PI * 2 * (deg / 360);
});
