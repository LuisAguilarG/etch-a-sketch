
let currentMode;
let currentGridSize;
let paintingEnabled;


setInitialConfig();


function setInitialConfig() {
    const optionList =  document.querySelectorAll(".option");
    const gridSizeRange = document.querySelector("#grid-size");
    const gridSizeRangeValue = document.querySelector("#range-value");
    const sizeConfirmation = document.querySelector("#size-confirmation");

    currentMode = "Gray scale";
    currentGridSize = 16;
    paintingEnabled = false;
    gridSizeRangeValue.textContent = currentGridSize;

    optionList.forEach((option) => {
        if (option.value === "Clear") {
            option.addEventListener("click", () => {
                removeCurrentGrid();
                generateGrid(currentGridSize);
                gridSizeRange.value = currentGridSize;
                gridSizeRangeValue.textContent = currentGridSize;
            });
        } else {
            option.addEventListener("click", () => {
                removeCurrentGrid();
                generateGrid(currentGridSize);
                setMode(option.value);
            });
        }
        
    });

    gridSizeRange.addEventListener("input", () => {
        gridSizeRangeValue.textContent = gridSizeRange.value;
    });

    sizeConfirmation.addEventListener("click", () => {
        currentGridSize = gridSizeRange.value;
        removeCurrentGrid();
        generateGrid(currentGridSize);
    });

    generateGrid(currentGridSize);
}


function removeCurrentGrid() {
    const gridContainer = document.querySelector(".grid-container");

    while (gridContainer.firstElementChild) {
        gridContainer.firstElementChild.remove();
    }
}


function generateGrid(size) {
    const gridContainer = document.querySelector(".grid-container");

    /* Create every row and column of the grid */
    for (let row = 0; row < size; row++) {
        const rowElement = document.createElement("div");
        rowElement.classList.add("row");

        for (let column = 0; column < size; column++) {
            const gridCellElement = document.createElement("div");
            
            gridCellElement.classList.add("grid-cell");
            rowElement.appendChild(gridCellElement);      
        }

        gridContainer.appendChild(rowElement);
    }

    const gridCellList = document.querySelectorAll(".grid-cell");

    gridCellList.forEach( (gridCell) => { 
        gridCell.addEventListener("mousedown", () => {
            paintingEnabled = !paintingEnabled;

            if (paintingEnabled && !(gridCell.classList.contains("painted"))) {
                paintGridCell(gridCell);
                if (currentMode === "Black" || currentMode === "Random color") {
                    gridCell.classList.add("painted");
                }
            }
        });

        gridCell.addEventListener("mouseenter", () => {
            if (paintingEnabled && !(gridCell.classList.contains("painted"))) {
                paintGridCell(gridCell);
                if (currentMode === "Black" || currentMode === "Random color") {
                    gridCell.classList.add("painted");
                }
            }
        });
    });
}


function paintGridCell(gridCell) {

    switch (currentMode) {
        case "Gray scale":
            /* RGB channels represented as an array. R[0] G[1] B[2] */
            let currentRGBChannels = getComputedStyle(gridCell).backgroundColor.match(/\d+/g);
            
            /* Checking that the channels do not represent black color yet */
            if (currentRGBChannels[0] != 0 && currentRGBChannels[1] != 0 && currentRGBChannels[2] != 0) {
                gridCell.style.backgroundColor = darkenRGB(currentRGBChannels);
            }
            break;
        case "Black":
            gridCell.style.backgroundColor = "#000000";
            break;
        case "Random color":
            const randomColor = "#" + Math.floor(Math.random()*0xffffff).toString(16).padEnd(6, "0");
            gridCell.style.backgroundColor = randomColor;
            break;
    }
}


function darkenRGB(RGBChannels) {

    const newRGBChannels = RGBChannels.map((channel) => {
        return Math.max(0,channel - 26);
    });

    return `rgb(${newRGBChannels[0]}, ${newRGBChannels[1]}, ${newRGBChannels[2]})`;
}


function setMode(option) {
    currentMode = option;
}


