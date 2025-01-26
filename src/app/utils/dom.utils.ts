import { Observable } from 'rxjs';

/**
 *
 * @param selector
 */
export function elementReady(selector: string): Observable<Element> {
  return new Observable((resolver) => {
    const el = document.querySelector(selector);
    if (el) {
      resolver.next(el);
      resolver.complete();
      return;
    }
    new MutationObserver((_, observer) => {
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolver.next(element);
        resolver.complete();
        observer.disconnect();
      });
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}
