import { GlobalStore, INotifiable } from './store'
import { Component } from 'react'

export class ReactGlobalStore<T> extends GlobalStore<T> {
  /**
   * The Map of Components to INotifiables that wrap those components.
   */
  private notifiable_comps: Map<Component<any,any>, INotifiable<T>>

  constructor(initial_state: T) {
    super(initial_state)
    this.notifiable_comps = new Map()
  }

  /**
   * Subscribes the given INotifiable or Component to the given subscription
   * string with the args that are passed.
   */
  public subscribe(caller: Component<any, any> | INotifiable<T>, val: string, ...args: any[]) {
    if(caller instanceof Component) {
      caller = this.notifiableForComponent(caller)
    }
    return super.subscribe(caller, val, ...args)
  }

  /**
   * Returns the INotifiable that is associated with the Component and if there
   * is not one it creates it. This is to prevent subscribing a component more
   * than once
   */
  private notifiableForComponent(comp: Component<any, any>) : INotifiable<T> {
    let notifiable = this.notifiable_comps.get(comp)
    if(notifiable === undefined) {
      notifiable =  {notify: () => { comp.forceUpdate() }}
      this.notifiable_comps.set(comp, notifiable)
    }
    return notifiable
  }
}
