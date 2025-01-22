import { Observable, concat, defer, share, take, tap } from 'rxjs';

export function tapOnce<T>(fn: (v: T) => any) {
  return (source$: Observable<T>) => {
    const sharedSource$ = source$.pipe(share());
    const tapped$ = sharedSource$.pipe(tap(fn), take(1));

    return concat(tapped$, sharedSource$);
  };
}
