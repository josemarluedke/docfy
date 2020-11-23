"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import glob from 'fast-glob';
const path_1 = __importDefault(require("path"));
const typedoc_1 = __importDefault(require("typedoc"));
const fs_1 = __importDefault(require("fs"));
function default_1() {
    const outPath = path_1.default.join(__dirname, 'test-bla.json');
    const filePaths = [
        path_1.default.join('../../../../../frontile/packages/core/addon/components/close-button.ts')
    ];
    // Setup our TypeDoc app
    const app = new typedoc_1.default.Application();
    // app.options.addReader(
    // new typedoc.TSConfigReader(
    // path.resolve(__dirname, '../packages/core/tsconfig.json')
    // )
    // );
    // console.log('YOOOOO ', ReflectionType);
    app.bootstrap({
        mode: 'file',
        // logger: 'none',
        // target: 'ES5',
        // module: 'CommonJS',
        ignoreCompilerErrors: true,
        experimentalDecorators: true,
        // excludeNotExported: true,
        excludePrivate: true,
        excludeExternals: true
    });
    // console.log(app.components);
    // Actually generate the JSON file
    app.generateJson(filePaths, outPath);
    // Parse it
    var json = JSON.parse(fs_1.default.readFileSync(outPath, 'utf8'));
    let components = [
    // { name, argsType }
    ];
    // json.forEach((item) => {
    json.children.forEach((a) => {
        if (a.extendedTypes) {
            a.extendedTypes.forEach((b) => {
                if (b.name === 'Component') {
                    console.log(a.extendedTypes);
                    console.log(a.name);
                    components.push({ name: a.name, argsType: b.typeArguments[0].name });
                }
            });
        }
    });
    components.forEach((component) => {
        const args = [];
        const argsType = findByName(json, component.argsType);
        argsType.children.forEach((item) => {
            args.push({
                name: item.name,
                type: getType(item.type),
                isOptional: item.flags.isOptional || false
            });
        });
        console.log(args);
        component.args = args;
    });
    console.log(components);
}
exports.default = default_1;
function getType(input) {
    // let a = new ReflectionType(input);
    // console.log(a);
    if (input.type === 'intrinsic') {
        return input.name;
    }
    else {
        return 'TODO -> ' + input.type;
    }
}
function findByName(json, name) {
    let found;
    json.children.forEach((a) => {
        console.log(a.name, name);
        if (a.name === name) {
            found = a;
        }
    });
    return found;
}
