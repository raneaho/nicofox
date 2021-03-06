/* vim: sw=2 ts=2 sts=2 et filetype=javascript
 * Script for nicofoxPlayer.js: load the NicoFox Player SWF in the XUL window. */

const Cc = Components.classes;
const Ci = Components.interfaces;

const HTML_NS = "http://www.w3.org/1999/xhtml";

function load() {
  /* Find the path */
  if(!window.arguments || !window.arguments[0]) {
    return;
  }
  /* Change the window title */
  document.title = window.arguments[0].title + ' - NicoFox Player';

  /* Prepare flashvars */
  var flashVars = "videoFile=" + encodeURIComponent(window.arguments[0].video) + 
                  "&commentFile=" + encodeURIComponent(window.arguments[0].comment);
  /* Add a html:object to embed the NicoFox Player SWF.
     It seems that the element will follow XUL Layout, so use flex="1" for auto-sizing.
     <html:object type="application/x-shockwave-flash" data="chrome://nicofox/content/nicofoxPlayer.swf" flex="1">
       <param name="quality" value="high" />
       <param name="bgcolor" value="#000000" />
       <param name="allowFullScreen" value="true" />
       <param name="flashvars" value="..." />
     </html:object>
  */
  var objectElement = document.createElementNS("http://www.w3.org/1999/xhtml", "html:object");
  objectElement.setAttribute("type", "application/x-shockwave-flash");
  objectElement.setAttribute("data", "chrome://nicofox/content/nicofoxPlayer.swf");
  objectElement.style.MozBoxFlex = 1;
  objectElement.appendChild(generateParamDOM("quality", "high"));
  objectElement.appendChild(generateParamDOM("bgcolor", "#000000"));
  objectElement.appendChild(generateParamDOM("allowFullScreen", "true"));
  objectElement.appendChild(generateParamDOM("flashvars", flashVars));
  /* Listen to flashblockCheckLoad event, to prevent Flashblock from blocking Player SWF */
  objectElement.addEventListener("flashblockCheckLoad", flashblockEventHandler, false);
  document.getElementById("player-box").appendChild(objectElement);
}

/* Hepler method to generate a <param> DOM element for <object>. */
function generateParamDOM(name, value) {
  var paramElement = document.createElementNS("http://www.w3.org/1999/xhtml", "html:param");
  paramElement.setAttribute("name", name);
  paramElement.setAttribute("value", value);
  return paramElement;
}

/* flashblockCheckLoad event handler. We need to handle this manually since our flash is not under the browser UI.
 * When the default is prevented, Flashblock will not block the flash object.
 * XXX: It should check the Flashblock preferences to determine whether the SWF should be blocked. */
function flashblockEventHandler(event) {
  event.target.removeEventListener("flashblockCheckLoad", flashblockEventHandler, false);
  event.preventDefault();
}
