(self.webpackChunk_nikitajs_website=self.webpackChunk_nikitajs_website||[]).push([[713],{5270:function(e){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n},e.exports.__esModule=!0,e.exports.default=e.exports},1232:function(e,t,r){var n=r(5270);e.exports=function(e){if(Array.isArray(e))return n(e)},e.exports.__esModule=!0,e.exports.default=e.exports},3061:function(e,t,r){var n=r(742),o=r(1549);function u(t,r,s){return o()?(e.exports=u=Reflect.construct,e.exports.__esModule=!0,e.exports.default=e.exports):(e.exports=u=function(e,t,r){var o=[null];o.push.apply(o,t);var u=new(Function.bind.apply(e,o));return r&&n(u,r.prototype),u},e.exports.__esModule=!0,e.exports.default=e.exports),u.apply(null,arguments)}e.exports=u,e.exports.__esModule=!0,e.exports.default=e.exports},1549:function(e){e.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}},e.exports.__esModule=!0,e.exports.default=e.exports},1557:function(e){e.exports=function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)},e.exports.__esModule=!0,e.exports.default=e.exports},1359:function(e){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")},e.exports.__esModule=!0,e.exports.default=e.exports},5182:function(e,t,r){var n=r(1232),o=r(1557),u=r(6487),s=r(1359);e.exports=function(e){return n(e)||o(e)||u(e)||s()},e.exports.__esModule=!0,e.exports.default=e.exports},6487:function(e,t,r){var n=r(5270);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}},e.exports.__esModule=!0,e.exports.default=e.exports},9888:function(e,t,r){"use strict";r.r(t);var n=r(6666),o=r(2784),u=r(8447),s=r(4099),c=r(3730),p=r(6169),i=r(5035);function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){(0,n.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}t.default=function(e){var t=e.data.page;return(0,i.tZ)(p.Z,{page:a(a({keywords:t.keywords,description:t.description},t.parent.frontmatter),{},{slug:t.slug,version:t.version.alias,edit_url:t.edit_url})},(0,i.tZ)(o.Fragment,null,(0,i.tZ)(s.MDXProvider,null,(0,i.tZ)(c.MDXRenderer,null,t.parent.body)),t.actions&&(0,i.tZ)(o.Fragment,null,(0,i.tZ)("h2",null,"Actions"),(0,i.tZ)("ul",null,t.actions.sort((function(e,t){return e.slug>t.slug})).map((function(e){return(0,i.tZ)("li",{key:e.slug},(0,i.tZ)(u.Link,{to:e.slug},e.name))}))))))}},3730:function(e,t,r){var n=r(3121);e.exports={MDXRenderer:n}},3121:function(e,t,r){var n=r(3061),o=r(5182),u=r(1260),s=r(8834),c=["scope","children"];function p(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?p(Object(r),!0).forEach((function(t){u(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):p(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var l=r(2784),a=r(4099).mdx,f=r(1364).useMDXScope;e.exports=function(e){var t=e.scope,r=e.children,u=s(e,c),p=f(t),d=l.useMemo((function(){if(!r)return null;var e=i({React:l,mdx:a},p),t=Object.keys(e),u=t.map((function(t){return e[t]}));return n(Function,["_fn"].concat(o(t),[""+r])).apply(void 0,[{}].concat(o(u)))}),[r,t]);return l.createElement(d,i({},u))}}}]);
//# sourceMappingURL=component---src-templates-package-js-2ae2a4fd799203598f62.js.map