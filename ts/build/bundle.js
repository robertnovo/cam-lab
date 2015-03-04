/**
 * Created by novo on 04/03/15.
 */
var AI;
(function (AI) {
    var StackFSM = (function () {
        function StackFSM() {
            this.stack = new Array();
        }
        StackFSM.prototype.update = function () {
            var currentStateFunction = this.getCurrentState();
            if (this.getCurrentState() != null) {
                currentStateFunction();
            }
        };
        StackFSM.prototype.popState = function () {
            return this.stack.pop();
        };
        StackFSM.prototype.pushState = function (state) {
            if (this.getCurrentState() != state) {
                this.stack.push(state);
            }
        };
        StackFSM.prototype.getCurrentState = function () {
            return (this.stack.length > 0) ? this.stack[this.stack.length - 1] : null;
        };
        return StackFSM;
    })();
    AI.StackFSM = StackFSM;
})(AI || (AI = {}));
//# sourceMappingURL=bundle.js.map