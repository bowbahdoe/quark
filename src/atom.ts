/**
 * Emulates ClojureScript atoms in a simplistic way
 */

import { is } from 'immutable'

import { IllegalArgumentException } from '@mccue/exceptions'

export interface IWatcherFn<T> {
  (key: string, old_val: T, new_val: T): void
}

export interface IValidationFn<T> {
  (val: T): boolean
}

export class Atom<T> {
  private value: T
  private validators:  Map<string, IValidationFn<T>>
  private watchers:  Map<string, IWatcherFn<T>>

  /**
   * constructor - Constructs an atom from the given value
   *
   * @param {T} value: the value to store in the atom. Assumes that
   * The value is immutable, either a ImmutableJS value or a primitive
   * value
   * @param {Array<IValidationFn<T>} validators: an array of functions
   * that validate the value returned from a swap or provided to a reset
   *
   * @param {Array<IWatcherFn<T>>} watchers: an array of functions
   * that will be called after each change of the atom's state
   */
  constructor(value: T,
              validators: Map<string, IValidationFn<T>> = new Map(),
              watchers: Map<string, IWatcherFn<T>> = new Map()) {
    this.value = value
    this.validators = validators
    this.watchers = watchers
  }


  /**
   * Applies the [pure] function to the current value of the atom and swaps
   * the atom with the returned value
   *
   * @param {(T, ...any[]) => T} fn: The function to apply to the atom's value.
   * @param {...any[]} args: The arguments to apply to the function
   */
  public swap(fn: (val: T, ...args: any[]) => T, ...args): void {
    while(true) {
      let old_val = this.value
      let new_val = fn(this.value, ...args)

      if(!this.validate_value(new_val)) {
        throw new IllegalArgumentException(
          'The returned from the swap function did not pass all validators ' +
          `old: ${old_val}, new: ${new_val}`
        )
      }

      if(is(old_val, this.value)) {
        this.value = new_val
        this.call_watchers(old_val, this.value)
        break;
      }
    }
  }

  /**
   * Resets the atom to have the new value
   * @param {T} val: the new value for the atom
   */
  public reset(val: T): void {
    if(this.validate_value(val)) {
        let old_val = this.value
        this.value = val
        this.call_watchers(old_val, this.value)
    }
    else {
      throw new IllegalArgumentException(
        'The value provided to reset did not pass all validators ' +
        `new: ${val}`
      )
    }
  }

  /**
   * Gets the value of the atom.
   */
  public deref(): T {
    return this.value
  }

  /**
   * Adds a validator to the end of the stack of validators
   */
  private addValidator(key: string, validator: IValidationFn<T>) {
    this.validators.set(key, validator);
  }

  /**
   * Adds a watcher to the end of the stack of watchers
   */
  public addWatcher(key: string, watcher: IWatcherFn<T>) {
    this.watchers.set(key, watcher)
  }

  /**
   * Returns if all the validators on this atom return true for the value.
   * @param {T} val: The potential value for this atom.
   * @return {boolean} Whether all the validators passed.
   */
  private validate_value(val: T): boolean {
    for(let validator of this.validators.values()) {
      if(!validator(val)) {
        return false
      }
    }
    return true
  }


  /**
   * Calls all the watchers on this atom
   *
   * @param  {T} old_val: The previous value of the atom
   * @param  {T} new_val: The new value of the atom
   */
  private call_watchers(old_val: T, new_val: T) {
    for(let {0: key, 1: watcher} of this.watchers) {
      watcher(key, old_val, new_val)
    }
  }
}
