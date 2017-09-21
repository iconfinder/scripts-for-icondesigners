Icons Contact Sheet
===================

A JavaScript Extension for Adobe Illustrator to create a contact sheet of icons.

This script is based heavily on two scripts by John Wundes ( john@wundes.com ) www.wundes.com
 * Distribute Stacked Objects v1.1
 * Pixel Align v.1.1

Most of the credit for figuring out the logic in this script goes to John Wundes. I have merely applied his work to a special use case for aligning icons on a grid.

See John's license for details about what you can and cannot do with the code.
JS code (c) copyright: John Wundes ( john@wundes.com ) www.wundes.com
copyright full text here:  http://www.wundes.com/js4ai/copyright.txt

## How it Works

This script will arrange a selection of icons (or any other vector objects) into columns and rows. Each icon will be centered in a cell (intersection of a row and column).

When you run the script, you will be prompted for a number. You should enter a single, positive integer (e.g., 64). This number represents both the width and height of the cells (the script assumes the cells are square).

The number you enter should be larger than the largest dimension of the icons. Say, for instance, you have designed your icons to be roughly 32 x 32 pixels. When you arrange them into a contact sheet, you will want some breathing room (white space) around the icons. So you might enter 64 so each icon will be centered in a cell with roughly 16 pixels of white space around it. 

Icons are centered based on their "visual bounds". The visual bounds are determined by drawing an imaginary rectangle around the icon so that the width is equal to the widest point of the icon and the height is equal to the tallest point of the icon. The rectangle is then centered by subtracting the width of the icon from the width of the cell then dividing by 2. The same is repeated for the height.

To determine the number of columns and rows, the script first assumes you want some breathing room around the contact sheet so it leaves the equivalent of one cell width blank on the top, bottom, left, and right sides of the artboard. So the live area of the contact sheet is determined by subtracting two times the cell width from the height (one on top, one on bottom) and the width (one cell width on each side).

So say your artboard is 1160 pixels wide and your cell size is 64. The artboard live area will be 1032 pixels (1160 - (2 X 64)). The height will be determined by the number of rows needed to display all the icons.

To determined the number of columns, the script divides the live area (1032 in this case) by the cell size (64). So in this example, there will be 16 columns (1032 / 64 = 16.125 [we round down]).

Now we can calculate the number of rows by dividing the number of icons by the number of columns. So let's say there are 500 icons. 

500 / 16 = 31.25

We round up to 32 rows.

Now we can calculate the new artboard height by multiplying the number of rows by the cell size, then adding the margins.

32 X 64 = 2048

Now add the margins:

2048 + (2 X 64) = 2176

The script will first arrange the icons in a grid, then resize the artboard to the exact dimensions of the grid, or 1152 W x 2176 H.

## Installation

1. Download the CreateContactSheet.jsx file and copy to Illustrator/Presets/{language}/Scripts/
2. Re-launch Adobe Illustrator after installing the script

## Assumptions

* Each icon should be comprised of a single element or group of elements.
* The document in which you are creating a contact sheet should contain a single artboard
* The artboard should be the correct dimensions for the contact sheet rows & columns

## Running the Script

1. Open an Adobe Illustrator file with.
2. Select all of the icons you want to arrange as a contact sheet
2. Select File > Scripts > CreateContactSheet
3. Contact sheets are created as a grid (rows x columns) where each icon inhabits a cell. A cell is a square that is the intersection of one row and one column. Let's say your icons are 32 pixels by 32 pixels. You might place each icon in a 64 x 64 cell. When the prompt appears, you will enter a value for the size of each cell. In the case of the example given, you would simply enter "64".
4. The script will leave a margin around the artboard that is the size of one cell. The remaining live area will be divided by the cell size in rows and columns and the icons will be centered one icon in each of the cells, then aligned to the nearest pixel.
5. Save your file.

You can now convert the contact sheet to a raster image. If your icons are pixel-perfect, they will render crisply because they are aligned to the nearest pixel.

## Batch Mode

You can also configure this script to run as part of a Batch Action. In order to do so, you will need to provide default settings where the script would normally prompt the user for feedback.

To run without the prompts, find the following block in the code:


    var config = {
        
        // The default cell size each icon occupies

        cellSize: 64,
    
        // Whether or not to shrink the artboard to fit the contact sheet once it is built.
        // This value is used if BATCH_MODE is set to true. Otherwise, you will be prompted 
        // after the contact sheet is built.
    
        shrinkToFit: false,
    
        // Set this to true to shuffle the order in which items appear on 
        // the contact sheet.
    
        shuffle: false
    };

Modify the settings to suit your needs.

After you have made the necessary config changes, update the BATCH_MODE setting by finding the code that reads:

<code>var BATCH_MODE = false;</code>

And change it to:

<code>var BATCH_MODE = true;</code>


## Configuration Options

The script also has some optional configuration settings. See below for details:

    var config = {
    
        // The default cell size each icon occupies. This will only be used if the script
        // is in batch mode (see Batch Mode section above)

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
    
        // User-interaction strings. You can update these as-needed for l10n/i18n.
    
        strings: {
            MAKE_SELECTION:  "You must select objects to distribute.",
            ENTER_CELL_SIZE: "Enter the size of each grid cell (Ex: 64)",
            ERROR_COLS_CALC: "An error occurred and the column count could not be calculated.",
            SHRINK_TO_FIT:   "Would you like to shrink the artboard to fit the contact sheet?"
        }
    };