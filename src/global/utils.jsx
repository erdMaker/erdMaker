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
  let min;
  for (let i = 0; i < arr.length; i++) {
    if (min == null || parseInt(arr[i][prop]) < parseInt(min[prop])) min = arr[i];
  }
  return min;
}

// Recursively return the entire subtree of node (id) in a list (of ids)
export const getChildren = (list, array, id) => {
  for (let element of array) {
    if (element.parentId === id) {
      list.push(element.id);
      getChildren(list, array, element.id);
    }
  }
};

// Returns x,y coords given polar coords: radius and randomAngle
export const randomPolarToXYCoords = (radius) => {
  const randomAngle = getRandomInt(0, 360);
  const xOffset = radius * Math.cos(randomAngle);
  const yOffset = radius * Math.sin(randomAngle);
  return { xOffset, yOffset };
};
