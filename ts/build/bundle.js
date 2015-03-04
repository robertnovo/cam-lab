/**
 * Created by novo on 04/03/15.
 */
/// <reference path="../typings/threejs/three.d.ts"/>
var Core;
(function (Core) {
    var RecordData = (function () {
        function RecordData(directionArray, positionArray, timeArray) {
            this._isActive = false;
            this._directionArray = directionArray;
            this._positionArray = positionArray;
            this._timeArray = timeArray;
        }
        RecordData.prototype.addRecordSample = function (direction, position) {
            this._directionArray.push(direction);
            this._positionArray.push(position);
            this._timeArray.push(this._clock.getElapsedTime);
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
    // singleton
    var FrameRecorder = (function () {
        function FrameRecorder() {
            this._activeRecords = new Array();
        }
        FrameRecorder.prototype.startRecord = function (position, direction) {
            var recordData = this.createEmtpyRecord();
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
        FrameRecorder.prototype.exportAndRemoveRecord = function (arrayIndex) {
            this.validateRecord(this._activeRecords[arrayIndex]);
            // all good.
            var record = this.copyRecordData(this._activeRecords[arrayIndex]);
            this._activeRecords[arrayIndex] = null;
            return record;
        };
        FrameRecorder.prototype.exportRecord = function (arrayIndex) {
            this.validateRecord(this._activeRecords[arrayIndex]);
            return this.copyRecordData(this._activeRecords[arrayIndex]);
        };
        FrameRecorder.prototype.removeRecord = function (arrayIndex) {
            this.validateRecord(this._activeRecords[arrayIndex]);
            this._activeRecords[arrayIndex] = null;
        };
        FrameRecorder.prototype.validateRecord = function (record) {
            if (record.getIsActive) {
                throw new Error("current record is active");
            }
        };
        FrameRecorder.prototype.createEmtpyRecord = function () {
            return new RecordData(new Array(), new Array(), new Array());
        };
        FrameRecorder.prototype.copyRecordData = function (data) {
            return new RecordData(data.getDirectionArray, data.getPositionArray, data.getTimeArray);
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
 FrameRecorder.updateRecord(startIndex, currentPos, currentLookat);

 // stop
 FrameRecorder.stopRecord(startIndex, currentPOs, currentLookat);


 var record = FrameRecord.exportAndRemoveRecord(startIndex);
    =>  Recordata
 */
//# sourceMappingURL=bundle.js.map
