import * as React from 'react';
import * as _ from 'lodash';

/**
 * Wraps a component in order to attach props which are always present to it
 * @param Component The component to wrap
 * @param constantProps The props to attach to it
 * @returns A stateless React component which may be used in place of the old one
 */
export default function wrapComponent<T, U>(Component:React.ComponentClass<T & U>,
                                            constantProps:T):React.StatelessComponent<U> {
  return (props:U) => React.createElement(Component, _.assign({}, constantProps, props) as T & U);
}