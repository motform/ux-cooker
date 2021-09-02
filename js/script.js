/*
 */

const parameterGroups = {
  scenario: [
    "File Browser",
    "Group Messaging",
    "Video Player",
  ],

  medium: [
    "Pen & Paper",
    "Software",
    "HTML & CSS"
  ],

  viewport: [
    "Desktop",
    "Tablet",
    "Mobile",
    "Wearable",
  ],
};

/* Modified from Eloquent Javascript to accept an object
   of {nodeClass and nodeId} for the created element.
   https://eloquentjavascript.net/14_dom.html */
function elt(type, {nodeClass, nodeId}, ...children) {
  const node = document.createElement(type);
  if (nodeClass) node.setAttribute("class", nodeClass);
  if (nodeId)    node.setAttribute("id", nodeId);

  for (const child of children) {
    if (typeof child != "string") node.appendChild(child);
    else node.appendChild(document.createTextNode(child));
  }

  return node;
}

/* This function creates this type of structure:
   <div class="parameter-group" id="scenario">
   <h3>Scenario</h3>
   <h2>File Browser</h3>
   </div> */
function createParameter(group, parameter) {
  document.querySelector("#parameters").appendChild(
    elt("div", {nodeClass: "parameter-group", nodeId: group},
        elt("h3", {}, group),
        elt("h2", {}, parameter))
  );
}

/* Return a random entry in `xs`. */
function randomIndex(xs) {
  return Math.floor(Math.random() * xs.length);
}

function loadParameters(deserializedParameters) {
  let i = 0;
  for (const [group, parameters] of Object.entries(parameterGroups)) {
    createParameter(group, parameters[deserializedParameters[i]]);
    i += 1;
  }
}

function randomizeParameters() {
  let parameterIndicies = [];

  for (const [group, parameters] of Object.entries(parameterGroups)) {
    const i = randomIndex(parameters);
    parameterIndicies.push(i);
    createParameter(group, parameters[i]);
  }

  return parameterIndicies;
}

function encodeBase16(x) {
  let encoded = x.toString(16);
  if (encoded.length < 2) encoded = '0' + encoded;
  return encoded;
}

function decodeBase16(x) {
  return parseInt(x, 16);
}

/* A very classic, efficient way to partition an array that is way
   overkill in this case. YAGNI etc. */
function partition(n, xs, all=true) {
  let result = [];
  let tup = [xs[0]];

  for (let i = 1; i < xs.length; i += 1) {
    if (!(i % n)) {
      result.push(tup);
      tup = [];
    }
    tup.push(xs[i]);
  }

  if (all && tup.length) result.push(tup);
  return result;
}

function serializeParameters(parameterIndicies) {
  let serialization = "";

  for (const index of parameterIndicies)
    serialization += encodeBase16(index);

  return serialization;
}

function deserializeParameters(serializedIndicies) {
  let deserialization = [];

  for (const index of partition(2, serializedIndicies))
    deserialization.push(decodeBase16(index.join('')));

  return deserialization;
}

function shareableLink(serializedParameters) {
  const queryParams = new URLSearchParams({"p": serializedParameters});
  const link = new URL(window.location.href + '?' + queryParams);
  return link;
}

function writeToClipboard(x) {
  return function() {
    var data = [new ClipboardItem({ "text/plain": new Blob([x], {type: "text/plain"})})];
    navigator.clipboard.write(data).then(function() {
      console.log("Copied to clipboard successfully!");
    }, function() {
      console.error("Unable to write to clipboard. :-(");
    });
  }
}

const queryParams = new URLSearchParams(window.location.search);
const serializedParameters = queryParams.get("p");
let link;

if (serializedParameters) {
  loadParameters(deserializeParameters(serializedParameters));
  link = window.location.href;
} else {
  const parameterIndicies = randomizeParameters();
  link = shareableLink(serializeParameters(parameterIndicies));
}

const shareButton = document.querySelector("#share");
shareButton.onclick = writeToClipboard(link);
