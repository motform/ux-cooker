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

const defaultLevel   = 0;
let activeCategories = 3;

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
function randomEntry(xs) {
  randomIndex = Math.floor(Math.random() * xs.length);
  return xs[randomIndex];
}

function randomizeParameters() {
  for (const [group, parameters] of Object.entries(parameterGroups)) {
    createParameter(group, randomEntry(parameters));
  }
}

randomizeParameters();
