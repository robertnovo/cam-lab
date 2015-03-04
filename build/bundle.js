/**
 * Created by novo on 04/03/15.
 */
/// <referen
var Core;
(function (Core) {
    // singleton
    var RecordData = (function () {
        function RecordData() {
            this._directionArray = new Array();
            this._timeArray = new Array();
            this._positionArray = new Array();
        }
        RecordData.prototype.addRecordData = function (direction, position, time) {
            this._directionArray.push(direction);
            this._positionArray.push(position);
            this._timeArray.push(time);
        };
        Object.defineProperty(RecordData.prototype, "getTimeArray", {
            get: function () {
                return this._directionArray;
            },
            enumerable: true,
            configurable: true
        });
        return RecordData;
    })();
    var FrameRecorder = (function () {
        function FrameRecorder() {
            this._activeRecords = new Array();
        }
        FrameRecorder.prototype.clock = function () {
        };
        FrameRecorder.prototype.startRecord = function (pos, direction) {
            // do sample
            var index;
            return index;
        };
        FrameRecorder.prototype.stopRecord = function (pos, direction) {
            return null;
        };
        FrameRecorder.prototype.recordSample = function (pos, direction) {
        };
        FrameRecorder.prototype.export = function (index) {
        };
        return FrameRecorder;
    })();
    Core.FrameRecorder = FrameRecorder;
})(Core || (Core = {}));
//# sourceMappingURL=bundle.js.map
