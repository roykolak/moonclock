"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/rpi-led-matrix/dist/layout-utils.js
var require_layout_utils = __commonJS({
  "node_modules/rpi-led-matrix/dist/layout-utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LayoutUtils = exports2.VerticalAlignment = exports2.HorizontalAlignment = void 0;
    var isSeparator = ({ char }) => char === " ";
    var glphysToWords = (glphys) => {
      const index = glphys.map((g, i) => i === 0 && isSeparator(g) ? null : g.char).indexOf(" ");
      return index > 0 ? [glphys.slice(0, index), ...glphysToWords(glphys.slice(index))] : [glphys];
    };
    var calcWordWidth = (gs) => gs.reduce((sum, { w }) => sum + w, 0);
    var wordsToLines = (maxWidth, words) => {
      const lines = [];
      let tmpLine = [];
      let tmpLineWidth = 0;
      words.filter(({ length }) => length > 0).forEach((word) => {
        const wordWidth = calcWordWidth(word);
        if (tmpLineWidth + wordWidth > maxWidth) {
          lines.push(tmpLine);
          const firstWord = word.filter((g) => !isSeparator(g));
          tmpLine = [firstWord];
          tmpLineWidth = calcWordWidth(firstWord);
        } else {
          tmpLine.push(word);
          tmpLineWidth += wordWidth;
        }
      });
      if (tmpLine.length > 0)
        lines.push(tmpLine);
      return lines;
    };
    var HorizontalAlignment;
    (function(HorizontalAlignment2) {
      HorizontalAlignment2["Left"] = "left";
      HorizontalAlignment2["Center"] = "center";
      HorizontalAlignment2["Right"] = "right";
    })(HorizontalAlignment = exports2.HorizontalAlignment || (exports2.HorizontalAlignment = {}));
    var VerticalAlignment;
    (function(VerticalAlignment2) {
      VerticalAlignment2["Bottom"] = "bottom";
      VerticalAlignment2["Middle"] = "middle";
      VerticalAlignment2["Top"] = "top";
    })(VerticalAlignment = exports2.VerticalAlignment || (exports2.VerticalAlignment = {}));
    var LayoutUtils = class {
      static textToLines(font, maxW, text2) {
        const fontHeight = font.height();
        const glphys = text2.split("").map((char) => ({
          char,
          h: fontHeight,
          w: font.stringWidth(char)
        }));
        return wordsToLines(maxW, glphysToWords(glphys));
      }
      static linesToMappedGlyphs(lines, lineH, containerW, containerH, alignH = HorizontalAlignment.Center, alignV = VerticalAlignment.Middle) {
        const blockH = lineH * lines.length;
        const offsetY = (() => {
          switch (alignV) {
            case VerticalAlignment.Top:
              return 0;
            case VerticalAlignment.Middle:
              return Math.floor((containerH - blockH) / 2);
            case VerticalAlignment.Bottom:
              return containerH - blockH;
          }
        })();
        return lines.map((words, i) => {
          const lineGlyphs = words.reduce((glyphs, word) => [...glyphs, ...word], []);
          const lineW = calcWordWidth(lineGlyphs);
          let offsetX = (() => {
            switch (alignH) {
              case HorizontalAlignment.Left:
                return 0;
              case HorizontalAlignment.Center:
                return Math.floor((containerW - lineW) / 2);
              case HorizontalAlignment.Right:
                return containerW - lineW;
            }
          })();
          return lineGlyphs.map((glyph) => {
            const mapped = {
              ...glyph,
              x: offsetX,
              y: offsetY + i * lineH
            };
            offsetX += glyph.w;
            return mapped;
          });
        }).reduce((glyphs, words) => [...glyphs, ...words], []);
      }
    };
    exports2.LayoutUtils = LayoutUtils;
  }
});

// node_modules/rpi-led-matrix/dist/types.js
var require_types = __commonJS({
  "node_modules/rpi-led-matrix/dist/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GpioMapping = exports2.RowAddressType = exports2.RuntimeFlag = exports2.PixelMapperType = exports2.MuxType = exports2.ScanMode = void 0;
    var ScanMode;
    (function(ScanMode2) {
      ScanMode2[ScanMode2["Progressive"] = 0] = "Progressive";
      ScanMode2[ScanMode2["Interlaced"] = 1] = "Interlaced";
    })(ScanMode = exports2.ScanMode || (exports2.ScanMode = {}));
    var MuxType;
    (function(MuxType2) {
      MuxType2[MuxType2["Direct"] = 0] = "Direct";
      MuxType2[MuxType2["Stripe"] = 1] = "Stripe";
      MuxType2[MuxType2["Checker"] = 2] = "Checker";
      MuxType2[MuxType2["Spiral"] = 3] = "Spiral";
      MuxType2[MuxType2["ZStripe"] = 4] = "ZStripe";
      MuxType2[MuxType2["ZnMirrorZStripe"] = 5] = "ZnMirrorZStripe";
      MuxType2[MuxType2["Coreman"] = 6] = "Coreman";
      MuxType2[MuxType2["Kaler2Scan"] = 7] = "Kaler2Scan";
      MuxType2[MuxType2["ZStripeUneven"] = 8] = "ZStripeUneven";
      MuxType2[MuxType2["P10128x4Z"] = 9] = "P10128x4Z";
      MuxType2[MuxType2["QiangLiQ8"] = 10] = "QiangLiQ8";
      MuxType2[MuxType2["InversedZStripe"] = 11] = "InversedZStripe";
      MuxType2[MuxType2["P10Outdoor1R1G1BMultiplexMapper1"] = 12] = "P10Outdoor1R1G1BMultiplexMapper1";
      MuxType2[MuxType2["P10Outdoor1R1G1BMultiplexMapper2"] = 13] = "P10Outdoor1R1G1BMultiplexMapper2";
      MuxType2[MuxType2["P10Outdoor1R1G1BMultiplexMapper3"] = 14] = "P10Outdoor1R1G1BMultiplexMapper3";
      MuxType2[MuxType2["P10CoremanMapper"] = 15] = "P10CoremanMapper";
      MuxType2[MuxType2["P8Outdoor1R1G1BMultiplexMapper"] = 16] = "P8Outdoor1R1G1BMultiplexMapper";
      MuxType2[MuxType2["FlippedStripeMultiplexMapper"] = 17] = "FlippedStripeMultiplexMapper";
      MuxType2[MuxType2["P10Outdoor32x16HalfScanMapper"] = 18] = "P10Outdoor32x16HalfScanMapper";
    })(MuxType = exports2.MuxType || (exports2.MuxType = {}));
    var PixelMapperType;
    (function(PixelMapperType2) {
      PixelMapperType2["Chainlink"] = "Chainlink";
      PixelMapperType2["U"] = "U-mapper";
      PixelMapperType2["Rotate"] = "Rotate";
      PixelMapperType2["V"] = "V-mapper";
      PixelMapperType2["VZ"] = "V-mapper:Z";
    })(PixelMapperType = exports2.PixelMapperType || (exports2.PixelMapperType = {}));
    var RuntimeFlag;
    (function(RuntimeFlag2) {
      RuntimeFlag2[RuntimeFlag2["Disabled"] = -1] = "Disabled";
      RuntimeFlag2[RuntimeFlag2["Off"] = 0] = "Off";
      RuntimeFlag2[RuntimeFlag2["On"] = 1] = "On";
    })(RuntimeFlag = exports2.RuntimeFlag || (exports2.RuntimeFlag = {}));
    var RowAddressType;
    (function(RowAddressType2) {
      RowAddressType2[RowAddressType2["Direct"] = 0] = "Direct";
      RowAddressType2[RowAddressType2["AB"] = 1] = "AB";
      RowAddressType2[RowAddressType2["DirectRow"] = 2] = "DirectRow";
      RowAddressType2[RowAddressType2["ABC"] = 3] = "ABC";
      RowAddressType2[RowAddressType2["ABCShift"] = 4] = "ABCShift";
    })(RowAddressType = exports2.RowAddressType || (exports2.RowAddressType = {}));
    var GpioMapping2;
    (function(GpioMapping3) {
      GpioMapping3["Regular"] = "regular";
      GpioMapping3["AdafruitHat"] = "adafruit-hat";
      GpioMapping3["AdafruitHatPwm"] = "adafruit-hat-pwm";
      GpioMapping3["RegularPi1"] = "regular-pi1";
      GpioMapping3["Classic"] = "classic";
      GpioMapping3["ClassicPi1"] = "classic-pi1";
    })(GpioMapping2 = exports2.GpioMapping || (exports2.GpioMapping = {}));
  }
});

// node_modules/rpi-led-matrix/dist/utils.js
var require_utils = __commonJS({
  "node_modules/rpi-led-matrix/dist/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LedMatrixUtils = void 0;
    var types_1 = require_types();
    var LedMatrixUtils = class {
      static encodeMappers(...mappers) {
        return mappers.map((mapper) => {
          switch (mapper.type) {
            case types_1.PixelMapperType.Chainlink:
              return types_1.PixelMapperType.Chainlink;
            case types_1.PixelMapperType.Rotate:
              return [types_1.PixelMapperType.Rotate, mapper.angle].join(":");
            case types_1.PixelMapperType.U:
              return types_1.PixelMapperType.U;
            case types_1.PixelMapperType.V:
              return types_1.PixelMapperType.V;
            case types_1.PixelMapperType.VZ:
              return types_1.PixelMapperType.VZ;
          }
        }).join(";");
      }
    };
    exports2.LedMatrixUtils = LedMatrixUtils;
  }
});

// node_modules/file-uri-to-path/index.js
var require_file_uri_to_path = __commonJS({
  "node_modules/file-uri-to-path/index.js"(exports2, module2) {
    var sep = require("path").sep || "/";
    module2.exports = fileUriToPath;
    function fileUriToPath(uri) {
      if ("string" != typeof uri || uri.length <= 7 || "file://" != uri.substring(0, 7)) {
        throw new TypeError("must pass in a file:// URI to convert to a file path");
      }
      var rest = decodeURI(uri.substring(7));
      var firstSlash = rest.indexOf("/");
      var host = rest.substring(0, firstSlash);
      var path = rest.substring(firstSlash + 1);
      if ("localhost" == host) host = "";
      if (host) {
        host = sep + sep + host;
      }
      path = path.replace(/^(.+)\|/, "$1:");
      if (sep == "\\") {
        path = path.replace(/\//g, "\\");
      }
      if (/^.+\:/.test(path)) {
      } else {
        path = sep + path;
      }
      return host + path;
    }
  }
});

// node_modules/bindings/bindings.js
var require_bindings = __commonJS({
  "node_modules/bindings/bindings.js"(exports2, module2) {
    var fs4 = require("fs");
    var path = require("path");
    var fileURLToPath = require_file_uri_to_path();
    var join = path.join;
    var dirname = path.dirname;
    var exists = fs4.accessSync && function(path2) {
      try {
        fs4.accessSync(path2);
      } catch (e) {
        return false;
      }
      return true;
    } || fs4.existsSync || path.existsSync;
    var defaults = {
      arrow: process.env.NODE_BINDINGS_ARROW || " \u2192 ",
      compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
      platform: process.platform,
      arch: process.arch,
      nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
      version: process.versions.node,
      bindings: "bindings.node",
      try: [
        // node-gyp's linked version in the "build" dir
        ["module_root", "build", "bindings"],
        // node-waf and gyp_addon (a.k.a node-gyp)
        ["module_root", "build", "Debug", "bindings"],
        ["module_root", "build", "Release", "bindings"],
        // Debug files, for development (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Debug", "bindings"],
        ["module_root", "Debug", "bindings"],
        // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Release", "bindings"],
        ["module_root", "Release", "bindings"],
        // Legacy from node-waf, node <= 0.4.x
        ["module_root", "build", "default", "bindings"],
        // Production "Release" buildtype binary (meh...)
        ["module_root", "compiled", "version", "platform", "arch", "bindings"],
        // node-qbs builds
        ["module_root", "addon-build", "release", "install-root", "bindings"],
        ["module_root", "addon-build", "debug", "install-root", "bindings"],
        ["module_root", "addon-build", "default", "install-root", "bindings"],
        // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
        ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
      ]
    };
    function bindings(opts) {
      if (typeof opts == "string") {
        opts = { bindings: opts };
      } else if (!opts) {
        opts = {};
      }
      Object.keys(defaults).map(function(i2) {
        if (!(i2 in opts)) opts[i2] = defaults[i2];
      });
      if (!opts.module_root) {
        opts.module_root = exports2.getRoot(exports2.getFileName());
      }
      if (path.extname(opts.bindings) != ".node") {
        opts.bindings += ".node";
      }
      var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
      var tries = [], i = 0, l = opts.try.length, n, b, err;
      for (; i < l; i++) {
        n = join.apply(
          null,
          opts.try[i].map(function(p) {
            return opts[p] || p;
          })
        );
        tries.push(n);
        try {
          b = opts.path ? requireFunc.resolve(n) : requireFunc(n);
          if (!opts.path) {
            b.path = n;
          }
          return b;
        } catch (e) {
          if (e.code !== "MODULE_NOT_FOUND" && e.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(e.message)) {
            throw e;
          }
        }
      }
      err = new Error(
        "Could not locate the bindings file. Tried:\n" + tries.map(function(a) {
          return opts.arrow + a;
        }).join("\n")
      );
      err.tries = tries;
      throw err;
    }
    module2.exports = exports2 = bindings;
    exports2.getFileName = function getFileName(calling_file) {
      var origPST = Error.prepareStackTrace, origSTL = Error.stackTraceLimit, dummy = {}, fileName;
      Error.stackTraceLimit = 10;
      Error.prepareStackTrace = function(e, st) {
        for (var i = 0, l = st.length; i < l; i++) {
          fileName = st[i].getFileName();
          if (fileName !== __filename) {
            if (calling_file) {
              if (fileName !== calling_file) {
                return;
              }
            } else {
              return;
            }
          }
        }
      };
      Error.captureStackTrace(dummy);
      dummy.stack;
      Error.prepareStackTrace = origPST;
      Error.stackTraceLimit = origSTL;
      var fileSchema = "file://";
      if (fileName.indexOf(fileSchema) === 0) {
        fileName = fileURLToPath(fileName);
      }
      return fileName;
    };
    exports2.getRoot = function getRoot(file) {
      var dir = dirname(file), prev;
      while (true) {
        if (dir === ".") {
          dir = process.cwd();
        }
        if (exists(join(dir, "package.json")) || exists(join(dir, "node_modules"))) {
          return dir;
        }
        if (prev === dir) {
          throw new Error(
            'Could not find module root given file: "' + file + '". Do you have a `package.json` file? '
          );
        }
        prev = dir;
        dir = join(dir, "..");
      }
    };
  }
});

// node_modules/rpi-led-matrix/dist/index.js
var require_dist = __commonJS({
  "node_modules/rpi-led-matrix/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LedMatrix = exports2.isSupported = exports2.Font = void 0;
    __exportStar(require_layout_utils(), exports2);
    __exportStar(require_types(), exports2);
    __exportStar(require_utils(), exports2);
    var bindings = require_bindings();
    var { Font, isSupported, LedMatrix: LedMatrix2 } = bindings("rpi-led-matrix");
    exports2.Font = Font;
    exports2.isSupported = isSupported;
    exports2.LedMatrix = LedMatrix2;
  }
});

// node_modules/canvas/lib/bindings.js
var require_bindings2 = __commonJS({
  "node_modules/canvas/lib/bindings.js"(exports2, module2) {
    "use strict";
    var bindings = require("./canvas.node");
    module2.exports = bindings;
    bindings.ImageData.prototype.toString = function() {
      return "[object ImageData]";
    };
    bindings.CanvasGradient.prototype.toString = function() {
      return "[object CanvasGradient]";
    };
  }
});

// node_modules/canvas/lib/parse-font.js
var require_parse_font = __commonJS({
  "node_modules/canvas/lib/parse-font.js"(exports2, module2) {
    "use strict";
    var weights = "bold|bolder|lighter|[1-9]00";
    var styles = "italic|oblique";
    var variants = "small-caps";
    var stretches = "ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded";
    var units = "px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q";
    var string = `'([^']+)'|"([^"]+)"|[\\w\\s-]+`;
    var weightRe = new RegExp(`(${weights}) +`, "i");
    var styleRe = new RegExp(`(${styles}) +`, "i");
    var variantRe = new RegExp(`(${variants}) +`, "i");
    var stretchRe = new RegExp(`(${stretches}) +`, "i");
    var sizeFamilyRe = new RegExp(
      `([\\d\\.]+)(${units}) *((?:${string})( *, *(?:${string}))*)`
    );
    var cache = {};
    var defaultHeight = 16;
    module2.exports = (str) => {
      if (cache[str]) return cache[str];
      const sizeFamily = sizeFamilyRe.exec(str);
      if (!sizeFamily) return;
      const font = {
        weight: "normal",
        style: "normal",
        stretch: "normal",
        variant: "normal",
        size: parseFloat(sizeFamily[1]),
        unit: sizeFamily[2],
        family: sizeFamily[3].replace(/["']/g, "").replace(/ *, */g, ",")
      };
      let weight, style, variant, stretch;
      const substr = str.substring(0, sizeFamily.index);
      if (weight = weightRe.exec(substr)) font.weight = weight[1];
      if (style = styleRe.exec(substr)) font.style = style[1];
      if (variant = variantRe.exec(substr)) font.variant = variant[1];
      if (stretch = stretchRe.exec(substr)) font.stretch = stretch[1];
      switch (font.unit) {
        case "pt":
          font.size /= 0.75;
          break;
        case "pc":
          font.size *= 16;
          break;
        case "in":
          font.size *= 96;
          break;
        case "cm":
          font.size *= 96 / 2.54;
          break;
        case "mm":
          font.size *= 96 / 25.4;
          break;
        case "%":
          break;
        case "em":
        case "rem":
          font.size *= defaultHeight / 0.75;
          break;
        case "q":
          font.size *= 96 / 25.4 / 4;
          break;
      }
      return cache[str] = font;
    };
  }
});

// node_modules/canvas/lib/DOMMatrix.js
var require_DOMMatrix = __commonJS({
  "node_modules/canvas/lib/DOMMatrix.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var DOMPoint = class {
      constructor(x, y, z, w) {
        if (typeof x === "object" && x !== null) {
          w = x.w;
          z = x.z;
          y = x.y;
          x = x.x;
        }
        this.x = typeof x === "number" ? x : 0;
        this.y = typeof y === "number" ? y : 0;
        this.z = typeof z === "number" ? z : 0;
        this.w = typeof w === "number" ? w : 1;
      }
    };
    var M11 = 0;
    var M12 = 1;
    var M13 = 2;
    var M14 = 3;
    var M21 = 4;
    var M22 = 5;
    var M23 = 6;
    var M24 = 7;
    var M31 = 8;
    var M32 = 9;
    var M33 = 10;
    var M34 = 11;
    var M41 = 12;
    var M42 = 13;
    var M43 = 14;
    var M44 = 15;
    var DEGREE_PER_RAD = 180 / Math.PI;
    var RAD_PER_DEGREE = Math.PI / 180;
    function parseMatrix(init) {
      let parsed = init.replace("matrix(", "");
      parsed = parsed.split(",", 7);
      if (parsed.length !== 6) throw new Error(`Failed to parse ${init}`);
      parsed = parsed.map(parseFloat);
      return [
        parsed[0],
        parsed[1],
        0,
        0,
        parsed[2],
        parsed[3],
        0,
        0,
        0,
        0,
        1,
        0,
        parsed[4],
        parsed[5],
        0,
        1
      ];
    }
    function parseMatrix3d(init) {
      let parsed = init.replace("matrix3d(", "");
      parsed = parsed.split(",", 17);
      if (parsed.length !== 16) throw new Error(`Failed to parse ${init}`);
      return parsed.map(parseFloat);
    }
    function parseTransform(tform) {
      const type = tform.split("(", 1)[0];
      switch (type) {
        case "matrix":
          return parseMatrix(tform);
        case "matrix3d":
          return parseMatrix3d(tform);
        // TODO This is supposed to support any CSS transform value.
        default:
          throw new Error(`${type} parsing not implemented`);
      }
    }
    var DOMMatrix = class _DOMMatrix {
      constructor(init) {
        this._is2D = true;
        this._values = new Float64Array([
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ]);
        let i;
        if (typeof init === "string") {
          if (init === "") return;
          const tforms = init.split(/\)\s+/, 20).map(parseTransform);
          if (tforms.length === 0) return;
          init = tforms[0];
          for (i = 1; i < tforms.length; i++) init = multiply(tforms[i], init);
        }
        i = 0;
        if (init && init.length === 6) {
          setNumber2D(this, M11, init[i++]);
          setNumber2D(this, M12, init[i++]);
          setNumber2D(this, M21, init[i++]);
          setNumber2D(this, M22, init[i++]);
          setNumber2D(this, M41, init[i++]);
          setNumber2D(this, M42, init[i++]);
        } else if (init && init.length === 16) {
          setNumber2D(this, M11, init[i++]);
          setNumber2D(this, M12, init[i++]);
          setNumber3D(this, M13, init[i++]);
          setNumber3D(this, M14, init[i++]);
          setNumber2D(this, M21, init[i++]);
          setNumber2D(this, M22, init[i++]);
          setNumber3D(this, M23, init[i++]);
          setNumber3D(this, M24, init[i++]);
          setNumber3D(this, M31, init[i++]);
          setNumber3D(this, M32, init[i++]);
          setNumber3D(this, M33, init[i++]);
          setNumber3D(this, M34, init[i++]);
          setNumber2D(this, M41, init[i++]);
          setNumber2D(this, M42, init[i++]);
          setNumber3D(this, M43, init[i++]);
          setNumber3D(this, M44, init[i]);
        } else if (init !== void 0) {
          throw new TypeError("Expected string or array.");
        }
      }
      toString() {
        return this.is2D ? `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})` : `matrix3d(${this._values.join(", ")})`;
      }
      multiply(other) {
        return newInstance(this._values).multiplySelf(other);
      }
      multiplySelf(other) {
        this._values = multiply(other._values, this._values);
        if (!other.is2D) this._is2D = false;
        return this;
      }
      preMultiplySelf(other) {
        this._values = multiply(this._values, other._values);
        if (!other.is2D) this._is2D = false;
        return this;
      }
      translate(tx, ty, tz) {
        return newInstance(this._values).translateSelf(tx, ty, tz);
      }
      translateSelf(tx, ty, tz) {
        if (typeof tx !== "number") tx = 0;
        if (typeof ty !== "number") ty = 0;
        if (typeof tz !== "number") tz = 0;
        this._values = multiply([
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          tx,
          ty,
          tz,
          1
        ], this._values);
        if (tz !== 0) this._is2D = false;
        return this;
      }
      scale(scaleX, scaleY, scaleZ, originX, originY, originZ) {
        return newInstance(this._values).scaleSelf(scaleX, scaleY, scaleZ, originX, originY, originZ);
      }
      scale3d(scale, originX, originY, originZ) {
        return newInstance(this._values).scale3dSelf(scale, originX, originY, originZ);
      }
      scale3dSelf(scale, originX, originY, originZ) {
        return this.scaleSelf(scale, scale, scale, originX, originY, originZ);
      }
      scaleSelf(scaleX, scaleY, scaleZ, originX, originY, originZ) {
        if (typeof originX !== "number") originX = 0;
        if (typeof originY !== "number") originY = 0;
        if (typeof originZ !== "number") originZ = 0;
        this.translateSelf(originX, originY, originZ);
        if (typeof scaleX !== "number") scaleX = 1;
        if (typeof scaleY !== "number") scaleY = scaleX;
        if (typeof scaleZ !== "number") scaleZ = 1;
        this._values = multiply([
          scaleX,
          0,
          0,
          0,
          0,
          scaleY,
          0,
          0,
          0,
          0,
          scaleZ,
          0,
          0,
          0,
          0,
          1
        ], this._values);
        this.translateSelf(-originX, -originY, -originZ);
        if (scaleZ !== 1 || originZ !== 0) this._is2D = false;
        return this;
      }
      rotateFromVector(x, y) {
        return newInstance(this._values).rotateFromVectorSelf(x, y);
      }
      rotateFromVectorSelf(x, y) {
        if (typeof x !== "number") x = 0;
        if (typeof y !== "number") y = 0;
        const theta = x === 0 && y === 0 ? 0 : Math.atan2(y, x) * DEGREE_PER_RAD;
        return this.rotateSelf(theta);
      }
      rotate(rotX, rotY, rotZ) {
        return newInstance(this._values).rotateSelf(rotX, rotY, rotZ);
      }
      rotateSelf(rotX, rotY, rotZ) {
        if (rotY === void 0 && rotZ === void 0) {
          rotZ = rotX;
          rotX = rotY = 0;
        }
        if (typeof rotY !== "number") rotY = 0;
        if (typeof rotZ !== "number") rotZ = 0;
        if (rotX !== 0 || rotY !== 0) this._is2D = false;
        rotX *= RAD_PER_DEGREE;
        rotY *= RAD_PER_DEGREE;
        rotZ *= RAD_PER_DEGREE;
        let c, s;
        c = Math.cos(rotZ);
        s = Math.sin(rotZ);
        this._values = multiply([
          c,
          s,
          0,
          0,
          -s,
          c,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ], this._values);
        c = Math.cos(rotY);
        s = Math.sin(rotY);
        this._values = multiply([
          c,
          0,
          -s,
          0,
          0,
          1,
          0,
          0,
          s,
          0,
          c,
          0,
          0,
          0,
          0,
          1
        ], this._values);
        c = Math.cos(rotX);
        s = Math.sin(rotX);
        this._values = multiply([
          1,
          0,
          0,
          0,
          0,
          c,
          s,
          0,
          0,
          -s,
          c,
          0,
          0,
          0,
          0,
          1
        ], this._values);
        return this;
      }
      rotateAxisAngle(x, y, z, angle) {
        return newInstance(this._values).rotateAxisAngleSelf(x, y, z, angle);
      }
      rotateAxisAngleSelf(x, y, z, angle) {
        if (typeof x !== "number") x = 0;
        if (typeof y !== "number") y = 0;
        if (typeof z !== "number") z = 0;
        const length = Math.sqrt(x * x + y * y + z * z);
        if (length === 0) return this;
        if (length !== 1) {
          x /= length;
          y /= length;
          z /= length;
        }
        angle *= RAD_PER_DEGREE;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const t = 1 - c;
        const tx = t * x;
        const ty = t * y;
        this._values = multiply([
          tx * x + c,
          tx * y + s * z,
          tx * z - s * y,
          0,
          tx * y - s * z,
          ty * y + c,
          ty * z + s * x,
          0,
          tx * z + s * y,
          ty * z - s * x,
          t * z * z + c,
          0,
          0,
          0,
          0,
          1
        ], this._values);
        if (x !== 0 || y !== 0) this._is2D = false;
        return this;
      }
      skewX(sx) {
        return newInstance(this._values).skewXSelf(sx);
      }
      skewXSelf(sx) {
        if (typeof sx !== "number") return this;
        const t = Math.tan(sx * RAD_PER_DEGREE);
        this._values = multiply([
          1,
          0,
          0,
          0,
          t,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ], this._values);
        return this;
      }
      skewY(sy) {
        return newInstance(this._values).skewYSelf(sy);
      }
      skewYSelf(sy) {
        if (typeof sy !== "number") return this;
        const t = Math.tan(sy * RAD_PER_DEGREE);
        this._values = multiply([
          1,
          t,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ], this._values);
        return this;
      }
      flipX() {
        return newInstance(multiply([
          -1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ], this._values));
      }
      flipY() {
        return newInstance(multiply([
          1,
          0,
          0,
          0,
          0,
          -1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1
        ], this._values));
      }
      inverse() {
        return newInstance(this._values).invertSelf();
      }
      invertSelf() {
        const m = this._values;
        const inv = m.map((v) => 0);
        inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
        inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
        inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
        inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
        const det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
        if (det === 0) {
          this._values = m.map((v) => NaN);
          this._is2D = false;
          return this;
        }
        inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
        inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
        inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
        inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
        inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
        inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
        inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
        inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
        inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
        inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
        inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
        inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
        inv.forEach((v, i) => {
          inv[i] = v / det;
        });
        this._values = inv;
        return this;
      }
      setMatrixValue(transformList) {
        const temp = new _DOMMatrix(transformList);
        this._values = temp._values;
        this._is2D = temp._is2D;
        return this;
      }
      transformPoint(point) {
        point = new DOMPoint(point);
        const x = point.x;
        const y = point.y;
        const z = point.z;
        const w = point.w;
        const values = this._values;
        const nx = values[M11] * x + values[M21] * y + values[M31] * z + values[M41] * w;
        const ny = values[M12] * x + values[M22] * y + values[M32] * z + values[M42] * w;
        const nz = values[M13] * x + values[M23] * y + values[M33] * z + values[M43] * w;
        const nw = values[M14] * x + values[M24] * y + values[M34] * z + values[M44] * w;
        return new DOMPoint(nx, ny, nz, nw);
      }
      toFloat32Array() {
        return Float32Array.from(this._values);
      }
      toFloat64Array() {
        return this._values.slice(0);
      }
      static fromMatrix(init) {
        if (!(init instanceof _DOMMatrix)) throw new TypeError("Expected DOMMatrix");
        return new _DOMMatrix(init._values);
      }
      static fromFloat32Array(init) {
        if (!(init instanceof Float32Array)) throw new TypeError("Expected Float32Array");
        return new _DOMMatrix(init);
      }
      static fromFloat64Array(init) {
        if (!(init instanceof Float64Array)) throw new TypeError("Expected Float64Array");
        return new _DOMMatrix(init);
      }
      [util.inspect.custom || "inspect"](depth, options) {
        if (depth < 0) return "[DOMMatrix]";
        return `DOMMatrix [
      a: ${this.a}
      b: ${this.b}
      c: ${this.c}
      d: ${this.d}
      e: ${this.e}
      f: ${this.f}
      m11: ${this.m11}
      m12: ${this.m12}
      m13: ${this.m13}
      m14: ${this.m14}
      m21: ${this.m21}
      m22: ${this.m22}
      m23: ${this.m23}
      m23: ${this.m23}
      m31: ${this.m31}
      m32: ${this.m32}
      m33: ${this.m33}
      m34: ${this.m34}
      m41: ${this.m41}
      m42: ${this.m42}
      m43: ${this.m43}
      m44: ${this.m44}
      is2D: ${this.is2D}
      isIdentity: ${this.isIdentity} ]`;
      }
    };
    function setNumber2D(receiver, index, value) {
      if (typeof value !== "number") throw new TypeError("Expected number");
      return receiver._values[index] = value;
    }
    function setNumber3D(receiver, index, value) {
      if (typeof value !== "number") throw new TypeError("Expected number");
      if (index === M33 || index === M44) {
        if (value !== 1) receiver._is2D = false;
      } else if (value !== 0) receiver._is2D = false;
      return receiver._values[index] = value;
    }
    Object.defineProperties(DOMMatrix.prototype, {
      m11: { get() {
        return this._values[M11];
      }, set(v) {
        return setNumber2D(this, M11, v);
      } },
      m12: { get() {
        return this._values[M12];
      }, set(v) {
        return setNumber2D(this, M12, v);
      } },
      m13: { get() {
        return this._values[M13];
      }, set(v) {
        return setNumber3D(this, M13, v);
      } },
      m14: { get() {
        return this._values[M14];
      }, set(v) {
        return setNumber3D(this, M14, v);
      } },
      m21: { get() {
        return this._values[M21];
      }, set(v) {
        return setNumber2D(this, M21, v);
      } },
      m22: { get() {
        return this._values[M22];
      }, set(v) {
        return setNumber2D(this, M22, v);
      } },
      m23: { get() {
        return this._values[M23];
      }, set(v) {
        return setNumber3D(this, M23, v);
      } },
      m24: { get() {
        return this._values[M24];
      }, set(v) {
        return setNumber3D(this, M24, v);
      } },
      m31: { get() {
        return this._values[M31];
      }, set(v) {
        return setNumber3D(this, M31, v);
      } },
      m32: { get() {
        return this._values[M32];
      }, set(v) {
        return setNumber3D(this, M32, v);
      } },
      m33: { get() {
        return this._values[M33];
      }, set(v) {
        return setNumber3D(this, M33, v);
      } },
      m34: { get() {
        return this._values[M34];
      }, set(v) {
        return setNumber3D(this, M34, v);
      } },
      m41: { get() {
        return this._values[M41];
      }, set(v) {
        return setNumber2D(this, M41, v);
      } },
      m42: { get() {
        return this._values[M42];
      }, set(v) {
        return setNumber2D(this, M42, v);
      } },
      m43: { get() {
        return this._values[M43];
      }, set(v) {
        return setNumber3D(this, M43, v);
      } },
      m44: { get() {
        return this._values[M44];
      }, set(v) {
        return setNumber3D(this, M44, v);
      } },
      a: { get() {
        return this.m11;
      }, set(v) {
        return this.m11 = v;
      } },
      b: { get() {
        return this.m12;
      }, set(v) {
        return this.m12 = v;
      } },
      c: { get() {
        return this.m21;
      }, set(v) {
        return this.m21 = v;
      } },
      d: { get() {
        return this.m22;
      }, set(v) {
        return this.m22 = v;
      } },
      e: { get() {
        return this.m41;
      }, set(v) {
        return this.m41 = v;
      } },
      f: { get() {
        return this.m42;
      }, set(v) {
        return this.m42 = v;
      } },
      is2D: { get() {
        return this._is2D;
      } },
      // read-only
      isIdentity: {
        get() {
          const values = this._values;
          return values[M11] === 1 && values[M12] === 0 && values[M13] === 0 && values[M14] === 0 && values[M21] === 0 && values[M22] === 1 && values[M23] === 0 && values[M24] === 0 && values[M31] === 0 && values[M32] === 0 && values[M33] === 1 && values[M34] === 0 && values[M41] === 0 && values[M42] === 0 && values[M43] === 0 && values[M44] === 1;
        }
      }
    });
    function newInstance(values) {
      const instance = Object.create(DOMMatrix.prototype);
      instance.constructor = DOMMatrix;
      instance._is2D = true;
      instance._values = values;
      return instance;
    }
    function multiply(A, B) {
      const dest = new Float64Array(16);
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let sum = 0;
          for (let k = 0; k < 4; k++) {
            sum += A[i * 4 + k] * B[k * 4 + j];
          }
          dest[i * 4 + j] = sum;
        }
      }
      return dest;
    }
    module2.exports = { DOMMatrix, DOMPoint };
  }
});

// node_modules/canvas/lib/context2d.js
var require_context2d = __commonJS({
  "node_modules/canvas/lib/context2d.js"(exports2, module2) {
    "use strict";
    var bindings = require_bindings2();
    var parseFont = require_parse_font();
    var { DOMMatrix } = require_DOMMatrix();
    bindings.CanvasRenderingContext2dInit(DOMMatrix, parseFont);
    module2.exports = bindings.CanvasRenderingContext2d;
  }
});

// node_modules/canvas/lib/pngstream.js
var require_pngstream = __commonJS({
  "node_modules/canvas/lib/pngstream.js"(exports2, module2) {
    "use strict";
    var { Readable } = require("stream");
    function noop() {
    }
    var PNGStream = class extends Readable {
      constructor(canvas, options) {
        super();
        if (options && options.palette instanceof Uint8ClampedArray && options.palette.length % 4 !== 0) {
          throw new Error("Palette length must be a multiple of 4.");
        }
        this.canvas = canvas;
        this.options = options || {};
      }
      _read() {
        this._read = noop;
        this.canvas.streamPNGSync((err, chunk, len) => {
          if (err) {
            this.emit("error", err);
          } else if (len) {
            this.push(chunk);
          } else {
            this.push(null);
          }
        }, this.options);
      }
    };
    module2.exports = PNGStream;
  }
});

// node_modules/canvas/lib/pdfstream.js
var require_pdfstream = __commonJS({
  "node_modules/canvas/lib/pdfstream.js"(exports2, module2) {
    "use strict";
    var { Readable } = require("stream");
    function noop() {
    }
    var PDFStream = class extends Readable {
      constructor(canvas, options) {
        super();
        this.canvas = canvas;
        this.options = options;
      }
      _read() {
        this._read = noop;
        this.canvas.streamPDFSync((err, chunk, len) => {
          if (err) {
            this.emit("error", err);
          } else if (len) {
            this.push(chunk);
          } else {
            this.push(null);
          }
        }, this.options);
      }
    };
    module2.exports = PDFStream;
  }
});

// node_modules/canvas/lib/jpegstream.js
var require_jpegstream = __commonJS({
  "node_modules/canvas/lib/jpegstream.js"(exports2, module2) {
    "use strict";
    var { Readable } = require("stream");
    function noop() {
    }
    var JPEGStream = class extends Readable {
      constructor(canvas, options) {
        super();
        if (canvas.streamJPEGSync === void 0) {
          throw new Error("node-canvas was built without JPEG support.");
        }
        this.options = options;
        this.canvas = canvas;
      }
      _read() {
        this._read = noop;
        this.canvas.streamJPEGSync(this.options, (err, chunk) => {
          if (err) {
            this.emit("error", err);
          } else if (chunk) {
            this.push(chunk);
          } else {
            this.push(null);
          }
        });
      }
    };
    module2.exports = JPEGStream;
  }
});

// node_modules/canvas/lib/canvas.js
var require_canvas = __commonJS({
  "node_modules/canvas/lib/canvas.js"(exports2, module2) {
    "use strict";
    var bindings = require_bindings2();
    var Canvas = module2.exports = bindings.Canvas;
    var Context2d = require_context2d();
    var PNGStream = require_pngstream();
    var PDFStream = require_pdfstream();
    var JPEGStream = require_jpegstream();
    var FORMATS = ["image/png", "image/jpeg"];
    var util = require("util");
    Canvas.prototype[util.inspect.custom || "inspect"] = function() {
      return `[Canvas ${this.width}x${this.height}]`;
    };
    Canvas.prototype.getContext = function(contextType, contextAttributes) {
      if (contextType == "2d") {
        const ctx = this._context2d || (this._context2d = new Context2d(this, contextAttributes));
        this.context = ctx;
        ctx.canvas = this;
        return ctx;
      }
    };
    Canvas.prototype.pngStream = Canvas.prototype.createPNGStream = function(options) {
      return new PNGStream(this, options);
    };
    Canvas.prototype.pdfStream = Canvas.prototype.createPDFStream = function(options) {
      return new PDFStream(this, options);
    };
    Canvas.prototype.jpegStream = Canvas.prototype.createJPEGStream = function(options) {
      return new JPEGStream(this, options);
    };
    Canvas.prototype.toDataURL = function(a1, a2, a3) {
      let type = "image/png";
      let opts = {};
      let fn;
      if (typeof a1 === "function") {
        fn = a1;
      } else {
        if (typeof a1 === "string" && FORMATS.includes(a1.toLowerCase())) {
          type = a1.toLowerCase();
        }
        if (typeof a2 === "function") {
          fn = a2;
        } else {
          if (typeof a2 === "object") {
            opts = a2;
          } else if (typeof a2 === "number") {
            opts = { quality: Math.max(0, Math.min(1, a2)) };
          }
          if (typeof a3 === "function") {
            fn = a3;
          } else if (void 0 !== a3) {
            throw new TypeError(`${typeof a3} is not a function`);
          }
        }
      }
      if (this.width === 0 || this.height === 0) {
        const str = "data:,";
        if (fn) {
          setTimeout(() => fn(null, str));
          return;
        } else {
          return str;
        }
      }
      if (fn) {
        this.toBuffer((err, buf) => {
          if (err) return fn(err);
          fn(null, `data:${type};base64,${buf.toString("base64")}`);
        }, type, opts);
      } else {
        return `data:${type};base64,${this.toBuffer(type, opts).toString("base64")}`;
      }
    };
  }
});

// node_modules/simple-concat/index.js
var require_simple_concat = __commonJS({
  "node_modules/simple-concat/index.js"(exports2, module2) {
    module2.exports = function(stream, cb) {
      var chunks = [];
      stream.on("data", function(chunk) {
        chunks.push(chunk);
      });
      stream.once("end", function() {
        if (cb) cb(null, Buffer.concat(chunks));
        cb = null;
      });
      stream.once("error", function(err) {
        if (cb) cb(err);
        cb = null;
      });
    };
  }
});

// node_modules/mimic-response/index.js
var require_mimic_response = __commonJS({
  "node_modules/mimic-response/index.js"(exports2, module2) {
    "use strict";
    var knownProperties = [
      "aborted",
      "complete",
      "destroy",
      "headers",
      "httpVersion",
      "httpVersionMinor",
      "httpVersionMajor",
      "method",
      "rawHeaders",
      "rawTrailers",
      "setTimeout",
      "socket",
      "statusCode",
      "statusMessage",
      "trailers",
      "url"
    ];
    module2.exports = (fromStream, toStream) => {
      const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties));
      for (const property of fromProperties) {
        if (property in toStream) {
          continue;
        }
        toStream[property] = typeof fromStream[property] === "function" ? fromStream[property].bind(fromStream) : fromStream[property];
      }
      return toStream;
    };
  }
});

// node_modules/decompress-response/index.js
var require_decompress_response = __commonJS({
  "node_modules/decompress-response/index.js"(exports2, module2) {
    "use strict";
    var { PassThrough: PassThroughStream } = require("stream");
    var zlib = require("zlib");
    var mimicResponse = require_mimic_response();
    var decompressResponse = (response) => {
      const contentEncoding = (response.headers["content-encoding"] || "").toLowerCase();
      if (!["gzip", "deflate", "br"].includes(contentEncoding)) {
        return response;
      }
      const isBrotli = contentEncoding === "br";
      if (isBrotli && typeof zlib.createBrotliDecompress !== "function") {
        return response;
      }
      const decompress = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();
      const stream = new PassThroughStream();
      mimicResponse(response, stream);
      decompress.on("error", (error) => {
        if (error.code === "Z_BUF_ERROR") {
          stream.end();
          return;
        }
        stream.emit("error", error);
      });
      response.pipe(decompress).pipe(stream);
      return stream;
    };
    module2.exports = decompressResponse;
    module2.exports.default = decompressResponse;
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports2, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb) return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports2, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called) return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/simple-get/index.js
var require_simple_get = __commonJS({
  "node_modules/simple-get/index.js"(exports2, module2) {
    module2.exports = simpleGet;
    var concat = require_simple_concat();
    var decompressResponse = require_decompress_response();
    var http = require("http");
    var https = require("https");
    var once = require_once();
    var querystring = require("querystring");
    var url = require("url");
    var isStream = (o) => o !== null && typeof o === "object" && typeof o.pipe === "function";
    function simpleGet(opts, cb) {
      opts = Object.assign({ maxRedirects: 10 }, typeof opts === "string" ? { url: opts } : opts);
      cb = once(cb);
      if (opts.url) {
        const { hostname, port, protocol: protocol2, auth, path } = url.parse(opts.url);
        delete opts.url;
        if (!hostname && !port && !protocol2 && !auth) opts.path = path;
        else Object.assign(opts, { hostname, port, protocol: protocol2, auth, path });
      }
      const headers = { "accept-encoding": "gzip, deflate" };
      if (opts.headers) Object.keys(opts.headers).forEach((k) => headers[k.toLowerCase()] = opts.headers[k]);
      opts.headers = headers;
      let body;
      if (opts.body) {
        body = opts.json && !isStream(opts.body) ? JSON.stringify(opts.body) : opts.body;
      } else if (opts.form) {
        body = typeof opts.form === "string" ? opts.form : querystring.stringify(opts.form);
        opts.headers["content-type"] = "application/x-www-form-urlencoded";
      }
      if (body) {
        if (!opts.method) opts.method = "POST";
        if (!isStream(body)) opts.headers["content-length"] = Buffer.byteLength(body);
        if (opts.json && !opts.form) opts.headers["content-type"] = "application/json";
      }
      delete opts.body;
      delete opts.form;
      if (opts.json) opts.headers.accept = "application/json";
      if (opts.method) opts.method = opts.method.toUpperCase();
      const originalHost = opts.hostname;
      const protocol = opts.protocol === "https:" ? https : http;
      const req = protocol.request(opts, (res) => {
        if (opts.followRedirects !== false && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          opts.url = res.headers.location;
          delete opts.headers.host;
          res.resume();
          const redirectHost = url.parse(opts.url).hostname;
          if (redirectHost !== null && redirectHost !== originalHost) {
            delete opts.headers.cookie;
            delete opts.headers.authorization;
          }
          if (opts.method === "POST" && [301, 302].includes(res.statusCode)) {
            opts.method = "GET";
            delete opts.headers["content-length"];
            delete opts.headers["content-type"];
          }
          if (opts.maxRedirects-- === 0) return cb(new Error("too many redirects"));
          else return simpleGet(opts, cb);
        }
        const tryUnzip = typeof decompressResponse === "function" && opts.method !== "HEAD";
        cb(null, tryUnzip ? decompressResponse(res) : res);
      });
      req.on("timeout", () => {
        req.abort();
        cb(new Error("Request timed out"));
      });
      req.on("error", cb);
      if (isStream(body)) body.on("error", cb).pipe(req);
      else req.end(body);
      return req;
    }
    simpleGet.concat = (opts, cb) => {
      return simpleGet(opts, (err, res) => {
        if (err) return cb(err);
        concat(res, (err2, data) => {
          if (err2) return cb(err2);
          if (opts.json) {
            try {
              data = JSON.parse(data.toString());
            } catch (err3) {
              return cb(err3, res, data);
            }
          }
          cb(null, res, data);
        });
      });
    };
    ["get", "post", "put", "patch", "head", "delete"].forEach((method) => {
      simpleGet[method] = (opts, cb) => {
        if (typeof opts === "string") opts = { url: opts };
        return simpleGet(Object.assign({ method: method.toUpperCase() }, opts), cb);
      };
    });
  }
});

// node_modules/canvas/lib/image.js
var require_image = __commonJS({
  "node_modules/canvas/lib/image.js"(exports2, module2) {
    "use strict";
    var bindings = require_bindings2();
    var Image = module2.exports = bindings.Image;
    var util = require("util");
    var get;
    var { GetSource, SetSource } = bindings;
    Object.defineProperty(Image.prototype, "src", {
      /**
       * src setter. Valid values:
       *  * `data:` URI
       *  * Local file path
       *  * HTTP or HTTPS URL
       *  * Buffer containing image data (i.e. not a `data:` URI stored in a Buffer)
       *
       * @param {String|Buffer} val filename, buffer, data URI, URL
       * @api public
       */
      set(val) {
        if (typeof val === "string") {
          if (/^\s*data:/.test(val)) {
            const commaI = val.indexOf(",");
            const isBase64 = val.lastIndexOf("base64", commaI) !== -1;
            const content = val.slice(commaI + 1);
            setSource(this, Buffer.from(content, isBase64 ? "base64" : "utf8"), val);
          } else if (/^\s*https?:\/\//.test(val)) {
            const onerror = (err) => {
              if (typeof this.onerror === "function") {
                this.onerror(err);
              } else {
                throw err;
              }
            };
            if (!get) get = require_simple_get();
            get.concat({
              url: val,
              headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36" }
            }, (err, res, data) => {
              if (err) return onerror(err);
              if (res.statusCode < 200 || res.statusCode >= 300) {
                return onerror(new Error(`Server responded with ${res.statusCode}`));
              }
              setSource(this, data);
            });
          } else {
            setSource(this, val);
          }
        } else if (Buffer.isBuffer(val)) {
          setSource(this, val);
        }
      },
      get() {
        return getSource(this);
      },
      configurable: true
    });
    Image.prototype[util.inspect.custom || "inspect"] = function() {
      return "[Image" + (this.complete ? ":" + this.width + "x" + this.height : "") + (this.src ? " " + this.src : "") + (this.complete ? " complete" : "") + "]";
    };
    function getSource(img) {
      return img._originalSource || GetSource.call(img);
    }
    function setSource(img, src, origSrc) {
      SetSource.call(img, src);
      img._originalSource = origSrc;
    }
  }
});

// node_modules/canvas/lib/pattern.js
var require_pattern = __commonJS({
  "node_modules/canvas/lib/pattern.js"(exports2, module2) {
    "use strict";
    var bindings = require_bindings2();
    var { DOMMatrix } = require_DOMMatrix();
    bindings.CanvasPatternInit(DOMMatrix);
    module2.exports = bindings.CanvasPattern;
    bindings.CanvasPattern.prototype.toString = function() {
      return "[object CanvasPattern]";
    };
  }
});

// node_modules/canvas/package.json
var require_package = __commonJS({
  "node_modules/canvas/package.json"(exports2, module2) {
    module2.exports = {
      name: "canvas",
      description: "Canvas graphics API backed by Cairo",
      version: "2.11.2",
      author: "TJ Holowaychuk <tj@learnboost.com>",
      main: "index.js",
      browser: "browser.js",
      contributors: [
        "Nathan Rajlich <nathan@tootallnate.net>",
        "Rod Vagg <r@va.gg>",
        "Juriy Zaytsev <kangax@gmail.com>"
      ],
      keywords: [
        "canvas",
        "graphic",
        "graphics",
        "pixman",
        "cairo",
        "image",
        "images",
        "pdf"
      ],
      homepage: "https://github.com/Automattic/node-canvas",
      repository: "git://github.com/Automattic/node-canvas.git",
      scripts: {
        prebenchmark: "node-gyp build",
        benchmark: "node benchmarks/run.js",
        lint: "standard examples/*.js test/server.js test/public/*.js benchmarks/run.js lib/context2d.js util/has_lib.js browser.js index.js",
        test: "mocha test/*.test.js",
        "pretest-server": "node-gyp build",
        "test-server": "node test/server.js",
        "generate-wpt": "node ./test/wpt/generate.js",
        "test-wpt": "mocha test/wpt/generated/*.js",
        install: "node-pre-gyp install --fallback-to-build --update-binary",
        dtslint: "dtslint types"
      },
      binary: {
        module_name: "canvas",
        module_path: "build/Release",
        host: "https://github.com/Automattic/node-canvas/releases/download/",
        remote_path: "v{version}",
        package_name: "{module_name}-v{version}-{node_abi}-{platform}-{libc}-{arch}.tar.gz"
      },
      files: [
        "binding.gyp",
        "lib/",
        "src/",
        "util/",
        "types/index.d.ts"
      ],
      types: "types/index.d.ts",
      dependencies: {
        "@mapbox/node-pre-gyp": "^1.0.0",
        nan: "^2.17.0",
        "simple-get": "^3.0.3"
      },
      devDependencies: {
        "@types/node": "^10.12.18",
        "assert-rejects": "^1.0.0",
        dtslint: "^4.0.7",
        express: "^4.16.3",
        "js-yaml": "^4.1.0",
        mocha: "^5.2.0",
        pixelmatch: "^4.0.2",
        standard: "^12.0.1",
        typescript: "^4.2.2"
      },
      engines: {
        node: ">=6"
      },
      license: "MIT"
    };
  }
});

// node_modules/canvas/index.js
var require_canvas2 = __commonJS({
  "node_modules/canvas/index.js"(exports2) {
    var Canvas = require_canvas();
    var Image = require_image();
    var CanvasRenderingContext2D2 = require_context2d();
    var CanvasPattern = require_pattern();
    var parseFont = require_parse_font();
    var packageJson = require_package();
    var bindings = require_bindings2();
    var fs4 = require("fs");
    var PNGStream = require_pngstream();
    var PDFStream = require_pdfstream();
    var JPEGStream = require_jpegstream();
    var { DOMPoint, DOMMatrix } = require_DOMMatrix();
    function createCanvas2(width, height, type) {
      return new Canvas(width, height, type);
    }
    function createImageData(array, width, height) {
      return new bindings.ImageData(array, width, height);
    }
    function loadImage2(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        function cleanup() {
          image.onload = null;
          image.onerror = null;
        }
        image.onload = () => {
          cleanup();
          resolve(image);
        };
        image.onerror = (err) => {
          cleanup();
          reject(err);
        };
        image.src = src;
      });
    }
    function registerFont(src, fontFace) {
      return Canvas._registerFont(fs4.realpathSync(src), fontFace);
    }
    function deregisterAllFonts() {
      return Canvas._deregisterAllFonts();
    }
    exports2.Canvas = Canvas;
    exports2.Context2d = CanvasRenderingContext2D2;
    exports2.CanvasRenderingContext2D = CanvasRenderingContext2D2;
    exports2.CanvasGradient = bindings.CanvasGradient;
    exports2.CanvasPattern = CanvasPattern;
    exports2.Image = Image;
    exports2.ImageData = bindings.ImageData;
    exports2.PNGStream = PNGStream;
    exports2.PDFStream = PDFStream;
    exports2.JPEGStream = JPEGStream;
    exports2.DOMMatrix = DOMMatrix;
    exports2.DOMPoint = DOMPoint;
    exports2.registerFont = registerFont;
    exports2.deregisterAllFonts = deregisterAllFonts;
    exports2.parseFont = parseFont;
    exports2.createCanvas = createCanvas2;
    exports2.createImageData = createImageData;
    exports2.loadImage = loadImage2;
    exports2.backends = bindings.Backends;
    exports2.version = packageJson.version;
    exports2.cairoVersion = bindings.cairoVersion;
    exports2.jpegVersion = bindings.jpegVersion;
    exports2.gifVersion = bindings.gifVersion ? bindings.gifVersion.replace(/[^.\d]/g, "") : void 0;
    exports2.freetypeVersion = bindings.freetypeVersion;
    exports2.rsvgVersion = bindings.rsvgVersion;
    exports2.pangoVersion = bindings.pangoVersion;
  }
});

// hardware/index.ts
var import_rpi_led_matrix = __toESM(require_dist(), 1);

// src/server/db.ts
var import_fs = __toESM(require("fs"), 1);

// src/types.ts
var TriggerHardwareReloadScene = "trigger-hardware-scene-reload";

// src/server/utils.ts
function customScenesPath() {
  return process.env.NODE_ENV === "production" ? "../../custom_scenes" : "./custom_scenes";
}
function heartBeatFile() {
  return process.env.NODE_ENV === "production" ? "../../hardware/lastHeartbeat.txt" : "./hardware/lastHeartbeat.txt";
}
function databaseFile() {
  return process.env.NODE_ENV === "production" ? "../../database.json" : "./database.json";
}

// src/server/db.ts
var defaultPreset = {
  name: "Default",
  scenes: [{ sceneName: "blank" /* Blank */, sceneConfig: {} }],
  mode: "for",
  untilDay: "0",
  untilHour: "0",
  untilMinute: "00",
  forTime: "0:00"
};
var defaultData = {
  panel: {
    name: "My Moonclock",
    timeAdjustmentAmount: "5",
    defaultPreset,
    brightness: 30,
    pwnLsbNanoseconds: 130,
    gpioSlowdown: 4,
    pwmBits: 11
  },
  scheduledPreset: {
    preset: null,
    endTime: null
  },
  hardware: {
    preset: defaultPreset
  },
  presets: [
    {
      name: "Sleep Mode",
      scenes: [{ sceneName: "moon" /* Moon */, sceneConfig: {} }],
      mode: "until",
      untilDay: "1",
      untilHour: "7",
      untilMinute: "00",
      forTime: ""
    },
    {
      name: "Nap Mode",
      scenes: [{ sceneName: "bunny", sceneConfig: {} }],
      mode: "for",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
      forTime: "2:00"
    },
    {
      name: "Timeout",
      scenes: [{ sceneName: "countdown" /* Countdown */, sceneConfig: {} }],
      mode: "for",
      untilDay: "0",
      untilHour: "0",
      untilMinute: "0",
      forTime: "0:05"
    }
  ]
};
function getDatabaseName() {
  return process.env["APP_ENV"] === "test" ? "./database-test.json" : databaseFile();
}
function readDb() {
  const dbFile = getDatabaseName();
  try {
    const file = import_fs.default.readFileSync(dbFile).toString();
    return JSON.parse(file);
  } catch {
    console.log(`${dbFile} not found, loading default data`);
    return JSON.parse(JSON.stringify(defaultData));
  }
}
function writeDb(db) {
  import_fs.default.writeFileSync(getDatabaseName(), JSON.stringify(db, null, 2), {
    mode: 510
  });
}
function getData() {
  return readDb();
}
function setData(data) {
  const db = readDb();
  writeDb({ ...db, ...data });
}

// hardware/checkForNewDisplayConfig.ts
var import_fs3 = __toESM(require("fs"), 1);

// src/display-engine/colors.ts
function mixColors({
  newColor,
  baseColor
}) {
  if (newColor === null) return baseColor;
  const baseAlpha = baseColor[3] / 255;
  const newAlpha = newColor[3] / 255;
  const mix = [];
  mix[3] = 1 - (1 - newAlpha) * (1 - baseAlpha);
  mix[0] = Math.round(
    newColor[0] * newAlpha / mix[3] + baseColor[0] * baseAlpha * (1 - newAlpha) / mix[3]
  );
  mix[1] = Math.round(
    newColor[1] * newAlpha / mix[3] + baseColor[1] * baseAlpha * (1 - newAlpha) / mix[3]
  );
  mix[2] = Math.round(
    newColor[2] * newAlpha / mix[3] + baseColor[2] * baseAlpha * (1 - newAlpha) / mix[3]
  );
  mix[3] = mix[3] * 255;
  return new Uint8ClampedArray(mix);
}

// src/display-engine/canvas.ts
var import_canvas = __toESM(require_canvas2(), 1);
function buildCanvas(dimensions) {
  const canvas = (0, import_canvas.createCanvas)(dimensions.width, dimensions.height);
  const ctx = canvas.getContext("2d");
  return { canvas, ctx };
}
function syncFromCanvas(ctx, dimensions) {
  const pixels = [];
  for (let y = 0; y < dimensions.height; y++) {
    for (let x = 0; x < dimensions.width; x++) {
      const { data } = ctx.getImageData(x, y, 1, 1);
      pixels.push({
        x,
        y,
        rgba: data[3] === 0 ? null : data
      });
    }
  }
  return pixels;
}

// src/display-engine/macros/box.ts
var startBox = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels
}) => {
  const config = {
    backgroundColor: "#ffffff",
    startingColumn: 0,
    startingRow: 0,
    width: dimensions.width,
    height: dimensions.height,
    borderWidth: 0,
    borderColor: "#fff",
    ...macroConfig
  };
  ctx.fillStyle = getFillStyle(config.backgroundColor, dimensions, ctx);
  ctx.fillRect(
    config.startingColumn,
    config.startingRow,
    config.width,
    config.height
  );
  if (config.borderWidth) {
    ctx.strokeStyle = config.borderColor;
    ctx.strokeRect(
      config.startingColumn,
      config.startingRow,
      config.width,
      config.height
    );
  }
  const pixels = syncFromCanvas(ctx, dimensions);
  updatePixels(pixels, index);
  return () => {
  };
};
function getFillStyle(color, dimensions, ctx) {
  if (typeof color === "string") {
    return color;
  }
  const { direction, colorStops } = color;
  const gradient = ctx.createLinearGradient(
    0,
    0,
    direction === "horizontal" ? dimensions.width : 0,
    dimensions.height
  );
  for (const colorStop of colorStops) {
    gradient.addColorStop(colorStop.offset, colorStop.color);
  }
  return gradient;
}

// src/display-engine/macros/marquee.ts
var startMarquee = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels
}) => {
  const config = {
    color: "#fff",
    text: "Replace with marquee text!",
    font: "Arial",
    fontSize: 12,
    speed: 50,
    width: dimensions.width,
    height: dimensions.height,
    startingColumn: 0,
    startingRow: 0,
    direction: "vertical",
    ...macroConfig
  };
  ctx.textBaseline = "top";
  ctx.font = `${config.fontSize}px ${config.font}`;
  ctx.fillStyle = config.color;
  const textMetrics = ctx.measureText(config.text);
  let offset = config.direction === "horizontal" ? -config.width : -config.height;
  const interval = setInterval(() => {
    ctx.clearRect(0, 0, config.width, config.height);
    ctx.textBaseline = "top";
    ctx.font = `16px ${config.font}`;
    ctx.fillStyle = config.color;
    ctx.fillText(
      config.text,
      config.direction === "horizontal" ? config.startingColumn - offset : config.startingColumn,
      config.direction === "vertical" ? config.startingRow - offset : config.startingRow
    );
    const pixels = syncFromCanvas(ctx, dimensions);
    updatePixels(pixels, index);
    if (config.direction === "horizontal") {
      if (offset > config.width + textMetrics.width) {
        offset = -config.width;
      }
    } else if (config.direction === "vertical") {
      const height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
      if (offset > config.height + height) {
        offset = -config.height;
      }
    }
    offset += 1;
  }, config.speed);
  return () => clearInterval(interval);
};

// src/display-engine/animation.ts
var FRAME_RATE = 1e3 / 60;
var lastTime = 0;
function getAnimationFrame(callback) {
  const currentTime = performance.now();
  const timeToCall = Math.max(0, FRAME_RATE - (currentTime - lastTime));
  const timeoutId = setTimeout(() => {
    lastTime = performance.now();
    callback(lastTime);
  }, timeToCall);
  return timeoutId;
}
function stopAnimationFrame(id) {
  clearTimeout(id);
}

// src/display-engine/macros/ripple.ts
function colorToRgba(hexOrRgbString) {
  if (hexOrRgbString.includes("rgb")) {
    const result = hexOrRgbString.match(
      /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i
    );
    if (result) {
      return {
        r: parseInt(result[1], 10),
        g: parseInt(result[2], 10),
        b: parseInt(result[3], 10),
        a: parseInt(result[4], 10) || 255
      };
    }
  } else {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      hexOrRgbString
    );
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255
      };
    }
  }
  return null;
}
var startRipple = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels
}) => {
  const config = {
    width: dimensions.width,
    height: dimensions.height,
    speed: 5,
    waveHeight: 5,
    color: "#ffffff",
    ...macroConfig
  };
  const { height, width, speed, waveHeight, color } = config;
  let timeoutId;
  const pixelimageData = ctx.createImageData(1, 1);
  const imageData = pixelimageData.data;
  function drawRipple(timestamp) {
    const elapsedTimeUnits = (timestamp - startTime) / (240 - speed * 20);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const reIndexedX = -(width - x - width / 2);
        const reIndexedY = height - y - height / 2;
        const distance = Math.hypot(reIndexedX, reIndexedY);
        const calculatedWaveHeight = Math.sin(
          (distance - elapsedTimeUnits) / waveHeight
        );
        const adjustedHeight = calculatedWaveHeight * 60 + 100 / 2;
        const rgba = colorToRgba(color);
        imageData[0] = rgba?.r;
        imageData[1] = rgba?.g;
        imageData[2] = rgba?.b;
        imageData[3] = adjustedHeight / 100 * rgba?.a;
        ctx.putImageData(pixelimageData, x, y);
      }
    }
    const pixels = syncFromCanvas(ctx, dimensions);
    updatePixels(pixels, index);
    timeoutId = getAnimationFrame(drawRipple);
  }
  const startTime = performance.now();
  drawRipple(startTime);
  return () => {
    stopAnimationFrame(timeoutId);
  };
};

// src/display-engine/macros/meteors.ts
var startMeteors = async ({
  macroConfig,
  dimensions,
  index,
  ctx,
  updatePixels
}) => {
  const config = {
    color: "#FFFFFF",
    meteorCount: 40,
    maxTailLength: 20,
    minTailLength: 5,
    maxDepth: 10,
    minSpeed: 100,
    maxSpeed: 10,
    width: dimensions.width,
    height: dimensions.height,
    ...macroConfig
  };
  const rgba = colorToRgba(config.color);
  const meteors = [];
  const validStartingPoints = [];
  for (let i = 0; i < config.width + config.height; i++) {
    validStartingPoints.push(i);
  }
  const generateMeteor = () => {
    const tailLength = Math.floor(
      Math.random() * (config.maxTailLength - config.minTailLength)
    ) + config.minTailLength;
    const depth = Math.floor(Math.random() * config.maxDepth) + 1;
    const startingX = validStartingPoints[Math.floor(Math.random() * validStartingPoints.length)];
    return {
      tailLength,
      speed: Math.floor(Math.random() * (config.minSpeed - config.maxSpeed)) + config.maxSpeed,
      depth,
      moveCount: 0,
      complete: false,
      startingX,
      path: [
        {
          x: startingX,
          y: 0
        }
      ]
    };
  };
  const seedMeteor = () => {
    const meteor = generateMeteor();
    meteors.push(meteor);
    const index2 = validStartingPoints.indexOf(meteor.path[0].x);
    validStartingPoints.splice(index2, 1);
  };
  for (let i = 0; i < config.meteorCount; i++) {
    seedMeteor();
  }
  const interval = setInterval(() => {
    const filteredMeteors = meteors.filter(function(meteor) {
      return meteor.complete == false;
    });
    for (let i = filteredMeteors.length; i < config.meteorCount; i++) {
      seedMeteor();
    }
    meteors.forEach((meteor, i) => {
      meteors[i].moveCount += 10;
      if (meteors[i].moveCount > meteor.speed) {
        meteors[i].moveCount = 0;
        if (config.height + meteor.tailLength > meteor.path[0].y) {
          meteors[i].path.unshift({
            x: meteor.path[0].x - 1,
            y: meteor.path[0].y + 1
          });
          if (meteors[i].path.length > meteor.tailLength) {
            meteors[i].path.pop();
          }
        } else {
          meteors[i].complete = true;
          validStartingPoints.push(meteor.startingX);
        }
        const meteorDepthAlphaPercentage = meteor.depth / config.maxDepth;
        meteor.path.forEach((dot, i2) => {
          const meteorDotAlphaPercentage = (meteor.tailLength - i2) / meteor.tailLength;
          const id = ctx.createImageData(1, 1);
          const d = id.data;
          d[0] = rgba?.r;
          d[1] = rgba?.g;
          d[2] = rgba?.b;
          d[3] = meteorDotAlphaPercentage * meteorDepthAlphaPercentage * rgba?.a;
          ctx.putImageData(id, dot.x, dot.y);
        });
      }
    });
    const pixels = syncFromCanvas(ctx, dimensions);
    updatePixels(pixels, index);
  }, 10);
  return () => clearInterval(interval);
};

// src/display-engine/macros/text.ts
var startText = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels
}) => {
  const config = {
    color: "#fff",
    text: "hello WORLD!",
    font: "Arial",
    fontSize: 12,
    alignment: "left",
    spaceBetweenLetters: 1,
    spaceBetweenLines: 1,
    startingColumn: 0,
    startingRow: 0,
    width: dimensions.width,
    ...macroConfig
  };
  ctx.textBaseline = "top";
  ctx.font = `${config.fontSize}px ${config.font}`;
  ctx.fillStyle = config.color;
  const textMetrics = ctx.measureText(config.text);
  if (config.alignment === "left") {
    ctx.fillText(config.text, config.startingColumn, config.startingRow);
  } else if (config.alignment === "right") {
    ctx.fillText(
      config.text,
      config.width - textMetrics.width,
      config.startingRow
    );
  } else if (config.alignment === "center") {
    ctx.fillText(
      config.text,
      config.width / 2 - textMetrics.width / 2,
      config.startingRow
    );
  }
  const pixels = syncFromCanvas(ctx, dimensions);
  updatePixels(pixels, index);
  return () => {
  };
};

// src/display-engine/macros/twinkle.ts
var startTwinkle = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels
}) => {
  const config = {
    color: "#FFFFFF",
    speed: 10,
    amount: 50,
    width: dimensions.width,
    height: dimensions.height,
    ...macroConfig
  };
  const { color, speed, amount, height, width } = config;
  let timeoutId;
  const twinklingCoordinates = [];
  for (let i = 0; i < amount; i++) {
    const y = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
    const x = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
    const a = Math.floor(Math.random() * (255 - 1 - 0 + 1)) + 0;
    twinklingCoordinates.push({ x, y, a, peaked: i % 2 });
  }
  const stepAmount = Math.floor(255 / speed);
  function drawTwinkle() {
    const availableSlots = amount - twinklingCoordinates.length;
    for (let a = 0; a < availableSlots; a++) {
      const y = Math.floor(Math.random() * (height - 1 - 0 + 1)) + 0;
      const x = Math.floor(Math.random() * (width - 1 - 0 + 1)) + 0;
      twinklingCoordinates.push({ x, y, a: 0 });
    }
    for (let i = 0; i < twinklingCoordinates.length; i++) {
      const { x, y, a, peaked } = twinklingCoordinates[i];
      const rgba = colorToRgba(color);
      const id = ctx.createImageData(1, 1);
      const d = id.data;
      d[0] = rgba?.r;
      d[1] = rgba?.g;
      d[2] = rgba?.b;
      d[3] = a;
      ctx.putImageData(id, x, y);
      if (a <= -1) {
        twinklingCoordinates.splice(i, 1);
        continue;
      }
      twinklingCoordinates[i] = {
        ...twinklingCoordinates[i],
        x,
        y,
        a: a + (peaked ? -stepAmount : stepAmount),
        ...!peaked && a > 255 ? { peaked: true } : {}
      };
    }
    const pixels = syncFromCanvas(ctx, dimensions);
    updatePixels(pixels, index);
    timeoutId = getAnimationFrame(drawTwinkle);
  }
  drawTwinkle();
  return () => {
    stopAnimationFrame(timeoutId);
  };
};

// src/display-engine/macros/image.ts
var import_canvas8 = __toESM(require_canvas2(), 1);
var startImage = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels
}) => {
  const config = {
    url: "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7",
    speed: 50,
    width: dimensions.width,
    height: dimensions.height,
    startingColumn: 0,
    startingRow: 0,
    ...macroConfig
  };
  const img = await (0, import_canvas8.loadImage)(config.url);
  ctx?.drawImage(img, 0, 0);
  const pixels = syncFromCanvas(ctx, dimensions);
  updatePixels(pixels, index);
  img.src = config.url;
  return () => {
  };
};

// src/display-engine/macros/custom.ts
var startCustom = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels
}) => {
  macroConfig.customFunc(ctx, dimensions);
  const pixels = syncFromCanvas(ctx, dimensions);
  updatePixels(pixels, index);
  return () => {
  };
};

// src/display-engine/macros/coordinates.ts
var startCoordinates = async ({
  macroConfig,
  ctx,
  dimensions,
  index,
  updatePixels
}) => {
  const config = {
    coordinates: {
      "1:1": "#ffffff"
    },
    ...macroConfig
  };
  for (const coordinate in config.coordinates) {
    ctx.fillStyle = config.coordinates[coordinate];
    const [x, y] = coordinate.split(":");
    ctx.fillRect(parseInt(x, 10), parseInt(y, 10), 1, 1);
  }
  const pixels = syncFromCanvas(ctx, dimensions);
  updatePixels(pixels, index);
  return () => {
  };
};

// src/display-engine/scenes/moon.ts
var moon = {
  "0:0": "#000000",
  "1:0": "#000000",
  "2:0": "#000000",
  "3:0": "#000000",
  "4:0": "#000000",
  "5:0": "#000000",
  "6:0": "#000000",
  "7:0": "#000000",
  "8:0": "#000000",
  "9:0": "#000000",
  "10:0": "#000000",
  "11:0": "#000000",
  "12:0": "#000000",
  "13:0": "#000000",
  "14:0": "#000000",
  "15:0": "#000000",
  "16:0": "#000000",
  "17:0": "#000000",
  "18:0": "#000000",
  "19:0": "#000000",
  "20:0": "#000000",
  "21:0": "#000000",
  "22:0": "#000000",
  "23:0": "#000000",
  "24:0": "#000000",
  "25:0": "#000000",
  "26:0": "#000000",
  "27:0": "#000000",
  "28:0": "#000000",
  "29:0": "#000000",
  "30:0": "#000000",
  "31:0": "#000000",
  "0:1": "#000000",
  "1:1": "#000000",
  "2:1": "#000000",
  "3:1": "#000000",
  "4:1": "#000000",
  "5:1": "#000000",
  "6:1": "#000000",
  "7:1": "#000000",
  "8:1": "#000000",
  "9:1": "#000000",
  "10:1": "#000000",
  "11:1": "#000000",
  "12:1": "#000000",
  "13:1": "#000000",
  "14:1": "#000000",
  "15:1": "#000000",
  "16:1": "#000000",
  "17:1": "#FFF5FA",
  "18:1": "#000000",
  "19:1": "#000000",
  "20:1": "#000000",
  "21:1": "#000000",
  "22:1": "#000000",
  "23:1": "#000000",
  "24:1": "#000000",
  "25:1": "#000000",
  "26:1": "#000000",
  "27:1": "#000000",
  "28:1": "#000000",
  "29:1": "#000000",
  "30:1": "#000000",
  "31:1": "#000000",
  "0:2": "#000000",
  "1:2": "#000000",
  "2:2": "#000000",
  "3:2": "#000000",
  "4:2": "#000000",
  "5:2": "#000000",
  "6:2": "#000000",
  "7:2": "#000000",
  "8:2": "#000000",
  "9:2": "#000000",
  "10:2": "#000000",
  "11:2": "#000000",
  "12:2": "#000000",
  "13:2": "#000000",
  "14:2": "#000000",
  "15:2": "#000000",
  "16:2": "#000000",
  "17:2": "#000000",
  "18:2": "#000000",
  "19:2": "#000000",
  "20:2": "#000000",
  "21:2": "#000000",
  "22:2": "#000000",
  "23:2": "#000000",
  "24:2": "#000000",
  "25:2": "#000000",
  "26:2": "#000000",
  "27:2": "#000000",
  "28:2": "#000000",
  "29:2": "#000000",
  "30:2": "#000000",
  "31:2": "#000000",
  "0:3": "#000000",
  "1:3": "#000000",
  "2:3": "#000000",
  "3:3": "#000000",
  "4:3": "#000000",
  "5:3": "#000000",
  "6:3": "#000000",
  "7:3": "#000000",
  "8:3": "#000000",
  "9:3": "#000000",
  "10:3": "#000000",
  "11:3": "#000000",
  "12:3": "#000000",
  "13:3": "#000000",
  "14:3": "#000000",
  "15:3": "#000000",
  "16:3": "#000000",
  "17:3": "#000000",
  "18:3": "#000000",
  "19:3": "#000000",
  "20:3": "#000000",
  "21:3": "#000000",
  "22:3": "#000000",
  "23:3": "#000000",
  "24:3": "#000000",
  "25:3": "#000000",
  "26:3": "#000000",
  "27:3": "#000000",
  "28:3": "#000000",
  "29:3": "#000000",
  "30:3": "#000000",
  "31:3": "#000000",
  "0:4": "#000000",
  "1:4": "#000000",
  "2:4": "#000000",
  "3:4": "#000000",
  "4:4": "#000000",
  "5:4": "#000000",
  "6:4": "#000000",
  "7:4": "#000000",
  "8:4": "#000000",
  "9:4": "#000000",
  "10:4": "#000000",
  "11:4": "#000000",
  "12:4": "#000000",
  "13:4": "#000000",
  "14:4": "#000000",
  "15:4": "#000000",
  "16:4": "#000000",
  "17:4": "#000000",
  "18:4": "#000000",
  "19:4": "#000000",
  "20:4": "#000000",
  "21:4": "#000000",
  "22:4": "#000000",
  "23:4": "#000000",
  "24:4": "#000000",
  "25:4": "#000000",
  "26:4": "#000000",
  "27:4": "#000000",
  "28:4": "#000000",
  "29:4": "#000000",
  "30:4": "#000000",
  "31:4": "#000000",
  "0:5": "#000000",
  "1:5": "#000000",
  "2:5": "#000000",
  "3:5": "#000000",
  "4:5": "#000000",
  "5:5": "#000000",
  "6:5": "#000000",
  "7:5": "#000000",
  "8:5": "#000000",
  "9:5": "#000000",
  "10:5": "#000000",
  "11:5": "#000000",
  "12:5": "#000000",
  "13:5": "#000000",
  "14:5": "#000000",
  "15:5": "#000000",
  "16:5": "#000000",
  "17:5": "#000000",
  "18:5": "#000000",
  "19:5": "#000000",
  "20:5": "#000000",
  "21:5": "#000000",
  "22:5": "#000000",
  "23:5": "#000000",
  "24:5": "#000000",
  "25:5": "#000000",
  "26:5": "#000000",
  "27:5": "#000000",
  "28:5": "#000000",
  "29:5": "#000000",
  "30:5": "#000000",
  "31:5": "#000000",
  "0:6": "#000000",
  "1:6": "#000000",
  "2:6": "#000000",
  "3:6": "#000000",
  "4:6": "#000000",
  "5:6": "#969696",
  "6:6": "#000000",
  "7:6": "#000000",
  "8:6": "#000000",
  "9:6": "#000000",
  "10:6": "#000000",
  "11:6": "#000000",
  "12:6": "#000000",
  "13:6": "#000000",
  "14:6": "#000000",
  "15:6": "#000000",
  "16:6": "#000000",
  "17:6": "#000000",
  "18:6": "#000000",
  "19:6": "#000000",
  "20:6": "#000000",
  "21:6": "#000000",
  "22:6": "#000000",
  "23:6": "#000000",
  "24:6": "#000000",
  "25:6": "#FFF5FA",
  "26:6": "#000000",
  "27:6": "#000000",
  "28:6": "#000000",
  "29:6": "#000000",
  "30:6": "#000000",
  "31:6": "#000000",
  "0:7": "#000000",
  "1:7": "#000000",
  "2:7": "#000000",
  "3:7": "#000000",
  "4:7": "#000000",
  "5:7": "#000000",
  "6:7": "#000000",
  "7:7": "#000000",
  "8:7": "#000000",
  "9:7": "#000000",
  "10:7": "#000000",
  "11:7": "#000000",
  "12:7": "#000000",
  "13:7": "#000000",
  "14:7": "#000000",
  "15:7": "#000000",
  "16:7": "#000000",
  "17:7": "#000000",
  "18:7": "#000000",
  "19:7": "#000000",
  "20:7": "#000000",
  "21:7": "#000000",
  "22:7": "#000000",
  "23:7": "#000000",
  "24:7": "#000000",
  "25:7": "#000000",
  "26:7": "#000000",
  "27:7": "#000000",
  "28:7": "#000000",
  "29:7": "#000000",
  "30:7": "#000000",
  "31:7": "#000000",
  "0:8": "#000000",
  "1:8": "#000000",
  "2:8": "#000000",
  "3:8": "#000000",
  "4:8": "#000000",
  "5:8": "#000000",
  "6:8": "#000000",
  "7:8": "#000000",
  "8:8": "#000000",
  "9:8": "#000000",
  "10:8": "#000000",
  "11:8": "#000000",
  "12:8": "#000000",
  "13:8": "#000000",
  "14:8": "#000000",
  "15:8": "#000000",
  "16:8": "#000000",
  "17:8": "#000000",
  "18:8": "#000000",
  "19:8": "#000000",
  "20:8": "#FFD700",
  "21:8": "#FFD700",
  "22:8": "#000000",
  "23:8": "#000000",
  "24:8": "#000000",
  "25:8": "#000000",
  "26:8": "#000000",
  "27:8": "#000000",
  "28:8": "#000000",
  "29:8": "#000000",
  "30:8": "#000000",
  "31:8": "#000000",
  "0:9": "#000000",
  "1:9": "#000000",
  "2:9": "#000000",
  "3:9": "#000000",
  "4:9": "#000000",
  "5:9": "#000000",
  "6:9": "#000000",
  "7:9": "#000000",
  "8:9": "#000000",
  "9:9": "#000000",
  "10:9": "#000000",
  "11:9": "#000000",
  "12:9": "#000000",
  "13:9": "#000000",
  "14:9": "#000000",
  "15:9": "#969696",
  "16:9": "#000000",
  "17:9": "#000000",
  "18:9": "#000000",
  "19:9": "#000000",
  "20:9": "#000000",
  "21:9": "#FFD700",
  "22:9": "#FFC125",
  "23:9": "#FFC125",
  "24:9": "#000000",
  "25:9": "#000000",
  "26:9": "#000000",
  "27:9": "#000000",
  "28:9": "#000000",
  "29:9": "#000000",
  "30:9": "#000000",
  "31:9": "#000000",
  "0:10": "#000000",
  "1:10": "#000000",
  "2:10": "#000000",
  "3:10": "#000000",
  "4:10": "#000000",
  "5:10": "#000000",
  "6:10": "#000000",
  "7:10": "#000000",
  "8:10": "#000000",
  "9:10": "#000000",
  "10:10": "#000000",
  "11:10": "#000000",
  "12:10": "#000000",
  "14:10": "#000000",
  "15:10": "#000000",
  "16:10": "#000000",
  "17:10": "#000000",
  "18:10": "#000000",
  "19:10": "#000000",
  "20:10": "#000000",
  "21:10": "#FFC125",
  "22:10": "#FFD700",
  "23:10": "#FFD700",
  "24:10": "#FFC125",
  "25:10": "#000000",
  "26:10": "#000000",
  "27:10": "#000000",
  "28:10": "#000000",
  "29:10": "#000000",
  "30:10": "#000000",
  "31:10": "#000000",
  "0:11": "#000000",
  "1:11": "#000000",
  "2:11": "#000000",
  "3:11": "#000000",
  "4:11": "#000000",
  "5:11": "#000000",
  "6:11": "#000000",
  "8:11": "#000000",
  "9:11": "#000000",
  "10:11": "#000000",
  "11:11": "#000000",
  "12:11": "#000000",
  "13:11": "#000000",
  "14:11": "#000000",
  "15:11": "#000000",
  "16:11": "#000000",
  "17:11": "#000000",
  "18:11": "#000000",
  "19:11": "#000000",
  "20:11": "#000000",
  "21:11": "#000000",
  "22:11": "#FFC125",
  "23:11": "#FFC125",
  "24:11": "#FFC125",
  "25:11": "#FFC125",
  "26:11": "#000000",
  "27:11": "#000000",
  "28:11": "#000000",
  "29:11": "#000000",
  "30:11": "#000000",
  "31:11": "#000000",
  "0:12": "#000000",
  "1:12": "#000000",
  "2:12": "#000000",
  "3:12": "#000000",
  "4:12": "#000000",
  "5:12": "#000000",
  "7:12": "#FFFFFF",
  "9:12": "#000000",
  "10:12": "#000000",
  "11:12": "#000000",
  "12:12": "#000000",
  "13:12": "#000000",
  "14:12": "#000000",
  "15:12": "#000000",
  "16:12": "#000000",
  "17:12": "#000000",
  "18:12": "#000000",
  "19:12": "#000000",
  "20:12": "#000000",
  "21:12": "#000000",
  "22:12": "#FFD700",
  "23:12": "#FFD700",
  "24:12": "#FFC125",
  "25:12": "#FFC125",
  "26:12": "#FFC125",
  "27:12": "#000000",
  "28:12": "#000000",
  "29:12": "#FFE5EA",
  "30:12": "#000000",
  "31:12": "#000000",
  "0:13": "#000000",
  "1:13": "#000000",
  "2:13": "#000000",
  "3:13": "#000000",
  "4:13": "#000000",
  "5:13": "#000000",
  "6:13": "#000000",
  "8:13": "#000000",
  "9:13": "#000000",
  "10:13": "#000000",
  "11:13": "#000000",
  "12:13": "#000000",
  "13:13": "#000000",
  "14:13": "#000000",
  "15:13": "#000000",
  "16:13": "#000000",
  "17:13": "#000000",
  "18:13": "#000000",
  "19:13": "#000000",
  "20:13": "#000000",
  "21:13": "#000000",
  "22:13": "#FFD700",
  "23:13": "#FFD700",
  "24:13": "#FFD700",
  "25:13": "#FFD700",
  "26:13": "#FFC125",
  "27:13": "#000000",
  "28:13": "#000000",
  "29:13": "#000000",
  "30:13": "#000000",
  "31:13": "#000000",
  "0:14": "#000000",
  "1:14": "#000000",
  "2:14": "#000000",
  "3:14": "#000000",
  "4:14": "#000000",
  "5:14": "#000000",
  "6:14": "#000000",
  "7:14": "#000000",
  "8:14": "#000000",
  "9:14": "#000000",
  "10:14": "#000000",
  "11:14": "#000000",
  "12:14": "#000000",
  "13:14": "#000000",
  "14:14": "#000000",
  "15:14": "#000000",
  "16:14": "#000000",
  "17:14": "#000000",
  "18:14": "#000000",
  "19:14": "#000000",
  "20:14": "#000000",
  "21:14": "#000000",
  "22:14": "#FFD700",
  "23:14": "#FFD700",
  "24:14": "#FFD700",
  "25:14": "#FFD700",
  "26:14": "#FFD700",
  "27:14": "#FFC125",
  "28:14": "#000000",
  "29:14": "#000000",
  "30:14": "#000000",
  "31:14": "#000000",
  "0:15": "#000000",
  "1:15": "#000000",
  "2:15": "#000000",
  "3:15": "#000000",
  "4:15": "#000000",
  "5:15": "#000000",
  "6:15": "#000000",
  "7:15": "#000000",
  "8:15": "#000000",
  "9:15": "#000000",
  "10:15": "#000000",
  "11:15": "#000000",
  "12:15": "#000000",
  "13:15": "#000000",
  "14:15": "#000000",
  "15:15": "#000000",
  "16:15": "#000000",
  "17:15": "#000000",
  "18:15": "#000000",
  "19:15": "#000000",
  "20:15": "#000000",
  "21:15": "#FFE566",
  "22:15": "#FFD700",
  "23:15": "#FFE566",
  "24:15": "#FFD700",
  "25:15": "#FFD700",
  "26:15": "#FFD700",
  "27:15": "#FFC125",
  "28:15": "#000000",
  "29:15": "#000000",
  "30:15": "#000000",
  "31:15": "#000000",
  "0:16": "#000000",
  "1:16": "#000000",
  "2:16": "#000000",
  "3:16": "#000000",
  "4:16": "#000000",
  "5:16": "#000000",
  "6:16": "#000000",
  "7:16": "#000000",
  "8:16": "#000000",
  "9:16": "#000000",
  "10:16": "#000000",
  "11:16": "#000000",
  "12:16": "#000000",
  "13:16": "#000000",
  "14:16": "#000000",
  "15:16": "#000000",
  "16:16": "#000000",
  "17:16": "#000000",
  "18:16": "#000000",
  "19:16": "#000000",
  "20:16": "#000000",
  "21:16": "#FFE566",
  "22:16": "#FFE566",
  "23:16": "#FFD700",
  "24:16": "#FFE566",
  "25:16": "#FFD700",
  "26:16": "#FFD700",
  "27:16": "#FFC125",
  "28:16": "#000000",
  "29:16": "#000000",
  "30:16": "#000000",
  "31:16": "#000000",
  "0:17": "#000000",
  "1:17": "#000000",
  "2:17": "#000000",
  "3:17": "#000000",
  "4:17": "#000000",
  "5:17": "#000000",
  "6:17": "#000000",
  "7:17": "#000000",
  "8:17": "#000000",
  "9:17": "#000000",
  "10:17": "#000000",
  "11:17": "#000000",
  "12:17": "#000000",
  "13:17": "#000000",
  "14:17": "#000000",
  "15:17": "#000000",
  "16:17": "#000000",
  "17:17": "#000000",
  "18:17": "#000000",
  "19:17": "#000000",
  "20:17": "#FFFCC0",
  "21:17": "#FFFCC0",
  "22:17": "#FFD700",
  "23:17": "#FFD700",
  "24:17": "#FFE566",
  "25:17": "#FFD700",
  "26:17": "#FFD700",
  "27:17": "#FFC125",
  "28:17": "#000000",
  "29:17": "#000000",
  "30:17": "#000000",
  "31:17": "#000000",
  "0:18": "#000000",
  "1:18": "#000000",
  "2:18": "#000000",
  "3:18": "#000000",
  "4:18": "#000000",
  "5:18": "#000000",
  "6:18": "#000000",
  "7:18": "#000000",
  "8:18": "#000000",
  "9:18": "#000000",
  "10:18": "#000000",
  "11:18": "#000000",
  "12:18": "#000000",
  "13:18": "#000000",
  "14:18": "#000000",
  "15:18": "#000000",
  "16:18": "#000000",
  "17:18": "#000000",
  "18:18": "#000000",
  "19:18": "#FFD700",
  "20:18": "#FFFCC0",
  "21:18": "#FFFCC0",
  "22:18": "#FFD700",
  "23:18": "#FFE566",
  "24:18": "#FFE566",
  "25:18": "#FFD700",
  "26:18": "#FFD700",
  "27:18": "#FFC125",
  "28:18": "#000000",
  "29:18": "#000000",
  "30:18": "#000000",
  "31:18": "#000000",
  "0:19": "#000000",
  "1:19": "#000000",
  "2:19": "#000000",
  "3:19": "#000000",
  "4:19": "#000000",
  "5:19": "#000000",
  "6:19": "#000000",
  "7:19": "#000000",
  "8:19": "#FFD700",
  "9:19": "#000000",
  "10:19": "#000000",
  "11:19": "#000000",
  "12:19": "#000000",
  "13:19": "#000000",
  "14:19": "#000000",
  "15:19": "#000000",
  "16:19": "#000000",
  "17:19": "#000000",
  "18:19": "#FFFCC0",
  "19:19": "#FFFCC0",
  "20:19": "#FFFCC0",
  "21:19": "#FFFCC0",
  "22:19": "#FFFCC0",
  "23:19": "#FFE566",
  "24:19": "#FFE566",
  "25:19": "#FFD700",
  "26:19": "#FFD700",
  "27:19": "#000000",
  "28:19": "#000000",
  "29:19": "#000000",
  "30:19": "#000000",
  "31:19": "#000000",
  "0:20": "#000000",
  "1:20": "#000000",
  "2:20": "#000000",
  "3:20": "#000000",
  "4:20": "#000000",
  "5:20": "#000000",
  "6:20": "#000000",
  "7:20": "#000000",
  "8:20": "#000000",
  "9:20": "#FFD700",
  "10:20": "#FFD700",
  "11:20": "#FFD700",
  "12:20": "#FFD700",
  "13:20": "#FFD700",
  "14:20": "#FFE566",
  "15:20": "#FFD700",
  "16:20": "#FFFCC0",
  "17:20": "#FFFCC0",
  "18:20": "#FFD700",
  "19:20": "#FFD700",
  "20:20": "#FFFCC0",
  "21:20": "#FFFCC0",
  "22:20": "#FFFCC0",
  "23:20": "#FFE566",
  "24:20": "#FFE566",
  "25:20": "#FFD700",
  "26:20": "#FFD700",
  "27:20": "#000000",
  "28:20": "#000000",
  "29:20": "#000000",
  "30:20": "#000000",
  "31:20": "#000000",
  "0:21": "#000000",
  "1:21": "#000000",
  "2:21": "#000000",
  "3:21": "#000000",
  "4:21": "#000000",
  "5:21": "#000000",
  "6:21": "#000000",
  "7:21": "#000000",
  "8:21": "#000000",
  "9:21": "#FFD700",
  "10:21": "#FFD700",
  "11:21": "#FFD700",
  "12:21": "#FFD700",
  "13:21": "#FFD700",
  "14:21": "#FFE566",
  "15:21": "#FFE566",
  "16:21": "#FFFCC0",
  "17:21": "#FFD700",
  "18:21": "#FFD700",
  "19:21": "#FFD700",
  "20:21": "#FFFCC0",
  "21:21": "#FFFCC0",
  "22:21": "#FFFCC0",
  "23:21": "#FFE566",
  "24:21": "#FFE566",
  "25:21": "#FFD700",
  "26:21": "#FFC125",
  "27:21": "#000000",
  "28:21": "#000000",
  "29:21": "#000000",
  "30:21": "#000000",
  "31:21": "#000000",
  "0:22": "#000000",
  "1:22": "#000000",
  "2:22": "#000000",
  "3:22": "#000000",
  "4:22": "#000000",
  "5:22": "#000000",
  "6:22": "#000000",
  "7:22": "#000000",
  "8:22": "#000000",
  "9:22": "#000000",
  "10:22": "#FFC125",
  "11:22": "#FFC125",
  "12:22": "#FFD700",
  "13:22": "#FFD700",
  "14:22": "#FFD700",
  "15:22": "#FFD700",
  "16:22": "#FFE566",
  "17:22": "#FFFCC0",
  "18:22": "#FFFCC0",
  "19:22": "#FFFCC0",
  "20:22": "#FFFCC0",
  "21:22": "#FFFCC0",
  "22:22": "#FFE566",
  "23:22": "#FFE566",
  "24:22": "#FFD700",
  "25:22": "#FFD700",
  "26:22": "#000000",
  "27:22": "#000000",
  "28:22": "#000000",
  "29:22": "#000000",
  "30:22": "#969696",
  "31:22": "#000000",
  "0:23": "#000000",
  "1:23": "#000000",
  "2:23": "#000000",
  "3:23": "#000000",
  "4:23": "#000000",
  "5:23": "#000000",
  "6:23": "#000000",
  "7:23": "#000000",
  "8:23": "#000000",
  "9:23": "#000000",
  "10:23": "#000000",
  "11:23": "#FFC125",
  "12:23": "#FFC125",
  "13:23": "#FFD700",
  "14:23": "#FFD700",
  "15:23": "#FFE566",
  "16:23": "#FFE566",
  "17:23": "#FFE566",
  "18:23": "#FFE566",
  "19:23": "#FFFCC0",
  "20:23": "#FFFCC0",
  "21:23": "#FFE566",
  "22:23": "#FFE566",
  "23:23": "#FFE566",
  "24:23": "#FFD700",
  "25:23": "#000000",
  "26:23": "#000000",
  "27:23": "#000000",
  "28:23": "#000000",
  "29:23": "#000000",
  "30:23": "#000000",
  "31:23": "#000000",
  "0:24": "#000000",
  "1:24": "#000000",
  "3:24": "#000000",
  "4:24": "#000000",
  "5:24": "#000000",
  "6:24": "#000000",
  "7:24": "#000000",
  "8:24": "#000000",
  "9:24": "#000000",
  "10:24": "#000000",
  "11:24": "#000000",
  "12:24": "#000000",
  "13:24": "#FFC125",
  "14:24": "#FFD700",
  "15:24": "#FFD700",
  "16:24": "#FFE566",
  "17:24": "#FFE566",
  "18:24": "#FFE566",
  "19:24": "#FFE566",
  "20:24": "#FFE566",
  "21:24": "#FFE566",
  "22:24": "#FFE566",
  "23:24": "#FFD700",
  "24:24": "#000000",
  "25:24": "#000000",
  "26:24": "#000000",
  "27:24": "#000000",
  "28:24": "#000000",
  "29:24": "#000000",
  "30:24": "#000000",
  "31:24": "#000000",
  "0:25": "#000000",
  "2:25": "#FFE5EA",
  "4:25": "#000000",
  "5:25": "#000000",
  "6:25": "#000000",
  "7:25": "#000000",
  "8:25": "#000000",
  "9:25": "#000000",
  "10:25": "#000000",
  "11:25": "#000000",
  "12:25": "#000000",
  "13:25": "#000000",
  "14:25": "#FFC125",
  "15:25": "#FFD700",
  "16:25": "#FFD700",
  "17:25": "#FFD700",
  "18:25": "#FFE566",
  "19:25": "#FFE566",
  "20:25": "#FFE566",
  "21:25": "#FFE566",
  "22:25": "#000000",
  "23:25": "#000000",
  "24:25": "#000000",
  "25:25": "#000000",
  "26:25": "#000000",
  "27:25": "#000000",
  "28:25": "#000000",
  "29:25": "#000000",
  "30:25": "#000000",
  "31:25": "#000000",
  "0:26": "#000000",
  "1:26": "#000000",
  "3:26": "#000000",
  "4:26": "#000000",
  "5:26": "#000000",
  "6:26": "#000000",
  "7:26": "#000000",
  "8:26": "#000000",
  "9:26": "#000000",
  "10:26": "#000000",
  "11:26": "#000000",
  "12:26": "#000000",
  "13:26": "#000000",
  "14:26": "#000000",
  "15:26": "#000000",
  "16:26": "#000000",
  "17:26": "#000000",
  "18:26": "#000000",
  "19:26": "#000000",
  "20:26": "#000000",
  "21:26": "#000000",
  "22:26": "#000000",
  "23:26": "#000000",
  "24:26": "#000000",
  "25:26": "#000000",
  "26:26": "#000000",
  "27:26": "#000000",
  "29:26": "#000000",
  "30:26": "#000000",
  "31:26": "#000000",
  "0:27": "#000000",
  "1:27": "#000000",
  "2:27": "#000000",
  "3:27": "#000000",
  "4:27": "#000000",
  "5:27": "#000000",
  "6:27": "#000000",
  "7:27": "#000000",
  "8:27": "#000000",
  "9:27": "#000000",
  "10:27": "#000000",
  "11:27": "#000000",
  "12:27": "#000000",
  "13:27": "#000000",
  "14:27": "#000000",
  "15:27": "#000000",
  "16:27": "#000000",
  "17:27": "#000000",
  "18:27": "#000000",
  "19:27": "#000000",
  "20:27": "#000000",
  "21:27": "#000000",
  "22:27": "#000000",
  "23:27": "#000000",
  "24:27": "#000000",
  "25:27": "#000000",
  "26:27": "#000000",
  "28:27": "#FFFFFF",
  "30:27": "#000000",
  "31:27": "#000000",
  "0:28": "#000000",
  "1:28": "#000000",
  "2:28": "#000000",
  "3:28": "#000000",
  "4:28": "#000000",
  "5:28": "#000000",
  "6:28": "#000000",
  "7:28": "#000000",
  "8:28": "#FFFAFA",
  "9:28": "#000000",
  "10:28": "#000000",
  "11:28": "#000000",
  "12:28": "#000000",
  "13:28": "#000000",
  "14:28": "#000000",
  "15:28": "#000000",
  "16:28": "#000000",
  "17:28": "#000000",
  "18:28": "#000000",
  "19:28": "#000000",
  "20:28": "#000000",
  "21:28": "#000000",
  "22:28": "#000000",
  "23:28": "#FFF5FA",
  "24:28": "#000000",
  "25:28": "#000000",
  "26:28": "#000000",
  "27:28": "#000000",
  "30:28": "#000000",
  "31:28": "#000000",
  "0:29": "#000000",
  "1:29": "#000000",
  "2:29": "#000000",
  "3:29": "#000000",
  "4:29": "#000000",
  "5:29": "#000000",
  "6:29": "#000000",
  "7:29": "#000000",
  "8:29": "#000000",
  "9:29": "#000000",
  "10:29": "#000000",
  "11:29": "#000000",
  "12:29": "#969696",
  "13:29": "#000000",
  "14:29": "#000000",
  "15:29": "#000000",
  "16:29": "#000000",
  "17:29": "#000000",
  "18:29": "#000000",
  "19:29": "#000000",
  "20:29": "#000000",
  "21:29": "#000000",
  "22:29": "#000000",
  "23:29": "#000000",
  "24:29": "#000000",
  "25:29": "#000000",
  "26:29": "#000000",
  "27:29": "#000000",
  "31:29": "#000000",
  "0:30": "#000000",
  "1:30": "#000000",
  "2:30": "#000000",
  "3:30": "#000000",
  "4:30": "#000000",
  "5:30": "#000000",
  "6:30": "#000000",
  "7:30": "#000000",
  "8:30": "#000000",
  "9:30": "#000000",
  "10:30": "#000000",
  "11:30": "#000000",
  "12:30": "#000000",
  "13:30": "#000000",
  "14:30": "#000000",
  "15:30": "#000000",
  "16:30": "#000000",
  "17:30": "#000000",
  "18:30": "#000000",
  "19:30": "#000000",
  "20:30": "#000000",
  "21:30": "#000000",
  "22:30": "#000000",
  "23:30": "#000000",
  "24:30": "#000000",
  "25:30": "#000000",
  "26:30": "#000000",
  "27:30": "#000000",
  "28:30": "#000000",
  "30:30": "#000000",
  "31:30": "#000000",
  "0:31": "#000000",
  "1:31": "#000000",
  "2:31": "#000000",
  "3:31": "#000000",
  "4:31": "#000000",
  "5:31": "#000000",
  "6:31": "#000000",
  "7:31": "#000000",
  "8:31": "#000000",
  "9:31": "#000000",
  "10:31": "#000000",
  "11:31": "#000000",
  "12:31": "#000000",
  "13:31": "#000000",
  "14:31": "#000000",
  "15:31": "#000000",
  "16:31": "#000000",
  "17:31": "#000000",
  "18:31": "#000000",
  "19:31": "#000000",
  "20:31": "#000000",
  "21:31": "#000000",
  "22:31": "#000000",
  "23:31": "#000000",
  "24:31": "#000000",
  "25:31": "#000000",
  "26:31": "#000000",
  "27:31": "#000000",
  "28:31": "#000000",
  "29:31": "#000000",
  "30:31": "#000000",
  "31:31": "#000000"
};

// src/display-engine/macros/moon.ts
var PULSE_DURATION = 1;
var DELAY_BETWEEN_PIXELS = 1;
var MAX_ALPHA = 255;
var SEQUENCE_DELAY = 5;
var TOTAL_PIXELS = 4;
var SEQUENCE_DURATION = TOTAL_PIXELS * DELAY_BETWEEN_PIXELS + PULSE_DURATION;
var TOTAL_CYCLE_DURATION = SEQUENCE_DURATION + SEQUENCE_DELAY;
var GLOW_RGB = [15, 10, 222];
var TWINKLE_STARS = [
  { y: 6, x: 5 },
  { y: 9, x: 15 },
  { y: 22, x: 30 },
  { y: 29, x: 12 }
];
function shuffle(unshuffled) {
  return unshuffled.map((value) => ({ ...value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map((value) => value);
}
var startMoon = async ({
  dimensions,
  ctx,
  index,
  updatePixels
}) => {
  const coordinatesConfig = {
    coordinates: moon
  };
  let timeoutId;
  let running = true;
  let twinkleStars = shuffle(TWINKLE_STARS);
  let lastTime2 = 0;
  let accumulator = 0;
  startCoordinates({
    dimensions,
    ctx,
    index,
    updatePixels,
    macroConfig: coordinatesConfig
  });
  function runMoon(currentTime) {
    if (accumulator > TOTAL_CYCLE_DURATION) {
      accumulator = 0;
      twinkleStars = shuffle(TWINKLE_STARS);
    }
    const deltaTime = (currentTime - lastTime2) / 1e3;
    lastTime2 = currentTime;
    accumulator += deltaTime;
    const sequenceTime = accumulator % TOTAL_CYCLE_DURATION;
    const pixels = [];
    for (let i = 0; i < TOTAL_PIXELS; i++) {
      const pixelStartTime = i * DELAY_BETWEEN_PIXELS;
      const pixelTime = sequenceTime - pixelStartTime;
      if (pixelTime < 0 || pixelTime > PULSE_DURATION || sequenceTime > SEQUENCE_DURATION) {
        const rgba = new Uint8ClampedArray([255, 255, 255, 0]);
        const star = twinkleStars[i];
        pixels.push(
          { ...star, rgba },
          { ...star, y: star.y + 1, rgba },
          { ...star, y: star.y - 1, rgba },
          { ...star, x: star.x + 1, rgba },
          { ...star, x: star.x - 1, rgba }
        );
      } else {
        const alpha = Math.sin(pixelTime / PULSE_DURATION * Math.PI) * MAX_ALPHA;
        const star = twinkleStars[i];
        const starRgba = new Uint8ClampedArray([255, 255, 255, alpha]);
        const glowRgba = new Uint8ClampedArray([...GLOW_RGB, alpha / 2]);
        pixels.push(
          { ...star, rgba: starRgba },
          {
            ...star,
            y: star.y + 1,
            rgba: glowRgba
          },
          {
            ...star,
            y: star.y - 1,
            rgba: glowRgba
          },
          {
            ...star,
            x: star.x + 1,
            rgba: glowRgba
          },
          {
            ...star,
            x: star.x - 1,
            rgba: glowRgba
          }
        );
      }
    }
    if (running) {
      updatePixels(pixels, index + 1);
      timeoutId = getAnimationFrame(runMoon);
    }
  }
  const startTime = performance.now();
  runMoon(startTime);
  return () => {
    running = false;
    stopAnimationFrame(timeoutId);
  };
};

// src/display-engine/macros/countdown.ts
var colors = ["#6aa84f", "#fa6a31", "#2e7fc8", "#ffc332", "#218787"];
var startCountdown = async ({
  macroConfig,
  dimensions,
  ctx,
  index,
  updatePixels
}) => {
  const config = {
    color: "#fff",
    width: dimensions.width,
    height: dimensions.height,
    ...macroConfig
  };
  const interval = setInterval(() => {
    const minutes = Math.floor(
      (new Date(config.endDate).getTime() - (/* @__PURE__ */ new Date()).getTime()) / (1e3 * 60) + 1
    );
    const textMetrics = ctx.measureText(`${minutes}`);
    const height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    ctx.clearRect(0, 0, config.width, config.height);
    ctx.fillStyle = colors[minutes - 1];
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    ctx.textBaseline = "top";
    ctx.font = `24px Arial`;
    ctx.fillStyle = config.color;
    ctx.fillText(
      `${minutes}`,
      config.width / 2 - textMetrics.width / 2,
      config.height / 2 - height / 2
    );
    const pixels = syncFromCanvas(ctx, dimensions);
    updatePixels(pixels, index);
  }, 250);
  return () => clearInterval(interval);
};

// src/display-engine/index.ts
var twinkle = (macroConfig) => ({
  macroName: "twinkle" /* Twinkle */,
  macroConfig
});
var box = (macroConfig) => ({
  macroName: "box" /* Box */,
  macroConfig
});
var text = (macroConfig) => ({
  macroName: "text" /* Text */,
  macroConfig
});
var ripple = (macroConfig) => ({
  macroName: "ripple" /* Ripple */,
  macroConfig
});
var moon2 = (macroConfig) => ({
  macroName: "moon" /* Moon */,
  macroConfig
});
var coordinates = (macroConfig) => ({
  macroName: "coordinates" /* Coordinates */,
  macroConfig
});
var countdown = (macroConfig) => ({
  macroName: "countdown" /* Countdown */,
  macroConfig
});
async function startMacros({
  macros,
  dimensions,
  updatePixels
}) {
  const MacroMap = {
    ["box" /* Box */]: startBox,
    ["text" /* Text */]: startText,
    ["marquee" /* Marquee */]: startMarquee,
    ["twinkle" /* Twinkle */]: startTwinkle,
    ["ripple" /* Ripple */]: startRipple,
    ["image" /* Image */]: startImage,
    ["meteors" /* Meteors */]: startMeteors,
    ["custom" /* Custom */]: startCustom,
    ["coordinates" /* Coordinates */]: startCoordinates,
    ["moon" /* Moon */]: startMoon,
    ["countdown" /* Countdown */]: startCountdown
  };
  const stops = await Promise.all(
    macros.map(({ macroName, macroConfig }, index) => {
      const { ctx } = buildCanvas(dimensions);
      const macroFn = MacroMap[macroName];
      return macroFn({
        macroConfig,
        dimensions,
        ctx,
        index,
        updatePixels
      });
    })
  );
  return () => {
    for (const stop of stops) {
      stop();
    }
  };
}
var buildPixelMap = ({ height, width }) => {
  const pixelMap = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push([]);
    }
    pixelMap.push(row);
  }
  return pixelMap;
};
function createDisplayEngine({
  dimensions,
  onPixelsChange
}) {
  let stopMacros = () => {
  };
  return {
    render: async (macros) => {
      stopMacros();
      const resetPixels = [];
      for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
          resetPixels.push({
            x,
            y,
            rgba: new Uint8ClampedArray([0, 0, 0, 255])
          });
        }
      }
      onPixelsChange(resetPixels);
      const pixelMap = buildPixelMap(dimensions);
      stopMacros = await startMacros({
        macros,
        dimensions,
        updatePixels: (updatePixels, index) => {
          const pixelsToUpdate = [];
          updatePixels.forEach((pixelToUpdate) => {
            const { y, x } = pixelToUpdate;
            const pixelStack = pixelMap?.[y]?.[x];
            if (!pixelStack) return;
            pixelStack[index] = pixelToUpdate;
            const rgba = pixelStack.reduce(
              (baseColor, pixel) => {
                return mixColors({ newColor: pixel.rgba, baseColor });
              },
              new Uint8ClampedArray([0, 0, 0, 255])
            );
            pixelsToUpdate.push({
              ...pixelToUpdate,
              rgba
            });
          });
          onPixelsChange(pixelsToUpdate);
        }
      });
      return stopMacros;
    },
    stop: () => {
      stopMacros();
    }
  };
}

// src/helpers/getEndDate.ts
function getEndDate(preset) {
  const endDate = /* @__PURE__ */ new Date();
  if (preset.mode === "until") {
    const day = parseInt(preset.untilDay, 10);
    const hour = parseInt(preset.untilHour, 10);
    const minute = parseInt(preset.untilMinute, 10);
    endDate.setDate(endDate.getDate() + day);
    endDate.setHours(hour, minute, 0, 0);
  } else if (preset.mode === "for") {
    const [h, m] = preset.forTime.split(":");
    const hour = parseInt(h, 10);
    const minute = parseInt(m, 10);
    if (hour === 0 && minute === 0) {
      return null;
    }
    endDate.setHours(
      endDate.getHours() + hour,
      endDate.getMinutes() + minute,
      0,
      0
    );
  }
  return endDate;
}

// src/server/queries.ts
var import_fs2 = __toESM(require("fs"), 1);
async function getCustomScenes() {
  return import_fs2.default.readdirSync(customScenesPath()).map((file) => {
    const name = file.split(".")[0];
    const coordinates2 = JSON.parse(
      import_fs2.default.readFileSync(`${customScenesPath()}/${name}.json`).toString()
    );
    return { name, coordinates: coordinates2 };
  });
}

// src/server/actions/transformPresetToDisplayMacros.ts
async function transformPresetToDisplayMacros(preset) {
  if (!preset) return [];
  const nestedMacros = await Promise.all(
    preset.scenes.flatMap(async ({ sceneName, sceneConfig }) => {
      if (sceneName === "blank" /* Blank */) {
        return [box({ backgroundColor: "#000000" })];
      }
      if (sceneName === "moon" /* Moon */) {
        return [moon2({})];
      }
      if (sceneName === "ripple" /* Ripple */) {
        return [
          ripple({
            ...sceneConfig,
            speed: sceneConfig.speed / 10,
            waveHeight: sceneConfig.waveHeight / 10
          })
        ];
      }
      if (sceneName === "countdown" /* Countdown */) {
        const endDate = getEndDate(preset);
        if (endDate) {
          return [countdown({ endDate: endDate.toJSON() })];
        } else {
          return [text({ text: "no\n date" })];
        }
      }
      if (sceneName === "twinkle" /* Twinkle */) {
        return [
          twinkle({
            ...sceneConfig,
            speed: 51 - sceneConfig.speed / 2,
            amount: sceneConfig.amount * 10
          })
        ];
      }
      if (sceneName === TriggerHardwareReloadScene) {
        return [box({ backgroundColor: "#000000" })];
      }
      const customScenes = await getCustomScenes();
      const customScene = customScenes.find(
        (scene) => scene.name === sceneName
      );
      if (customScene) {
        return [coordinates({ coordinates: customScene?.coordinates })];
      }
      return [
        text({
          text: "?",
          startingColumn: 11,
          startingRow: 8,
          fontSize: 20,
          color: "#888"
        })
      ];
    })
  );
  return nestedMacros.flat();
}

// hardware/checkForNewDisplayConfig.ts
function sceneMatch(preset1, preset2) {
  return JSON.stringify(preset1?.scenes) === JSON.stringify(preset2?.scenes);
}
function getSceneName(preset) {
  return preset?.scenes?.[0].sceneName;
}
async function checkForNewDisplayConfig() {
  try {
    import_fs3.default.writeFileSync(heartBeatFile(), (/* @__PURE__ */ new Date()).toJSON(), {
      mode: 510
    });
    const { scheduledPreset, panel, hardware } = await getData();
    if (!scheduledPreset?.preset) {
      if (!sceneMatch(hardware?.preset, panel.defaultPreset)) {
        console.log(
          `[RERENDER] Default Preset change (${getSceneName(
            hardware?.preset
          )} to ${getSceneName(panel.defaultPreset)})`
        );
        const preset = panel.defaultPreset;
        const renderedAt = (/* @__PURE__ */ new Date()).toJSON();
        await setData({ hardware: { preset, renderedAt } });
        return transformPresetToDisplayMacros(preset);
      }
      return null;
    }
    if (scheduledPreset.endTime !== null && (/* @__PURE__ */ new Date()).getTime() > new Date(scheduledPreset.endTime).getTime()) {
      console.log(`[CLEAR] ${scheduledPreset.preset.name} has expired`);
      const preset = panel.defaultPreset;
      const renderedAt = (/* @__PURE__ */ new Date()).toJSON();
      await setData({
        scheduledPreset: null,
        hardware: { preset, renderedAt }
      });
      return transformPresetToDisplayMacros(preset);
    }
    if (!sceneMatch(scheduledPreset.preset, hardware.preset)) {
      console.log(
        `[UPDATE] Rerendering ${scheduledPreset.preset["name" /* Name */]} until ${scheduledPreset.endTime}`
      );
      const preset = scheduledPreset.preset;
      const renderedAt = (/* @__PURE__ */ new Date()).toJSON();
      await setData({ hardware: { preset, renderedAt } });
      return transformPresetToDisplayMacros(preset);
    }
  } catch (e) {
    console.log("Error!", e);
  }
  return null;
}

// hardware/index.ts
(async () => {
  const args = process.argv.slice(2);
  const params = { emulate: false };
  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const key = arg.substring(2);
      params[key] = true;
    }
  });
  const { panel, hardware } = await getData();
  const updateQueue = [];
  function RGBAToHexA(rgba, forceRemoveAlpha = false) {
    const hexValues = [...rgba].filter((_number, index) => !forceRemoveAlpha || index !== 3).map((number, index) => index === 3 ? Math.round(number * 255) : number).map((number) => number.toString(16));
    return hexValues.map((string) => string.length === 1 ? "0" + string : string).join("");
  }
  if (!params.emulate) {
    console.log("Starting Hardware...");
    const matrix = new import_rpi_led_matrix.LedMatrix(
      {
        ...import_rpi_led_matrix.LedMatrix.defaultMatrixOptions(),
        rows: 32,
        cols: 32,
        chainLength: 1,
        hardwareMapping: import_rpi_led_matrix.GpioMapping.Regular,
        pwmLsbNanoseconds: panel["pwnLsbNanoseconds" /* PwnLsbNanoseconds */],
        pwmBits: panel["pwmBits" /* PwmBits */]
      },
      {
        ...import_rpi_led_matrix.LedMatrix.defaultRuntimeOptions(),
        gpioSlowdown: panel["gpioSlowdown" /* GpioSlowdown */]
      }
    );
    matrix.afterSync(() => {
      const pixelUpdates = updateQueue.shift();
      if (pixelUpdates) {
        for (const pixel of pixelUpdates) {
          matrix.brightness(panel["brightness" /* Brightness */]).fgColor(
            parseInt(pixel.rgba ? RGBAToHexA(pixel.rgba, true) : "000000", 16)
          ).setPixel(pixel.x, pixel.y);
        }
      }
      setTimeout(() => matrix.sync(), 0);
    });
    matrix.sync();
  } else {
    console.log("Skipping hardware...");
  }
  const engine = createDisplayEngine({
    dimensions: { width: 32, height: 32 },
    onPixelsChange: (pixels) => {
      updateQueue.push(pixels);
    }
  });
  engine.render(await transformPresetToDisplayMacros(hardware.preset));
  setInterval(async () => {
    const displayConfig = await checkForNewDisplayConfig();
    if (displayConfig) {
      engine.render(displayConfig);
    }
  }, 2e3);
})();
/*! Bundled license information:

canvas/lib/context2d.js:
  (*!
   * Canvas - Context2d
   * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
   * MIT Licensed
   *)

canvas/lib/pngstream.js:
  (*!
   * Canvas - PNGStream
   * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
   * MIT Licensed
   *)

canvas/lib/pdfstream.js:
  (*!
   * Canvas - PDFStream
   *)

canvas/lib/jpegstream.js:
  (*!
   * Canvas - JPEGStream
   * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
   * MIT Licensed
   *)

canvas/lib/canvas.js:
  (*!
   * Canvas
   * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
   * MIT Licensed
   *)

simple-concat/index.js:
  (*! simple-concat. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

canvas/lib/image.js:
  (*!
   * Canvas - Image
   * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
   * MIT Licensed
   *)

canvas/lib/pattern.js:
  (*!
   * Canvas - CanvasPattern
   * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
   * MIT Licensed
   *)
*/
