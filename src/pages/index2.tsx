import { createContext } from "react";
import {
  Store,
  useContextDispatch,
  useContextSelector,
  useStore,
} from "../hooks/useSyncStore";

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
        }}
      >
        A
      </button>
      <button
        onClick={() => {
          setState((v) => ({ ...v, b: v.b + 1 }));
        }}
      >
        B
      </button>
    </div>
  );
};

const Page = () => {
  const { store } = useStore({ a: 1, b: 2 });
  return (
    <context.Provider value={store}>
      <div>
        Source code:
        <a href="https://github.com/SoraKumo001/next-syncstore">
          https://github.com/SoraKumo001/next-syncstore
        </a>
      </div>
      <A />
      <B />
      <Send />
    </context.Provider>
  );
};

export default Page;
