var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
var pxt;
(function (pxt) {
    var editor;
    (function (editor) {
        var AudioRecorder = (function (_super) {
            __extends(AudioRecorder, _super);
            function AudioRecorder(text, params, validator) {
                _super.call(this, text, validator);
                this.isFieldCustom_ = true;
                this.params = params;
            }
            /**
             * Show the inline free-text editor on top of the text.
             * @private
             */
            AudioRecorder.prototype.showEditor_ = function () {
            };
            AudioRecorder.prototype.initGrid = function () {
                var _this = this;
                var BOARD_SVG = "\n  <svg xmlns=\"http://www.w3.org/2000/svg\" id=\"sample-recorder\" viewBox=\"0 -20 180.09375 179.22874\">\n    <text x=\"-50\" y=\"15\" fill=\"white\">Start</text>\n    <rect id=\"start-button\" width=\"20\" height=\"20\" fill=\"#000000\"/>\n    <text x=\"-50\" y=\"40\" fill=\"white\">Pause</text>\n    <rect id=\"pause-button\" width=\"20\" height=\"20\" y=\"25\" fill=\"#000000\"/>\n    <text x=\"-50\" y=\"65\" fill=\"white\">Stop</text>\n    <rect id=\"stop-button\" width=\"20\" height=\"20\" y=\"50\" fill=\"#000000\"/>    \n  </svg>\n  ";
                this.boardElement = pxsim.svg.parseString(BOARD_SVG);
                pxsim.svg.hydrate(this.boardElement, {
                    'height': AudioRecorder.imageHeight,
                    'width': AudioRecorder.imageWidth,
                    'padding': '2px'
                });
                this.gridElement_ = this.boardElement.getElementById("grid");
                this.startButtonElement_ = this.boardElement.getElementById("start-button");
                this.pauseButtonElement_ = this.boardElement.getElementById("pause-button");
                this.stopButtonElement_ = this.boardElement.getElementById("stop-button");
                if (this.isCurrentlyEditable() && !this.isInFlyout()) {
                    pxsim.svg.onClick(this.startButtonElement_, function (ev) { return _this.onStartClicked(ev); });
                    pxsim.svg.onClick(this.pauseButtonElement_, function (ev) { return _this.onPauseClicked(ev); });
                    pxsim.svg.onClick(this.stopButtonElement_, function (ev) { return _this.onStopClicked(ev); });
                }
                this.fieldGroup_.appendChild(this.boardElement);
            };
            AudioRecorder.prototype.isInFlyout = function () {
                return this.sourceBlock_.workspace.getParentSvg().className.baseVal == "blocklyFlyout";
            };
            AudioRecorder.prototype.render_ = function () {
                if (!this.visible_) {
                    this.size_.width = 0;
                    return;
                }
                //if (!this.allBeats_) 
                this.initGrid();
                this.size_.height = Number(AudioRecorder.imageHeight);
                this.size_.width = Number(AudioRecorder.imageWidth);
            };
            AudioRecorder.prototype.onStartClicked = function (e) {
            };
            AudioRecorder.prototype.onPauseClicked = function (e) {
            };
            AudioRecorder.prototype.onStopClicked = function (e) {
            };
            AudioRecorder.prototype.getValue = function () {
                return this.getValueString() || this.emptySequenceString();
            };
            AudioRecorder.prototype.emptySequenceString = function () {
                return '`' + '`';
            };
            AudioRecorder.prototype.getValueString = function () {
                return '`' + '`';
            };
            AudioRecorder.prototype.getValueArray = function () {
                return '';
            };
            AudioRecorder.imageWidth = 225;
            AudioRecorder.imageHeight = 150;
            return AudioRecorder;
        }(Blockly.Field));
        editor.AudioRecorder = AudioRecorder;
    })(editor = pxt.editor || (pxt.editor = {}));
})(pxt || (pxt = {}));
/// <reference path="../node_modules/pxt-core/built/pxteditor.d.ts" />
var pxt;
(function (pxt) {
    var editor;
    (function (editor) {
        editor.initExtensionsAsync = function (opts) {
            pxt.debug("loading target extensions...");
            var res = {
                fieldEditors: [{
                        selector: "recorder",
                        editor: editor.AudioRecorder
                    }],
                resourceImporters: []
            };
            return Promise.resolve(res);
        };
    })(editor = pxt.editor || (pxt.editor = {}));
})(pxt || (pxt = {}));
