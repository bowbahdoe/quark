import { is } from 'immutable'
import { memoize } from 'lodash'
import { Atom } from './atom'
import { ValueError } from '@mccue/exceptions'

export interface INotifiable<T> {
  notify(sub_name: string, old_val: T, new_val: T): void
}

export interface IStateFunction<T> {
  (state: T, ...args: any[]): T
}

export interface ISubscriptionFunction<T> {
  (state: T, ...args: any[]): any
}

export interface IStore<T> {
  subscribe(caller: INotifiable<T>, sub_name: string, ...args: any[]);
  dispatch(event: string, ...args: any[]);
  reg_event(event_name: string, fn: IStateFunction<T>);
  reg_sub(sub_name: string, fn: IStateFunction<T>)
}

export class GlobalStore<T> implements IStore<T> {
  /**
   * One true source of state for the app
   */
  protected one_true_atom: Atom<T>

  /**
   * Table of event names to functions that will transform the state when
   * that event is dispatched
   */
  private dispatch_table: Map<string, IStateFunction<T>>

  /**
   * Table of subscription names to functions that generate the value for
   * that subscription
   */
  private subscription_table: Map<string, IStateFunction<T>>

  /**
   * Table of subscription names to another table of INotifiables mapped to
   * the arguments that they pass to the subscription function
   */
  private subscribers: Map<string, Map<INotifiable<T>, Set<any[]>>>;

  constructor(initial_state: T) {
    this.one_true_atom = new Atom(initial_state)
    this.dispatch_table = new Map()
    this.subscription_table = new Map()
    this.subscribers = new Map()
    this.one_true_atom.addWatcher('update_subscribers',
                                  this.notify_subscribers.bind(this))
  }


  /**
   * Subscribes the given INotifiable to the subscription given by val and
   * passes the given ...args to the subscription fn
   *
   * This subscription is good for one notify. After each notify the INotifiable
   * needs to resubscribe or it will stop recieving updates
   */
  public subscribe(caller: INotifiable<T>, sub_name: string, ...args: any[]) {
    let subs = this.subscribers.get(sub_name)
    if(subs === undefined) {
      subs = new Map()
      this.subscribers.set(sub_name, subs)
    }

    let notifiable_bucket = subs.get(caller)
    if(notifiable_bucket === undefined) {
      subs.set(caller, new Set([args]))
    }
    else {
      notifiable_bucket.add(args)
    }

    return this.currentSubscriptionValue(sub_name, ...args)
  }

  /**
   * Dispatches the given event with the given args
   */
  public dispatch(event: string, ...args: any[]) {
    let fn = this.dispatch_table.get(event)
    if(!fn) {
      throw new ValueError(`invalid event to dispatch: ${event}`)
    }
    this.one_true_atom.swap(fn, ...args)
  }

  /**
   * Registers the given function to be used when the given event is
   * dispatched for generating the new state value. Silently overrides
   * any other function that was set for the subscription. This function
   * must be PURE otherwise it will not behave correctly
   */
  public reg_event(event_name: string, fn: IStateFunction<T>) {
    this.dispatch_table.set(event_name, memoize(fn))
  }

  /**
   * Registers the given function to be used for the generation of the
   * value for the subscription. Silently overrides any other function
   * that was set for the subscription. This function must be PURE
   * otherwise it will not behave correctly
   */
  public reg_sub(sub_name: string, fn: ISubscriptionFunction<T>) {
    this.subscription_table.set(sub_name, memoize(fn))
  }

  private currentSubscriptionValue(sub_name: string, ...args: any[]) {
    let sub_fn = this.subscription_table.get(sub_name)
    if(sub_fn === undefined) {
      throw new ValueError(`No subscription function set for ${sub_name}`)
    }
    else {
      return sub_fn(this.one_true_atom.deref(), ...args)
    }
  }
  /**
   * Notifies all subscribers whenever the value for a subscription changes
   */
  private notify_subscribers(event_name: string, old_val: T, new_val, T): void {
    let to_notify: any = []
    let to_clean: Array<Set<any[]>> = []

    for(let {0: sub_name, 1: sub_fn} of this.subscription_table) {
      let subscribers = this.subscribers.get(sub_name)
      if(subscribers === undefined) {
        continue;
      }

      for(let {0: notifiable, 1: arg_set} of subscribers) {
        for(let arg_arr of arg_set) {
          let old_sub_val = sub_fn(old_val, ...arg_arr)
          let new_sub_val = sub_fn(new_val, ...arg_arr)

          if(!is(new_sub_val, old_sub_val)) {
            to_notify.push([notifiable, sub_name, old_val, new_val])
            to_clean.push(arg_set)
          }
        }
      }
    }

    to_clean.forEach(s => s.clear())

    for(let {0: notifiable, 1: sub_name, 2: old_val, 3: new_val} of to_notify) {
      notifiable.notify(sub_name, old_val, new_val)
    }
  }
}
