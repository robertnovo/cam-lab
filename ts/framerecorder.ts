/**
 * Created by novo on 04/03/15.
 */
/// <reference path="../typings/threejs/three.d.ts"/>
module Core {
    export class RecordData {
        private _lookAtArray:Array<THREE.Vector3>;
        private _timeArray:Array<number>;
        private _positionArray:Array<THREE.Vector3>;
        private _clock:THREE.Clock = new THREE.Clock();
        private _isActive:Boolean = false;
        private _duration:number = 0;

        constructor(lookAtArray:Array<THREE.Vector3>, positionArray:Array<THREE.Vector3>, timeArray:Array<number>) {
            this._lookAtArray = lookAtArray;
            this._positionArray = positionArray;
            this._timeArray = timeArray;
        }

        updateRecordData(direction:THREE.Vector3, position:THREE.Vector3) {
            this.addRecordData(direction, position, this._clock.getElapsedTime());
        }

        startRecordData(direction:THREE.Vector3, position:THREE.Vector3) {
            this._isActive = true;
            this.addRecordData(direction, position, 0);
            this._clock.start();
        }

        stopRecordData(direction:THREE.Vector3, position:THREE.Vector3):void {
            this._isActive = false;
            this._clock.stop();
            this._duration = this._clock.getElapsedTime();
            this.addRecordData(direction, position, this._duration);
            for (var i = 0; i < this._timeArray.length; i++ ) {
                this._timeArray[i] = this._timeArray[i]/this._duration;
            }
        }

        get getDirectionArray() {
            return this._lookAtArray;
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

        private addRecordData(direction:THREE.Vector3, position:THREE.Vector3, time:number):void {
            this._lookAtArray.push(direction);
            this._positionArray.push(position);
            this._timeArray.push(time);
        }
    }

    /* TODO: Make singleton */
    class FrameRecorder {

        private _activeRecords:Array<RecordData> = new Array<RecordData>();

        constructor() {
        }

        startRecord(position:THREE.Vector3, direction:THREE.Vector3):number {
            var recordData = this.createEmtpyRecord();
            recordData.startRecordData(position, direction);
            this._activeRecords.push(recordData);
            return this._activeRecords.length - 1;
        }

        stopRecord(arrayIndex:number, direction:THREE.Vector3, position:THREE.Vector3):void {
            this._activeRecords[arrayIndex].stopRecordData(direction, position);
        }

        updateRecord(arrayIndex:number, direction:THREE.Vector3, position:THREE.Vector3):void {
            this._activeRecords[arrayIndex].updateRecordData(direction, position);
        }

        exportAndRemoveRecord(arrayIndex:number):RecordData {
            this.validateRecord(this._activeRecords[arrayIndex]);
            // all good.
            var record = this.copyRecordData(this._activeRecords[arrayIndex]);
            this._activeRecords[arrayIndex] = null;
            return record;
        }

        exportRecord(arrayIndex:number):RecordData {
            this.validateRecord(this._activeRecords[arrayIndex]);
            return this.copyRecordData(this._activeRecords[arrayIndex]);
        }

        removeRecord(arrayIndex:number):void {
            this.validateRecord(this._activeRecords[arrayIndex]);
            this._activeRecords[arrayIndex] = null;
        }

        private validateRecord(record:RecordData):void {
            if (record.getIsActive) {
                throw new Error("current record is active");
            }
        }

        private createEmtpyRecord():RecordData {
            return new RecordData(new Array<THREE.Vector3>(), new Array<THREE.Vector3>(), new Array<number>());
        }

        private copyRecordData(data:RecordData):RecordData {
            return new RecordData(data.getDirectionArray, data.getPositionArray, data.getTimeArray);
        }
    }

    export var _FrameRecorder = new FrameRecorder();
}


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
