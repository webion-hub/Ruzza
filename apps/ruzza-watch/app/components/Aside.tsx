import {createContext, useContext, useEffect, useState, useId} from 'react';
import type {ReactNode} from 'react';

export type AsideType = 'search' | 'cart' | 'mobile' | 'closed';

interface AsideContextValue {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
}

interface AsideProps {
  children?: ReactNode;
  type: AsideType;
  heading: ReactNode;
}

export function Aside({children, heading, type}: AsideProps) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
      aria-labelledby={id}
    >
      <button className="close-outside" onClick={close} />
      <aside>
        <header>
          <h3 id={id}>{heading}</h3>
          <button className="close reset" onClick={close} aria-label="Close">
            &times;
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside(): AsideContextValue {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
