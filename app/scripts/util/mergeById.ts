import {List} from 'immutable';

interface WithId {
  id:number
}

export default function mergeById<I extends WithId>(list:List<I>, newItems:(List<I>)) : List<I> {
  return list.withMutations(oldList => {
    newItems.forEach(item => {
      let i = oldList.findIndex(oldItem => oldItem.id === item.id);
      if (i === -1) {
        oldList.push(item);
      } else {
        oldList.set(i, item);
      }
    });
  }).sort((a, b) => a.id - b.id).toList();
}