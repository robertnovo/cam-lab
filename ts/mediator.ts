/**
 * Created by novo on 04/03/15.
 */
/// <reference path="../typings/lodash/lodash.d.ts"/>
module Core {
    class Mediator {
        private channels: Array<any>;
        constructor() {
            this.channels = [];
        }

        subscribe(channel, fn, inFile) {
            if (!this.channels[channel]) {
                this.channels[channel] = [];
            }
            this.channels[channel].push({
                context: this,
                callback: fn
            });
            if (inFile) {
                console.info(channel + " subscription in " + inFile);
            }
        }

        publish(channel, args, inFile) {
            if (!this.channels[channel]) {
                console.warn("Mediator warning! Channel has no subscribers: ", "'" + channel + "'", "in file: ", inFile);
                return false;
            }
            var args = Array.prototype.slice.call(arguments, 1);
            _.each(this.channels[channel], function (value, key) {
                var subscription = this.channels[channel][key];
                subscription.callback.apply(subscription.context, args);
            }, this);

            if (inFile) {
                console.info(channel + " publish in " + inFile);
            }
        }
    }
}
