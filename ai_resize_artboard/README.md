Ai Resize Artboard
==================

This script is based on the script shrinkABtoFitArt_CS4.jsx by Carlos Canto. 

## Description

Use this Adobe Illustrator Script Extension to resize the artboard to a user-defined size, then center the artwork on the artboard.

## Installation

Download the ResizeArtboard.jsx file and copy to Illustrator/Presets/{language}/Scripts/

You will need to relaunch Adobe Illustrator after installing the script.

### Running the Script

1. Open an Adobe Illustrator file with. The file must contain only one artboard and at least one object on the page
2. Select File > Scripts > ResizeArtboard
3. Enter a positive integer value at the prompt
4. After the script has run, save your file

### Batch Processing Files

Before setting up the Batch Action, you will need to make a simple change to the JavaScript Extension code.

1. Open the Illustrator/Presets/{language}/Scripts/ResizeArtboard.jsx file in a plain text editor
2. Comment out line 27 that reads

<code>
var size = Number(Window.prompt("Enter Artboard Size as a positive integer", 32, "Resize Artboard"));
</code>

3. Un-comment line 32 that reads:

<code>`var size = 32`</code>

The value you set represents the size (square) of the artboard in pixels.

#### Setting up the Batch Action

1. Open the Actions palette in Illustrator: Window > Actions
2. Create a new Action Set and give it a meaningful name (meaningful to you)
3. Create a new Action named Resize Artboard in the set you just created
4. Select the action in the palette by clicking on it once
5. Find the Action Options menu (the inverted triangle with four horizontal lines in the upper right corner of the Actions palette)
6. Select "Insert Menu Item ..." from the Action Options menu
7. A dialog with a single entry field will appear. You do not need to manually enter a value. Instead, select File > Scripts > ResizeArtboard. The field will be populated automatically.
8. Click "OK" on the dialog
9. You can now use this Action in a batch script. For instructions on setting up an Illustrator Batch job, see [The Adobe Help Site](http://help.adobe.com/en_US/illustrator/cs/using/WS714a382cdf7d304e7e07d0100196cbc5f-62b3a.html#WS714a382cdf7d304e7e07d0100196cbc5f-62a7a)

### Known Issues

* 2013-12-05 - The script was created for a very specific use case: To resize the artboard for vector icons and to center the icon.
* 2013-12-05 - The artboard is assumed to be square.
* 2013-12-05 - The script has not been tested with more than one artboard. It is known to work well with a single artboard.
* 2013-12-05 - In order to center the artwork, the script adds every element to a new group. The items are not un-grouped after they are centered (not yet anyway).