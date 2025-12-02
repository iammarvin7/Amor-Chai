/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/auth/callback/route";
exports.ids = ["app/auth/callback/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fauth%2Fcallback%2Froute&page=%2Fauth%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fauth%2Fcallback%2Froute.ts&appDir=%2FUsers%2Fmarvinchaudhary%2FDesktop%2FCodes%2FREACT%2FAmor_Chai_website%2Famor-chai-website%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmarvinchaudhary%2FDesktop%2FCodes%2FREACT%2FAmor_Chai_website%2Famor-chai-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fauth%2Fcallback%2Froute&page=%2Fauth%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fauth%2Fcallback%2Froute.ts&appDir=%2FUsers%2Fmarvinchaudhary%2FDesktop%2FCodes%2FREACT%2FAmor_Chai_website%2Famor-chai-website%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmarvinchaudhary%2FDesktop%2FCodes%2FREACT%2FAmor_Chai_website%2Famor-chai-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_marvinchaudhary_Desktop_Codes_REACT_Amor_Chai_website_amor_chai_website_app_auth_callback_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/auth/callback/route.ts */ \"(rsc)/./app/auth/callback/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/auth/callback/route\",\n        pathname: \"/auth/callback\",\n        filename: \"route\",\n        bundlePath: \"app/auth/callback/route\"\n    },\n    resolvedPagePath: \"/Users/marvinchaudhary/Desktop/Codes/REACT/Amor_Chai_website/amor-chai-website/app/auth/callback/route.ts\",\n    nextConfigOutput,\n    userland: _Users_marvinchaudhary_Desktop_Codes_REACT_Amor_Chai_website_amor_chai_website_app_auth_callback_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhdXRoJTJGY2FsbGJhY2slMkZyb3V0ZSZwYWdlPSUyRmF1dGglMkZjYWxsYmFjayUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmF1dGglMkZjYWxsYmFjayUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1hcnZpbmNoYXVkaGFyeSUyRkRlc2t0b3AlMkZDb2RlcyUyRlJFQUNUJTJGQW1vcl9DaGFpX3dlYnNpdGUlMkZhbW9yLWNoYWktd2Vic2l0ZSUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZtYXJ2aW5jaGF1ZGhhcnklMkZEZXNrdG9wJTJGQ29kZXMlMkZSRUFDVCUyRkFtb3JfQ2hhaV93ZWJzaXRlJTJGYW1vci1jaGFpLXdlYnNpdGUmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3lEO0FBQ3RJO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsid2VicGFjazovL2Ftb3ItY2hhaS13ZWJzaXRlLz82NjNkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvbWFydmluY2hhdWRoYXJ5L0Rlc2t0b3AvQ29kZXMvUkVBQ1QvQW1vcl9DaGFpX3dlYnNpdGUvYW1vci1jaGFpLXdlYnNpdGUvYXBwL2F1dGgvY2FsbGJhY2svcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXV0aC9jYWxsYmFjay9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXV0aC9jYWxsYmFja1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hdXRoL2NhbGxiYWNrL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL21hcnZpbmNoYXVkaGFyeS9EZXNrdG9wL0NvZGVzL1JFQUNUL0Ftb3JfQ2hhaV93ZWJzaXRlL2Ftb3ItY2hhaS13ZWJzaXRlL2FwcC9hdXRoL2NhbGxiYWNrL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fauth%2Fcallback%2Froute&page=%2Fauth%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fauth%2Fcallback%2Froute.ts&appDir=%2FUsers%2Fmarvinchaudhary%2FDesktop%2FCodes%2FREACT%2FAmor_Chai_website%2Famor-chai-website%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmarvinchaudhary%2FDesktop%2FCodes%2FREACT%2FAmor_Chai_website%2Famor-chai-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./app/auth/callback/route.ts":
/*!************************************!*\
  !*** ./app/auth/callback/route.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\nasync function GET(request) {\n    const { searchParams, origin } = new URL(request.url);\n    const code = searchParams.get('code');\n    // if \"next\" is in param, use it as the redirect URL\n    const next = searchParams.get('next') ?? '/';\n    if (code) {\n        const supabaseUrl = \"https://pgabcwsdvmwwqmdkqvhx.supabase.co\";\n        const supabaseAnonKey = \"sb_publishable_lmVyROZ1EG6_ARWDAbks7w_Ff7DXfPn\";\n        if (supabaseUrl && supabaseAnonKey) {\n            // Create a client for this request\n            const supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__.createClient)(supabaseUrl, supabaseAnonKey);\n            const { error } = await supabase.auth.exchangeCodeForSession(code);\n            if (!error) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(`${origin}${next}`);\n            }\n        }\n    }\n    // Return the user to an error page with instructions\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(`${origin}`);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXV0aC9jYWxsYmFjay9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBcUQ7QUFDVjtBQUVwQyxlQUFlRSxJQUFJQyxPQUFnQjtJQUN4QyxNQUFNLEVBQUVDLFlBQVksRUFBRUMsTUFBTSxFQUFFLEdBQUcsSUFBSUMsSUFBSUgsUUFBUUksR0FBRztJQUNwRCxNQUFNQyxPQUFPSixhQUFhSyxHQUFHLENBQUM7SUFDOUIsb0RBQW9EO0lBQ3BELE1BQU1DLE9BQU9OLGFBQWFLLEdBQUcsQ0FBQyxXQUFXO0lBRXpDLElBQUlELE1BQU07UUFDUixNQUFNRyxjQUFjQywwQ0FBb0M7UUFDeEQsTUFBTUcsa0JBQWtCSCxnREFBeUM7UUFFakUsSUFBSUQsZUFBZUksaUJBQWlCO1lBQ2xDLG1DQUFtQztZQUNuQyxNQUFNRSxXQUFXakIsbUVBQVlBLENBQUNXLGFBQWFJO1lBQzNDLE1BQU0sRUFBRUcsS0FBSyxFQUFFLEdBQUcsTUFBTUQsU0FBU0UsSUFBSSxDQUFDQyxzQkFBc0IsQ0FBQ1o7WUFFN0QsSUFBSSxDQUFDVSxPQUFPO2dCQUNWLE9BQU9qQixxREFBWUEsQ0FBQ29CLFFBQVEsQ0FBQyxHQUFHaEIsU0FBU0ssTUFBTTtZQUNqRDtRQUNGO0lBQ0Y7SUFFQSxxREFBcUQ7SUFDckQsT0FBT1QscURBQVlBLENBQUNvQixRQUFRLENBQUMsR0FBR2hCLFFBQVE7QUFDMUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hbW9yLWNoYWktd2Vic2l0ZS8uL2FwcC9hdXRoL2NhbGxiYWNrL3JvdXRlLnRzPzI1ZjAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcbmltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIGNvbnN0IHsgc2VhcmNoUGFyYW1zLCBvcmlnaW4gfSA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICBjb25zdCBjb2RlID0gc2VhcmNoUGFyYW1zLmdldCgnY29kZScpO1xuICAvLyBpZiBcIm5leHRcIiBpcyBpbiBwYXJhbSwgdXNlIGl0IGFzIHRoZSByZWRpcmVjdCBVUkxcbiAgY29uc3QgbmV4dCA9IHNlYXJjaFBhcmFtcy5nZXQoJ25leHQnKSA/PyAnLyc7XG5cbiAgaWYgKGNvZGUpIHtcbiAgICBjb25zdCBzdXBhYmFzZVVybCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTDtcbiAgICBjb25zdCBzdXBhYmFzZUFub25LZXkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWTtcblxuICAgIGlmIChzdXBhYmFzZVVybCAmJiBzdXBhYmFzZUFub25LZXkpIHtcbiAgICAgIC8vIENyZWF0ZSBhIGNsaWVudCBmb3IgdGhpcyByZXF1ZXN0XG4gICAgICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChzdXBhYmFzZVVybCwgc3VwYWJhc2VBbm9uS2V5KTtcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZXhjaGFuZ2VDb2RlRm9yU2Vzc2lvbihjb2RlKTtcblxuICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KGAke29yaWdpbn0ke25leHR9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSB1c2VyIHRvIGFuIGVycm9yIHBhZ2Ugd2l0aCBpbnN0cnVjdGlvbnNcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5yZWRpcmVjdChgJHtvcmlnaW59YCk7XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlQ2xpZW50IiwiTmV4dFJlc3BvbnNlIiwiR0VUIiwicmVxdWVzdCIsInNlYXJjaFBhcmFtcyIsIm9yaWdpbiIsIlVSTCIsInVybCIsImNvZGUiLCJnZXQiLCJuZXh0Iiwic3VwYWJhc2VVcmwiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIiwic3VwYWJhc2VBbm9uS2V5IiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkiLCJzdXBhYmFzZSIsImVycm9yIiwiYXV0aCIsImV4Y2hhbmdlQ29kZUZvclNlc3Npb24iLCJyZWRpcmVjdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/auth/callback/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tslib"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fauth%2Fcallback%2Froute&page=%2Fauth%2Fcallback%2Froute&appPaths=&pagePath=private-next-app-dir%2Fauth%2Fcallback%2Froute.ts&appDir=%2FUsers%2Fmarvinchaudhary%2FDesktop%2FCodes%2FREACT%2FAmor_Chai_website%2Famor-chai-website%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmarvinchaudhary%2FDesktop%2FCodes%2FREACT%2FAmor_Chai_website%2Famor-chai-website&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();