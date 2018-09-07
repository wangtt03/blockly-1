/**
 * Visual Blocks Editor
 *
 * Copyright 2011 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Object representing a trash can icon.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Trashcan');

goog.require('goog.math.Rect');


/**
 * Class for a trash can.
 * @param {!Blockly.BlockSpace} blockSpace The blockSpace to sit in.
 * @constructor
 */
Blockly.Trashcan = function(blockSpace) {
  this.blockSpace_ = blockSpace;
};

/**
 * URL of the trashcan image (minus lid).
 * @type {string}
 * @private
 */
Blockly.Trashcan.CLOSED_URL_ = 'media/canclosed.png';

/**
 * URL of the lid image.
 * @type {string}
 * @private
 */
Blockly.Trashcan.OPEN_URL_ = 'media/canopen.png';

/**
 * Width of both the trash can and lid images.
 * @type {number}
 * @private
 */
Blockly.Trashcan.WIDTH_ = 70;

/**
 * Height of the trashcan image in pixels.
 * @type {number}
 * @private
 */
Blockly.Trashcan.HEIGHT_ = 70;

/**
 * Distance between trashcan and top edge of blockSpace in pixels.
 * @type {number}
 * @private
 */
Blockly.Trashcan.MARGIN_TOP_ = 15;

/**
 * Distance between trashcan and right edge of blockSpace in pixels.
 * @type {number}
 * @private
 */
Blockly.Trashcan.MARGIN_SIDE_ = 22;


/**
* Extent of hotspot on all sides beyond the size of the image.
* @type {number}
* @private
*/
Blockly.Trashcan.MARGIN_HOTSPOT_ = 25;

/**
 * Current open/close state of the lid.
 * @type {boolean}
 */
Blockly.Trashcan.prototype.isOpen = false;

/**
 * Additional radius of the trashcan; used in determining the open/closed
 * state of the lid
 * @type {number}
 */
Blockly.Trashcan.prototype.radius = 50;

/**
 * The SVG group containing the trash can.
 * @type {Element}
 * @private
 */
Blockly.Trashcan.prototype.svgGroup_ = null;

/**
 * The SVG image element of the closed trash can.
 * @type {Element}
 * @private
 */
Blockly.Trashcan.prototype.svgClosedCan_ = null;

/**
 * The SVG image element of the open trash can.
 * @type {Element}
 * @private
 */
Blockly.Trashcan.prototype.svgOpenCan_ = null;

/**
 * Left coordinate of the trash can.
 * @type {number}
 * @private
 */
Blockly.Trashcan.prototype.left_ = 0;

/**
 * Top coordinate of the trash can.
 * @type {number}
 * @private
 */
Blockly.Trashcan.prototype.top_ = 0;

/**
 * Create the trash can elements.
 * @return {!Element} The trash can's SVG group.
 */
Blockly.Trashcan.prototype.createDom = function() {
  /*
  <g filter="url(#blocklyTrashcanShadowFilter)">
    <image width="100" height="100" href="media/canclosed.png"></image>
    <image width="100" height="100" visibility="hidden" href="media/canopen.png"></image>
  </g>
  */
  this.svgGroup_ = Blockly.createSvgElement('g',
      {'id': 'trashcan', 'filter': Blockly.isPortrait? '' : 'url(#blocklyTrashcanShadowFilter)'}, null);
  this.svgClosedCan_ = Blockly.createSvgElement('image',
      {'width': Blockly.Trashcan.WIDTH_, 'height': Blockly.Trashcan.HEIGHT_},
      this.svgGroup_);
  this.svgClosedCan_.setAttributeNS(
      'http://www.w3.org/1999/xlink', 'xlink:href',
      Blockly.assetUrl(Blockly.Trashcan.CLOSED_URL_));
  this.svgOpenCan_ = Blockly.createSvgElement('image',
      {'width': Blockly.Trashcan.WIDTH_, 'height': Blockly.Trashcan.HEIGHT_},
      this.svgGroup_);
  this.svgOpenCan_.setAttribute('visibility', 'hidden');
  this.svgOpenCan_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      Blockly.assetUrl(Blockly.Trashcan.OPEN_URL_));
  this.notAllowed_ = Blockly.createSvgElement('g', {}, this.svgGroup_);
  Blockly.createSvgElement('line',
      {x1: 15, y1: 15, x2: 55, y2: 55, stroke: '#c00', 'stroke-width': 5}, this.notAllowed_);
  Blockly.createSvgElement('circle',
    {cx: 36, cy: 34, r: 28, stroke: '#c00', 'stroke-width': 5, fill: 'none'}, this.notAllowed_);
  this.notAllowed_.setAttribute('visibility', 'hidden');
  return this.svgGroup_;
};


Blockly.Trashcan.prototype.getRect = function() {
  if (!this.svgGroup_) {
    return null;
  }

  var trashRect = this.svgGroup_.getBoundingClientRect();
  var left = trashRect.left ;
  var top = trashRect.top ;
  var width = Blockly.Trashcan.WIDTH_ + 2 * Blockly.Trashcan.MARGIN_HOTSPOT_;
  var height = Blockly.Trashcan.HEIGHT_ + 2 * Blockly.Trashcan.MARGIN_HOTSPOT_;
  return new goog.math.Rect(left, top, width, height);

};

/**
 * Dispose of this trash can.
 * Unlink from all DOM elements to prevent memory leaks.
 */
Blockly.Trashcan.prototype.dispose = function() {
  if (this.svgGroup_) {
    goog.dom.removeNode(this.svgGroup_);
    this.svgGroup_ = null;
  }
  this.svgClosedCan_ = null;
  this.svgOpenCan_ = null;
  this.notAllowed_ = null;
  this.blockSpace_ = null;
};


/**
 * Returns the trashcan's current height in pixels
 */
Blockly.Trashcan.prototype.getHeight = function() {
  return Blockly.Trashcan.HEIGHT_;
};


/**
 * Flip the lid open or shut.
 * @param {boolean} state True if open.
 * @private
 */
Blockly.Trashcan.prototype.setOpen_ = function(state) {
  if (this.isOpen == state) {
    return;
  }
  this.isOpen = state;
  this.animateLid_();
};

/**
 * Put a red slash over the trashcan to make it clear a block can't be deleted.
 * @param {boolean} state True if disabled.
 */
Blockly.Trashcan.prototype.setDisabled = function(state) {
  if (this.isDisabled === state) {
    return;
  }
  this.isDisabled = state;
  if (this.isDisabled) {
    this.notAllowed_.setAttribute('visibility', 'visible');
  } else {
    this.notAllowed_.setAttribute('visibility', 'hidden');
  }
};

/**
 * Rotate the lid open or closed by one step.  Then wait and recurse.
 * @private
 */
Blockly.Trashcan.prototype.animateLid_ = function() {
  if (this.isOpen) {
    this.svgOpenCan_.setAttribute('visibility', 'visible');
  } else {
    this.svgOpenCan_.setAttribute('visibility', 'hidden');
  }
};

/**
 * Flip the lid shut.
 * Called externally after a drag.
 */
Blockly.Trashcan.prototype.close = function() {
  this.setOpen_(false);
};
