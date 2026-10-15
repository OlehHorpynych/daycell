/* @ds-bundle: {"format":4,"namespace":"Daycell","components":[{"name":"Frame"},{"name":"Nav"},{"name":"HeroTitle"},{"name":"Tag"},{"name":"Pager"},{"name":"Button"}]} */
(function(){var R=window.React,h=R.createElement;
function cx(){return Array.prototype.filter.call(arguments,Boolean).join(" ")}
var P={search:"M15.5 15.5 20 20",cart:"M3 4h2.5l2 11h11l1.5-8H7",arrow:"M4 12h15M14 7l5 5-5 5",menu:"M4 9h16M4 15h16"};
function Icon(p){var n=p.name;return h("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.5,strokeLinecap:"square","aria-hidden":true},n==="search"?h("circle",{cx:11,cy:11,r:6}):null,n==="cart"?h(R.Fragment,null,h("circle",{cx:9,cy:19,r:1.25}),h("circle",{cx:17,cy:19,r:1.25})):null,h("path",{d:P[n]}))}
function Frame(p){return h("div",{className:cx("dm-frame",p.className),style:p.style},p.children)}
function Nav(p){var links=p.links||[];return h("nav",{className:"dm-nav"},
 h("div",{className:"dm-nav-l"},h("span",{className:"dm-logo"},h("svg",{viewBox:"0 0 100 100","aria-hidden":true},h("circle",{cx:50,cy:50,r:44,fill:"none",stroke:"currentColor",strokeWidth:8}),h("circle",{cx:50,cy:50,r:17,fill:"var(--energy)"})),p.logo||"DAYCELL"),p.section?h("a",{href:"#"},p.section):null),
 h("div",{className:"dm-nav-c"},links.map(function(l,i){return h("a",{key:i,href:"#","aria-current":i===p.active?"page":undefined},l)})),
 h("div",{className:"dm-nav-r"},h("button",{className:"dm-icon","aria-label":"Search"},h(Icon,{name:"search"})),h("button",{className:"dm-icon","aria-label":"Menu"},h(Icon,{name:"menu"}))))}
function HeroTitle(p){return h("div",{className:"dm-hero"},p.index?h("div",{className:"dm-hero-i"},p.index):null,h("h1",{className:"dm-hero-t"},p.title,p.subtitle?h("small",null,p.subtitle):null))}
function Tag(p){return h("span",{className:cx("dm-tag",p.plain&&"dm-tag-plain")},p.children)}
function Pager(p){var n=p.count||3,a=p.active||0;return h("div",{className:"dm-pager",role:"tablist"},Array.from({length:n},function(_,i){return h("button",{key:i,className:"dm-dot","aria-label":"Slide "+(i+1),"aria-current":i===a?"true":undefined,onClick:p.onChange?function(){p.onChange(i)}:undefined})}))}
function Button(p){var v=p.variant||"outline";return h("button",Object.assign({},p,{variant:undefined,icon:undefined,className:cx("dm-btn","dm-btn-"+v,p.className)}),p.children,p.icon?h(Icon,{name:p.icon}):null)}
window.Daycell=Object.assign(window.Daycell||{},{Frame:Frame,Nav:Nav,HeroTitle:HeroTitle,Tag:Tag,Pager:Pager,Button:Button,Icon:Icon});})();
