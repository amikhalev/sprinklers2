import {List} from 'immutable';

export default function mergeById(list, newItems) {
  return List(list).withMutations(oldList => {
    newItems.forEach(item => {
      let i = oldList.findIndex(oldItem => oldItem.id === item.id);
      if (i === -1) {
        oldList.push(item);
      } else {
        oldList.set(i, item);
      }
    });
  }).sort((a, b) => a.id - b.id);
}