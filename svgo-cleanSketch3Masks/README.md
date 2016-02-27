# SVGO Plugin - cleanSketch3Masks
==================

## Description

This script is a Node.js plugin for SVGO to apply and remove object masks created in Sketh3 SVG files. These paths are not compatible with some other SVG implementations and are best removed.

## Dependencies

- svgo/_paths.js
- svgo/_colections.js
- svgo/convertPathData.js

## Installation

Will add later...

### Running the Script

Will add later...

### Batch Processing Files

Will add later...

### Known Issues

- [active] Masks that are compound paths are not being applied correctly. This has something to do with applying the transformations on path elements but to-date they are not fixed.
- [active]