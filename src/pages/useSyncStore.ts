import { Context, useContext, useRef } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";

export type Store<T = unknown> = {
  dispatches: Set<() => void>;
  value: T;
  setState: (value: T | ((v: T) => T)) => void;
};

export const useStore = <T>(value: T) => {
  const store = useRef<Store<T>>();
  if (!store.current) {
    const setState = (value: T | ((v: T) => T)) => {
      store.current!.value =
        value instanceof Function ? value(store.current!.value) : value;
      store.current!.dispatches.forEach((v) => v());
    };
    store.current = {
      dispatches: new Set<() => void>(),
      value: value,
      setState,
    };
  }
  return { store: store.current };
};

export const useSelector = <T, R>(store: Store<T>, selector: (v: T) => R) =>
  useSyncExternalStore(
    (onStoreChange) => {
      store.dispatches.add(onStoreChange);
      return () => store.dispatches.delete(onStoreChange);
    },
    () => selector(store.value),
    () => selector(store.value)
  );

export const useContextSelector = <T, R>(
  context: Context<Store<T>>,
  selector: (v: T) => R
) => useSelector(useContext(context), selector);

export const useContextDispatch = <T>(context: Context<Store<T>>) =>
  useContext(context).setState;
