/**
 * Created by iconfinder on 2/26/16.
 */
'use strict';

exports.type = 'full';

exports.active = true;

exports.description = 'Applies and removes Sketch3 masks';

exports.params = {
    applyTransforms: true,
    applyTransformsStroked: true,
    makeArcs: {
        threshold: 2.5, // coefficient of rounding error
        tolerance: 0.5  // percentage of radius
    },
    straightCurves: true,
    lineShorthands: false,
    curveSmoothShorthands: true,
    floatPrecision: 3,
    transformPrecision: 5,
    removeUseless: true,
    collapseRepeated: true,
    utilizeAbsolute: true,
    leadingZero: true,
    negativeExtraSpace: true
};

// var applyTransforms = require('./_path.js').applyTransforms;
// var moveGroupAttrsToElems = require('./moveGroupAttrsToElems.js');

var collections = require('./_collections.js'),
    pathElems = collections.pathElems.concat(['g', 'text']),
    referencesProps = collections.referencesProps,
    path2js = require('./_path.js').path2js,
    js2path = require('./_path.js').js2path,
    applyTransforms = require('./_path.js').applyTransforms,
    convertPathData = require('./convertPathData.js');
    
/**
 * Apply and remove Sketch3 mask transforms:
 * -
 *
 * @param {Object} The full SVG data object
 * @return {Object} The modified data object
 *
 * @author Iconfinder
 */
exports.fn = function(data) {

    var masks = [],
        paths = [];
    
    /**
     * Collect IDs of paths with masks and IDs of their masks. Stored in paths array
     * -
     * @param {Object} current set of data objects
     * @return void
     */
    function collect_masks(items) {
        items.content.forEach(function(item) {
            var mask, xhref, mask_path;
            try {
                try {applyTransforms(item);}
                catch(e){}
                
                if (item.isElem('path')) {
                
                    if (item.hasAttr("id")) {
                
                        var id = item.attr("id").value;
                        
                        paths[id] = item;
                        
                        if (item.hasAttr('mask')) {

                            mask = get_by_attr(
                                items,
                                'mask',
                                'id',
                                item.attr("mask").value.replace(/url\(#(.*)\)/g, '$1')
                            );
                            item.removeAttr('mask');
                            
                            xhref = get_xhref(mask);
                            
                            if (xhref != "undefined") {
                                xhref = xhref.replace("#", "");
                            }
                            masks.push({'id': id, 'mask': xhref});
                        }
                    }
                }
                if (item.content) {
                    collect_masks(item);
                }
            }
            catch(e) {
                console.error(e);
            }
        });
        return items;
    };
    
    /**
     * Find an element by its tag name, attr, and matching value
     * -
     * @param {Object} current set of data objects
     * @param {String} name of the element to find
     * @param {String} name of the attr to match
     * @param {String} value of attr to match
     * @return {Object} matching data object
     */
    function get_by_attr(src, elem, attr, value) {
        var result = null;
        
        if (src.content) {
            for (var i=0; i<src.content.length; i++) {
                var item = src.content[i];
                if (result == null && item.isElem(elem)) {
                    if (item.hasAttr(attr) && item.attr(attr).value == value) {
                        result = item;
                        break;
                    }
                }
                if (result == null && item.content) {
                    get_by_attr(item, elem, attr, value);
                }
            }
        }
        return result;
    };
    
    /**
     * Gets the xhref value for the path mask
     * -
     * @param {Object} current set of data objects
     * @return {String} id of the path's mask
     */    
    function get_xhref(node) {
        var xhref = null;
        node.content.forEach(function(item) {
            if (item.isElem('use')) {
                xhref = item.attr('xlink:href').value;
            }
            if (!xhref && item.content) {
                get_xhref(item);
            }
        });
        return xhref;
    };
    
    /**
     * Removes mask elements
     * -
     * @param {Object} current set of data objects
     * @return void
     */    
    function remove_masks(items) {
        try {
            items.content.forEach(function(item) {
                if (item.isElem('mask')) {
                    item.elem = false;
                }
                if (item.content) {
                    remove_masks(item);
                }
            });
        }
        catch(e) {
            console.error(e);
        }
    };
    
    /**
     * Applies path masks to the path being masked
     * -
     * @param {Array} Array of objects {id: 'id of path to be masked', mask: 'id of mask'}
     * @return void
     */    
    function apply_masks(masks) {
        for (var i=0; i<masks.length; i++) {
            if (paths[masks[i].id].hasAttr('d') && paths[masks[i].mask].hasAttr('d')) {
                paths[masks[i].id].attr('d').value = paths[masks[i].mask].attr('d').value;
                paths[masks[i].mask].elem = false;
                paths[masks[i].mask].attrs = {};
            }
        }
    };
    
    /**
     * Removes empty nodes (nodes with no child nodes)
     * -
     * @param {Object} current set of data objects
     * @param {String} name of the element to find
     * @return void
     */    
    function remove_empty_nodes(items, elem) {
        try {
            items.content.forEach(function(item) {
                if (item.isElem(elem)) {
                    var nonEmptyChildNodes = 0;
                    item.content.forEach(function(child) {
                        if (child.elem != false) nonEmptyChildNodes += 1;
                    });
                    if (nonEmptyChildNodes == 0) {
                        item.elem = false;
                    }
                }
                if (item.content) {
                    remove_empty_nodes(item, elem);
                }
            });
        }
        catch(e) {
            console.error(e);
        }
    };
    
    /**
     * Maps a function - fn - to all elements in a collection
     * - 
     * @param {Object} the root object to begin applying the function
     * @param {Function} the function to call on every element in the collection
     * @param {Boolean} whether or not to display errors
     * @return void
     */
    function map(items, fn, silent) {
        if (!items.content) return;
        items.content.forEach(function(item) {
            try {
                fn(item);
            }
            catch(e){
                if (! silent) {
                    console.error(e);
                }
            }
            if (item.content) {
                map(item, fn, silent);
            }
        });
    };
    
    /**
     * Moves group attributes to child elements
     * -
     * @param {Object} the object to potentially move attrs 
     * @return void
     */
     function move_group_attrs_to_elems(item) {
        // move group transform attr to content's pathElems
        if (
            item.isElem('g') &&
            item.hasAttr('transform') &&
            !item.isEmpty() 
        ) {
            item.content.forEach(function(inner) {
                if (inner.hasAttr('transform')) {
                    inner.attr('transform').value = item.attr('transform').value + ' ' + inner.attr('transform').value;
                } else {
                    inner.addAttr(item.attr('transform'));
                }
            });
            item.removeAttr('transform');
        }
    };
    
    /**
     * Flattens groups with only a single path to just the path
     * -
     * @param {Object} the data node to start with
     * @return void
     */
    function flatten_groups(items) {
    
        if (! items.content) return;
        items.content.forEach(function(item) {
            if (item.isElem('g')) {
                console.info("Found a group");
                //console.info(item);
                if (item.content.length == 2) {
                    if (item.content[1].elem == 'path') {
                        console.info("Replacing group with path");
                        for (var key in item.content[1]) {
                            item[key] = item.content[1][key];
                        }
                        item.content[1].elem = false;
                    }
                }
            } 
            if (item.content) {
                flatten_groups(item);
            }
        });
    };
    
    /**
     * Applies the convertPathData plugin on our data objects
     * -
     * @param {Object} the data node to start with
     * @return void
     */
    function do_transforms(items) {
        items.content.forEach(function(item) {
            try {
                convertPathData.fn(item, exports.params);
            }
            catch(e) {
                console.error(e);
            }
            if (item.content) {
                do_transforms(item);
            }
        });
    };
    
    
    // main
    
    //TODO: How well this is working and the benefits of this step are still unclear. At the very least, there do not appear to be any negative side effects.
    map(data, move_group_attrs_to_elems);
     
    /**
     * Collect all path IDs for paths with masks and corresponding mask path IDs
     */
    collect_masks(data);
    
    /**
     * Apply the masks by changing the path 'd' attribute values to the masks 'd' attribute values
     */
    apply_masks(masks);
    
    /**
     * Remove the mask elements
     */
    remove_masks(data);
    
    /**
     * Remove the empty 'defs' tag
     */
    remove_empty_nodes(data, ['defs']);
    
    /**
     * Apply tranformations
     */
    //TODO: This is not quite working
    //do_transforms(data);

    // flatten_groups(data);
    
    return data;
};