#target Illustrator

/**
 * Icons Contact Sheet v0.1
 *
 * This script is based heavily on two scripts by John Wundes ( john@wundes.com ) www.wundes.com
 * - Distribute Stacked Objects v1.1
 * - Pixel Align v.1.1
 *
 * All credit for figuring out the logic goes to John. I have merely applied his work 
 * to a special use case for aligning icons on a grid.
 *
 * See John's license for details about what you can and cannot do with the code.
 * JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
 * copyright full text here:  http://www.wundes.com/js4ai/copyright.txt
 */

/**
 * If BATCH_MODE is set to true, all prompts, alerts, and confirm pop-ups will be 
 * disabled so you can use this script as part of an Illustrator Batch Action. 
 * Where you would interact with the script to provide parameters like call size and 
 * whether or not to shrink the artboard to fit the contact sheet you must set 
 * these options in the "config" object below.
 */
var BATCH_MODE = false;

/**
 * Default configuration settings. The cellSize and shringToFit options will only 
 * be used if BATCH_MODE (above) is set to true. Otherwise, you will be prompted 
 * to provide these settings when the script runs.
 */
var config = {

    // The default cell size each icon occupies

    cellSize: 64,
    
    // Whether or not to shrink the artboard to fit the contact sheet once it is built.
    // This value is used if BATCH_MODE is set to true. Otherwise, you will be prompted 
    // after the contact sheet is built.
    
    shrinkToFit: false,
    
    // Options: 
    //
    // layer (value can be 'layer' or 'default')
    //
    // This setting tells the script the order in which to arrange the items. The default 
    // is "layer order" which means the order the items appear in the layer. 
    //
    // shuffle
    //
    // The items will be randomly sorted using the Fisher-Yates shuffle method.
    // see: http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    //
    // reverse
    //
    // The items will be arranged in the reverse of the layer order. This is a good 
    // option because most designers will add items to the file in the order they want 
    // them to appear, but since each item creates a new layer, the layers are stacked 
    // with the most recently added items on top and by default they will be arranged 
    // first in the contact sheet grid.
        
    order: "default",
    
    // User-interaction strings
    
    strings: {
        MAKE_SELECTION:  "You must select objects to distribute.",
        ENTER_CELL_SIZE: "Enter the size of each grid cell (Ex: 64)",
        ERROR_COLS_CALC: "An error occurred and the column count could not be calculated.",
        SHRINK_TO_FIT:   "Would you like to shrink the artboard to fit the contact sheet?"
    }
};

/**
 * The document object
 */
var doc  = activeDocument;

/**
 * The current selection
 */
var selx = doc.selection;

if (selx.length == 0) {
    alert(config.strings.MAKE_SELECTION);
}
else {
    switch (config.order.toLowerCase()) {
        case "reverse":
            selx.reverse();
            break;
        case "shuffle":
            selx = shuffle(selx);
            break;
        case "layer":
        case "default":
        default:
            break;
    }
    arrangeItems(selx);
}

/**
 * Randomly sorts an array
 * param Array arr  The array to shuffle
 * return Array
 */
function shuffle(arr) {
  var m = arr.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
};

/**
 * Arranges items in the selection on a grid
 * param selection sel    The current selection
 * return void
 */
function arrangeItems(sel) {

    var board;
    var bounds;
    var itemBounds;
    var cols;
    var cellSize;
    var x1 = y1 = 0;
    var boardWidth, boardHeight;
    
    if (BATCH_MODE) {
        cellSize = config.cellSize;
    }
    else {
        while (isNaN(cellSize)) {
            cellSize = Number(prompt(config.strings.ENTER_CELL_SIZE, 64));
        }
    }

    board  = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    bounds = board.artboardRect;
    
    boardWidth = Math.round(bounds[2] - bounds[0]);
    
    cols = Math.floor((boardWidth - (cellSize * 2)) / cellSize);
    rows = Math.ceil(sel.length / cols) + 2;

    if (isNaN(cols)) {
        alert(config.strings.ERROR_COLS_CALC);
        return;
    }

    x1 = bounds[0] + cellSize;
    y1 = bounds[1] - cellSize;
    
    for (var i = 0, slen = sel.length; i < slen; i++) {
    
        theItem = sel[i];
        
        itemBounds = theItem.visibleBounds;
        
        theItem.top  = y1 - ((cellSize - theItem.height) / 2);
        theItem.left = x1 + ((cellSize - theItem.width) / 2);
        
        alignToNearestPixel(theItem);
        
        x1 += cellSize;
        
        if (i % cols == cols - 1) { 
            x1  = bounds[0] + cellSize;    
            y1 -= cellSize;
        }
    }

    if (BATCH_MODE) {
        shrinkToFit = config.shrinkToFit
    }
    else {
        shrinkToFit = confirm(config.strings.SHRINK_TO_FIT);
    }
    
    if (shrinkToFit) {
        
        // The bounds are plotted on a Cartesian Coordinate System.
        // So a 32 x 32 pixel artboard with have the following coords:
        // (assumes the artboard is positioned at 0, 0)
        // x1 = -16, y1 = 16, x2 = 16, y2 = -16

        // board.artboardRect = [x1, y1, x2, y2];
    
        board.artboardRect = [
            bounds[0], 
            bounds[1], 
            bounds[0] + ((cols * cellSize) + (2 * cellSize)), 
            bounds[1] - (rows * cellSize)
        ];
    }
};

/**
 * Aligns the item to the nearest pixel for crisp rendering.
 * param object item    The item to align
 * return void
 */
function alignToNearestPixel(item) {
    if (item.height) {
        item.height = moveToPixel(item.height);
    }
    if (item.width) {
        item.width = moveToPixel(item.width);
    }   
    item.top  = moveToPixel(item.top);
    item.left = moveToPixel(item.left);
};

/**
 * Adjusts a value to the nearest whole number
 * param float n   The value to adjust
 * return int
 */
function moveToPixel(n) {
    return Math.round(n)
};