# next-syncstore

## description

useSyncExternalStore sample program

## Base code

```ts
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
```

## Basic usage

import { Store, useSelector, useStore } from "./useSyncStore";

type StoreType = { a: number; b: number };

const A = ({ store }: { store: Store<StoreType> }) => {
const a = useSelector(store, (v) => v.a);
return <div>A:{a}</div>;
};
const B = ({ store }: { store: Store<StoreType> }) => {
const b = useSelector(store, (v) => v.b);
return <div>B:{b}</div>;
};
const Send = ({ store }: { store: Store<StoreType> }) => (

  <div>
    <button
      onClick={() => {
        store.setState((v) => ({ ...v, a: v.a + 1 }));
      }}
    >
      A
    </button>
    <button
      onClick={() => {
        store.setState((v) => ({ ...v, b: v.b + 1 }));
      }}
    >
      B
    </button>
  </div>
);

const Page = () => {
const { store } = useStore({ a: 1, b: 2 });
return (
<div>
<A store={store} />
<B store={store} />
<Send store={store} />
</div>
);
};

export default Page;

## Context API Version

import { createContext } from "react";
import {
Store,
useContextDispatch,
useContextSelector,
useStore,
} from "./useSyncStore";

type StoreType = { a: number; b: number };

const context = createContext<Store<StoreType>>(undefined as never);

const A = () => {
const a = useContextSelector(context, (v) => v.a);
return <div>A:{a}</div>;
};
const B = () => {
const b = useContextSelector(context, (v) => v.b);
return <div>B:{b}</div>;
};
const Send = () => {
const setState = useContextDispatch(context);
return (
<div>
<button
onClick={() => {
setState((v) => ({ ...v, a: v.a + 1 }));
}} >
A
</button>
<button
onClick={() => {
setState((v) => ({ ...v, b: v.b + 1 }));
}} >
B
</button>
</div>
);
};

const Page = () => {
const { store } = useStore({ a: 1, b: 2 });
return (
<context.Provider value={store}>
<A />
<B />
<Send />
</context.Provider>
);
};

export default Page;
