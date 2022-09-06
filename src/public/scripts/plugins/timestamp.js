define("TimeStamp", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.name = exports.getInitialState = void 0;
    var TimeStampEffectObject = /** @class */ (function () {
        function TimeStampEffectObject() {
        }
        TimeStampEffectObject.prototype.update = function (ctx) {
            var time = ctx.timeline.curent;
            var strip = ctx.strip;
            if (strip.start <= time && time < strip.start + strip.length) {
                var text = ctx.timeline.curent.toFixed(3);
                var textEffect = ctx.strip.effects.find(function (e) { return e.type === 'Text'; });
                if (textEffect.text === text) {
                    return;
                }
                if (textEffect) {
                    textEffect.text = text;
                }
                ctx.updateEffect(strip.id, textEffect);
            }
        };
        TimeStampEffectObject.prototype.mounted = function (el, effect) {
            console.log('mount');
            el.innerHTML = "<div>".concat(JSON.stringify(effect), "</div>");
        };
        TimeStampEffectObject.prototype.unMounted = function () {
            console.log('onUnmounted');
        };
        return TimeStampEffectObject;
    }());
    exports.default = TimeStampEffectObject;
    function getInitialState() {
        return {
            format: 'normal'
        };
    }
    exports.getInitialState = getInitialState;
    exports.name = 'TimeStamp';
});
