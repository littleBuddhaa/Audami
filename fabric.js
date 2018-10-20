var fabric = fabric || { version: "2.4.2" };

function resizeCanvasIfNeeded(t) {
    var e = t.targetCanvas,
        i = e.width,
        r = e.height,
        n = t.destinationWidth,
        s = t.destinationHeight;
    i === n && r === s || (e.width = n, e.height = s)
}

function copyGLTo2DDrawImage(t, e) {
    var i = t.canvas,
        r = e.targetCanvas,
        n = r.getContext("2d");
    n.translate(0, r.height), n.scale(1, -1);
    var s = i.height - r.height;
    n.drawImage(i, 0, s, r.width, r.height, 0, 0, r.width, r.height)
}

function copyGLTo2DPutImageData(t, e) {
    var i = e.targetCanvas.getContext("2d"),
        r = e.destinationWidth,
        n = e.destinationHeight,
        s = r * n * 4,
        o = new Uint8Array(this.imageBuffer, 0, s),
        a = new Uint8ClampedArray(this.imageBuffer, 0, s);
    t.readPixels(0, 0, r, n, t.RGBA, t.UNSIGNED_BYTE, o);
    var c = new ImageData(a, r, n);
    i.putImageData(c, 0, 0)
}
"undefined" != typeof exports ? exports.fabric = fabric : "function" == typeof define && define.amd && define([], function() { return fabric }), "undefined" != typeof document && "undefined" != typeof window ? (fabric.document = document, fabric.window = window) : (fabric.document = require("jsdom").jsdom(decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E"), { features: { FetchExternalResources: ["img"] } }), fabric.jsdomImplForWrapper = require("jsdom/lib/jsdom/living/generated/utils").implForWrapper, fabric.nodeCanvas = require("jsdom/lib/jsdom/utils").Canvas, fabric.window = fabric.document.defaultView, DOMParser = require("xmldom").DOMParser), fabric.isTouchSupported = "ontouchstart" in fabric.window, fabric.isLikelyNode = "undefined" != typeof Buffer && "undefined" == typeof window, fabric.SHARED_ATTRIBUTES = ["display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "id", "paint-order", "instantiated_by_use", "clip-path"], fabric.DPI = 96, fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)", fabric.fontPaths = {}, fabric.iMatrix = [1, 0, 0, 1, 0, 0], fabric.canvasModule = "canvas", fabric.perfLimitSizeTotal = 2097152, fabric.maxCacheSideLimit = 4096, fabric.minCacheSideLimit = 256, fabric.charWidthsCache = {}, fabric.textureSize = 2048, fabric.enableGLFiltering = !0, fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1, fabric.browserShadowBlurConstant = 1, fabric.arcToSegmentsCache = {}, fabric.boundsOfCurveCache = {}, fabric.cachesBoundsOfCurve = !0, fabric.initFilterBackend = function() { return fabric.enableGLFiltering && fabric.isWebglSupported && fabric.isWebglSupported(fabric.textureSize) ? (console.log("max texture size: " + fabric.maxTextureSize), new fabric.WebglFilterBackend({ tileSize: fabric.textureSize })) : fabric.Canvas2dFilterBackend ? new fabric.Canvas2dFilterBackend : void 0 }, "undefined" != typeof document && "undefined" != typeof window && (window.fabric = fabric),
    function() {
        function r(t, e) {
            if (this.__eventListeners[t]) {
                var i = this.__eventListeners[t];
                e ? i[i.indexOf(e)] = !1 : fabric.util.array.fill(i, !1)
            }
        }

        function t(t, e) {
            if (this.__eventListeners || (this.__eventListeners = {}), 1 === arguments.length)
                for (var i in t) this.on(i, t[i]);
            else this.__eventListeners[t] || (this.__eventListeners[t] = []), this.__eventListeners[t].push(e);
            return this
        }

        function e(t, e) {
            if (this.__eventListeners) {
                if (0 === arguments.length)
                    for (t in this.__eventListeners) r.call(this, t);
                else if (1 === arguments.length && "object" == typeof t)
                    for (var i in t) r.call(this, i, t[i]);
                else r.call(this, t, e);
                return this
            }
        }

        function i(t, e) { if (this.__eventListeners) { var i = this.__eventListeners[t]; if (i) { for (var r = 0, n = i.length; r < n; r++) i[r] && i[r].call(this, e || {}); return this.__eventListeners[t] = i.filter(function(t) { return !1 !== t }), this } } }
        fabric.Observable = { observe: t, stopObserving: e, fire: i, on: t, off: e, trigger: i }
    }(), fabric.Collection = {
        _objects: [],
        add: function() {
            if (this._objects.push.apply(this._objects, arguments), this._onObjectAdded)
                for (var t = 0, e = arguments.length; t < e; t++) this._onObjectAdded(arguments[t]);
            return this.renderOnAddRemove && this.requestRenderAll(), this
        },
        insertAt: function(t, e, i) { var r = this._objects; return i ? r[e] = t : r.splice(e, 0, t), this._onObjectAdded && this._onObjectAdded(t), this.renderOnAddRemove && this.requestRenderAll(), this },
        remove: function() { for (var t, e = this._objects, i = !1, r = 0, n = arguments.length; r < n; r++) - 1 !== (t = e.indexOf(arguments[r])) && (i = !0, e.splice(t, 1), this._onObjectRemoved && this._onObjectRemoved(arguments[r])); return this.renderOnAddRemove && i && this.requestRenderAll(), this },
        forEachObject: function(t, e) { for (var i = this.getObjects(), r = 0, n = i.length; r < n; r++) t.call(e, i[r], r, i); return this },
        getObjects: function(e) { return void 0 === e ? this._objects.concat() : this._objects.filter(function(t) { return t.type === e }) },
        item: function(t) { return this._objects[t] },
        isEmpty: function() { return 0 === this._objects.length },
        size: function() { return this._objects.length },
        contains: function(t) { return -1 < this._objects.indexOf(t) },
        complexity: function() { return this._objects.reduce(function(t, e) { return t += e.complexity ? e.complexity() : 0 }, 0) }
    }, fabric.CommonMethods = {
        _setOptions: function(t) { for (var e in t) this.set(e, t[e]) },
        _initGradient: function(t, e) {!t || !t.colorStops || t instanceof fabric.Gradient || this.set(e, new fabric.Gradient(t)) },
        _initPattern: function(t, e, i) {!t || !t.source || t instanceof fabric.Pattern ? i && i() : this.set(e, new fabric.Pattern(t, i)) },
        _initClipping: function(t) {
            if (t.clipTo && "string" == typeof t.clipTo) {
                var e = fabric.util.getFunctionBody(t.clipTo);
                void 0 !== e && (this.clipTo = new Function("ctx", e))
            }
        },
        _setObject: function(t) { for (var e in t) this._set(e, t[e]) },
        set: function(t, e) { return "object" == typeof t ? this._setObject(t) : "function" == typeof e && "clipTo" !== t ? this._set(t, e(this.get(t))) : this._set(t, e), this },
        _set: function(t, e) { this[t] = e },
        toggle: function(t) { var e = this.get(t); return "boolean" == typeof e && this.set(t, !e), this },
        get: function(t) { return this[t] }
    },
    function(s) {
        var d = Math.sqrt,
            g = Math.atan2,
            o = Math.pow,
            a = Math.abs,
            c = Math.PI / 180,
            i = Math.PI / 2;
        fabric.util = {
            cos: function(t) {
                if (0 === t) return 1;
                switch (t < 0 && (t = -t), t / i) {
                    case 1:
                    case 3:
                        return 0;
                    case 2:
                        return -1
                }
                return Math.cos(t)
            },
            sin: function(t) {
                if (0 === t) return 0;
                var e = 1;
                switch (t < 0 && (e = -1), t / i) {
                    case 1:
                        return e;
                    case 2:
                        return 0;
                    case 3:
                        return -e
                }
                return Math.sin(t)
            },
            removeFromArray: function(t, e) { var i = t.indexOf(e); return -1 !== i && t.splice(i, 1), t },
            getRandomInt: function(t, e) { return Math.floor(Math.random() * (e - t + 1)) + t },
            degreesToRadians: function(t) { return t * c },
            radiansToDegrees: function(t) { return t / c },
            rotatePoint: function(t, e, i) { t.subtractEquals(e); var r = fabric.util.rotateVector(t, i); return new fabric.Point(r.x, r.y).addEquals(e) },
            rotateVector: function(t, e) {
                var i = fabric.util.sin(e),
                    r = fabric.util.cos(e);
                return { x: t.x * r - t.y * i, y: t.x * i + t.y * r }
            },
            transformPoint: function(t, e, i) { return i ? new fabric.Point(e[0] * t.x + e[2] * t.y, e[1] * t.x + e[3] * t.y) : new fabric.Point(e[0] * t.x + e[2] * t.y + e[4], e[1] * t.x + e[3] * t.y + e[5]) },
            makeBoundingBoxFromPoints: function(t) {
                var e = [t[0].x, t[1].x, t[2].x, t[3].x],
                    i = fabric.util.array.min(e),
                    r = fabric.util.array.max(e) - i,
                    n = [t[0].y, t[1].y, t[2].y, t[3].y],
                    s = fabric.util.array.min(n);
                return { left: i, top: s, width: r, height: fabric.util.array.max(n) - s }
            },
            invertTransform: function(t) {
                var e = 1 / (t[0] * t[3] - t[1] * t[2]),
                    i = [e * t[3], -e * t[1], -e * t[2], e * t[0]],
                    r = fabric.util.transformPoint({ x: t[4], y: t[5] }, i, !0);
                return i[4] = -r.x, i[5] = -r.y, i
            },
            toFixed: function(t, e) { return parseFloat(Number(t).toFixed(e)) },
            parseUnit: function(t, e) {
                var i = /\D{0,2}$/.exec(t),
                    r = parseFloat(t);
                switch (e || (e = fabric.Text.DEFAULT_SVG_FONT_SIZE), i[0]) {
                    case "mm":
                        return r * fabric.DPI / 25.4;
                    case "cm":
                        return r * fabric.DPI / 2.54;
                    case "in":
                        return r * fabric.DPI;
                    case "pt":
                        return r * fabric.DPI / 72;
                    case "pc":
                        return r * fabric.DPI / 72 * 12;
                    case "em":
                        return r * e;
                    default:
                        return r
                }
            },
            falseFunction: function() { return !1 },
            getKlass: function(t, e) { return t = fabric.util.string.camelize(t.charAt(0).toUpperCase() + t.slice(1)), fabric.util.resolveNamespace(e)[t] },
            getSvgAttributes: function(t) {
                var e = ["instantiated_by_use", "style", "id", "class"];
                switch (t) {
                    case "linearGradient":
                        e = e.concat(["x1", "y1", "x2", "y2", "gradientUnits", "gradientTransform"]);
                        break;
                    case "radialGradient":
                        e = e.concat(["gradientUnits", "gradientTransform", "cx", "cy", "r", "fx", "fy", "fr"]);
                        break;
                    case "stop":
                        e = e.concat(["offset", "stop-color", "stop-opacity"])
                }
                return e
            },
            resolveNamespace: function(t) {
                if (!t) return fabric;
                var e, i = t.split("."),
                    r = i.length,
                    n = s || fabric.window;
                for (e = 0; e < r; ++e) n = n[i[e]];
                return n
            },
            loadImage: function(t, e, i, r) {
                if (t) {
                    var n = fabric.util.createImage(),
                        s = function() { e && e.call(i, n), n = n.onload = n.onerror = null };
                    n.onload = s, n.onerror = function() { fabric.log("Error loading " + n.src), e && e.call(i, null, !0), n = n.onload = n.onerror = null }, 0 !== t.indexOf("data") && r && (n.crossOrigin = r), "data:image/svg" === t.substring(0, 14) && (n.onload = null, fabric.util.loadImageInDom(n, s)), n.src = t
                } else e && e.call(i, t)
            },
            loadImageInDom: function(t, e) {
                var i = fabric.document.createElement("div");
                i.style.width = i.style.height = "1px", i.style.left = i.style.top = "-100%", i.style.position = "absolute", i.appendChild(t), fabric.document.querySelector("body").appendChild(i), t.onload = function() { e(), i.parentNode.removeChild(i), i = null }
            },
            enlivenObjects: function(t, e, n, s) {
                function o() {++i === r && e && e(a) }
                var a = [],
                    i = 0,
                    r = (t = t || []).length;
                r ? t.forEach(function(i, r) { i && i.type ? fabric.util.getKlass(i.type, n).fromObject(i, function(t, e) { e || (a[r] = t), s && s(i, t, e), o() }) : o() }) : e && e(a)
            },
            enlivenPatterns: function(t, e) {
                function i() {++n === s && e && e(r) }
                var r = [],
                    n = 0,
                    s = (t = t || []).length;
                s ? t.forEach(function(t, e) { t && t.source ? new fabric.Pattern(t, function(t) { r[e] = t, i() }) : (r[e] = t, i()) }) : e && e(r)
            },
            groupSVGElements: function(t, e, i) { var r; return t && 1 === t.length ? t[0] : (e && (e.width && e.height ? e.centerPoint = { x: e.width / 2, y: e.height / 2 } : (delete e.width, delete e.height)), r = new fabric.Group(t, e), void 0 !== i && (r.sourcePath = i), r) },
            populateWithProperties: function(t, e, i) {
                if (i && "[object Array]" === Object.prototype.toString.call(i))
                    for (var r = 0, n = i.length; r < n; r++) i[r] in t && (e[i[r]] = t[i[r]])
            },
            drawDashedLine: function(t, e, i, r, n, s) {
                var o = r - e,
                    a = n - i,
                    c = d(o * o + a * a),
                    h = g(a, o),
                    l = s.length,
                    u = 0,
                    f = !0;
                for (t.save(), t.translate(e, i), t.moveTo(0, 0), t.rotate(h), e = 0; e < c;) c < (e += s[u++ % l]) && (e = c), t[f ? "lineTo" : "moveTo"](e, 0), f = !f;
                t.restore()
            },
            createCanvasElement: function() { return fabric.document.createElement("canvas") },
            copyCanvasElement: function(t) { var e = fabric.document.createElement("canvas"); return e.width = t.width, e.height = t.height, e.getContext("2d").drawImage(t, 0, 0), e },
            createImage: function() { return fabric.document.createElement("img") },
            clipContext: function(t, e) { e.save(), e.beginPath(), t.clipTo(e), e.clip() },
            multiplyTransformMatrices: function(t, e, i) { return [t[0] * e[0] + t[2] * e[1], t[1] * e[0] + t[3] * e[1], t[0] * e[2] + t[2] * e[3], t[1] * e[2] + t[3] * e[3], i ? 0 : t[0] * e[4] + t[2] * e[5] + t[4], i ? 0 : t[1] * e[4] + t[3] * e[5] + t[5]] },
            qrDecompose: function(t) {
                var e = g(t[1], t[0]),
                    i = o(t[0], 2) + o(t[1], 2),
                    r = d(i),
                    n = (t[0] * t[3] - t[2] * t[1]) / r,
                    s = g(t[0] * t[2] + t[1] * t[3], i);
                return { angle: e / c, scaleX: r, scaleY: n, skewX: s / c, skewY: 0, translateX: t[4], translateY: t[5] }
            },
            customTransformMatrix: function(t, e, i) {
                var r = [1, 0, a(Math.tan(i * c)), 1],
                    n = [a(t), 0, 0, a(e)];
                return fabric.util.multiplyTransformMatrices(n, r, !0)
            },
            resetObjectTransform: function(t) { t.scaleX = 1, t.scaleY = 1, t.skewX = 0, t.skewY = 0, t.flipX = !1, t.flipY = !1, t.rotate(0) },
            saveObjectTransform: function(t) { return { scaleX: t.scaleX, scaleY: t.scaleY, skewX: t.skewX, skewY: t.skewY, angle: t.angle, left: t.left, flipX: t.flipX, flipY: t.flipY, top: t.top } },
            getFunctionBody: function(t) { return (String(t).match(/function[^{]*\{([\s\S]*)\}/) || {})[1] },
            isTransparent: function(t, e, i, r) {
                0 < r && (r < e ? e -= r : e = 0, r < i ? i -= r : i = 0);
                var n, s = !0,
                    o = t.getImageData(e, i, 2 * r || 1, 2 * r || 1),
                    a = o.data.length;
                for (n = 3; n < a && !1 !== (s = o.data[n] <= 0); n += 4);
                return o = null, s
            },
            parsePreserveAspectRatioAttribute: function(t) {
                var e, i = "meet",
                    r = t.split(" ");
                return r && r.length && ("meet" !== (i = r.pop()) && "slice" !== i ? (e = i, i = "meet") : r.length && (e = r.pop())), { meetOrSlice: i, alignX: "none" !== e ? e.slice(1, 4) : "none", alignY: "none" !== e ? e.slice(5, 8) : "none" }
            },
            clearFabricFontCache: function(t) {
                (t = (t || "").toLowerCase()) ? fabric.charWidthsCache[t] && delete fabric.charWidthsCache[t]: fabric.charWidthsCache = {}
            },
            limitDimsByArea: function(t, e) {
                var i = Math.sqrt(e * t),
                    r = Math.floor(e / i);
                return { x: Math.floor(i), y: r }
            },
            capValue: function(t, e, i) { return Math.max(t, Math.min(e, i)) },
            findScaleToFit: function(t, e) { return Math.min(e.width / t.width, e.height / t.height) },
            findScaleToCover: function(t, e) { return Math.max(e.width / t.width, e.height / t.height) }
        }
    }("undefined" != typeof exports ? exports : this),
    function() {
        var Q = Array.prototype.join;

        function v(t, e, i, r, n, s, o) {
            var a = Q.call(arguments);
            if (fabric.arcToSegmentsCache[a]) return fabric.arcToSegmentsCache[a];
            var c = Math.PI,
                h = o * c / 180,
                l = fabric.util.sin(h),
                u = fabric.util.cos(h),
                f = 0,
                d = 0,
                g = -u * t * .5 - l * e * .5,
                p = -u * e * .5 + l * t * .5,
                v = (i = Math.abs(i)) * i,
                m = (r = Math.abs(r)) * r,
                b = p * p,
                _ = g * g,
                y = v * m - v * b - m * _,
                x = 0;
            if (y < 0) {
                var C = Math.sqrt(1 - y / (v * m));
                i *= C, r *= C
            } else x = (n === s ? -1 : 1) * Math.sqrt(y / (v * b + m * _));
            var S = x * i * p / r,
                T = -x * r * g / i,
                w = u * S - l * T + .5 * t,
                O = l * S + u * T + .5 * e,
                k = Z(1, 0, (g - S) / i, (p - T) / r),
                D = Z((g - S) / i, (p - T) / r, (-g - S) / i, (-p - T) / r);
            0 === s && 0 < D ? D -= 2 * c : 1 === s && D < 0 && (D += 2 * c);
            for (var E, P, j, A, M, F, I, L, R, B, X, Y, W, U, z, N, G, V = Math.ceil(Math.abs(D / c * 2)), H = [], q = D / V, K = 8 / 3 * Math.sin(q / 4) * Math.sin(q / 4) / Math.sin(q / 2), J = k + q, $ = 0; $ < V; $++) H[$] = (E = k, P = J, j = u, A = l, M = i, F = r, I = w, L = O, R = K, B = f, X = d, void 0, Y = fabric.util.cos(E), W = fabric.util.sin(E), U = fabric.util.cos(P), z = fabric.util.sin(P), [B + R * (-j * M * W - A * F * Y), X + R * (-A * M * W + j * F * Y), (N = j * M * U - A * F * z + I) + R * (j * M * z + A * F * U), (G = A * M * U + j * F * z + L) + R * (A * M * z - j * F * U), N, G]), f = H[$][4], d = H[$][5], k = J, J += q;
            return fabric.arcToSegmentsCache[a] = H
        }

        function Z(t, e, i, r) {
            var n = Math.atan2(e, t),
                s = Math.atan2(r, i);
            return n <= s ? s - n : 2 * Math.PI - (n - s)
        }

        function m(t, e, i, r, n, s, o, a) {
            var c;
            if (fabric.cachesBoundsOfCurve && (c = Q.call(arguments), fabric.boundsOfCurveCache[c])) return fabric.boundsOfCurveCache[c];
            var h, l, u, f, d, g, p, v, m = Math.sqrt,
                b = Math.min,
                _ = Math.max,
                y = Math.abs,
                x = [],
                C = [
                    [],
                    []
                ];
            l = 6 * t - 12 * i + 6 * n, h = -3 * t + 9 * i - 9 * n + 3 * o, u = 3 * i - 3 * t;
            for (var S = 0; S < 2; ++S)
                if (0 < S && (l = 6 * e - 12 * r + 6 * s, h = -3 * e + 9 * r - 9 * s + 3 * a, u = 3 * r - 3 * e), y(h) < 1e-12) {
                    if (y(l) < 1e-12) continue;
                    0 < (f = -u / l) && f < 1 && x.push(f)
                } else(p = l * l - 4 * u * h) < 0 || (0 < (d = (-l + (v = m(p))) / (2 * h)) && d < 1 && x.push(d), 0 < (g = (-l - v) / (2 * h)) && g < 1 && x.push(g));
            for (var T, w, O, k = x.length, D = k; k--;) T = (O = 1 - (f = x[k])) * O * O * t + 3 * O * O * f * i + 3 * O * f * f * n + f * f * f * o, C[0][k] = T, w = O * O * O * e + 3 * O * O * f * r + 3 * O * f * f * s + f * f * f * a, C[1][k] = w;
            C[0][D] = t, C[1][D] = e, C[0][D + 1] = o, C[1][D + 1] = a;
            var E = [{ x: b.apply(null, C[0]), y: b.apply(null, C[1]) }, { x: _.apply(null, C[0]), y: _.apply(null, C[1]) }];
            return fabric.cachesBoundsOfCurve && (fabric.boundsOfCurveCache[c] = E), E
        }
        fabric.util.drawArc = function(t, e, i, r) {
            for (var n = r[0], s = r[1], o = r[2], a = r[3], c = r[4], h = [
                    [],
                    [],
                    [],
                    []
                ], l = v(r[5] - e, r[6] - i, n, s, a, c, o), u = 0, f = l.length; u < f; u++) h[u][0] = l[u][0] + e, h[u][1] = l[u][1] + i, h[u][2] = l[u][2] + e, h[u][3] = l[u][3] + i, h[u][4] = l[u][4] + e, h[u][5] = l[u][5] + i, t.bezierCurveTo.apply(t, h[u])
        }, fabric.util.getBoundsOfArc = function(t, e, i, r, n, s, o, a, c) { for (var h, l = 0, u = 0, f = [], d = v(a - t, c - e, i, r, s, o, n), g = 0, p = d.length; g < p; g++) h = m(l, u, d[g][0], d[g][1], d[g][2], d[g][3], d[g][4], d[g][5]), f.push({ x: h[0].x + t, y: h[0].y + e }), f.push({ x: h[1].x + t, y: h[1].y + e }), l = d[g][4], u = d[g][5]; return f }, fabric.util.getBoundsOfCurve = m
    }(),
    function() {
        var o = Array.prototype.slice;

        function i(t, e, i) {
            if (t && 0 !== t.length) {
                var r = t.length - 1,
                    n = e ? t[r][e] : t[r];
                if (e)
                    for (; r--;) i(t[r][e], n) && (n = t[r][e]);
                else
                    for (; r--;) i(t[r], n) && (n = t[r]);
                return n
            }
        }
        fabric.util.array = { fill: function(t, e) { for (var i = t.length; i--;) t[i] = e; return t }, invoke: function(t, e) { for (var i = o.call(arguments, 2), r = [], n = 0, s = t.length; n < s; n++) r[n] = i.length ? t[n][e].apply(t[n], i) : t[n][e].call(t[n]); return r }, min: function(t, e) { return i(t, e, function(t, e) { return t < e }) }, max: function(t, e) { return i(t, e, function(t, e) { return e <= t }) } }
    }(),
    function() {
        function o(t, e, i) {
            if (i)
                if (!fabric.isLikelyNode && e instanceof Element) t = e;
                else if (e instanceof Array) { t = []; for (var r = 0, n = e.length; r < n; r++) t[r] = o({}, e[r], i) } else if (e && "object" == typeof e)
                for (var s in e) e.hasOwnProperty(s) && (t[s] = o({}, e[s], i));
            else t = e;
            else
                for (var s in e) t[s] = e[s];
            return t
        }
        fabric.util.object = { extend: o, clone: function(t, e) { return o({}, t, e) } }, fabric.util.object.extend(fabric.util, fabric.Observable)
    }(),
    function() {
        function n(t, e) { var i = t.charCodeAt(e); if (isNaN(i)) return ""; if (i < 55296 || 57343 < i) return t.charAt(e); if (55296 <= i && i <= 56319) { if (t.length <= e + 1) throw "High surrogate without following low surrogate"; var r = t.charCodeAt(e + 1); if (r < 56320 || 57343 < r) throw "High surrogate without following low surrogate"; return t.charAt(e) + t.charAt(e + 1) } if (0 === e) throw "Low surrogate without preceding high surrogate"; var n = t.charCodeAt(e - 1); if (n < 55296 || 56319 < n) throw "Low surrogate without preceding high surrogate"; return !1 }
        fabric.util.string = {
            camelize: function(t) { return t.replace(/-+(.)?/g, function(t, e) { return e ? e.toUpperCase() : "" }) },
            capitalize: function(t, e) { return t.charAt(0).toUpperCase() + (e ? t.slice(1) : t.slice(1).toLowerCase()) },
            escapeXml: function(t) { return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;") },
            graphemeSplit: function(t) {
                var e, i = 0,
                    r = [];
                for (i = 0; i < t.length; i++) !1 !== (e = n(t, i)) && r.push(e);
                return r
            }
        }
    }(),
    function() {
        var s = Array.prototype.slice,
            o = function() {},
            i = function() {
                for (var t in { toString: 1 })
                    if ("toString" === t) return !1;
                return !0
            }(),
            a = function(t, r, n) {
                for (var e in r) e in t.prototype && "function" == typeof t.prototype[e] && -1 < (r[e] + "").indexOf("callSuper") ? t.prototype[e] = function(i) {
                    return function() {
                        var t = this.constructor.superclass;
                        this.constructor.superclass = n;
                        var e = r[i].apply(this, arguments);
                        if (this.constructor.superclass = t, "initialize" !== i) return e
                    }
                }(e) : t.prototype[e] = r[e], i && (r.toString !== Object.prototype.toString && (t.prototype.toString = r.toString), r.valueOf !== Object.prototype.valueOf && (t.prototype.valueOf = r.valueOf))
            };

        function c() {}

        function h(t) {
            for (var e = null, i = this; i.constructor.superclass;) {
                var r = i.constructor.superclass.prototype[t];
                if (i[t] !== r) { e = r; break }
                i = i.constructor.superclass.prototype
            }
            return e ? 1 < arguments.length ? e.apply(this, s.call(arguments, 1)) : e.call(this) : console.log("tried to callSuper " + t + ", method not found in prototype chain", this)
        }
        fabric.util.createClass = function() {
            var t = null,
                e = s.call(arguments, 0);

            function i() { this.initialize.apply(this, arguments) }
            "function" == typeof e[0] && (t = e.shift()), i.superclass = t, i.subclasses = [], t && (c.prototype = t.prototype, i.prototype = new c, t.subclasses.push(i));
            for (var r = 0, n = e.length; r < n; r++) a(i, e[r], t);
            return i.prototype.initialize || (i.prototype.initialize = o), (i.prototype.constructor = i).prototype.callSuper = h, i
        }
    }(),
    function() {
        function t(t) {
            var e, i, r = Array.prototype.slice.call(arguments, 1),
                n = r.length;
            for (i = 0; i < n; i++)
                if (e = typeof t[r[i]], !/^(?:function|object|unknown)$/.test(e)) return !1;
            return !0
        }
        var n, s, e, i, a = (e = 0, function(t) { return t.__uniqueID || (t.__uniqueID = "uniqueID__" + e++) });

        function o(t, e) { return { handler: e, wrappedHandler: (i = t, r = e, function(t) { r.call(n(i), t || fabric.window.event) }) }; var i, r }
        i = {}, n = function(t) { return i[t] }, s = function(t, e) { i[t] = e };
        var r, c, h = t(fabric.document.documentElement, "addEventListener", "removeEventListener") && t(fabric.window, "addEventListener", "removeEventListener"),
            l = t(fabric.document.documentElement, "attachEvent", "detachEvent") && t(fabric.window, "attachEvent", "detachEvent"),
            u = {},
            f = {};
        h ? (r = function(t, e, i, r) { t && t.addEventListener(e, i, !l && r) }, c = function(t, e, i, r) { t && t.removeEventListener(e, i, !l && r) }) : l ? (r = function(t, e, i) {
            if (t) {
                var r = a(t);
                s(r, t), u[r] || (u[r] = {}), u[r][e] || (u[r][e] = []);
                var n = o(r, i);
                u[r][e].push(n), t.attachEvent("on" + e, n.wrappedHandler)
            }
        }, c = function(t, e, i) {
            if (t) {
                var r, n = a(t);
                if (u[n] && u[n][e])
                    for (var s = 0, o = u[n][e].length; s < o; s++)(r = u[n][e][s]) && r.handler === i && (t.detachEvent("on" + e, r.wrappedHandler), u[n][e][s] = null)
            }
        }) : (r = function(t, e, i) {
            if (t) {
                var n, s, r = a(t);
                if (f[r] || (f[r] = {}), !f[r][e]) {
                    f[r][e] = [];
                    var o = t["on" + e];
                    o && f[r][e].push(o), t["on" + e] = (n = r, s = e, function(t) {
                        if (f[n] && f[n][s])
                            for (var e = f[n][s], i = 0, r = e.length; i < r; i++) e[i].call(this, t || fabric.window.event)
                    })
                }
                f[r][e].push(i)
            }
        }, c = function(t, e, i) {
            if (t) {
                var r = a(t);
                if (f[r] && f[r][e])
                    for (var n = f[r][e], s = 0, o = n.length; s < o; s++) n[s] === i && n.splice(s, 1)
            }
        }), fabric.util.addListener = r, fabric.util.removeListener = c;
        var d = function(t) { return t.clientX },
            g = function(t) { return t.clientY };

        function p(t, e, i) { var r, n = t["touchend" === t.type ? "changedTouches" : "touches"]; return n && n[0] && (r = n[0][i]), void 0 === r && (r = t[i]), r }
        fabric.isTouchSupported && (d = function(t) { return p(t, 0, "clientX") }, g = function(t) { return p(t, 0, "clientY") }), fabric.util.getPointer = function(t) {
            t || (t = fabric.window.event);
            var e = t.target || ("unknown" != typeof t.srcElement ? t.srcElement : null),
                i = fabric.util.getScrollLeftTop(e);
            return { x: d(t) + i.left, y: g(t) + i.top }
        }
    }(),
    function() {
        var t = fabric.document.createElement("div"),
            e = "string" == typeof t.style.opacity,
            i = "string" == typeof t.style.filter,
            r = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
            n = function(t) { return t };
        e ? n = function(t, e) { return t.style.opacity = e, t } : i && (n = function(t, e) { var i = t.style; return t.currentStyle && !t.currentStyle.hasLayout && (i.zoom = 1), r.test(i.filter) ? (e = .9999 <= e ? "" : "alpha(opacity=" + 100 * e + ")", i.filter = i.filter.replace(r, e)) : i.filter += " alpha(opacity=" + 100 * e + ")", t }), fabric.util.setStyle = function(t, e) { var i = t.style; if (!i) return t; if ("string" == typeof e) return t.style.cssText += ";" + e, -1 < e.indexOf("opacity") ? n(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1]) : t; for (var r in e) "opacity" === r ? n(t, e[r]) : i["float" === r || "cssFloat" === r ? void 0 === i.styleFloat ? "cssFloat" : "styleFloat" : r] = e[r]; return t }
    }(),
    function() {
        var e = Array.prototype.slice;
        var t, c, i, r, n = function(t) { return e.call(t, 0) };
        try { t = n(fabric.document.childNodes) instanceof Array } catch (t) {}

        function s(t, e) { var i = fabric.document.createElement(t); for (var r in e) "class" === r ? i.className = e[r] : "for" === r ? i.htmlFor = e[r] : i.setAttribute(r, e[r]); return i }

        function h(t) { for (var e = 0, i = 0, r = fabric.document.documentElement, n = fabric.document.body || { scrollLeft: 0, scrollTop: 0 }; t && (t.parentNode || t.host) && ((t = t.parentNode || t.host) === fabric.document ? (e = n.scrollLeft || r.scrollLeft || 0, i = n.scrollTop || r.scrollTop || 0) : (e += t.scrollLeft || 0, i += t.scrollTop || 0), 1 !== t.nodeType || "fixed" !== t.style.position);); return { left: e, top: i } }
        t || (n = function(t) { for (var e = new Array(t.length), i = t.length; i--;) e[i] = t[i]; return e }), c = fabric.document.defaultView && fabric.document.defaultView.getComputedStyle ? function(t, e) { var i = fabric.document.defaultView.getComputedStyle(t, null); return i ? i[e] : void 0 } : function(t, e) { var i = t.style[e]; return !i && t.currentStyle && (i = t.currentStyle[e]), i }, i = fabric.document.documentElement.style, r = "userSelect" in i ? "userSelect" : "MozUserSelect" in i ? "MozUserSelect" : "WebkitUserSelect" in i ? "WebkitUserSelect" : "KhtmlUserSelect" in i ? "KhtmlUserSelect" : "", fabric.util.makeElementUnselectable = function(t) { return void 0 !== t.onselectstart && (t.onselectstart = fabric.util.falseFunction), r ? t.style[r] = "none" : "string" == typeof t.unselectable && (t.unselectable = "on"), t }, fabric.util.makeElementSelectable = function(t) { return void 0 !== t.onselectstart && (t.onselectstart = null), r ? t.style[r] = "" : "string" == typeof t.unselectable && (t.unselectable = ""), t }, fabric.util.getScript = function(t, e) {
            var i = fabric.document.getElementsByTagName("head")[0],
                r = fabric.document.createElement("script"),
                n = !0;
            r.onload = r.onreadystatechange = function(t) {
                if (n) {
                    if ("string" == typeof this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState) return;
                    n = !1, e(t || fabric.window.event), r = r.onload = r.onreadystatechange = null
                }
            }, r.src = t, i.appendChild(r)
        }, fabric.util.getById = function(t) { return "string" == typeof t ? fabric.document.getElementById(t) : t }, fabric.util.toArray = n, fabric.util.makeElement = s, fabric.util.addClass = function(t, e) { t && -1 === (" " + t.className + " ").indexOf(" " + e + " ") && (t.className += (t.className ? " " : "") + e) }, fabric.util.wrapElement = function(t, e, i) { return "string" == typeof e && (e = s(e, i)), t.parentNode && t.parentNode.replaceChild(e, t), e.appendChild(t), e }, fabric.util.getScrollLeftTop = h, fabric.util.getElementOffset = function(t) {
            var e, i, r = t && t.ownerDocument,
                n = { left: 0, top: 0 },
                s = { left: 0, top: 0 },
                o = { borderLeftWidth: "left", borderTopWidth: "top", paddingLeft: "left", paddingTop: "top" };
            if (!r) return s;
            for (var a in o) s[o[a]] += parseInt(c(t, a), 10) || 0;
            return e = r.documentElement, void 0 !== t.getBoundingClientRect && (n = t.getBoundingClientRect()), i = h(t), { left: n.left + i.left - (e.clientLeft || 0) + s.left, top: n.top + i.top - (e.clientTop || 0) + s.top }
        }, fabric.util.getElementStyle = c, fabric.util.getNodeCanvas = function(t) { var e = fabric.jsdomImplForWrapper(t); return e._canvas || e._image }, fabric.util.cleanUpJsdomNode = function(t) {
            if (fabric.isLikelyNode) {
                var e = fabric.jsdomImplForWrapper(t);
                e && (e._image = null, e._canvas = null, e._currentSrc = null, e._attributes = null, e._classList = null)
            }
        }
    }(),
    function() {
        function c() {}
        fabric.util.request = function(t, e) {
            e || (e = {});
            var i, r, n = e.method ? e.method.toUpperCase() : "GET",
                s = e.onComplete || function() {},
                o = new fabric.window.XMLHttpRequest,
                a = e.body || e.parameters;
            return o.onreadystatechange = function() { 4 === o.readyState && (s(o), o.onreadystatechange = c) }, "GET" === n && (a = null, "string" == typeof e.parameters && (i = t, r = e.parameters, t = i + (/\?/.test(i) ? "&" : "?") + r)), o.open(n, t, !0), "POST" !== n && "PUT" !== n || o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), o.send(a), o
        }
    }(), fabric.log = function() {}, fabric.warn = function() {}, "undefined" != typeof console && ["log", "warn"].forEach(function(t) { void 0 !== console[t] && "function" == typeof console[t].apply && (fabric[t] = function() { return console[t].apply(console, arguments) }) }),
    function() {
        function e() { return !1 }
        var t = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function(t) { return fabric.window.setTimeout(t, 1e3 / 60) },
            i = fabric.window.cancelAnimationFrame || fabric.window.clearTimeout;

        function b() { return t.apply(fabric.window, arguments) }
        fabric.util.animate = function(m) {
            b(function(t) {
                m || (m = {});
                var o, a = t || +new Date,
                    c = m.duration || 500,
                    h = a + c,
                    l = m.onChange || e,
                    u = m.abort || e,
                    f = m.onComplete || e,
                    d = m.easing || function(t, e, i, r) { return -i * Math.cos(t / r * (Math.PI / 2)) + i + e },
                    g = "startValue" in m ? m.startValue : 0,
                    p = "endValue" in m ? m.endValue : 100,
                    v = m.byValue || p - g;
                m.onStart && m.onStart(),
                    function t(e) {
                        if (u()) f(p, 1, 1);
                        else {
                            o = e || +new Date;
                            var i = h < o ? c : o - a,
                                r = i / c,
                                n = d(i, g, v, c),
                                s = Math.abs((n - g) / v);
                            l(n, s, r), h < o ? m.onComplete && m.onComplete() : b(t)
                        }
                    }(a)
            })
        }, fabric.util.requestAnimFrame = b, fabric.util.cancelAnimFrame = function() { return i.apply(fabric.window, arguments) }
    }(), fabric.util.animateColor = function(t, e, i, h) {
        var r = new fabric.Color(t).getSource(),
            n = new fabric.Color(e).getSource();
        h = h || {}, fabric.util.animate(fabric.util.object.extend(h, { duration: i || 500, startValue: r, endValue: n, byValue: n, easing: function(t, e, i, r) { var n, s, o, a, c = h.colorEasing ? h.colorEasing(t, r) : 1 - Math.cos(t / r * (Math.PI / 2)); return n = e, s = i, o = c, a = "rgba(" + parseInt(n[0] + o * (s[0] - n[0]), 10) + "," + parseInt(n[1] + o * (s[1] - n[1]), 10) + "," + parseInt(n[2] + o * (s[2] - n[2]), 10), a += "," + (n && s ? parseFloat(n[3] + o * (s[3] - n[3])) : 1), a += ")" } }))
    },
    function() {
        function o(t, e, i, r) { return t < Math.abs(e) ? (t = e, r = i / 4) : r = 0 === e && 0 === t ? i / (2 * Math.PI) * Math.asin(1) : i / (2 * Math.PI) * Math.asin(e / t), { a: t, c: e, p: i, s: r } }

        function a(t, e, i) { return t.a * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * i - t.s) * (2 * Math.PI) / t.p) }

        function n(t, e, i, r) { return i - s(r - t, 0, i, r) + e }

        function s(t, e, i, r) { return (t /= r) < 1 / 2.75 ? i * (7.5625 * t * t) + e : t < 2 / 2.75 ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : t < 2.5 / 2.75 ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e }
        fabric.util.ease = {
            easeInQuad: function(t, e, i, r) { return i * (t /= r) * t + e },
            easeOutQuad: function(t, e, i, r) { return -i * (t /= r) * (t - 2) + e },
            easeInOutQuad: function(t, e, i, r) { return (t /= r / 2) < 1 ? i / 2 * t * t + e : -i / 2 * (--t * (t - 2) - 1) + e },
            easeInCubic: function(t, e, i, r) { return i * (t /= r) * t * t + e },
            easeOutCubic: function(t, e, i, r) { return i * ((t = t / r - 1) * t * t + 1) + e },
            easeInOutCubic: function(t, e, i, r) { return (t /= r / 2) < 1 ? i / 2 * t * t * t + e : i / 2 * ((t -= 2) * t * t + 2) + e },
            easeInQuart: function(t, e, i, r) { return i * (t /= r) * t * t * t + e },
            easeOutQuart: function(t, e, i, r) { return -i * ((t = t / r - 1) * t * t * t - 1) + e },
            easeInOutQuart: function(t, e, i, r) { return (t /= r / 2) < 1 ? i / 2 * t * t * t * t + e : -i / 2 * ((t -= 2) * t * t * t - 2) + e },
            easeInQuint: function(t, e, i, r) { return i * (t /= r) * t * t * t * t + e },
            easeOutQuint: function(t, e, i, r) { return i * ((t = t / r - 1) * t * t * t * t + 1) + e },
            easeInOutQuint: function(t, e, i, r) { return (t /= r / 2) < 1 ? i / 2 * t * t * t * t * t + e : i / 2 * ((t -= 2) * t * t * t * t + 2) + e },
            easeInSine: function(t, e, i, r) { return -i * Math.cos(t / r * (Math.PI / 2)) + i + e },
            easeOutSine: function(t, e, i, r) { return i * Math.sin(t / r * (Math.PI / 2)) + e },
            easeInOutSine: function(t, e, i, r) { return -i / 2 * (Math.cos(Math.PI * t / r) - 1) + e },
            easeInExpo: function(t, e, i, r) { return 0 === t ? e : i * Math.pow(2, 10 * (t / r - 1)) + e },
            easeOutExpo: function(t, e, i, r) { return t === r ? e + i : i * (1 - Math.pow(2, -10 * t / r)) + e },
            easeInOutExpo: function(t, e, i, r) { return 0 === t ? e : t === r ? e + i : (t /= r / 2) < 1 ? i / 2 * Math.pow(2, 10 * (t - 1)) + e : i / 2 * (2 - Math.pow(2, -10 * --t)) + e },
            easeInCirc: function(t, e, i, r) { return -i * (Math.sqrt(1 - (t /= r) * t) - 1) + e },
            easeOutCirc: function(t, e, i, r) { return i * Math.sqrt(1 - (t = t / r - 1) * t) + e },
            easeInOutCirc: function(t, e, i, r) { return (t /= r / 2) < 1 ? -i / 2 * (Math.sqrt(1 - t * t) - 1) + e : i / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + e },
            easeInElastic: function(t, e, i, r) { var n = 0; return 0 === t ? e : 1 == (t /= r) ? e + i : (n || (n = .3 * r), -a(o(i, i, n, 1.70158), t, r) + e) },
            easeOutElastic: function(t, e, i, r) {
                var n = 0;
                if (0 === t) return e;
                if (1 == (t /= r)) return e + i;
                n || (n = .3 * r);
                var s = o(i, i, n, 1.70158);
                return s.a * Math.pow(2, -10 * t) * Math.sin((t * r - s.s) * (2 * Math.PI) / s.p) + s.c + e
            },
            easeInOutElastic: function(t, e, i, r) {
                var n = 0;
                if (0 === t) return e;
                if (2 == (t /= r / 2)) return e + i;
                n || (n = r * (.3 * 1.5));
                var s = o(i, i, n, 1.70158);
                return t < 1 ? -.5 * a(s, t, r) + e : s.a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * r - s.s) * (2 * Math.PI) / s.p) * .5 + s.c + e
            },
            easeInBack: function(t, e, i, r, n) { return void 0 === n && (n = 1.70158), i * (t /= r) * t * ((n + 1) * t - n) + e },
            easeOutBack: function(t, e, i, r, n) { return void 0 === n && (n = 1.70158), i * ((t = t / r - 1) * t * ((n + 1) * t + n) + 1) + e },
            easeInOutBack: function(t, e, i, r, n) { return void 0 === n && (n = 1.70158), (t /= r / 2) < 1 ? i / 2 * (t * t * ((1 + (n *= 1.525)) * t - n)) + e : i / 2 * ((t -= 2) * t * ((1 + (n *= 1.525)) * t + n) + 2) + e },
            easeInBounce: n,
            easeOutBounce: s,
            easeInOutBounce: function(t, e, i, r) { return t < r / 2 ? .5 * n(2 * t, 0, i, r) + e : .5 * s(2 * t - r, 0, i, r) + .5 * i + e }
        }
    }(),
    function(t) {
        "use strict";
        var C = t.fabric || (t.fabric = {}),
            d = C.util.object.extend,
            f = C.util.object.clone,
            g = C.util.toFixed,
            S = C.util.parseUnit,
            c = C.util.multiplyTransformMatrices,
            p = { cx: "left", x: "left", r: "radius", cy: "top", y: "top", display: "visible", visibility: "visible", transform: "transformMatrix", "fill-opacity": "fillOpacity", "fill-rule": "fillRule", "font-family": "fontFamily", "font-size": "fontSize", "font-style": "fontStyle", "font-weight": "fontWeight", "letter-spacing": "charSpacing", "paint-order": "paintFirst", "stroke-dasharray": "strokeDashArray", "stroke-linecap": "strokeLineCap", "stroke-linejoin": "strokeLineJoin", "stroke-miterlimit": "strokeMiterLimit", "stroke-opacity": "strokeOpacity", "stroke-width": "strokeWidth", "text-decoration": "textDecoration", "text-anchor": "textAnchor", opacity: "opacity", "clip-path": "clipPath", "clip-rule": "clipRule" },
            v = { stroke: "strokeOpacity", fill: "fillOpacity" };

        function m(t, e, i, r) {
            var n, s = "[object Array]" === Object.prototype.toString.call(e);
            if ("fill" !== t && "stroke" !== t || "none" !== e)
                if ("strokeDashArray" === t) e = "none" === e ? null : e.replace(/,/g, " ").split(/\s+/).map(function(t) { return parseFloat(t) });
                else if ("transformMatrix" === t) e = i && i.transformMatrix ? c(i.transformMatrix, C.parseTransformAttribute(e)) : C.parseTransformAttribute(e);
            else if ("visible" === t) e = "none" !== e && "hidden" !== e, i && !1 === i.visible && (e = !1);
            else if ("opacity" === t) e = parseFloat(e), i && void 0 !== i.opacity && (e *= i.opacity);
            else if ("textAnchor" === t) e = "start" === e ? "left" : "end" === e ? "right" : "center";
            else if ("charSpacing" === t) n = S(e, r) / r * 1e3;
            else if ("paintFirst" === t) {
                var o = e.indexOf("fill"),
                    a = e.indexOf("stroke");
                e = "fill"; - 1 < o && -1 < a && a < o ? e = "stroke" : -1 === o && -1 < a && (e = "stroke")
            } else n = s ? e.map(S) : S(e, r);
            else e = "";
            return !s && isNaN(n) ? e : n
        }

        function e(t) { return new RegExp("^(" + t.join("|") + ")\\b", "i") }

        function b(t, e) { var i, r, n, s, o = []; for (n = 0, s = e.length; n < s; n++) i = e[n], r = t.getElementsByTagName(i), o = o.concat(Array.prototype.slice.call(r)); return o }

        function _(t, e) { var i, r = !0; return (i = n(t, e.pop())) && e.length && (r = function(t, e) { var i, r = !0; for (; t.parentNode && 1 === t.parentNode.nodeType && e.length;) r && (i = e.pop()), t = t.parentNode, r = n(t, i); return 0 === e.length }(t, e)), i && r && 0 === e.length }

        function n(t, e) {
            var i, r, n = t.nodeName,
                s = t.getAttribute("class"),
                o = t.getAttribute("id");
            if (i = new RegExp("^" + n, "i"), e = e.replace(i, ""), o && e.length && (i = new RegExp("#" + o + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "")), s && e.length)
                for (r = (s = s.split(" ")).length; r--;) i = new RegExp("\\." + s[r] + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "");
            return 0 === e.length
        }

        function y(t, e) {
            var i;
            if (t.getElementById && (i = t.getElementById(e)), i) return i;
            var r, n, s, o = t.getElementsByTagName("*");
            for (n = 0, s = o.length; n < s; n++)
                if (e === (r = o[n]).getAttribute("id")) return r
        }
        C.svgValidTagNamesRegEx = e(["path", "circle", "polygon", "polyline", "ellipse", "rect", "line", "image", "text"]), C.svgViewBoxElementsRegEx = e(["symbol", "image", "marker", "pattern", "view", "svg"]), C.svgInvalidAncestorsRegEx = e(["pattern", "defs", "symbol", "metadata", "clipPath", "mask", "desc"]), C.svgValidParentsRegEx = e(["symbol", "g", "a", "svg", "clipPath", "defs"]), C.cssRules = {}, C.gradientDefs = {}, C.clipPaths = {}, C.parseTransformAttribute = function() {
            function b(t, e, i) { t[i] = Math.tan(C.util.degreesToRadians(e[0])) }
            var _ = [1, 0, 0, 1, 0, 0],
                t = C.reNum,
                e = "(?:\\s+,?\\s*|,\\s*)",
                y = "(?:" + ("(?:(matrix)\\s*\\(\\s*(" + t + ")" + e + "(" + t + ")" + e + "(" + t + ")" + e + "(" + t + ")" + e + "(" + t + ")" + e + "(" + t + ")\\s*\\))") + "|" + ("(?:(translate)\\s*\\(\\s*(" + t + ")(?:" + e + "(" + t + "))?\\s*\\))") + "|" + ("(?:(scale)\\s*\\(\\s*(" + t + ")(?:" + e + "(" + t + "))?\\s*\\))") + "|" + ("(?:(rotate)\\s*\\(\\s*(" + t + ")(?:" + e + "(" + t + ")" + e + "(" + t + "))?\\s*\\))") + "|" + ("(?:(skewX)\\s*\\(\\s*(" + t + ")\\s*\\))") + "|" + ("(?:(skewY)\\s*\\(\\s*(" + t + ")\\s*\\))") + ")",
                i = new RegExp("^\\s*(?:" + ("(?:" + y + "(?:" + e + "*" + y + ")*)") + "?)\\s*$"),
                r = new RegExp(y, "g");
            return function(t) {
                var v = _.concat(),
                    m = [];
                if (!t || t && !i.test(t)) return v;
                t.replace(r, function(t) {
                    var e, i, r, n, s, o, a, c, h, l, u, f, d = new RegExp(y).exec(t).filter(function(t) { return !!t }),
                        g = d[1],
                        p = d.slice(2).map(parseFloat);
                    switch (g) {
                        case "translate":
                            f = p, (u = v)[4] = f[0], 2 === f.length && (u[5] = f[1]);
                            break;
                        case "rotate":
                            p[0] = C.util.degreesToRadians(p[0]), s = v, o = p, a = C.util.cos(o[0]), c = C.util.sin(o[0]), l = h = 0, 3 === o.length && (h = o[1], l = o[2]), s[0] = a, s[1] = c, s[2] = -c, s[3] = a, s[4] = h - (a * h - c * l), s[5] = l - (c * h + a * l);
                            break;
                        case "scale":
                            e = v, r = (i = p)[0], n = 2 === i.length ? i[1] : i[0], e[0] = r, e[3] = n;
                            break;
                        case "skewX":
                            b(v, p, 2);
                            break;
                        case "skewY":
                            b(v, p, 1);
                            break;
                        case "matrix":
                            v = p
                    }
                    m.push(v.concat()), v = _.concat()
                });
                for (var e = m[0]; 1 < m.length;) m.shift(), e = C.util.multiplyTransformMatrices(e, m[0]);
                return e
            }
        }();
        var T = new RegExp("^\\s*(" + C.reNum + "+)\\s*,?\\s*(" + C.reNum + "+)\\s*,?\\s*(" + C.reNum + "+)\\s*,?\\s*(" + C.reNum + "+)\\s*$");

        function x(t) {
            var e, i, r, n, s, o, a = t.getAttribute("viewBox"),
                c = 1,
                h = 1,
                l = t.getAttribute("width"),
                u = t.getAttribute("height"),
                f = t.getAttribute("x") || 0,
                d = t.getAttribute("y") || 0,
                g = t.getAttribute("preserveAspectRatio") || "",
                p = !a || !C.svgViewBoxElementsRegEx.test(t.nodeName) || !(a = a.match(T)),
                v = !l || !u || "100%" === l || "100%" === u,
                m = p && v,
                b = {},
                _ = "",
                y = 0,
                x = 0;
            if (b.width = 0, b.height = 0, b.toBeParsed = m) return b;
            if (p) return b.width = S(l), b.height = S(u), b;
            if (e = -parseFloat(a[1]), i = -parseFloat(a[2]), r = parseFloat(a[3]), n = parseFloat(a[4]), v ? (b.width = r, b.height = n) : (b.width = S(l), b.height = S(u), c = b.width / r, h = b.height / n), "none" !== (g = C.util.parsePreserveAspectRatioAttribute(g)).alignX && ("meet" === g.meetOrSlice && (h = c = h < c ? h : c), "slice" === g.meetOrSlice && (h = c = h < c ? c : h), y = b.width - r * c, x = b.height - n * c, "Mid" === g.alignX && (y /= 2), "Mid" === g.alignY && (x /= 2), "Min" === g.alignX && (y = 0), "Min" === g.alignY && (x = 0)), 1 === c && 1 === h && 0 === e && 0 === i && 0 === f && 0 === d) return b;
            if ((f || d) && (_ = " translate(" + S(f) + " " + S(d) + ") "), s = _ + " matrix(" + c + " 0 0 " + h + " " + (e * c + y) + " " + (i * h + x) + ") ", b.viewboxTransform = C.parseTransformAttribute(s), "svg" === t.nodeName) {
                for (o = t.ownerDocument.createElement("g"); t.firstChild;) o.appendChild(t.firstChild);
                t.appendChild(o)
            } else s = (o = t).getAttribute("transform") + s;
            return o.setAttribute("transform", s), b
        }
        C.parseSVGDocument = function(t, i, e, r) {
            if (t) {
                ! function(t) {
                    for (var e = b(t, ["use", "svg:use"]), i = 0; e.length && i < e.length;) {
                        var r, n, s, o, a = e[i],
                            c = (a.getAttribute("xlink:href") || a.getAttribute("href")).substr(1),
                            h = a.getAttribute("x") || 0,
                            l = a.getAttribute("y") || 0,
                            u = y(t, c).cloneNode(!0),
                            f = (u.getAttribute("transform") || "") + " translate(" + h + ", " + l + ")",
                            d = e.length;
                        if (x(u), /^svg$/i.test(u.nodeName)) {
                            var g = u.ownerDocument.createElement("g");
                            for (n = 0, o = (s = u.attributes).length; n < o; n++) r = s.item(n), g.setAttribute(r.nodeName, r.nodeValue);
                            for (; u.firstChild;) g.appendChild(u.firstChild);
                            u = g
                        }
                        for (n = 0, o = (s = a.attributes).length; n < o; n++) "x" !== (r = s.item(n)).nodeName && "y" !== r.nodeName && "xlink:href" !== r.nodeName && "href" !== r.nodeName && ("transform" === r.nodeName ? f = r.nodeValue + " " + f : u.setAttribute(r.nodeName, r.nodeValue));
                        u.setAttribute("transform", f), u.setAttribute("instantiated_by_use", "1"), u.removeAttribute("id"), a.parentNode.replaceChild(u, a), e.length === d && i++
                    }
                }(t);
                var n, s, o = C.Object.__uid++,
                    a = x(t),
                    c = C.util.toArray(t.getElementsByTagName("*"));
                if (a.crossOrigin = r && r.crossOrigin, a.svgUid = o, 0 === c.length && C.isLikelyNode) {
                    var h = [];
                    for (n = 0, s = (c = t.selectNodes('//*[name(.)!="svg"]')).length; n < s; n++) h[n] = c[n];
                    c = h
                }
                var l = c.filter(function(t) {
                    return x(t), C.svgValidTagNamesRegEx.test(t.nodeName.replace("svg:", "")) && ! function(t, e) {
                        for (; t && (t = t.parentNode);)
                            if (t.nodeName && e.test(t.nodeName.replace("svg:", "")) && !t.getAttribute("instantiated_by_use")) return !0;
                        return !1
                    }(t, C.svgInvalidAncestorsRegEx)
                });
                if (!l || l && !l.length) i && i([], {});
                else {
                    var u = {};
                    c.filter(function(t) { return "clipPath" === t.nodeName.replace("svg:", "") }).forEach(function(t) {
                        var e = t.getAttribute("id");
                        u[e] = C.util.toArray(t.getElementsByTagName("*")).filter(function(t) { return C.svgValidTagNamesRegEx.test(t.nodeName.replace("svg:", "")) })
                    }), C.gradientDefs[o] = C.getGradientDefs(t), C.cssRules[o] = C.getCSSRules(t), C.clipPaths[o] = u, C.parseElements(l, function(t, e) { i && (i(t, a, e, c), delete C.gradientDefs[o], delete C.cssRules[o], delete C.clipPaths[o]) }, f(a), e, r)
                }
            }
        };
        var h = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + C.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + C.reNum + "))?\\s+(.*)");
        d(C, {
            parseFontDeclaration: function(t, e) {
                var i = t.match(h);
                if (i) {
                    var r = i[1],
                        n = i[3],
                        s = i[4],
                        o = i[5],
                        a = i[6];
                    r && (e.fontStyle = r), n && (e.fontWeight = isNaN(parseFloat(n)) ? n : parseFloat(n)), s && (e.fontSize = S(s)), a && (e.fontFamily = a), o && (e.lineHeight = "normal" === o ? 1 : o)
                }
            },
            getGradientDefs: function(t) {
                var e, i, r, n = b(t, ["linearGradient", "radialGradient", "svg:linearGradient", "svg:radialGradient"]),
                    s = 0,
                    o = {},
                    a = {};
                for (s = n.length; s--;) r = (e = n[s]).getAttribute("xlink:href"), i = e.getAttribute("id"), r && (a[i] = r.substr(1)), o[i] = e;
                for (i in a) { var c = o[a[i]].cloneNode(!0); for (e = o[i]; c.firstChild;) e.appendChild(c.firstChild) }
                return o
            },
            parseAttributes: function(i, t, e) {
                if (i) {
                    var r, n, s = {};
                    void 0 === e && (e = i.getAttribute("svgUid")), i.parentNode && C.svgValidParentsRegEx.test(i.parentNode.nodeName) && (s = C.parseAttributes(i.parentNode, t, e));
                    var o = t.reduce(function(t, e) { return (r = i.getAttribute(e)) && (t[e] = r), t }, {});
                    o = d(o, d(function(t, e) {
                        var i = {};
                        for (var r in C.cssRules[e])
                            if (_(t, r.split(" ")))
                                for (var n in C.cssRules[e][r]) i[n] = C.cssRules[e][r][n];
                        return i
                    }(i, e), C.parseStyleAttribute(i))), n = s && s.fontSize || o["font-size"] || C.Text.DEFAULT_SVG_FONT_SIZE;
                    var a, c, h, l = {};
                    for (var u in o) c = m(a = (h = u) in p ? p[h] : h, o[u], s, n), l[a] = c;
                    l && l.font && C.parseFontDeclaration(l.font, l);
                    var f = d(s, l);
                    return C.svgValidParentsRegEx.test(i.nodeName) ? f : function(t) {
                        for (var e in v)
                            if (void 0 !== t[v[e]] && "" !== t[e]) {
                                if (void 0 === t[e]) {
                                    if (!C.Object.prototype[e]) continue;
                                    t[e] = C.Object.prototype[e]
                                }
                                if (0 !== t[e].indexOf("url(")) {
                                    var i = new C.Color(t[e]);
                                    t[e] = i.setAlpha(g(i.getAlpha() * t[v[e]], 2)).toRgba()
                                }
                            }
                        return t
                    }(f)
                }
            },
            parseElements: function(t, e, i, r, n) { new C.ElementsParser(t, e, i, r, n).parse() },
            parseStyleAttribute: function(t) {
                var i, r, n, e = {},
                    s = t.getAttribute("style");
                return s && ("string" == typeof s ? (i = e, s.replace(/;\s*$/, "").split(";").forEach(function(t) {
                    var e = t.split(":");
                    r = e[0].trim().toLowerCase(), n = e[1].trim(), i[r] = n
                })) : function(t, e) { var i, r; for (var n in t) void 0 !== t[n] && (i = n.toLowerCase(), r = t[n], e[i] = r) }(s, e)), e
            },
            parsePointsAttribute: function(t) { if (!t) return null; var e, i, r = []; for (e = 0, i = (t = (t = t.replace(/,/g, " ").trim()).split(/\s+/)).length; e < i; e += 2) r.push({ x: parseFloat(t[e]), y: parseFloat(t[e + 1]) }); return r },
            getCSSRules: function(t) {
                var a, c, e = t.getElementsByTagName("style"),
                    h = {};
                for (a = 0, c = e.length; a < c; a++) {
                    var i = e[a].textContent || e[a].text;
                    "" !== (i = i.replace(/\/\*[\s\S]*?\*\//g, "")).trim() && i.match(/[^{]*\{[\s\S]*?\}/g).map(function(t) { return t.trim() }).forEach(function(t) {
                        var e = t.match(/([\s\S]*?)\s*\{([^}]*)\}/),
                            i = {},
                            r = e[2].trim().replace(/;$/, "").split(/\s*;\s*/);
                        for (a = 0, c = r.length; a < c; a++) {
                            var n = r[a].split(/\s*:\s*/),
                                s = n[0],
                                o = n[1];
                            i[s] = o
                        }(t = e[1]).split(",").forEach(function(t) { "" !== (t = t.replace(/^svg/i, "").trim()) && (h[t] ? C.util.object.extend(h[t], i) : h[t] = C.util.object.clone(i)) })
                    })
                }
                return h
            },
            loadSVGFromURL: function(t, n, i, r) {
                t = t.replace(/^\n\s*/, "").trim(), new C.util.request(t, {
                    method: "get",
                    onComplete: function(t) {
                        var e = t.responseXML;
                        e && !e.documentElement && C.window.ActiveXObject && t.responseText && ((e = new ActiveXObject("Microsoft.XMLDOM")).async = "false", e.loadXML(t.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
                        if (!e || !e.documentElement) return n && n(null), !1;
                        C.parseSVGDocument(e.documentElement, function(t, e, i, r) { n && n(t, e, i, r) }, i, r)
                    }
                })
            },
            loadSVGFromString: function(t, n, e, i) {
                var r;
                if (t = t.trim(), "undefined" != typeof DOMParser) {
                    var s = new DOMParser;
                    s && s.parseFromString && (r = s.parseFromString(t, "text/xml"))
                } else C.window.ActiveXObject && ((r = new ActiveXObject("Microsoft.XMLDOM")).async = "false", r.loadXML(t.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
                C.parseSVGDocument(r.documentElement, function(t, e, i, r) { n(t, e, i, r) }, e, i)
            }
        })
    }("undefined" != typeof exports ? exports : this), fabric.ElementsParser = function(t, e, i, r, n) { this.elements = t, this.callback = e, this.options = i, this.reviver = r, this.svgUid = i && i.svgUid || 0, this.parsingOptions = n, this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g },
    function(t) {
        t.parse = function() { this.instances = new Array(this.elements.length), this.numElements = this.elements.length, this.createObjects() }, t.createObjects = function() {
            var i = this;
            this.elements.forEach(function(t, e) { t.setAttribute("svgUid", i.svgUid), i.createObject(t, e) })
        }, t.findTag = function(t) { return fabric[fabric.util.string.capitalize(t.tagName.replace("svg:", ""))] }, t.createObject = function(t, e) { var i = this.findTag(t); if (i && i.fromElement) try { i.fromElement(t, this.createCallback(e, t), this.options) } catch (t) { fabric.log(t) } else this.checkIfDone() }, t.createCallback = function(i, r) {
            var n = this;
            return function(t) {
                var e;
                n.resolveGradient(t, "fill"), n.resolveGradient(t, "stroke"), t instanceof fabric.Image && (e = t.parsePreserveAspectRatioAttribute(r)), t._removeTransformMatrix(e), n.resolveClipPath(t), n.reviver && n.reviver(r, t), n.instances[i] = t, n.checkIfDone()
            }
        }, t.extractPropertyDefinition = function(t, e, i) { var r = t[e]; if (/^url\(/.test(r)) { var n = this.regexUrl.exec(r)[1]; return this.regexUrl.lastIndex = 0, fabric[i][this.svgUid][n] } }, t.resolveGradient = function(t, e) {
            var i = this.extractPropertyDefinition(t, e, "gradientDefs");
            i && t.set(e, fabric.Gradient.fromElement(i, t))
        }, t.createClipPathCallback = function(t, e) { return function(t) { t._removeTransformMatrix(), t.fillRule = t.clipRule, e.push(t) } }, t.resolveClipPath = function(t) {
            var e, i, r, n, s = this.extractPropertyDefinition(t, "clipPath", "clipPaths");
            if (s) {
                r = [], i = fabric.util.invertTransform(t.calcTransformMatrix());
                for (var o = 0; o < s.length; o++) e = s[o], this.findTag(e).fromElement(e, this.createClipPathCallback(t, r), this.options);
                s = 1 === r.length ? r[0] : new fabric.Group(r), n = fabric.util.multiplyTransformMatrices(i, s.calcTransformMatrix());
                var a = fabric.util.qrDecompose(n);
                s.flipX = !1, s.flipY = !1, s.set("scaleX", a.scaleX), s.set("scaleY", a.scaleY), s.angle = a.angle, s.skewX = a.skewX, s.skewY = 0, s.setPositionByOrigin({ x: a.translateX, y: a.translateY }, "center", "center"), t.clipPath = s
            }
        }, t.checkIfDone = function() { 0 == --this.numElements && (this.instances = this.instances.filter(function(t) { return null != t }), this.callback(this.instances, this.elements)) }
    }(fabric.ElementsParser.prototype),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});

        function i(t, e) { this.x = t, this.y = e }
        e.Point ? e.warn("fabric.Point is already defined") : (e.Point = i).prototype = {
            type: "point",
            constructor: i,
            add: function(t) { return new i(this.x + t.x, this.y + t.y) },
            addEquals: function(t) { return this.x += t.x, this.y += t.y, this },
            scalarAdd: function(t) { return new i(this.x + t, this.y + t) },
            scalarAddEquals: function(t) { return this.x += t, this.y += t, this },
            subtract: function(t) { return new i(this.x - t.x, this.y - t.y) },
            subtractEquals: function(t) { return this.x -= t.x, this.y -= t.y, this },
            scalarSubtract: function(t) { return new i(this.x - t, this.y - t) },
            scalarSubtractEquals: function(t) { return this.x -= t, this.y -= t, this },
            multiply: function(t) { return new i(this.x * t, this.y * t) },
            multiplyEquals: function(t) { return this.x *= t, this.y *= t, this },
            divide: function(t) { return new i(this.x / t, this.y / t) },
            divideEquals: function(t) { return this.x /= t, this.y /= t, this },
            eq: function(t) { return this.x === t.x && this.y === t.y },
            lt: function(t) { return this.x < t.x && this.y < t.y },
            lte: function(t) { return this.x <= t.x && this.y <= t.y },
            gt: function(t) { return this.x > t.x && this.y > t.y },
            gte: function(t) { return this.x >= t.x && this.y >= t.y },
            lerp: function(t, e) { return void 0 === e && (e = .5), e = Math.max(Math.min(1, e), 0), new i(this.x + (t.x - this.x) * e, this.y + (t.y - this.y) * e) },
            distanceFrom: function(t) {
                var e = this.x - t.x,
                    i = this.y - t.y;
                return Math.sqrt(e * e + i * i)
            },
            midPointFrom: function(t) { return this.lerp(t) },
            min: function(t) { return new i(Math.min(this.x, t.x), Math.min(this.y, t.y)) },
            max: function(t) { return new i(Math.max(this.x, t.x), Math.max(this.y, t.y)) },
            toString: function() { return this.x + "," + this.y },
            setXY: function(t, e) { return this.x = t, this.y = e, this },
            setX: function(t) { return this.x = t, this },
            setY: function(t) { return this.y = t, this },
            setFromPoint: function(t) { return this.x = t.x, this.y = t.y, this },
            swap: function(t) {
                var e = this.x,
                    i = this.y;
                this.x = t.x, this.y = t.y, t.x = e, t.y = i
            },
            clone: function() { return new i(this.x, this.y) }
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var f = t.fabric || (t.fabric = {});

        function d(t) { this.status = t, this.points = [] }
        f.Intersection ? f.warn("fabric.Intersection is already defined") : (f.Intersection = d, f.Intersection.prototype = { constructor: d, appendPoint: function(t) { return this.points.push(t), this }, appendPoints: function(t) { return this.points = this.points.concat(t), this } }, f.Intersection.intersectLineLine = function(t, e, i, r) {
            var n, s = (r.x - i.x) * (t.y - i.y) - (r.y - i.y) * (t.x - i.x),
                o = (e.x - t.x) * (t.y - i.y) - (e.y - t.y) * (t.x - i.x),
                a = (r.y - i.y) * (e.x - t.x) - (r.x - i.x) * (e.y - t.y);
            if (0 !== a) {
                var c = s / a,
                    h = o / a;
                0 <= c && c <= 1 && 0 <= h && h <= 1 ? (n = new d("Intersection")).appendPoint(new f.Point(t.x + c * (e.x - t.x), t.y + c * (e.y - t.y))) : n = new d
            } else n = new d(0 === s || 0 === o ? "Coincident" : "Parallel");
            return n
        }, f.Intersection.intersectLinePolygon = function(t, e, i) {
            var r, n, s, o, a = new d,
                c = i.length;
            for (o = 0; o < c; o++) r = i[o], n = i[(o + 1) % c], s = d.intersectLineLine(t, e, r, n), a.appendPoints(s.points);
            return 0 < a.points.length && (a.status = "Intersection"), a
        }, f.Intersection.intersectPolygonPolygon = function(t, e) {
            var i, r = new d,
                n = t.length;
            for (i = 0; i < n; i++) {
                var s = t[i],
                    o = t[(i + 1) % n],
                    a = d.intersectLinePolygon(s, o, e);
                r.appendPoints(a.points)
            }
            return 0 < r.points.length && (r.status = "Intersection"), r
        }, f.Intersection.intersectPolygonRectangle = function(t, e, i) {
            var r = e.min(i),
                n = e.max(i),
                s = new f.Point(n.x, r.y),
                o = new f.Point(r.x, n.y),
                a = d.intersectLinePolygon(r, s, t),
                c = d.intersectLinePolygon(s, n, t),
                h = d.intersectLinePolygon(n, o, t),
                l = d.intersectLinePolygon(o, r, t),
                u = new d;
            return u.appendPoints(a.points), u.appendPoints(c.points), u.appendPoints(h.points), u.appendPoints(l.points), 0 < u.points.length && (u.status = "Intersection"), u
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var h = t.fabric || (t.fabric = {});

        function l(t) { t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1]) }

        function u(t, e, i) { return i < 0 && (i += 1), 1 < i && (i -= 1), i < 1 / 6 ? t + 6 * (e - t) * i : i < .5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t }
        h.Color ? h.warn("fabric.Color is already defined.") : (h.Color = l, h.Color.prototype = {
            _tryParsingColor: function(t) {
                var e;
                t in l.colorNameMap && (t = l.colorNameMap[t]), "transparent" === t && (e = [255, 255, 255, 0]), e || (e = l.sourceFromHex(t)), e || (e = l.sourceFromRgb(t)), e || (e = l.sourceFromHsl(t)), e || (e = [0, 0, 0, 1]), e && this.setSource(e)
            },
            _rgbToHsl: function(t, e, i) {
                t /= 255, e /= 255, i /= 255;
                var r, n, s, o = h.util.array.max([t, e, i]),
                    a = h.util.array.min([t, e, i]);
                if (s = (o + a) / 2, o === a) r = n = 0;
                else {
                    var c = o - a;
                    switch (n = .5 < s ? c / (2 - o - a) : c / (o + a), o) {
                        case t:
                            r = (e - i) / c + (e < i ? 6 : 0);
                            break;
                        case e:
                            r = (i - t) / c + 2;
                            break;
                        case i:
                            r = (t - e) / c + 4
                    }
                    r /= 6
                }
                return [Math.round(360 * r), Math.round(100 * n), Math.round(100 * s)]
            },
            getSource: function() { return this._source },
            setSource: function(t) { this._source = t },
            toRgb: function() { var t = this.getSource(); return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")" },
            toRgba: function() { var t = this.getSource(); return "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + ")" },
            toHsl: function() {
                var t = this.getSource(),
                    e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsl(" + e[0] + "," + e[1] + "%," + e[2] + "%)"
            },
            toHsla: function() {
                var t = this.getSource(),
                    e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsla(" + e[0] + "," + e[1] + "%," + e[2] + "%," + t[3] + ")"
            },
            toHex: function() { var t, e, i, r = this.getSource(); return t = 1 === (t = r[0].toString(16)).length ? "0" + t : t, e = 1 === (e = r[1].toString(16)).length ? "0" + e : e, i = 1 === (i = r[2].toString(16)).length ? "0" + i : i, t.toUpperCase() + e.toUpperCase() + i.toUpperCase() },
            toHexa: function() { var t, e = this.getSource(); return t = 1 === (t = (t = Math.round(255 * e[3])).toString(16)).length ? "0" + t : t, this.toHex() + t.toUpperCase() },
            getAlpha: function() { return this.getSource()[3] },
            setAlpha: function(t) { var e = this.getSource(); return e[3] = t, this.setSource(e), this },
            toGrayscale: function() {
                var t = this.getSource(),
                    e = parseInt((.3 * t[0] + .59 * t[1] + .11 * t[2]).toFixed(0), 10),
                    i = t[3];
                return this.setSource([e, e, e, i]), this
            },
            toBlackWhite: function(t) {
                var e = this.getSource(),
                    i = (.3 * e[0] + .59 * e[1] + .11 * e[2]).toFixed(0),
                    r = e[3];
                return t = t || 127, i = Number(i) < Number(t) ? 0 : 255, this.setSource([i, i, i, r]), this
            },
            overlayWith: function(t) {
                t instanceof l || (t = new l(t));
                var e, i = [],
                    r = this.getAlpha(),
                    n = this.getSource(),
                    s = t.getSource();
                for (e = 0; e < 3; e++) i.push(Math.round(.5 * n[e] + .5 * s[e]));
                return i[3] = r, this.setSource(i), this
            }
        }, h.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/i, h.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i, h.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i, h.Color.colorNameMap = { aliceblue: "#F0F8FF", antiquewhite: "#FAEBD7", aqua: "#00FFFF", aquamarine: "#7FFFD4", azure: "#F0FFFF", beige: "#F5F5DC", bisque: "#FFE4C4", black: "#000000", blanchedalmond: "#FFEBCD", blue: "#0000FF", blueviolet: "#8A2BE2", brown: "#A52A2A", burlywood: "#DEB887", cadetblue: "#5F9EA0", chartreuse: "#7FFF00", chocolate: "#D2691E", coral: "#FF7F50", cornflowerblue: "#6495ED", cornsilk: "#FFF8DC", crimson: "#DC143C", cyan: "#00FFFF", darkblue: "#00008B", darkcyan: "#008B8B", darkgoldenrod: "#B8860B", darkgray: "#A9A9A9", darkgrey: "#A9A9A9", darkgreen: "#006400", darkkhaki: "#BDB76B", darkmagenta: "#8B008B", darkolivegreen: "#556B2F", darkorange: "#FF8C00", darkorchid: "#9932CC", darkred: "#8B0000", darksalmon: "#E9967A", darkseagreen: "#8FBC8F", darkslateblue: "#483D8B", darkslategray: "#2F4F4F", darkslategrey: "#2F4F4F", darkturquoise: "#00CED1", darkviolet: "#9400D3", deeppink: "#FF1493", deepskyblue: "#00BFFF", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1E90FF", firebrick: "#B22222", floralwhite: "#FFFAF0", forestgreen: "#228B22", fuchsia: "#FF00FF", gainsboro: "#DCDCDC", ghostwhite: "#F8F8FF", gold: "#FFD700", goldenrod: "#DAA520", gray: "#808080", grey: "#808080", green: "#008000", greenyellow: "#ADFF2F", honeydew: "#F0FFF0", hotpink: "#FF69B4", indianred: "#CD5C5C", indigo: "#4B0082", ivory: "#FFFFF0", khaki: "#F0E68C", lavender: "#E6E6FA", lavenderblush: "#FFF0F5", lawngreen: "#7CFC00", lemonchiffon: "#FFFACD", lightblue: "#ADD8E6", lightcoral: "#F08080", lightcyan: "#E0FFFF", lightgoldenrodyellow: "#FAFAD2", lightgray: "#D3D3D3", lightgrey: "#D3D3D3", lightgreen: "#90EE90", lightpink: "#FFB6C1", lightsalmon: "#FFA07A", lightseagreen: "#20B2AA", lightskyblue: "#87CEFA", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#B0C4DE", lightyellow: "#FFFFE0", lime: "#00FF00", limegreen: "#32CD32", linen: "#FAF0E6", magenta: "#FF00FF", maroon: "#800000", mediumaquamarine: "#66CDAA", mediumblue: "#0000CD", mediumorchid: "#BA55D3", mediumpurple: "#9370DB", mediumseagreen: "#3CB371", mediumslateblue: "#7B68EE", mediumspringgreen: "#00FA9A", mediumturquoise: "#48D1CC", mediumvioletred: "#C71585", midnightblue: "#191970", mintcream: "#F5FFFA", mistyrose: "#FFE4E1", moccasin: "#FFE4B5", navajowhite: "#FFDEAD", navy: "#000080", oldlace: "#FDF5E6", olive: "#808000", olivedrab: "#6B8E23", orange: "#FFA500", orangered: "#FF4500", orchid: "#DA70D6", palegoldenrod: "#EEE8AA", palegreen: "#98FB98", paleturquoise: "#AFEEEE", palevioletred: "#DB7093", papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6", purple: "#800080", rebeccapurple: "#663399", red: "#FF0000", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE", sienna: "#A0522D", silver: "#C0C0C0", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090", slategrey: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C", teal: "#008080", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3", white: "#FFFFFF", whitesmoke: "#F5F5F5", yellow: "#FFFF00", yellowgreen: "#9ACD32" }, h.Color.fromRgb = function(t) { return l.fromSource(l.sourceFromRgb(t)) }, h.Color.sourceFromRgb = function(t) {
            var e = t.match(l.reRGBa);
            if (e) {
                var i = parseInt(e[1], 10) / (/%$/.test(e[1]) ? 100 : 1) * (/%$/.test(e[1]) ? 255 : 1),
                    r = parseInt(e[2], 10) / (/%$/.test(e[2]) ? 100 : 1) * (/%$/.test(e[2]) ? 255 : 1),
                    n = parseInt(e[3], 10) / (/%$/.test(e[3]) ? 100 : 1) * (/%$/.test(e[3]) ? 255 : 1);
                return [parseInt(i, 10), parseInt(r, 10), parseInt(n, 10), e[4] ? parseFloat(e[4]) : 1]
            }
        }, h.Color.fromRgba = l.fromRgb, h.Color.fromHsl = function(t) { return l.fromSource(l.sourceFromHsl(t)) }, h.Color.sourceFromHsl = function(t) {
            var e = t.match(l.reHSLa);
            if (e) {
                var i, r, n, s = (parseFloat(e[1]) % 360 + 360) % 360 / 360,
                    o = parseFloat(e[2]) / (/%$/.test(e[2]) ? 100 : 1),
                    a = parseFloat(e[3]) / (/%$/.test(e[3]) ? 100 : 1);
                if (0 === o) i = r = n = a;
                else {
                    var c = a <= .5 ? a * (o + 1) : a + o - a * o,
                        h = 2 * a - c;
                    i = u(h, c, s + 1 / 3), r = u(h, c, s), n = u(h, c, s - 1 / 3)
                }
                return [Math.round(255 * i), Math.round(255 * r), Math.round(255 * n), e[4] ? parseFloat(e[4]) : 1]
            }
        }, h.Color.fromHsla = l.fromHsl, h.Color.fromHex = function(t) { return l.fromSource(l.sourceFromHex(t)) }, h.Color.sourceFromHex = function(t) {
            if (t.match(l.reHex)) {
                var e = t.slice(t.indexOf("#") + 1),
                    i = 3 === e.length || 4 === e.length,
                    r = 8 === e.length || 4 === e.length,
                    n = i ? e.charAt(0) + e.charAt(0) : e.substring(0, 2),
                    s = i ? e.charAt(1) + e.charAt(1) : e.substring(2, 4),
                    o = i ? e.charAt(2) + e.charAt(2) : e.substring(4, 6),
                    a = r ? i ? e.charAt(3) + e.charAt(3) : e.substring(6, 8) : "FF";
                return [parseInt(n, 16), parseInt(s, 16), parseInt(o, 16), parseFloat((parseInt(a, 16) / 255).toFixed(2))]
            }
        }, h.Color.fromSource = function(t) { var e = new l; return e.setSource(t), e })
    }("undefined" != typeof exports ? exports : this),
    function() {
        function d(t) {
            var e, i, r, n, s = t.getAttribute("style"),
                o = t.getAttribute("offset") || 0;
            if (o = (o = parseFloat(o) / (/%$/.test(o) ? 100 : 1)) < 0 ? 0 : 1 < o ? 1 : o, s) {
                var a = s.split(/\s*;\s*/);
                for ("" === a[a.length - 1] && a.pop(), n = a.length; n--;) {
                    var c = a[n].split(/\s*:\s*/),
                        h = c[0].trim(),
                        l = c[1].trim();
                    "stop-color" === h ? e = l : "stop-opacity" === h && (r = l)
                }
            }
            return e || (e = t.getAttribute("stop-color") || "rgb(0,0,0)"), r || (r = t.getAttribute("stop-opacity")), i = (e = new fabric.Color(e)).getAlpha(), r = isNaN(parseFloat(r)) ? 1 : parseFloat(r), r *= i, { offset: o, color: e.toRgb(), opacity: r }
        }
        var g = fabric.util.object.clone;

        function p(t, e, i) {
            var r, n = 0,
                s = 1,
                o = "";
            for (var a in e) "Infinity" === e[a] ? e[a] = 1 : "-Infinity" === e[a] && (e[a] = 0), r = parseFloat(e[a], 10), s = "string" == typeof e[a] && /^(\d+\.\d+)%|(\d+)%$/.test(e[a]) ? .01 : 1, "x1" === a || "x2" === a || "r2" === a ? (s *= "objectBoundingBox" === i ? t.width : 1, n = "objectBoundingBox" === i && t.left || 0) : "y1" !== a && "y2" !== a || (s *= "objectBoundingBox" === i ? t.height : 1, n = "objectBoundingBox" === i && t.top || 0), e[a] = r * s + n;
            if ("ellipse" === t.type && null !== e.r2 && "objectBoundingBox" === i && t.rx !== t.ry) {
                var c = t.ry / t.rx;
                o = " scale(1, " + c + ")", e.y1 && (e.y1 /= c), e.y2 && (e.y2 /= c)
            }
            return o
        }
        fabric.Gradient = fabric.util.createClass({
            offsetX: 0,
            offsetY: 0,
            initialize: function(t) {
                t || (t = {});
                var e = {};
                this.id = fabric.Object.__uid++, this.type = t.type || "linear", e = { x1: t.coords.x1 || 0, y1: t.coords.y1 || 0, x2: t.coords.x2 || 0, y2: t.coords.y2 || 0 }, "radial" === this.type && (e.r1 = t.coords.r1 || 0, e.r2 = t.coords.r2 || 0), this.coords = e, this.colorStops = t.colorStops.slice(), t.gradientTransform && (this.gradientTransform = t.gradientTransform), this.offsetX = t.offsetX || this.offsetX, this.offsetY = t.offsetY || this.offsetY
            },
            addColorStop: function(t) {
                for (var e in t) {
                    var i = new fabric.Color(t[e]);
                    this.colorStops.push({ offset: parseFloat(e), color: i.toRgb(), opacity: i.getAlpha() })
                }
                return this
            },
            toObject: function(t) { var e = { type: this.type, coords: this.coords, colorStops: this.colorStops, offsetX: this.offsetX, offsetY: this.offsetY, gradientTransform: this.gradientTransform ? this.gradientTransform.concat() : this.gradientTransform }; return fabric.util.populateWithProperties(this, e, t), e },
            toSVG: function(t) {
                var e, i, r, n, s = g(this.coords, !0),
                    o = g(this.colorStops, !0),
                    a = s.r1 > s.r2,
                    c = t.width / 2,
                    h = t.height / 2;
                for (var l in o.sort(function(t, e) { return t.offset - e.offset }), "path" === t.type && (c -= t.pathOffset.x, h -= t.pathOffset.y), s) "x1" === l || "x2" === l ? s[l] += this.offsetX - c : "y1" !== l && "y2" !== l || (s[l] += this.offsetY - h);
                if (n = 'id="SVGID_' + this.id + '" gradientUnits="userSpaceOnUse"', this.gradientTransform && (n += ' gradientTransform="matrix(' + this.gradientTransform.join(" ") + ')" '), "linear" === this.type ? r = ["<linearGradient ", n, ' x1="', s.x1, '" y1="', s.y1, '" x2="', s.x2, '" y2="', s.y2, '">\n'] : "radial" === this.type && (r = ["<radialGradient ", n, ' cx="', a ? s.x1 : s.x2, '" cy="', a ? s.y1 : s.y2, '" r="', a ? s.r1 : s.r2, '" fx="', a ? s.x2 : s.x1, '" fy="', a ? s.y2 : s.y1, '">\n']), "radial" === this.type) {
                    if (a)
                        for ((o = o.concat()).reverse(), e = 0, i = o.length; e < i; e++) o[e].offset = 1 - o[e].offset;
                    var u = Math.min(s.r1, s.r2);
                    if (0 < u) { var f = u / Math.max(s.r1, s.r2); for (e = 0, i = o.length; e < i; e++) o[e].offset += f * (1 - o[e].offset) }
                }
                for (e = 0, i = o.length; e < i; e++) {
                    var d = o[e];
                    r.push("<stop ", 'offset="', 100 * d.offset + "%", '" style="stop-color:', d.color, void 0 !== d.opacity ? ";stop-opacity: " + d.opacity : ";", '"/>\n')
                }
                return r.push("linear" === this.type ? "</linearGradient>\n" : "</radialGradient>\n"), r.join("")
            },
            toLive: function(t) {
                var e, i, r, n = fabric.util.object.clone(this.coords);
                if (this.type) {
                    for ("linear" === this.type ? e = t.createLinearGradient(n.x1, n.y1, n.x2, n.y2) : "radial" === this.type && (e = t.createRadialGradient(n.x1, n.y1, n.r1, n.x2, n.y2, n.r2)), i = 0, r = this.colorStops.length; i < r; i++) {
                        var s = this.colorStops[i].color,
                            o = this.colorStops[i].opacity,
                            a = this.colorStops[i].offset;
                        void 0 !== o && (s = new fabric.Color(s).setAlpha(o).toRgba()), e.addColorStop(a, s)
                    }
                    return e
                }
            }
        }), fabric.util.object.extend(fabric.Gradient, {
            fromElement: function(t, e) {
                var i, r, n, s, o, a, c = t.getElementsByTagName("stop"),
                    h = t.getAttribute("gradientUnits") || "objectBoundingBox",
                    l = t.getAttribute("gradientTransform"),
                    u = [];
                for ("linear" === (i = "linearGradient" === t.nodeName || "LINEARGRADIENT" === t.nodeName ? "linear" : "radial") ? r = { x1: (a = t).getAttribute("x1") || 0, y1: a.getAttribute("y1") || 0, x2: a.getAttribute("x2") || "100%", y2: a.getAttribute("y2") || 0 } : "radial" === i && (r = { x1: (o = t).getAttribute("fx") || o.getAttribute("cx") || "50%", y1: o.getAttribute("fy") || o.getAttribute("cy") || "50%", r1: 0, x2: o.getAttribute("cx") || "50%", y2: o.getAttribute("cy") || "50%", r2: o.getAttribute("r") || "50%" }), s = c.length; s--;) u.push(d(c[s]));
                n = p(e, r, h);
                var f = new fabric.Gradient({ type: i, coords: r, colorStops: u, offsetX: -e.left, offsetY: -e.top });
                return (l || "" !== n) && (f.gradientTransform = fabric.parseTransformAttribute((l || "") + n)), f
            },
            forObject: function(t, e) { return e || (e = {}), p(t, e.coords, "userSpaceOnUse"), new fabric.Gradient(e) }
        })
    }(),
    function() {
        "use strict";
        var n = fabric.util.toFixed;
        fabric.Pattern = fabric.util.createClass({
            repeat: "repeat",
            offsetX: 0,
            offsetY: 0,
            crossOrigin: "",
            patternTransform: null,
            initialize: function(t, e) {
                if (t || (t = {}), this.id = fabric.Object.__uid++, this.setOptions(t), !t.source || t.source && "string" != typeof t.source) e && e(this);
                else if (void 0 !== fabric.util.getFunctionBody(t.source)) this.source = new Function(fabric.util.getFunctionBody(t.source)), e && e(this);
                else {
                    var i = this;
                    this.source = fabric.util.createImage(), fabric.util.loadImage(t.source, function(t) { i.source = t, e && e(i) }, null, this.crossOrigin)
                }
            },
            toObject: function(t) { var e, i, r = fabric.Object.NUM_FRACTION_DIGITS; return "function" == typeof this.source ? e = String(this.source) : "string" == typeof this.source.src ? e = this.source.src : "object" == typeof this.source && this.source.toDataURL && (e = this.source.toDataURL()), i = { type: "pattern", source: e, repeat: this.repeat, crossOrigin: this.crossOrigin, offsetX: n(this.offsetX, r), offsetY: n(this.offsetY, r), patternTransform: this.patternTransform ? this.patternTransform.concat() : null }, fabric.util.populateWithProperties(this, i, t), i },
            toSVG: function(t) {
                var e = "function" == typeof this.source ? this.source() : this.source,
                    i = e.width / t.width,
                    r = e.height / t.height,
                    n = this.offsetX / t.width,
                    s = this.offsetY / t.height,
                    o = "";
                return "repeat-x" !== this.repeat && "no-repeat" !== this.repeat || (r = 1, s && (r += Math.abs(s))), "repeat-y" !== this.repeat && "no-repeat" !== this.repeat || (i = 1, n && (i += Math.abs(n))), e.src ? o = e.src : e.toDataURL && (o = e.toDataURL()), '<pattern id="SVGID_' + this.id + '" x="' + n + '" y="' + s + '" width="' + i + '" height="' + r + '">\n<image x="0" y="0" width="' + e.width + '" height="' + e.height + '" xlink:href="' + o + '"></image>\n</pattern>\n'
            },
            setOptions: function(t) { for (var e in t) this[e] = t[e] },
            toLive: function(t) { var e = "function" == typeof this.source ? this.source() : this.source; if (!e) return ""; if (void 0 !== e.src) { if (!e.complete) return ""; if (0 === e.naturalWidth || 0 === e.naturalHeight) return "" } return t.createPattern(e, this.repeat) }
        })
    }(),
    function(t) {
        "use strict";
        var o = t.fabric || (t.fabric = {}),
            a = o.util.toFixed;
        o.Shadow ? o.warn("fabric.Shadow is already defined.") : (o.Shadow = o.util.createClass({
            color: "rgb(0,0,0)",
            blur: 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: !1,
            includeDefaultValues: !0,
            initialize: function(t) {
                for (var e in "string" == typeof t && (t = this._parseShadow(t)), t) this[e] = t[e];
                this.id = o.Object.__uid++
            },
            _parseShadow: function(t) {
                var e = t.trim(),
                    i = o.Shadow.reOffsetsAndBlur.exec(e) || [];
                return { color: (e.replace(o.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)").trim(), offsetX: parseInt(i[1], 10) || 0, offsetY: parseInt(i[2], 10) || 0, blur: parseInt(i[3], 10) || 0 }
            },
            toString: function() { return [this.offsetX, this.offsetY, this.blur, this.color].join("px ") },
            toSVG: function(t) {
                var e = 40,
                    i = 40,
                    r = o.Object.NUM_FRACTION_DIGITS,
                    n = o.util.rotateVector({ x: this.offsetX, y: this.offsetY }, o.util.degreesToRadians(-t.angle)),
                    s = new o.Color(this.color);
                return t.width && t.height && (e = 100 * a((Math.abs(n.x) + this.blur) / t.width, r) + 20, i = 100 * a((Math.abs(n.y) + this.blur) / t.height, r) + 20), t.flipX && (n.x *= -1), t.flipY && (n.y *= -1), '<filter id="SVGID_' + this.id + '" y="-' + i + '%" height="' + (100 + 2 * i) + '%" x="-' + e + '%" width="' + (100 + 2 * e) + '%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="' + a(this.blur ? this.blur / 2 : 0, r) + '"></feGaussianBlur>\n\t<feOffset dx="' + a(n.x, r) + '" dy="' + a(n.y, r) + '" result="oBlur" ></feOffset>\n\t<feFlood flood-color="' + s.toRgb() + '" flood-opacity="' + s.getAlpha() + '"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n'
            },
            toObject: function() {
                if (this.includeDefaultValues) return { color: this.color, blur: this.blur, offsetX: this.offsetX, offsetY: this.offsetY, affectStroke: this.affectStroke };
                var e = {},
                    i = o.Shadow.prototype;
                return ["color", "blur", "offsetX", "offsetY", "affectStroke"].forEach(function(t) { this[t] !== i[t] && (e[t] = this[t]) }, this), e
            }
        }), o.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/)
    }("undefined" != typeof exports ? exports : this),
    function() {
        "use strict";
        if (fabric.StaticCanvas) fabric.warn("fabric.StaticCanvas is already defined.");
        else {
            var n = fabric.util.object.extend,
                t = fabric.util.getElementOffset,
                h = fabric.util.removeFromArray,
                a = fabric.util.toFixed,
                s = fabric.util.transformPoint,
                o = fabric.util.invertTransform,
                i = fabric.util.getNodeCanvas,
                r = fabric.util.createCanvasElement,
                e = new Error("Could not initialize `canvas` element");
            fabric.StaticCanvas = fabric.util.createClass(fabric.CommonMethods, {
                initialize: function(t, e) { e || (e = {}), this.renderAndResetBound = this.renderAndReset.bind(this), this.requestRenderAllBound = this.requestRenderAll.bind(this), this._initStatic(t, e) },
                backgroundColor: "",
                backgroundImage: null,
                overlayColor: "",
                overlayImage: null,
                includeDefaultValues: !0,
                stateful: !1,
                renderOnAddRemove: !0,
                clipTo: null,
                controlsAboveOverlay: !1,
                allowTouchScrolling: !1,
                imageSmoothingEnabled: !0,
                viewportTransform: fabric.iMatrix.concat(),
                backgroundVpt: !0,
                overlayVpt: !0,
                onBeforeScaleRotate: function() {},
                enableRetinaScaling: !0,
                vptCoords: {},
                skipOffscreen: !0,
                clipPath: void 0,
                _initStatic: function(t, e) {
                    var i = this.requestRenderAllBound;
                    this._objects = [], this._createLowerCanvas(t), this._initOptions(e), this._setImageSmoothing(), this.interactive || this._initRetinaScaling(), e.overlayImage && this.setOverlayImage(e.overlayImage, i), e.backgroundImage && this.setBackgroundImage(e.backgroundImage, i), e.backgroundColor && this.setBackgroundColor(e.backgroundColor, i), e.overlayColor && this.setOverlayColor(e.overlayColor, i), this.calcOffset()
                },
                _isRetinaScaling: function() { return 1 !== fabric.devicePixelRatio && this.enableRetinaScaling },
                getRetinaScaling: function() { return this._isRetinaScaling() ? fabric.devicePixelRatio : 1 },
                _initRetinaScaling: function() { this._isRetinaScaling() && (this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio), this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio), this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio)) },
                calcOffset: function() { return this._offset = t(this.lowerCanvasEl), this },
                setOverlayImage: function(t, e, i) { return this.__setBgOverlayImage("overlayImage", t, e, i) },
                setBackgroundImage: function(t, e, i) { return this.__setBgOverlayImage("backgroundImage", t, e, i) },
                setOverlayColor: function(t, e) { return this.__setBgOverlayColor("overlayColor", t, e) },
                setBackgroundColor: function(t, e) { return this.__setBgOverlayColor("backgroundColor", t, e) },
                _setImageSmoothing: function() {
                    var t = this.getContext();
                    t.imageSmoothingEnabled = t.imageSmoothingEnabled || t.webkitImageSmoothingEnabled || t.mozImageSmoothingEnabled || t.msImageSmoothingEnabled || t.oImageSmoothingEnabled, t.imageSmoothingEnabled = this.imageSmoothingEnabled
                },
                __setBgOverlayImage: function(i, t, r, n) {
                    return "string" == typeof t ? fabric.util.loadImage(t, function(t) {
                        if (t) {
                            var e = new fabric.Image(t, n);
                            (this[i] = e).canvas = this
                        }
                        r && r(t)
                    }, this, n && n.crossOrigin) : (n && t.setOptions(n), (this[i] = t) && (t.canvas = this), r && r(t)), this
                },
                __setBgOverlayColor: function(t, e, i) { return this[t] = e, this._initGradient(e, t), this._initPattern(e, t, i), this },
                _createCanvasElement: function() { var t = r(); if (!t) throw e; if (t.style || (t.style = {}), void 0 === t.getContext) throw e; return t },
                _initOptions: function(t) {
                    var e = this.lowerCanvasEl;
                    this._setOptions(t), this.width = this.width || parseInt(e.width, 10) || 0, this.height = this.height || parseInt(e.height, 10) || 0, this.lowerCanvasEl.style && (e.width = this.width, e.height = this.height, e.style.width = this.width + "px", e.style.height = this.height + "px", this.viewportTransform = this.viewportTransform.slice())
                },
                _createLowerCanvas: function(t) { t && t.getContext ? this.lowerCanvasEl = t : this.lowerCanvasEl = fabric.util.getById(t) || this._createCanvasElement(), fabric.util.addClass(this.lowerCanvasEl, "lower-canvas"), this.interactive && this._applyCanvasStyle(this.lowerCanvasEl), this.contextContainer = this.lowerCanvasEl.getContext("2d") },
                getWidth: function() { return this.width },
                getHeight: function() { return this.height },
                setWidth: function(t, e) { return this.setDimensions({ width: t }, e) },
                setHeight: function(t, e) { return this.setDimensions({ height: t }, e) },
                setDimensions: function(t, e) { var i; for (var r in e = e || {}, t) i = t[r], e.cssOnly || (this._setBackstoreDimension(r, t[r]), i += "px", this.hasLostContext = !0), e.backstoreOnly || this._setCssDimension(r, i); return this._isCurrentlyDrawing && this.freeDrawingBrush && this.freeDrawingBrush._setBrushStyles(), this._initRetinaScaling(), this._setImageSmoothing(), this.calcOffset(), e.cssOnly || this.requestRenderAll(), this },
                _setBackstoreDimension: function(t, e) { return this.lowerCanvasEl[t] = e, this.upperCanvasEl && (this.upperCanvasEl[t] = e), this.cacheCanvasEl && (this.cacheCanvasEl[t] = e), this[t] = e, this },
                _setCssDimension: function(t, e) { return this.lowerCanvasEl.style[t] = e, this.upperCanvasEl && (this.upperCanvasEl.style[t] = e), this.wrapperEl && (this.wrapperEl.style[t] = e), this },
                getZoom: function() { return this.viewportTransform[0] },
                setViewportTransform: function(t) { var e, i, r, n = this._activeObject; for (this.viewportTransform = t, i = 0, r = this._objects.length; i < r; i++)(e = this._objects[i]).group || e.setCoords(!1, !0); return n && "activeSelection" === n.type && n.setCoords(!1, !0), this.calcViewportBoundaries(), this.renderOnAddRemove && this.requestRenderAll(), this },
                zoomToPoint: function(t, e) {
                    var i = t,
                        r = this.viewportTransform.slice(0);
                    t = s(t, o(this.viewportTransform)), r[0] = e, r[3] = e;
                    var n = s(t, r);
                    return r[4] += i.x - n.x, r[5] += i.y - n.y, this.setViewportTransform(r)
                },
                setZoom: function(t) { return this.zoomToPoint(new fabric.Point(0, 0), t), this },
                absolutePan: function(t) { var e = this.viewportTransform.slice(0); return e[4] = -t.x, e[5] = -t.y, this.setViewportTransform(e) },
                relativePan: function(t) { return this.absolutePan(new fabric.Point(-t.x - this.viewportTransform[4], -t.y - this.viewportTransform[5])) },
                getElement: function() { return this.lowerCanvasEl },
                _onObjectAdded: function(t) { this.stateful && t.setupState(), t._set("canvas", this), t.setCoords(), this.fire("object:added", { target: t }), t.fire("added") },
                _onObjectRemoved: function(t) { this.fire("object:removed", { target: t }), t.fire("removed"), delete t.canvas },
                clearContext: function(t) { return t.clearRect(0, 0, this.width, this.height), this },
                getContext: function() { return this.contextContainer },
                clear: function() { return this._objects.length = 0, this.backgroundImage = null, this.overlayImage = null, this.backgroundColor = "", this.overlayColor = "", this._hasITextHandlers && (this.off("mouse:up", this._mouseUpITextHandler), this._iTextInstances = null, this._hasITextHandlers = !1), this.clearContext(this.contextContainer), this.fire("canvas:cleared"), this.renderOnAddRemove && this.requestRenderAll(), this },
                renderAll: function() { var t = this.contextContainer; return this.renderCanvas(t, this._objects), this },
                renderAndReset: function() { this.isRendering = 0, this.renderAll() },
                requestRenderAll: function() { return this.isRendering || (this.isRendering = fabric.util.requestAnimFrame(this.renderAndResetBound)), this },
                calcViewportBoundaries: function() {
                    var t = {},
                        e = this.width,
                        i = this.height,
                        r = o(this.viewportTransform);
                    return t.tl = s({ x: 0, y: 0 }, r), t.br = s({ x: e, y: i }, r), t.tr = new fabric.Point(t.br.x, t.tl.y), t.bl = new fabric.Point(t.tl.x, t.br.y), this.vptCoords = t
                },
                cancelRequestedRender: function() { this.isRendering && (fabric.util.cancelAnimFrame(this.isRendering), this.isRendering = 0) },
                renderCanvas: function(t, e) {
                    var i = this.viewportTransform,
                        r = this.clipPath;
                    this.cancelRequestedRender(), this.calcViewportBoundaries(), this.clearContext(t), this.fire("before:render", { ctx: t }), this.clipTo && fabric.util.clipContext(this, t), this._renderBackground(t), t.save(), t.transform(i[0], i[1], i[2], i[3], i[4], i[5]), this._renderObjects(t, e), t.restore(), !this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.clipTo && t.restore(), r && (r.canvas = this, r.shouldCache(), r._transformDone = !0, r.renderCache({ forClipping: !0 }), this.drawClipPathOnCanvas(t)), this._renderOverlay(t), this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.fire("after:render", { ctx: t })
                },
                drawClipPathOnCanvas: function(t) {
                    var e = this.viewportTransform,
                        i = this.clipPath;
                    t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]), t.globalCompositeOperation = "destination-in", i.transform(t), t.scale(1 / i.zoomX, 1 / i.zoomY), t.drawImage(i._cacheCanvas, -i.cacheTranslationX, -i.cacheTranslationY), t.restore()
                },
                _renderObjects: function(t, e) { var i, r; for (i = 0, r = e.length; i < r; ++i) e[i] && e[i].render(t) },
                _renderBackgroundOrOverlay: function(t, e) {
                    var i, r = this[e + "Color"];
                    r && (t.fillStyle = r.toLive ? r.toLive(t, this) : r, t.fillRect(r.offsetX || 0, r.offsetY || 0, this.width, this.height)), (r = this[e + "Image"]) && (this[e + "Vpt"] && (i = this.viewportTransform, t.save(), t.transform(i[0], i[1], i[2], i[3], i[4], i[5])), r.render(t), this[e + "Vpt"] && t.restore())
                },
                _renderBackground: function(t) { this._renderBackgroundOrOverlay(t, "background") },
                _renderOverlay: function(t) { this._renderBackgroundOrOverlay(t, "overlay") },
                getCenter: function() { return { top: this.height / 2, left: this.width / 2 } },
                centerObjectH: function(t) { return this._centerObject(t, new fabric.Point(this.getCenter().left, t.getCenterPoint().y)) },
                centerObjectV: function(t) { return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, this.getCenter().top)) },
                centerObject: function(t) { var e = this.getCenter(); return this._centerObject(t, new fabric.Point(e.left, e.top)) },
                viewportCenterObject: function(t) { var e = this.getVpCenter(); return this._centerObject(t, e) },
                viewportCenterObjectH: function(t) { var e = this.getVpCenter(); return this._centerObject(t, new fabric.Point(e.x, t.getCenterPoint().y)), this },
                viewportCenterObjectV: function(t) { var e = this.getVpCenter(); return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, e.y)) },
                getVpCenter: function() {
                    var t = this.getCenter(),
                        e = o(this.viewportTransform);
                    return s({ x: t.left, y: t.top }, e)
                },
                _centerObject: function(t, e) { return t.setPositionByOrigin(e, "center", "center"), t.setCoords(), this.renderOnAddRemove && this.requestRenderAll(), this },
                toDatalessJSON: function(t) { return this.toDatalessObject(t) },
                toObject: function(t) { return this._toObjectMethod("toObject", t) },
                toDatalessObject: function(t) { return this._toObjectMethod("toDatalessObject", t) },
                _toObjectMethod: function(t, e) {
                    var i = this.clipPath,
                        r = { version: fabric.version, objects: this._toObjects(t, e) };
                    return i && (i = i.toObject(e)), n(r, this.__serializeBgOverlay(t, e)), fabric.util.populateWithProperties(this, r, e), r
                },
                _toObjects: function(e, i) { return this._objects.filter(function(t) { return !t.excludeFromExport }).map(function(t) { return this._toObject(t, e, i) }, this) },
                _toObject: function(t, e, i) {
                    var r;
                    this.includeDefaultValues || (r = t.includeDefaultValues, t.includeDefaultValues = !1);
                    var n = t[e](i);
                    return this.includeDefaultValues || (t.includeDefaultValues = r), n
                },
                __serializeBgOverlay: function(t, e) {
                    var i = {},
                        r = this.backgroundImage,
                        n = this.overlayImage;
                    return this.backgroundColor && (i.background = this.backgroundColor.toObject ? this.backgroundColor.toObject(e) : this.backgroundColor), this.overlayColor && (i.overlay = this.overlayColor.toObject ? this.overlayColor.toObject(e) : this.overlayColor), r && !r.excludeFromExport && (i.backgroundImage = this._toObject(r, t, e)), n && !n.excludeFromExport && (i.overlayImage = this._toObject(n, t, e)), i
                },
                svgViewportTransformation: !0,
                toSVG: function(t, e) { t || (t = {}), t.reviver = e; var i = []; return this._setSVGPreamble(i, t), this._setSVGHeader(i, t), this._setSVGBgOverlayColor(i, "backgroundColor"), this._setSVGBgOverlayImage(i, "backgroundImage", e), this.clipPath && i.push('<g clip-path="url(#' + this.clipPath.clipPathId + ')" >\n'), this._setSVGObjects(i, e), this.clipPath && i.push("</g>\n"), this._setSVGBgOverlayColor(i, "overlayColor"), this._setSVGBgOverlayImage(i, "overlayImage", e), i.push("</svg>"), i.join("") },
                _setSVGPreamble: function(t, e) { e.suppressPreamble || t.push('<?xml version="1.0" encoding="', e.encoding || "UTF-8", '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n') },
                _setSVGHeader: function(t, e) {
                    var i, r = e.width || this.width,
                        n = e.height || this.height,
                        s = 'viewBox="0 0 ' + this.width + " " + this.height + '" ',
                        o = fabric.Object.NUM_FRACTION_DIGITS;
                    e.viewBox ? s = 'viewBox="' + e.viewBox.x + " " + e.viewBox.y + " " + e.viewBox.width + " " + e.viewBox.height + '" ' : this.svgViewportTransformation && (i = this.viewportTransform, s = 'viewBox="' + a(-i[4] / i[0], o) + " " + a(-i[5] / i[3], o) + " " + a(this.width / i[0], o) + " " + a(this.height / i[3], o) + '" '), t.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', r, '" ', 'height="', n, '" ', s, 'xml:space="preserve">\n', "<desc>Created with Fabric.js ", fabric.version, "</desc>\n", "<defs>\n", this.createSVGFontFacesMarkup(), this.createSVGRefElementsMarkup(), this.createSVGClipPathMarkup(e), "</defs>\n")
                },
                createSVGClipPathMarkup: function(t) { var e = this.clipPath; return e ? (e.clipPathId = "CLIPPATH_" + fabric.Object.__uid++, '<clipPath id="' + e.clipPathId + '" >\n' + this.clipPath.toClipPathSVG(t.reviver) + "</clipPath>\n") : "" },
                createSVGRefElementsMarkup: function() { var i = this; return ["backgroundColor", "overlayColor"].map(function(t) { var e = i[t]; if (e && e.toLive) return e.toSVG(i, !1) }).join("") },
                createSVGFontFacesMarkup: function() {
                    var t, e, i, r, n, s, o, a, c = "",
                        h = {},
                        l = fabric.fontPaths,
                        u = this._objects;
                    for (o = 0, a = u.length; o < a; o++)
                        if (e = (t = u[o]).fontFamily, -1 !== t.type.indexOf("text") && !h[e] && l[e] && (h[e] = !0, t.styles))
                            for (n in i = t.styles)
                                for (s in r = i[n]) !h[e = r[s].fontFamily] && l[e] && (h[e] = !0);
                    for (var f in h) c += ["\t\t@font-face {\n", "\t\t\tfont-family: '", f, "';\n", "\t\t\tsrc: url('", l[f], "');\n", "\t\t}\n"].join("");
                    return c && (c = ['\t<style type="text/css">', "<![CDATA[\n", c, "]]>", "</style>\n"].join("")), c
                },
                _setSVGObjects: function(t, e) { var i, r, n, s = this._objects; for (r = 0, n = s.length; r < n; r++)(i = s[r]).excludeFromExport || this._setSVGObject(t, i, e) },
                _setSVGObject: function(t, e, i) { t.push(e.toSVG(i)) },
                _setSVGBgOverlayImage: function(t, e, i) { this[e] && !this[e].excludeFromExport && this[e].toSVG && t.push(this[e].toSVG(i)) },
                _setSVGBgOverlayColor: function(t, e) {
                    var i = this[e],
                        r = this.viewportTransform,
                        n = this.width / r[0],
                        s = this.height / r[3];
                    if (i)
                        if (i.toLive) {
                            var o = i.repeat;
                            t.push('<rect transform="translate(', n / 2, ",", s / 2, ')"', ' x="', i.offsetX - n / 2, '" y="', i.offsetY - s / 2, '" ', 'width="', "repeat-y" === o || "no-repeat" === o ? i.source.width : n, '" height="', "repeat-x" === o || "no-repeat" === o ? i.source.height : s, '" fill="url(#SVGID_' + i.id + ')"', "></rect>\n")
                        } else t.push('<rect x="0" y="0" width="100%" height="100%" ', 'fill="', this[e], '"', "></rect>\n")
                },
                sendToBack: function(t) {
                    if (!t) return this;
                    var e, i, r, n = this._activeObject;
                    if (t === n && "activeSelection" === t.type)
                        for (e = (r = n._objects).length; e--;) i = r[e], h(this._objects, i), this._objects.unshift(i);
                    else h(this._objects, t), this._objects.unshift(t);
                    return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                bringToFront: function(t) {
                    if (!t) return this;
                    var e, i, r, n = this._activeObject;
                    if (t === n && "activeSelection" === t.type)
                        for (r = n._objects, e = 0; e < r.length; e++) i = r[e], h(this._objects, i), this._objects.push(i);
                    else h(this._objects, t), this._objects.push(t);
                    return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                sendBackwards: function(t, e) {
                    if (!t) return this;
                    var i, r, n, s, o, a = this._activeObject,
                        c = 0;
                    if (t === a && "activeSelection" === t.type)
                        for (o = a._objects, i = 0; i < o.length; i++) r = o[i], 0 + c < (n = this._objects.indexOf(r)) && (s = n - 1, h(this._objects, r), this._objects.splice(s, 0, r)), c++;
                    else 0 !== (n = this._objects.indexOf(t)) && (s = this._findNewLowerIndex(t, n, e), h(this._objects, t), this._objects.splice(s, 0, t));
                    return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                _findNewLowerIndex: function(t, e, i) {
                    var r, n;
                    if (i)
                        for (n = (r = e) - 1; 0 <= n; --n) { if (t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t)) { r = n; break } } else r = e - 1;
                    return r
                },
                bringForward: function(t, e) {
                    if (!t) return this;
                    var i, r, n, s, o, a = this._activeObject,
                        c = 0;
                    if (t === a && "activeSelection" === t.type)
                        for (i = (o = a._objects).length; i--;) r = o[i], (n = this._objects.indexOf(r)) < this._objects.length - 1 - c && (s = n + 1, h(this._objects, r), this._objects.splice(s, 0, r)), c++;
                    else(n = this._objects.indexOf(t)) !== this._objects.length - 1 && (s = this._findNewUpperIndex(t, n, e), h(this._objects, t), this._objects.splice(s, 0, t));
                    return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                _findNewUpperIndex: function(t, e, i) {
                    var r, n, s;
                    if (i)
                        for (n = (r = e) + 1, s = this._objects.length; n < s; ++n) { if (t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t)) { r = n; break } } else r = e + 1;
                    return r
                },
                moveTo: function(t, e) { return h(this._objects, t), this._objects.splice(e, 0, t), this.renderOnAddRemove && this.requestRenderAll() },
                dispose: function() { return this.isRendering && (fabric.util.cancelAnimFrame(this.isRendering), this.isRendering = 0), this.forEachObject(function(t) { t.dispose && t.dispose() }), this._objects = [], this.backgroundImage && this.backgroundImage.dispose && this.backgroundImage.dispose(), this.backgroundImage = null, this.overlayImage && this.overlayImage.dispose && this.overlayImage.dispose(), this.overlayImage = null, this._iTextInstances = null, this.contextContainer = null, fabric.util.cleanUpJsdomNode(this.lowerCanvasEl), this.lowerCanvasEl = void 0, this },
                toString: function() { return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this._objects.length + " }>" }
            }), n(fabric.StaticCanvas.prototype, fabric.Observable), n(fabric.StaticCanvas.prototype, fabric.Collection), n(fabric.StaticCanvas.prototype, fabric.DataURLExporter), n(fabric.StaticCanvas, {
                EMPTY_JSON: '{"objects": [], "background": "white"}',
                supports: function(t) {
                    var e = r();
                    if (!e || !e.getContext) return null;
                    var i = e.getContext("2d");
                    if (!i) return null;
                    switch (t) {
                        case "getImageData":
                            return void 0 !== i.getImageData;
                        case "setLineDash":
                            return void 0 !== i.setLineDash;
                        case "toDataURL":
                            return void 0 !== e.toDataURL;
                        case "toDataURLWithQuality":
                            try { return e.toDataURL("image/jpeg", 0), !0 } catch (t) {}
                            return !1;
                        default:
                            return null
                    }
                }
            }), fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject, fabric.isLikelyNode && (fabric.StaticCanvas.prototype.createPNGStream = function() { var t = i(this.lowerCanvasEl); return t && t.createPNGStream() }, fabric.StaticCanvas.prototype.createJPEGStream = function(t) { var e = i(this.lowerCanvasEl); return e && e.createJPEGStream(t) })
        }
    }(), fabric.BaseBrush = fabric.util.createClass({
        color: "rgb(0, 0, 0)",
        width: 1,
        shadow: null,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        strokeMiterLimit: 10,
        strokeDashArray: null,
        setShadow: function(t) { return this.shadow = new fabric.Shadow(t), this },
        _setBrushStyles: function() {
            var t = this.canvas.contextTop;
            t.strokeStyle = this.color, t.lineWidth = this.width, t.lineCap = this.strokeLineCap, t.miterLimit = this.strokeMiterLimit, t.lineJoin = this.strokeLineJoin, fabric.StaticCanvas.supports("setLineDash") && t.setLineDash(this.strokeDashArray || [])
        },
        _saveAndTransform: function(t) {
            var e = this.canvas.viewportTransform;
            t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
        },
        _setShadow: function() {
            if (this.shadow) {
                var t = this.canvas.contextTop,
                    e = this.canvas.getZoom();
                t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur * e, t.shadowOffsetX = this.shadow.offsetX * e, t.shadowOffsetY = this.shadow.offsetY * e
            }
        },
        _resetShadow: function() {
            var t = this.canvas.contextTop;
            t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0
        }
    }), fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
        initialize: function(t) { this.canvas = t, this._points = [] },
        _drawSegment: function(t, e, i) { var r = e.midPointFrom(i); return t.quadraticCurveTo(e.x, e.y, r.x, r.y), r },
        onMouseDown: function(t) { this._prepareForDrawing(t), this._captureDrawingPath(t), this._render() },
        onMouseMove: function(t) {
            if (this._captureDrawingPath(t) && 1 < this._points.length)
                if (this.needsFullRender) this.canvas.clearContext(this.canvas.contextTop), this._render();
                else {
                    var e = this._points,
                        i = e.length,
                        r = this.canvas.contextTop;
                    this._saveAndTransform(r), this.oldEnd && (r.beginPath(), r.moveTo(this.oldEnd.x, this.oldEnd.y)), this.oldEnd = this._drawSegment(r, e[i - 2], e[i - 1], !0), r.stroke(), r.restore()
                }
        },
        onMouseUp: function() { this.oldEnd = void 0, this._finalizeAndAddPath() },
        _prepareForDrawing: function(t) {
            var e = new fabric.Point(t.x, t.y);
            this._reset(), this._addPoint(e), this.canvas.contextTop.moveTo(e.x, e.y)
        },
        _addPoint: function(t) { return !(1 < this._points.length && t.eq(this._points[this._points.length - 1]) || (this._points.push(t), 0)) },
        _reset: function() {
            this._points.length = 0, this._setBrushStyles();
            var t = new fabric.Color(this.color);
            this.needsFullRender = t.getAlpha() < 1, this._setShadow()
        },
        _captureDrawingPath: function(t) { var e = new fabric.Point(t.x, t.y); return this._addPoint(e) },
        _render: function() {
            var t, e, i = this.canvas.contextTop,
                r = this._points[0],
                n = this._points[1];
            if (this._saveAndTransform(i), i.beginPath(), 2 === this._points.length && r.x === n.x && r.y === n.y) {
                var s = this.width / 1e3;
                r = new fabric.Point(r.x, r.y), n = new fabric.Point(n.x, n.y), r.x -= s, n.x += s
            }
            for (i.moveTo(r.x, r.y), t = 1, e = this._points.length; t < e; t++) this._drawSegment(i, r, n), r = this._points[t], n = this._points[t + 1];
            i.lineTo(r.x, r.y), i.stroke(), i.restore()
        },
        convertPointsToSVGPath: function(t) {
            var e, i = [],
                r = this.width / 1e3,
                n = new fabric.Point(t[0].x, t[0].y),
                s = new fabric.Point(t[1].x, t[1].y),
                o = t.length,
                a = 1,
                c = 1,
                h = 2 < o;
            for (h && (a = t[2].x < s.x ? -1 : t[2].x === s.x ? 0 : 1, c = t[2].y < s.y ? -1 : t[2].y === s.y ? 0 : 1), i.push("M ", n.x - a * r, " ", n.y - c * r, " "), e = 1; e < o; e++) {
                if (!n.eq(s)) {
                    var l = n.midPointFrom(s);
                    i.push("Q ", n.x, " ", n.y, " ", l.x, " ", l.y, " ")
                }
                n = t[e], e + 1 < t.length && (s = t[e + 1])
            }
            return h && (a = n.x > t[e - 2].x ? 1 : n.x === t[e - 2].x ? 0 : -1, c = n.y > t[e - 2].y ? 1 : n.y === t[e - 2].y ? 0 : -1), i.push("L ", n.x + a * r, " ", n.y + c * r), i
        },
        createPath: function(t) {
            var e = new fabric.Path(t, { fill: null, stroke: this.color, strokeWidth: this.width, strokeLineCap: this.strokeLineCap, strokeMiterLimit: this.strokeMiterLimit, strokeLineJoin: this.strokeLineJoin, strokeDashArray: this.strokeDashArray }),
                i = new fabric.Point(e.left + e.width / 2, e.top + e.height / 2);
            return i = e.translateToGivenOrigin(i, "center", "center", e.originX, e.originY), e.top = i.y, e.left = i.x, this.shadow && (this.shadow.affectStroke = !0, e.setShadow(this.shadow)), e
        },
        _finalizeAndAddPath: function() {
            this.canvas.contextTop.closePath();
            var t = this.convertPointsToSVGPath(this._points).join("");
            if ("M 0 0 Q 0 0 0 0 L 0 0" !== t) {
                var e = this.createPath(t);
                this.canvas.clearContext(this.canvas.contextTop), this.canvas.add(e), this.canvas.renderAll(), e.setCoords(), this._resetShadow(), this.canvas.fire("path:created", { path: e })
            } else this.canvas.requestRenderAll()
        }
    }), fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        initialize: function(t) { this.canvas = t, this.points = [] },
        drawDot: function(t) {
            var e = this.addPoint(t),
                i = this.canvas.contextTop;
            this._saveAndTransform(i), i.fillStyle = e.fill, i.beginPath(), i.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1), i.closePath(), i.fill(), i.restore()
        },
        onMouseDown: function(t) { this.points.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.drawDot(t) },
        _render: function() {
            var t, e, i, r = this.canvas.contextTop,
                n = this.points;
            for (this._saveAndTransform(r), t = 0, e = n.length; t < e; t++) i = n[t], r.fillStyle = i.fill, r.beginPath(), r.arc(i.x, i.y, i.radius, 0, 2 * Math.PI, !1), r.closePath(), r.fill();
            r.restore()
        },
        onMouseMove: function(t) { this.drawDot(t) },
        onMouseUp: function() {
            var t, e, i = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            var r = [];
            for (t = 0, e = this.points.length; t < e; t++) {
                var n = this.points[t],
                    s = new fabric.Circle({ radius: n.radius, left: n.x, top: n.y, originX: "center", originY: "center", fill: n.fill });
                this.shadow && s.setShadow(this.shadow), r.push(s)
            }
            var o = new fabric.Group(r);
            o.canvas = this.canvas, this.canvas.add(o), this.canvas.fire("path:created", { path: o }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = i, this.canvas.requestRenderAll()
        },
        addPoint: function(t) {
            var e = new fabric.Point(t.x, t.y),
                i = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
                r = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
            return e.radius = i, e.fill = r, this.points.push(e), e
        }
    }), fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        density: 20,
        dotWidth: 1,
        dotWidthVariance: 1,
        randomOpacity: !1,
        optimizeOverlapping: !0,
        initialize: function(t) { this.canvas = t, this.sprayChunks = [] },
        onMouseDown: function(t) { this.sprayChunks.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.addSprayChunk(t), this.render(this.sprayChunkPoints) },
        onMouseMove: function(t) { this.addSprayChunk(t), this.render(this.sprayChunkPoints) },
        onMouseUp: function() {
            var t = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            for (var e = [], i = 0, r = this.sprayChunks.length; i < r; i++)
                for (var n = this.sprayChunks[i], s = 0, o = n.length; s < o; s++) {
                    var a = new fabric.Rect({ width: n[s].width, height: n[s].width, left: n[s].x + 1, top: n[s].y + 1, originX: "center", originY: "center", fill: this.color });
                    e.push(a)
                }
            this.optimizeOverlapping && (e = this._getOptimizedRects(e));
            var c = new fabric.Group(e);
            this.shadow && c.setShadow(this.shadow), this.canvas.add(c), this.canvas.fire("path:created", { path: c }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.requestRenderAll()
        },
        _getOptimizedRects: function(t) { var e, i, r, n = {}; for (i = 0, r = t.length; i < r; i++) n[e = t[i].left + "" + t[i].top] || (n[e] = t[i]); var s = []; for (e in n) s.push(n[e]); return s },
        render: function(t) {
            var e, i, r = this.canvas.contextTop;
            for (r.fillStyle = this.color, this._saveAndTransform(r), e = 0, i = t.length; e < i; e++) {
                var n = t[e];
                void 0 !== n.opacity && (r.globalAlpha = n.opacity), r.fillRect(n.x, n.y, n.width, n.width)
            }
            r.restore()
        },
        _render: function() {
            var t, e, i = this.canvas.contextTop;
            for (i.fillStyle = this.color, this._saveAndTransform(i), t = 0, e = this.sprayChunks.length; t < e; t++) this.render(this.sprayChunks[t]);
            i.restore()
        },
        addSprayChunk: function(t) {
            this.sprayChunkPoints = [];
            var e, i, r, n, s = this.width / 2;
            for (n = 0; n < this.density; n++) {
                e = fabric.util.getRandomInt(t.x - s, t.x + s), i = fabric.util.getRandomInt(t.y - s, t.y + s), r = this.dotWidthVariance ? fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : this.dotWidth;
                var o = new fabric.Point(e, i);
                o.width = r, this.randomOpacity && (o.opacity = fabric.util.getRandomInt(0, 100) / 100), this.sprayChunkPoints.push(o)
            }
            this.sprayChunks.push(this.sprayChunkPoints)
        }
    }), fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
        getPatternSrc: function() {
            var t = fabric.util.createCanvasElement(),
                e = t.getContext("2d");
            return t.width = t.height = 25, e.fillStyle = this.color, e.beginPath(), e.arc(10, 10, 10, 0, 2 * Math.PI, !1), e.closePath(), e.fill(), t
        },
        getPatternSrcFunction: function() { return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"') },
        getPattern: function() { return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat") },
        _setBrushStyles: function() { this.callSuper("_setBrushStyles"), this.canvas.contextTop.strokeStyle = this.getPattern() },
        createPath: function(t) {
            var e = this.callSuper("createPath", t),
                i = e._getLeftTopCoords().scalarAdd(e.strokeWidth / 2);
            return e.stroke = new fabric.Pattern({ source: this.source || this.getPatternSrcFunction(), offsetX: -i.x, offsetY: -i.y }), e
        }
    }),
    function() {
        var c = fabric.util.getPointer,
            o = fabric.util.degreesToRadians,
            d = fabric.util.radiansToDegrees,
            g = Math.atan2,
            h = Math.abs,
            l = fabric.StaticCanvas.supports("setLineDash");
        for (var t in fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
                initialize: function(t, e) { e || (e = {}), this.renderAndResetBound = this.renderAndReset.bind(this), this.requestRenderAllBound = this.requestRenderAll.bind(this), this._initStatic(t, e), this._initInteractive(), this._createCacheCanvas() },
                uniScaleTransform: !1,
                uniScaleKey: "shiftKey",
                centeredScaling: !1,
                centeredRotation: !1,
                centeredKey: "altKey",
                altActionKey: "shiftKey",
                interactive: !0,
                selection: !0,
                selectionKey: "shiftKey",
                altSelectionKey: null,
                selectionColor: "rgba(100, 100, 255, 0.3)",
                selectionDashArray: [],
                selectionBorderColor: "rgba(255, 255, 255, 0.3)",
                selectionLineWidth: 1,
                selectionFullyContained: !1,
                hoverCursor: "move",
                moveCursor: "move",
                defaultCursor: "default",
                freeDrawingCursor: "crosshair",
                rotationCursor: "crosshair",
                notAllowedCursor: "not-allowed",
                containerClass: "canvas-container",
                perPixelTargetFind: !1,
                targetFindTolerance: 0,
                skipTargetFind: !1,
                isDrawingMode: !1,
                preserveObjectStacking: !1,
                snapAngle: 0,
                snapThreshold: null,
                stopContextMenu: !1,
                fireRightClick: !1,
                fireMiddleClick: !1,
                _initInteractive: function() { this._currentTransform = null, this._groupSelector = null, this._initWrapperElement(), this._createUpperCanvas(), this._initEventListeners(), this._initRetinaScaling(), this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this), this.calcOffset() },
                _chooseObjectsToRender: function() {
                    var t, e, i, r = this.getActiveObjects();
                    if (0 < r.length && !this.preserveObjectStacking) {
                        e = [], i = [];
                        for (var n = 0, s = this._objects.length; n < s; n++) t = this._objects[n], -1 === r.indexOf(t) ? e.push(t) : i.push(t);
                        1 < r.length && (this._activeObject._objects = i), e.push.apply(e, i)
                    } else e = this._objects;
                    return e
                },
                renderAll: function() {!this.contextTopDirty || this._groupSelector || this.isDrawingMode || (this.clearContext(this.contextTop), this.contextTopDirty = !1), this.hasLostContext && this.renderTopLayer(this.contextTop); var t = this.contextContainer; return this.renderCanvas(t, this._chooseObjectsToRender()), this },
                renderTopLayer: function(t) { this.isDrawingMode && this._isCurrentlyDrawing && (this.freeDrawingBrush && this.freeDrawingBrush._render(), this.contextTopDirty = !0), this.selection && this._groupSelector && (this._drawSelection(t), this.contextTopDirty = !0) },
                renderTop: function() { var t = this.contextTop; return this.clearContext(t), this.renderTopLayer(t), this.fire("after:render"), this },
                _resetCurrentTransform: function() {
                    var t = this._currentTransform;
                    t.target.set({ scaleX: t.original.scaleX, scaleY: t.original.scaleY, skewX: t.original.skewX, skewY: t.original.skewY, left: t.original.left, top: t.original.top }), this._shouldCenterTransform(t.target) ? ("center" !== t.originX && ("right" === t.originX ? t.mouseXSign = -1 : t.mouseXSign = 1), "center" !== t.originY && ("bottom" === t.originY ? t.mouseYSign = -1 : t.mouseYSign = 1), t.originX = "center", t.originY = "center") : (t.originX = t.original.originX, t.originY = t.original.originY)
                },
                containsPoint: function(t, e, i) { var r, n = i || this.getPointer(t, !0); return r = e.group && e.group === this._activeObject && "activeSelection" === e.group.type ? this._normalizePointer(e.group, n) : { x: n.x, y: n.y }, e.containsPoint(r) || e._findTargetCorner(n) },
                _normalizePointer: function(t, e) {
                    var i = t.calcTransformMatrix(),
                        r = fabric.util.invertTransform(i),
                        n = this.restorePointerVpt(e);
                    return fabric.util.transformPoint(n, r)
                },
                isTargetTransparent: function(t, e, i) {
                    if (t.shouldCache() && t._cacheCanvas) {
                        var r = this._normalizePointer(t, { x: e, y: i }),
                            n = t.cacheTranslationX + r.x * t.zoomX,
                            s = t.cacheTranslationY + r.y * t.zoomY;
                        return fabric.util.isTransparent(t._cacheContext, n, s, this.targetFindTolerance)
                    }
                    var o = this.contextCache,
                        a = t.selectionBackgroundColor,
                        c = this.viewportTransform;
                    return t.selectionBackgroundColor = "", this.clearContext(o), o.save(), o.transform(c[0], c[1], c[2], c[3], c[4], c[5]), t.render(o), o.restore(), t === this._activeObject && t._renderControls(o, { hasBorders: !1, transparentCorners: !1 }, { hasBorders: !1 }), t.selectionBackgroundColor = a, fabric.util.isTransparent(o, e, i, this.targetFindTolerance)
                },
                _isSelectionKeyPressed: function(e) { return "[object Array]" === Object.prototype.toString.call(this.selectionKey) ? !!this.selectionKey.find(function(t) { return !0 === e[t] }) : e[this.selectionKey] },
                _shouldClearSelection: function(t, e) {
                    var i = this.getActiveObjects(),
                        r = this._activeObject;
                    return !e || e && r && 1 < i.length && -1 === i.indexOf(e) && r !== e && !this._isSelectionKeyPressed(t) || e && !e.evented || e && !e.selectable && r && r !== e
                },
                _shouldCenterTransform: function(t) { if (t) { var e, i = this._currentTransform; return "scale" === i.action || "scaleX" === i.action || "scaleY" === i.action ? e = this.centeredScaling || t.centeredScaling : "rotate" === i.action && (e = this.centeredRotation || t.centeredRotation), e ? !i.altKey : i.altKey } },
                _getOriginFromCorner: function(t, e) { var i = { x: t.originX, y: t.originY }; return "ml" === e || "tl" === e || "bl" === e ? i.x = "right" : "mr" !== e && "tr" !== e && "br" !== e || (i.x = "left"), "tl" === e || "mt" === e || "tr" === e ? i.y = "bottom" : "bl" !== e && "mb" !== e && "br" !== e || (i.y = "top"), i },
                _getActionFromCorner: function(t, e, i) {
                    if (!e) return "drag";
                    switch (e) {
                        case "mtr":
                            return "rotate";
                        case "ml":
                        case "mr":
                            return i[this.altActionKey] ? "skewY" : "scaleX";
                        case "mt":
                        case "mb":
                            return i[this.altActionKey] ? "skewX" : "scaleY";
                        default:
                            return "scale"
                    }
                },
                _setupCurrentTransform: function(t, e) {
                    if (e) {
                        var i = this.getPointer(t),
                            r = e._findTargetCorner(this.getPointer(t, !0)),
                            n = this._getActionFromCorner(e, r, t),
                            s = this._getOriginFromCorner(e, r);
                        this._currentTransform = { target: e, action: n, corner: r, scaleX: e.scaleX, scaleY: e.scaleY, skewX: e.skewX, skewY: e.skewY, offsetX: i.x - e.left, offsetY: i.y - e.top, originX: s.x, originY: s.y, ex: i.x, ey: i.y, lastX: i.x, lastY: i.y, theta: o(e.angle), width: e.width * e.scaleX, mouseXSign: 1, mouseYSign: 1, shiftKey: t.shiftKey, altKey: t[this.centeredKey], original: fabric.util.saveObjectTransform(e) }, this._currentTransform.original.originX = s.x, this._currentTransform.original.originY = s.y, this._resetCurrentTransform(), this._beforeTransform(t)
                    }
                },
                _translateObject: function(t, e) {
                    var i = this._currentTransform,
                        r = i.target,
                        n = t - i.offsetX,
                        s = e - i.offsetY,
                        o = !r.get("lockMovementX") && r.left !== n,
                        a = !r.get("lockMovementY") && r.top !== s;
                    return o && r.set("left", n), a && r.set("top", s), o || a
                },
                _changeSkewTransformOrigin: function(t, e, i) {
                    var r = "originX",
                        n = { 0: "center" },
                        s = e.target.skewX,
                        o = "left",
                        a = "right",
                        c = "mt" === e.corner || "ml" === e.corner ? 1 : -1,
                        h = 1;
                    t = 0 < t ? 1 : -1, "y" === i && (s = e.target.skewY, o = "top", a = "bottom", r = "originY"), n[-1] = o, n[1] = a, e.target.flipX && (h *= -1), e.target.flipY && (h *= -1), 0 === s ? (e.skewSign = -c * t * h, e[r] = n[-t]) : (s = 0 < s ? 1 : -1, e.skewSign = s, e[r] = n[s * c * h])
                },
                _skewObject: function(t, e, i) {
                    var r, n = this._currentTransform,
                        s = n.target,
                        o = s.get("lockSkewingX"),
                        a = s.get("lockSkewingY");
                    if (o && "x" === i || a && "y" === i) return !1;
                    var c, h, l = s.getCenterPoint(),
                        u = s.toLocalPoint(new fabric.Point(t, e), "center", "center")[i],
                        f = s.toLocalPoint(new fabric.Point(n.lastX, n.lastY), "center", "center")[i],
                        d = s._getTransformedDimensions();
                    return this._changeSkewTransformOrigin(u - f, n, i), c = s.toLocalPoint(new fabric.Point(t, e), n.originX, n.originY)[i], h = s.translateToOriginPoint(l, n.originX, n.originY), r = this._setObjectSkew(c, n, i, d), n.lastX = t, n.lastY = e, s.setPositionByOrigin(h, n.originX, n.originY), r
                },
                _setObjectSkew: function(t, e, i, r) {
                    var n, s, o, a, c, h, l, u, f, d, g = e.target,
                        p = e.skewSign;
                    return "x" === i ? (c = "y", h = "Y", l = "X", f = 0, d = g.skewY) : (c = "x", h = "X", l = "Y", f = g.skewX, d = 0), a = g._getTransformedDimensions(f, d), (u = 2 * Math.abs(t) - a[i]) <= 2 ? n = 0 : (n = p * Math.atan(u / g["scale" + l] / (a[c] / g["scale" + h])), n = fabric.util.radiansToDegrees(n)), s = g["skew" + l] !== n, g.set("skew" + l, n), 0 !== g["skew" + h] && (o = g._getTransformedDimensions(), n = r[c] / o[c] * g["scale" + h], g.set("scale" + h, n)), s
                },
                _scaleObject: function(t, e, i) {
                    var r = this._currentTransform,
                        n = r.target,
                        s = n.lockScalingX,
                        o = n.lockScalingY,
                        a = n.lockScalingFlip;
                    if (s && o) return !1;
                    var c, h = n.translateToOriginPoint(n.getCenterPoint(), r.originX, r.originY),
                        l = n.toLocalPoint(new fabric.Point(t, e), r.originX, r.originY),
                        u = n._getTransformedDimensions();
                    return this._setLocalMouse(l, r), c = this._setObjectScale(l, r, s, o, i, a, u), n.setPositionByOrigin(h, r.originX, r.originY), c
                },
                _setObjectScale: function(t, e, i, r, n, s, o) {
                    var a, c, h, l, u = e.target,
                        f = !1,
                        d = !1,
                        g = !1;
                    return h = t.x * u.scaleX / o.x, l = t.y * u.scaleY / o.y, a = u.scaleX !== h, c = u.scaleY !== l, s && h <= 0 && h < u.scaleX && (f = !0, t.x = 0), s && l <= 0 && l < u.scaleY && (d = !0, t.y = 0), "equally" !== n || i || r ? n ? "x" !== n || u.get("lockUniScaling") ? "y" !== n || u.get("lockUniScaling") || d || r || u.set("scaleY", l) && (g = g || c) : f || i || u.set("scaleX", h) && (g = g || a) : (f || i || u.set("scaleX", h) && (g = g || a), d || r || u.set("scaleY", l) && (g = g || c)) : g = this._scaleObjectEqually(t, u, e, o), e.newScaleX = h, e.newScaleY = l, f || d || this._flipObject(e, n), g
                },
                _scaleObjectEqually: function(t, e, i, r) {
                    var n, s = t.y + t.x,
                        o = r.y * i.original.scaleY / e.scaleY + r.x * i.original.scaleX / e.scaleX,
                        a = t.x < 0 ? -1 : 1,
                        c = t.y < 0 ? -1 : 1;
                    return i.newScaleX = a * Math.abs(i.original.scaleX * s / o), i.newScaleY = c * Math.abs(i.original.scaleY * s / o), n = i.newScaleX !== e.scaleX || i.newScaleY !== e.scaleY, e.set("scaleX", i.newScaleX), e.set("scaleY", i.newScaleY), n
                },
                _flipObject: function(t, e) { t.newScaleX < 0 && "y" !== e && ("left" === t.originX ? t.originX = "right" : "right" === t.originX && (t.originX = "left")), t.newScaleY < 0 && "x" !== e && ("top" === t.originY ? t.originY = "bottom" : "bottom" === t.originY && (t.originY = "top")) },
                _setLocalMouse: function(t, e) {
                    var i = e.target,
                        r = this.getZoom(),
                        n = i.padding / r;
                    "right" === e.originX ? t.x *= -1 : "center" === e.originX && (t.x *= 2 * e.mouseXSign, t.x < 0 && (e.mouseXSign = -e.mouseXSign)), "bottom" === e.originY ? t.y *= -1 : "center" === e.originY && (t.y *= 2 * e.mouseYSign, t.y < 0 && (e.mouseYSign = -e.mouseYSign)), h(t.x) > n ? t.x < 0 ? t.x += n : t.x -= n : t.x = 0, h(t.y) > n ? t.y < 0 ? t.y += n : t.y -= n : t.y = 0
                },
                _rotateObject: function(t, e) {
                    var i = this._currentTransform,
                        r = i.target,
                        n = r.translateToOriginPoint(r.getCenterPoint(), i.originX, i.originY);
                    if (r.lockRotation) return !1;
                    var s = g(i.ey - n.y, i.ex - n.x),
                        o = g(e - n.y, t - n.x),
                        a = d(o - s + i.theta),
                        c = !0;
                    if (0 < r.snapAngle) {
                        var h = r.snapAngle,
                            l = r.snapThreshold || h,
                            u = Math.ceil(a / h) * h,
                            f = Math.floor(a / h) * h;
                        Math.abs(a - f) < l ? a = f : Math.abs(a - u) < l && (a = u)
                    }
                    return a < 0 && (a = 360 + a), a %= 360, r.angle === a ? c = !1 : (r.angle = a, r.setPositionByOrigin(n, i.originX, i.originY)), c
                },
                setCursor: function(t) { this.upperCanvasEl.style.cursor = t },
                _drawSelection: function(t) {
                    var e = this._groupSelector,
                        i = e.left,
                        r = e.top,
                        n = h(i),
                        s = h(r);
                    if (this.selectionColor && (t.fillStyle = this.selectionColor, t.fillRect(e.ex - (0 < i ? 0 : -i), e.ey - (0 < r ? 0 : -r), n, s)), this.selectionLineWidth && this.selectionBorderColor)
                        if (t.lineWidth = this.selectionLineWidth, t.strokeStyle = this.selectionBorderColor, 1 < this.selectionDashArray.length && !l) {
                            var o = e.ex + .5 - (0 < i ? 0 : n),
                                a = e.ey + .5 - (0 < r ? 0 : s);
                            t.beginPath(), fabric.util.drawDashedLine(t, o, a, o + n, a, this.selectionDashArray), fabric.util.drawDashedLine(t, o, a + s - 1, o + n, a + s - 1, this.selectionDashArray), fabric.util.drawDashedLine(t, o, a, o, a + s, this.selectionDashArray), fabric.util.drawDashedLine(t, o + n - 1, a, o + n - 1, a + s, this.selectionDashArray), t.closePath(), t.stroke()
                        } else fabric.Object.prototype._setLineDash.call(this, t, this.selectionDashArray), t.strokeRect(e.ex + .5 - (0 < i ? 0 : n), e.ey + .5 - (0 < r ? 0 : s), n, s)
                },
                findTarget: function(t, e) {
                    if (!this.skipTargetFind) {
                        var i, r, n = this.getPointer(t, !0),
                            s = this._activeObject,
                            o = this.getActiveObjects();
                        if (this.targets = [], 1 < o.length && !e && s === this._searchPossibleTargets([s], n)) return s;
                        if (1 === o.length && s._findTargetCorner(n)) return s;
                        if (1 === o.length && s === this._searchPossibleTargets([s], n)) {
                            if (!this.preserveObjectStacking) return s;
                            i = s, r = this.targets, this.targets = []
                        }
                        var a = this._searchPossibleTargets(this._objects, n);
                        return t[this.altSelectionKey] && a && i && a !== i && (a = i, this.targets = r), a
                    }
                },
                _checkTarget: function(t, e, i) { if (e && e.visible && e.evented && this.containsPoint(null, e, t)) { if (!this.perPixelTargetFind && !e.perPixelTargetFind || e.isEditing) return !0; if (!this.isTargetTransparent(e, i.x, i.y)) return !0 } },
                _searchPossibleTargets: function(t, e) {
                    for (var i, r, n = t.length; n--;) {
                        var s = t[n];
                        if (this._checkTarget(s.group && "activeSelection" !== s.group.type ? this._normalizePointer(s.group, e) : e, s, e)) {
                            (i = t[n]).subTargetCheck && i instanceof fabric.Group && (r = this._searchPossibleTargets(i._objects, e)) && this.targets.push(r);
                            break
                        }
                    }
                    return i
                },
                restorePointerVpt: function(t) { return fabric.util.transformPoint(t, fabric.util.invertTransform(this.viewportTransform)) },
                getPointer: function(t, e) {
                    if (this._absolutePointer && !e) return this._absolutePointer;
                    if (this._pointer && e) return this._pointer;
                    var i, r = c(t),
                        n = this.upperCanvasEl,
                        s = n.getBoundingClientRect(),
                        o = s.width || 0,
                        a = s.height || 0;
                    return o && a || ("top" in s && "bottom" in s && (a = Math.abs(s.top - s.bottom)), "right" in s && "left" in s && (o = Math.abs(s.right - s.left))), this.calcOffset(), r.x = r.x - this._offset.left, r.y = r.y - this._offset.top, e || (r = this.restorePointerVpt(r)), i = 0 === o || 0 === a ? { width: 1, height: 1 } : { width: n.width / o, height: n.height / a }, { x: r.x * i.width, y: r.y * i.height }
                },
                _createUpperCanvas: function() {
                    var t = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
                    this.upperCanvasEl ? this.upperCanvasEl.className = "" : this.upperCanvasEl = this._createCanvasElement(), fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + t), this.wrapperEl.appendChild(this.upperCanvasEl), this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl), this._applyCanvasStyle(this.upperCanvasEl), this.contextTop = this.upperCanvasEl.getContext("2d")
                },
                _createCacheCanvas: function() { this.cacheCanvasEl = this._createCanvasElement(), this.cacheCanvasEl.setAttribute("width", this.width), this.cacheCanvasEl.setAttribute("height", this.height), this.contextCache = this.cacheCanvasEl.getContext("2d") },
                _initWrapperElement: function() { this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", { class: this.containerClass }), fabric.util.setStyle(this.wrapperEl, { width: this.width + "px", height: this.height + "px", position: "relative" }), fabric.util.makeElementUnselectable(this.wrapperEl) },
                _applyCanvasStyle: function(t) {
                    var e = this.width || t.width,
                        i = this.height || t.height;
                    fabric.util.setStyle(t, { position: "absolute", width: e + "px", height: i + "px", left: 0, top: 0, "touch-action": this.allowTouchScrolling ? "manipulation" : "none" }), t.width = e, t.height = i, fabric.util.makeElementUnselectable(t)
                },
                _copyCanvasStyle: function(t, e) { e.style.cssText = t.style.cssText },
                getSelectionContext: function() { return this.contextTop },
                getSelectionElement: function() { return this.upperCanvasEl },
                getActiveObject: function() { return this._activeObject },
                getActiveObjects: function() { var t = this._activeObject; return t ? "activeSelection" === t.type && t._objects ? t._objects.slice(0) : [t] : [] },
                _onObjectRemoved: function(t) { t === this._activeObject && (this.fire("before:selection:cleared", { target: t }), this._discardActiveObject(), this.fire("selection:cleared", { target: t }), t.fire("deselected")), this._hoveredTarget === t && (this._hoveredTarget = null), this.callSuper("_onObjectRemoved", t) },
                _fireSelectionEvents: function(e, t) {
                    var i = !1,
                        r = this.getActiveObjects(),
                        n = [],
                        s = [],
                        o = { e: t };
                    e.forEach(function(t) {-1 === r.indexOf(t) && (i = !0, t.fire("deselected", o), s.push(t)) }), r.forEach(function(t) {-1 === e.indexOf(t) && (i = !0, t.fire("selected", o), n.push(t)) }), 0 < e.length && 0 < r.length ? (o.selected = n, o.deselected = s, o.updated = n[0] || s[0], o.target = this._activeObject, i && this.fire("selection:updated", o)) : 0 < r.length ? (1 === r.length && (o.target = n[0], this.fire("object:selected", o)), o.selected = n, o.target = this._activeObject, this.fire("selection:created", o)) : 0 < e.length && (o.deselected = s, this.fire("selection:cleared", o))
                },
                setActiveObject: function(t, e) { var i = this.getActiveObjects(); return this._setActiveObject(t, e), this._fireSelectionEvents(i, e), this },
                _setActiveObject: function(t, e) { return this._activeObject !== t && (!!this._discardActiveObject(e, t) && (!t.onSelect({ e: e }) && (this._activeObject = t, !0))) },
                _discardActiveObject: function(t, e) {
                    var i = this._activeObject;
                    if (i) {
                        if (i.onDeselect({ e: t, object: e })) return !1;
                        this._activeObject = null
                    }
                    return !0
                },
                discardActiveObject: function(t) { var e = this.getActiveObjects(); return e.length && this.fire("before:selection:cleared", { target: e[0], e: t }), this._discardActiveObject(t), this._fireSelectionEvents(e, t), this },
                dispose: function() { var t = this.wrapperEl; return this.removeListeners(), t.removeChild(this.upperCanvasEl), t.removeChild(this.lowerCanvasEl), this.contextCache = null, this.contextTop = null, ["upperCanvasEl", "cacheCanvasEl"].forEach(function(t) { fabric.util.cleanUpJsdomNode(this[t]), this[t] = void 0 }.bind(this)), t.parentNode && t.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl), delete this.wrapperEl, fabric.StaticCanvas.prototype.dispose.call(this), this },
                clear: function() { return this.discardActiveObject(), this.clearContext(this.contextTop), this.callSuper("clear") },
                drawControls: function(t) {
                    var e = this._activeObject;
                    e && e._renderControls(t)
                },
                _toObject: function(t, e, i) {
                    var r = this._realizeGroupTransformOnObject(t),
                        n = this.callSuper("_toObject", t, e, i);
                    return this._unwindGroupTransformOnObject(t, r), n
                },
                _realizeGroupTransformOnObject: function(e) { if (e.group && "activeSelection" === e.group.type && this._activeObject === e.group) { var i = {}; return ["angle", "flipX", "flipY", "left", "scaleX", "scaleY", "skewX", "skewY", "top"].forEach(function(t) { i[t] = e[t] }), this._activeObject.realizeTransform(e), i } return null },
                _unwindGroupTransformOnObject: function(t, e) { e && t.set(e) },
                _setSVGObject: function(t, e, i) {
                    var r = this._realizeGroupTransformOnObject(e);
                    this.callSuper("_setSVGObject", t, e, i), this._unwindGroupTransformOnObject(e, r)
                },
                setViewportTransform: function(t) { this.renderOnAddRemove && this._activeObject && this._activeObject.isEditing && this._activeObject.clearContextTop(), fabric.StaticCanvas.prototype.setViewportTransform.call(this, t) }
            }), fabric.StaticCanvas) "prototype" !== t && (fabric.Canvas[t] = fabric.StaticCanvas[t]);
        fabric.isTouchSupported && (fabric.Canvas.prototype._setCursorFromEvent = function() {})
    }(),
    function() {
        var n = { mt: 0, tr: 1, mr: 2, br: 3, mb: 4, bl: 5, ml: 6, tl: 7 },
            i = fabric.util.addListener,
            r = fabric.util.removeListener,
            s = { passive: !1 };

        function o(t, e) { return "which" in t ? t.which === e : t.button === e - 1 }
        fabric.util.object.extend(fabric.Canvas.prototype, {
            cursorMap: ["n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize"],
            _initEventListeners: function() { this.removeListeners(), this._bindEvents(), this.addOrRemove(i, "add") },
            addOrRemove: function(t, e) { t(fabric.window, "resize", this._onResize), t(this.upperCanvasEl, "mousedown", this._onMouseDown), t(this.upperCanvasEl, "mousemove", this._onMouseMove, s), t(this.upperCanvasEl, "mouseout", this._onMouseOut), t(this.upperCanvasEl, "mouseenter", this._onMouseEnter), t(this.upperCanvasEl, "wheel", this._onMouseWheel), t(this.upperCanvasEl, "contextmenu", this._onContextMenu), t(this.upperCanvasEl, "dblclick", this._onDoubleClick), t(this.upperCanvasEl, "touchstart", this._onMouseDown, s), t(this.upperCanvasEl, "touchmove", this._onMouseMove, s), t(this.upperCanvasEl, "dragover", this._onDragOver), t(this.upperCanvasEl, "dragenter", this._onDragEnter), t(this.upperCanvasEl, "dragleave", this._onDragLeave), t(this.upperCanvasEl, "drop", this._onDrop), "undefined" != typeof eventjs && e in eventjs && (eventjs[e](this.upperCanvasEl, "gesture", this._onGesture), eventjs[e](this.upperCanvasEl, "drag", this._onDrag), eventjs[e](this.upperCanvasEl, "orientation", this._onOrientationChange), eventjs[e](this.upperCanvasEl, "shake", this._onShake), eventjs[e](this.upperCanvasEl, "longpress", this._onLongPress)) },
            removeListeners: function() { this.addOrRemove(r, "remove"), r(fabric.document, "mouseup", this._onMouseUp), r(fabric.document, "touchend", this._onMouseUp, s), r(fabric.document, "mousemove", this._onMouseMove, s), r(fabric.document, "touchmove", this._onMouseMove, s) },
            _bindEvents: function() { this.eventsBound || (this._onMouseDown = this._onMouseDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onResize = this._onResize.bind(this), this._onGesture = this._onGesture.bind(this), this._onDrag = this._onDrag.bind(this), this._onShake = this._onShake.bind(this), this._onLongPress = this._onLongPress.bind(this), this._onOrientationChange = this._onOrientationChange.bind(this), this._onMouseWheel = this._onMouseWheel.bind(this), this._onMouseOut = this._onMouseOut.bind(this), this._onMouseEnter = this._onMouseEnter.bind(this), this._onContextMenu = this._onContextMenu.bind(this), this._onDoubleClick = this._onDoubleClick.bind(this), this._onDragOver = this._onDragOver.bind(this), this._onDragEnter = this._simpleEventHandler.bind(this, "dragenter"), this._onDragLeave = this._simpleEventHandler.bind(this, "dragleave"), this._onDrop = this._simpleEventHandler.bind(this, "drop"), this.eventsBound = !0) },
            _onGesture: function(t, e) { this.__onTransformGesture && this.__onTransformGesture(t, e) },
            _onDrag: function(t, e) { this.__onDrag && this.__onDrag(t, e) },
            _onMouseWheel: function(t) { this.__onMouseWheel(t) },
            _onMouseOut: function(t) {
                var e = this._hoveredTarget;
                this.fire("mouse:out", { target: e, e: t }), this._hoveredTarget = null, e && e.fire("mouseout", { e: t }), this._iTextInstances && this._iTextInstances.forEach(function(t) { t.isEditing && t.hiddenTextarea.focus() })
            },
            _onMouseEnter: function(t) { this.findTarget(t) || (this.fire("mouse:over", { target: null, e: t }), this._hoveredTarget = null) },
            _onOrientationChange: function(t, e) { this.__onOrientationChange && this.__onOrientationChange(t, e) },
            _onShake: function(t, e) { this.__onShake && this.__onShake(t, e) },
            _onLongPress: function(t, e) { this.__onLongPress && this.__onLongPress(t, e) },
            _onDragOver: function(t) {
                t.preventDefault();
                var e = this._simpleEventHandler("dragover", t);
                this._fireEnterLeaveEvents(e, t)
            },
            _onContextMenu: function(t) { return this.stopContextMenu && (t.stopPropagation(), t.preventDefault()), !1 },
            _onDoubleClick: function(t) { this._cacheTransformEventData(t), this._handleEvent(t, "dblclick"), this._resetTransformEventData(t) },
            _onMouseDown: function(t) { this.__onMouseDown(t), this._resetTransformEventData(), i(fabric.document, "touchend", this._onMouseUp, s), i(fabric.document, "touchmove", this._onMouseMove, s), r(this.upperCanvasEl, "mousemove", this._onMouseMove, s), r(this.upperCanvasEl, "touchmove", this._onMouseMove, s), "touchstart" === t.type ? r(this.upperCanvasEl, "mousedown", this._onMouseDown) : (i(fabric.document, "mouseup", this._onMouseUp), i(fabric.document, "mousemove", this._onMouseMove, s)) },
            _onMouseUp: function(t) {
                if (this.__onMouseUp(t), this._resetTransformEventData(), r(fabric.document, "mouseup", this._onMouseUp), r(fabric.document, "touchend", this._onMouseUp, s), r(fabric.document, "mousemove", this._onMouseMove, s), r(fabric.document, "touchmove", this._onMouseMove, s), i(this.upperCanvasEl, "mousemove", this._onMouseMove, s), i(this.upperCanvasEl, "touchmove", this._onMouseMove, s), "touchend" === t.type) {
                    var e = this;
                    setTimeout(function() { i(e.upperCanvasEl, "mousedown", e._onMouseDown) }, 400)
                }
            },
            _onMouseMove: function(t) {!this.allowTouchScrolling && t.preventDefault && t.preventDefault(), this.__onMouseMove(t) },
            _onResize: function() { this.calcOffset() },
            _shouldRender: function(t) { var e = this._activeObject; return !!(!!e != !!t || e && t && e !== t) || (e && e.isEditing, !1) },
            __onMouseUp: function(t) {
                var e, i = this._currentTransform,
                    r = this._groupSelector,
                    n = !1,
                    s = !r || 0 === r.left && 0 === r.top;
                if (this._cacheTransformEventData(t), e = this._target, this._handleEvent(t, "up:before"), !o(t, 3)) return o(t, 2) ? (this.fireMiddleClick && this._handleEvent(t, "up", 2, s), void this._resetTransformEventData()) : void(this.isDrawingMode && this._isCurrentlyDrawing ? this._onMouseUpInDrawingMode(t) : (i && (this._finalizeCurrentTransform(t), n = i.actionPerformed), s || (this._maybeGroupObjects(t), n || (n = this._shouldRender(e))), e && (e.isMoving = !1), this._setCursorFromEvent(t, e), this._handleEvent(t, "up", 1, s), this._groupSelector = null, this._currentTransform = null, e && (e.__corner = 0), n ? this.requestRenderAll() : s || this.renderTop()));
                this.fireRightClick && this._handleEvent(t, "up", 3, s)
            },
            _simpleEventHandler: function(t, e) {
                var i = this.findTarget(e),
                    r = this.targets,
                    n = { e: e, target: i, subTargets: r };
                if (this.fire(t, n), i && i.fire(t, n), !r) return i;
                for (var s = 0; s < r.length; s++) r[s].fire(t, n);
                return i
            },
            _handleEvent: function(t, e, i, r) {
                var n = this._target,
                    s = this.targets || [],
                    o = { e: t, target: n, subTargets: s, button: i || 1, isClick: r || !1, pointer: this._pointer, absolutePointer: this._absolutePointer, transform: this._currentTransform };
                this.fire("mouse:" + e, o), n && n.fire("mouse" + e, o);
                for (var a = 0; a < s.length; a++) s[a].fire("mouse" + e, o)
            },
            _finalizeCurrentTransform: function(t) {
                var e, i = this._currentTransform,
                    r = i.target,
                    n = { e: t, target: r, transform: i };
                r._scaling && (r._scaling = !1), r.setCoords(), (i.actionPerformed || this.stateful && r.hasStateChanged()) && (i.actionPerformed && (e = this._addEventOptions(n, i), this._fire(e, n)), this._fire("modified", n))
            },
            _addEventOptions: function(t, e) {
                var i, r;
                switch (e.action) {
                    case "scaleX":
                        i = "scaled", r = "x";
                        break;
                    case "scaleY":
                        i = "scaled", r = "y";
                        break;
                    case "skewX":
                        i = "skewed", r = "x";
                        break;
                    case "skewY":
                        i = "skewed", r = "y";
                        break;
                    case "scale":
                        i = "scaled", r = "equally";
                        break;
                    case "rotate":
                        i = "rotated";
                        break;
                    case "drag":
                        i = "moved"
                }
                return t.by = r, i
            },
            _onMouseDownInDrawingMode: function(t) {
                this._isCurrentlyDrawing = !0, this.getActiveObject() && this.discardActiveObject(t).requestRenderAll(), this.clipTo && fabric.util.clipContext(this, this.contextTop);
                var e = this.getPointer(t);
                this.freeDrawingBrush.onMouseDown(e), this._handleEvent(t, "down")
            },
            _onMouseMoveInDrawingMode: function(t) {
                if (this._isCurrentlyDrawing) {
                    var e = this.getPointer(t);
                    this.freeDrawingBrush.onMouseMove(e)
                }
                this.setCursor(this.freeDrawingCursor), this._handleEvent(t, "move")
            },
            _onMouseUpInDrawingMode: function(t) { this._isCurrentlyDrawing = !1, this.clipTo && this.contextTop.restore(), this.freeDrawingBrush.onMouseUp(), this._handleEvent(t, "up") },
            __onMouseDown: function(t) {
                this._cacheTransformEventData(t), this._handleEvent(t, "down:before");
                var e = this._target;
                if (o(t, 3)) this.fireRightClick && this._handleEvent(t, "down", 3);
                else if (o(t, 2)) this.fireMiddleClick && this._handleEvent(t, "down", 2);
                else if (this.isDrawingMode) this._onMouseDownInDrawingMode(t);
                else if (!this._currentTransform) {
                    var i = this._pointer;
                    this._previousPointer = i;
                    var r = this._shouldRender(e),
                        n = this._shouldGroup(t, e);
                    this._shouldClearSelection(t, e) ? this.discardActiveObject(t) : n && (this._handleGrouping(t, e), e = this._activeObject), !this.selection || e && (e.selectable || e.isEditing || e === this._activeObject) || (this._groupSelector = { ex: i.x, ey: i.y, top: 0, left: 0 }), e && (e.selectable && this.setActiveObject(e, t), e !== this._activeObject || !e.__corner && n || this._setupCurrentTransform(t, e)), this._handleEvent(t, "down"), (r || n) && this.requestRenderAll()
                }
            },
            _resetTransformEventData: function() { this._target = null, this._pointer = null, this._absolutePointer = null },
            _cacheTransformEventData: function(t) { this._resetTransformEventData(), this._pointer = this.getPointer(t, !0), this._absolutePointer = this.restorePointerVpt(this._pointer), this._target = this._currentTransform ? this._currentTransform.target : this.findTarget(t) || null },
            _beforeTransform: function(t) {
                var e = this._currentTransform;
                this.stateful && e.target.saveState(), this.fire("before:transform", { e: t, transform: e }), e.corner && this.onBeforeScaleRotate(e.target)
            },
            __onMouseMove: function(t) {
                var e, i;
                if (this._handleEvent(t, "move:before"), this._cacheTransformEventData(t), this.isDrawingMode) this._onMouseMoveInDrawingMode(t);
                else if (!(void 0 !== t.touches && 1 < t.touches.length)) {
                    var r = this._groupSelector;
                    r ? (i = this._pointer, r.left = i.x - r.ex, r.top = i.y - r.ey, this.renderTop()) : this._currentTransform ? this._transformObject(t) : (e = this.findTarget(t) || null, this._setCursorFromEvent(t, e), this._fireOverOutEvents(e, t)), this._handleEvent(t, "move"), this._resetTransformEventData()
                }
            },
            _fireOverOutEvents: function(t, e) { this.fireSynteticInOutEvents(t, e, { targetName: "_hoveredTarget", canvasEvtOut: "mouse:out", evtOut: "mouseout", canvasEvtIn: "mouse:over", evtIn: "mouseover" }) },
            _fireEnterLeaveEvents: function(t, e) { this.fireSynteticInOutEvents(t, e, { targetName: "_draggedoverTarget", evtOut: "dragleave", evtIn: "dragenter" }) },
            fireSynteticInOutEvents: function(t, e, i) {
                var r, n, s, o = this[i.targetName],
                    a = o !== t,
                    c = i.canvasEvtIn,
                    h = i.canvasEvtOut;
                a && (r = { e: e, target: t, previousTarget: o }, n = { e: e, target: o, nextTarget: t }, this[i.targetName] = t), s = t && a, o && a && (h && this.fire(h, n), o.fire(i.evtOut, n)), s && (c && this.fire(c, r), t.fire(i.evtIn, r))
            },
            __onMouseWheel: function(t) { this._cacheTransformEventData(t), this._handleEvent(t, "wheel"), this._resetTransformEventData() },
            _transformObject: function(t) {
                var e = this.getPointer(t),
                    i = this._currentTransform;
                i.reset = !1, i.target.isMoving = !0, i.shiftKey = t.shiftKey, i.altKey = t[this.centeredKey], this._beforeScaleTransform(t, i), this._performTransformAction(t, i, e), i.actionPerformed && this.requestRenderAll()
            },
            _performTransformAction: function(t, e, i) {
                var r = i.x,
                    n = i.y,
                    s = e.action,
                    o = !1,
                    a = { target: e.target, e: t, transform: e, pointer: i };
                "rotate" === s ? (o = this._rotateObject(r, n)) && this._fire("rotating", a) : "scale" === s ? (o = this._onScale(t, e, r, n)) && this._fire("scaling", a) : "scaleX" === s ? (o = this._scaleObject(r, n, "x")) && this._fire("scaling", a) : "scaleY" === s ? (o = this._scaleObject(r, n, "y")) && this._fire("scaling", a) : "skewX" === s ? (o = this._skewObject(r, n, "x")) && this._fire("skewing", a) : "skewY" === s ? (o = this._skewObject(r, n, "y")) && this._fire("skewing", a) : (o = this._translateObject(r, n)) && (this._fire("moving", a), this.setCursor(a.target.moveCursor || this.moveCursor)), e.actionPerformed = e.actionPerformed || o
            },
            _fire: function(t, e) { this.fire("object:" + t, e), e.target.fire(t, e) },
            _beforeScaleTransform: function(t, e) {
                if ("scale" === e.action || "scaleX" === e.action || "scaleY" === e.action) {
                    var i = this._shouldCenterTransform(e.target);
                    (i && ("center" !== e.originX || "center" !== e.originY) || !i && "center" === e.originX && "center" === e.originY) && (this._resetCurrentTransform(), e.reset = !0)
                }
            },
            _onScale: function(t, e, i, r) { return this._isUniscalePossible(t, e.target) ? (e.currentAction = "scale", this._scaleObject(i, r)) : (e.reset || "scale" !== e.currentAction || this._resetCurrentTransform(), e.currentAction = "scaleEqually", this._scaleObject(i, r, "equally")) },
            _isUniscalePossible: function(t, e) { return (t[this.uniScaleKey] || this.uniScaleTransform) && !e.get("lockUniScaling") },
            _setCursorFromEvent: function(t, e) {
                if (!e) return this.setCursor(this.defaultCursor), !1;
                var i = e.hoverCursor || this.hoverCursor,
                    r = this._activeObject && "activeSelection" === this._activeObject.type ? this._activeObject : null,
                    n = (!r || !r.contains(e)) && e._findTargetCorner(this.getPointer(t, !0));
                n ? this.setCursor(this.getCornerCursor(n, e, t)) : this.setCursor(i)
            },
            getCornerCursor: function(t, e, i) { return this.actionIsDisabled(t, e, i) ? this.notAllowedCursor : t in n ? this._getRotatedCornerCursor(t, e, i) : "mtr" === t && e.hasRotatingPoint ? this.rotationCursor : this.defaultCursor },
            actionIsDisabled: function(t, e, i) { return "mt" === t || "mb" === t ? i[this.altActionKey] ? e.lockSkewingX : e.lockScalingY : "ml" === t || "mr" === t ? i[this.altActionKey] ? e.lockSkewingY : e.lockScalingX : "mtr" === t ? e.lockRotation : this._isUniscalePossible(i, e) ? e.lockScalingX && e.lockScalingY : e.lockScalingX || e.lockScalingY },
            _getRotatedCornerCursor: function(t, e, i) { var r = Math.round(e.angle % 360 / 45); return r < 0 && (r += 8), r += n[t], i[this.altActionKey] && n[t] % 2 == 0 && (r += 2), r %= 8, this.cursorMap[r] }
        })
    }(),
    function() {
        var u = Math.min,
            f = Math.max;
        fabric.util.object.extend(fabric.Canvas.prototype, {
            _shouldGroup: function(t, e) { var i = this._activeObject; return i && this._isSelectionKeyPressed(t) && e && e.selectable && this.selection && (i !== e || "activeSelection" === i.type) },
            _handleGrouping: function(t, e) {
                var i = this._activeObject;
                i.__corner || (e !== i || (e = this.findTarget(t, !0))) && (i && "activeSelection" === i.type ? this._updateActiveSelection(e, t) : this._createActiveSelection(e, t))
            },
            _updateActiveSelection: function(t, e) {
                var i = this._activeObject,
                    r = i._objects.slice(0);
                i.contains(t) ? (i.removeWithUpdate(t), this._hoveredTarget = t, 1 === i.size() && this._setActiveObject(i.item(0), e)) : (i.addWithUpdate(t), this._hoveredTarget = i), this._fireSelectionEvents(r, e)
            },
            _createActiveSelection: function(t, e) {
                var i = this.getActiveObjects(),
                    r = this._createGroup(t);
                this._hoveredTarget = r, this._setActiveObject(r, e), this._fireSelectionEvents(i, e)
            },
            _createGroup: function(t) {
                var e = this._objects,
                    i = e.indexOf(this._activeObject) < e.indexOf(t) ? [this._activeObject, t] : [t, this._activeObject];
                return this._activeObject.isEditing && this._activeObject.exitEditing(), new fabric.ActiveSelection(i, { canvas: this })
            },
            _groupSelectedObjects: function(t) {
                var e, i = this._collectObjects();
                1 === i.length ? this.setActiveObject(i[0], t) : 1 < i.length && (e = new fabric.ActiveSelection(i.reverse(), { canvas: this }), this.setActiveObject(e, t))
            },
            _collectObjects: function() { for (var t, e = [], i = this._groupSelector.ex, r = this._groupSelector.ey, n = i + this._groupSelector.left, s = r + this._groupSelector.top, o = new fabric.Point(u(i, n), u(r, s)), a = new fabric.Point(f(i, n), f(r, s)), c = !this.selectionFullyContained, h = i === n && r === s, l = this._objects.length; l-- && !((t = this._objects[l]) && t.selectable && t.visible && (c && t.intersectsWithRect(o, a) || t.isContainedWithinRect(o, a) || c && t.containsPoint(o) || c && t.containsPoint(a)) && (e.push(t), h));); return e },
            _maybeGroupObjects: function(t) { this.selection && this._groupSelector && this._groupSelectedObjects(t), this.setCursor(this.defaultCursor), this._groupSelector = null }
        })
    }(),
    function() {
        var r = fabric.StaticCanvas.supports("toDataURLWithQuality");
        fabric.util.object.extend(fabric.StaticCanvas.prototype, {
            toDataURL: function(t) {
                t || (t = {});
                var e = t.format || "png",
                    i = t.quality || 1,
                    r = (t.multiplier || 1) * (t.enableRetinaScaling ? 1 : 1 / this.getRetinaScaling()),
                    n = { left: t.left || 0, top: t.top || 0, width: t.width || 0, height: t.height || 0 };
                return this.__toDataURLWithMultiplier(e, i, n, r)
            },
            __toDataURLWithMultiplier: function(t, e, i, r) {
                var n = this.width,
                    s = this.height,
                    o = (i.width || this.width) * r,
                    a = (i.height || this.height) * r,
                    c = this.getZoom() * r,
                    h = this.viewportTransform,
                    l = [c, 0, 0, c, (h[4] - i.left) * r, (h[5] - i.top) * r],
                    u = this.interactive,
                    f = this.skipOffscreen,
                    d = n !== o || s !== a;
                this.viewportTransform = l, this.skipOffscreen = !1, this.interactive = !1, d && this.setDimensions({ width: o, height: a }, { backstoreOnly: !0 }), this.renderAll();
                var g = this.__toDataURL(t, e, i);
                return this.interactive = u, this.skipOffscreen = f, this.viewportTransform = h, d && this.setDimensions({ width: n, height: s }, { backstoreOnly: !0 }), this.renderAll(), g
            },
            __toDataURL: function(t, e) { var i = this.contextContainer.canvas; return r ? i.toDataURL("image/" + t, e) : i.toDataURL("image/" + t) }
        })
    }(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        loadFromDatalessJSON: function(t, e, i) { return this.loadFromJSON(t, e, i) },
        loadFromJSON: function(t, e, i) {
            if (t) {
                var r = "string" == typeof t ? JSON.parse(t) : fabric.util.object.clone(t),
                    n = this,
                    s = this.renderOnAddRemove;
                return this.renderOnAddRemove = !1, this._enlivenObjects(r.objects, function(t) { n.clear(), n._setBgOverlay(r, function() { t.forEach(function(t, e) { n.insertAt(t, e) }), n.renderOnAddRemove = s, delete r.objects, delete r.backgroundImage, delete r.overlayImage, delete r.background, delete r.overlay, n._setOptions(r), n.renderAll(), e && e() }) }, i), this
            }
        },
        _setBgOverlay: function(t, e) {
            var i = { backgroundColor: !1, overlayColor: !1, backgroundImage: !1, overlayImage: !1 };
            if (t.backgroundImage || t.overlayImage || t.background || t.overlay) {
                var r = function() { i.backgroundImage && i.overlayImage && i.backgroundColor && i.overlayColor && e && e() };
                this.__setBgOverlay("backgroundImage", t.backgroundImage, i, r), this.__setBgOverlay("overlayImage", t.overlayImage, i, r), this.__setBgOverlay("backgroundColor", t.background, i, r), this.__setBgOverlay("overlayColor", t.overlay, i, r)
            } else e && e()
        },
        __setBgOverlay: function(e, t, i, r) { var n = this; if (!t) return i[e] = !0, void(r && r()); "backgroundImage" === e || "overlayImage" === e ? fabric.util.enlivenObjects([t], function(t) { n[e] = t[0], i[e] = !0, r && r() }) : this["set" + fabric.util.string.capitalize(e, !0)](t, function() { i[e] = !0, r && r() }) },
        _enlivenObjects: function(t, e, i) { t && 0 !== t.length ? fabric.util.enlivenObjects(t, function(t) { e && e(t) }, null, i) : e && e([]) },
        _toDataURL: function(e, i) { this.clone(function(t) { i(t.toDataURL(e)) }) },
        _toDataURLWithMultiplier: function(e, i, r) { this.clone(function(t) { r(t.toDataURLWithMultiplier(e, i)) }) },
        clone: function(e, t) {
            var i = JSON.stringify(this.toJSON(t));
            this.cloneWithoutData(function(t) { t.loadFromJSON(i, function() { e && e(t) }) })
        },
        cloneWithoutData: function(t) {
            var e = fabric.util.createCanvasElement();
            e.width = this.width, e.height = this.height;
            var i = new fabric.Canvas(e);
            i.clipTo = this.clipTo, this.backgroundImage ? (i.setBackgroundImage(this.backgroundImage.src, function() { i.renderAll(), t && t(i) }), i.backgroundImageOpacity = this.backgroundImageOpacity, i.backgroundImageStretch = this.backgroundImageStretch) : t && t(i)
        }
    }),
    function(t) {
        "use strict";
        var x = t.fabric || (t.fabric = {}),
            e = x.util.object.extend,
            o = x.util.object.clone,
            r = x.util.toFixed,
            i = x.util.string.capitalize,
            a = x.util.degreesToRadians,
            n = x.StaticCanvas.supports("setLineDash"),
            s = !x.isLikelyNode;
        x.Object || (x.Object = x.util.createClass(x.CommonMethods, {
            type: "object",
            originX: "left",
            originY: "top",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            scaleX: 1,
            scaleY: 1,
            flipX: !1,
            flipY: !1,
            opacity: 1,
            angle: 0,
            skewX: 0,
            skewY: 0,
            cornerSize: 13,
            transparentCorners: !0,
            hoverCursor: null,
            moveCursor: null,
            padding: 0,
            borderColor: "rgba(102,153,255,0.75)",
            borderDashArray: null,
            cornerColor: "rgba(102,153,255,0.5)",
            cornerStrokeColor: null,
            cornerStyle: "rect",
            cornerDashArray: null,
            centeredScaling: !1,
            centeredRotation: !0,
            fill: "rgb(0,0,0)",
            fillRule: "nonzero",
            globalCompositeOperation: "source-over",
            backgroundColor: "",
            selectionBackgroundColor: "",
            stroke: null,
            strokeWidth: 1,
            strokeDashArray: null,
            strokeLineCap: "butt",
            strokeLineJoin: "miter",
            strokeMiterLimit: 4,
            shadow: null,
            borderOpacityWhenMoving: .4,
            borderScaleFactor: 1,
            transformMatrix: null,
            minScaleLimit: 0,
            selectable: !0,
            evented: !0,
            visible: !0,
            hasControls: !0,
            hasBorders: !0,
            hasRotatingPoint: !0,
            rotatingPointOffset: 40,
            perPixelTargetFind: !1,
            includeDefaultValues: !0,
            clipTo: null,
            lockMovementX: !1,
            lockMovementY: !1,
            lockRotation: !1,
            lockScalingX: !1,
            lockScalingY: !1,
            lockUniScaling: !1,
            lockSkewingX: !1,
            lockSkewingY: !1,
            lockScalingFlip: !1,
            excludeFromExport: !1,
            objectCaching: s,
            statefullCache: !1,
            noScaleCache: !0,
            dirty: !0,
            __corner: 0,
            paintFirst: "fill",
            stateProperties: "top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill globalCompositeOperation shadow clipTo visible backgroundColor skewX skewY fillRule paintFirst".split(" "),
            cacheProperties: "fill stroke strokeWidth strokeDashArray width height paintFirst strokeLineCap strokeLineJoin strokeMiterLimit backgroundColor".split(" "),
            clipPath: void 0,
            inverted: !1,
            absolutePositioned: !1,
            initialize: function(t) { t && this.setOptions(t) },
            _createCacheCanvas: function() { this._cacheProperties = {}, this._cacheCanvas = x.util.createCanvasElement(), this._cacheContext = this._cacheCanvas.getContext("2d"), this._updateCacheCanvas(), this.dirty = !0 },
            _limitCacheSize: function(t) {
                var e = x.perfLimitSizeTotal,
                    i = t.width,
                    r = t.height,
                    n = x.maxCacheSideLimit,
                    s = x.minCacheSideLimit;
                if (i <= n && r <= n && i * r <= e) return i < s && (t.width = s), r < s && (t.height = s), t;
                var o = i / r,
                    a = x.util.limitDimsByArea(o, e),
                    c = x.util.capValue,
                    h = c(s, a.x, n),
                    l = c(s, a.y, n);
                return h < i && (t.zoomX /= i / h, t.width = h, t.capped = !0), l < r && (t.zoomY /= r / l, t.height = l, t.capped = !0), t
            },
            _getCacheCanvasDimensions: function() {
                var t = this.getTotalObjectScaling(),
                    e = this._getNonTransformedDimensions(),
                    i = t.scaleX,
                    r = t.scaleY;
                return { width: e.x * i + 2, height: e.y * r + 2, zoomX: i, zoomY: r, x: e.x, y: e.y }
            },
            _updateCacheCanvas: function() {
                var t = this.canvas;
                if (this.noScaleCache && t && t._currentTransform) {
                    var e = t._currentTransform.target,
                        i = t._currentTransform.action;
                    if (this === e && i.slice && "scale" === i.slice(0, 5)) return !1
                }
                var r, n, s = this._cacheCanvas,
                    o = this._limitCacheSize(this._getCacheCanvasDimensions()),
                    a = x.minCacheSideLimit,
                    c = o.width,
                    h = o.height,
                    l = o.zoomX,
                    u = o.zoomY,
                    f = c !== this.cacheWidth || h !== this.cacheHeight,
                    d = this.zoomX !== l || this.zoomY !== u,
                    g = f || d,
                    p = 0,
                    v = 0,
                    m = !1;
                if (f) {
                    var b = this._cacheCanvas.width,
                        _ = this._cacheCanvas.height,
                        y = b < c || _ < h;
                    m = y || (c < .9 * b || h < .9 * _) && a < b && a < _, y && !o.capped && (a < c || a < h) && (p = .1 * c, v = .1 * h)
                }
                return !!g && (m ? (s.width = Math.ceil(c + p), s.height = Math.ceil(h + v)) : (this._cacheContext.setTransform(1, 0, 0, 1, 0, 0), this._cacheContext.clearRect(0, 0, s.width, s.height)), r = o.x * l / 2, n = o.y * u / 2, this.cacheTranslationX = Math.round(s.width / 2 - r) + r, this.cacheTranslationY = Math.round(s.height / 2 - n) + n, this.cacheWidth = c, this.cacheHeight = h, this._cacheContext.translate(this.cacheTranslationX, this.cacheTranslationY), this._cacheContext.scale(l, u), this.zoomX = l, this.zoomY = u, !0)
            },
            setOptions: function(t) { this._setOptions(t), this._initGradient(t.fill, "fill"), this._initGradient(t.stroke, "stroke"), this._initClipping(t), this._initPattern(t.fill, "fill"), this._initPattern(t.stroke, "stroke") },
            transform: function(t) {
                var e;
                e = this.group && !this.group._transformDone ? this.calcTransformMatrix() : this.calcOwnMatrix(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
            },
            toObject: function(t) {
                var e = x.Object.NUM_FRACTION_DIGITS,
                    i = { type: this.type, version: x.version, originX: this.originX, originY: this.originY, left: r(this.left, e), top: r(this.top, e), width: r(this.width, e), height: r(this.height, e), fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill, stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke, strokeWidth: r(this.strokeWidth, e), strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray, strokeLineCap: this.strokeLineCap, strokeLineJoin: this.strokeLineJoin, strokeMiterLimit: r(this.strokeMiterLimit, e), scaleX: r(this.scaleX, e), scaleY: r(this.scaleY, e), angle: r(this.angle, e), flipX: this.flipX, flipY: this.flipY, opacity: r(this.opacity, e), shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow, visible: this.visible, clipTo: this.clipTo && String(this.clipTo), backgroundColor: this.backgroundColor, fillRule: this.fillRule, paintFirst: this.paintFirst, globalCompositeOperation: this.globalCompositeOperation, transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : null, skewX: r(this.skewX, e), skewY: r(this.skewY, e) };
                return this.clipPath && (i.clipPath = this.clipPath.toObject(t), i.clipPath.inverted = this.clipPath.inverted, i.clipPath.absolutePositioned = this.clipPath.absolutePositioned), x.util.populateWithProperties(this, i, t), this.includeDefaultValues || (i = this._removeDefaultValues(i)), i
            },
            toDatalessObject: function(t) { return this.toObject(t) },
            _removeDefaultValues: function(e) { var i = x.util.getKlass(e.type).prototype; return i.stateProperties.forEach(function(t) { e[t] === i[t] && delete e[t], "[object Array]" === Object.prototype.toString.call(e[t]) && "[object Array]" === Object.prototype.toString.call(i[t]) && 0 === e[t].length && 0 === i[t].length && delete e[t] }), e },
            toString: function() { return "#<fabric." + i(this.type) + ">" },
            getObjectScaling: function() {
                var t = this.scaleX,
                    e = this.scaleY;
                if (this.group) {
                    var i = this.group.getObjectScaling();
                    t *= i.scaleX, e *= i.scaleY
                }
                return { scaleX: t, scaleY: e }
            },
            getTotalObjectScaling: function() {
                var t = this.getObjectScaling(),
                    e = t.scaleX,
                    i = t.scaleY;
                if (this.canvas) {
                    var r = this.canvas.getZoom(),
                        n = this.canvas.getRetinaScaling();
                    e *= r * n, i *= r * n
                }
                return { scaleX: e, scaleY: i }
            },
            getObjectOpacity: function() { var t = this.opacity; return this.group && (t *= this.group.getObjectOpacity()), t },
            _set: function(t, e) {
                var i = "scaleX" === t || "scaleY" === t,
                    r = this[t] !== e,
                    n = !1;
                return i && (e = this._constrainScale(e)), "scaleX" === t && e < 0 ? (this.flipX = !this.flipX, e *= -1) : "scaleY" === t && e < 0 ? (this.flipY = !this.flipY, e *= -1) : "shadow" !== t || !e || e instanceof x.Shadow ? "dirty" === t && this.group && this.group.set("dirty", e) : e = new x.Shadow(e), this[t] = e, r && (n = this.group && this.group.isOnACache(), -1 < this.cacheProperties.indexOf(t) ? (this.dirty = !0, n && this.group.set("dirty", !0)) : n && -1 < this.stateProperties.indexOf(t) && this.group.set("dirty", !0)), this
            },
            setOnGroup: function() {},
            getViewportTransform: function() { return this.canvas && this.canvas.viewportTransform ? this.canvas.viewportTransform : x.iMatrix.concat() },
            isNotVisible: function() { return 0 === this.opacity || 0 === this.width && 0 === this.height || !this.visible },
            render: function(t) { this.isNotVisible() || this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen() || (t.save(), this._setupCompositeOperation(t), this.drawSelectionBackground(t), this.transform(t), this._setOpacity(t), this._setShadow(t, this), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.clipTo && x.util.clipContext(this, t), this.shouldCache() ? (this.renderCache(), this.drawCacheOnCanvas(t)) : (this._removeCacheCanvas(), this.dirty = !1, this.drawObject(t), this.objectCaching && this.statefullCache && this.saveState({ propertySet: "cacheProperties" })), this.clipTo && t.restore(), t.restore()) },
            renderCache: function(t) { t = t || {}, this._cacheCanvas || this._createCacheCanvas(), this.isCacheDirty() && (this.statefullCache && this.saveState({ propertySet: "cacheProperties" }), this.drawObject(this._cacheContext, t.forClipping), this.dirty = !1) },
            _removeCacheCanvas: function() { this._cacheCanvas = null, this.cacheWidth = 0, this.cacheHeight = 0 },
            needsItsOwnCache: function() { return "stroke" === this.paintFirst && "object" == typeof this.shadow || !!this.clipPath },
            shouldCache: function() { return this.ownCaching = this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isOnACache()), this.ownCaching },
            willDrawShadow: function() { return !!this.shadow && (0 !== this.shadow.offsetX || 0 !== this.shadow.offsetY) },
            drawClipPathOnCache: function(t) {
                var e = this.clipPath;
                if (t.save(), e.inverted ? t.globalCompositeOperation = "destination-out" : t.globalCompositeOperation = "destination-in", e.absolutePositioned) {
                    var i = x.util.invertTransform(this.calcTransformMatrix());
                    t.transform(i[0], i[1], i[2], i[3], i[4], i[5])
                }
                e.transform(t), t.scale(1 / e.zoomX, 1 / e.zoomY), t.drawImage(e._cacheCanvas, -e.cacheTranslationX, -e.cacheTranslationY), t.restore()
            },
            drawObject: function(t, e) { e ? this._setClippingProperties(t) : (this._renderBackground(t), this._setStrokeStyles(t, this), this._setFillStyles(t, this)), this._render(t), this._drawClipPath(t) },
            _drawClipPath: function(t) {
                var e = this.clipPath;
                e && (e.canvas = this.canvas, e.shouldCache(), e._transformDone = !0, e.renderCache({ forClipping: !0 }), this.drawClipPathOnCache(t))
            },
            drawCacheOnCanvas: function(t) { t.scale(1 / this.zoomX, 1 / this.zoomY), t.drawImage(this._cacheCanvas, -this.cacheTranslationX, -this.cacheTranslationY) },
            isCacheDirty: function(t) {
                if (this.isNotVisible()) return !1;
                if (this._cacheCanvas && !t && this._updateCacheCanvas()) return !0;
                if (this.dirty || this.clipPath && this.clipPath.absolutePositioned || this.statefullCache && this.hasStateChanged("cacheProperties")) {
                    if (this._cacheCanvas && !t) {
                        var e = this.cacheWidth / this.zoomX,
                            i = this.cacheHeight / this.zoomY;
                        this._cacheContext.clearRect(-e / 2, -i / 2, e, i)
                    }
                    return !0
                }
                return !1
            },
            _renderBackground: function(t) {
                if (this.backgroundColor) {
                    var e = this._getNonTransformedDimensions();
                    t.fillStyle = this.backgroundColor, t.fillRect(-e.x / 2, -e.y / 2, e.x, e.y), this._removeShadow(t)
                }
            },
            _setOpacity: function(t) { this.group && !this.group._transformDone ? t.globalAlpha = this.getObjectOpacity() : t.globalAlpha *= this.opacity },
            _setStrokeStyles: function(t, e) { e.stroke && (t.lineWidth = e.strokeWidth, t.lineCap = e.strokeLineCap, t.lineJoin = e.strokeLineJoin, t.miterLimit = e.strokeMiterLimit, t.strokeStyle = e.stroke.toLive ? e.stroke.toLive(t, this) : e.stroke) },
            _setFillStyles: function(t, e) { e.fill && (t.fillStyle = e.fill.toLive ? e.fill.toLive(t, this) : e.fill) },
            _setClippingProperties: function(t) { t.globalAlpha = 1, t.strokeStyle = "transparent", t.fillStyle = "#000000" },
            _setLineDash: function(t, e, i) { e && (1 & e.length && e.push.apply(e, e), n ? t.setLineDash(e) : i && i(t)) },
            _renderControls: function(t, e) {
                var i, r, n, s = this.getViewportTransform(),
                    o = this.calcTransformMatrix();
                r = void 0 !== (e = e || {}).hasBorders ? e.hasBorders : this.hasBorders, n = void 0 !== e.hasControls ? e.hasControls : this.hasControls, o = x.util.multiplyTransformMatrices(s, o), i = x.util.qrDecompose(o), t.save(), t.translate(i.translateX, i.translateY), t.lineWidth = 1 * this.borderScaleFactor, this.group || (t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1), e.forActiveSelection ? (t.rotate(a(i.angle)), r && this.drawBordersInGroup(t, i, e)) : (t.rotate(a(this.angle)), r && this.drawBorders(t, e)), n && this.drawControls(t, e), t.restore()
            },
            _setShadow: function(t) {
                if (this.shadow) {
                    var e = this.canvas && this.canvas.viewportTransform[0] || 1,
                        i = this.canvas && this.canvas.viewportTransform[3] || 1,
                        r = this.getObjectScaling();
                    this.canvas && this.canvas._isRetinaScaling() && (e *= x.devicePixelRatio, i *= x.devicePixelRatio), t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur * x.browserShadowBlurConstant * (e + i) * (r.scaleX + r.scaleY) / 4, t.shadowOffsetX = this.shadow.offsetX * e * r.scaleX, t.shadowOffsetY = this.shadow.offsetY * i * r.scaleY
                }
            },
            _removeShadow: function(t) { this.shadow && (t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0) },
            _applyPatternGradientTransform: function(t, e) {
                if (!e || !e.toLive) return { offsetX: 0, offsetY: 0 };
                var i = e.gradientTransform || e.patternTransform,
                    r = -this.width / 2 + e.offsetX || 0,
                    n = -this.height / 2 + e.offsetY || 0;
                return t.translate(r, n), i && t.transform(i[0], i[1], i[2], i[3], i[4], i[5]), { offsetX: r, offsetY: n }
            },
            _renderPaintInOrder: function(t) { "stroke" === this.paintFirst ? (this._renderStroke(t), this._renderFill(t)) : (this._renderFill(t), this._renderStroke(t)) },
            _renderFill: function(t) { this.fill && (t.save(), this._applyPatternGradientTransform(t, this.fill), "evenodd" === this.fillRule ? t.fill("evenodd") : t.fill(), t.restore()) },
            _renderStroke: function(t) { this.stroke && 0 !== this.strokeWidth && (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this._setLineDash(t, this.strokeDashArray, this._renderDashedStroke), this._applyPatternGradientTransform(t, this.stroke), t.stroke(), t.restore()) },
            _findCenterFromElement: function() { return { x: this.left + this.width / 2, y: this.top + this.height / 2 } },
            _assignTransformMatrixProps: function() {
                if (this.transformMatrix) {
                    var t = x.util.qrDecompose(this.transformMatrix);
                    this.flipX = !1, this.flipY = !1, this.set("scaleX", t.scaleX), this.set("scaleY", t.scaleY), this.angle = t.angle, this.skewX = t.skewX, this.skewY = 0
                }
            },
            _removeTransformMatrix: function(t) {
                var e = this._findCenterFromElement();
                this.transformMatrix && (this._assignTransformMatrixProps(), e = x.util.transformPoint(e, this.transformMatrix)), this.transformMatrix = null, t && (this.scaleX *= t.scaleX, this.scaleY *= t.scaleY, this.cropX = t.cropX, this.cropY = t.cropY, e.x += t.offsetLeft, e.y += t.offsetTop, this.width = t.width, this.height = t.height), this.setPositionByOrigin(e, "center", "center")
            },
            clone: function(t, e) {
                var i = this.toObject(e);
                this.constructor.fromObject ? this.constructor.fromObject(i, t) : x.Object._fromObject("Object", i, t)
            },
            cloneAsImage: function(e, t) { var i = this.toDataURL(t); return x.util.loadImage(i, function(t) { e && e(new x.Image(t)) }), this },
            toDataURL: function(t) {
                t || (t = {});
                var e = x.util,
                    i = e.saveObjectTransform(this),
                    r = this.shadow,
                    n = Math.abs;
                t.withoutTransform && e.resetObjectTransform(this), t.withoutShadow && (this.shadow = null);
                var s, o, a = x.util.createCanvasElement(),
                    c = this.getBoundingRect(!0, !0),
                    h = this.shadow,
                    l = { x: 0, y: 0 };
                h && (o = h.blur, s = this.getObjectScaling(), l.x = 2 * Math.round((n(h.offsetX) + o) * n(s.scaleX)), l.y = 2 * Math.round((n(h.offsetY) + o) * n(s.scaleY))), a.width = c.width + l.x, a.height = c.height + l.y, a.width += a.width % 2 ? 2 - a.width % 2 : 0, a.height += a.height % 2 ? 2 - a.height % 2 : 0;
                var u = new x.StaticCanvas(a, { enableRetinaScaling: t.enableRetinaScaling, renderOnAddRemove: !1, skipOffscreen: !1 });
                "jpeg" === t.format && (u.backgroundColor = "#fff"), this.setPositionByOrigin(new x.Point(u.width / 2, u.height / 2), "center", "center");
                var f = this.canvas;
                u.add(this);
                var d = u.toDataURL(t);
                return this.shadow = r, this.set(i).setCoords(), this.canvas = f, u._objects = [], u.dispose(), u = null, d
            },
            isType: function(t) { return this.type === t },
            complexity: function() { return 1 },
            toJSON: function(t) { return this.toObject(t) },
            setGradient: function(t, e) { e || (e = {}); var i = { colorStops: [] }; return i.type = e.type || (e.r1 || e.r2 ? "radial" : "linear"), i.coords = { x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2 }, (e.r1 || e.r2) && (i.coords.r1 = e.r1, i.coords.r2 = e.r2), i.gradientTransform = e.gradientTransform, x.Gradient.prototype.addColorStop.call(i, e.colorStops), this.set(t, x.Gradient.forObject(this, i)) },
            setPatternFill: function(t, e) { return this.set("fill", new x.Pattern(t, e)) },
            setShadow: function(t) { return this.set("shadow", t ? new x.Shadow(t) : null) },
            setColor: function(t) { return this.set("fill", t), this },
            rotate: function(t) { var e = ("center" !== this.originX || "center" !== this.originY) && this.centeredRotation; return e && this._setOriginToCenter(), this.set("angle", t), e && this._resetOrigin(), this },
            centerH: function() { return this.canvas && this.canvas.centerObjectH(this), this },
            viewportCenterH: function() { return this.canvas && this.canvas.viewportCenterObjectH(this), this },
            centerV: function() { return this.canvas && this.canvas.centerObjectV(this), this },
            viewportCenterV: function() { return this.canvas && this.canvas.viewportCenterObjectV(this), this },
            center: function() { return this.canvas && this.canvas.centerObject(this), this },
            viewportCenter: function() { return this.canvas && this.canvas.viewportCenterObject(this), this },
            getLocalPointer: function(t, e) {
                e = e || this.canvas.getPointer(t);
                var i = new x.Point(e.x, e.y),
                    r = this._getLeftTopCoords();
                return this.angle && (i = x.util.rotatePoint(i, r, a(-this.angle))), { x: i.x - r.x, y: i.y - r.y }
            },
            _setupCompositeOperation: function(t) { this.globalCompositeOperation && (t.globalCompositeOperation = this.globalCompositeOperation) }
        }), x.util.createAccessors && x.util.createAccessors(x.Object), e(x.Object.prototype, x.Observable), x.Object.NUM_FRACTION_DIGITS = 2, x.Object._fromObject = function(t, i, r, n) {
            var s = x[t];
            i = o(i, !0), x.util.enlivenPatterns([i.fill, i.stroke], function(t) {
                void 0 !== t[0] && (i.fill = t[0]), void 0 !== t[1] && (i.stroke = t[1]), x.util.enlivenObjects([i.clipPath], function(t) {
                    i.clipPath = t[0];
                    var e = n ? new s(i[n], i) : new s(i);
                    r && r(e)
                })
            })
        }, x.Object.__uid = 0)
    }("undefined" != typeof exports ? exports : this),
    function() {
        var a = fabric.util.degreesToRadians,
            l = { left: -.5, center: 0, right: .5 },
            u = { top: -.5, center: 0, bottom: .5 };
        fabric.util.object.extend(fabric.Object.prototype, {
            translateToGivenOrigin: function(t, e, i, r, n) {
                var s, o, a, c = t.x,
                    h = t.y;
                return "string" == typeof e ? e = l[e] : e -= .5, "string" == typeof r ? r = l[r] : r -= .5, "string" == typeof i ? i = u[i] : i -= .5, "string" == typeof n ? n = u[n] : n -= .5, o = n - i, ((s = r - e) || o) && (a = this._getTransformedDimensions(), c = t.x + s * a.x, h = t.y + o * a.y), new fabric.Point(c, h)
            },
            translateToCenterPoint: function(t, e, i) { var r = this.translateToGivenOrigin(t, e, i, "center", "center"); return this.angle ? fabric.util.rotatePoint(r, t, a(this.angle)) : r },
            translateToOriginPoint: function(t, e, i) { var r = this.translateToGivenOrigin(t, "center", "center", e, i); return this.angle ? fabric.util.rotatePoint(r, t, a(this.angle)) : r },
            getCenterPoint: function() { var t = new fabric.Point(this.left, this.top); return this.translateToCenterPoint(t, this.originX, this.originY) },
            getPointByOrigin: function(t, e) { var i = this.getCenterPoint(); return this.translateToOriginPoint(i, t, e) },
            toLocalPoint: function(t, e, i) { var r, n, s = this.getCenterPoint(); return r = void 0 !== e && void 0 !== i ? this.translateToGivenOrigin(s, "center", "center", e, i) : new fabric.Point(this.left, this.top), n = new fabric.Point(t.x, t.y), this.angle && (n = fabric.util.rotatePoint(n, s, -a(this.angle))), n.subtractEquals(r) },
            setPositionByOrigin: function(t, e, i) {
                var r = this.translateToCenterPoint(t, e, i),
                    n = this.translateToOriginPoint(r, this.originX, this.originY);
                this.set("left", n.x), this.set("top", n.y)
            },
            adjustPosition: function(t) {
                var e, i, r = a(this.angle),
                    n = this.getScaledWidth(),
                    s = fabric.util.cos(r) * n,
                    o = fabric.util.sin(r) * n;
                e = "string" == typeof this.originX ? l[this.originX] : this.originX - .5, i = "string" == typeof t ? l[t] : t - .5, this.left += s * (i - e), this.top += o * (i - e), this.setCoords(), this.originX = t
            },
            _setOriginToCenter: function() {
                this._originalOriginX = this.originX, this._originalOriginY = this.originY;
                var t = this.getCenterPoint();
                this.originX = "center", this.originY = "center", this.left = t.x, this.top = t.y
            },
            _resetOrigin: function() {
                var t = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
                this.originX = this._originalOriginX, this.originY = this._originalOriginY, this.left = t.x, this.top = t.y, this._originalOriginX = null, this._originalOriginY = null
            },
            _getLeftTopCoords: function() { return this.translateToOriginPoint(this.getCenterPoint(), "left", "top") }
        })
    }(),
    function() {
        var k = fabric.util.degreesToRadians,
            D = fabric.util.multiplyTransformMatrices,
            E = fabric.util.transformPoint;
        fabric.util.object.extend(fabric.Object.prototype, {
            oCoords: null,
            aCoords: null,
            ownMatrixCache: null,
            matrixCache: null,
            getCoords: function(t, e) { this.oCoords || this.setCoords(); var i, r = t ? this.aCoords : this.oCoords; return i = e ? this.calcCoords(t) : r, [new fabric.Point(i.tl.x, i.tl.y), new fabric.Point(i.tr.x, i.tr.y), new fabric.Point(i.br.x, i.br.y), new fabric.Point(i.bl.x, i.bl.y)] },
            intersectsWithRect: function(t, e, i, r) { var n = this.getCoords(i, r); return "Intersection" === fabric.Intersection.intersectPolygonRectangle(n, t, e).status },
            intersectsWithObject: function(t, e, i) { return "Intersection" === fabric.Intersection.intersectPolygonPolygon(this.getCoords(e, i), t.getCoords(e, i)).status || t.isContainedWithinObject(this, e, i) || this.isContainedWithinObject(t, e, i) },
            isContainedWithinObject: function(t, e, i) {
                for (var r = this.getCoords(e, i), n = 0, s = t._getImageLines(i ? t.calcCoords(e) : e ? t.aCoords : t.oCoords); n < 4; n++)
                    if (!t.containsPoint(r[n], s)) return !1;
                return !0
            },
            isContainedWithinRect: function(t, e, i, r) { var n = this.getBoundingRect(i, r); return n.left >= t.x && n.left + n.width <= e.x && n.top >= t.y && n.top + n.height <= e.y },
            containsPoint: function(t, e, i, r) { e = e || this._getImageLines(r ? this.calcCoords(i) : i ? this.aCoords : this.oCoords); var n = this._findCrossPoints(t, e); return 0 !== n && n % 2 == 1 },
            isOnScreen: function(t) {
                if (!this.canvas) return !1;
                for (var e, i = this.canvas.vptCoords.tl, r = this.canvas.vptCoords.br, n = this.getCoords(!0, t), s = 0; s < 4; s++)
                    if ((e = n[s]).x <= r.x && e.x >= i.x && e.y <= r.y && e.y >= i.y) return !0;
                return !!this.intersectsWithRect(i, r, !0, t) || this._containsCenterOfCanvas(i, r, t)
            },
            _containsCenterOfCanvas: function(t, e, i) { var r = { x: (t.x + e.x) / 2, y: (t.y + e.y) / 2 }; return !!this.containsPoint(r, null, !0, i) },
            isPartiallyOnScreen: function(t) {
                if (!this.canvas) return !1;
                var e = this.canvas.vptCoords.tl,
                    i = this.canvas.vptCoords.br;
                return !!this.intersectsWithRect(e, i, !0, t) || this._containsCenterOfCanvas(e, i, t)
            },
            _getImageLines: function(t) { return { topline: { o: t.tl, d: t.tr }, rightline: { o: t.tr, d: t.br }, bottomline: { o: t.br, d: t.bl }, leftline: { o: t.bl, d: t.tl } } },
            _findCrossPoints: function(t, e) {
                var i, r, n, s = 0;
                for (var o in e)
                    if (!((n = e[o]).o.y < t.y && n.d.y < t.y || n.o.y >= t.y && n.d.y >= t.y || (n.o.x === n.d.x && n.o.x >= t.x ? r = n.o.x : (0, i = (n.d.y - n.o.y) / (n.d.x - n.o.x), r = -(t.y - 0 * t.x - (n.o.y - i * n.o.x)) / (0 - i)), r >= t.x && (s += 1), 2 !== s))) break;
                return s
            },
            getBoundingRect: function(t, e) { var i = this.getCoords(t, e); return fabric.util.makeBoundingBoxFromPoints(i) },
            getScaledWidth: function() { return this._getTransformedDimensions().x },
            getScaledHeight: function() { return this._getTransformedDimensions().y },
            _constrainScale: function(t) { return Math.abs(t) < this.minScaleLimit ? t < 0 ? -this.minScaleLimit : this.minScaleLimit : 0 === t ? 1e-4 : t },
            scale: function(t) { return this._set("scaleX", t), this._set("scaleY", t), this.setCoords() },
            scaleToWidth: function(t, e) { var i = this.getBoundingRect(e).width / this.getScaledWidth(); return this.scale(t / this.width / i) },
            scaleToHeight: function(t, e) { var i = this.getBoundingRect(e).height / this.getScaledHeight(); return this.scale(t / this.height / i) },
            calcCoords: function(t) {
                var e = this._calcRotateMatrix(),
                    i = this._calcTranslateMatrix(),
                    r = D(i, e),
                    n = this.getViewportTransform(),
                    s = t ? r : D(n, r),
                    o = this._getTransformedDimensions(),
                    a = o.x / 2,
                    c = o.y / 2,
                    h = E({ x: -a, y: -c }, s),
                    l = E({ x: a, y: -c }, s),
                    u = E({ x: -a, y: c }, s),
                    f = E({ x: a, y: c }, s);
                if (!t) {
                    var d = this.padding,
                        g = k(this.angle),
                        p = fabric.util.cos(g),
                        v = fabric.util.sin(g),
                        m = p * d,
                        b = v * d,
                        _ = m + b,
                        y = m - b;
                    d && (h.x -= y, h.y -= _, l.x += _, l.y -= y, u.x -= _, u.y += y, f.x += y, f.y += _);
                    var x = new fabric.Point((h.x + u.x) / 2, (h.y + u.y) / 2),
                        C = new fabric.Point((l.x + h.x) / 2, (l.y + h.y) / 2),
                        S = new fabric.Point((f.x + l.x) / 2, (f.y + l.y) / 2),
                        T = new fabric.Point((f.x + u.x) / 2, (f.y + u.y) / 2),
                        w = new fabric.Point(C.x + v * this.rotatingPointOffset, C.y - p * this.rotatingPointOffset)
                }
                var O = { tl: h, tr: l, br: f, bl: u };
                return t || (O.ml = x, O.mt = C, O.mr = S, O.mb = T, O.mtr = w), O
            },
            setCoords: function(t, e) { return this.oCoords = this.calcCoords(t), e || (this.aCoords = this.calcCoords(!0)), t || this._setCornerCoords && this._setCornerCoords(), this },
            _calcRotateMatrix: function() {
                if (this.angle) {
                    var t = k(this.angle),
                        e = fabric.util.cos(t),
                        i = fabric.util.sin(t);
                    return [e, i, -i, e, 0, 0]
                }
                return fabric.iMatrix.concat()
            },
            _calcTranslateMatrix: function() { var t = this.getCenterPoint(); return [1, 0, 0, 1, t.x, t.y] },
            transformMatrixKey: function(t) {
                var e = "_",
                    i = "";
                return !t && this.group && (i = this.group.transformMatrixKey(t) + e), i + this.top + e + this.left + e + this.scaleX + e + this.scaleY + e + this.skewX + e + this.skewY + e + this.angle + e + this.originX + e + this.originY + e + this.width + e + this.height + e + this.strokeWidth + this.flipX + this.flipY
            },
            calcTransformMatrix: function(t) {
                if (t) return this.calcOwnMatrix();
                var e = this.transformMatrixKey(),
                    i = this.matrixCache || (this.matrixCache = {});
                if (i.key === e) return i.value;
                var r = this.calcOwnMatrix();
                return this.group && (r = D(this.group.calcTransformMatrix(), r)), i.key = e, i.value = r
            },
            calcOwnMatrix: function() {
                var t = this.transformMatrixKey(!0),
                    e = this.ownMatrixCache || (this.ownMatrixCache = {});
                if (e.key === t) return e.value;
                var i, r = this._calcTranslateMatrix(),
                    n = this._calcDimensionsTransformMatrix(this.skewX, this.skewY, !0);
                return this.angle && (i = this._calcRotateMatrix(), r = D(r, i)), r = D(r, n), e.key = t, e.value = r
            },
            _calcDimensionsTransformMatrix: function(t, e, i) { var r, n = [this.scaleX * (i && this.flipX ? -1 : 1), 0, 0, this.scaleY * (i && this.flipY ? -1 : 1), 0, 0]; return t && (r = [1, 0, Math.tan(k(t)), 1], n = D(n, r, !0)), e && (r = [1, Math.tan(k(e)), 0, 1], n = D(n, r, !0)), n },
            _getNonTransformedDimensions: function() { var t = this.strokeWidth; return { x: this.width + t, y: this.height + t } },
            _getTransformedDimensions: function(t, e) {
                void 0 === t && (t = this.skewX), void 0 === e && (e = this.skewY);
                var i = this._getNonTransformedDimensions();
                if (0 === t && 0 === e) return { x: i.x * this.scaleX, y: i.y * this.scaleY };
                var r, n, s = i.x / 2,
                    o = i.y / 2,
                    a = [{ x: -s, y: -o }, { x: s, y: -o }, { x: -s, y: o }, { x: s, y: o }],
                    c = this._calcDimensionsTransformMatrix(t, e, !1);
                for (r = 0; r < a.length; r++) a[r] = fabric.util.transformPoint(a[r], c);
                return { x: (n = fabric.util.makeBoundingBoxFromPoints(a)).width, y: n.height }
            },
            _calculateCurrentDimensions: function() {
                var t = this.getViewportTransform(),
                    e = this._getTransformedDimensions();
                return fabric.util.transformPoint(e, t, !0).scalarAdd(2 * this.padding)
            }
        })
    }(), fabric.util.object.extend(fabric.Object.prototype, { sendToBack: function() { return this.group ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this) : this.canvas.sendToBack(this), this }, bringToFront: function() { return this.group ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this) : this.canvas.bringToFront(this), this }, sendBackwards: function(t) { return this.group ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, t) : this.canvas.sendBackwards(this, t), this }, bringForward: function(t) { return this.group ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, t) : this.canvas.bringForward(this, t), this }, moveTo: function(t) { return this.group && "activeSelection" !== this.group.type ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, t) : this.canvas.moveTo(this, t), this } }),
    function() {
        function u(t, e) {
            if (e) {
                if (e.toLive) return t + ": url(#SVGID_" + e.id + "); ";
                var i = new fabric.Color(e),
                    r = t + ": " + i.toRgb() + "; ",
                    n = i.getAlpha();
                return 1 !== n && (r += t + "-opacity: " + n.toString() + "; "), r
            }
            return t + ": none; "
        }
        var i = fabric.util.toFixed;
        fabric.util.object.extend(fabric.Object.prototype, {
            getSvgStyles: function(t) {
                var e = this.fillRule ? this.fillRule : "nonzero",
                    i = this.strokeWidth ? this.strokeWidth : "0",
                    r = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none",
                    n = this.strokeLineCap ? this.strokeLineCap : "butt",
                    s = this.strokeLineJoin ? this.strokeLineJoin : "miter",
                    o = this.strokeMiterLimit ? this.strokeMiterLimit : "4",
                    a = void 0 !== this.opacity ? this.opacity : "1",
                    c = this.visible ? "" : " visibility: hidden;",
                    h = t ? "" : this.getSvgFilter(),
                    l = u("fill", this.fill);
                return [u("stroke", this.stroke), "stroke-width: ", i, "; ", "stroke-dasharray: ", r, "; ", "stroke-linecap: ", n, "; ", "stroke-linejoin: ", s, "; ", "stroke-miterlimit: ", o, "; ", l, "fill-rule: ", e, "; ", "opacity: ", a, ";", h, c].join("")
            },
            getSvgSpanStyles: function(t, e) {
                var i = "; ",
                    r = t.fontFamily ? "font-family: " + (-1 === t.fontFamily.indexOf("'") && -1 === t.fontFamily.indexOf('"') ? "'" + t.fontFamily + "'" : t.fontFamily) + i : "",
                    n = t.strokeWidth ? "stroke-width: " + t.strokeWidth + i : "",
                    s = (r = r, t.fontSize ? "font-size: " + t.fontSize + "px" + i : ""),
                    o = t.fontStyle ? "font-style: " + t.fontStyle + i : "",
                    a = t.fontWeight ? "font-weight: " + t.fontWeight + i : "",
                    c = t.fill ? u("fill", t.fill) : "",
                    h = t.stroke ? u("stroke", t.stroke) : "",
                    l = this.getSvgTextDecoration(t);
                return l && (l = "text-decoration: " + l + i), [h, n, r, s, o, a, l, c, t.deltaY ? "baseline-shift: " + -t.deltaY + "; " : "", e ? "white-space: pre; " : ""].join("")
            },
            getSvgTextDecoration: function(t) { return "overline" in t || "underline" in t || "linethrough" in t ? (t.overline ? "overline " : "") + (t.underline ? "underline " : "") + (t.linethrough ? "line-through " : "") : "" },
            getSvgFilter: function() { return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : "" },
            getSvgCommons: function() { return [this.id ? 'id="' + this.id + '" ' : "", this.clipPath ? 'clip-path="url(#' + this.clipPath.clipPathId + ')" ' : ""].join("") },
            getSvgTransform: function(t, e) { return 'transform="matrix(' + (t ? this.calcTransformMatrix() : this.calcOwnMatrix()).map(function(t) { return i(t, fabric.Object.NUM_FRACTION_DIGITS) }).join(" ") + ")" + (e || "") + this.getSvgTransformMatrix() + '" ' },
            getSvgTransformMatrix: function() { return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ")" : "" },
            _setSVGBg: function(t) {
                if (this.backgroundColor) {
                    var e = fabric.Object.NUM_FRACTION_DIGITS;
                    t.push("\t\t<rect ", this._getFillAttributes(this.backgroundColor), ' x="', i(-this.width / 2, e), '" y="', i(-this.height / 2, e), '" width="', i(this.width, e), '" height="', i(this.height, e), '"></rect>\n')
                }
            },
            toSVG: function(t) { return this._createBaseSVGMarkup(this._toSVG(), { reviver: t }) },
            toClipPathSVG: function(t) { return "\t" + this._createBaseClipPathSVGMarkup(this._toSVG(), { reviver: t }) },
            _createBaseClipPathSVGMarkup: function(t, e) {
                var i = (e = e || {}).reviver,
                    r = e.additionalTransform || "",
                    n = [this.getSvgTransform(!0, r), this.getSvgCommons()].join(""),
                    s = t.indexOf("COMMON_PARTS");
                return t[s] = n, i ? i(t.join("")) : t.join("")
            },
            _createBaseSVGMarkup: function(t, e) {
                var i, r, n = (e = e || {}).noStyle,
                    s = e.withShadow,
                    o = e.reviver,
                    a = n ? "" : 'style="' + this.getSvgStyles() + '" ',
                    c = s ? 'style="' + this.getSvgFilter() + '" ' : "",
                    h = this.clipPath,
                    l = this.clipPath && this.clipPath.absolutePositioned,
                    u = [],
                    f = t.indexOf("COMMON_PARTS");
                return h && (h.clipPathId = "CLIPPATH_" + fabric.Object.__uid++, r = '<clipPath id="' + h.clipPathId + '" >\n' + this.clipPath.toClipPathSVG(o) + "</clipPath>\n"), l && u.push("<g ", c, this.getSvgCommons(), " >\n"), u.push("<g ", this.getSvgTransform(!1), l ? "" : c + this.getSvgCommons(), " >\n"), i = [a, n ? "" : this.addPaintOrder(), " "].join(""), t[f] = i, this.fill && this.fill.toLive && u.push(this.fill.toSVG(this, !1)), this.stroke && this.stroke.toLive && u.push(this.stroke.toSVG(this, !1)), this.shadow && u.push(this.shadow.toSVG(this)), h && u.push(r), u.push(t.join("")), u.push("</g>\n"), l && u.push("</g>\n"), o ? o(u.join("")) : u.join("")
            },
            addPaintOrder: function() { return "fill" !== this.paintFirst ? ' paint-order="' + this.paintFirst + '" ' : "" }
        })
    }(),
    function() {
        var n = fabric.util.object.extend,
            r = "stateProperties";

        function s(e, t, i) {
            var r = {};
            i.forEach(function(t) { r[t] = e[t] }), n(e[t], r, !0)
        }
        fabric.util.object.extend(fabric.Object.prototype, {
            hasStateChanged: function(t) {
                var e = "_" + (t = t || r);
                return Object.keys(this[e]).length < this[t].length || ! function t(e, i, r) {
                    if (e === i) return !0;
                    if (Array.isArray(e)) {
                        if (!Array.isArray(i) || e.length !== i.length) return !1;
                        for (var n = 0, s = e.length; n < s; n++)
                            if (!t(e[n], i[n])) return !1;
                        return !0
                    }
                    if (e && "object" == typeof e) {
                        var o, a = Object.keys(e);
                        if (!i || "object" != typeof i || !r && a.length !== Object.keys(i).length) return !1;
                        for (n = 0, s = a.length; n < s; n++)
                            if (!t(e[o = a[n]], i[o])) return !1;
                        return !0
                    }
                }(this[e], this, !0)
            },
            saveState: function(t) {
                var e = t && t.propertySet || r,
                    i = "_" + e;
                return this[i] ? (s(this, i, this[e]), t && t.stateProperties && s(this, i, t.stateProperties), this) : this.setupState(t)
            },
            setupState: function(t) { var e = (t = t || {}).propertySet || r; return this["_" + (t.propertySet = e)] = {}, this.saveState(t), this }
        })
    }(),
    function() {
        var c = fabric.util.degreesToRadians;
        fabric.util.object.extend(fabric.Object.prototype, {
            _controlsVisibility: null,
            _findTargetCorner: function(t) {
                if (!this.hasControls || this.group || !this.canvas || this.canvas._activeObject !== this) return !1;
                var e, i, r = t.x,
                    n = t.y;
                for (var s in this.__corner = 0, this.oCoords)
                    if (this.isControlVisible(s) && ("mtr" !== s || this.hasRotatingPoint) && (!this.get("lockUniScaling") || "mt" !== s && "mr" !== s && "mb" !== s && "ml" !== s) && (i = this._getImageLines(this.oCoords[s].corner), 0 !== (e = this._findCrossPoints({ x: r, y: n }, i)) && e % 2 == 1)) return this.__corner = s;
                return !1
            },
            _setCornerCoords: function() {
                var t, e, i = this.oCoords,
                    r = c(45 - this.angle),
                    n = .707106 * this.cornerSize,
                    s = n * fabric.util.cos(r),
                    o = n * fabric.util.sin(r);
                for (var a in i) t = i[a].x, e = i[a].y, i[a].corner = { tl: { x: t - o, y: e - s }, tr: { x: t + s, y: e - o }, bl: { x: t - s, y: e + o }, br: { x: t + o, y: e + s } }
            },
            drawSelectionBackground: function(t) {
                if (!this.selectionBackgroundColor || this.canvas && !this.canvas.interactive || this.canvas && this.canvas._activeObject !== this) return this;
                t.save();
                var e = this.getCenterPoint(),
                    i = this._calculateCurrentDimensions(),
                    r = this.canvas.viewportTransform;
                return t.translate(e.x, e.y), t.scale(1 / r[0], 1 / r[3]), t.rotate(c(this.angle)), t.fillStyle = this.selectionBackgroundColor, t.fillRect(-i.x / 2, -i.y / 2, i.x, i.y), t.restore(), this
            },
            drawBorders: function(t, e) {
                e = e || {};
                var i = this._calculateCurrentDimensions(),
                    r = 1 / this.borderScaleFactor,
                    n = i.x + r,
                    s = i.y + r,
                    o = void 0 !== e.hasRotatingPoint ? e.hasRotatingPoint : this.hasRotatingPoint,
                    a = void 0 !== e.hasControls ? e.hasControls : this.hasControls,
                    c = void 0 !== e.rotatingPointOffset ? e.rotatingPointOffset : this.rotatingPointOffset;
                if (t.save(), t.strokeStyle = e.borderColor || this.borderColor, this._setLineDash(t, e.borderDashArray || this.borderDashArray, null), t.strokeRect(-n / 2, -s / 2, n, s), o && this.isControlVisible("mtr") && a) {
                    var h = -s / 2;
                    t.beginPath(), t.moveTo(0, h), t.lineTo(0, h - c), t.stroke()
                }
                return t.restore(), this
            },
            drawBordersInGroup: function(t, e, i) {
                i = i || {};
                var r = this._getNonTransformedDimensions(),
                    n = fabric.util.customTransformMatrix(e.scaleX, e.scaleY, e.skewX),
                    s = fabric.util.transformPoint(r, n),
                    o = 1 / this.borderScaleFactor,
                    a = s.x + o,
                    c = s.y + o;
                return t.save(), this._setLineDash(t, i.borderDashArray || this.borderDashArray, null), t.strokeStyle = i.borderColor || this.borderColor, t.strokeRect(-a / 2, -c / 2, a, c), t.restore(), this
            },
            drawControls: function(t, e) {
                e = e || {};
                var i = this._calculateCurrentDimensions(),
                    r = i.x,
                    n = i.y,
                    s = e.cornerSize || this.cornerSize,
                    o = -(r + s) / 2,
                    a = -(n + s) / 2,
                    c = void 0 !== e.transparentCorners ? e.transparentCorners : this.transparentCorners,
                    h = void 0 !== e.hasRotatingPoint ? e.hasRotatingPoint : this.hasRotatingPoint,
                    l = c ? "stroke" : "fill";
                return t.save(), t.strokeStyle = t.fillStyle = e.cornerColor || this.cornerColor, this.transparentCorners || (t.strokeStyle = e.cornerStrokeColor || this.cornerStrokeColor), this._setLineDash(t, e.cornerDashArray || this.cornerDashArray, null), this._drawControl("tl", t, l, o, a, e), this._drawControl("tr", t, l, o + r, a, e), this._drawControl("bl", t, l, o, a + n, e), this._drawControl("br", t, l, o + r, a + n, e), this.get("lockUniScaling") || (this._drawControl("mt", t, l, o + r / 2, a, e), this._drawControl("mb", t, l, o + r / 2, a + n, e), this._drawControl("mr", t, l, o + r, a + n / 2, e), this._drawControl("ml", t, l, o, a + n / 2, e)), h && this._drawControl("mtr", t, l, o + r / 2, a - this.rotatingPointOffset, e), t.restore(), this
            },
            _drawControl: function(t, e, i, r, n, s) {
                if (s = s || {}, this.isControlVisible(t)) {
                    var o = this.cornerSize,
                        a = !this.transparentCorners && this.cornerStrokeColor;
                    switch (s.cornerStyle || this.cornerStyle) {
                        case "circle":
                            e.beginPath(), e.arc(r + o / 2, n + o / 2, o / 2, 0, 2 * Math.PI, !1), e[i](), a && e.stroke();
                            break;
                        default:
                            this.transparentCorners || e.clearRect(r, n, o, o), e[i + "Rect"](r, n, o, o), a && e.strokeRect(r, n, o, o)
                    }
                }
            },
            isControlVisible: function(t) { return this._getControlsVisibility()[t] },
            setControlVisible: function(t, e) { return this._getControlsVisibility()[t] = e, this },
            setControlsVisibility: function(t) { for (var e in t || (t = {}), t) this.setControlVisible(e, t[e]); return this },
            _getControlsVisibility: function() { return this._controlsVisibility || (this._controlsVisibility = { tl: !0, tr: !0, br: !0, bl: !0, ml: !0, mt: !0, mr: !0, mb: !0, mtr: !0 }), this._controlsVisibility },
            onDeselect: function() {},
            onSelect: function() {}
        })
    }(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        FX_DURATION: 500,
        fxCenterObjectH: function(e, t) {
            var i = function() {},
                r = (t = t || {}).onComplete || i,
                n = t.onChange || i,
                s = this;
            return fabric.util.animate({ startValue: e.left, endValue: this.getCenter().left, duration: this.FX_DURATION, onChange: function(t) { e.set("left", t), s.requestRenderAll(), n() }, onComplete: function() { e.setCoords(), r() } }), this
        },
        fxCenterObjectV: function(e, t) {
            var i = function() {},
                r = (t = t || {}).onComplete || i,
                n = t.onChange || i,
                s = this;
            return fabric.util.animate({ startValue: e.top, endValue: this.getCenter().top, duration: this.FX_DURATION, onChange: function(t) { e.set("top", t), s.requestRenderAll(), n() }, onComplete: function() { e.setCoords(), r() } }), this
        },
        fxRemove: function(e, t) {
            var i = function() {},
                r = (t = t || {}).onComplete || i,
                n = t.onChange || i,
                s = this;
            return fabric.util.animate({ startValue: e.opacity, endValue: 0, duration: this.FX_DURATION, onChange: function(t) { e.set("opacity", t), s.requestRenderAll(), n() }, onComplete: function() { s.remove(e), r() } }), this
        }
    }), fabric.util.object.extend(fabric.Object.prototype, {
        animate: function() { if (arguments[0] && "object" == typeof arguments[0]) { var t, e, i = []; for (t in arguments[0]) i.push(t); for (var r = 0, n = i.length; r < n; r++) t = i[r], e = r !== n - 1, this._animate(t, arguments[0][t], arguments[1], e) } else this._animate.apply(this, arguments); return this },
        _animate: function(r, t, n, s) {
            var o, a = this;
            t = t.toString(), n = n ? fabric.util.object.clone(n) : {}, ~r.indexOf(".") && (o = r.split("."));
            var e = o ? this.get(o[0])[o[1]] : this.get(r);
            "from" in n || (n.from = e), t = ~t.indexOf("=") ? e + parseFloat(t.replace("=", "")) : parseFloat(t), fabric.util.animate({ startValue: n.from, endValue: t, byValue: n.by, easing: n.easing, duration: n.duration, abort: n.abort && function() { return n.abort.call(a) }, onChange: function(t, e, i) { o ? a[o[0]][o[1]] = t : a.set(r, t), s || n.onChange && n.onChange(t, e, i) }, onComplete: function(t, e, i) { s || (a.setCoords(), n.onComplete && n.onComplete(t, e, i)) } })
        }
    }),
    function(t) {
        "use strict";
        var s = t.fabric || (t.fabric = {}),
            o = s.util.object.extend,
            r = s.util.object.clone,
            i = { x1: 1, x2: 1, y1: 1, y2: 1 },
            n = s.StaticCanvas.supports("setLineDash");

        function e(t, e) {
            var i = t.origin,
                r = t.axis1,
                n = t.axis2,
                s = t.dimension,
                o = e.nearest,
                a = e.center,
                c = e.farthest;
            return function() {
                switch (this.get(i)) {
                    case o:
                        return Math.min(this.get(r), this.get(n));
                    case a:
                        return Math.min(this.get(r), this.get(n)) + .5 * this.get(s);
                    case c:
                        return Math.max(this.get(r), this.get(n))
                }
            }
        }
        s.Line ? s.warn("fabric.Line is already defined") : (s.Line = s.util.createClass(s.Object, {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            cacheProperties: s.Object.prototype.cacheProperties.concat("x1", "x2", "y1", "y2"),
            initialize: function(t, e) { t || (t = [0, 0, 0, 0]), this.callSuper("initialize", e), this.set("x1", t[0]), this.set("y1", t[1]), this.set("x2", t[2]), this.set("y2", t[3]), this._setWidthHeight(e) },
            _setWidthHeight: function(t) { t || (t = {}), this.width = Math.abs(this.x2 - this.x1), this.height = Math.abs(this.y2 - this.y1), this.left = "left" in t ? t.left : this._getLeftToOriginX(), this.top = "top" in t ? t.top : this._getTopToOriginY() },
            _set: function(t, e) { return this.callSuper("_set", t, e), void 0 !== i[t] && this._setWidthHeight(), this },
            _getLeftToOriginX: e({ origin: "originX", axis1: "x1", axis2: "x2", dimension: "width" }, { nearest: "left", center: "center", farthest: "right" }),
            _getTopToOriginY: e({ origin: "originY", axis1: "y1", axis2: "y2", dimension: "height" }, { nearest: "top", center: "center", farthest: "bottom" }),
            _render: function(t) {
                if (t.beginPath(), !this.strokeDashArray || this.strokeDashArray && n) {
                    var e = this.calcLinePoints();
                    t.moveTo(e.x1, e.y1), t.lineTo(e.x2, e.y2)
                }
                t.lineWidth = this.strokeWidth;
                var i = t.strokeStyle;
                t.strokeStyle = this.stroke || t.fillStyle, this.stroke && this._renderStroke(t), t.strokeStyle = i
            },
            _renderDashedStroke: function(t) {
                var e = this.calcLinePoints();
                t.beginPath(), s.util.drawDashedLine(t, e.x1, e.y1, e.x2, e.y2, this.strokeDashArray), t.closePath()
            },
            _findCenterFromElement: function() { return { x: (this.x1 + this.x2) / 2, y: (this.y1 + this.y2) / 2 } },
            toObject: function(t) { return o(this.callSuper("toObject", t), this.calcLinePoints()) },
            _getNonTransformedDimensions: function() { var t = this.callSuper("_getNonTransformedDimensions"); return "butt" === this.strokeLineCap && (0 === this.width && (t.y -= this.strokeWidth), 0 === this.height && (t.x -= this.strokeWidth)), t },
            calcLinePoints: function() {
                var t = this.x1 <= this.x2 ? -1 : 1,
                    e = this.y1 <= this.y2 ? -1 : 1,
                    i = t * this.width * .5,
                    r = e * this.height * .5;
                return { x1: i, x2: t * this.width * -.5, y1: r, y2: e * this.height * -.5 }
            },
            _toSVG: function() { var t = this.calcLinePoints(); return ["<line ", "COMMON_PARTS", 'x1="', t.x1, '" y1="', t.y1, '" x2="', t.x2, '" y2="', t.y2, '" />\n'] }
        }), s.Line.ATTRIBUTE_NAMES = s.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" ")), s.Line.fromElement = function(t, e, i) {
            i = i || {};
            var r = s.parseAttributes(t, s.Line.ATTRIBUTE_NAMES),
                n = [r.x1 || 0, r.y1 || 0, r.x2 || 0, r.y2 || 0];
            e(new s.Line(n, o(r, i)))
        }, s.Line.fromObject = function(t, e) {
            var i = r(t, !0);
            i.points = [t.x1, t.y1, t.x2, t.y2], s.Object._fromObject("Line", i, function(t) { delete t.points, e && e(t) }, "points")
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var a = t.fabric || (t.fabric = {}),
            c = Math.PI;
        a.Circle ? a.warn("fabric.Circle is already defined.") : (a.Circle = a.util.createClass(a.Object, {
            type: "circle",
            radius: 0,
            startAngle: 0,
            endAngle: 2 * c,
            cacheProperties: a.Object.prototype.cacheProperties.concat("radius", "startAngle", "endAngle"),
            _set: function(t, e) { return this.callSuper("_set", t, e), "radius" === t && this.setRadius(e), this },
            toObject: function(t) { return this.callSuper("toObject", ["radius", "startAngle", "endAngle"].concat(t)) },
            _toSVG: function() {
                var t, e = (this.endAngle - this.startAngle) % (2 * c);
                if (0 === e) t = ["<circle ", "COMMON_PARTS", 'cx="0" cy="0" ', 'r="', this.radius, '" />\n'];
                else {
                    var i = a.util.cos(this.startAngle) * this.radius,
                        r = a.util.sin(this.startAngle) * this.radius,
                        n = a.util.cos(this.endAngle) * this.radius,
                        s = a.util.sin(this.endAngle) * this.radius,
                        o = c < e ? "1" : "0";
                    t = ['<path d="M ' + i + " " + r, " A " + this.radius + " " + this.radius, " 0 ", +o + " 1", " " + n + " " + s, '"', "COMMON_PARTS", " />\n"]
                }
                return t
            },
            _render: function(t) { t.beginPath(), t.arc(0, 0, this.radius, this.startAngle, this.endAngle, !1), this._renderPaintInOrder(t) },
            getRadiusX: function() { return this.get("radius") * this.get("scaleX") },
            getRadiusY: function() { return this.get("radius") * this.get("scaleY") },
            setRadius: function(t) { return this.radius = t, this.set("width", 2 * t).set("height", 2 * t) }
        }), a.Circle.ATTRIBUTE_NAMES = a.SHARED_ATTRIBUTES.concat("cx cy r".split(" ")), a.Circle.fromElement = function(t, e) {
            var i, r = a.parseAttributes(t, a.Circle.ATTRIBUTE_NAMES);
            if (!("radius" in (i = r) && 0 <= i.radius)) throw new Error("value of `r` attribute is required and can not be negative");
            r.left = (r.left || 0) - r.radius, r.top = (r.top || 0) - r.radius, e(new a.Circle(r))
        }, a.Circle.fromObject = function(t, e) { return a.Object._fromObject("Circle", t, e) })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var r = t.fabric || (t.fabric = {});
        r.Triangle ? r.warn("fabric.Triangle is already defined") : (r.Triangle = r.util.createClass(r.Object, {
            type: "triangle",
            width: 100,
            height: 100,
            _render: function(t) {
                var e = this.width / 2,
                    i = this.height / 2;
                t.beginPath(), t.moveTo(-e, i), t.lineTo(0, -i), t.lineTo(e, i), t.closePath(), this._renderPaintInOrder(t)
            },
            _renderDashedStroke: function(t) {
                var e = this.width / 2,
                    i = this.height / 2;
                t.beginPath(), r.util.drawDashedLine(t, -e, i, 0, -i, this.strokeDashArray), r.util.drawDashedLine(t, 0, -i, e, i, this.strokeDashArray), r.util.drawDashedLine(t, e, i, -e, i, this.strokeDashArray), t.closePath()
            },
            _toSVG: function() {
                var t = this.width / 2,
                    e = this.height / 2;
                return ["<polygon ", "COMMON_PARTS", 'points="', [-t + " " + e, "0 " + -e, t + " " + e].join(","), '" />']
            }
        }), r.Triangle.fromObject = function(t, e) { return r.Object._fromObject("Triangle", t, e) })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var r = t.fabric || (t.fabric = {}),
            e = 2 * Math.PI;
        r.Ellipse ? r.warn("fabric.Ellipse is already defined.") : (r.Ellipse = r.util.createClass(r.Object, {
            type: "ellipse",
            rx: 0,
            ry: 0,
            cacheProperties: r.Object.prototype.cacheProperties.concat("rx", "ry"),
            initialize: function(t) { this.callSuper("initialize", t), this.set("rx", t && t.rx || 0), this.set("ry", t && t.ry || 0) },
            _set: function(t, e) {
                switch (this.callSuper("_set", t, e), t) {
                    case "rx":
                        this.rx = e, this.set("width", 2 * e);
                        break;
                    case "ry":
                        this.ry = e, this.set("height", 2 * e)
                }
                return this
            },
            getRx: function() { return this.get("rx") * this.get("scaleX") },
            getRy: function() { return this.get("ry") * this.get("scaleY") },
            toObject: function(t) { return this.callSuper("toObject", ["rx", "ry"].concat(t)) },
            _toSVG: function() { return ["<ellipse ", "COMMON_PARTS", 'cx="0" cy="0" ', 'rx="', this.rx, '" ry="', this.ry, '" />\n'] },
            _render: function(t) { t.beginPath(), t.save(), t.transform(1, 0, 0, this.ry / this.rx, 0, 0), t.arc(0, 0, this.rx, 0, e, !1), t.restore(), this._renderPaintInOrder(t) }
        }), r.Ellipse.ATTRIBUTE_NAMES = r.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" ")), r.Ellipse.fromElement = function(t, e) {
            var i = r.parseAttributes(t, r.Ellipse.ATTRIBUTE_NAMES);
            i.left = (i.left || 0) - i.rx, i.top = (i.top || 0) - i.ry, e(new r.Ellipse(i))
        }, r.Ellipse.fromObject = function(t, e) { return r.Object._fromObject("Ellipse", t, e) })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var s = t.fabric || (t.fabric = {}),
            o = s.util.object.extend;
        s.Rect ? s.warn("fabric.Rect is already defined") : (s.Rect = s.util.createClass(s.Object, {
            stateProperties: s.Object.prototype.stateProperties.concat("rx", "ry"),
            type: "rect",
            rx: 0,
            ry: 0,
            cacheProperties: s.Object.prototype.cacheProperties.concat("rx", "ry"),
            initialize: function(t) { this.callSuper("initialize", t), this._initRxRy() },
            _initRxRy: function() { this.rx && !this.ry ? this.ry = this.rx : this.ry && !this.rx && (this.rx = this.ry) },
            _render: function(t) {
                if (1 !== this.width || 1 !== this.height) {
                    var e = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                        i = this.ry ? Math.min(this.ry, this.height / 2) : 0,
                        r = this.width,
                        n = this.height,
                        s = -this.width / 2,
                        o = -this.height / 2,
                        a = 0 !== e || 0 !== i,
                        c = .4477152502;
                    t.beginPath(), t.moveTo(s + e, o), t.lineTo(s + r - e, o), a && t.bezierCurveTo(s + r - c * e, o, s + r, o + c * i, s + r, o + i), t.lineTo(s + r, o + n - i), a && t.bezierCurveTo(s + r, o + n - c * i, s + r - c * e, o + n, s + r - e, o + n), t.lineTo(s + e, o + n), a && t.bezierCurveTo(s + c * e, o + n, s, o + n - c * i, s, o + n - i), t.lineTo(s, o + i), a && t.bezierCurveTo(s, o + c * i, s + c * e, o, s + e, o), t.closePath(), this._renderPaintInOrder(t)
                } else t.fillRect(-.5, -.5, 1, 1)
            },
            _renderDashedStroke: function(t) {
                var e = -this.width / 2,
                    i = -this.height / 2,
                    r = this.width,
                    n = this.height;
                t.beginPath(), s.util.drawDashedLine(t, e, i, e + r, i, this.strokeDashArray), s.util.drawDashedLine(t, e + r, i, e + r, i + n, this.strokeDashArray), s.util.drawDashedLine(t, e + r, i + n, e, i + n, this.strokeDashArray), s.util.drawDashedLine(t, e, i + n, e, i, this.strokeDashArray), t.closePath()
            },
            toObject: function(t) { return this.callSuper("toObject", ["rx", "ry"].concat(t)) },
            _toSVG: function() { return ["<rect ", "COMMON_PARTS", 'x="', -this.width / 2, '" y="', -this.height / 2, '" rx="', this.rx, '" ry="', this.ry, '" width="', this.width, '" height="', this.height, '" />\n'] }
        }), s.Rect.ATTRIBUTE_NAMES = s.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")), s.Rect.fromElement = function(t, e, i) {
            if (!t) return e(null);
            i = i || {};
            var r = s.parseAttributes(t, s.Rect.ATTRIBUTE_NAMES);
            r.left = r.left || 0, r.top = r.top || 0;
            var n = new s.Rect(o(i ? s.util.object.clone(i) : {}, r));
            n.visible = n.visible && 0 < n.width && 0 < n.height, e(n)
        }, s.Rect.fromObject = function(t, e) { return s.Object._fromObject("Rect", t, e) })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var o = t.fabric || (t.fabric = {}),
            e = o.util.object.extend,
            r = o.util.array.min,
            n = o.util.array.max,
            a = o.util.toFixed;
        o.Polyline ? o.warn("fabric.Polyline is already defined") : (o.Polyline = o.util.createClass(o.Object, {
            type: "polyline",
            points: null,
            cacheProperties: o.Object.prototype.cacheProperties.concat("points"),
            initialize: function(t, e) {
                e = e || {}, this.points = t || [], this.callSuper("initialize", e);
                var i = this._calcDimensions();
                void 0 === e.left && (this.left = i.left), void 0 === e.top && (this.top = i.top), this.width = i.width, this.height = i.height, this.pathOffset = { x: i.left + this.width / 2, y: i.top + this.height / 2 }
            },
            _calcDimensions: function() {
                var t = this.points,
                    e = r(t, "x") || 0,
                    i = r(t, "y") || 0;
                return { left: e, top: i, width: (n(t, "x") || 0) - e, height: (n(t, "y") || 0) - i }
            },
            toObject: function(t) { return e(this.callSuper("toObject", t), { points: this.points.concat() }) },
            _toSVG: function() { for (var t = [], e = this.pathOffset.x, i = this.pathOffset.y, r = o.Object.NUM_FRACTION_DIGITS, n = 0, s = this.points.length; n < s; n++) t.push(a(this.points[n].x - e, r), ",", a(this.points[n].y - i, r), " "); return ["<" + this.type + " ", "COMMON_PARTS", 'points="', t.join(""), '" />\n'] },
            commonRender: function(t) {
                var e, i = this.points.length,
                    r = this.pathOffset.x,
                    n = this.pathOffset.y;
                if (!i || isNaN(this.points[i - 1].y)) return !1;
                t.beginPath(), t.moveTo(this.points[0].x - r, this.points[0].y - n);
                for (var s = 0; s < i; s++) e = this.points[s], t.lineTo(e.x - r, e.y - n);
                return !0
            },
            _render: function(t) { this.commonRender(t) && this._renderPaintInOrder(t) },
            _renderDashedStroke: function(t) {
                var e, i;
                t.beginPath();
                for (var r = 0, n = this.points.length; r < n; r++) e = this.points[r], i = this.points[r + 1] || e, o.util.drawDashedLine(t, e.x, e.y, i.x, i.y, this.strokeDashArray)
            },
            complexity: function() { return this.get("points").length }
        }), o.Polyline.ATTRIBUTE_NAMES = o.SHARED_ATTRIBUTES.concat(), o.Polyline.fromElement = function(t, e, i) {
            if (!t) return e(null);
            i || (i = {});
            var r = o.parsePointsAttribute(t.getAttribute("points")),
                n = o.parseAttributes(t, o.Polyline.ATTRIBUTE_NAMES);
            e(new o.Polyline(r, o.util.object.extend(n, i)))
        }, o.Polyline.fromObject = function(t, e) { return o.Object._fromObject("Polyline", t, e, "points") })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var s = t.fabric || (t.fabric = {}),
            o = s.util.object.extend;
        s.Polygon ? s.warn("fabric.Polygon is already defined") : (s.Polygon = s.util.createClass(s.Polyline, { type: "polygon", _render: function(t) { this.commonRender(t) && (t.closePath(), this._renderPaintInOrder(t)) }, _renderDashedStroke: function(t) { this.callSuper("_renderDashedStroke", t), t.closePath() } }), s.Polygon.ATTRIBUTE_NAMES = s.SHARED_ATTRIBUTES.concat(), s.Polygon.fromElement = function(t, e, i) {
            if (!t) return e(null);
            i || (i = {});
            var r = s.parsePointsAttribute(t.getAttribute("points")),
                n = s.parseAttributes(t, s.Polygon.ATTRIBUTE_NAMES);
            e(new s.Polygon(r, o(n, i)))
        }, s.Polygon.fromObject = function(t, e) { return s.Object._fromObject("Polygon", t, e, "points") })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var m = t.fabric || (t.fabric = {}),
            b = m.util.array.min,
            _ = m.util.array.max,
            n = m.util.object.extend,
            r = Object.prototype.toString,
            p = m.util.drawArc,
            e = m.util.toFixed,
            y = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7 },
            x = { m: "l", M: "L" };
        m.Path ? m.warn("fabric.Path is already defined") : (m.Path = m.util.createClass(m.Object, {
            type: "path",
            path: null,
            cacheProperties: m.Object.prototype.cacheProperties.concat("path", "fillRule"),
            stateProperties: m.Object.prototype.stateProperties.concat("path"),
            initialize: function(t, e) {
                e = e || {}, this.callSuper("initialize", e), t || (t = []);
                var i = "[object Array]" === r.call(t);
                this.path = i ? t : t.match && t.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi), this.path && (i || (this.path = this._parsePath()), this._setPositionDimensions(e))
            },
            _setPositionDimensions: function(t) {
                var e = this._parseDimensions();
                this.width = e.width, this.height = e.height, void 0 === t.left && (this.left = e.left), void 0 === t.top && (this.top = e.top), this.pathOffset = this.pathOffset || { x: e.left + this.width / 2, y: e.top + this.height / 2 }
            },
            _renderPathCommands: function(t) {
                var e, i, r, n = null,
                    s = 0,
                    o = 0,
                    a = 0,
                    c = 0,
                    h = 0,
                    l = 0,
                    u = -this.pathOffset.x,
                    f = -this.pathOffset.y;
                t.beginPath();
                for (var d = 0, g = this.path.length; d < g; ++d) {
                    switch ((e = this.path[d])[0]) {
                        case "l":
                            a += e[1], c += e[2], t.lineTo(a + u, c + f);
                            break;
                        case "L":
                            a = e[1], c = e[2], t.lineTo(a + u, c + f);
                            break;
                        case "h":
                            a += e[1], t.lineTo(a + u, c + f);
                            break;
                        case "H":
                            a = e[1], t.lineTo(a + u, c + f);
                            break;
                        case "v":
                            c += e[1], t.lineTo(a + u, c + f);
                            break;
                        case "V":
                            c = e[1], t.lineTo(a + u, c + f);
                            break;
                        case "m":
                            s = a += e[1], o = c += e[2], t.moveTo(a + u, c + f);
                            break;
                        case "M":
                            s = a = e[1], o = c = e[2], t.moveTo(a + u, c + f);
                            break;
                        case "c":
                            i = a + e[5], r = c + e[6], h = a + e[3], l = c + e[4], t.bezierCurveTo(a + e[1] + u, c + e[2] + f, h + u, l + f, i + u, r + f), a = i, c = r;
                            break;
                        case "C":
                            a = e[5], c = e[6], h = e[3], l = e[4], t.bezierCurveTo(e[1] + u, e[2] + f, h + u, l + f, a + u, c + f);
                            break;
                        case "s":
                            i = a + e[3], r = c + e[4], null === n[0].match(/[CcSs]/) ? (h = a, l = c) : (h = 2 * a - h, l = 2 * c - l), t.bezierCurveTo(h + u, l + f, a + e[1] + u, c + e[2] + f, i + u, r + f), h = a + e[1], l = c + e[2], a = i, c = r;
                            break;
                        case "S":
                            i = e[3], r = e[4], null === n[0].match(/[CcSs]/) ? (h = a, l = c) : (h = 2 * a - h, l = 2 * c - l), t.bezierCurveTo(h + u, l + f, e[1] + u, e[2] + f, i + u, r + f), a = i, c = r, h = e[1], l = e[2];
                            break;
                        case "q":
                            i = a + e[3], r = c + e[4], h = a + e[1], l = c + e[2], t.quadraticCurveTo(h + u, l + f, i + u, r + f), a = i, c = r;
                            break;
                        case "Q":
                            i = e[3], r = e[4], t.quadraticCurveTo(e[1] + u, e[2] + f, i + u, r + f), a = i, c = r, h = e[1], l = e[2];
                            break;
                        case "t":
                            i = a + e[1], r = c + e[2], null === n[0].match(/[QqTt]/) ? (h = a, l = c) : (h = 2 * a - h, l = 2 * c - l), t.quadraticCurveTo(h + u, l + f, i + u, r + f), a = i, c = r;
                            break;
                        case "T":
                            i = e[1], r = e[2], null === n[0].match(/[QqTt]/) ? (h = a, l = c) : (h = 2 * a - h, l = 2 * c - l), t.quadraticCurveTo(h + u, l + f, i + u, r + f), a = i, c = r;
                            break;
                        case "a":
                            p(t, a + u, c + f, [e[1], e[2], e[3], e[4], e[5], e[6] + a + u, e[7] + c + f]), a += e[6], c += e[7];
                            break;
                        case "A":
                            p(t, a + u, c + f, [e[1], e[2], e[3], e[4], e[5], e[6] + u, e[7] + f]), a = e[6], c = e[7];
                            break;
                        case "z":
                        case "Z":
                            a = s, c = o, t.closePath()
                    }
                    n = e
                }
            },
            _render: function(t) { this._renderPathCommands(t), this._renderPaintInOrder(t) },
            toString: function() { return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>" },
            toObject: function(t) { return n(this.callSuper("toObject", t), { path: this.path.map(function(t) { return t.slice() }), top: this.top, left: this.left }) },
            toDatalessObject: function(t) { var e = this.toObject(["sourcePath"].concat(t)); return e.sourcePath && delete e.path, e },
            _toSVG: function() { var t = this._getOffsetTransform(); return ["<path ", "COMMON_PARTS", 'd="', this.path.map(function(t) { return t.join(" ") }).join(" "), '" stroke-linecap="round" ', 'transform="' + t + '" ', "/>\n"] },
            _getOffsetTransform: function() { var t = m.Object.NUM_FRACTION_DIGITS; return " translate(" + e(-this.pathOffset.x, t) + ", " + e(-this.pathOffset.y, t) + ")" },
            toClipPathSVG: function(t) { var e = this._getOffsetTransform(); return "\t" + this._createBaseClipPathSVGMarkup(this._toSVG(), { reviver: t, additionalTransform: e }) },
            complexity: function() { return this.path.length },
            _parsePath: function() {
                for (var t, e, i, r, n, s = [], o = [], a = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, c = 0, h = this.path.length; c < h; c++) {
                    for (r = (t = this.path[c]).slice(1).trim(), o.length = 0; i = a.exec(r);) o.push(i[0]);
                    n = [t.charAt(0)];
                    for (var l = 0, u = o.length; l < u; l++) e = parseFloat(o[l]), isNaN(e) || n.push(e);
                    var f = n[0],
                        d = y[f.toLowerCase()],
                        g = x[f] || f;
                    if (n.length - 1 > d)
                        for (var p = 1, v = n.length; p < v; p += d) s.push([f].concat(n.slice(p, p + d))), f = g;
                    else s.push(n)
                }
                return s
            },
            _parseDimensions: function() {
                for (var t, e, i, r, n = [], s = [], o = null, a = 0, c = 0, h = 0, l = 0, u = 0, f = 0, d = 0, g = this.path.length; d < g; ++d) {
                    switch ((t = this.path[d])[0]) {
                        case "l":
                            h += t[1], l += t[2], r = [];
                            break;
                        case "L":
                            h = t[1], l = t[2], r = [];
                            break;
                        case "h":
                            h += t[1], r = [];
                            break;
                        case "H":
                            h = t[1], r = [];
                            break;
                        case "v":
                            l += t[1], r = [];
                            break;
                        case "V":
                            l = t[1], r = [];
                            break;
                        case "m":
                            a = h += t[1], c = l += t[2], r = [];
                            break;
                        case "M":
                            a = h = t[1], c = l = t[2], r = [];
                            break;
                        case "c":
                            e = h + t[5], i = l + t[6], u = h + t[3], f = l + t[4], r = m.util.getBoundsOfCurve(h, l, h + t[1], l + t[2], u, f, e, i), h = e, l = i;
                            break;
                        case "C":
                            u = t[3], f = t[4], r = m.util.getBoundsOfCurve(h, l, t[1], t[2], u, f, t[5], t[6]), h = t[5], l = t[6];
                            break;
                        case "s":
                            e = h + t[3], i = l + t[4], null === o[0].match(/[CcSs]/) ? (u = h, f = l) : (u = 2 * h - u, f = 2 * l - f), r = m.util.getBoundsOfCurve(h, l, u, f, h + t[1], l + t[2], e, i), u = h + t[1], f = l + t[2], h = e, l = i;
                            break;
                        case "S":
                            e = t[3], i = t[4], null === o[0].match(/[CcSs]/) ? (u = h, f = l) : (u = 2 * h - u, f = 2 * l - f), r = m.util.getBoundsOfCurve(h, l, u, f, t[1], t[2], e, i), h = e, l = i, u = t[1], f = t[2];
                            break;
                        case "q":
                            e = h + t[3], i = l + t[4], u = h + t[1], f = l + t[2], r = m.util.getBoundsOfCurve(h, l, u, f, u, f, e, i), h = e, l = i;
                            break;
                        case "Q":
                            u = t[1], f = t[2], r = m.util.getBoundsOfCurve(h, l, u, f, u, f, t[3], t[4]), h = t[3], l = t[4];
                            break;
                        case "t":
                            e = h + t[1], i = l + t[2], null === o[0].match(/[QqTt]/) ? (u = h, f = l) : (u = 2 * h - u, f = 2 * l - f), r = m.util.getBoundsOfCurve(h, l, u, f, u, f, e, i), h = e, l = i;
                            break;
                        case "T":
                            e = t[1], i = t[2], null === o[0].match(/[QqTt]/) ? (u = h, f = l) : (u = 2 * h - u, f = 2 * l - f), r = m.util.getBoundsOfCurve(h, l, u, f, u, f, e, i), h = e, l = i;
                            break;
                        case "a":
                            r = m.util.getBoundsOfArc(h, l, t[1], t[2], t[3], t[4], t[5], t[6] + h, t[7] + l), h += t[6], l += t[7];
                            break;
                        case "A":
                            r = m.util.getBoundsOfArc(h, l, t[1], t[2], t[3], t[4], t[5], t[6], t[7]), h = t[6], l = t[7];
                            break;
                        case "z":
                        case "Z":
                            h = a, l = c
                    }
                    o = t, r.forEach(function(t) { n.push(t.x), s.push(t.y) }), n.push(h), s.push(l)
                }
                var p = b(n) || 0,
                    v = b(s) || 0;
                return { left: p, top: v, width: (_(n) || 0) - p, height: (_(s) || 0) - v }
            }
        }), m.Path.fromObject = function(i, r) {
            if ("string" == typeof i.sourcePath) {
                var t = i.sourcePath;
                m.loadSVGFromURL(t, function(t) {
                    var e = t[0];
                    e.setOptions(i), r && r(e)
                })
            } else m.Object._fromObject("Path", i, r, "path")
        }, m.Path.ATTRIBUTE_NAMES = m.SHARED_ATTRIBUTES.concat(["d"]), m.Path.fromElement = function(t, e, i) {
            var r = m.parseAttributes(t, m.Path.ATTRIBUTE_NAMES);
            e(new m.Path(r.d, n(r, i)))
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var h = t.fabric || (t.fabric = {}),
            l = h.util.array.min,
            u = h.util.array.max;
        h.Group || (h.Group = h.util.createClass(h.Object, h.Collection, {
            type: "group",
            strokeWidth: 0,
            subTargetCheck: !1,
            cacheProperties: [],
            useSetOnGroup: !1,
            initialize: function(t, e, i) {
                e = e || {}, this._objects = [], i && this.callSuper("initialize", e), this._objects = t || [];
                for (var r = this._objects.length; r--;) this._objects[r].group = this;
                if (i) this._updateObjectsACoords();
                else {
                    var n = e && e.centerPoint;
                    void 0 !== e.originX && (this.originX = e.originX), void 0 !== e.originY && (this.originY = e.originY), n || this._calcBounds(), this._updateObjectsCoords(n), delete e.centerPoint, this.callSuper("initialize", e)
                }
                this.setCoords()
            },
            _updateObjectsACoords: function() { for (var t = this._objects.length; t--;) this._objects[t].setCoords(!0, !0) },
            _updateObjectsCoords: function(t) { t = t || this.getCenterPoint(); for (var e = this._objects.length; e--;) this._updateObjectCoords(this._objects[e], t) },
            _updateObjectCoords: function(t, e) {
                var i = t.left,
                    r = t.top;
                t.set({ left: i - e.x, top: r - e.y }), t.group = this, t.setCoords(!0, !0)
            },
            toString: function() { return "#<fabric.Group: (" + this.complexity() + ")>" },
            addWithUpdate: function(t) { return this._restoreObjectsState(), h.util.resetObjectTransform(this), t && (this._objects.push(t), t.group = this, t._set("canvas", this.canvas)), this._calcBounds(), this._updateObjectsCoords(), this.setCoords(), this.dirty = !0, this },
            removeWithUpdate: function(t) { return this._restoreObjectsState(), h.util.resetObjectTransform(this), this.remove(t), this._calcBounds(), this._updateObjectsCoords(), this.setCoords(), this.dirty = !0, this },
            _onObjectAdded: function(t) { this.dirty = !0, t.group = this, t._set("canvas", this.canvas) },
            _onObjectRemoved: function(t) { this.dirty = !0, delete t.group },
            _set: function(t, e) {
                var i = this._objects.length;
                if (this.useSetOnGroup)
                    for (; i--;) this._objects[i].setOnGroup(t, e);
                if ("canvas" === t)
                    for (; i--;) this._objects[i]._set(t, e);
                h.Object.prototype._set.call(this, t, e)
            },
            toObject: function(r) {
                var n = this.includeDefaultValues,
                    t = this._objects.map(function(t) {
                        var e = t.includeDefaultValues;
                        t.includeDefaultValues = n;
                        var i = t.toObject(r);
                        return t.includeDefaultValues = e, i
                    }),
                    e = h.Object.prototype.toObject.call(this, r);
                return e.objects = t, e
            },
            toDatalessObject: function(r) {
                var t, e = this.sourcePath;
                if (e) t = e;
                else {
                    var n = this.includeDefaultValues;
                    t = this._objects.map(function(t) {
                        var e = t.includeDefaultValues;
                        t.includeDefaultValues = n;
                        var i = t.toDatalessObject(r);
                        return t.includeDefaultValues = e, i
                    })
                }
                var i = h.Object.prototype.toDatalessObject.call(this, r);
                return i.objects = t, i
            },
            render: function(t) { this._transformDone = !0, this.callSuper("render", t), this._transformDone = !1 },
            shouldCache: function() {
                var t = this.objectCaching && (!this.group || this.needsItsOwnCache() || !this.group.isOnACache());
                if (this.ownCaching = t)
                    for (var e = 0, i = this._objects.length; e < i; e++)
                        if (this._objects[e].willDrawShadow()) return this.ownCaching = !1;
                return t
            },
            willDrawShadow: function() {
                if (this.shadow) return h.Object.prototype.willDrawShadow.call(this);
                for (var t = 0, e = this._objects.length; t < e; t++)
                    if (this._objects[t].willDrawShadow()) return !0;
                return !1
            },
            isOnACache: function() { return this.ownCaching || this.group && this.group.isOnACache() },
            drawObject: function(t) {
                for (var e = 0, i = this._objects.length; e < i; e++) this._objects[e].render(t);
                this._drawClipPath(t)
            },
            isCacheDirty: function(t) {
                if (this.callSuper("isCacheDirty", t)) return !0;
                if (!this.statefullCache) return !1;
                for (var e = 0, i = this._objects.length; e < i; e++)
                    if (this._objects[e].isCacheDirty(!0)) {
                        if (this._cacheCanvas) {
                            var r = this.cacheWidth / this.zoomX,
                                n = this.cacheHeight / this.zoomY;
                            this._cacheContext.clearRect(-r / 2, -n / 2, r, n)
                        }
                        return !0
                    }
                return !1
            },
            _restoreObjectsState: function() { return this._objects.forEach(this._restoreObjectState, this), this },
            realizeTransform: function(t) {
                var e = t.calcTransformMatrix(),
                    i = h.util.qrDecompose(e),
                    r = new h.Point(i.translateX, i.translateY);
                return t.flipX = !1, t.flipY = !1, t.set("scaleX", i.scaleX), t.set("scaleY", i.scaleY), t.skewX = i.skewX, t.skewY = i.skewY, t.angle = i.angle, t.setPositionByOrigin(r, "center", "center"), t
            },
            _restoreObjectState: function(t) { return this.realizeTransform(t), t.setCoords(), delete t.group, this },
            destroy: function() { return this._objects.forEach(function(t) { t.set("dirty", !0) }), this._restoreObjectsState() },
            toActiveSelection: function() {
                if (this.canvas) {
                    var t = this._objects,
                        e = this.canvas;
                    this._objects = [];
                    var i = this.toObject();
                    delete i.objects;
                    var r = new h.ActiveSelection([]);
                    return r.set(i), r.type = "activeSelection", e.remove(this), t.forEach(function(t) { t.group = r, t.dirty = !0, e.add(t) }), r.canvas = e, r._objects = t, (e._activeObject = r).setCoords(), r
                }
            },
            ungroupOnCanvas: function() { return this._restoreObjectsState() },
            setObjectsCoords: function() { return this.forEachObject(function(t) { t.setCoords(!0, !0) }), this },
            _calcBounds: function(t) {
                for (var e, i, r, n = [], s = [], o = ["tr", "br", "bl", "tl"], a = 0, c = this._objects.length, h = o.length; a < c; ++a)
                    for ((e = this._objects[a]).setCoords(!0), r = 0; r < h; r++) i = o[r], n.push(e.oCoords[i].x), s.push(e.oCoords[i].y);
                this._getBounds(n, s, t)
            },
            _getBounds: function(t, e, i) {
                var r = new h.Point(l(t), l(e)),
                    n = new h.Point(u(t), u(e)),
                    s = r.y || 0,
                    o = r.x || 0,
                    a = n.x - r.x || 0,
                    c = n.y - r.y || 0;
                this.width = a, this.height = c, i || this.setPositionByOrigin({ x: o, y: s }, "left", "top")
            },
            toSVG: function(t) { for (var e = [], i = 0, r = this._objects.length; i < r; i++) e.push("\t", this._objects[i].toSVG(t)); return this._createBaseSVGMarkup(e, { reviver: t, noStyle: !0, withShadow: !0 }) },
            toClipPathSVG: function(t) { for (var e = [], i = 0, r = this._objects.length; i < r; i++) e.push("\t", this._objects[i].toClipPathSVG(t)); return this._createBaseClipPathSVGMarkup(e, { reviver: t }) }
        }), h.Group.fromObject = function(i, r) {
            h.util.enlivenObjects(i.objects, function(t) {
                var e = h.util.object.clone(i, !0);
                delete e.objects, r && r(new h.Group(t, e, !0))
            })
        })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var n = t.fabric || (t.fabric = {});
        n.ActiveSelection || (n.ActiveSelection = n.util.createClass(n.Group, {
            type: "activeSelection",
            initialize: function(t, e) {
                e = e || {}, this._objects = t || [];
                for (var i = this._objects.length; i--;) this._objects[i].group = this;
                e.originX && (this.originX = e.originX), e.originY && (this.originY = e.originY), this._calcBounds(), this._updateObjectsCoords(), n.Object.prototype.initialize.call(this, e), this.setCoords()
            },
            toGroup: function() {
                var t = this._objects.concat();
                this._objects = [];
                var e = n.Object.prototype.toObject.call(this),
                    i = new n.Group([]);
                if (delete e.type, i.set(e), t.forEach(function(t) { t.canvas.remove(t), t.group = i }), i._objects = t, !this.canvas) return i;
                var r = this.canvas;
                return r.add(i), (r._activeObject = i).setCoords(), i
            },
            onDeselect: function() { return this.destroy(), !1 },
            toString: function() { return "#<fabric.ActiveSelection: (" + this.complexity() + ")>" },
            shouldCache: function() { return !1 },
            isOnACache: function() { return !1 },
            _renderControls: function(t, e, i) {
                t.save(), t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, this.callSuper("_renderControls", t, e), void 0 === (i = i || {}).hasControls && (i.hasControls = !1), void 0 === i.hasRotatingPoint && (i.hasRotatingPoint = !1), i.forActiveSelection = !0;
                for (var r = 0, n = this._objects.length; r < n; r++) this._objects[r]._renderControls(t, i);
                t.restore()
            }
        }), n.ActiveSelection.fromObject = function(e, i) { n.util.enlivenObjects(e.objects, function(t) { delete e.objects, i && i(new n.ActiveSelection(t, e, !0)) }) })
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var n = fabric.util.object.extend;
        t.fabric || (t.fabric = {}), t.fabric.Image ? fabric.warn("fabric.Image is already defined.") : (fabric.Image = fabric.util.createClass(fabric.Object, {
            type: "image",
            crossOrigin: "",
            strokeWidth: 0,
            _lastScaleX: 1,
            _lastScaleY: 1,
            _filterScalingX: 1,
            _filterScalingY: 1,
            minimumScaleTrigger: .5,
            stateProperties: fabric.Object.prototype.stateProperties.concat("cropX", "cropY"),
            cacheKey: "",
            cropX: 0,
            cropY: 0,
            initialize: function(t, e) { e || (e = {}), this.filters = [], this.cacheKey = "texture" + fabric.Object.__uid++, this.callSuper("initialize", e), this._initElement(t, e) },
            getElement: function() { return this._element || {} },
            setElement: function(t, e) { return this.removeTexture(this.cacheKey), this.removeTexture(this.cacheKey + "_filtered"), this._element = t, this._originalElement = t, this._initConfig(e), this.resizeFilter && this.applyResizeFilters(), 0 !== this.filters.length && this.applyFilters(), this },
            removeTexture: function(t) {
                var e = fabric.filterBackend;
                e && e.evictCachesForKey && e.evictCachesForKey(t)
            },
            dispose: function() { this.removeTexture(this.cacheKey), this.removeTexture(this.cacheKey + "_filtered"), this._cacheContext = void 0, ["_originalElement", "_element", "_filteredEl", "_cacheCanvas"].forEach(function(t) { fabric.util.cleanUpJsdomNode(this[t]), this[t] = void 0 }.bind(this)) },
            setCrossOrigin: function(t) { return this.crossOrigin = t, this._element.crossOrigin = t, this },
            getOriginalSize: function() { var t = this.getElement(); return { width: t.naturalWidth || t.width, height: t.naturalHeight || t.height } },
            _stroke: function(t) {
                if (this.stroke && 0 !== this.strokeWidth) {
                    var e = this.width / 2,
                        i = this.height / 2;
                    t.beginPath(), t.moveTo(-e, -i), t.lineTo(e, -i), t.lineTo(e, i), t.lineTo(-e, i), t.lineTo(-e, -i), t.closePath()
                }
            },
            _renderDashedStroke: function(t) {
                var e = -this.width / 2,
                    i = -this.height / 2,
                    r = this.width,
                    n = this.height;
                t.save(), this._setStrokeStyles(t, this), t.beginPath(), fabric.util.drawDashedLine(t, e, i, e + r, i, this.strokeDashArray), fabric.util.drawDashedLine(t, e + r, i, e + r, i + n, this.strokeDashArray), fabric.util.drawDashedLine(t, e + r, i + n, e, i + n, this.strokeDashArray), fabric.util.drawDashedLine(t, e, i + n, e, i, this.strokeDashArray), t.closePath(), t.restore()
            },
            toObject: function(t) {
                var e = [];
                this.filters.forEach(function(t) { t && e.push(t.toObject()) });
                var i = n(this.callSuper("toObject", ["crossOrigin", "cropX", "cropY"].concat(t)), { src: this.getSrc(), filters: e });
                return this.resizeFilter && (i.resizeFilter = this.resizeFilter.toObject()), i
            },
            hasCrop: function() { return this.cropX || this.cropY || this.width < this._element.width || this.height < this._element.height },
            _toSVG: function() {
                var t, e = [],
                    i = [],
                    r = -this.width / 2,
                    n = -this.height / 2,
                    s = "";
                if (this.hasCrop()) {
                    var o = fabric.Object.__uid++;
                    e.push('<clipPath id="imageCrop_' + o + '">\n', '\t<rect x="' + r + '" y="' + n + '" width="' + this.width + '" height="' + this.height + '" />\n', "</clipPath>\n"), s = ' clip-path="url(#imageCrop_' + o + ')" '
                }
                if (i.push("\t<image ", "COMMON_PARTS", 'xlink:href="', this.getSvgSrc(!0), '" x="', r - this.cropX, '" y="', n - this.cropY, '" width="', this._element.width || this._element.naturalWidth, '" height="', this._element.height || this._element.height, '"', s, "></image>\n"), this.stroke || this.strokeDashArray) {
                    var a = this.fill;
                    this.fill = null, t = ["\t<rect ", 'x="', r, '" y="', n, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n'], this.fill = a
                }
                return e = "fill" !== this.paintFirst ? e.concat(t, i) : e.concat(i, t)
            },
            getSrc: function(t) { var e = t ? this._element : this._originalElement; return e ? e.toDataURL ? e.toDataURL() : e.src : this.src || "" },
            setSrc: function(t, e, i) { return fabric.util.loadImage(t, function(t) { this.setElement(t, i), this._setWidthHeight(), e(this) }, this, i && i.crossOrigin), this },
            toString: function() { return '#<fabric.Image: { src: "' + this.getSrc() + '" }>' },
            applyResizeFilters: function() {
                var t = this.resizeFilter,
                    e = this.minimumScaleTrigger,
                    i = this.getTotalObjectScaling(),
                    r = i.scaleX,
                    n = i.scaleY,
                    s = this._filteredEl || this._originalElement;
                if (this.group && this.set("dirty", !0), !t || e < r && e < n) return this._element = s, this._filterScalingX = 1, this._filterScalingY = 1, this._lastScaleX = r, void(this._lastScaleY = n);
                fabric.filterBackend || (fabric.filterBackend = fabric.initFilterBackend());
                var o = fabric.util.createCanvasElement(),
                    a = this._filteredEl ? this.cacheKey + "_filtered" : this.cacheKey,
                    c = s.width,
                    h = s.height;
                o.width = c, o.height = h, this._element = o, this._lastScaleX = t.scaleX = r, this._lastScaleY = t.scaleY = n, fabric.filterBackend.applyFilters([t], s, c, h, this._element, a), this._filterScalingX = o.width / this._originalElement.width, this._filterScalingY = o.height / this._originalElement.height
            },
            applyFilters: function(t) {
                if (t = (t = t || this.filters || []).filter(function(t) { return t && !t.isNeutralState() }), this.set("dirty", !0), this.removeTexture(this.cacheKey + "_filtered"), 0 === t.length) return this._element = this._originalElement, this._filteredEl = null, this._filterScalingX = 1, this._filterScalingY = 1, this;
                var e = this._originalElement,
                    i = e.naturalWidth || e.width,
                    r = e.naturalHeight || e.height;
                if (this._element === this._originalElement) {
                    var n = fabric.util.createCanvasElement();
                    n.width = i, n.height = r, this._element = n, this._filteredEl = n
                } else this._element = this._filteredEl, this._filteredEl.getContext("2d").clearRect(0, 0, i, r), this._lastScaleX = 1, this._lastScaleY = 1;
                return fabric.filterBackend || (fabric.filterBackend = fabric.initFilterBackend()), fabric.filterBackend.applyFilters(t, this._originalElement, i, r, this._element, this.cacheKey), this._originalElement.width === this._element.width && this._originalElement.height === this._element.height || (this._filterScalingX = this._element.width / this._originalElement.width, this._filterScalingY = this._element.height / this._originalElement.height), this
            },
            _render: function(t) {!0 !== this.isMoving && this.resizeFilter && this._needsResize() && this.applyResizeFilters(), this._stroke(t), this._renderPaintInOrder(t) },
            shouldCache: function() { return this.ownCaching = this.objectCaching && this.needsItsOwnCache(), this.ownCaching },
            _renderFill: function(t) {
                var e = this.width,
                    i = this.height,
                    r = e * this._filterScalingX,
                    n = i * this._filterScalingY,
                    s = -e / 2,
                    o = -i / 2,
                    a = this._element;
                a && t.drawImage(a, this.cropX * this._filterScalingX, this.cropY * this._filterScalingY, r, n, s, o, e, i)
            },
            _needsResize: function() { var t = this.getTotalObjectScaling(); return t.scaleX !== this._lastScaleX || t.scaleY !== this._lastScaleY },
            _resetWidthHeight: function() { this.set(this.getOriginalSize()) },
            _initElement: function(t, e) { this.setElement(fabric.util.getById(t), e), fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS) },
            _initConfig: function(t) { t || (t = {}), this.setOptions(t), this._setWidthHeight(t), this._element && this.crossOrigin && (this._element.crossOrigin = this.crossOrigin) },
            _initFilters: function(t, e) { t && t.length ? fabric.util.enlivenObjects(t, function(t) { e && e(t) }, "fabric.Image.filters") : e && e() },
            _setWidthHeight: function(t) {
                t || (t = {});
                var e = this.getElement();
                this.width = t.width || e.naturalWidth || e.width || 0, this.height = t.height || e.naturalHeight || e.height || 0
            },
            parsePreserveAspectRatioAttribute: function() {
                var t, e = fabric.util.parsePreserveAspectRatioAttribute(this.preserveAspectRatio || ""),
                    i = this._element.width,
                    r = this._element.height,
                    n = 1,
                    s = 1,
                    o = 0,
                    a = 0,
                    c = 0,
                    h = 0,
                    l = this.width,
                    u = this.height,
                    f = { width: l, height: u };
                return !e || "none" === e.alignX && "none" === e.alignY ? (n = l / i, s = u / r) : ("meet" === e.meetOrSlice && (t = (l - i * (n = s = fabric.util.findScaleToFit(this._element, f))) / 2, "Min" === e.alignX && (o = -t), "Max" === e.alignX && (o = t), t = (u - r * s) / 2, "Min" === e.alignY && (a = -t), "Max" === e.alignY && (a = t)), "slice" === e.meetOrSlice && (t = i - l / (n = s = fabric.util.findScaleToCover(this._element, f)), "Mid" === e.alignX && (c = t / 2), "Max" === e.alignX && (c = t), t = r - u / s, "Mid" === e.alignY && (h = t / 2), "Max" === e.alignY && (h = t), i = l / n, r = u / s)), { width: i, height: r, scaleX: n, scaleY: s, offsetLeft: o, offsetTop: a, cropX: c, cropY: h }
            }
        }), fabric.Image.CSS_CANVAS = "canvas-img", fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc, fabric.Image.fromObject = function(t, r) {
            var n = fabric.util.object.clone(t);
            fabric.util.loadImage(n.src, function(i, t) {
                t ? r && r(null, t) : fabric.Image.prototype._initFilters.call(n, n.filters, function(t) {
                    n.filters = t || [], fabric.Image.prototype._initFilters.call(n, [n.resizeFilter], function(t) {
                        n.resizeFilter = t[0], fabric.util.enlivenObjects([n.clipPath], function(t) {
                            n.clipPath = t[0];
                            var e = new fabric.Image(i, n);
                            r(e)
                        })
                    })
                })
            }, null, n.crossOrigin)
        }, fabric.Image.fromURL = function(t, e, i) { fabric.util.loadImage(t, function(t) { e && e(new fabric.Image(t, i)) }, null, i && i.crossOrigin) }, fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href crossOrigin".split(" ")), fabric.Image.fromElement = function(t, e, i) {
            var r = fabric.parseAttributes(t, fabric.Image.ATTRIBUTE_NAMES);
            fabric.Image.fromURL(r["xlink:href"], e, n(i ? fabric.util.object.clone(i) : {}, r))
        })
    }("undefined" != typeof exports ? exports : this), fabric.util.object.extend(fabric.Object.prototype, {
        _getAngleValueForStraighten: function() { var t = this.angle % 360; return 0 < t ? 90 * Math.round((t - 1) / 90) : 90 * Math.round(t / 90) },
        straighten: function() { return this.rotate(this._getAngleValueForStraighten()), this },
        fxStraighten: function(t) {
            var e = function() {},
                i = (t = t || {}).onComplete || e,
                r = t.onChange || e,
                n = this;
            return fabric.util.animate({ startValue: this.get("angle"), endValue: this._getAngleValueForStraighten(), duration: this.FX_DURATION, onChange: function(t) { n.rotate(t), r() }, onComplete: function() { n.setCoords(), i() } }), this
        }
    }), fabric.util.object.extend(fabric.StaticCanvas.prototype, { straightenObject: function(t) { return t.straighten(), this.requestRenderAll(), this }, fxStraightenObject: function(t) { return t.fxStraighten({ onChange: this.requestRenderAllBound }), this } }),
    function() {
        "use strict";

        function t(t) { t && t.tileSize && (this.tileSize = t.tileSize), this.setupGLContext(this.tileSize, this.tileSize), this.captureGPUInfo() }
        fabric.isWebglSupported = function(t) {
            if (fabric.isLikelyNode) return !1;
            t = t || fabric.WebglFilterBackend.prototype.tileSize;
            var e, i, r, n = document.createElement("canvas"),
                s = n.getContext("webgl") || n.getContext("experimental-webgl"),
                o = !1;
            if (s) {
                fabric.maxTextureSize = s.getParameter(s.MAX_TEXTURE_SIZE), o = fabric.maxTextureSize >= t;
                for (var a = ["highp", "mediump", "lowp"], c = 0; c < 3; c++)
                    if (void 0, i = "precision " + a[c] + " float;\nvoid main(){}", r = (e = s).createShader(e.FRAGMENT_SHADER), e.shaderSource(r, i), e.compileShader(r), e.getShaderParameter(r, e.COMPILE_STATUS)) { fabric.webGlPrecision = a[c]; break }
            }
            return this.isSupported = o
        }, (fabric.WebglFilterBackend = t).prototype = {
            tileSize: 2048,
            resources: {},
            setupGLContext: function(t, e) { this.dispose(), this.createWebGLCanvas(t, e), this.aPosition = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), this.chooseFastestCopyGLTo2DMethod(t, e) },
            chooseFastestCopyGLTo2DMethod: function(t, e) {
                var i, r = void 0 !== window.performance;
                try { new ImageData(1, 1), i = !0 } catch (t) { i = !1 }
                var n = "undefined" != typeof ArrayBuffer,
                    s = "undefined" != typeof Uint8ClampedArray;
                if (r && i && n && s) {
                    var o, a, c = fabric.util.createCanvasElement(),
                        h = new ArrayBuffer(t * e * 4),
                        l = { imageBuffer: h, destinationWidth: t, destinationHeight: e, targetCanvas: c };
                    c.width = t, c.height = e, o = window.performance.now(), copyGLTo2DDrawImage.call(l, this.gl, l), a = window.performance.now() - o, o = window.performance.now(), copyGLTo2DPutImageData.call(l, this.gl, l), window.performance.now() - o < a ? (this.imageBuffer = h, this.copyGLTo2D = copyGLTo2DPutImageData) : this.copyGLTo2D = copyGLTo2DDrawImage
                }
            },
            createWebGLCanvas: function(t, e) {
                var i = fabric.util.createCanvasElement();
                i.width = t, i.height = e;
                var r = { alpha: !0, premultipliedAlpha: !1, depth: !1, stencil: !1, antialias: !1 },
                    n = i.getContext("webgl", r);
                n || (n = i.getContext("experimental-webgl", r)), n && (n.clearColor(0, 0, 0, 0), this.canvas = i, this.gl = n)
            },
            applyFilters: function(t, e, i, r, n, s) {
                var o, a = this.gl;
                s && (o = this.getCachedTexture(s, e));
                var c = { originalWidth: e.width || e.originalWidth, originalHeight: e.height || e.originalHeight, sourceWidth: i, sourceHeight: r, destinationWidth: i, destinationHeight: r, context: a, sourceTexture: this.createTexture(a, i, r, !o && e), targetTexture: this.createTexture(a, i, r), originalTexture: o || this.createTexture(a, i, r, !o && e), passes: t.length, webgl: !0, aPosition: this.aPosition, programCache: this.programCache, pass: 0, filterBackend: this, targetCanvas: n },
                    h = a.createFramebuffer();
                return a.bindFramebuffer(a.FRAMEBUFFER, h), t.forEach(function(t) { t && t.applyTo(c) }), resizeCanvasIfNeeded(c), this.copyGLTo2D(a, c), a.bindTexture(a.TEXTURE_2D, null), a.deleteTexture(c.sourceTexture), a.deleteTexture(c.targetTexture), a.deleteFramebuffer(h), n.getContext("2d").setTransform(1, 0, 0, 1, 0, 0), c
            },
            applyFiltersDebug: function(t, e, i, r, n, s) {
                var o = this.gl,
                    a = this.applyFilters(t, e, i, r, n, s),
                    c = o.getError();
                if (c !== o.NO_ERROR) {
                    var h = this.glErrorToString(o, c),
                        l = new Error("WebGL Error " + h);
                    throw l.glErrorCode = c, l
                }
                return a
            },
            glErrorToString: function(t, e) {
                if (!t) return "Context undefined for error code: " + e;
                if ("number" != typeof e) return "Error code is not a number";
                switch (e) {
                    case t.NO_ERROR:
                        return "NO_ERROR";
                    case t.INVALID_ENUM:
                        return "INVALID_ENUM";
                    case t.INVALID_VALUE:
                        return "INVALID_VALUE";
                    case t.INVALID_OPERATION:
                        return "INVALID_OPERATION";
                    case t.INVALID_FRAMEBUFFER_OPERATION:
                        return "INVALID_FRAMEBUFFER_OPERATION";
                    case t.OUT_OF_MEMORY:
                        return "OUT_OF_MEMORY";
                    case t.CONTEXT_LOST_WEBGL:
                        return "CONTEXT_LOST_WEBGL";
                    default:
                        return "UNKNOWN_ERROR"
                }
            },
            dispose: function() { this.canvas && (this.canvas = null, this.gl = null), this.clearWebGLCaches() },
            clearWebGLCaches: function() { this.programCache = {}, this.textureCache = {} },
            createTexture: function(t, e, i, r) { var n = t.createTexture(); return t.bindTexture(t.TEXTURE_2D, n), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), r ? t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, r) : t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, e, i, 0, t.RGBA, t.UNSIGNED_BYTE, null), n },
            getCachedTexture: function(t, e) { if (this.textureCache[t]) return this.textureCache[t]; var i = this.createTexture(this.gl, e.width, e.height, e); return this.textureCache[t] = i },
            evictCachesForKey: function(t) { this.textureCache[t] && (this.gl.deleteTexture(this.textureCache[t]), delete this.textureCache[t]) },
            copyGLTo2D: copyGLTo2DDrawImage,
            captureGPUInfo: function() {
                if (this.gpuInfo) return this.gpuInfo;
                var t = this.gl,
                    e = t.getExtension("WEBGL_debug_renderer_info"),
                    i = { renderer: "", vendor: "" };
                if (e) {
                    var r = t.getParameter(e.UNMASKED_RENDERER_WEBGL),
                        n = t.getParameter(e.UNMASKED_VENDOR_WEBGL);
                    r && (i.renderer = r.toLowerCase()), n && (i.vendor = n.toLowerCase())
                }
                return this.gpuInfo = i
            }
        }
    }(),
    function() {
        "use strict";
        var t = function() {};

        function e() {}(fabric.Canvas2dFilterBackend = e).prototype = {
            evictCachesForKey: t,
            dispose: t,
            clearWebGLCaches: t,
            resources: {},
            applyFilters: function(t, e, i, r, n) {
                var s = n.getContext("2d");
                s.drawImage(e, 0, 0, i, r);
                var o = { sourceWidth: i, sourceHeight: r, imageData: s.getImageData(0, 0, i, r), originalEl: e, originalImageData: s.getImageData(0, 0, i, r), canvasEl: n, ctx: s, filterBackend: this };
                return t.forEach(function(t) { t.applyTo(o) }), o.imageData.width === i && o.imageData.height === r || (n.width = o.imageData.width, n.height = o.imageData.height), s.putImageData(o.imageData, 0, 0), o
            }
        }
    }(), fabric.Image = fabric.Image || {}, fabric.Image.filters = fabric.Image.filters || {}, fabric.Image.filters.BaseFilter = fabric.util.createClass({
        type: "BaseFilter",
        vertexSource: "attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvoid main() {\nvTexCoord = aPosition;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}",
        fragmentSource: "precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D uTexture;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\n}",
        initialize: function(t) { t && this.setOptions(t) },
        setOptions: function(t) { for (var e in t) this[e] = t[e] },
        createProgram: function(t, e, i) {
            e = e || this.fragmentSource, i = i || this.vertexSource, "highp" !== fabric.webGlPrecision && (e = e.replace(/precision highp float/g, "precision " + fabric.webGlPrecision + " float"));
            var r = t.createShader(t.VERTEX_SHADER);
            if (t.shaderSource(r, i), t.compileShader(r), !t.getShaderParameter(r, t.COMPILE_STATUS)) throw new Error("Vertex shader compile error for " + this.type + ": " + t.getShaderInfoLog(r));
            var n = t.createShader(t.FRAGMENT_SHADER);
            if (t.shaderSource(n, e), t.compileShader(n), !t.getShaderParameter(n, t.COMPILE_STATUS)) throw new Error("Fragment shader compile error for " + this.type + ": " + t.getShaderInfoLog(n));
            var s = t.createProgram();
            if (t.attachShader(s, r), t.attachShader(s, n), t.linkProgram(s), !t.getProgramParameter(s, t.LINK_STATUS)) throw new Error('Shader link error for "${this.type}" ' + t.getProgramInfoLog(s));
            var o = this.getAttributeLocations(t, s),
                a = this.getUniformLocations(t, s) || {};
            return a.uStepW = t.getUniformLocation(s, "uStepW"), a.uStepH = t.getUniformLocation(s, "uStepH"), { program: s, attributeLocations: o, uniformLocations: a }
        },
        getAttributeLocations: function(t, e) { return { aPosition: t.getAttribLocation(e, "aPosition") } },
        getUniformLocations: function() { return {} },
        sendAttributeData: function(t, e, i) {
            var r = e.aPosition,
                n = t.createBuffer();
            t.bindBuffer(t.ARRAY_BUFFER, n), t.enableVertexAttribArray(r), t.vertexAttribPointer(r, 2, t.FLOAT, !1, 0, 0), t.bufferData(t.ARRAY_BUFFER, i, t.STATIC_DRAW)
        },
        _setupFrameBuffer: function(t) {
            var e, i, r = t.context;
            1 < t.passes ? (e = t.destinationWidth, i = t.destinationHeight, t.sourceWidth === e && t.sourceHeight === i || (r.deleteTexture(t.targetTexture), t.targetTexture = t.filterBackend.createTexture(r, e, i)), r.framebufferTexture2D(r.FRAMEBUFFER, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, t.targetTexture, 0)) : (r.bindFramebuffer(r.FRAMEBUFFER, null), r.finish())
        },
        _swapTextures: function(t) {
            t.passes--, t.pass++;
            var e = t.targetTexture;
            t.targetTexture = t.sourceTexture, t.sourceTexture = e
        },
        isNeutralState: function() {
            var t = this.mainParameter,
                e = fabric.Image.filters[this.type].prototype;
            if (t) {
                if (Array.isArray(e[t])) {
                    for (var i = e[t].length; i--;)
                        if (this[t][i] !== e[t][i]) return !1;
                    return !0
                }
                return e[t] === this[t]
            }
            return !1
        },
        applyTo: function(t) { t.webgl ? (this._setupFrameBuffer(t), this.applyToWebGL(t), this._swapTextures(t)) : this.applyTo2d(t) },
        retrieveShader: function(t) { return t.programCache.hasOwnProperty(this.type) || (t.programCache[this.type] = this.createProgram(t.context)), t.programCache[this.type] },
        applyToWebGL: function(t) {
            var e = t.context,
                i = this.retrieveShader(t);
            0 === t.pass && t.originalTexture ? e.bindTexture(e.TEXTURE_2D, t.originalTexture) : e.bindTexture(e.TEXTURE_2D, t.sourceTexture), e.useProgram(i.program), this.sendAttributeData(e, i.attributeLocations, t.aPosition), e.uniform1f(i.uniformLocations.uStepW, 1 / t.sourceWidth), e.uniform1f(i.uniformLocations.uStepH, 1 / t.sourceHeight), this.sendUniformData(e, i.uniformLocations), e.viewport(0, 0, t.destinationWidth, t.destinationHeight), e.drawArrays(e.TRIANGLE_STRIP, 0, 4)
        },
        bindAdditionalTexture: function(t, e, i) { t.activeTexture(i), t.bindTexture(t.TEXTURE_2D, e), t.activeTexture(t.TEXTURE0) },
        unbindAdditionalTexture: function(t, e) { t.activeTexture(e), t.bindTexture(t.TEXTURE_2D, null), t.activeTexture(t.TEXTURE0) },
        getMainParameter: function() { return this[this.mainParameter] },
        setMainParameter: function(t) { this[this.mainParameter] = t },
        sendUniformData: function() {},
        createHelpLayer: function(t) {
            if (!t.helpLayer) {
                var e = document.createElement("canvas");
                e.width = t.sourceWidth, e.height = t.sourceHeight, t.helpLayer = e
            }
        },
        toObject: function() {
            var t = { type: this.type },
                e = this.mainParameter;
            return e && (t[e] = this[e]), t
        },
        toJSON: function() { return this.toObject() }
    }), fabric.Image.filters.BaseFilter.fromObject = function(t, e) { var i = new fabric.Image.filters[t.type](t); return e && e(i), i },
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.ColorMatrix = r(i.BaseFilter, {
            type: "ColorMatrix",
            fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nuniform mat4 uColorMatrix;\nuniform vec4 uConstants;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor *= uColorMatrix;\ncolor += uConstants;\ngl_FragColor = color;\n}",
            matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            mainParameter: "matrix",
            colorsOnly: !0,
            initialize: function(t) { this.callSuper("initialize", t), this.matrix = this.matrix.slice(0) },
            applyTo2d: function(t) {
                var e, i, r, n, s, o = t.imageData.data,
                    a = o.length,
                    c = this.matrix,
                    h = this.colorsOnly;
                for (s = 0; s < a; s += 4) e = o[s], i = o[s + 1], r = o[s + 2], h ? (o[s] = e * c[0] + i * c[1] + r * c[2] + 255 * c[4], o[s + 1] = e * c[5] + i * c[6] + r * c[7] + 255 * c[9], o[s + 2] = e * c[10] + i * c[11] + r * c[12] + 255 * c[14]) : (n = o[s + 3], o[s] = e * c[0] + i * c[1] + r * c[2] + n * c[3] + 255 * c[4], o[s + 1] = e * c[5] + i * c[6] + r * c[7] + n * c[8] + 255 * c[9], o[s + 2] = e * c[10] + i * c[11] + r * c[12] + n * c[13] + 255 * c[14], o[s + 3] = e * c[15] + i * c[16] + r * c[17] + n * c[18] + 255 * c[19])
            },
            getUniformLocations: function(t, e) { return { uColorMatrix: t.getUniformLocation(e, "uColorMatrix"), uConstants: t.getUniformLocation(e, "uConstants") } },
            sendUniformData: function(t, e) {
                var i = this.matrix,
                    r = [i[0], i[1], i[2], i[3], i[5], i[6], i[7], i[8], i[10], i[11], i[12], i[13], i[15], i[16], i[17], i[18]],
                    n = [i[4], i[9], i[14], i[19]];
                t.uniformMatrix4fv(e.uColorMatrix, !1, r), t.uniform4fv(e.uConstants, n)
            }
        }), e.Image.filters.ColorMatrix.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Brightness = r(i.BaseFilter, {
            type: "Brightness",
            fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uBrightness;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += uBrightness;\ngl_FragColor = color;\n}",
            brightness: 0,
            mainParameter: "brightness",
            applyTo2d: function(t) {
                if (0 !== this.brightness) {
                    var e, i = t.imageData.data,
                        r = i.length,
                        n = Math.round(255 * this.brightness);
                    for (e = 0; e < r; e += 4) i[e] = i[e] + n, i[e + 1] = i[e + 1] + n, i[e + 2] = i[e + 2] + n
                }
            },
            getUniformLocations: function(t, e) { return { uBrightness: t.getUniformLocation(e, "uBrightness") } },
            sendUniformData: function(t, e) { t.uniform1f(e.uBrightness, this.brightness) }
        }), e.Image.filters.Brightness.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Convolute = n(r.BaseFilter, {
            type: "Convolute",
            opaque: !1,
            matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0],
            fragmentSource: { Convolute_3_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1), uStepH * (h - 1));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 3.0 + w)];\n}\n}\ngl_FragColor = color;\n}", Convolute_3_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1.0), uStepH * (h - 1.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 3.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}", Convolute_5_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 5.0 + w)];\n}\n}\ngl_FragColor = color;\n}", Convolute_5_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 5.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}", Convolute_7_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 7.0 + w)];\n}\n}\ngl_FragColor = color;\n}", Convolute_7_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 7.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}", Convolute_9_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 9.0 + w)];\n}\n}\ngl_FragColor = color;\n}", Convolute_9_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 9.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}" },
            retrieveShader: function(t) {
                var e = Math.sqrt(this.matrix.length),
                    i = this.type + "_" + e + "_" + (this.opaque ? 1 : 0),
                    r = this.fragmentSource[i];
                return t.programCache.hasOwnProperty(i) || (t.programCache[i] = this.createProgram(t.context, r)), t.programCache[i]
            },
            applyTo2d: function(t) {
                var e, i, r, n, s, o, a, c, h, l, u, f, d, g = t.imageData,
                    p = g.data,
                    v = this.matrix,
                    m = Math.round(Math.sqrt(v.length)),
                    b = Math.floor(m / 2),
                    _ = g.width,
                    y = g.height,
                    x = t.ctx.createImageData(_, y),
                    C = x.data,
                    S = this.opaque ? 1 : 0;
                for (u = 0; u < y; u++)
                    for (l = 0; l < _; l++) {
                        for (s = 4 * (u * _ + l), d = n = r = i = e = 0; d < m; d++)
                            for (f = 0; f < m; f++) o = l + f - b, (a = u + d - b) < 0 || y < a || o < 0 || _ < o || (c = 4 * (a * _ + o), h = v[d * m + f], e += p[c] * h, i += p[c + 1] * h, r += p[c + 2] * h, S || (n += p[c + 3] * h));
                        C[s] = e, C[s + 1] = i, C[s + 2] = r, C[s + 3] = S ? p[s + 3] : n
                    }
                t.imageData = x
            },
            getUniformLocations: function(t, e) { return { uMatrix: t.getUniformLocation(e, "uMatrix"), uOpaque: t.getUniformLocation(e, "uOpaque"), uHalfSize: t.getUniformLocation(e, "uHalfSize"), uSize: t.getUniformLocation(e, "uSize") } },
            sendUniformData: function(t, e) { t.uniform1fv(e.uMatrix, this.matrix) },
            toObject: function() { return i(this.callSuper("toObject"), { opaque: this.opaque, matrix: this.matrix }) }
        }), e.Image.filters.Convolute.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Grayscale = r(i.BaseFilter, {
            type: "Grayscale",
            fragmentSource: { average: "precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat average = (color.r + color.b + color.g) / 3.0;\ngl_FragColor = vec4(average, average, average, color.a);\n}", lightness: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = (max(max(col.r, col.g),col.b) + min(min(col.r, col.g),col.b)) / 2.0;\ngl_FragColor = vec4(average, average, average, col.a);\n}", luminosity: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = 0.21 * col.r + 0.72 * col.g + 0.07 * col.b;\ngl_FragColor = vec4(average, average, average, col.a);\n}" },
            mode: "average",
            mainParameter: "mode",
            applyTo2d: function(t) {
                var e, i, r = t.imageData.data,
                    n = r.length,
                    s = this.mode;
                for (e = 0; e < n; e += 4) "average" === s ? i = (r[e] + r[e + 1] + r[e + 2]) / 3 : "lightness" === s ? i = (Math.min(r[e], r[e + 1], r[e + 2]) + Math.max(r[e], r[e + 1], r[e + 2])) / 2 : "luminosity" === s && (i = .21 * r[e] + .72 * r[e + 1] + .07 * r[e + 2]), r[e] = i, r[e + 1] = i, r[e + 2] = i
            },
            retrieveShader: function(t) {
                var e = this.type + "_" + this.mode;
                if (!t.programCache.hasOwnProperty(e)) {
                    var i = this.fragmentSource[this.mode];
                    t.programCache[e] = this.createProgram(t.context, i)
                }
                return t.programCache[e]
            },
            getUniformLocations: function(t, e) { return { uMode: t.getUniformLocation(e, "uMode") } },
            sendUniformData: function(t, e) { t.uniform1i(e.uMode, 1) },
            isNeutralState: function() { return !1 }
        }), e.Image.filters.Grayscale.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Invert = r(i.BaseFilter, {
            type: "Invert",
            fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uInvert;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nif (uInvert == 1) {\ngl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);\n} else {\ngl_FragColor = color;\n}\n}",
            invert: !0,
            mainParameter: "invert",
            applyTo2d: function(t) {
                var e, i = t.imageData.data,
                    r = i.length;
                for (e = 0; e < r; e += 4) i[e] = 255 - i[e], i[e + 1] = 255 - i[e + 1], i[e + 2] = 255 - i[e + 2]
            },
            isNeutralState: function() { return !this.invert },
            getUniformLocations: function(t, e) { return { uInvert: t.getUniformLocation(e, "uInvert") } },
            sendUniformData: function(t, e) { t.uniform1i(e.uInvert, this.invert) }
        }), e.Image.filters.Invert.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.Image.filters,
            n = e.util.createClass;
        r.Noise = n(r.BaseFilter, {
            type: "Noise",
            fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uStepH;\nuniform float uNoise;\nuniform float uSeed;\nvarying vec2 vTexCoord;\nfloat rand(vec2 co, float seed, float vScale) {\nreturn fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);\n}\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;\ngl_FragColor = color;\n}",
            mainParameter: "noise",
            noise: 0,
            applyTo2d: function(t) {
                if (0 !== this.noise) {
                    var e, i, r = t.imageData.data,
                        n = r.length,
                        s = this.noise;
                    for (e = 0, n = r.length; e < n; e += 4) i = (.5 - Math.random()) * s, r[e] += i, r[e + 1] += i, r[e + 2] += i
                }
            },
            getUniformLocations: function(t, e) { return { uNoise: t.getUniformLocation(e, "uNoise"), uSeed: t.getUniformLocation(e, "uSeed") } },
            sendUniformData: function(t, e) { t.uniform1f(e.uNoise, this.noise / 255), t.uniform1f(e.uSeed, Math.random()) },
            toObject: function() { return i(this.callSuper("toObject"), { noise: this.noise }) }
        }), e.Image.filters.Noise.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Pixelate = r(i.BaseFilter, {
            type: "Pixelate",
            blocksize: 4,
            mainParameter: "blocksize",
            fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uBlocksize;\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nfloat blockW = uBlocksize * uStepW;\nfloat blockH = uBlocksize * uStepW;\nint posX = int(vTexCoord.x / blockW);\nint posY = int(vTexCoord.y / blockH);\nfloat fposX = float(posX);\nfloat fposY = float(posY);\nvec2 squareCoords = vec2(fposX * blockW, fposY * blockH);\nvec4 color = texture2D(uTexture, squareCoords);\ngl_FragColor = color;\n}",
            applyTo2d: function(t) {
                var e, i, r, n, s, o, a, c, h, l, u, f = t.imageData,
                    d = f.data,
                    g = f.height,
                    p = f.width;
                for (i = 0; i < g; i += this.blocksize)
                    for (r = 0; r < p; r += this.blocksize)
                        for (n = d[e = 4 * i * p + 4 * r], s = d[e + 1], o = d[e + 2], a = d[e + 3], l = Math.min(i + this.blocksize, g), u = Math.min(r + this.blocksize, p), c = i; c < l; c++)
                            for (h = r; h < u; h++) d[e = 4 * c * p + 4 * h] = n, d[e + 1] = s, d[e + 2] = o, d[e + 3] = a
            },
            isNeutralState: function() { return 1 === this.blocksize },
            getUniformLocations: function(t, e) { return { uBlocksize: t.getUniformLocation(e, "uBlocksize"), uStepW: t.getUniformLocation(e, "uStepW"), uStepH: t.getUniformLocation(e, "uStepH") } },
            sendUniformData: function(t, e) { t.uniform1f(e.uBlocksize, this.blocksize) }
        }), e.Image.filters.Pixelate.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var l = t.fabric || (t.fabric = {}),
            e = l.util.object.extend,
            i = l.Image.filters,
            r = l.util.createClass;
        i.RemoveColor = r(i.BaseFilter, {
            type: "RemoveColor",
            color: "#FFFFFF",
            fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uLow;\nuniform vec4 uHigh;\nvarying vec2 vTexCoord;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\nif(all(greaterThan(gl_FragColor.rgb,uLow.rgb)) && all(greaterThan(uHigh.rgb,gl_FragColor.rgb))) {\ngl_FragColor.a = 0.0;\n}\n}",
            distance: .02,
            useAlpha: !1,
            applyTo2d: function(t) {
                var e, i, r, n, s = t.imageData.data,
                    o = 255 * this.distance,
                    a = new l.Color(this.color).getSource(),
                    c = [a[0] - o, a[1] - o, a[2] - o],
                    h = [a[0] + o, a[1] + o, a[2] + o];
                for (e = 0; e < s.length; e += 4) i = s[e], r = s[e + 1], n = s[e + 2], c[0] < i && c[1] < r && c[2] < n && i < h[0] && r < h[1] && n < h[2] && (s[e + 3] = 0)
            },
            getUniformLocations: function(t, e) { return { uLow: t.getUniformLocation(e, "uLow"), uHigh: t.getUniformLocation(e, "uHigh") } },
            sendUniformData: function(t, e) {
                var i = new l.Color(this.color).getSource(),
                    r = parseFloat(this.distance),
                    n = [0 + i[0] / 255 - r, 0 + i[1] / 255 - r, 0 + i[2] / 255 - r, 1],
                    s = [i[0] / 255 + r, i[1] / 255 + r, i[2] / 255 + r, 1];
                t.uniform4fv(e.uLow, n), t.uniform4fv(e.uHigh, s)
            },
            toObject: function() { return e(this.callSuper("toObject"), { color: this.color, distance: this.distance }) }
        }), l.Image.filters.RemoveColor.fromObject = l.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass,
            n = { Brownie: [.5997, .34553, -.27082, 0, .186, -.0377, .86095, .15059, 0, -.1449, .24113, -.07441, .44972, 0, -.02965, 0, 0, 0, 1, 0], Vintage: [.62793, .32021, -.03965, 0, .03784, .02578, .64411, .03259, 0, .02926, .0466, -.08512, .52416, 0, .02023, 0, 0, 0, 1, 0], Kodachrome: [1.12855, -.39673, -.03992, 0, .24991, -.16404, 1.08352, -.05498, 0, .09698, -.16786, -.56034, 1.60148, 0, .13972, 0, 0, 0, 1, 0], Technicolor: [1.91252, -.85453, -.09155, 0, .04624, -.30878, 1.76589, -.10601, 0, -.27589, -.2311, -.75018, 1.84759, 0, .12137, 0, 0, 0, 1, 0], Polaroid: [1.438, -.062, -.062, 0, 0, -.122, 1.378, -.122, 0, 0, -.016, -.016, 1.483, 0, 0, 0, 0, 0, 1, 0], Sepia: [.393, .769, .189, 0, 0, .349, .686, .168, 0, 0, .272, .534, .131, 0, 0, 0, 0, 0, 1, 0], BlackWhite: [1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 0, 0, 0, 1, 0] };
        for (var s in n) i[s] = r(i.ColorMatrix, { type: s, matrix: n[s], mainParameter: !1, colorsOnly: !0 }), e.Image.filters[s].fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var f = t.fabric,
            e = f.Image.filters,
            i = f.util.createClass;
        e.BlendColor = i(e.BaseFilter, {
            type: "BlendColor",
            color: "#F95C63",
            mode: "multiply",
            alpha: 1,
            fragmentSource: { multiply: "gl_FragColor.rgb *= uColor.rgb;\n", screen: "gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n", add: "gl_FragColor.rgb += uColor.rgb;\n", diff: "gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n", subtract: "gl_FragColor.rgb -= uColor.rgb;\n", lighten: "gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n", darken: "gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n", exclusion: "gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n", overlay: "if (uColor.r < 0.5) {\ngl_FragColor.r *= 2.0 * uColor.r;\n} else {\ngl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);\n}\nif (uColor.g < 0.5) {\ngl_FragColor.g *= 2.0 * uColor.g;\n} else {\ngl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);\n}\nif (uColor.b < 0.5) {\ngl_FragColor.b *= 2.0 * uColor.b;\n} else {\ngl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);\n}\n", tint: "gl_FragColor.rgb *= (1.0 - uColor.a);\ngl_FragColor.rgb += uColor.rgb;\n" },
            buildSource: function(t) { return "precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ngl_FragColor = color;\nif (color.a > 0.0) {\n" + this.fragmentSource[t] + "}\n}" },
            retrieveShader: function(t) { var e, i = this.type + "_" + this.mode; return t.programCache.hasOwnProperty(i) || (e = this.buildSource(this.mode), t.programCache[i] = this.createProgram(t.context, e)), t.programCache[i] },
            applyTo2d: function(t) {
                var e, i, r, n, s, o, a, c = t.imageData.data,
                    h = c.length,
                    l = 1 - this.alpha;
                e = (a = new f.Color(this.color).getSource())[0] * this.alpha, i = a[1] * this.alpha, r = a[2] * this.alpha;
                for (var u = 0; u < h; u += 4) switch (n = c[u], s = c[u + 1], o = c[u + 2], this.mode) {
                    case "multiply":
                        c[u] = n * e / 255, c[u + 1] = s * i / 255, c[u + 2] = o * r / 255;
                        break;
                    case "screen":
                        c[u] = 255 - (255 - n) * (255 - e) / 255, c[u + 1] = 255 - (255 - s) * (255 - i) / 255, c[u + 2] = 255 - (255 - o) * (255 - r) / 255;
                        break;
                    case "add":
                        c[u] = n + e, c[u + 1] = s + i, c[u + 2] = o + r;
                        break;
                    case "diff":
                    case "difference":
                        c[u] = Math.abs(n - e), c[u + 1] = Math.abs(s - i), c[u + 2] = Math.abs(o - r);
                        break;
                    case "subtract":
                        c[u] = n - e, c[u + 1] = s - i, c[u + 2] = o - r;
                        break;
                    case "darken":
                        c[u] = Math.min(n, e), c[u + 1] = Math.min(s, i), c[u + 2] = Math.min(o, r);
                        break;
                    case "lighten":
                        c[u] = Math.max(n, e), c[u + 1] = Math.max(s, i), c[u + 2] = Math.max(o, r);
                        break;
                    case "overlay":
                        c[u] = e < 128 ? 2 * n * e / 255 : 255 - 2 * (255 - n) * (255 - e) / 255, c[u + 1] = i < 128 ? 2 * s * i / 255 : 255 - 2 * (255 - s) * (255 - i) / 255, c[u + 2] = r < 128 ? 2 * o * r / 255 : 255 - 2 * (255 - o) * (255 - r) / 255;
                        break;
                    case "exclusion":
                        c[u] = e + n - 2 * e * n / 255, c[u + 1] = i + s - 2 * i * s / 255, c[u + 2] = r + o - 2 * r * o / 255;
                        break;
                    case "tint":
                        c[u] = e + n * l, c[u + 1] = i + s * l, c[u + 2] = r + o * l
                }
            },
            getUniformLocations: function(t, e) { return { uColor: t.getUniformLocation(e, "uColor") } },
            sendUniformData: function(t, e) {
                var i = new f.Color(this.color).getSource();
                i[0] = this.alpha * i[0] / 255, i[1] = this.alpha * i[1] / 255, i[2] = this.alpha * i[2] / 255, i[3] = this.alpha, t.uniform4fv(e.uColor, i)
            },
            toObject: function() { return { type: this.type, color: this.color, mode: this.mode, alpha: this.alpha } }
        }), f.Image.filters.BlendColor.fromObject = f.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var y = t.fabric,
            e = y.Image.filters,
            i = y.util.createClass;
        e.BlendImage = i(e.BaseFilter, {
            type: "BlendImage",
            image: null,
            mode: "multiply",
            alpha: 1,
            vertexSource: "attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nuniform mat3 uTransformMatrix;\nvoid main() {\nvTexCoord = aPosition;\nvTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}",
            fragmentSource: { multiply: "precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.rgba *= color2.rgba;\ngl_FragColor = color;\n}", mask: "precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.a = color2.a;\ngl_FragColor = color;\n}" },
            retrieveShader: function(t) {
                var e = this.type + "_" + this.mode,
                    i = this.fragmentSource[this.mode];
                return t.programCache.hasOwnProperty(e) || (t.programCache[e] = this.createProgram(t.context, i)), t.programCache[e]
            },
            applyToWebGL: function(t) {
                var e = t.context,
                    i = this.createTexture(t.filterBackend, this.image);
                this.bindAdditionalTexture(e, i, e.TEXTURE1), this.callSuper("applyToWebGL", t), this.unbindAdditionalTexture(e, e.TEXTURE1)
            },
            createTexture: function(t, e) { return t.getCachedTexture(e.cacheKey, e._element) },
            calculateMatrix: function() {
                var t = this.image,
                    e = t._element.width,
                    i = t._element.height;
                return [1 / t.scaleX, 0, 0, 0, 1 / t.scaleY, 0, -t.left / e, -t.top / i, 1]
            },
            applyTo2d: function(t) {
                var e, i, r, n, s, o, a, c, h, l, u, f = t.imageData,
                    d = t.filterBackend.resources,
                    g = f.data,
                    p = g.length,
                    v = f.width,
                    m = f.height,
                    b = this.image;
                d.blendImage || (d.blendImage = y.util.createCanvasElement()), l = (h = d.blendImage).getContext("2d"), h.width !== v || h.height !== m ? (h.width = v, h.height = m) : l.clearRect(0, 0, v, m), l.setTransform(b.scaleX, 0, 0, b.scaleY, b.left, b.top), l.drawImage(b._element, 0, 0, v, m), u = l.getImageData(0, 0, v, m).data;
                for (var _ = 0; _ < p; _ += 4) switch (s = g[_], o = g[_ + 1], a = g[_ + 2], c = g[_ + 3], e = u[_], i = u[_ + 1], r = u[_ + 2], n = u[_ + 3], this.mode) {
                    case "multiply":
                        g[_] = s * e / 255, g[_ + 1] = o * i / 255, g[_ + 2] = a * r / 255, g[_ + 3] = c * n / 255;
                        break;
                    case "mask":
                        g[_ + 3] = n
                }
            },
            getUniformLocations: function(t, e) { return { uTransformMatrix: t.getUniformLocation(e, "uTransformMatrix"), uImage: t.getUniformLocation(e, "uImage") } },
            sendUniformData: function(t, e) {
                var i = this.calculateMatrix();
                t.uniform1i(e.uImage, 1), t.uniformMatrix3fv(e.uTransformMatrix, !1, i)
            },
            toObject: function() { return { type: this.type, image: this.image && this.image.toObject(), mode: this.mode, alpha: this.alpha } }
        }), y.Image.filters.BlendImage.fromObject = function(i, r) {
            y.Image.fromObject(i.image, function(t) {
                var e = y.util.object.clone(i);
                e.image = t, r(new y.Image.filters.BlendImage(e))
            })
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var m = t.fabric || (t.fabric = {}),
            j = Math.pow,
            A = Math.floor,
            M = Math.sqrt,
            F = Math.abs,
            h = Math.round,
            r = Math.sin,
            I = Math.ceil,
            e = m.Image.filters,
            i = m.util.createClass;
        e.Resize = i(e.BaseFilter, {
            type: "Resize",
            resizeType: "hermite",
            scaleX: 1,
            scaleY: 1,
            lanczosLobes: 3,
            getUniformLocations: function(t, e) { return { uDelta: t.getUniformLocation(e, "uDelta"), uTaps: t.getUniformLocation(e, "uTaps") } },
            sendUniformData: function(t, e) { t.uniform2fv(e.uDelta, this.horizontal ? [1 / this.width, 0] : [0, 1 / this.height]), t.uniform1fv(e.uTaps, this.taps) },
            retrieveShader: function(t) {
                var e = this.getFilterWindow(),
                    i = this.type + "_" + e;
                if (!t.programCache.hasOwnProperty(i)) {
                    var r = this.generateShader(e);
                    t.programCache[i] = this.createProgram(t.context, r)
                }
                return t.programCache[i]
            },
            getFilterWindow: function() { var t = this.tempScale; return Math.ceil(this.lanczosLobes / t) },
            getTaps: function() { for (var t = this.lanczosCreate(this.lanczosLobes), e = this.tempScale, i = this.getFilterWindow(), r = new Array(i), n = 1; n <= i; n++) r[n - 1] = t(n * e); return r },
            generateShader: function(t) { for (var e = new Array(t), i = this.fragmentSourceTOP, r = 1; r <= t; r++) e[r - 1] = r + ".0 * uDelta"; return i += "uniform float uTaps[" + t + "];\n", i += "void main() {\n", i += " vec4 color = texture2D(uTexture, vTexCoord);\n", i += " float sum = 1.0;\n", e.forEach(function(t, e) { i += " color += texture2D(uTexture, vTexCoord + " + t + ") * uTaps[" + e + "];\n", i += " color += texture2D(uTexture, vTexCoord - " + t + ") * uTaps[" + e + "];\n", i += " sum += 2.0 * uTaps[" + e + "];\n" }), i += " gl_FragColor = color / sum;\n", i += "}" },
            fragmentSourceTOP: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\n",
            applyTo: function(t) { t.webgl ? (t.passes++, this.width = t.sourceWidth, this.horizontal = !0, this.dW = Math.round(this.width * this.scaleX), this.dH = t.sourceHeight, this.tempScale = this.dW / this.width, this.taps = this.getTaps(), t.destinationWidth = this.dW, this._setupFrameBuffer(t), this.applyToWebGL(t), this._swapTextures(t), t.sourceWidth = t.destinationWidth, this.height = t.sourceHeight, this.horizontal = !1, this.dH = Math.round(this.height * this.scaleY), this.tempScale = this.dH / this.height, this.taps = this.getTaps(), t.destinationHeight = this.dH, this._setupFrameBuffer(t), this.applyToWebGL(t), this._swapTextures(t), t.sourceHeight = t.destinationHeight) : this.applyTo2d(t) },
            isNeutralState: function() { return 1 === this.scaleX && 1 === this.scaleY },
            lanczosCreate: function(i) { return function(t) { if (i <= t || t <= -i) return 0; if (t < 1.1920929e-7 && -1.1920929e-7 < t) return 1; var e = (t *= Math.PI) / i; return r(t) / t * r(e) / e } },
            applyTo2d: function(t) {
                var e = t.imageData,
                    i = this.scaleX,
                    r = this.scaleY;
                this.rcpScaleX = 1 / i, this.rcpScaleY = 1 / r;
                var n, s = e.width,
                    o = e.height,
                    a = h(s * i),
                    c = h(o * r);
                "sliceHack" === this.resizeType ? n = this.sliceByTwo(t, s, o, a, c) : "hermite" === this.resizeType ? n = this.hermiteFastResize(t, s, o, a, c) : "bilinear" === this.resizeType ? n = this.bilinearFiltering(t, s, o, a, c) : "lanczos" === this.resizeType && (n = this.lanczosResize(t, s, o, a, c)), t.imageData = n
            },
            sliceByTwo: function(t, e, i, r, n) {
                var s, o, a = t.imageData,
                    c = !1,
                    h = !1,
                    l = .5 * e,
                    u = .5 * i,
                    f = m.filterBackend.resources,
                    d = 0,
                    g = 0,
                    p = e,
                    v = 0;
                for (f.sliceByTwo || (f.sliceByTwo = document.createElement("canvas")), ((s = f.sliceByTwo).width < 1.5 * e || s.height < i) && (s.width = 1.5 * e, s.height = i), (o = s.getContext("2d")).clearRect(0, 0, 1.5 * e, i), o.putImageData(a, 0, 0), r = A(r), n = A(n); !c || !h;) i = u, r < A(.5 * (e = l)) ? l = A(.5 * l) : (l = r, c = !0), n < A(.5 * u) ? u = A(.5 * u) : (u = n, h = !0), o.drawImage(s, d, g, e, i, p, v, l, u), d = p, g = v, v += u;
                return o.getImageData(d, g, r, n)
            },
            lanczosResize: function(t, g, p, v, m) {
                var b = t.imageData.data,
                    _ = t.ctx.createImageData(v, m),
                    y = _.data,
                    x = this.lanczosCreate(this.lanczosLobes),
                    C = this.rcpScaleX,
                    S = this.rcpScaleY,
                    T = 2 / this.rcpScaleX,
                    w = 2 / this.rcpScaleY,
                    O = I(C * this.lanczosLobes / 2),
                    k = I(S * this.lanczosLobes / 2),
                    D = {},
                    E = {},
                    P = {};
                return function t(e) {
                    var i, r, n, s, o, a, c, h, l, u, f;
                    for (E.x = (e + .5) * C, P.x = A(E.x), i = 0; i < m; i++) {
                        for (E.y = (i + .5) * S, P.y = A(E.y), l = h = c = a = o = 0, r = P.x - O; r <= P.x + O; r++)
                            if (!(r < 0 || g <= r)) { u = A(1e3 * F(r - E.x)), D[u] || (D[u] = {}); for (var d = P.y - k; d <= P.y + k; d++) d < 0 || p <= d || (f = A(1e3 * F(d - E.y)), D[u][f] || (D[u][f] = x(M(j(u * T, 2) + j(f * w, 2)) / 1e3)), 0 < (n = D[u][f]) && (o += n, a += n * b[s = 4 * (d * g + r)], c += n * b[s + 1], h += n * b[s + 2], l += n * b[s + 3])) }
                        y[s = 4 * (i * v + e)] = a / o, y[s + 1] = c / o, y[s + 2] = h / o, y[s + 3] = l / o
                    }
                    return ++e < v ? t(e) : _
                }(0)
            },
            bilinearFiltering: function(t, e, i, r, n) {
                var s, o, a, c, h, l, u, f, d, g = 0,
                    p = this.rcpScaleX,
                    v = this.rcpScaleY,
                    m = 4 * (e - 1),
                    b = t.imageData.data,
                    _ = t.ctx.createImageData(r, n),
                    y = _.data;
                for (a = 0; a < n; a++)
                    for (c = 0; c < r; c++)
                        for (h = p * c - (s = A(p * c)), l = v * a - (o = A(v * a)), d = 4 * (o * e + s), u = 0; u < 4; u++) f = b[d + u] * (1 - h) * (1 - l) + b[d + 4 + u] * h * (1 - l) + b[d + m + u] * l * (1 - h) + b[d + m + 4 + u] * h * l, y[g++] = f;
                return _
            },
            hermiteFastResize: function(t, e, i, r, n) {
                for (var s = this.rcpScaleX, o = this.rcpScaleY, a = I(s / 2), c = I(o / 2), h = t.imageData.data, l = t.ctx.createImageData(r, n), u = l.data, f = 0; f < n; f++)
                    for (var d = 0; d < r; d++) {
                        for (var g = 4 * (d + f * r), p = 0, v = 0, m = 0, b = 0, _ = 0, y = 0, x = 0, C = (f + .5) * o, S = A(f * o); S < (f + 1) * o; S++)
                            for (var T = F(C - (S + .5)) / c, w = (d + .5) * s, O = T * T, k = A(d * s); k < (d + 1) * s; k++) {
                                var D = F(w - (k + .5)) / a,
                                    E = M(O + D * D);
                                1 < E && E < -1 || 0 < (p = 2 * E * E * E - 3 * E * E + 1) && (x += p * h[(D = 4 * (k + S * e)) + 3], m += p, h[D + 3] < 255 && (p = p * h[D + 3] / 250), b += p * h[D], _ += p * h[D + 1], y += p * h[D + 2], v += p)
                            }
                        u[g] = b / v, u[g + 1] = _ / v, u[g + 2] = y / v, u[g + 3] = x / m
                    }
                return l
            },
            toObject: function() { return { type: this.type, scaleX: this.scaleX, scaleY: this.scaleY, resizeType: this.resizeType, lanczosLobes: this.lanczosLobes } }
        }), m.Image.filters.Resize.fromObject = m.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Contrast = r(i.BaseFilter, {
            type: "Contrast",
            fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uContrast;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat contrastF = 1.015 * (uContrast + 1.0) / (1.0 * (1.015 - uContrast));\ncolor.rgb = contrastF * (color.rgb - 0.5) + 0.5;\ngl_FragColor = color;\n}",
            contrast: 0,
            mainParameter: "contrast",
            applyTo2d: function(t) {
                if (0 !== this.contrast) {
                    var e, i = t.imageData.data,
                        r = i.length,
                        n = Math.floor(255 * this.contrast),
                        s = 259 * (n + 255) / (255 * (259 - n));
                    for (e = 0; e < r; e += 4) i[e] = s * (i[e] - 128) + 128, i[e + 1] = s * (i[e + 1] - 128) + 128, i[e + 2] = s * (i[e + 2] - 128) + 128
                }
            },
            getUniformLocations: function(t, e) { return { uContrast: t.getUniformLocation(e, "uContrast") } },
            sendUniformData: function(t, e) { t.uniform1f(e.uContrast, this.contrast) }
        }), e.Image.filters.Contrast.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Saturation = r(i.BaseFilter, {
            type: "Saturation",
            fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uSaturation;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat rgMax = max(color.r, color.g);\nfloat rgbMax = max(rgMax, color.b);\ncolor.r += rgbMax != color.r ? (rgbMax - color.r) * uSaturation : 0.00;\ncolor.g += rgbMax != color.g ? (rgbMax - color.g) * uSaturation : 0.00;\ncolor.b += rgbMax != color.b ? (rgbMax - color.b) * uSaturation : 0.00;\ngl_FragColor = color;\n}",
            saturation: 0,
            mainParameter: "saturation",
            applyTo2d: function(t) {
                if (0 !== this.saturation) {
                    var e, i, r = t.imageData.data,
                        n = r.length,
                        s = -this.saturation;
                    for (e = 0; e < n; e += 4) i = Math.max(r[e], r[e + 1], r[e + 2]), r[e] += i !== r[e] ? (i - r[e]) * s : 0, r[e + 1] += i !== r[e + 1] ? (i - r[e + 1]) * s : 0, r[e + 2] += i !== r[e + 2] ? (i - r[e + 2]) * s : 0
                }
            },
            getUniformLocations: function(t, e) { return { uSaturation: t.getUniformLocation(e, "uSaturation") } },
            sendUniformData: function(t, e) { t.uniform1f(e.uSaturation, -this.saturation) }
        }), e.Image.filters.Saturation.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var g = t.fabric || (t.fabric = {}),
            e = g.Image.filters,
            i = g.util.createClass;
        e.Blur = i(e.BaseFilter, {
            type: "Blur",
            fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\nconst float nSamples = 15.0;\nvec3 v3offset = vec3(12.9898, 78.233, 151.7182);\nfloat random(vec3 scale) {\nreturn fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);\n}\nvoid main() {\nvec4 color = vec4(0.0);\nfloat total = 0.0;\nfloat offset = random(v3offset);\nfor (float t = -nSamples; t <= nSamples; t++) {\nfloat percent = (t + offset - 0.5) / nSamples;\nfloat weight = 1.0 - abs(percent);\ncolor += texture2D(uTexture, vTexCoord + uDelta * percent) * weight;\ntotal += weight;\n}\ngl_FragColor = color / total;\n}",
            blur: 0,
            mainParameter: "blur",
            applyTo: function(t) { t.webgl ? (this.aspectRatio = t.sourceWidth / t.sourceHeight, t.passes++, this._setupFrameBuffer(t), this.horizontal = !0, this.applyToWebGL(t), this._swapTextures(t), this._setupFrameBuffer(t), this.horizontal = !1, this.applyToWebGL(t), this._swapTextures(t)) : this.applyTo2d(t) },
            applyTo2d: function(t) { t.imageData = this.simpleBlur(t) },
            simpleBlur: function(t) {
                var e, i, r = t.filterBackend.resources,
                    n = t.imageData.width,
                    s = t.imageData.height;
                r.blurLayer1 || (r.blurLayer1 = g.util.createCanvasElement(), r.blurLayer2 = g.util.createCanvasElement()), e = r.blurLayer1, i = r.blurLayer2, e.width === n && e.height === s || (i.width = e.width = n, i.height = e.height = s);
                var o, a, c, h, l = e.getContext("2d"),
                    u = i.getContext("2d"),
                    f = .06 * this.blur * .5;
                for (l.putImageData(t.imageData, 0, 0), u.clearRect(0, 0, n, s), h = -15; h <= 15; h++) c = f * (a = h / 15) * n + (o = (Math.random() - .5) / 4), u.globalAlpha = 1 - Math.abs(a), u.drawImage(e, c, o), l.drawImage(i, 0, 0), u.globalAlpha = 1, u.clearRect(0, 0, i.width, i.height);
                for (h = -15; h <= 15; h++) c = f * (a = h / 15) * s + (o = (Math.random() - .5) / 4), u.globalAlpha = 1 - Math.abs(a), u.drawImage(e, o, c), l.drawImage(i, 0, 0), u.globalAlpha = 1, u.clearRect(0, 0, i.width, i.height);
                t.ctx.drawImage(e, 0, 0);
                var d = t.ctx.getImageData(0, 0, e.width, e.height);
                return l.globalAlpha = 1, l.clearRect(0, 0, e.width, e.height), d
            },
            getUniformLocations: function(t, e) { return { delta: t.getUniformLocation(e, "uDelta") } },
            sendUniformData: function(t, e) {
                var i = this.chooseRightDelta();
                t.uniform2fv(e.delta, i)
            },
            chooseRightDelta: function() {
                var t, e = 1,
                    i = [0, 0];
                return this.horizontal ? 1 < this.aspectRatio && (e = 1 / this.aspectRatio) : this.aspectRatio < 1 && (e = this.aspectRatio), t = e * this.blur * .12, this.horizontal ? i[0] = t : i[1] = t, i
            }
        }), e.Blur.fromObject = g.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.Image.filters,
            r = e.util.createClass;
        i.Gamma = r(i.BaseFilter, {
            type: "Gamma",
            fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec3 uGamma;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec3 correction = (1.0 / uGamma);\ncolor.r = pow(color.r, correction.r);\ncolor.g = pow(color.g, correction.g);\ncolor.b = pow(color.b, correction.b);\ngl_FragColor = color;\ngl_FragColor.rgb *= color.a;\n}",
            gamma: [1, 1, 1],
            mainParameter: "gamma",
            initialize: function(t) { this.gamma = [1, 1, 1], i.BaseFilter.prototype.initialize.call(this, t) },
            applyTo2d: function(t) {
                var e, i = t.imageData.data,
                    r = this.gamma,
                    n = i.length,
                    s = 1 / r[0],
                    o = 1 / r[1],
                    a = 1 / r[2];
                for (this.rVals || (this.rVals = new Uint8Array(256), this.gVals = new Uint8Array(256), this.bVals = new Uint8Array(256)), e = 0, n = 256; e < n; e++) this.rVals[e] = 255 * Math.pow(e / 255, s), this.gVals[e] = 255 * Math.pow(e / 255, o), this.bVals[e] = 255 * Math.pow(e / 255, a);
                for (e = 0, n = i.length; e < n; e += 4) i[e] = this.rVals[i[e]], i[e + 1] = this.gVals[i[e + 1]], i[e + 2] = this.bVals[i[e + 2]]
            },
            getUniformLocations: function(t, e) { return { uGamma: t.getUniformLocation(e, "uGamma") } },
            sendUniformData: function(t, e) { t.uniform3fv(e.uGamma, this.gamma) }
        }), e.Image.filters.Gamma.fromObject = e.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var n = t.fabric || (t.fabric = {}),
            e = n.Image.filters,
            i = n.util.createClass;
        e.Composed = i(e.BaseFilter, { type: "Composed", subFilters: [], initialize: function(t) { this.callSuper("initialize", t), this.subFilters = this.subFilters.slice(0) }, applyTo: function(e) { e.passes += this.subFilters.length - 1, this.subFilters.forEach(function(t) { t.applyTo(e) }) }, toObject: function() { return n.util.object.extend(this.callSuper("toObject"), { subFilters: this.subFilters.map(function(t) { return t.toObject() }) }) }, isNeutralState: function() { return !this.subFilters.some(function(t) { return !t.isNeutralState() }) } }), n.Image.filters.Composed.fromObject = function(t, e) {
            var i = (t.subFilters || []).map(function(t) { return new n.Image.filters[t.type](t) }),
                r = new n.Image.filters.Composed({ subFilters: i });
            return e && e(r), r
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var s = t.fabric || (t.fabric = {}),
            e = s.Image.filters,
            i = s.util.createClass;
        e.HueRotation = i(e.ColorMatrix, {
            type: "HueRotation",
            rotation: 0,
            mainParameter: "rotation",
            calculateMatrix: function() {
                var t = this.rotation * Math.PI,
                    e = s.util.cos(t),
                    i = s.util.sin(t),
                    r = Math.sqrt(1 / 3) * i,
                    n = 1 - e;
                this.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0], this.matrix[0] = e + n / 3, this.matrix[1] = 1 / 3 * n - r, this.matrix[2] = 1 / 3 * n + r, this.matrix[5] = 1 / 3 * n + r, this.matrix[6] = e + 1 / 3 * n, this.matrix[7] = 1 / 3 * n - r, this.matrix[10] = 1 / 3 * n - r, this.matrix[11] = 1 / 3 * n + r, this.matrix[12] = e + 1 / 3 * n
            },
            isNeutralState: function(t) { return this.calculateMatrix(), e.BaseFilter.prototype.isNeutralState.call(this, t) },
            applyTo: function(t) { this.calculateMatrix(), e.BaseFilter.prototype.applyTo.call(this, t) }
        }), s.Image.filters.HueRotation.fromObject = s.Image.filters.BaseFilter.fromObject
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var d = t.fabric || (t.fabric = {}),
            g = d.util.object.clone;
        d.Text ? d.warn("fabric.Text is already defined") : (d.Text = d.util.createClass(d.Object, {
            _dimensionAffectingProps: ["fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "text", "charSpacing", "textAlign", "styles"],
            _reNewline: /\r?\n/,
            _reSpacesAndTabs: /[ \t\r]/g,
            _reSpaceAndTab: /[ \t\r]/,
            _reWords: /\S+/g,
            type: "text",
            fontSize: 40,
            fontWeight: "normal",
            fontFamily: "Times New Roman",
            underline: !1,
            overline: !1,
            linethrough: !1,
            textAlign: "left",
            fontStyle: "normal",
            lineHeight: 1.16,
            superscript: { size: .6, baseline: -.35 },
            subscript: { size: .6, baseline: .11 },
            textBackgroundColor: "",
            stateProperties: d.Object.prototype.stateProperties.concat("fontFamily", "fontWeight", "fontSize", "text", "underline", "overline", "linethrough", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "charSpacing", "styles"),
            cacheProperties: d.Object.prototype.cacheProperties.concat("fontFamily", "fontWeight", "fontSize", "text", "underline", "overline", "linethrough", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "charSpacing", "styles"),
            stroke: null,
            shadow: null,
            _fontSizeFraction: .222,
            offsets: { underline: .1, linethrough: -.315, overline: -.88 },
            _fontSizeMult: 1.13,
            charSpacing: 0,
            styles: null,
            _measuringContext: null,
            deltaY: 0,
            _styleProperties: ["stroke", "strokeWidth", "fill", "fontFamily", "fontSize", "fontWeight", "fontStyle", "underline", "overline", "linethrough", "deltaY", "textBackgroundColor"],
            __charBounds: [],
            CACHE_FONT_SIZE: 400,
            MIN_TEXT_WIDTH: 2,
            initialize: function(t, e) { this.styles = e && e.styles || {}, this.text = t, this.__skipDimension = !0, this.callSuper("initialize", e), this.__skipDimension = !1, this.initDimensions(), this.setCoords(), this.setupState({ propertySet: "_dimensionAffectingProps" }) },
            getMeasuringContext: function() { return d._measuringContext || (d._measuringContext = this.canvas && this.canvas.contextCache || d.util.createCanvasElement().getContext("2d")), d._measuringContext },
            _splitText: function() { var t = this._splitTextIntoLines(this.text); return this.textLines = t.lines, this._textLines = t.graphemeLines, this._unwrappedTextLines = t._unwrappedLines, this._text = t.graphemeText, t },
            initDimensions: function() { this.__skipDimension || (this._splitText(), this._clearCache(), this.width = this.calcTextWidth() || this.cursorWidth || this.MIN_TEXT_WIDTH, -1 !== this.textAlign.indexOf("justify") && this.enlargeSpaces(), this.height = this.calcTextHeight(), this.saveState({ propertySet: "_dimensionAffectingProps" })) },
            enlargeSpaces: function() {
                for (var t, e, i, r, n, s, o, a = 0, c = this._textLines.length; a < c; a++)
                    if (("justify" === this.textAlign || a !== c - 1 && !this.isEndOfWrapping(a)) && (r = 0, n = this._textLines[a], (e = this.getLineWidth(a)) < this.width && (o = this.textLines[a].match(this._reSpacesAndTabs)))) { i = o.length, t = (this.width - e) / i; for (var h = 0, l = n.length; h <= l; h++) s = this.__charBounds[a][h], this._reSpaceAndTab.test(n[h]) ? (s.width += t, s.kernedWidth += t, s.left += r, r += t) : s.left += r }
            },
            isEndOfWrapping: function(t) { return t === this._textLines.length - 1 },
            toString: function() { return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>' },
            _getCacheCanvasDimensions: function() {
                var t = this.callSuper("_getCacheCanvasDimensions"),
                    e = this.fontSize;
                return t.width += e * t.zoomX, t.height += e * t.zoomY, t
            },
            _render: function(t) { this._setTextStyles(t), this._renderTextLinesBackground(t), this._renderTextDecoration(t, "underline"), this._renderText(t), this._renderTextDecoration(t, "overline"), this._renderTextDecoration(t, "linethrough") },
            _renderText: function(t) { "stroke" === this.paintFirst ? (this._renderTextStroke(t), this._renderTextFill(t)) : (this._renderTextFill(t), this._renderTextStroke(t)) },
            _setTextStyles: function(t, e, i) { t.textBaseline = "alphabetic", t.font = this._getFontDeclaration(e, i) },
            calcTextWidth: function() {
                for (var t = this.getLineWidth(0), e = 1, i = this._textLines.length; e < i; e++) {
                    var r = this.getLineWidth(e);
                    t < r && (t = r)
                }
                return t
            },
            _renderTextLine: function(t, e, i, r, n, s) { this._renderChars(t, e, i, r, n, s) },
            _renderTextLinesBackground: function(t) {
                if (this.textBackgroundColor || this.styleHas("textBackgroundColor")) {
                    for (var e, i, r, n, s, o, a = 0, c = t.fillStyle, h = this._getLeftOffset(), l = this._getTopOffset(), u = 0, f = 0, d = 0, g = this._textLines.length; d < g; d++)
                        if (e = this.getHeightOfLine(d), this.textBackgroundColor || this.styleHas("textBackgroundColor", d)) {
                            r = this._textLines[d], i = this._getLineLeftOffset(d), u = f = 0, n = this.getValueOfPropertyAt(d, 0, "textBackgroundColor");
                            for (var p = 0, v = r.length; p < v; p++) s = this.__charBounds[d][p], (o = this.getValueOfPropertyAt(d, p, "textBackgroundColor")) !== n ? ((t.fillStyle = n) && t.fillRect(h + i + u, l + a, f, e / this.lineHeight), u = s.left, f = s.width, n = o) : f += s.kernedWidth;
                            o && (t.fillStyle = o, t.fillRect(h + i + u, l + a, f, e / this.lineHeight)), a += e
                        } else a += e;
                    t.fillStyle = c, this._removeShadow(t)
                }
            },
            getFontCache: function(t) {
                var e = t.fontFamily.toLowerCase();
                d.charWidthsCache[e] || (d.charWidthsCache[e] = {});
                var i = d.charWidthsCache[e],
                    r = t.fontStyle.toLowerCase() + "_" + (t.fontWeight + "").toLowerCase();
                return i[r] || (i[r] = {}), i[r]
            },
            _applyCharStyles: function(t, e, i, r, n) { this._setFillStyles(e, n), this._setStrokeStyles(e, n), e.font = this._getFontDeclaration(n) },
            _measureChar: function(t, e, i, r) {
                var n, s, o, a, c = this.getFontCache(e),
                    h = i + t,
                    l = this._getFontDeclaration(e) === this._getFontDeclaration(r),
                    u = e.fontSize / this.CACHE_FONT_SIZE;
                if (i && void 0 !== c[i] && (o = c[i]), void 0 !== c[t] && (a = n = c[t]), l && void 0 !== c[h] && (a = (s = c[h]) - o), void 0 === n || void 0 === o || void 0 === s) {
                    var f = this.getMeasuringContext();
                    this._setTextStyles(f, e, !0)
                }
                return void 0 === n && (a = n = f.measureText(t).width, c[t] = n), void 0 === o && l && i && (o = f.measureText(i).width, c[i] = o), l && void 0 === s && (s = f.measureText(h).width, a = (c[h] = s) - o), { width: n * u, kernedWidth: a * u }
            },
            getHeightOfChar: function(t, e) { return this.getValueOfPropertyAt(t, e, "fontSize") },
            measureLine: function(t) { var e = this._measureLine(t); return 0 !== this.charSpacing && (e.width -= this._getWidthOfCharSpacing()), e.width < 0 && (e.width = 0), e },
            _measureLine: function(t) {
                var e, i, r, n, s = 0,
                    o = this._textLines[t],
                    a = new Array(o.length);
                for (this.__charBounds[t] = a, e = 0; e < o.length; e++) i = o[e], n = this._getGraphemeBox(i, t, e, r), s += (a[e] = n).kernedWidth, r = i;
                return a[e] = { left: n ? n.left + n.width : 0, width: 0, kernedWidth: 0, height: this.fontSize }, { width: s, numOfSpaces: 0 }
            },
            _getGraphemeBox: function(t, e, i, r, n) {
                var s, o = this.getCompleteStyleDeclaration(e, i),
                    a = r ? this.getCompleteStyleDeclaration(e, i - 1) : {},
                    c = this._measureChar(t, o, r, a),
                    h = c.kernedWidth,
                    l = c.width;
                0 !== this.charSpacing && (l += s = this._getWidthOfCharSpacing(), h += s);
                var u = { width: l, left: 0, height: o.fontSize, kernedWidth: h, deltaY: o.deltaY };
                if (0 < i && !n) {
                    var f = this.__charBounds[e][i - 1];
                    u.left = f.left + f.width + c.kernedWidth - c.width
                }
                return u
            },
            getHeightOfLine: function(t) { if (this.__lineHeights[t]) return this.__lineHeights[t]; for (var e = this._textLines[t], i = this.getHeightOfChar(t, 0), r = 1, n = e.length; r < n; r++) i = Math.max(this.getHeightOfChar(t, r), i); return this.__lineHeights[t] = i * this.lineHeight * this._fontSizeMult },
            calcTextHeight: function() { for (var t, e = 0, i = 0, r = this._textLines.length; i < r; i++) t = this.getHeightOfLine(i), e += i === r - 1 ? t / this.lineHeight : t; return e },
            _getLeftOffset: function() { return -this.width / 2 },
            _getTopOffset: function() { return -this.height / 2 },
            _renderTextCommon: function(t, e) {
                t.save();
                for (var i = 0, r = this._getLeftOffset(), n = this._getTopOffset(), s = this._applyPatternGradientTransform(t, "fillText" === e ? this.fill : this.stroke), o = 0, a = this._textLines.length; o < a; o++) {
                    var c = this.getHeightOfLine(o),
                        h = c / this.lineHeight,
                        l = this._getLineLeftOffset(o);
                    this._renderTextLine(e, t, this._textLines[o], r + l - s.offsetX, n + i + h - s.offsetY, o), i += c
                }
                t.restore()
            },
            _renderTextFill: function(t) {
                (this.fill || this.styleHas("fill")) && this._renderTextCommon(t, "fillText")
            },
            _renderTextStroke: function(t) {
                (this.stroke && 0 !== this.strokeWidth || !this.isEmptyStyles()) && (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this._setLineDash(t, this.strokeDashArray), t.beginPath(), this._renderTextCommon(t, "strokeText"), t.closePath(), t.restore())
            },
            _renderChars: function(t, e, i, r, n, s) {
                var o, a, c, h, l = this.getHeightOfLine(s),
                    u = -1 !== this.textAlign.indexOf("justify"),
                    f = "",
                    d = 0,
                    g = !u && 0 === this.charSpacing && this.isEmptyStyles(s);
                if (e.save(), n -= l * this._fontSizeFraction / this.lineHeight, g) return this._renderChar(t, e, s, 0, this.textLines[s], r, n, l), void e.restore();
                for (var p = 0, v = i.length - 1; p <= v; p++) h = p === v || this.charSpacing, f += i[p], c = this.__charBounds[s][p], 0 === d ? (r += c.kernedWidth - c.width, d += c.width) : d += c.kernedWidth, u && !h && this._reSpaceAndTab.test(i[p]) && (h = !0), h || (o = o || this.getCompleteStyleDeclaration(s, p), a = this.getCompleteStyleDeclaration(s, p + 1), h = this._hasStyleChanged(o, a)), h && (this._renderChar(t, e, s, p, f, r, n, l), f = "", o = a, r += d, d = 0);
                e.restore()
            },
            _renderChar: function(t, e, i, r, n, s, o) {
                var a = this._getStyleDeclaration(i, r),
                    c = this.getCompleteStyleDeclaration(i, r),
                    h = "fillText" === t && c.fill,
                    l = "strokeText" === t && c.stroke && c.strokeWidth;
                (l || h) && (a && e.save(), this._applyCharStyles(t, e, i, r, c), a && a.textBackgroundColor && this._removeShadow(e), a && a.deltaY && (o += a.deltaY), h && e.fillText(n, s, o), l && e.strokeText(n, s, o), a && e.restore())
            },
            setSuperscript: function(t, e) { return this._setScript(t, e, this.superscript) },
            setSubscript: function(t, e) { return this._setScript(t, e, this.subscript) },
            _setScript: function(t, e, i) {
                var r = this.get2DCursorLocation(t, !0),
                    n = this.getValueOfPropertyAt(r.lineIndex, r.charIndex, "fontSize"),
                    s = this.getValueOfPropertyAt(r.lineIndex, r.charIndex, "deltaY"),
                    o = { fontSize: n * i.size, deltaY: s + n * i.baseline };
                return this.setSelectionStyles(o, t, e), this
            },
            _hasStyleChanged: function(t, e) { return t.fill !== e.fill || t.stroke !== e.stroke || t.strokeWidth !== e.strokeWidth || t.fontSize !== e.fontSize || t.fontFamily !== e.fontFamily || t.fontWeight !== e.fontWeight || t.fontStyle !== e.fontStyle || t.deltaY !== e.deltaY },
            _hasStyleChangedForSvg: function(t, e) { return this._hasStyleChanged(t, e) || t.overline !== e.overline || t.underline !== e.underline || t.linethrough !== e.linethrough },
            _getLineLeftOffset: function(t) { var e = this.getLineWidth(t); return "center" === this.textAlign ? (this.width - e) / 2 : "right" === this.textAlign ? this.width - e : "justify-center" === this.textAlign && this.isEndOfWrapping(t) ? (this.width - e) / 2 : "justify-right" === this.textAlign && this.isEndOfWrapping(t) ? this.width - e : 0 },
            _clearCache: function() { this.__lineWidths = [], this.__lineHeights = [], this.__charBounds = [] },
            _shouldClearDimensionCache: function() { var t = this._forceClearCache; return t || (t = this.hasStateChanged("_dimensionAffectingProps")), t && (this.dirty = !0, this._forceClearCache = !1), t },
            getLineWidth: function(t) { return this.__lineWidths[t] ? this.__lineWidths[t] : (e = "" === this._textLines[t] ? 0 : this.measureLine(t).width, this.__lineWidths[t] = e); var e },
            _getWidthOfCharSpacing: function() { return 0 !== this.charSpacing ? this.fontSize * this.charSpacing / 1e3 : 0 },
            getValueOfPropertyAt: function(t, e, i) { var r = this._getStyleDeclaration(t, e); return r && void 0 !== r[i] ? r[i] : this[i] },
            _renderTextDecoration: function(t, e) {
                if (this[e] || this.styleHas(e)) {
                    for (var i, r, n, s, o, a, c, h, l, u, f, d, g, p, v, m, b = this._getLeftOffset(), _ = this._getTopOffset(), y = this._getWidthOfCharSpacing(), x = 0, C = this._textLines.length; x < C; x++)
                        if (i = this.getHeightOfLine(x), this[e] || this.styleHas(e, x)) {
                            c = this._textLines[x], p = i / this.lineHeight, s = this._getLineLeftOffset(x), f = u = 0, h = this.getValueOfPropertyAt(x, 0, e), m = this.getValueOfPropertyAt(x, 0, "fill"), l = _ + p * (1 - this._fontSizeFraction), r = this.getHeightOfChar(x, 0), o = this.getValueOfPropertyAt(x, 0, "deltaY");
                            for (var S = 0, T = c.length; S < T; S++) d = this.__charBounds[x][S], g = this.getValueOfPropertyAt(x, S, e), v = this.getValueOfPropertyAt(x, S, "fill"), n = this.getHeightOfChar(x, S), a = this.getValueOfPropertyAt(x, S, "deltaY"), (g !== h || v !== m || n !== r || a !== o) && 0 < f ? (t.fillStyle = m, h && m && t.fillRect(b + s + u, l + this.offsets[e] * r + o, f, this.fontSize / 15), u = d.left, f = d.width, h = g, m = v, r = n, o = a) : f += d.kernedWidth;
                            t.fillStyle = v, g && v && t.fillRect(b + s + u, l + this.offsets[e] * r + o, f - y, this.fontSize / 15), _ += i
                        } else _ += i;
                    this._removeShadow(t)
                }
            },
            _getFontDeclaration: function(t, e) {
                var i = t || this,
                    r = this.fontFamily,
                    n = -1 < d.Text.genericFonts.indexOf(r.toLowerCase()),
                    s = void 0 === r || -1 < r.indexOf("'") || -1 < r.indexOf('"') || n ? i.fontFamily : '"' + i.fontFamily + '"';
                return [d.isLikelyNode ? i.fontWeight : i.fontStyle, d.isLikelyNode ? i.fontStyle : i.fontWeight, e ? this.CACHE_FONT_SIZE + "px" : i.fontSize + "px", s].join(" ")
            },
            render: function(t) { this.visible && (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen() || (this._shouldClearDimensionCache() && this.initDimensions(), this.callSuper("render", t))) },
            _splitTextIntoLines: function(t) { for (var e = t.split(this._reNewline), i = new Array(e.length), r = ["\n"], n = [], s = 0; s < e.length; s++) i[s] = d.util.string.graphemeSplit(e[s]), n = n.concat(i[s], r); return n.pop(), { _unwrappedLines: i, lines: e, graphemeText: n, graphemeLines: i } },
            toObject: function(t) {
                var e = ["text", "fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "underline", "overline", "linethrough", "textAlign", "textBackgroundColor", "charSpacing"].concat(t),
                    i = this.callSuper("toObject", e);
                return i.styles = g(this.styles, !0), i
            },
            set: function(t, e) {
                this.callSuper("set", t, e);
                var i = !1;
                if ("object" == typeof t)
                    for (var r in t) i = i || -1 !== this._dimensionAffectingProps.indexOf(r);
                else i = -1 !== this._dimensionAffectingProps.indexOf(t);
                return i && (this.initDimensions(), this.setCoords()), this
            },
            complexity: function() { return 1 }
        }), d.Text.ATTRIBUTE_NAMES = d.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size letter-spacing text-decoration text-anchor".split(" ")), d.Text.DEFAULT_SVG_FONT_SIZE = 16, d.Text.fromElement = function(t, e, i) {
            if (!t) return e(null);
            var r = d.parseAttributes(t, d.Text.ATTRIBUTE_NAMES),
                n = r.textAnchor || "left";
            if ((i = d.util.object.extend(i ? g(i) : {}, r)).top = i.top || 0, i.left = i.left || 0, r.textDecoration) { var s = r.textDecoration; - 1 !== s.indexOf("underline") && (i.underline = !0), -1 !== s.indexOf("overline") && (i.overline = !0), -1 !== s.indexOf("line-through") && (i.linethrough = !0), delete i.textDecoration }
            "dx" in r && (i.left += r.dx), "dy" in r && (i.top += r.dy), "fontSize" in i || (i.fontSize = d.Text.DEFAULT_SVG_FONT_SIZE);
            var o = "";
            "textContent" in t ? o = t.textContent : "firstChild" in t && null !== t.firstChild && "data" in t.firstChild && null !== t.firstChild.data && (o = t.firstChild.data), o = o.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " ");
            var a = i.strokeWidth;
            i.strokeWidth = 0;
            var c = new d.Text(o, i),
                h = c.getScaledHeight() / c.height,
                l = ((c.height + c.strokeWidth) * c.lineHeight - c.height) * h,
                u = c.getScaledHeight() + l,
                f = 0;
            "center" === n && (f = c.getScaledWidth() / 2), "right" === n && (f = c.getScaledWidth()), c.set({ left: c.left - f, top: c.top - (u - c.fontSize * (.07 + c._fontSizeFraction)) / c.lineHeight, strokeWidth: void 0 !== a ? a : 1 }), e(c)
        }, d.Text.fromObject = function(t, e) { return d.Object._fromObject("Text", t, e, "text") }, d.Text.genericFonts = ["sans-serif", "serif", "cursive", "fantasy", "monospace"], d.util.createAccessors && d.util.createAccessors(d.Text))
    }("undefined" != typeof exports ? exports : this), fabric.util.object.extend(fabric.Text.prototype, {
        isEmptyStyles: function(t) {
            if (!this.styles) return !0;
            if (void 0 !== t && !this.styles[t]) return !0;
            var e = void 0 === t ? this.styles : { line: this.styles[t] };
            for (var i in e)
                for (var r in e[i])
                    for (var n in e[i][r]) return !1;
            return !0
        },
        styleHas: function(t, e) {
            if (!this.styles || !t || "" === t) return !1;
            if (void 0 !== e && !this.styles[e]) return !1;
            var i = void 0 === e ? this.styles : { line: this.styles[e] };
            for (var r in i)
                for (var n in i[r])
                    if (void 0 !== i[r][n][t]) return !0;
            return !1
        },
        cleanStyle: function(t) {
            if (!this.styles || !t || "" === t) return !1;
            var e, i, r = this.styles,
                n = 0,
                s = !0,
                o = 0;
            for (var a in r) {
                for (var c in e = 0, r[a]) {
                    var h;
                    n++, (h = r[a][c]).hasOwnProperty(t) ? (i ? h[t] !== i && (s = !1) : i = h[t], h[t] === this[t] && delete h[t]) : s = !1, 0 !== Object.keys(h).length ? e++ : delete r[a][c]
                }
                0 === e && delete r[a]
            }
            for (var l = 0; l < this._textLines.length; l++) o += this._textLines[l].length;
            s && n === o && (this[t] = i, this.removeStyle(t))
        },
        removeStyle: function(t) {
            if (this.styles && t && "" !== t) {
                var e, i, r, n = this.styles;
                for (i in n) {
                    for (r in e = n[i]) delete e[r][t], 0 === Object.keys(e[r]).length && delete e[r];
                    0 === Object.keys(e).length && delete n[i]
                }
            }
        },
        _extendStyles: function(t, e) {
            var i = this.get2DCursorLocation(t);
            this._getLineStyle(i.lineIndex) || this._setLineStyle(i.lineIndex, {}), this._getStyleDeclaration(i.lineIndex, i.charIndex) || this._setStyleDeclaration(i.lineIndex, i.charIndex, {}), fabric.util.object.extend(this._getStyleDeclaration(i.lineIndex, i.charIndex), e)
        },
        get2DCursorLocation: function(t, e) {
            void 0 === t && (t = this.selectionStart);
            for (var i = e ? this._unwrappedTextLines : this._textLines, r = i.length, n = 0; n < r; n++) {
                if (t <= i[n].length) return { lineIndex: n, charIndex: t };
                t -= i[n].length + 1
            }
            return { lineIndex: n - 1, charIndex: i[n - 1].length < t ? i[n - 1].length : t }
        },
        getSelectionStyles: function(t, e, i) { void 0 === t && (t = this.selectionStart || 0), void 0 === e && (e = this.selectionEnd || t); for (var r = [], n = t; n < e; n++) r.push(this.getStyleAtPosition(n, i)); return r },
        getStyleAtPosition: function(t, e) { var i = this.get2DCursorLocation(t); return (e ? this.getCompleteStyleDeclaration(i.lineIndex, i.charIndex) : this._getStyleDeclaration(i.lineIndex, i.charIndex)) || {} },
        setSelectionStyles: function(t, e, i) { void 0 === e && (e = this.selectionStart || 0), void 0 === i && (i = this.selectionEnd || e); for (var r = e; r < i; r++) this._extendStyles(r, t); return this._forceClearCache = !0, this },
        _getStyleDeclaration: function(t, e) { var i = this.styles && this.styles[t]; return i ? i[e] : null },
        getCompleteStyleDeclaration: function(t, e) { for (var i, r = this._getStyleDeclaration(t, e) || {}, n = {}, s = 0; s < this._styleProperties.length; s++) n[i = this._styleProperties[s]] = void 0 === r[i] ? this[i] : r[i]; return n },
        _setStyleDeclaration: function(t, e, i) { this.styles[t][e] = i },
        _deleteStyleDeclaration: function(t, e) { delete this.styles[t][e] },
        _getLineStyle: function(t) { return this.styles[t] },
        _setLineStyle: function(t, e) { this.styles[t] = e },
        _deleteLineStyle: function(t) { delete this.styles[t] }
    }),
    function() {
        function n(t) { t.textDecoration && (-1 < t.textDecoration.indexOf("underline") && (t.underline = !0), -1 < t.textDecoration.indexOf("line-through") && (t.linethrough = !0), -1 < t.textDecoration.indexOf("overline") && (t.overline = !0), delete t.textDecoration) }
        fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
            type: "i-text",
            selectionStart: 0,
            selectionEnd: 0,
            selectionColor: "rgba(17,119,255,0.3)",
            isEditing: !1,
            editable: !0,
            editingBorderColor: "rgba(102,153,255,0.25)",
            cursorWidth: 2,
            cursorColor: "#333",
            cursorDelay: 1e3,
            cursorDuration: 600,
            caching: !0,
            _reSpace: /\s|\n/,
            _currentCursorOpacity: 0,
            _selectionDirection: null,
            _abortCursorAnimation: !1,
            __widthOfSpace: [],
            inCompositionMode: !1,
            initialize: function(t, e) { this.callSuper("initialize", t, e), this.initBehavior() },
            setSelectionStart: function(t) { t = Math.max(t, 0), this._updateAndFire("selectionStart", t) },
            setSelectionEnd: function(t) { t = Math.min(t, this.text.length), this._updateAndFire("selectionEnd", t) },
            _updateAndFire: function(t, e) { this[t] !== e && (this._fireSelectionChanged(), this[t] = e), this._updateTextarea() },
            _fireSelectionChanged: function() { this.fire("selection:changed"), this.canvas && this.canvas.fire("text:selection:changed", { target: this }) },
            initDimensions: function() { this.isEditing && this.initDelayedCursor(), this.clearContextTop(), this.callSuper("initDimensions") },
            render: function(t) { this.clearContextTop(), this.callSuper("render", t), this.cursorOffsetCache = {}, this.renderCursorOrSelection() },
            _render: function(t) { this.callSuper("_render", t) },
            clearContextTop: function(t) {
                if (this.isEditing && this.canvas && this.canvas.contextTop) {
                    var e = this.canvas.contextTop,
                        i = this.canvas.viewportTransform;
                    e.save(), e.transform(i[0], i[1], i[2], i[3], i[4], i[5]), this.transform(e), this.transformMatrix && e.transform.apply(e, this.transformMatrix), this._clearTextArea(e), t || e.restore()
                }
            },
            renderCursorOrSelection: function() {
                if (this.isEditing && this.canvas) {
                    var t, e = this._getCursorBoundaries();
                    this.canvas && this.canvas.contextTop ? (t = this.canvas.contextTop, this.clearContextTop(!0)) : (t = this.canvas.contextContainer).save(), this.selectionStart === this.selectionEnd ? this.renderCursor(e, t) : this.renderSelection(e, t), t.restore()
                }
            },
            _clearTextArea: function(t) {
                var e = this.width + 4,
                    i = this.height + 4;
                t.clearRect(-e / 2, -i / 2, e, i)
            },
            _getCursorBoundaries: function(t) {
                void 0 === t && (t = this.selectionStart);
                var e = this._getLeftOffset(),
                    i = this._getTopOffset(),
                    r = this._getCursorBoundariesOffsets(t);
                return { left: e, top: i, leftOffset: r.left, topOffset: r.top }
            },
            _getCursorBoundariesOffsets: function(t) {
                if (this.cursorOffsetCache && "top" in this.cursorOffsetCache) return this.cursorOffsetCache;
                var e, i, r, n, s = 0,
                    o = 0,
                    a = this.get2DCursorLocation(t);
                r = a.charIndex, i = a.lineIndex;
                for (var c = 0; c < i; c++) s += this.getHeightOfLine(c);
                e = this._getLineLeftOffset(i);
                var h = this.__charBounds[i][r];
                return h && (o = h.left), 0 !== this.charSpacing && r === this._textLines[i].length && (o -= this._getWidthOfCharSpacing()), n = { top: s, left: e + (0 < o ? o : 0) }, this.cursorOffsetCache = n, this.cursorOffsetCache
            },
            renderCursor: function(t, e) {
                var i = this.get2DCursorLocation(),
                    r = i.lineIndex,
                    n = 0 < i.charIndex ? i.charIndex - 1 : 0,
                    s = this.getValueOfPropertyAt(r, n, "fontSize"),
                    o = this.scaleX * this.canvas.getZoom(),
                    a = this.cursorWidth / o,
                    c = t.topOffset,
                    h = this.getValueOfPropertyAt(r, n, "deltaY");
                c += (1 - this._fontSizeFraction) * this.getHeightOfLine(r) / this.lineHeight - s * (1 - this._fontSizeFraction), this.inCompositionMode && this.renderSelection(t, e), e.fillStyle = this.getValueOfPropertyAt(r, n, "fill"), e.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity, e.fillRect(t.left + t.leftOffset - a / 2, c + t.top + h, a, s)
            },
            renderSelection: function(t, e) {
                for (var i = this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart, r = this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd, n = -1 !== this.textAlign.indexOf("justify"), s = this.get2DCursorLocation(i), o = this.get2DCursorLocation(r), a = s.lineIndex, c = o.lineIndex, h = s.charIndex < 0 ? 0 : s.charIndex, l = o.charIndex < 0 ? 0 : o.charIndex, u = a; u <= c; u++) {
                    var f, d = this._getLineLeftOffset(u) || 0,
                        g = this.getHeightOfLine(u),
                        p = 0,
                        v = 0;
                    if (u === a && (p = this.__charBounds[a][h].left), a <= u && u < c) v = n && !this.isEndOfWrapping(u) ? this.width : this.getLineWidth(u) || 5;
                    else if (u === c)
                        if (0 === l) v = this.__charBounds[c][l].left;
                        else {
                            var m = this._getWidthOfCharSpacing();
                            v = this.__charBounds[c][l - 1].left + this.__charBounds[c][l - 1].width - m
                        }
                    f = g, (this.lineHeight < 1 || u === c && 1 < this.lineHeight) && (g /= this.lineHeight), this.inCompositionMode ? (e.fillStyle = this.compositionColor || "black", e.fillRect(t.left + d + p, t.top + t.topOffset + g, v - p, 1)) : (e.fillStyle = this.selectionColor, e.fillRect(t.left + d + p, t.top + t.topOffset, v - p, g)), t.topOffset += f
                }
            },
            getCurrentCharFontSize: function() { var t = this._getCurrentCharIndex(); return this.getValueOfPropertyAt(t.l, t.c, "fontSize") },
            getCurrentCharColor: function() { var t = this._getCurrentCharIndex(); return this.getValueOfPropertyAt(t.l, t.c, "fill") },
            _getCurrentCharIndex: function() {
                var t = this.get2DCursorLocation(this.selectionStart, !0),
                    e = 0 < t.charIndex ? t.charIndex - 1 : 0;
                return { l: t.lineIndex, c: e }
            }
        }), fabric.IText.fromObject = function(t, e) {
            if (n(t), t.styles)
                for (var i in t.styles)
                    for (var r in t.styles[i]) n(t.styles[i][r]);
            fabric.Object._fromObject("IText", t, e, "text")
        }
    }(),
    function() {
        var h = fabric.util.object.clone;
        fabric.util.object.extend(fabric.IText.prototype, {
            initBehavior: function() { this.initAddedHandler(), this.initRemovedHandler(), this.initCursorSelectionHandlers(), this.initDoubleClickSimulation(), this.mouseMoveHandler = this.mouseMoveHandler.bind(this) },
            onDeselect: function() { this.isEditing && this.exitEditing(), this.selected = !1 },
            initAddedHandler: function() {
                var e = this;
                this.on("added", function() {
                    var t = e.canvas;
                    t && (t._hasITextHandlers || (t._hasITextHandlers = !0, e._initCanvasHandlers(t)), t._iTextInstances = t._iTextInstances || [], t._iTextInstances.push(e))
                })
            },
            initRemovedHandler: function() {
                var e = this;
                this.on("removed", function() {
                    var t = e.canvas;
                    t && (t._iTextInstances = t._iTextInstances || [], fabric.util.removeFromArray(t._iTextInstances, e), 0 === t._iTextInstances.length && (t._hasITextHandlers = !1, e._removeCanvasHandlers(t)))
                })
            },
            _initCanvasHandlers: function(t) { t._mouseUpITextHandler = function() { t._iTextInstances && t._iTextInstances.forEach(function(t) { t.__isMousedown = !1 }) }, t.on("mouse:up", t._mouseUpITextHandler) },
            _removeCanvasHandlers: function(t) { t.off("mouse:up", t._mouseUpITextHandler) },
            _tick: function() { this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete") },
            _animateCursor: function(t, e, i, r) { var n; return n = { isAborted: !1, abort: function() { this.isAborted = !0 } }, t.animate("_currentCursorOpacity", e, { duration: i, onComplete: function() { n.isAborted || t[r]() }, onChange: function() { t.canvas && t.selectionStart === t.selectionEnd && t.renderCursorOrSelection() }, abort: function() { return n.isAborted } }), n },
            _onTickComplete: function() {
                var t = this;
                this._cursorTimeout1 && clearTimeout(this._cursorTimeout1), this._cursorTimeout1 = setTimeout(function() { t._currentTickCompleteState = t._animateCursor(t, 0, this.cursorDuration / 2, "_tick") }, 100)
            },
            initDelayedCursor: function(t) {
                var e = this,
                    i = t ? 0 : this.cursorDelay;
                this.abortCursorAnimation(), this._currentCursorOpacity = 1, this._cursorTimeout2 = setTimeout(function() { e._tick() }, i)
            },
            abortCursorAnimation: function() {
                var t = this._currentTickState || this._currentTickCompleteState,
                    e = this.canvas;
                this._currentTickState && this._currentTickState.abort(), this._currentTickCompleteState && this._currentTickCompleteState.abort(), clearTimeout(this._cursorTimeout1), clearTimeout(this._cursorTimeout2), this._currentCursorOpacity = 0, t && e && e.clearContext(e.contextTop || e.contextContainer)
            },
            selectAll: function() { return this.selectionStart = 0, this.selectionEnd = this._text.length, this._fireSelectionChanged(), this._updateTextarea(), this },
            getSelectedText: function() { return this._text.slice(this.selectionStart, this.selectionEnd).join("") },
            findWordBoundaryLeft: function(t) {
                var e = 0,
                    i = t - 1;
                if (this._reSpace.test(this._text[i]))
                    for (; this._reSpace.test(this._text[i]);) e++, i--;
                for (;
                    /\S/.test(this._text[i]) && -1 < i;) e++, i--;
                return t - e
            },
            findWordBoundaryRight: function(t) {
                var e = 0,
                    i = t;
                if (this._reSpace.test(this._text[i]))
                    for (; this._reSpace.test(this._text[i]);) e++, i++;
                for (;
                    /\S/.test(this._text[i]) && i < this.text.length;) e++, i++;
                return t + e
            },
            findLineBoundaryLeft: function(t) { for (var e = 0, i = t - 1; !/\n/.test(this._text[i]) && -1 < i;) e++, i--; return t - e },
            findLineBoundaryRight: function(t) { for (var e = 0, i = t; !/\n/.test(this._text[i]) && i < this.text.length;) e++, i++; return t + e },
            searchWordBoundary: function(t, e) { for (var i = this._reSpace.test(this.text.charAt(t)) ? t - 1 : t, r = this.text.charAt(i), n = /[ \n\.,;!\?\-]/; !n.test(r) && 0 < i && i < this.text.length;) i += e, r = this.text.charAt(i); return n.test(r) && "\n" !== r && (i += 1 === e ? 0 : 1), i },
            selectWord: function(t) {
                t = t || this.selectionStart;
                var e = this.searchWordBoundary(t, -1),
                    i = this.searchWordBoundary(t, 1);
                this.selectionStart = e, this.selectionEnd = i, this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()
            },
            selectLine: function(t) {
                t = t || this.selectionStart;
                var e = this.findLineBoundaryLeft(t),
                    i = this.findLineBoundaryRight(t);
                return this.selectionStart = e, this.selectionEnd = i, this._fireSelectionChanged(), this._updateTextarea(), this
            },
            enterEditing: function(t) { if (!this.isEditing && this.editable) return this.canvas && (this.canvas.calcOffset(), this.exitEditingOnOthers(this.canvas)), this.isEditing = !0, this.initHiddenTextarea(t), this.hiddenTextarea.focus(), this.hiddenTextarea.value = this.text, this._updateTextarea(), this._saveEditingProps(), this._setEditingProps(), this._textBeforeEdit = this.text, this._tick(), this.fire("editing:entered"), this._fireSelectionChanged(), this.canvas && (this.canvas.fire("text:editing:entered", { target: this }), this.initMouseMoveHandler(), this.canvas.requestRenderAll()), this },
            exitEditingOnOthers: function(t) { t._iTextInstances && t._iTextInstances.forEach(function(t) { t.selected = !1, t.isEditing && t.exitEditing() }) },
            initMouseMoveHandler: function() { this.canvas.on("mouse:move", this.mouseMoveHandler) },
            mouseMoveHandler: function(t) {
                if (this.__isMousedown && this.isEditing) {
                    var e = this.getSelectionStartFromPointer(t.e),
                        i = this.selectionStart,
                        r = this.selectionEnd;
                    (e === this.__selectionStartOnMouseDown && i !== r || i !== e && r !== e) && (e > this.__selectionStartOnMouseDown ? (this.selectionStart = this.__selectionStartOnMouseDown, this.selectionEnd = e) : (this.selectionStart = e, this.selectionEnd = this.__selectionStartOnMouseDown), this.selectionStart === i && this.selectionEnd === r || (this.restartCursorIfNeeded(), this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()))
                }
            },
            _setEditingProps: function() { this.hoverCursor = "text", this.canvas && (this.canvas.defaultCursor = this.canvas.moveCursor = "text"), this.borderColor = this.editingBorderColor, this.hasControls = this.selectable = !1, this.lockMovementX = this.lockMovementY = !0 },
            fromStringToGraphemeSelection: function(t, e, i) {
                var r = i.slice(0, t),
                    n = fabric.util.string.graphemeSplit(r).length;
                if (t === e) return { selectionStart: n, selectionEnd: n };
                var s = i.slice(t, e);
                return { selectionStart: n, selectionEnd: n + fabric.util.string.graphemeSplit(s).length }
            },
            fromGraphemeToStringSelection: function(t, e, i) { var r = i.slice(0, t).join("").length; return t === e ? { selectionStart: r, selectionEnd: r } : { selectionStart: r, selectionEnd: r + i.slice(t, e).join("").length } },
            _updateTextarea: function() {
                if (this.cursorOffsetCache = {}, this.hiddenTextarea) {
                    if (!this.inCompositionMode) {
                        var t = this.fromGraphemeToStringSelection(this.selectionStart, this.selectionEnd, this._text);
                        this.hiddenTextarea.selectionStart = t.selectionStart, this.hiddenTextarea.selectionEnd = t.selectionEnd
                    }
                    this.updateTextareaPosition()
                }
            },
            updateFromTextArea: function() {
                if (this.hiddenTextarea) {
                    this.cursorOffsetCache = {}, this.text = this.hiddenTextarea.value, this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords());
                    var t = this.fromStringToGraphemeSelection(this.hiddenTextarea.selectionStart, this.hiddenTextarea.selectionEnd, this.hiddenTextarea.value);
                    this.selectionEnd = this.selectionStart = t.selectionEnd, this.inCompositionMode || (this.selectionStart = t.selectionStart), this.updateTextareaPosition()
                }
            },
            updateTextareaPosition: function() {
                if (this.selectionStart === this.selectionEnd) {
                    var t = this._calcTextareaPosition();
                    this.hiddenTextarea.style.left = t.left, this.hiddenTextarea.style.top = t.top
                }
            },
            _calcTextareaPosition: function() {
                if (!this.canvas) return { x: 1, y: 1 };
                var t = this.inCompositionMode ? this.compositionStart : this.selectionStart,
                    e = this._getCursorBoundaries(t),
                    i = this.get2DCursorLocation(t),
                    r = i.lineIndex,
                    n = i.charIndex,
                    s = this.getValueOfPropertyAt(r, n, "fontSize") * this.lineHeight,
                    o = e.leftOffset,
                    a = this.calcTransformMatrix(),
                    c = { x: e.left + o, y: e.top + e.topOffset + s },
                    h = this.canvas.upperCanvasEl,
                    l = h.width,
                    u = h.height,
                    f = l - s,
                    d = u - s,
                    g = h.clientWidth / l,
                    p = h.clientHeight / u;
                return c = fabric.util.transformPoint(c, a), (c = fabric.util.transformPoint(c, this.canvas.viewportTransform)).x *= g, c.y *= p, c.x < 0 && (c.x = 0), c.x > f && (c.x = f), c.y < 0 && (c.y = 0), c.y > d && (c.y = d), c.x += this.canvas._offset.left, c.y += this.canvas._offset.top, { left: c.x + "px", top: c.y + "px", fontSize: s + "px", charHeight: s }
            },
            _saveEditingProps: function() { this._savedProps = { hasControls: this.hasControls, borderColor: this.borderColor, lockMovementX: this.lockMovementX, lockMovementY: this.lockMovementY, hoverCursor: this.hoverCursor, defaultCursor: this.canvas && this.canvas.defaultCursor, moveCursor: this.canvas && this.canvas.moveCursor } },
            _restoreEditingProps: function() { this._savedProps && (this.hoverCursor = this._savedProps.hoverCursor, this.hasControls = this._savedProps.hasControls, this.borderColor = this._savedProps.borderColor, this.lockMovementX = this._savedProps.lockMovementX, this.lockMovementY = this._savedProps.lockMovementY, this.canvas && (this.canvas.defaultCursor = this._savedProps.defaultCursor, this.canvas.moveCursor = this._savedProps.moveCursor)) },
            exitEditing: function() { var t = this._textBeforeEdit !== this.text; return this.selected = !1, this.isEditing = !1, this.selectable = !0, this.selectionEnd = this.selectionStart, this.hiddenTextarea && (this.hiddenTextarea.blur && this.hiddenTextarea.blur(), this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea), this.hiddenTextarea = null), this.abortCursorAnimation(), this._restoreEditingProps(), this._currentCursorOpacity = 0, this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords()), this.fire("editing:exited"), t && this.fire("modified"), this.canvas && (this.canvas.off("mouse:move", this.mouseMoveHandler), this.canvas.fire("text:editing:exited", { target: this }), t && this.canvas.fire("object:modified", { target: this })), this },
            _removeExtraneousStyles: function() { for (var t in this.styles) this._textLines[t] || delete this.styles[t] },
            removeStyleFromTo: function(t, e) {
                var i, r, n = this.get2DCursorLocation(t, !0),
                    s = this.get2DCursorLocation(e, !0),
                    o = n.lineIndex,
                    a = n.charIndex,
                    c = s.lineIndex,
                    h = s.charIndex;
                if (o !== c) {
                    if (this.styles[o])
                        for (i = a; i < this._unwrappedTextLines[o].length; i++) delete this.styles[o][i];
                    if (this.styles[c])
                        for (i = h; i < this._unwrappedTextLines[c].length; i++)(r = this.styles[c][i]) && (this.styles[o] || (this.styles[o] = {}), this.styles[o][a + i - h] = r);
                    for (i = o + 1; i <= c; i++) delete this.styles[i];
                    this.shiftLineStyles(c, o - c)
                } else if (this.styles[o]) { r = this.styles[o]; var l, u, f = h - a; for (i = a; i < h; i++) delete r[i]; for (u in this.styles[o]) h <= (l = parseInt(u, 10)) && (r[l - f] = r[u], delete r[u]) }
            },
            shiftLineStyles: function(t, e) {
                var i = h(this.styles);
                for (var r in this.styles) {
                    var n = parseInt(r, 10);
                    t < n && (this.styles[n + e] = i[n], i[n - e] || delete this.styles[n])
                }
            },
            restartCursorIfNeeded: function() { this._currentTickState && !this._currentTickState.isAborted && this._currentTickCompleteState && !this._currentTickCompleteState.isAborted || this.initDelayedCursor() },
            insertNewlineStyleObject: function(t, e, i, r) {
                var n, s = {},
                    o = !1;
                for (var a in i || (i = 1), this.shiftLineStyles(t, i), this.styles[t] && (n = this.styles[t][0 === e ? e : e - 1]), this.styles[t]) {
                    var c = parseInt(a, 10);
                    e <= c && (o = !0, s[c - e] = this.styles[t][a], delete this.styles[t][a])
                }
                for (o ? this.styles[t + i] = s : delete this.styles[t + i]; 1 < i;) i--, r && r[i] ? this.styles[t + i] = { 0: h(r[i]) } : n ? this.styles[t + i] = { 0: h(n) } : delete this.styles[t + i];
                this._forceClearCache = !0
            },
            insertCharStyleObject: function(t, e, i, r) {
                this.styles || (this.styles = {});
                var n = this.styles[t],
                    s = n ? h(n) : {};
                for (var o in i || (i = 1), s) {
                    var a = parseInt(o, 10);
                    e <= a && (n[a + i] = s[a], s[a - i] || delete n[a])
                }
                if (this._forceClearCache = !0, r)
                    for (; i--;) Object.keys(r[i]).length && (this.styles[t] || (this.styles[t] = {}), this.styles[t][e + i] = h(r[i]));
                else if (n)
                    for (var c = n[e ? e - 1 : 1]; c && i--;) this.styles[t][e + i] = h(c)
            },
            insertNewStyleBlock: function(t, e, i) {
                for (var r = this.get2DCursorLocation(e, !0), n = [0], s = 0, o = 0; o < t.length; o++) "\n" === t[o] ? n[++s] = 0 : n[s]++;
                0 < n[0] && (this.insertCharStyleObject(r.lineIndex, r.charIndex, n[0], i), i = i && i.slice(n[0] + 1)), s && this.insertNewlineStyleObject(r.lineIndex, r.charIndex + n[0], s);
                for (o = 1; o < s; o++) 0 < n[o] ? this.insertCharStyleObject(r.lineIndex + o, 0, n[o], i) : i && (this.styles[r.lineIndex + o][0] = i[0]), i = i && i.slice(n[o] + 1);
                0 < n[o] && this.insertCharStyleObject(r.lineIndex + o, 0, n[o], i)
            },
            setSelectionStartEndWithShift: function(t, e, i) { i <= t ? (e === t ? this._selectionDirection = "left" : "right" === this._selectionDirection && (this._selectionDirection = "left", this.selectionEnd = t), this.selectionStart = i) : t < i && i < e ? "right" === this._selectionDirection ? this.selectionEnd = i : this.selectionStart = i : (e === t ? this._selectionDirection = "right" : "left" === this._selectionDirection && (this._selectionDirection = "right", this.selectionStart = e), this.selectionEnd = i) },
            setSelectionInBoundaries: function() {
                var t = this.text.length;
                this.selectionStart > t ? this.selectionStart = t : this.selectionStart < 0 && (this.selectionStart = 0), this.selectionEnd > t ? this.selectionEnd = t : this.selectionEnd < 0 && (this.selectionEnd = 0)
            }
        })
    }(), fabric.util.object.extend(fabric.IText.prototype, {
        initDoubleClickSimulation: function() { this.__lastClickTime = +new Date, this.__lastLastClickTime = +new Date, this.__lastPointer = {}, this.on("mousedown", this.onMouseDown) },
        onMouseDown: function(t) {
            if (this.canvas) {
                this.__newClickTime = +new Date;
                var e = t.pointer;
                this.isTripleClick(e) && (this.fire("tripleclick", t), this._stopEvent(t.e)), this.__lastLastClickTime = this.__lastClickTime, this.__lastClickTime = this.__newClickTime, this.__lastPointer = e, this.__lastIsEditing = this.isEditing, this.__lastSelected = this.selected
            }
        },
        isTripleClick: function(t) { return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === t.x && this.__lastPointer.y === t.y },
        _stopEvent: function(t) { t.preventDefault && t.preventDefault(), t.stopPropagation && t.stopPropagation() },
        initCursorSelectionHandlers: function() { this.initMousedownHandler(), this.initMouseupHandler(), this.initClicks() },
        initClicks: function() { this.on("mousedblclick", function(t) { this.selectWord(this.getSelectionStartFromPointer(t.e)) }), this.on("tripleclick", function(t) { this.selectLine(this.getSelectionStartFromPointer(t.e)) }) },
        _mouseDownHandler: function(t) {!this.canvas || !this.editable || t.e.button && 1 !== t.e.button || (this.__isMousedown = !0, this.selected && this.setCursorByClick(t.e), this.isEditing && (this.__selectionStartOnMouseDown = this.selectionStart, this.selectionStart === this.selectionEnd && this.abortCursorAnimation(), this.renderCursorOrSelection())) },
        _mouseDownHandlerBefore: function(t) {!this.canvas || !this.editable || t.e.button && 1 !== t.e.button || this === this.canvas._activeObject && (this.selected = !0) },
        initMousedownHandler: function() { this.on("mousedown", this._mouseDownHandler), this.on("mousedown:before", this._mouseDownHandlerBefore) },
        initMouseupHandler: function() { this.on("mouseup", this.mouseUpHandler) },
        mouseUpHandler: function(t) {
            if (this.__isMousedown = !1, !(!this.editable || this.group || t.transform && t.transform.actionPerformed || t.e.button && 1 !== t.e.button)) {
                if (this.canvas) { var e = this.canvas._activeObject; if (e && e !== this) return }
                this.__lastSelected && !this.__corner ? (this.selected = !1, this.__lastSelected = !1, this.enterEditing(t.e), this.selectionStart === this.selectionEnd ? this.initDelayedCursor(!0) : this.renderCursorOrSelection()) : this.selected = !0
            }
        },
        setCursorByClick: function(t) {
            var e = this.getSelectionStartFromPointer(t),
                i = this.selectionStart,
                r = this.selectionEnd;
            t.shiftKey ? this.setSelectionStartEndWithShift(i, r, e) : (this.selectionStart = e, this.selectionEnd = e), this.isEditing && (this._fireSelectionChanged(), this._updateTextarea())
        },
        getSelectionStartFromPointer: function(t) {
            for (var e = this.getLocalPointer(t), i = 0, r = 0, n = 0, s = 0, o = 0, a = 0, c = this._textLines.length; a < c && n <= e.y; a++) n += this.getHeightOfLine(a) * this.scaleY, 0 < (o = a) && (s += this._textLines[a - 1].length + 1);
            r = this._getLineLeftOffset(o) * this.scaleX;
            for (var h = 0, l = this._textLines[o].length; h < l && (i = r, (r += this.__charBounds[o][h].kernedWidth * this.scaleX) <= e.x); h++) s++;
            return this._getNewSelectionStartFromOffset(e, i, r, s, l)
        },
        _getNewSelectionStartFromOffset: function(t, e, i, r, n) {
            var s = t.x - e,
                o = i - t.x,
                a = r + (s < o || o < 0 ? 0 : 1);
            return this.flipX && (a = n - a), a > this._text.length && (a = this._text.length), a
        }
    }), fabric.util.object.extend(fabric.IText.prototype, {
        initHiddenTextarea: function() {
            this.hiddenTextarea = fabric.document.createElement("textarea"), this.hiddenTextarea.setAttribute("autocapitalize", "off"), this.hiddenTextarea.setAttribute("autocorrect", "off"), this.hiddenTextarea.setAttribute("autocomplete", "off"), this.hiddenTextarea.setAttribute("spellcheck", "false"), this.hiddenTextarea.setAttribute("data-fabric-hiddentextarea", ""), this.hiddenTextarea.setAttribute("wrap", "off");
            var t = this._calcTextareaPosition();
            this.hiddenTextarea.style.cssText = "position: absolute; top: " + t.top + "; left: " + t.left + "; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; paddingｰtop: " + t.fontSize + ";", fabric.document.body.appendChild(this.hiddenTextarea), fabric.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this)), fabric.util.addListener(this.hiddenTextarea, "keyup", this.onKeyUp.bind(this)), fabric.util.addListener(this.hiddenTextarea, "input", this.onInput.bind(this)), fabric.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this)), fabric.util.addListener(this.hiddenTextarea, "cut", this.copy.bind(this)), fabric.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionstart", this.onCompositionStart.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionupdate", this.onCompositionUpdate.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionend", this.onCompositionEnd.bind(this)), !this._clickHandlerInitialized && this.canvas && (fabric.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this)), this._clickHandlerInitialized = !0)
        },
        keysMap: { 9: "exitEditing", 27: "exitEditing", 33: "moveCursorUp", 34: "moveCursorDown", 35: "moveCursorRight", 36: "moveCursorLeft", 37: "moveCursorLeft", 38: "moveCursorUp", 39: "moveCursorRight", 40: "moveCursorDown" },
        ctrlKeysMapUp: { 67: "copy", 88: "cut" },
        ctrlKeysMapDown: { 65: "selectAll" },
        onClick: function() { this.hiddenTextarea && this.hiddenTextarea.focus() },
        onKeyDown: function(t) {
            if (this.isEditing && !this.inCompositionMode) {
                if (t.keyCode in this.keysMap) this[this.keysMap[t.keyCode]](t);
                else {
                    if (!(t.keyCode in this.ctrlKeysMapDown && (t.ctrlKey || t.metaKey))) return;
                    this[this.ctrlKeysMapDown[t.keyCode]](t)
                }
                t.stopImmediatePropagation(), t.preventDefault(), 33 <= t.keyCode && t.keyCode <= 40 ? (this.clearContextTop(), this.renderCursorOrSelection()) : this.canvas && this.canvas.requestRenderAll()
            }
        },
        onKeyUp: function(t) {!this.isEditing || this._copyDone || this.inCompositionMode ? this._copyDone = !1 : t.keyCode in this.ctrlKeysMapUp && (t.ctrlKey || t.metaKey) && (this[this.ctrlKeysMapUp[t.keyCode]](t), t.stopImmediatePropagation(), t.preventDefault(), this.canvas && this.canvas.requestRenderAll()) },
        onInput: function(t) {
            var e = this.fromPaste;
            if (this.fromPaste = !1, t && t.stopPropagation(), this.isEditing) {
                var i, r, n = this._splitTextIntoLines(this.hiddenTextarea.value).graphemeText,
                    s = this._text.length,
                    o = n.length,
                    a = o - s;
                if ("" === this.hiddenTextarea.value) return this.styles = {}, this.updateFromTextArea(), this.fire("changed"), void(this.canvas && (this.canvas.fire("text:changed", { target: this }), this.canvas.requestRenderAll()));
                var c = this.fromStringToGraphemeSelection(this.hiddenTextarea.selectionStart, this.hiddenTextarea.selectionEnd, this.hiddenTextarea.value),
                    h = this.selectionStart > c.selectionStart;
                this.selectionStart !== this.selectionEnd ? (i = this._text.slice(this.selectionStart, this.selectionEnd), a += this.selectionEnd - this.selectionStart) : o < s && (i = h ? this._text.slice(this.selectionEnd + a, this.selectionEnd) : this._text.slice(this.selectionStart, this.selectionStart - a)), r = n.slice(c.selectionEnd - a, c.selectionEnd), i && i.length && (this.selectionStart !== this.selectionEnd ? this.removeStyleFromTo(this.selectionStart, this.selectionEnd) : h ? this.removeStyleFromTo(this.selectionEnd - i.length, this.selectionEnd) : this.removeStyleFromTo(this.selectionEnd, this.selectionEnd + i.length)), r.length && (e && r.join("") === fabric.copiedText ? this.insertNewStyleBlock(r, this.selectionStart, fabric.copiedTextStyle) : this.insertNewStyleBlock(r, this.selectionStart)), this.updateFromTextArea(), this.fire("changed"), this.canvas && (this.canvas.fire("text:changed", { target: this }), this.canvas.requestRenderAll())
            }
        },
        onCompositionStart: function() { this.inCompositionMode = !0 },
        onCompositionEnd: function() { this.inCompositionMode = !1 },
        onCompositionUpdate: function(t) { this.compositionStart = t.target.selectionStart, this.compositionEnd = t.target.selectionEnd, this.updateTextareaPosition() },
        copy: function() { this.selectionStart !== this.selectionEnd && (fabric.copiedText = this.getSelectedText(), fabric.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd, !0), this._copyDone = !0) },
        paste: function() { this.fromPaste = !0 },
        _getClipboardData: function(t) { return t && t.clipboardData || fabric.window.clipboardData },
        _getWidthBeforeCursor: function(t, e) { var i, r = this._getLineLeftOffset(t); return 0 < e && (r += (i = this.__charBounds[t][e - 1]).left + i.width), r },
        getDownCursorOffset: function(t, e) {
            var i = this._getSelectionForOffset(t, e),
                r = this.get2DCursorLocation(i),
                n = r.lineIndex;
            if (n === this._textLines.length - 1 || t.metaKey || 34 === t.keyCode) return this._text.length - i;
            var s = r.charIndex,
                o = this._getWidthBeforeCursor(n, s),
                a = this._getIndexOnLine(n + 1, o);
            return this._textLines[n].slice(s).length + a + 2
        },
        _getSelectionForOffset: function(t, e) { return t.shiftKey && this.selectionStart !== this.selectionEnd && e ? this.selectionEnd : this.selectionStart },
        getUpCursorOffset: function(t, e) {
            var i = this._getSelectionForOffset(t, e),
                r = this.get2DCursorLocation(i),
                n = r.lineIndex;
            if (0 === n || t.metaKey || 33 === t.keyCode) return -i;
            var s = r.charIndex,
                o = this._getWidthBeforeCursor(n, s),
                a = this._getIndexOnLine(n - 1, o),
                c = this._textLines[n].slice(0, s);
            return -this._textLines[n - 1].length + a - c.length
        },
        _getIndexOnLine: function(t, e) {
            for (var i, r, n = this._textLines[t], s = this._getLineLeftOffset(t), o = 0, a = 0, c = n.length; a < c; a++)
                if (e < (s += i = this.__charBounds[t][a].width)) {
                    r = !0;
                    var h = s - i,
                        l = s,
                        u = Math.abs(h - e);
                    o = Math.abs(l - e) < u ? a : a - 1;
                    break
                }
            return r || (o = n.length - 1), o
        },
        moveCursorDown: function(t) { this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length || this._moveCursorUpOrDown("Down", t) },
        moveCursorUp: function(t) { 0 === this.selectionStart && 0 === this.selectionEnd || this._moveCursorUpOrDown("Up", t) },
        _moveCursorUpOrDown: function(t, e) {
            var i = this["get" + t + "CursorOffset"](e, "right" === this._selectionDirection);
            e.shiftKey ? this.moveCursorWithShift(i) : this.moveCursorWithoutShift(i), 0 !== i && (this.setSelectionInBoundaries(), this.abortCursorAnimation(), this._currentCursorOpacity = 1, this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea())
        },
        moveCursorWithShift: function(t) { var e = "left" === this._selectionDirection ? this.selectionStart + t : this.selectionEnd + t; return this.setSelectionStartEndWithShift(this.selectionStart, this.selectionEnd, e), 0 !== t },
        moveCursorWithoutShift: function(t) { return t < 0 ? (this.selectionStart += t, this.selectionEnd = this.selectionStart) : (this.selectionEnd += t, this.selectionStart = this.selectionEnd), 0 !== t },
        moveCursorLeft: function(t) { 0 === this.selectionStart && 0 === this.selectionEnd || this._moveCursorLeftOrRight("Left", t) },
        _move: function(t, e, i) {
            var r;
            if (t.altKey) r = this["findWordBoundary" + i](this[e]);
            else {
                if (!t.metaKey && 35 !== t.keyCode && 36 !== t.keyCode) return this[e] += "Left" === i ? -1 : 1, !0;
                r = this["findLineBoundary" + i](this[e])
            }
            if (void 0 !== typeof r && this[e] !== r) return this[e] = r, !0
        },
        _moveLeft: function(t, e) { return this._move(t, e, "Left") },
        _moveRight: function(t, e) { return this._move(t, e, "Right") },
        moveCursorLeftWithoutShift: function(t) { var e = !0; return this._selectionDirection = "left", this.selectionEnd === this.selectionStart && 0 !== this.selectionStart && (e = this._moveLeft(t, "selectionStart")), this.selectionEnd = this.selectionStart, e },
        moveCursorLeftWithShift: function(t) { return "right" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveLeft(t, "selectionEnd") : 0 !== this.selectionStart ? (this._selectionDirection = "left", this._moveLeft(t, "selectionStart")) : void 0 },
        moveCursorRight: function(t) { this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length || this._moveCursorLeftOrRight("Right", t) },
        _moveCursorLeftOrRight: function(t, e) {
            var i = "moveCursor" + t + "With";
            this._currentCursorOpacity = 1, e.shiftKey ? i += "Shift" : i += "outShift", this[i](e) && (this.abortCursorAnimation(), this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea())
        },
        moveCursorRightWithShift: function(t) { return "left" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveRight(t, "selectionStart") : this.selectionEnd !== this._text.length ? (this._selectionDirection = "right", this._moveRight(t, "selectionEnd")) : void 0 },
        moveCursorRightWithoutShift: function(t) { var e = !0; return this._selectionDirection = "right", this.selectionStart === this.selectionEnd ? (e = this._moveRight(t, "selectionStart"), this.selectionEnd = this.selectionStart) : this.selectionStart = this.selectionEnd, e },
        removeChars: function(t, e) { void 0 === e && (e = t + 1), this.removeStyleFromTo(t, e), this._text.splice(t, e - t), this.text = this._text.join(""), this.set("dirty", !0), this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords()), this._removeExtraneousStyles() },
        insertChars: function(t, e, i, r) {
            void 0 === r && (r = i), i < r && this.removeStyleFromTo(i, r);
            var n = fabric.util.string.graphemeSplit(t);
            this.insertNewStyleBlock(n, i, e), this._text = [].concat(this._text.slice(0, i), n, this._text.slice(r)), this.text = this._text.join(""), this.set("dirty", !0), this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords()), this._removeExtraneousStyles()
        }
    }),
    function() {
        var l = fabric.util.toFixed,
            u = / +/g;
        fabric.util.object.extend(fabric.Text.prototype, {
            toSVG: function(t) {
                var e = this._getSVGLeftTopOffsets(),
                    i = this._getSVGTextAndBg(e.textTop, e.textLeft),
                    r = this._wrapSVGTextAndBg(i);
                return this._createBaseSVGMarkup(r, { reviver: t, noStyle: !0, withShadow: !0 })
            },
            _getSVGLeftTopOffsets: function() { return { textLeft: -this.width / 2, textTop: -this.height / 2, lineTop: this.getHeightOfLine(0) } },
            _wrapSVGTextAndBg: function(t) { var e = this.getSvgTextDecoration(this); return [t.textBgRects.join(""), '\t\t<text xml:space="preserve" ', this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", e ? 'text-decoration="' + e + '" ' : "", 'style="', this.getSvgStyles(!0), '"', this.addPaintOrder(), " >", t.textSpans.join(""), "</text>\n"] },
            _getSVGTextAndBg: function(t, e) {
                var i, r = [],
                    n = [],
                    s = t;
                this._setSVGBg(n);
                for (var o = 0, a = this._textLines.length; o < a; o++) i = this._getLineLeftOffset(o), (this.textBackgroundColor || this.styleHas("textBackgroundColor", o)) && this._setSVGTextLineBg(n, o, e + i, s), this._setSVGTextLineText(r, o, e + i, s), s += this.getHeightOfLine(o);
                return { textSpans: r, textBgRects: n }
            },
            _createTextCharSpan: function(t, e, i, r) {
                var n = t !== t.trim() || t.match(u),
                    s = this.getSvgSpanStyles(e, n),
                    o = s ? 'style="' + s + '"' : "",
                    a = e.deltaY,
                    c = "",
                    h = fabric.Object.NUM_FRACTION_DIGITS;
                return a && (c = ' dy="' + l(a, h) + '" '), ['<tspan x="', l(i, h), '" y="', l(r, h), '" ', c, o, ">", fabric.util.string.escapeXml(t), "</tspan>"].join("")
            },
            _setSVGTextLineText: function(t, e, i, r) {
                var n, s, o, a, c, h = this.getHeightOfLine(e),
                    l = -1 !== this.textAlign.indexOf("justify"),
                    u = "",
                    f = 0,
                    d = this._textLines[e];
                r += h * (1 - this._fontSizeFraction) / this.lineHeight;
                for (var g = 0, p = d.length - 1; g <= p; g++) c = g === p || this.charSpacing, u += d[g], o = this.__charBounds[e][g], 0 === f ? (i += o.kernedWidth - o.width, f += o.width) : f += o.kernedWidth, l && !c && this._reSpaceAndTab.test(d[g]) && (c = !0), c || (n = n || this.getCompleteStyleDeclaration(e, g), s = this.getCompleteStyleDeclaration(e, g + 1), c = this._hasStyleChangedForSvg(n, s)), c && (a = this._getStyleDeclaration(e, g) || {}, t.push(this._createTextCharSpan(u, a, i, r)), u = "", n = s, i += f, f = 0)
            },
            _pushTextBgRect: function(t, e, i, r, n, s) {
                var o = fabric.Object.NUM_FRACTION_DIGITS;
                t.push("\t\t<rect ", this._getFillAttributes(e), ' x="', l(i, o), '" y="', l(r, o), '" width="', l(n, o), '" height="', l(s, o), '"></rect>\n')
            },
            _setSVGTextLineBg: function(t, e, i, r) {
                for (var n, s, o = this._textLines[e], a = this.getHeightOfLine(e) / this.lineHeight, c = 0, h = 0, l = this.getValueOfPropertyAt(e, 0, "textBackgroundColor"), u = 0, f = o.length; u < f; u++) n = this.__charBounds[e][u], (s = this.getValueOfPropertyAt(e, u, "textBackgroundColor")) !== l ? (l && this._pushTextBgRect(t, l, i + h, r, c, a), h = n.left, c = n.width, l = s) : c += n.kernedWidth;
                s && this._pushTextBgRect(t, s, i + h, r, c, a)
            },
            _getFillAttributes: function(t) { var e = t && "string" == typeof t ? new fabric.Color(t) : ""; return e && e.getSource() && 1 !== e.getAlpha() ? 'opacity="' + e.getAlpha() + '" fill="' + e.setAlpha(1).toRgb() + '"' : 'fill="' + t + '"' },
            _getSVGLineTopOffset: function(t) { for (var e, i = 0, r = 0; r < t; r++) i += this.getHeightOfLine(r); return e = this.getHeightOfLine(r), { lineTop: i, offset: (this._fontSizeMult - this._fontSizeFraction) * e / (this.lineHeight * this._fontSizeMult) } },
            getSvgStyles: function(t) { return fabric.Object.prototype.getSvgStyles.call(this, t) + " white-space: pre;" }
        })
    }(),
    function(t) {
        "use strict";
        var v = t.fabric || (t.fabric = {});
        v.Textbox = v.util.createClass(v.IText, v.Observable, {
            type: "textbox",
            minWidth: 20,
            dynamicMinWidth: 2,
            __cachedLines: null,
            lockScalingFlip: !0,
            noScaleCache: !1,
            _dimensionAffectingProps: v.Text.prototype._dimensionAffectingProps.concat("width"),
            initDimensions: function() { this.__skipDimension || (this.isEditing && this.initDelayedCursor(), this.clearContextTop(), this._clearCache(), this.dynamicMinWidth = 0, this._styleMap = this._generateStyleMap(this._splitText()), this.dynamicMinWidth > this.width && this._set("width", this.dynamicMinWidth), -1 !== this.textAlign.indexOf("justify") && this.enlargeSpaces(), this.height = this.calcTextHeight(), this.saveState({ propertySet: "_dimensionAffectingProps" })) },
            _generateStyleMap: function(t) { for (var e = 0, i = 0, r = 0, n = {}, s = 0; s < t.graphemeLines.length; s++) "\n" === t.graphemeText[r] && 0 < s ? (i = 0, r++, e++) : this._reSpaceAndTab.test(t.graphemeText[r]) && 0 < s && (i++, r++), n[s] = { line: e, offset: i }, r += t.graphemeLines[s].length, i += t.graphemeLines[s].length; return n },
            styleHas: function(t, e) {
                if (this._styleMap && !this.isWrapping) {
                    var i = this._styleMap[e];
                    i && (e = i.line)
                }
                return v.Text.prototype.styleHas.call(this, t, e)
            },
            isEmptyStyles: function(t) {
                var e, i, r = 0,
                    n = !1,
                    s = this._styleMap[t],
                    o = this._styleMap[t + 1];
                for (var a in s && (t = s.line, r = s.offset), o && (n = o.line === t, e = o.offset), i = void 0 === t ? this.styles : { line: this.styles[t] })
                    for (var c in i[a])
                        if (r <= c && (!n || c < e))
                            for (var h in i[a][c]) return !1;
                return !0
            },
            _getStyleDeclaration: function(t, e) {
                if (this._styleMap && !this.isWrapping) {
                    var i = this._styleMap[t];
                    if (!i) return null;
                    t = i.line, e = i.offset + e
                }
                return this.callSuper("_getStyleDeclaration", t, e)
            },
            _setStyleDeclaration: function(t, e, i) {
                var r = this._styleMap[t];
                t = r.line, e = r.offset + e, this.styles[t][e] = i
            },
            _deleteStyleDeclaration: function(t, e) {
                var i = this._styleMap[t];
                t = i.line, e = i.offset + e, delete this.styles[t][e]
            },
            _getLineStyle: function(t) { var e = this._styleMap[t]; return this.styles[e.line] },
            _setLineStyle: function(t, e) {
                var i = this._styleMap[t];
                this.styles[i.line] = e
            },
            _deleteLineStyle: function(t) {
                var e = this._styleMap[t];
                delete this.styles[e.line]
            },
            _wrapText: function(t, e) { var i, r = []; for (this.isWrapping = !0, i = 0; i < t.length; i++) r = r.concat(this._wrapLine(t[i], i, e)); return this.isWrapping = !1, r },
            _measureWord: function(t, e, i) {
                var r, n = 0;
                i = i || 0;
                for (var s = 0, o = t.length; s < o; s++) { n += this._getGraphemeBox(t[s], e, s + i, r, !0).kernedWidth, r = t[s] }
                return n
            },
            _wrapLine: function(t, e, i, r) {
                var n = 0,
                    s = [],
                    o = [],
                    a = t.split(this._reSpaceAndTab),
                    c = "",
                    h = 0,
                    l = 0,
                    u = 0,
                    f = 0,
                    d = !0,
                    g = this._getWidthOfCharSpacing();
                i -= r = r || 0;
                for (var p = 0; p < a.length; p++) c = v.util.string.graphemeSplit(a[p]), l = this._measureWord(c, e, h), h += c.length, i <= (n += u + l - g) && !d ? (s.push(o), o = [], n = l, d = !0) : n += g, d || o.push(" "), o = o.concat(c), u = this._measureWord([" "], e, h), h++, d = !1, f < l && (f = l);
                return p && s.push(o), f + r > this.dynamicMinWidth && (this.dynamicMinWidth = f - g + r), s
            },
            isEndOfWrapping: function(t) { return !this._styleMap[t + 1] || this._styleMap[t + 1].line !== this._styleMap[t].line },
            _splitTextIntoLines: function(t) { for (var e = v.Text.prototype._splitTextIntoLines.call(this, t), i = this._wrapText(e.lines, this.width), r = new Array(i.length), n = 0; n < i.length; n++) r[n] = i[n].join(""); return e.lines = r, e.graphemeLines = i, e },
            getMinWidth: function() { return Math.max(this.minWidth, this.dynamicMinWidth) },
            toObject: function(t) { return this.callSuper("toObject", ["minWidth"].concat(t)) }
        }), v.Textbox.fromObject = function(t, e) { return v.Object._fromObject("Textbox", t, e, "text") }
    }("undefined" != typeof exports ? exports : this),
    function() {
        var l = fabric.Canvas.prototype._setObjectScale;
        fabric.Canvas.prototype._setObjectScale = function(t, e, i, r, n, s, o) {
            var a = e.target;
            if (!("x" === n && a instanceof fabric.Textbox)) return l.call(fabric.Canvas.prototype, t, e, i, r, n, s, o);
            var c = a._getTransformedDimensions().x,
                h = a.width * (t.x / c);
            return h >= a.getMinWidth() ? (a.set("width", h), !0) : void 0
        }, fabric.util.object.extend(fabric.Textbox.prototype, { _removeExtraneousStyles: function() { for (var t in this._styleMap) this._textLines[t] || delete this.styles[this._styleMap[t].line] } })
    }();