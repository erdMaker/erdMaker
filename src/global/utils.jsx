// Returns vw or vh (percent) in pixels. screenDimension is screen's total width or height
export function PercentToPixels(screenDimension, percent) {
  return (screenDimension * percent) / 100;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Returns the distance of two vertices in 2D space
export function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

// Return the element of an array with the minimum prop attribute
export function minJsonArray(arr, prop) {
  var min;
  for (let i = 0; i < arr.length; i++) {
    if (min == null || parseInt(arr[i][prop]) < parseInt(min[prop])) min = arr[i];
  }
  return min;
}

// Recursively return the entire subtree of node (id) in a list (of ids)
export const getChildren = (list, array, id) => {
  for (let i in array) {
    if (array[i].parentId === id) {
      list.push(array[i].id);
      getChildren(list, array, array[i].id);
    }
  }
};

// Check if user is on Safari Browser
export function onSafari() {
  // Get the user-agent string
  let userAgentString = navigator.userAgent;

  // Detect Chrome
  let chromeAgent = userAgentString.indexOf("Chrome") > -1;

  // Detect Safari
  let safariAgent = userAgentString.indexOf("Safari") > -1;

  // Discard Safari since it also matches Chrome
  if (chromeAgent && safariAgent) return false;
  else return true;
}
