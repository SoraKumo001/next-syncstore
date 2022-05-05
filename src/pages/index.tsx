import { Store, useSelector, useStore } from "../hooks/useSyncStore";

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
      <div>
        Source code:
        <a href="https://github.com/SoraKumo001/next-syncstore">
          https://github.com/SoraKumo001/next-syncstore
        </a>
      </div>
      <A store={store} />
      <B store={store} />
      <Send store={store} />
    </div>
  );
};

export default Page;
