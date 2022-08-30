/// <amd-module name='TimeStamp'/>
define("TimeStamp", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.name = void 0;
    var fetched = false;
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
                if (!fetched) {
                    fetched = true;
                    fetch('https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823').then(function (x) {
                        x.json().then(function (body) {
                            console.log(body);
                        });
                    });
                }
            }
        };
        return TimeStampEffectObject;
    }());
    exports.default = TimeStampEffectObject;
    exports.name = 'TimeStamp';
});
