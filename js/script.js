/* TODO: change the word parameters, could be confusing for as it shadows function params
 * 
 * © 2021 Love Lagerkvist
 */

"use strict";

/*
  Data:
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

/*
  Functions:
*/

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

/* Randomize paramaters, insert those into the DOM and return the
   indices of where the chosen parameters are located in parameterGroups. */
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


function serializeParameters(parameterIndicies) {
  let serialization = "";

  for (const index of parameterIndicies)
    serialization += encodeBase16(index);

  return serialization;
}

function deserializeParameters(serializedIndicies) {
  let deserialization = [];

  for (let i = 0; i < serializedIndicies.length; i += 2)
    deserialization.push(decodeBase16(serializedIndicies[i] + serializedIndicies[i+1]));

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

function setupParameters() {
  let shareLink;

  // Check if we have followed a link that included paramaters
  const queryParams = new URLSearchParams(window.location.search);
  const serializedParameters = queryParams.get("p");

  if (serializedParameters) {
    loadParameters(deserializeParameters(serializedParameters));
    shareLink = window.location.href;
  } else { // no shared params, so go pick some new ones!
    const parameterIndicies = randomizeParameters();
    shareLink = shareableLink(serializeParameters(parameterIndicies));
  }

  const shareButton = document.querySelector("#share");
  shareButton.onclick = writeToClipboard(link);
}

/* This is the code that will be executed when the browser visits this page: */

setupParameters();
