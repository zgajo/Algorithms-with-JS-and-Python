// automatically generated by the FlatBuffers compiler, do not modify

import { Short } from '../../map/node/short';
import { String } from '../../map/node/string';


export enum Key{
  NONE = 0,
  Short = 1,
  String = 2
}

export function unionToKey(
  type: Key,
  accessor: (obj:Short|String) => Short|String|null
): Short|String|null {
  switch(Key[type]) {
    case 'NONE': return null; 
    case 'Short': return accessor(new Short())! as Short;
    case 'String': return accessor(new String())! as String;
    default: return null;
  }
}

export function unionListToKey(
  type: Key, 
  accessor: (index: number, obj:Short|String) => Short|String|null, 
  index: number
): Short|String|null {
  switch(Key[type]) {
    case 'NONE': return null; 
    case 'Short': return accessor(index, new Short())! as Short;
    case 'String': return accessor(index, new String())! as String;
    default: return null;
  }
}
