/**
 * Created by novo on 04/03/15.
 */
/// <reference path="../typings/threejs/three.d.ts"/>
var Core;
(function (Core) {
    // singleton
    var RecordData = (function () {
        function RecordData() {
            this._directionArray = new Array();
            this._timeArray = new Array();
            this._positionArray = new Array();
            this._isActive = false;
        }
        RecordData.prototype.addRecordSample = function (direction, position) {
            this._directionArray.push(direction);
            this._positionArray.push(position);
            this._timeArray.push(this._clock.elapsedTime);
        };
        RecordData.prototype.startRecordData = function (direction, position) {
            this._isActive = true;
            this._clock.start();
            this.addRecordSample(direction, position);
        };
        RecordData.prototype.stopRecordData = function (direction, position) {
            this._isActive = false;
            this._clock.stop();
            this.addRecordSample(direction, position);
        };
        Object.defineProperty(RecordData.prototype, "getDirectionArray", {
            get: function () {
                return this._directionArray;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RecordData.prototype, "getTimeArray", {
            get: function () {
                return this._timeArray;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RecordData.prototype, "getPositionArray", {
            get: function () {
                return this._positionArray;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RecordData.prototype, "getIsActive", {
            get: function () {
                return this._isActive;
            },
            enumerable: true,
            configurable: true
        });
        return RecordData;
    })();
    Core.RecordData = RecordData;
    // singleton
    var FrameRecorder = (function () {
        function FrameRecorder() {
            this._activeRecords = new Array();
        }
        FrameRecorder.prototype.startRecord = function (position, direction) {
            var recordData = new RecordData();
            recordData.startRecordData(position, direction);
            this._activeRecords.push(recordData);
            return this._activeRecords.length;
        };
        FrameRecorder.prototype.stopRecord = function (arrayIndex, direction, position) {
            this._activeRecords[arrayIndex].stopRecordData(direction, position);
        };
        FrameRecorder.prototype.recordSample = function (arrayIndex, direction, position) {
            this._activeRecords[arrayIndex].addRecordSample(direction, position);
        };
        FrameRecorder.prototype.exportRecord = function (arrayIndex) {
            // export och sätta till index i activeRecords till null
            if (this._activeRecords[arrayIndex].getIsActive) {
                var _timeArray = this._activeRecords[arrayIndex].getTimeArray;
                var _positionArray = this._activeRecords[arrayIndex].getPositionArray;
                var _directionArray = this._activeRecords[arrayIndex].getDirectionArray;
                this._activeRecords[arrayIndex] = null;
            }
            else {
                throw new Error("current record is active");
            }
        };
        return FrameRecorder;
    })();
    Core.FrameRecorder = FrameRecorder;
})(Core || (Core = {}));
/*
 FLOW

 // precis när kameran ska börja
 var startIndex = FrameRecorder.startRecord(startPos, lookAt-direction); // returnerar array index (aI)

 // each frame
 FrameRecorder.recordSample(startIndex, currentPos, currentLookat);

 // stop
 FrameRecorder.stopRecord(startIndex, currentPOs, currentLookat);


 FrameRecord.export(startIndex);
 =>
 */
//# sourceMappingURL=bundle.js.map