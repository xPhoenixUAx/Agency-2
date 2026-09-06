// Shared entry for the hosted modules and the generated folder-preview bundle.
// After editing JS modules, rebuild the folder preview from the project root (PowerShell):
// npm.cmd exec --yes --package=esbuild@0.25.9 -- esbuild js/app.js --bundle --format=iife `
//   --target=es2022 --outfile=js/local-preview.js --define:import.meta.url=localPreviewScriptURL `
//   '--banner:js=/* Generated from js/app.js; see its rebuild command. */ (() => { const localPreviewScriptURL = document.currentScript.src;' `
//   '--footer:js=})();'
// PHP hosting loads these modules directly and does not need a build step.
import './main.js';
import './form.js';
import './results.js';
