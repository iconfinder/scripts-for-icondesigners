Icon Contact Sheet
==================

## Copyright

2016 Iconfinder.com - http://iconfinder.com

## Date

September 13, 2016


## Installation: 

1. Copy this file to Illustrator > Presets > Scripting
2. Restart Adobe Illustrator
3. Go to File > Scripts > Contact Sheet
4. Follow the prompts

## Usage:

This script will create a contact sheet of vector objects from a folder structure 
that you specify. As of 13-09-2016 the script will only work with folder structures 
nested 1 level deep (Parent > Subfolders). This was done intentionally to allow 
for creating contacts sheets of categorized icons where the user wants to 
be able to specify the order of the categories.

Inputs:

Page Width:     The width of the contact sheet in pixels
Page Height:    The height of the contact sheet in pixels
Column Width:   The width of the columns in pixels
Row Height:     The height of the rows in pixels
Scale:          The percentage (100 = 100%) to scale the objects being placed

The resulting contact sheet will have margins that are calculated thus: subtracting
Left & Right Margins = (Page Width - Column WidthColumn Count) / 2
Top & Bottom Margins = (Page Height - Row HeightRow Count) / 2

Copyright:

(c) Copyright: Iconfinder.com - http://iconfinder.com

Copyright full text can be found in the accompanying file license.txt

## Description

This script will create a contact sheet of vector objects from a folder structure that you specify. As of 13-09-2016 the script will only work with folder structures nested 1 level deep (Parent > Subfolders). This was done intentionally to allow for creating contacts sheets of categorized icons where the user wants to be able to specify the order of the categories.

## Installation

Download the Contact Sheet.jsx file and copy to Illustrator/Presets/{language}/Scripts/

You will need to relaunch Adobe Illustrator after installing the script.

### Running the Script

1. Select File > Scripts > Contact Sheet
2. Follow the prompts

#### Inputs

* Page Width:     The width of the contact sheet in pixels
* Page Height:    The height of the contact sheet in pixels
* Column Width:   The width of the columns in pixels
* Row Height:     The height of the rows in pixels
* Scale:          The percentage (100 = 100%) to scale the objects being placed

### Known Issues

* 2016-09-13 - The script currently only supports folders nested one level deep (need to add recursive folder support)
* 2016-09-13 - No progress bar
* 2016-09-13 - The script is admittedly slow but this is a result of the technology, not the code
* 2016-10-09 - Currently Mac-centric. Need to detect OS and change path notation accordingly.