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

// node_modules/commander/lib/error.js
var require_error = __commonJS({
  "node_modules/commander/lib/error.js"(exports2) {
    var CommanderError2 = class extends Error {
      /**
       * Constructs the CommanderError class
       * @param {number} exitCode suggested exit code which could be used with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       */
      constructor(exitCode, code, message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.exitCode = exitCode;
        this.nestedError = void 0;
      }
    };
    var InvalidArgumentError2 = class extends CommanderError2 {
      /**
       * Constructs the InvalidArgumentError class
       * @param {string} [message] explanation of why argument is invalid
       */
      constructor(message) {
        super(1, "commander.invalidArgument", message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
      }
    };
    exports2.CommanderError = CommanderError2;
    exports2.InvalidArgumentError = InvalidArgumentError2;
  }
});

// node_modules/commander/lib/argument.js
var require_argument = __commonJS({
  "node_modules/commander/lib/argument.js"(exports2) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Argument2 = class {
      /**
       * Initialize a new command argument with the given name and description.
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @param {string} name
       * @param {string} [description]
       */
      constructor(name, description) {
        this.description = description || "";
        this.variadic = false;
        this.parseArg = void 0;
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.argChoices = void 0;
        switch (name[0]) {
          case "<":
            this.required = true;
            this._name = name.slice(1, -1);
            break;
          case "[":
            this.required = false;
            this._name = name.slice(1, -1);
            break;
          default:
            this.required = true;
            this._name = name;
            break;
        }
        if (this._name.length > 3 && this._name.slice(-3) === "...") {
          this.variadic = true;
          this._name = this._name.slice(0, -3);
        }
      }
      /**
       * Return argument name.
       *
       * @return {string}
       */
      name() {
        return this._name;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Argument}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Set the custom handler for processing CLI command arguments into argument values.
       *
       * @param {Function} [fn]
       * @return {Argument}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Only allow argument value to be one of choices.
       *
       * @param {string[]} values
       * @return {Argument}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Make argument required.
       *
       * @returns {Argument}
       */
      argRequired() {
        this.required = true;
        return this;
      }
      /**
       * Make argument optional.
       *
       * @returns {Argument}
       */
      argOptional() {
        this.required = false;
        return this;
      }
    };
    function humanReadableArgName(arg) {
      const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
      return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
    }
    exports2.Argument = Argument2;
    exports2.humanReadableArgName = humanReadableArgName;
  }
});

// node_modules/commander/lib/help.js
var require_help = __commonJS({
  "node_modules/commander/lib/help.js"(exports2) {
    var { humanReadableArgName } = require_argument();
    var Help2 = class {
      constructor() {
        this.helpWidth = void 0;
        this.sortSubcommands = false;
        this.sortOptions = false;
        this.showGlobalOptions = false;
      }
      /**
       * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
       *
       * @param {Command} cmd
       * @returns {Command[]}
       */
      visibleCommands(cmd) {
        const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
        const helpCommand = cmd._getHelpCommand();
        if (helpCommand && !helpCommand._hidden) {
          visibleCommands.push(helpCommand);
        }
        if (this.sortSubcommands) {
          visibleCommands.sort((a, b) => {
            return a.name().localeCompare(b.name());
          });
        }
        return visibleCommands;
      }
      /**
       * Compare options for sort.
       *
       * @param {Option} a
       * @param {Option} b
       * @returns {number}
       */
      compareOptions(a, b) {
        const getSortKey = (option) => {
          return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
        };
        return getSortKey(a).localeCompare(getSortKey(b));
      }
      /**
       * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleOptions(cmd) {
        const visibleOptions = cmd.options.filter((option) => !option.hidden);
        const helpOption = cmd._getHelpOption();
        if (helpOption && !helpOption.hidden) {
          const removeShort = helpOption.short && cmd._findOption(helpOption.short);
          const removeLong = helpOption.long && cmd._findOption(helpOption.long);
          if (!removeShort && !removeLong) {
            visibleOptions.push(helpOption);
          } else if (helpOption.long && !removeLong) {
            visibleOptions.push(
              cmd.createOption(helpOption.long, helpOption.description)
            );
          } else if (helpOption.short && !removeShort) {
            visibleOptions.push(
              cmd.createOption(helpOption.short, helpOption.description)
            );
          }
        }
        if (this.sortOptions) {
          visibleOptions.sort(this.compareOptions);
        }
        return visibleOptions;
      }
      /**
       * Get an array of the visible global options. (Not including help.)
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleGlobalOptions(cmd) {
        if (!this.showGlobalOptions) return [];
        const globalOptions = [];
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          const visibleOptions = ancestorCmd.options.filter(
            (option) => !option.hidden
          );
          globalOptions.push(...visibleOptions);
        }
        if (this.sortOptions) {
          globalOptions.sort(this.compareOptions);
        }
        return globalOptions;
      }
      /**
       * Get an array of the arguments if any have a description.
       *
       * @param {Command} cmd
       * @returns {Argument[]}
       */
      visibleArguments(cmd) {
        if (cmd._argsDescription) {
          cmd.registeredArguments.forEach((argument) => {
            argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
          });
        }
        if (cmd.registeredArguments.find((argument) => argument.description)) {
          return cmd.registeredArguments;
        }
        return [];
      }
      /**
       * Get the command term to show in the list of subcommands.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandTerm(cmd) {
        const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
        return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
        (args ? " " + args : "");
      }
      /**
       * Get the option term to show in the list of options.
       *
       * @param {Option} option
       * @returns {string}
       */
      optionTerm(option) {
        return option.flags;
      }
      /**
       * Get the argument term to show in the list of arguments.
       *
       * @param {Argument} argument
       * @returns {string}
       */
      argumentTerm(argument) {
        return argument.name();
      }
      /**
       * Get the longest command term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestSubcommandTermLength(cmd, helper) {
        return helper.visibleCommands(cmd).reduce((max, command) => {
          return Math.max(max, helper.subcommandTerm(command).length);
        }, 0);
      }
      /**
       * Get the longest option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestOptionTermLength(cmd, helper) {
        return helper.visibleOptions(cmd).reduce((max, option) => {
          return Math.max(max, helper.optionTerm(option).length);
        }, 0);
      }
      /**
       * Get the longest global option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestGlobalOptionTermLength(cmd, helper) {
        return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
          return Math.max(max, helper.optionTerm(option).length);
        }, 0);
      }
      /**
       * Get the longest argument term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestArgumentTermLength(cmd, helper) {
        return helper.visibleArguments(cmd).reduce((max, argument) => {
          return Math.max(max, helper.argumentTerm(argument).length);
        }, 0);
      }
      /**
       * Get the command usage to be displayed at the top of the built-in help.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandUsage(cmd) {
        let cmdName = cmd._name;
        if (cmd._aliases[0]) {
          cmdName = cmdName + "|" + cmd._aliases[0];
        }
        let ancestorCmdNames = "";
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
        }
        return ancestorCmdNames + cmdName + " " + cmd.usage();
      }
      /**
       * Get the description for the command.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandDescription(cmd) {
        return cmd.description();
      }
      /**
       * Get the subcommand summary to show in the list of subcommands.
       * (Fallback to description for backwards compatibility.)
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandDescription(cmd) {
        return cmd.summary() || cmd.description();
      }
      /**
       * Get the option description to show in the list of options.
       *
       * @param {Option} option
       * @return {string}
       */
      optionDescription(option) {
        const extraInfo = [];
        if (option.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (option.defaultValue !== void 0) {
          const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
          if (showDefault) {
            extraInfo.push(
              `default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`
            );
          }
        }
        if (option.presetArg !== void 0 && option.optional) {
          extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
        }
        if (option.envVar !== void 0) {
          extraInfo.push(`env: ${option.envVar}`);
        }
        if (extraInfo.length > 0) {
          return `${option.description} (${extraInfo.join(", ")})`;
        }
        return option.description;
      }
      /**
       * Get the argument description to show in the list of arguments.
       *
       * @param {Argument} argument
       * @return {string}
       */
      argumentDescription(argument) {
        const extraInfo = [];
        if (argument.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (argument.defaultValue !== void 0) {
          extraInfo.push(
            `default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`
          );
        }
        if (extraInfo.length > 0) {
          const extraDescripton = `(${extraInfo.join(", ")})`;
          if (argument.description) {
            return `${argument.description} ${extraDescripton}`;
          }
          return extraDescripton;
        }
        return argument.description;
      }
      /**
       * Generate the built-in help text.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {string}
       */
      formatHelp(cmd, helper) {
        const termWidth = helper.padWidth(cmd, helper);
        const helpWidth = helper.helpWidth || 80;
        const itemIndentWidth = 2;
        const itemSeparatorWidth = 2;
        function formatItem(term, description) {
          if (description) {
            const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
            return helper.wrap(
              fullText,
              helpWidth - itemIndentWidth,
              termWidth + itemSeparatorWidth
            );
          }
          return term;
        }
        function formatList(textArray) {
          return textArray.join("\n").replace(/^/gm, " ".repeat(itemIndentWidth));
        }
        let output = [`Usage: ${helper.commandUsage(cmd)}`, ""];
        const commandDescription = helper.commandDescription(cmd);
        if (commandDescription.length > 0) {
          output = output.concat([
            helper.wrap(commandDescription, helpWidth, 0),
            ""
          ]);
        }
        const argumentList = helper.visibleArguments(cmd).map((argument) => {
          return formatItem(
            helper.argumentTerm(argument),
            helper.argumentDescription(argument)
          );
        });
        if (argumentList.length > 0) {
          output = output.concat(["Arguments:", formatList(argumentList), ""]);
        }
        const optionList = helper.visibleOptions(cmd).map((option) => {
          return formatItem(
            helper.optionTerm(option),
            helper.optionDescription(option)
          );
        });
        if (optionList.length > 0) {
          output = output.concat(["Options:", formatList(optionList), ""]);
        }
        if (this.showGlobalOptions) {
          const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
            return formatItem(
              helper.optionTerm(option),
              helper.optionDescription(option)
            );
          });
          if (globalOptionList.length > 0) {
            output = output.concat([
              "Global Options:",
              formatList(globalOptionList),
              ""
            ]);
          }
        }
        const commandList = helper.visibleCommands(cmd).map((cmd2) => {
          return formatItem(
            helper.subcommandTerm(cmd2),
            helper.subcommandDescription(cmd2)
          );
        });
        if (commandList.length > 0) {
          output = output.concat(["Commands:", formatList(commandList), ""]);
        }
        return output.join("\n");
      }
      /**
       * Calculate the pad width from the maximum term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      padWidth(cmd, helper) {
        return Math.max(
          helper.longestOptionTermLength(cmd, helper),
          helper.longestGlobalOptionTermLength(cmd, helper),
          helper.longestSubcommandTermLength(cmd, helper),
          helper.longestArgumentTermLength(cmd, helper)
        );
      }
      /**
       * Wrap the given string to width characters per line, with lines after the first indented.
       * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
       *
       * @param {string} str
       * @param {number} width
       * @param {number} indent
       * @param {number} [minColumnWidth=40]
       * @return {string}
       *
       */
      wrap(str, width, indent, minColumnWidth = 40) {
        const indents = " \\f\\t\\v\xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF";
        const manualIndent = new RegExp(`[\\n][${indents}]+`);
        if (str.match(manualIndent)) return str;
        const columnWidth = width - indent;
        if (columnWidth < minColumnWidth) return str;
        const leadingStr = str.slice(0, indent);
        const columnText = str.slice(indent).replace("\r\n", "\n");
        const indentString = " ".repeat(indent);
        const zeroWidthSpace = "\u200B";
        const breaks = `\\s${zeroWidthSpace}`;
        const regex = new RegExp(
          `
|.{1,${columnWidth - 1}}([${breaks}]|$)|[^${breaks}]+?([${breaks}]|$)`,
          "g"
        );
        const lines = columnText.match(regex) || [];
        return leadingStr + lines.map((line, i) => {
          if (line === "\n") return "";
          return (i > 0 ? indentString : "") + line.trimEnd();
        }).join("\n");
      }
    };
    exports2.Help = Help2;
  }
});

// node_modules/commander/lib/option.js
var require_option = __commonJS({
  "node_modules/commander/lib/option.js"(exports2) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Option2 = class {
      /**
       * Initialize a new `Option` with the given `flags` and `description`.
       *
       * @param {string} flags
       * @param {string} [description]
       */
      constructor(flags, description) {
        this.flags = flags;
        this.description = description || "";
        this.required = flags.includes("<");
        this.optional = flags.includes("[");
        this.variadic = /\w\.\.\.[>\]]$/.test(flags);
        this.mandatory = false;
        const optionFlags = splitOptionFlags(flags);
        this.short = optionFlags.shortFlag;
        this.long = optionFlags.longFlag;
        this.negate = false;
        if (this.long) {
          this.negate = this.long.startsWith("--no-");
        }
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.presetArg = void 0;
        this.envVar = void 0;
        this.parseArg = void 0;
        this.hidden = false;
        this.argChoices = void 0;
        this.conflictsWith = [];
        this.implied = void 0;
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Option}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Preset to use when option used without option-argument, especially optional but also boolean and negated.
       * The custom processing (parseArg) is called.
       *
       * @example
       * new Option('--color').default('GREYSCALE').preset('RGB');
       * new Option('--donate [amount]').preset('20').argParser(parseFloat);
       *
       * @param {*} arg
       * @return {Option}
       */
      preset(arg) {
        this.presetArg = arg;
        return this;
      }
      /**
       * Add option name(s) that conflict with this option.
       * An error will be displayed if conflicting options are found during parsing.
       *
       * @example
       * new Option('--rgb').conflicts('cmyk');
       * new Option('--js').conflicts(['ts', 'jsx']);
       *
       * @param {(string | string[])} names
       * @return {Option}
       */
      conflicts(names) {
        this.conflictsWith = this.conflictsWith.concat(names);
        return this;
      }
      /**
       * Specify implied option values for when this option is set and the implied options are not.
       *
       * The custom processing (parseArg) is not called on the implied values.
       *
       * @example
       * program
       *   .addOption(new Option('--log', 'write logging information to file'))
       *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
       *
       * @param {object} impliedOptionValues
       * @return {Option}
       */
      implies(impliedOptionValues) {
        let newImplied = impliedOptionValues;
        if (typeof impliedOptionValues === "string") {
          newImplied = { [impliedOptionValues]: true };
        }
        this.implied = Object.assign(this.implied || {}, newImplied);
        return this;
      }
      /**
       * Set environment variable to check for option value.
       *
       * An environment variable is only used if when processed the current option value is
       * undefined, or the source of the current value is 'default' or 'config' or 'env'.
       *
       * @param {string} name
       * @return {Option}
       */
      env(name) {
        this.envVar = name;
        return this;
      }
      /**
       * Set the custom handler for processing CLI option arguments into option values.
       *
       * @param {Function} [fn]
       * @return {Option}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Whether the option is mandatory and must have a value after parsing.
       *
       * @param {boolean} [mandatory=true]
       * @return {Option}
       */
      makeOptionMandatory(mandatory = true) {
        this.mandatory = !!mandatory;
        return this;
      }
      /**
       * Hide option in help.
       *
       * @param {boolean} [hide=true]
       * @return {Option}
       */
      hideHelp(hide = true) {
        this.hidden = !!hide;
        return this;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Only allow option value to be one of choices.
       *
       * @param {string[]} values
       * @return {Option}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Return option name.
       *
       * @return {string}
       */
      name() {
        if (this.long) {
          return this.long.replace(/^--/, "");
        }
        return this.short.replace(/^-/, "");
      }
      /**
       * Return option name, in a camelcase format that can be used
       * as a object attribute key.
       *
       * @return {string}
       */
      attributeName() {
        return camelcase(this.name().replace(/^no-/, ""));
      }
      /**
       * Check if `arg` matches the short or long flag.
       *
       * @param {string} arg
       * @return {boolean}
       * @package
       */
      is(arg) {
        return this.short === arg || this.long === arg;
      }
      /**
       * Return whether a boolean option.
       *
       * Options are one of boolean, negated, required argument, or optional argument.
       *
       * @return {boolean}
       * @package
       */
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    };
    var DualOptions = class {
      /**
       * @param {Option[]} options
       */
      constructor(options) {
        this.positiveOptions = /* @__PURE__ */ new Map();
        this.negativeOptions = /* @__PURE__ */ new Map();
        this.dualOptions = /* @__PURE__ */ new Set();
        options.forEach((option) => {
          if (option.negate) {
            this.negativeOptions.set(option.attributeName(), option);
          } else {
            this.positiveOptions.set(option.attributeName(), option);
          }
        });
        this.negativeOptions.forEach((value, key) => {
          if (this.positiveOptions.has(key)) {
            this.dualOptions.add(key);
          }
        });
      }
      /**
       * Did the value come from the option, and not from possible matching dual option?
       *
       * @param {*} value
       * @param {Option} option
       * @returns {boolean}
       */
      valueFromOption(value, option) {
        const optionKey = option.attributeName();
        if (!this.dualOptions.has(optionKey)) return true;
        const preset = this.negativeOptions.get(optionKey).presetArg;
        const negativeValue = preset !== void 0 ? preset : false;
        return option.negate === (negativeValue === value);
      }
    };
    function camelcase(str) {
      return str.split("-").reduce((str2, word) => {
        return str2 + word[0].toUpperCase() + word.slice(1);
      });
    }
    function splitOptionFlags(flags) {
      let shortFlag;
      let longFlag;
      const flagParts = flags.split(/[ |,]+/);
      if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1]))
        shortFlag = flagParts.shift();
      longFlag = flagParts.shift();
      if (!shortFlag && /^-[^-]$/.test(longFlag)) {
        shortFlag = longFlag;
        longFlag = void 0;
      }
      return { shortFlag, longFlag };
    }
    exports2.Option = Option2;
    exports2.DualOptions = DualOptions;
  }
});

// node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS({
  "node_modules/commander/lib/suggestSimilar.js"(exports2) {
    var maxDistance = 3;
    function editDistance(a, b) {
      if (Math.abs(a.length - b.length) > maxDistance)
        return Math.max(a.length, b.length);
      const d = [];
      for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
      }
      for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
          let cost = 1;
          if (a[i - 1] === b[j - 1]) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            // deletion
            d[i][j - 1] + 1,
            // insertion
            d[i - 1][j - 1] + cost
            // substitution
          );
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
          }
        }
      }
      return d[a.length][b.length];
    }
    function suggestSimilar(word, candidates) {
      if (!candidates || candidates.length === 0) return "";
      candidates = Array.from(new Set(candidates));
      const searchingOptions = word.startsWith("--");
      if (searchingOptions) {
        word = word.slice(2);
        candidates = candidates.map((candidate) => candidate.slice(2));
      }
      let similar = [];
      let bestDistance = maxDistance;
      const minSimilarity = 0.4;
      candidates.forEach((candidate) => {
        if (candidate.length <= 1) return;
        const distance = editDistance(word, candidate);
        const length = Math.max(word.length, candidate.length);
        const similarity = (length - distance) / length;
        if (similarity > minSimilarity) {
          if (distance < bestDistance) {
            bestDistance = distance;
            similar = [candidate];
          } else if (distance === bestDistance) {
            similar.push(candidate);
          }
        }
      });
      similar.sort((a, b) => a.localeCompare(b));
      if (searchingOptions) {
        similar = similar.map((candidate) => `--${candidate}`);
      }
      if (similar.length > 1) {
        return `
(Did you mean one of ${similar.join(", ")}?)`;
      }
      if (similar.length === 1) {
        return `
(Did you mean ${similar[0]}?)`;
      }
      return "";
    }
    exports2.suggestSimilar = suggestSimilar;
  }
});

// node_modules/commander/lib/command.js
var require_command = __commonJS({
  "node_modules/commander/lib/command.js"(exports2) {
    var EventEmitter = require("node:events").EventEmitter;
    var childProcess = require("node:child_process");
    var path = require("node:path");
    var fs4 = require("node:fs");
    var process2 = require("node:process");
    var { Argument: Argument2, humanReadableArgName } = require_argument();
    var { CommanderError: CommanderError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2, DualOptions } = require_option();
    var { suggestSimilar } = require_suggestSimilar();
    var Command2 = class _Command extends EventEmitter {
      /**
       * Initialize a new `Command`.
       *
       * @param {string} [name]
       */
      constructor(name) {
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._allowExcessArguments = true;
        this.registeredArguments = [];
        this._args = this.registeredArguments;
        this.args = [];
        this.rawArgs = [];
        this.processedArgs = [];
        this._scriptPath = null;
        this._name = name || "";
        this._optionValues = {};
        this._optionValueSources = {};
        this._storeOptionsAsProperties = false;
        this._actionHandler = null;
        this._executableHandler = false;
        this._executableFile = null;
        this._executableDir = null;
        this._defaultCommandName = null;
        this._exitCallback = null;
        this._aliases = [];
        this._combineFlagAndOptionalValue = true;
        this._description = "";
        this._summary = "";
        this._argsDescription = void 0;
        this._enablePositionalOptions = false;
        this._passThroughOptions = false;
        this._lifeCycleHooks = {};
        this._showHelpAfterError = false;
        this._showSuggestionAfterError = true;
        this._outputConfiguration = {
          writeOut: (str) => process2.stdout.write(str),
          writeErr: (str) => process2.stderr.write(str),
          getOutHelpWidth: () => process2.stdout.isTTY ? process2.stdout.columns : void 0,
          getErrHelpWidth: () => process2.stderr.isTTY ? process2.stderr.columns : void 0,
          outputError: (str, write) => write(str)
        };
        this._hidden = false;
        this._helpOption = void 0;
        this._addImplicitHelpCommand = void 0;
        this._helpCommand = void 0;
        this._helpConfiguration = {};
      }
      /**
       * Copy settings that are useful to have in common across root command and subcommands.
       *
       * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
       *
       * @param {Command} sourceCommand
       * @return {Command} `this` command for chaining
       */
      copyInheritedSettings(sourceCommand) {
        this._outputConfiguration = sourceCommand._outputConfiguration;
        this._helpOption = sourceCommand._helpOption;
        this._helpCommand = sourceCommand._helpCommand;
        this._helpConfiguration = sourceCommand._helpConfiguration;
        this._exitCallback = sourceCommand._exitCallback;
        this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
        this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
        this._allowExcessArguments = sourceCommand._allowExcessArguments;
        this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
        this._showHelpAfterError = sourceCommand._showHelpAfterError;
        this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
        return this;
      }
      /**
       * @returns {Command[]}
       * @private
       */
      _getCommandAndAncestors() {
        const result = [];
        for (let command = this; command; command = command.parent) {
          result.push(command);
        }
        return result;
      }
      /**
       * Define a command.
       *
       * There are two styles of command: pay attention to where to put the description.
       *
       * @example
       * // Command implemented using action handler (description is supplied separately to `.command`)
       * program
       *   .command('clone <source> [destination]')
       *   .description('clone a repository into a newly created directory')
       *   .action((source, destination) => {
       *     console.log('clone command called');
       *   });
       *
       * // Command implemented using separate executable file (description is second parameter to `.command`)
       * program
       *   .command('start <service>', 'start named service')
       *   .command('stop [service]', 'stop named service, or all if no name supplied');
       *
       * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
       * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
       * @param {object} [execOpts] - configuration options (for executable)
       * @return {Command} returns new command for action handler, or `this` for executable command
       */
      command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
        let desc = actionOptsOrExecDesc;
        let opts = execOpts;
        if (typeof desc === "object" && desc !== null) {
          opts = desc;
          desc = null;
        }
        opts = opts || {};
        const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const cmd = this.createCommand(name);
        if (desc) {
          cmd.description(desc);
          cmd._executableHandler = true;
        }
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._executableFile = opts.executableFile || null;
        if (args) cmd.arguments(args);
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd.copyInheritedSettings(this);
        if (desc) return this;
        return cmd;
      }
      /**
       * Factory routine to create a new unattached command.
       *
       * See .command() for creating an attached subcommand, which uses this routine to
       * create the command. You can override createCommand to customise subcommands.
       *
       * @param {string} [name]
       * @return {Command} new command
       */
      createCommand(name) {
        return new _Command(name);
      }
      /**
       * You can customise the help with a subclass of Help by overriding createHelp,
       * or by overriding Help properties using configureHelp().
       *
       * @return {Help}
       */
      createHelp() {
        return Object.assign(new Help2(), this.configureHelp());
      }
      /**
       * You can customise the help by overriding Help properties using configureHelp(),
       * or with a subclass of Help by overriding createHelp().
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureHelp(configuration) {
        if (configuration === void 0) return this._helpConfiguration;
        this._helpConfiguration = configuration;
        return this;
      }
      /**
       * The default output goes to stdout and stderr. You can customise this for special
       * applications. You can also customise the display of errors by overriding outputError.
       *
       * The configuration properties are all functions:
       *
       *     // functions to change where being written, stdout and stderr
       *     writeOut(str)
       *     writeErr(str)
       *     // matching functions to specify width for wrapping help
       *     getOutHelpWidth()
       *     getErrHelpWidth()
       *     // functions based on what is being written out
       *     outputError(str, write) // used for displaying errors, and not used for displaying help
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureOutput(configuration) {
        if (configuration === void 0) return this._outputConfiguration;
        Object.assign(this._outputConfiguration, configuration);
        return this;
      }
      /**
       * Display the help or a custom message after an error occurs.
       *
       * @param {(boolean|string)} [displayHelp]
       * @return {Command} `this` command for chaining
       */
      showHelpAfterError(displayHelp = true) {
        if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
        this._showHelpAfterError = displayHelp;
        return this;
      }
      /**
       * Display suggestion of similar commands for unknown commands, or options for unknown options.
       *
       * @param {boolean} [displaySuggestion]
       * @return {Command} `this` command for chaining
       */
      showSuggestionAfterError(displaySuggestion = true) {
        this._showSuggestionAfterError = !!displaySuggestion;
        return this;
      }
      /**
       * Add a prepared subcommand.
       *
       * See .command() for creating an attached subcommand which inherits settings from its parent.
       *
       * @param {Command} cmd - new subcommand
       * @param {object} [opts] - configuration options
       * @return {Command} `this` command for chaining
       */
      addCommand(cmd, opts) {
        if (!cmd._name) {
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        }
        opts = opts || {};
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        if (opts.noHelp || opts.hidden) cmd._hidden = true;
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd._checkForBrokenPassThrough();
        return this;
      }
      /**
       * Factory routine to create a new unattached argument.
       *
       * See .argument() for creating an attached argument, which uses this routine to
       * create the argument. You can override createArgument to return a custom argument.
       *
       * @param {string} name
       * @param {string} [description]
       * @return {Argument} new argument
       */
      createArgument(name, description) {
        return new Argument2(name, description);
      }
      /**
       * Define argument syntax for command.
       *
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @example
       * program.argument('<input-file>');
       * program.argument('[output-file]');
       *
       * @param {string} name
       * @param {string} [description]
       * @param {(Function|*)} [fn] - custom argument processing function
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      argument(name, description, fn, defaultValue) {
        const argument = this.createArgument(name, description);
        if (typeof fn === "function") {
          argument.default(defaultValue).argParser(fn);
        } else {
          argument.default(fn);
        }
        this.addArgument(argument);
        return this;
      }
      /**
       * Define argument syntax for command, adding multiple at once (without descriptions).
       *
       * See also .argument().
       *
       * @example
       * program.arguments('<cmd> [env]');
       *
       * @param {string} names
       * @return {Command} `this` command for chaining
       */
      arguments(names) {
        names.trim().split(/ +/).forEach((detail) => {
          this.argument(detail);
        });
        return this;
      }
      /**
       * Define argument syntax for command, adding a prepared argument.
       *
       * @param {Argument} argument
       * @return {Command} `this` command for chaining
       */
      addArgument(argument) {
        const previousArgument = this.registeredArguments.slice(-1)[0];
        if (previousArgument && previousArgument.variadic) {
          throw new Error(
            `only the last argument can be variadic '${previousArgument.name()}'`
          );
        }
        if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) {
          throw new Error(
            `a default value for a required argument is never used: '${argument.name()}'`
          );
        }
        this.registeredArguments.push(argument);
        return this;
      }
      /**
       * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
       *
       * @example
       *    program.helpCommand('help [cmd]');
       *    program.helpCommand('help [cmd]', 'show help');
       *    program.helpCommand(false); // suppress default help command
       *    program.helpCommand(true); // add help command even if no subcommands
       *
       * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
       * @param {string} [description] - custom description
       * @return {Command} `this` command for chaining
       */
      helpCommand(enableOrNameAndArgs, description) {
        if (typeof enableOrNameAndArgs === "boolean") {
          this._addImplicitHelpCommand = enableOrNameAndArgs;
          return this;
        }
        enableOrNameAndArgs = enableOrNameAndArgs ?? "help [command]";
        const [, helpName, helpArgs] = enableOrNameAndArgs.match(/([^ ]+) *(.*)/);
        const helpDescription = description ?? "display help for command";
        const helpCommand = this.createCommand(helpName);
        helpCommand.helpOption(false);
        if (helpArgs) helpCommand.arguments(helpArgs);
        if (helpDescription) helpCommand.description(helpDescription);
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Add prepared custom help command.
       *
       * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
       * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
       * @return {Command} `this` command for chaining
       */
      addHelpCommand(helpCommand, deprecatedDescription) {
        if (typeof helpCommand !== "object") {
          this.helpCommand(helpCommand, deprecatedDescription);
          return this;
        }
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Lazy create help command.
       *
       * @return {(Command|null)}
       * @package
       */
      _getHelpCommand() {
        const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"));
        if (hasImplicitHelpCommand) {
          if (this._helpCommand === void 0) {
            this.helpCommand(void 0, void 0);
          }
          return this._helpCommand;
        }
        return null;
      }
      /**
       * Add hook for life cycle event.
       *
       * @param {string} event
       * @param {Function} listener
       * @return {Command} `this` command for chaining
       */
      hook(event, listener) {
        const allowedValues = ["preSubcommand", "preAction", "postAction"];
        if (!allowedValues.includes(event)) {
          throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        if (this._lifeCycleHooks[event]) {
          this._lifeCycleHooks[event].push(listener);
        } else {
          this._lifeCycleHooks[event] = [listener];
        }
        return this;
      }
      /**
       * Register callback to use as replacement for calling process.exit.
       *
       * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
       * @return {Command} `this` command for chaining
       */
      exitOverride(fn) {
        if (fn) {
          this._exitCallback = fn;
        } else {
          this._exitCallback = (err) => {
            if (err.code !== "commander.executeSubCommandAsync") {
              throw err;
            } else {
            }
          };
        }
        return this;
      }
      /**
       * Call process.exit, and _exitCallback if defined.
       *
       * @param {number} exitCode exit code for using with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       * @return never
       * @private
       */
      _exit(exitCode, code, message) {
        if (this._exitCallback) {
          this._exitCallback(new CommanderError2(exitCode, code, message));
        }
        process2.exit(exitCode);
      }
      /**
       * Register callback `fn` for the command.
       *
       * @example
       * program
       *   .command('serve')
       *   .description('start service')
       *   .action(function() {
       *      // do work here
       *   });
       *
       * @param {Function} fn
       * @return {Command} `this` command for chaining
       */
      action(fn) {
        const listener = (args) => {
          const expectedArgsCount = this.registeredArguments.length;
          const actionArgs = args.slice(0, expectedArgsCount);
          if (this._storeOptionsAsProperties) {
            actionArgs[expectedArgsCount] = this;
          } else {
            actionArgs[expectedArgsCount] = this.opts();
          }
          actionArgs.push(this);
          return fn.apply(this, actionArgs);
        };
        this._actionHandler = listener;
        return this;
      }
      /**
       * Factory routine to create a new unattached option.
       *
       * See .option() for creating an attached option, which uses this routine to
       * create the option. You can override createOption to return a custom option.
       *
       * @param {string} flags
       * @param {string} [description]
       * @return {Option} new option
       */
      createOption(flags, description) {
        return new Option2(flags, description);
      }
      /**
       * Wrap parseArgs to catch 'commander.invalidArgument'.
       *
       * @param {(Option | Argument)} target
       * @param {string} value
       * @param {*} previous
       * @param {string} invalidArgumentMessage
       * @private
       */
      _callParseArg(target, value, previous, invalidArgumentMessage) {
        try {
          return target.parseArg(value, previous);
        } catch (err) {
          if (err.code === "commander.invalidArgument") {
            const message = `${invalidArgumentMessage} ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      }
      /**
       * Check for option flag conflicts.
       * Register option if no conflicts found, or throw on conflict.
       *
       * @param {Option} option
       * @private
       */
      _registerOption(option) {
        const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
        if (matchingOption) {
          const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
          throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
        }
        this.options.push(option);
      }
      /**
       * Check for command name and alias conflicts with existing commands.
       * Register command if no conflicts found, or throw on conflict.
       *
       * @param {Command} command
       * @private
       */
      _registerCommand(command) {
        const knownBy = (cmd) => {
          return [cmd.name()].concat(cmd.aliases());
        };
        const alreadyUsed = knownBy(command).find(
          (name) => this._findCommand(name)
        );
        if (alreadyUsed) {
          const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
          const newCmd = knownBy(command).join("|");
          throw new Error(
            `cannot add command '${newCmd}' as already have command '${existingCmd}'`
          );
        }
        this.commands.push(command);
      }
      /**
       * Add an option.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addOption(option) {
        this._registerOption(option);
        const oname = option.name();
        const name = option.attributeName();
        if (option.negate) {
          const positiveLongFlag = option.long.replace(/^--no-/, "--");
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(
              name,
              option.defaultValue === void 0 ? true : option.defaultValue,
              "default"
            );
          }
        } else if (option.defaultValue !== void 0) {
          this.setOptionValueWithSource(name, option.defaultValue, "default");
        }
        const handleOptionValue = (val, invalidValueMessage, valueSource) => {
          if (val == null && option.presetArg !== void 0) {
            val = option.presetArg;
          }
          const oldValue = this.getOptionValue(name);
          if (val !== null && option.parseArg) {
            val = this._callParseArg(option, val, oldValue, invalidValueMessage);
          } else if (val !== null && option.variadic) {
            val = option._concatValue(val, oldValue);
          }
          if (val == null) {
            if (option.negate) {
              val = false;
            } else if (option.isBoolean() || option.optional) {
              val = true;
            } else {
              val = "";
            }
          }
          this.setOptionValueWithSource(name, val, valueSource);
        };
        this.on("option:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "cli");
        });
        if (option.envVar) {
          this.on("optionEnv:" + oname, (val) => {
            const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
            handleOptionValue(val, invalidValueMessage, "env");
          });
        }
        return this;
      }
      /**
       * Internal implementation shared by .option() and .requiredOption()
       *
       * @return {Command} `this` command for chaining
       * @private
       */
      _optionEx(config, flags, description, fn, defaultValue) {
        if (typeof flags === "object" && flags instanceof Option2) {
          throw new Error(
            "To add an Option object use addOption() instead of option() or requiredOption()"
          );
        }
        const option = this.createOption(flags, description);
        option.makeOptionMandatory(!!config.mandatory);
        if (typeof fn === "function") {
          option.default(defaultValue).argParser(fn);
        } else if (fn instanceof RegExp) {
          const regex = fn;
          fn = (val, def) => {
            const m = regex.exec(val);
            return m ? m[0] : def;
          };
          option.default(defaultValue).argParser(fn);
        } else {
          option.default(fn);
        }
        return this.addOption(option);
      }
      /**
       * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
       * option-argument is indicated by `<>` and an optional option-argument by `[]`.
       *
       * See the README for more details, and see also addOption() and requiredOption().
       *
       * @example
       * program
       *     .option('-p, --pepper', 'add pepper')
       *     .option('-p, --pizza-type <TYPE>', 'type of pizza') // required option-argument
       *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
       *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      option(flags, description, parseArg, defaultValue) {
        return this._optionEx({}, flags, description, parseArg, defaultValue);
      }
      /**
       * Add a required option which must have a value after parsing. This usually means
       * the option must be specified on the command line. (Otherwise the same as .option().)
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      requiredOption(flags, description, parseArg, defaultValue) {
        return this._optionEx(
          { mandatory: true },
          flags,
          description,
          parseArg,
          defaultValue
        );
      }
      /**
       * Alter parsing of short flags with optional values.
       *
       * @example
       * // for `.option('-f,--flag [value]'):
       * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
       * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
       *
       * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
       * @return {Command} `this` command for chaining
       */
      combineFlagAndOptionalValue(combine = true) {
        this._combineFlagAndOptionalValue = !!combine;
        return this;
      }
      /**
       * Allow unknown options on the command line.
       *
       * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
       * @return {Command} `this` command for chaining
       */
      allowUnknownOption(allowUnknown = true) {
        this._allowUnknownOption = !!allowUnknown;
        return this;
      }
      /**
       * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
       *
       * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
       * @return {Command} `this` command for chaining
       */
      allowExcessArguments(allowExcess = true) {
        this._allowExcessArguments = !!allowExcess;
        return this;
      }
      /**
       * Enable positional options. Positional means global options are specified before subcommands which lets
       * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
       * The default behaviour is non-positional and global options may appear anywhere on the command line.
       *
       * @param {boolean} [positional]
       * @return {Command} `this` command for chaining
       */
      enablePositionalOptions(positional = true) {
        this._enablePositionalOptions = !!positional;
        return this;
      }
      /**
       * Pass through options that come after command-arguments rather than treat them as command-options,
       * so actual command-options come before command-arguments. Turning this on for a subcommand requires
       * positional options to have been enabled on the program (parent commands).
       * The default behaviour is non-positional and options may appear before or after command-arguments.
       *
       * @param {boolean} [passThrough] for unknown options.
       * @return {Command} `this` command for chaining
       */
      passThroughOptions(passThrough = true) {
        this._passThroughOptions = !!passThrough;
        this._checkForBrokenPassThrough();
        return this;
      }
      /**
       * @private
       */
      _checkForBrokenPassThrough() {
        if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
          throw new Error(
            `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
          );
        }
      }
      /**
       * Whether to store option values as properties on command object,
       * or store separately (specify false). In both cases the option values can be accessed using .opts().
       *
       * @param {boolean} [storeAsProperties=true]
       * @return {Command} `this` command for chaining
       */
      storeOptionsAsProperties(storeAsProperties = true) {
        if (this.options.length) {
          throw new Error("call .storeOptionsAsProperties() before adding options");
        }
        if (Object.keys(this._optionValues).length) {
          throw new Error(
            "call .storeOptionsAsProperties() before setting option values"
          );
        }
        this._storeOptionsAsProperties = !!storeAsProperties;
        return this;
      }
      /**
       * Retrieve option value.
       *
       * @param {string} key
       * @return {object} value
       */
      getOptionValue(key) {
        if (this._storeOptionsAsProperties) {
          return this[key];
        }
        return this._optionValues[key];
      }
      /**
       * Store option value.
       *
       * @param {string} key
       * @param {object} value
       * @return {Command} `this` command for chaining
       */
      setOptionValue(key, value) {
        return this.setOptionValueWithSource(key, value, void 0);
      }
      /**
       * Store option value and where the value came from.
       *
       * @param {string} key
       * @param {object} value
       * @param {string} source - expected values are default/config/env/cli/implied
       * @return {Command} `this` command for chaining
       */
      setOptionValueWithSource(key, value, source) {
        if (this._storeOptionsAsProperties) {
          this[key] = value;
        } else {
          this._optionValues[key] = value;
        }
        this._optionValueSources[key] = source;
        return this;
      }
      /**
       * Get source of option value.
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSource(key) {
        return this._optionValueSources[key];
      }
      /**
       * Get source of option value. See also .optsWithGlobals().
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSourceWithGlobals(key) {
        let source;
        this._getCommandAndAncestors().forEach((cmd) => {
          if (cmd.getOptionValueSource(key) !== void 0) {
            source = cmd.getOptionValueSource(key);
          }
        });
        return source;
      }
      /**
       * Get user arguments from implied or explicit arguments.
       * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
       *
       * @private
       */
      _prepareUserArgs(argv, parseOptions) {
        if (argv !== void 0 && !Array.isArray(argv)) {
          throw new Error("first parameter to parse must be array or undefined");
        }
        parseOptions = parseOptions || {};
        if (argv === void 0 && parseOptions.from === void 0) {
          if (process2.versions?.electron) {
            parseOptions.from = "electron";
          }
          const execArgv = process2.execArgv ?? [];
          if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) {
            parseOptions.from = "eval";
          }
        }
        if (argv === void 0) {
          argv = process2.argv;
        }
        this.rawArgs = argv.slice();
        let userArgs;
        switch (parseOptions.from) {
          case void 0:
          case "node":
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
            break;
          case "electron":
            if (process2.defaultApp) {
              this._scriptPath = argv[1];
              userArgs = argv.slice(2);
            } else {
              userArgs = argv.slice(1);
            }
            break;
          case "user":
            userArgs = argv.slice(0);
            break;
          case "eval":
            userArgs = argv.slice(1);
            break;
          default:
            throw new Error(
              `unexpected parse option { from: '${parseOptions.from}' }`
            );
        }
        if (!this._name && this._scriptPath)
          this.nameFromFilename(this._scriptPath);
        this._name = this._name || "program";
        return userArgs;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Use parseAsync instead of parse if any of your action handlers are async.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * program.parse(); // parse process.argv and auto-detect electron and special node flags
       * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
       * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv] - optional, defaults to process.argv
       * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
       * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
       * @return {Command} `this` command for chaining
       */
      parse(argv, parseOptions) {
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
       * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
       * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv]
       * @param {object} [parseOptions]
       * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
       * @return {Promise}
       */
      async parseAsync(argv, parseOptions) {
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        await this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Execute a sub-command executable.
       *
       * @private
       */
      _executeSubCommand(subcommand, args) {
        args = args.slice();
        let launchWithNode = false;
        const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
        function findFile(baseDir, baseName) {
          const localBin = path.resolve(baseDir, baseName);
          if (fs4.existsSync(localBin)) return localBin;
          if (sourceExt.includes(path.extname(baseName))) return void 0;
          const foundExt = sourceExt.find(
            (ext) => fs4.existsSync(`${localBin}${ext}`)
          );
          if (foundExt) return `${localBin}${foundExt}`;
          return void 0;
        }
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
        let executableDir = this._executableDir || "";
        if (this._scriptPath) {
          let resolvedScriptPath;
          try {
            resolvedScriptPath = fs4.realpathSync(this._scriptPath);
          } catch (err) {
            resolvedScriptPath = this._scriptPath;
          }
          executableDir = path.resolve(
            path.dirname(resolvedScriptPath),
            executableDir
          );
        }
        if (executableDir) {
          let localFile = findFile(executableDir, executableFile);
          if (!localFile && !subcommand._executableFile && this._scriptPath) {
            const legacyName = path.basename(
              this._scriptPath,
              path.extname(this._scriptPath)
            );
            if (legacyName !== this._name) {
              localFile = findFile(
                executableDir,
                `${legacyName}-${subcommand._name}`
              );
            }
          }
          executableFile = localFile || executableFile;
        }
        launchWithNode = sourceExt.includes(path.extname(executableFile));
        let proc;
        if (process2.platform !== "win32") {
          if (launchWithNode) {
            args.unshift(executableFile);
            args = incrementNodeInspectorPort(process2.execArgv).concat(args);
            proc = childProcess.spawn(process2.argv[0], args, { stdio: "inherit" });
          } else {
            proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
          }
        } else {
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process2.execArgv).concat(args);
          proc = childProcess.spawn(process2.execPath, args, { stdio: "inherit" });
        }
        if (!proc.killed) {
          const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
          signals.forEach((signal) => {
            process2.on(signal, () => {
              if (proc.killed === false && proc.exitCode === null) {
                proc.kill(signal);
              }
            });
          });
        }
        const exitCallback = this._exitCallback;
        proc.on("close", (code) => {
          code = code ?? 1;
          if (!exitCallback) {
            process2.exit(code);
          } else {
            exitCallback(
              new CommanderError2(
                code,
                "commander.executeSubCommandAsync",
                "(close)"
              )
            );
          }
        });
        proc.on("error", (err) => {
          if (err.code === "ENOENT") {
            const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
            const executableMissing = `'${executableFile}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
            throw new Error(executableMissing);
          } else if (err.code === "EACCES") {
            throw new Error(`'${executableFile}' not executable`);
          }
          if (!exitCallback) {
            process2.exit(1);
          } else {
            const wrappedError = new CommanderError2(
              1,
              "commander.executeSubCommandAsync",
              "(error)"
            );
            wrappedError.nestedError = err;
            exitCallback(wrappedError);
          }
        });
        this.runningCommand = proc;
      }
      /**
       * @private
       */
      _dispatchSubcommand(commandName, operands, unknown) {
        const subCommand = this._findCommand(commandName);
        if (!subCommand) this.help({ error: true });
        let promiseChain;
        promiseChain = this._chainOrCallSubCommandHook(
          promiseChain,
          subCommand,
          "preSubcommand"
        );
        promiseChain = this._chainOrCall(promiseChain, () => {
          if (subCommand._executableHandler) {
            this._executeSubCommand(subCommand, operands.concat(unknown));
          } else {
            return subCommand._parseCommand(operands, unknown);
          }
        });
        return promiseChain;
      }
      /**
       * Invoke help directly if possible, or dispatch if necessary.
       * e.g. help foo
       *
       * @private
       */
      _dispatchHelpCommand(subcommandName) {
        if (!subcommandName) {
          this.help();
        }
        const subCommand = this._findCommand(subcommandName);
        if (subCommand && !subCommand._executableHandler) {
          subCommand.help();
        }
        return this._dispatchSubcommand(
          subcommandName,
          [],
          [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]
        );
      }
      /**
       * Check this.args against expected this.registeredArguments.
       *
       * @private
       */
      _checkNumberOfArguments() {
        this.registeredArguments.forEach((arg, i) => {
          if (arg.required && this.args[i] == null) {
            this.missingArgument(arg.name());
          }
        });
        if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) {
          return;
        }
        if (this.args.length > this.registeredArguments.length) {
          this._excessArguments(this.args);
        }
      }
      /**
       * Process this.args using this.registeredArguments and save as this.processedArgs!
       *
       * @private
       */
      _processArguments() {
        const myParseArg = (argument, value, previous) => {
          let parsedValue = value;
          if (value !== null && argument.parseArg) {
            const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
            parsedValue = this._callParseArg(
              argument,
              value,
              previous,
              invalidValueMessage
            );
          }
          return parsedValue;
        };
        this._checkNumberOfArguments();
        const processedArgs = [];
        this.registeredArguments.forEach((declaredArg, index) => {
          let value = declaredArg.defaultValue;
          if (declaredArg.variadic) {
            if (index < this.args.length) {
              value = this.args.slice(index);
              if (declaredArg.parseArg) {
                value = value.reduce((processed, v) => {
                  return myParseArg(declaredArg, v, processed);
                }, declaredArg.defaultValue);
              }
            } else if (value === void 0) {
              value = [];
            }
          } else if (index < this.args.length) {
            value = this.args[index];
            if (declaredArg.parseArg) {
              value = myParseArg(declaredArg, value, declaredArg.defaultValue);
            }
          }
          processedArgs[index] = value;
        });
        this.processedArgs = processedArgs;
      }
      /**
       * Once we have a promise we chain, but call synchronously until then.
       *
       * @param {(Promise|undefined)} promise
       * @param {Function} fn
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCall(promise, fn) {
        if (promise && promise.then && typeof promise.then === "function") {
          return promise.then(() => fn());
        }
        return fn();
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallHooks(promise, event) {
        let result = promise;
        const hooks = [];
        this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
          hookedCommand._lifeCycleHooks[event].forEach((callback) => {
            hooks.push({ hookedCommand, callback });
          });
        });
        if (event === "postAction") {
          hooks.reverse();
        }
        hooks.forEach((hookDetail) => {
          result = this._chainOrCall(result, () => {
            return hookDetail.callback(hookDetail.hookedCommand, this);
          });
        });
        return result;
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {Command} subCommand
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallSubCommandHook(promise, subCommand, event) {
        let result = promise;
        if (this._lifeCycleHooks[event] !== void 0) {
          this._lifeCycleHooks[event].forEach((hook) => {
            result = this._chainOrCall(result, () => {
              return hook(this, subCommand);
            });
          });
        }
        return result;
      }
      /**
       * Process arguments in context of this command.
       * Returns action result, in case it is a promise.
       *
       * @private
       */
      _parseCommand(operands, unknown) {
        const parsed = this.parseOptions(unknown);
        this._parseOptionsEnv();
        this._parseOptionsImplied();
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);
        if (operands && this._findCommand(operands[0])) {
          return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
        }
        if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
          return this._dispatchHelpCommand(operands[1]);
        }
        if (this._defaultCommandName) {
          this._outputHelpIfRequested(unknown);
          return this._dispatchSubcommand(
            this._defaultCommandName,
            operands,
            unknown
          );
        }
        if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
          this.help({ error: true });
        }
        this._outputHelpIfRequested(parsed.unknown);
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        const checkForUnknownOptions = () => {
          if (parsed.unknown.length > 0) {
            this.unknownOption(parsed.unknown[0]);
          }
        };
        const commandEvent = `command:${this.name()}`;
        if (this._actionHandler) {
          checkForUnknownOptions();
          this._processArguments();
          let promiseChain;
          promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
          promiseChain = this._chainOrCall(
            promiseChain,
            () => this._actionHandler(this.processedArgs)
          );
          if (this.parent) {
            promiseChain = this._chainOrCall(promiseChain, () => {
              this.parent.emit(commandEvent, operands, unknown);
            });
          }
          promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
          return promiseChain;
        }
        if (this.parent && this.parent.listenerCount(commandEvent)) {
          checkForUnknownOptions();
          this._processArguments();
          this.parent.emit(commandEvent, operands, unknown);
        } else if (operands.length) {
          if (this._findCommand("*")) {
            return this._dispatchSubcommand("*", operands, unknown);
          }
          if (this.listenerCount("command:*")) {
            this.emit("command:*", operands, unknown);
          } else if (this.commands.length) {
            this.unknownCommand();
          } else {
            checkForUnknownOptions();
            this._processArguments();
          }
        } else if (this.commands.length) {
          checkForUnknownOptions();
          this.help({ error: true });
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      }
      /**
       * Find matching command.
       *
       * @private
       * @return {Command | undefined}
       */
      _findCommand(name) {
        if (!name) return void 0;
        return this.commands.find(
          (cmd) => cmd._name === name || cmd._aliases.includes(name)
        );
      }
      /**
       * Return an option matching `arg` if any.
       *
       * @param {string} arg
       * @return {Option}
       * @package
       */
      _findOption(arg) {
        return this.options.find((option) => option.is(arg));
      }
      /**
       * Display an error message if a mandatory option does not have a value.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForMissingMandatoryOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd.options.forEach((anOption) => {
            if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) {
              cmd.missingMandatoryOptionValue(anOption);
            }
          });
        });
      }
      /**
       * Display an error message if conflicting options are used together in this.
       *
       * @private
       */
      _checkForConflictingLocalOptions() {
        const definedNonDefaultOptions = this.options.filter((option) => {
          const optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === void 0) {
            return false;
          }
          return this.getOptionValueSource(optionKey) !== "default";
        });
        const optionsWithConflicting = definedNonDefaultOptions.filter(
          (option) => option.conflictsWith.length > 0
        );
        optionsWithConflicting.forEach((option) => {
          const conflictingAndDefined = definedNonDefaultOptions.find(
            (defined) => option.conflictsWith.includes(defined.attributeName())
          );
          if (conflictingAndDefined) {
            this._conflictingOption(option, conflictingAndDefined);
          }
        });
      }
      /**
       * Display an error message if conflicting options are used together.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForConflictingOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd._checkForConflictingLocalOptions();
        });
      }
      /**
       * Parse options from `argv` removing known options,
       * and return argv split into operands and unknown arguments.
       *
       * Examples:
       *
       *     argv => operands, unknown
       *     --known kkk op => [op], []
       *     op --known kkk => [op], []
       *     sub --unknown uuu op => [sub], [--unknown uuu op]
       *     sub -- --unknown uuu op => [sub --unknown uuu op], []
       *
       * @param {string[]} argv
       * @return {{operands: string[], unknown: string[]}}
       */
      parseOptions(argv) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        const args = argv.slice();
        function maybeOption(arg) {
          return arg.length > 1 && arg[0] === "-";
        }
        let activeVariadicOption = null;
        while (args.length) {
          const arg = args.shift();
          if (arg === "--") {
            if (dest === unknown) dest.push(arg);
            dest.push(...args);
            break;
          }
          if (activeVariadicOption && !maybeOption(arg)) {
            this.emit(`option:${activeVariadicOption.name()}`, arg);
            continue;
          }
          activeVariadicOption = null;
          if (maybeOption(arg)) {
            const option = this._findOption(arg);
            if (option) {
              if (option.required) {
                const value = args.shift();
                if (value === void 0) this.optionMissingArgument(option);
                this.emit(`option:${option.name()}`, value);
              } else if (option.optional) {
                let value = null;
                if (args.length > 0 && !maybeOption(args[0])) {
                  value = args.shift();
                }
                this.emit(`option:${option.name()}`, value);
              } else {
                this.emit(`option:${option.name()}`);
              }
              activeVariadicOption = option.variadic ? option : null;
              continue;
            }
          }
          if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
            const option = this._findOption(`-${arg[1]}`);
            if (option) {
              if (option.required || option.optional && this._combineFlagAndOptionalValue) {
                this.emit(`option:${option.name()}`, arg.slice(2));
              } else {
                this.emit(`option:${option.name()}`);
                args.unshift(`-${arg.slice(2)}`);
              }
              continue;
            }
          }
          if (/^--[^=]+=/.test(arg)) {
            const index = arg.indexOf("=");
            const option = this._findOption(arg.slice(0, index));
            if (option && (option.required || option.optional)) {
              this.emit(`option:${option.name()}`, arg.slice(index + 1));
              continue;
            }
          }
          if (maybeOption(arg)) {
            dest = unknown;
          }
          if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
            if (this._findCommand(arg)) {
              operands.push(arg);
              if (args.length > 0) unknown.push(...args);
              break;
            } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
              operands.push(arg);
              if (args.length > 0) operands.push(...args);
              break;
            } else if (this._defaultCommandName) {
              unknown.push(arg);
              if (args.length > 0) unknown.push(...args);
              break;
            }
          }
          if (this._passThroughOptions) {
            dest.push(arg);
            if (args.length > 0) dest.push(...args);
            break;
          }
          dest.push(arg);
        }
        return { operands, unknown };
      }
      /**
       * Return an object containing local option values as key-value pairs.
       *
       * @return {object}
       */
      opts() {
        if (this._storeOptionsAsProperties) {
          const result = {};
          const len = this.options.length;
          for (let i = 0; i < len; i++) {
            const key = this.options[i].attributeName();
            result[key] = key === this._versionOptionName ? this._version : this[key];
          }
          return result;
        }
        return this._optionValues;
      }
      /**
       * Return an object containing merged local and global option values as key-value pairs.
       *
       * @return {object}
       */
      optsWithGlobals() {
        return this._getCommandAndAncestors().reduce(
          (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
          {}
        );
      }
      /**
       * Display error message and exit (or call exitOverride).
       *
       * @param {string} message
       * @param {object} [errorOptions]
       * @param {string} [errorOptions.code] - an id string representing the error
       * @param {number} [errorOptions.exitCode] - used with process.exit
       */
      error(message, errorOptions) {
        this._outputConfiguration.outputError(
          `${message}
`,
          this._outputConfiguration.writeErr
        );
        if (typeof this._showHelpAfterError === "string") {
          this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
        } else if (this._showHelpAfterError) {
          this._outputConfiguration.writeErr("\n");
          this.outputHelp({ error: true });
        }
        const config = errorOptions || {};
        const exitCode = config.exitCode || 1;
        const code = config.code || "commander.error";
        this._exit(exitCode, code, message);
      }
      /**
       * Apply any option related environment variables, if option does
       * not have a value from cli or client code.
       *
       * @private
       */
      _parseOptionsEnv() {
        this.options.forEach((option) => {
          if (option.envVar && option.envVar in process2.env) {
            const optionKey = option.attributeName();
            if (this.getOptionValue(optionKey) === void 0 || ["default", "config", "env"].includes(
              this.getOptionValueSource(optionKey)
            )) {
              if (option.required || option.optional) {
                this.emit(`optionEnv:${option.name()}`, process2.env[option.envVar]);
              } else {
                this.emit(`optionEnv:${option.name()}`);
              }
            }
          }
        });
      }
      /**
       * Apply any implied option values, if option is undefined or default value.
       *
       * @private
       */
      _parseOptionsImplied() {
        const dualHelper = new DualOptions(this.options);
        const hasCustomOptionValue = (optionKey) => {
          return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
        };
        this.options.filter(
          (option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(
            this.getOptionValue(option.attributeName()),
            option
          )
        ).forEach((option) => {
          Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
            this.setOptionValueWithSource(
              impliedKey,
              option.implied[impliedKey],
              "implied"
            );
          });
        });
      }
      /**
       * Argument `name` is missing.
       *
       * @param {string} name
       * @private
       */
      missingArgument(name) {
        const message = `error: missing required argument '${name}'`;
        this.error(message, { code: "commander.missingArgument" });
      }
      /**
       * `Option` is missing an argument.
       *
       * @param {Option} option
       * @private
       */
      optionMissingArgument(option) {
        const message = `error: option '${option.flags}' argument missing`;
        this.error(message, { code: "commander.optionMissingArgument" });
      }
      /**
       * `Option` does not have a value, and is a mandatory option.
       *
       * @param {Option} option
       * @private
       */
      missingMandatoryOptionValue(option) {
        const message = `error: required option '${option.flags}' not specified`;
        this.error(message, { code: "commander.missingMandatoryOptionValue" });
      }
      /**
       * `Option` conflicts with another option.
       *
       * @param {Option} option
       * @param {Option} conflictingOption
       * @private
       */
      _conflictingOption(option, conflictingOption) {
        const findBestOptionFromValue = (option2) => {
          const optionKey = option2.attributeName();
          const optionValue = this.getOptionValue(optionKey);
          const negativeOption = this.options.find(
            (target) => target.negate && optionKey === target.attributeName()
          );
          const positiveOption = this.options.find(
            (target) => !target.negate && optionKey === target.attributeName()
          );
          if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) {
            return negativeOption;
          }
          return positiveOption || option2;
        };
        const getErrorMessage = (option2) => {
          const bestOption = findBestOptionFromValue(option2);
          const optionKey = bestOption.attributeName();
          const source = this.getOptionValueSource(optionKey);
          if (source === "env") {
            return `environment variable '${bestOption.envVar}'`;
          }
          return `option '${bestOption.flags}'`;
        };
        const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
        this.error(message, { code: "commander.conflictingOption" });
      }
      /**
       * Unknown option `flag`.
       *
       * @param {string} flag
       * @private
       */
      unknownOption(flag) {
        if (this._allowUnknownOption) return;
        let suggestion = "";
        if (flag.startsWith("--") && this._showSuggestionAfterError) {
          let candidateFlags = [];
          let command = this;
          do {
            const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
            candidateFlags = candidateFlags.concat(moreFlags);
            command = command.parent;
          } while (command && !command._enablePositionalOptions);
          suggestion = suggestSimilar(flag, candidateFlags);
        }
        const message = `error: unknown option '${flag}'${suggestion}`;
        this.error(message, { code: "commander.unknownOption" });
      }
      /**
       * Excess arguments, more than expected.
       *
       * @param {string[]} receivedArgs
       * @private
       */
      _excessArguments(receivedArgs) {
        if (this._allowExcessArguments) return;
        const expected = this.registeredArguments.length;
        const s = expected === 1 ? "" : "s";
        const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
        const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
        this.error(message, { code: "commander.excessArguments" });
      }
      /**
       * Unknown command.
       *
       * @private
       */
      unknownCommand() {
        const unknownName = this.args[0];
        let suggestion = "";
        if (this._showSuggestionAfterError) {
          const candidateNames = [];
          this.createHelp().visibleCommands(this).forEach((command) => {
            candidateNames.push(command.name());
            if (command.alias()) candidateNames.push(command.alias());
          });
          suggestion = suggestSimilar(unknownName, candidateNames);
        }
        const message = `error: unknown command '${unknownName}'${suggestion}`;
        this.error(message, { code: "commander.unknownCommand" });
      }
      /**
       * Get or set the program version.
       *
       * This method auto-registers the "-V, --version" option which will print the version number.
       *
       * You can optionally supply the flags and description to override the defaults.
       *
       * @param {string} [str]
       * @param {string} [flags]
       * @param {string} [description]
       * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
       */
      version(str, flags, description) {
        if (str === void 0) return this._version;
        this._version = str;
        flags = flags || "-V, --version";
        description = description || "output the version number";
        const versionOption = this.createOption(flags, description);
        this._versionOptionName = versionOption.attributeName();
        this._registerOption(versionOption);
        this.on("option:" + versionOption.name(), () => {
          this._outputConfiguration.writeOut(`${str}
`);
          this._exit(0, "commander.version", str);
        });
        return this;
      }
      /**
       * Set the description.
       *
       * @param {string} [str]
       * @param {object} [argsDescription]
       * @return {(string|Command)}
       */
      description(str, argsDescription) {
        if (str === void 0 && argsDescription === void 0)
          return this._description;
        this._description = str;
        if (argsDescription) {
          this._argsDescription = argsDescription;
        }
        return this;
      }
      /**
       * Set the summary. Used when listed as subcommand of parent.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      summary(str) {
        if (str === void 0) return this._summary;
        this._summary = str;
        return this;
      }
      /**
       * Set an alias for the command.
       *
       * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
       *
       * @param {string} [alias]
       * @return {(string|Command)}
       */
      alias(alias) {
        if (alias === void 0) return this._aliases[0];
        let command = this;
        if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
          command = this.commands[this.commands.length - 1];
        }
        if (alias === command._name)
          throw new Error("Command alias can't be the same as its name");
        const matchingCommand = this.parent?._findCommand(alias);
        if (matchingCommand) {
          const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
          throw new Error(
            `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`
          );
        }
        command._aliases.push(alias);
        return this;
      }
      /**
       * Set aliases for the command.
       *
       * Only the first alias is shown in the auto-generated help.
       *
       * @param {string[]} [aliases]
       * @return {(string[]|Command)}
       */
      aliases(aliases) {
        if (aliases === void 0) return this._aliases;
        aliases.forEach((alias) => this.alias(alias));
        return this;
      }
      /**
       * Set / get the command usage `str`.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      usage(str) {
        if (str === void 0) {
          if (this._usage) return this._usage;
          const args = this.registeredArguments.map((arg) => {
            return humanReadableArgName(arg);
          });
          return [].concat(
            this.options.length || this._helpOption !== null ? "[options]" : [],
            this.commands.length ? "[command]" : [],
            this.registeredArguments.length ? args : []
          ).join(" ");
        }
        this._usage = str;
        return this;
      }
      /**
       * Get or set the name of the command.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      name(str) {
        if (str === void 0) return this._name;
        this._name = str;
        return this;
      }
      /**
       * Set the name of the command from script filename, such as process.argv[1],
       * or require.main.filename, or __filename.
       *
       * (Used internally and public although not documented in README.)
       *
       * @example
       * program.nameFromFilename(require.main.filename);
       *
       * @param {string} filename
       * @return {Command}
       */
      nameFromFilename(filename) {
        this._name = path.basename(filename, path.extname(filename));
        return this;
      }
      /**
       * Get or set the directory for searching for executable subcommands of this command.
       *
       * @example
       * program.executableDir(__dirname);
       * // or
       * program.executableDir('subcommands');
       *
       * @param {string} [path]
       * @return {(string|null|Command)}
       */
      executableDir(path2) {
        if (path2 === void 0) return this._executableDir;
        this._executableDir = path2;
        return this;
      }
      /**
       * Return program help documentation.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
       * @return {string}
       */
      helpInformation(contextOptions) {
        const helper = this.createHelp();
        if (helper.helpWidth === void 0) {
          helper.helpWidth = contextOptions && contextOptions.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
        }
        return helper.formatHelp(this, helper);
      }
      /**
       * @private
       */
      _getHelpContext(contextOptions) {
        contextOptions = contextOptions || {};
        const context = { error: !!contextOptions.error };
        let write;
        if (context.error) {
          write = (arg) => this._outputConfiguration.writeErr(arg);
        } else {
          write = (arg) => this._outputConfiguration.writeOut(arg);
        }
        context.write = contextOptions.write || write;
        context.command = this;
        return context;
      }
      /**
       * Output help information for this command.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      outputHelp(contextOptions) {
        let deprecatedCallback;
        if (typeof contextOptions === "function") {
          deprecatedCallback = contextOptions;
          contextOptions = void 0;
        }
        const context = this._getHelpContext(contextOptions);
        this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", context));
        this.emit("beforeHelp", context);
        let helpInformation = this.helpInformation(context);
        if (deprecatedCallback) {
          helpInformation = deprecatedCallback(helpInformation);
          if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
            throw new Error("outputHelp callback must return a string or a Buffer");
          }
        }
        context.write(helpInformation);
        if (this._getHelpOption()?.long) {
          this.emit(this._getHelpOption().long);
        }
        this.emit("afterHelp", context);
        this._getCommandAndAncestors().forEach(
          (command) => command.emit("afterAllHelp", context)
        );
      }
      /**
       * You can pass in flags and a description to customise the built-in help option.
       * Pass in false to disable the built-in help option.
       *
       * @example
       * program.helpOption('-?, --help' 'show help'); // customise
       * program.helpOption(false); // disable
       *
       * @param {(string | boolean)} flags
       * @param {string} [description]
       * @return {Command} `this` command for chaining
       */
      helpOption(flags, description) {
        if (typeof flags === "boolean") {
          if (flags) {
            this._helpOption = this._helpOption ?? void 0;
          } else {
            this._helpOption = null;
          }
          return this;
        }
        flags = flags ?? "-h, --help";
        description = description ?? "display help for command";
        this._helpOption = this.createOption(flags, description);
        return this;
      }
      /**
       * Lazy create help option.
       * Returns null if has been disabled with .helpOption(false).
       *
       * @returns {(Option | null)} the help option
       * @package
       */
      _getHelpOption() {
        if (this._helpOption === void 0) {
          this.helpOption(void 0, void 0);
        }
        return this._helpOption;
      }
      /**
       * Supply your own option to use for the built-in help option.
       * This is an alternative to using helpOption() to customise the flags and description etc.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addHelpOption(option) {
        this._helpOption = option;
        return this;
      }
      /**
       * Output help information and exit.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      help(contextOptions) {
        this.outputHelp(contextOptions);
        let exitCode = process2.exitCode || 0;
        if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
          exitCode = 1;
        }
        this._exit(exitCode, "commander.help", "(outputHelp)");
      }
      /**
       * Add additional text to be displayed with the built-in help.
       *
       * Position is 'before' or 'after' to affect just this command,
       * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
       *
       * @param {string} position - before or after built-in help
       * @param {(string | Function)} text - string to add, or a function returning a string
       * @return {Command} `this` command for chaining
       */
      addHelpText(position, text2) {
        const allowedValues = ["beforeAll", "before", "after", "afterAll"];
        if (!allowedValues.includes(position)) {
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        const helpEvent = `${position}Help`;
        this.on(helpEvent, (context) => {
          let helpStr;
          if (typeof text2 === "function") {
            helpStr = text2({ error: context.error, command: context.command });
          } else {
            helpStr = text2;
          }
          if (helpStr) {
            context.write(`${helpStr}
`);
          }
        });
        return this;
      }
      /**
       * Output help information if help flags specified
       *
       * @param {Array} args - array of options to search for help flags
       * @private
       */
      _outputHelpIfRequested(args) {
        const helpOption = this._getHelpOption();
        const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
        if (helpRequested) {
          this.outputHelp();
          this._exit(0, "commander.helpDisplayed", "(outputHelp)");
        }
      }
    };
    function incrementNodeInspectorPort(args) {
      return args.map((arg) => {
        if (!arg.startsWith("--inspect")) {
          return arg;
        }
        let debugOption;
        let debugHost = "127.0.0.1";
        let debugPort = "9229";
        let match;
        if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
          debugOption = match[1];
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
          debugOption = match[1];
          if (/^\d+$/.test(match[3])) {
            debugPort = match[3];
          } else {
            debugHost = match[3];
          }
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
          debugOption = match[1];
          debugHost = match[3];
          debugPort = match[4];
        }
        if (debugOption && debugPort !== "0") {
          return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
        }
        return arg;
      });
    }
    exports2.Command = Command2;
  }
});

// node_modules/commander/index.js
var require_commander = __commonJS({
  "node_modules/commander/index.js"(exports2) {
    var { Argument: Argument2 } = require_argument();
    var { Command: Command2 } = require_command();
    var { CommanderError: CommanderError2, InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2 } = require_option();
    exports2.program = new Command2();
    exports2.createCommand = (name) => new Command2(name);
    exports2.createOption = (flags, description) => new Option2(flags, description);
    exports2.createArgument = (name, description) => new Argument2(name, description);
    exports2.Command = Command2;
    exports2.Option = Option2;
    exports2.Argument = Argument2;
    exports2.Help = Help2;
    exports2.CommanderError = CommanderError2;
    exports2.InvalidArgumentError = InvalidArgumentError2;
    exports2.InvalidOptionArgumentError = InvalidArgumentError2;
  }
});

// node_modules/canvas/build/Release/canvas.node
var require_canvas = __commonJS({
  "node_modules/canvas/build/Release/canvas.node"(exports2, module2) {
    module2.exports = "./canvas-DVI4Y35V.node";
  }
});

// node_modules/canvas/lib/bindings.js
var require_bindings2 = __commonJS({
  "node_modules/canvas/lib/bindings.js"(exports2, module2) {
    "use strict";
    var bindings = require_canvas();
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
var require_canvas2 = __commonJS({
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
var require_canvas3 = __commonJS({
  "node_modules/canvas/index.js"(exports2) {
    var Canvas = require_canvas2();
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

// node_modules/commander/esm.mjs
var import_index = __toESM(require_commander(), 1);
var {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  // deprecated old name
  Command,
  Argument,
  Option,
  Help
} = import_index.default;

// src/server/db.ts
var import_fs = __toESM(require("fs"), 1);

// src/types.ts
var TriggerHardwareReloadScene = "trigger-hardware-scene-reload";

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
  return process.env["APP_ENV"] === "test" ? "database-test.json" : "database.json";
}
function readDb() {
  const dbFile = getDatabaseName();
  try {
    const file = import_fs.default.readFileSync(`./${dbFile}`).toString();
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
var import_canvas = __toESM(require_canvas3(), 1);
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
var import_canvas8 = __toESM(require_canvas3(), 1);
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
  return import_fs2.default.readdirSync("./custom_scenes").map((file) => {
    const name = file.split(".")[0];
    const coordinates2 = JSON.parse(
      import_fs2.default.readFileSync(`./custom_scenes/${name}.json`).toString()
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
    import_fs3.default.writeFileSync("./hardware/lastHeartbeat.txt", (/* @__PURE__ */ new Date()).toJSON(), {
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
  const { panel, hardware } = await getData();
  const program2 = new Command();
  program2.name("bigdots").description("Power a hardware LED board").version("0.1.0");
  program2.option("--debug <boolean>").option("--emulate <boolean>");
  program2.parse(process.argv);
  const options = program2.opts();
  const updateQueue = [];
  function RGBAToHexA(rgba, forceRemoveAlpha = false) {
    const hexValues = [...rgba].filter((_number, index) => !forceRemoveAlpha || index !== 3).map((number, index) => index === 3 ? Math.round(number * 255) : number).map((number) => number.toString(16));
    return hexValues.map((string) => string.length === 1 ? "0" + string : string).join("");
  }
  if (!options.emulate) {
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
      if (options.debug && updateQueue.length > 0) {
        console.log("Queue:", updateQueue.length);
      }
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
