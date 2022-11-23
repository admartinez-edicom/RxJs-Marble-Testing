import { TestScheduler } from "rxjs/testing";
import { delayedSearch } from "./operators";

const LIST = ['Apple', 'Grapes'];
const LIST_FILTERED_BY_APP = ['Apple'];
const SOURCE_VALUES = {
    a: 'a',
    b: 'ap',
    c: 'app',
    d: 'appl',
    e: '1'
}
const EXPECTED_VALUES = {
    u: undefined,
    x: [],
    y: LIST,
    z: LIST_FILTERED_BY_APP,
}

describe('Operators', () => {
    let testScheduler: TestScheduler;

    beforeEach(() => {
        testScheduler = new TestScheduler((actual, expected) => {
            // We connect to Jasmine
            expect(actual).toEqual(expected);
        });
    })


    it('should delayedSearch emit initial value and debounce search function call', () => {
        testScheduler.run(({ cold, hot, expectObservable, flush }) => {
            const source = hot('    999ms a         49ms b 49ms c         ', SOURCE_VALUES);
            const expected = '      u 199ms y 799ms 50ms   50ms   499ms u 599ms z ';

            const searchFn = jasmine.createSpy('searchFn');
            searchFn.and.returnValues(
                cold('200ms y|', EXPECTED_VALUES),
                cold('600ms z|', EXPECTED_VALUES),
            );
            const result = source.pipe(
                delayedSearch('', searchFn)
            );

            expectObservable(result).toBe(expected, EXPECTED_VALUES);
            flush();

            expect(searchFn).toHaveBeenCalledTimes(2);
            expect(searchFn.calls.all()[0].args).toEqual(['']);
            expect(searchFn.calls.all()[1].args).toEqual(['app']);
        });
    });

    it('should delayedSearch cancel previous subscription if source emits value', () => {
        testScheduler.run(({ cold, hot, expectObservable, flush }) => {
            const source = hot('    99ms    c                ', SOURCE_VALUES);
            const expected = '      u 99ms  499ms u 599ms z';

            const searchFn = jasmine.createSpy('searchFn');
            searchFn.and.returnValues(
                cold('700ms y|', EXPECTED_VALUES),
                cold('600ms z|', EXPECTED_VALUES),
            );
            const result = source.pipe(
                delayedSearch('', searchFn)
            );

            expectObservable(result).toBe(expected, EXPECTED_VALUES);
            flush();

            expect(searchFn).toHaveBeenCalledTimes(2);
            expect(searchFn.calls.all()[0].args).toEqual(['']);
            expect(searchFn.calls.all()[1].args).toEqual(['app']);
        });
    });

    it('should delayedSearch not call search function if same value is emited within 500ms', () => {
        testScheduler.run(({ cold, hot, expectObservable, flush }) => {
            const source = hot('    999ms           c 1100ms        d 299ms c', SOURCE_VALUES);
            const expected = '      u 199ms y 799ms 499ms u 599ms z          ';

            const searchFn = jasmine.createSpy('searchFn');
            searchFn.and.returnValues(
                cold('200ms y|', EXPECTED_VALUES),
                cold('600ms z|', EXPECTED_VALUES),
            );
            const result = source.pipe(
                delayedSearch('', searchFn)
            );

            expectObservable(result).toBe(expected, EXPECTED_VALUES);
            flush();

            expect(searchFn).toHaveBeenCalledTimes(2);
            expect(searchFn.calls.all()[0].args).toEqual(['']);
            expect(searchFn.calls.all()[1].args).toEqual(['app']);
        });
    });

    it('should delayedSearch handle errors propertly', () => {
        testScheduler.run(({ cold, hot, expectObservable, flush }) => {
            const source = hot('    999ms           e', SOURCE_VALUES);
            const expected = '      u 199ms y 799ms 499ms u 299ms x';

            const searchFn = jasmine.createSpy('searchFn');
            searchFn.and.returnValues(
                cold('200ms y|', EXPECTED_VALUES),
                cold('300ms #'),
            );
            const result = source.pipe(
                delayedSearch('', searchFn)
            );

            expectObservable(result).toBe(expected, EXPECTED_VALUES);
            flush();

            expect(searchFn).toHaveBeenCalledTimes(2);
            expect(searchFn.calls.all()[0].args).toEqual(['']);
            expect(searchFn.calls.all()[1].args).toEqual(['1']);
        });
    });
});