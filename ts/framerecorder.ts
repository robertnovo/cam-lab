/**
 * Created by novo on 04/03/15.
 */
/// <reference path="../typings/threejs/three.d.ts"/>
module Core {
    // singleton
    export class RecordData {
        private _directionArray:Array<THREE.Vector3> = new Array();
        private _timeArray:Array<number> = new Array<number>();
        private _positionArray:Array<THREE.Vector3> = new Array();

        private _clock:THREE.Clock;
        private _isActive:Boolean = false;

        constructor() {
        }

        addRecordSample(direction:THREE.Vector3, position:THREE.Vector3) {
            this._directionArray.push(direction);
            this._positionArray.push(position);
            this._timeArray.push(this._clock.elapsedTime);
        }

        startRecordData(direction:THREE.Vector3, position:THREE.Vector3) {
            this._isActive = true;
            this._clock.start();
            this.addRecordSample(direction, position);
        }

        stopRecordData(direction:THREE.Vector3, position:THREE.Vector3):void {
            this._isActive = false;
            this._clock.stop();
            this.addRecordSample(direction, position);
        }

        get getDirectionArray() {
            return this._directionArray;
        }

        get getTimeArray() {
            return this._timeArray;
        }

        get getPositionArray() {
            return this._positionArray;
        }

        get getIsActive() {
            return this._isActive;
        }
        // osv
    }

    // singleton
    export class FrameRecorder {

        private _activeRecords:Array<RecordData> = new Array<RecordData>();

        constructor() {
        }

        startRecord(position:THREE.Vector3, direction:THREE.Vector3):number { // return array index
            var recordData = new RecordData();
            recordData.startRecordData(position, direction);
            this._activeRecords.push(recordData);
            return this._activeRecords.length;
        }

        stopRecord(arrayIndex:number, direction:THREE.Vector3, position:THREE.Vector3):void {
            this._activeRecords[arrayIndex].stopRecordData(direction, position);
        }

        recordSample(arrayIndex:number, direction:THREE.Vector3, position:THREE.Vector3):void {
            this._activeRecords[arrayIndex].addRecordSample(direction, position);
        }

        exportRecord(arrayIndex:number) {
            // export och sätta till index i activeRecords till null
            if (this._activeRecords[arrayIndex].getIsActive) {
                var _timeArray = this._activeRecords[arrayIndex].getTimeArray;
                var _positionArray = this._activeRecords[arrayIndex].getPositionArray;
                var _directionArray = this._activeRecords[arrayIndex].getDirectionArray;
                this._activeRecords[arrayIndex] = null;
            } else {
                throw new Error("current record is active");
            }
        }
    }
}


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
