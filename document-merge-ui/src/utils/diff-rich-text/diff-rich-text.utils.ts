import { DiffCalculator } from './diff-calculator';
import { Tokenizer } from './tokenizer';
import { Action, Operation } from './matcher';
import { DiffRender } from './diff-render';
import { CharTokenizer } from './char-tokenizer';
import { ObjectMap } from '../object-map.utils';

export class DiffRichText {
    private  static readonly cache: ObjectMap<DiffValueKey, string> = new ObjectMap();

    static getDiff(oldValue: string, newValue: string): string {
        const key = new DiffValueKey(oldValue, newValue);
        const cached = this.cache.get(key);
        if (cached) {
            return cached;
        }
        const oldValueTokens = new Tokenizer(oldValue).getTokens();
        const newValueTokens = new Tokenizer(newValue).getTokens();
        const wordOperations = new DiffCalculator(oldValueTokens, newValueTokens)
            .calculate_operations();
        this.checkCharts(wordOperations, oldValueTokens, newValueTokens);
        const result = DiffRender.handle(oldValueTokens, newValueTokens, wordOperations);
        this.cache.set(key, result);
        return result;
    }

    private static checkCharts(wordOperations: Operation[], oldTokens: string[], newTokens: string[]) {
        wordOperations
            .forEach(operation => {
                if (operation.action !== Action.REPLACE) {
                    return;
                }
                const oldValueTokens = this.divideByChars(oldTokens, operation.start_in_before, operation.end_in_before);
                const newValueTokens = this.divideByChars(newTokens, operation.start_in_after, operation.end_in_after);
                operation.replaceBefore = oldValueTokens;
                operation.replaceAfter = newValueTokens;
                operation.children = new DiffCalculator(oldValueTokens, newValueTokens)
                    .calculate_operations();
            });
    }

    private static divideByChars = (words: string[], startIndex: number, endIndex: number): string[] => {
        const joined = words.slice(startIndex, endIndex + 1).join('');
        return new CharTokenizer(joined).getTokens();
    };
}



class DiffValueKey {
    oldValue: string;
    newValue: string;

    constructor(oldValue: string, newValue: string) {
        this.oldValue = oldValue;
        this.newValue = newValue;
    }

    equals(obj: DiffValueKey) {
        return this.oldValue === obj.oldValue && this.newValue === obj.newValue;
    }
}
