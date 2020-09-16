export function vwToPixels(stageWidth, vw) {
  return (stageWidth * vw) / 100;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function minJsonArray(arr, prop) {
  var min;
  for (let i = 0; i < arr.length; i++) {
    if (min == null || parseInt(arr[i][prop]) < parseInt(min[prop])) min = arr[i];
  }
  return min;
}

export const getChildren = (list, array, id) => {
  for (let i in array) {
    if (array[i].parentId === id) {
      list.push(array[i].id);
      getChildren(list, array, array[i].id);
    }
  }
};
