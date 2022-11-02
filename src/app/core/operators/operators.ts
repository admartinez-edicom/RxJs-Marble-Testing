import { catchError, concat, debounceTime, distinctUntilChanged, Observable, of, pipe, startWith, switchMap, UnaryFunction } from "rxjs";

export function delayedSearch<T>(initialValue: string, fn: (search: string) => Observable<T[]>): UnaryFunction<Observable<string>, Observable<T[] | undefined>> {
    return pipe(
        debounceTime<string>(500),
        startWith(initialValue),
        distinctUntilChanged(),
        switchMap((search) => concat(
            of(undefined),
            fn(search).pipe(catchError(() => of([])))
        )),
    );
}