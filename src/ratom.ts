import { Atom, IWatcherFn, IValidationFn } from './atom'
import { Component } from 'react'
import { is } from 'immutable'

export class RAtom<T> extends Atom<T> {
  /**
   * The set of components to rerender on a state change
   */
  private components: Set<Component<any, any>>

  constructor(value: T,
              validators: Map<string, IValidationFn<T>> = new Map(),
              watchers: Map<string, IWatcherFn<T>> = new Map()) {
    super(value, validators, watchers)
    this.components = new Set()
    this.addWatcher("rerender_watcher", this.rerenderWatcher.bind(this))
  }

  /**
   * Registers the component to rerender when the state changes
   * @param {Component<any, any>} component: The component to register
   */
  public register(component: Component<any, any>) {
    this.components.add(component)
  }


  /**
   * Gets the current value of the RAtom. If ref is passed, it will call
   * forceUpdate on that Component whenever the state changes
   */
  public deref(ref?: Component<any, any>) {
    if(ref) {
      this.register(ref);
    }
    return super.deref()
  }

  /**
   * Triggers a rerender on all registered components when the state changes
   */
  private rerenderWatcher(key: string, old_val: T, new_val: T) {
    if(!(is(old_val, new_val))) {
      for(let component of this.components) {
        component.forceUpdate()
      }
    }
  }
}
