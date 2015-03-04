/**
 * Created by novo on 04/03/15.
 */
module AI {
    export class StackFSM {
        stack: Array<Function>;
        constructor() {
            this.stack = new Array();
        }

        update() {
            var currentStateFunction = this.getCurrentState();
            if (this.getCurrentState() != null) {
                currentStateFunction();
            }
        }

        popState() {
            return this.stack.pop();
        }

        pushState(state):void {
            if (this.getCurrentState() != state) {
                this.stack.push(state);
            }
        }

        getCurrentState() {
            return (this.stack.length > 0) ? this.stack[this.stack.length - 1] : null;
        }
    }
}
