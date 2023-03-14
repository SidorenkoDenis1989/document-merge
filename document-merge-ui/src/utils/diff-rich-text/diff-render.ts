import { Action, Operation } from './matcher';
import { Tokenizer } from './tokenizer';

export class DiffRender {

    public static handle(before_tokens: string[], after_tokens: string[], operations: Operation[]) {
        let rendering = '';
        for (let operation of operations) {
            rendering += this.getRender(operation, before_tokens, after_tokens);
        }
        return rendering;
    };

    private static getRender(operation: Operation, before_tokens: string[], after_tokens: string[]): string {
        if (operation.action === Action.REPLACE && operation.children) {
            return this.handle(operation.replaceBefore, operation.replaceAfter, operation.children);
        }
        switch (operation.action) {
            case Action.EQUAL:
                return this.equal(operation, before_tokens);
            case Action.INSERT:
                return this.insert(operation, after_tokens);
            case Action.DELETE:
                return this.delete(operation, before_tokens);
            case Action.REPLACE:
                return this.insert(operation, after_tokens);
        }
    }

    private static equal(operation: Operation, before_tokens: string[]): string {
        return before_tokens.slice(operation.start_in_before, +operation.end_in_before + 1 || 9e9).join('');
    };

    private static insert(operation: Operation, after_tokens: string[]): string {
        const val = after_tokens.slice(operation.start_in_after, +operation.end_in_after + 1 || 9e9);
        return this.wrap('ins', val);
    };

    private static delete(operation: Operation, before_tokens: string[]): string {
        const val = before_tokens.slice(operation.start_in_before, +operation.end_in_before + 1 || 9e9);
        return this.wrap('del', val);
    }

    private static wrap(tag: string, content: string[]) {
        if (content.length === 1 && Tokenizer.isTag(content[0])) {
            return this.wrapSingleTag(tag, content[0]);
        }
        let non_tags, position, rendering, tags;
        rendering = '';
        position = 0;
        const length = content.length;
        /* eslint-disable */
        while (true) {
            if (position >= length) {
                break;
            }
            non_tags = this.consecutiveWhere(position, content, Tokenizer.isntTag);
            position += non_tags.length;
            if (non_tags.length !== 0) {
                rendering += `<${tag}>${non_tags.join('')}</${tag}>`;
            }
            if (position >= length) {
                break;
            }
            tags = this.consecutiveWhere(position, content, Tokenizer.isTag);
            position += tags.length;
            rendering += tags.join('');
        }
        /* eslint-enable */
        return rendering;
    };

    private static consecutiveWhere(start, content, predicate) {
        let answer, i, index, last_matching_index, len, token;
        content = content.slice(start, +content.length + 1 || 9e9);
        last_matching_index = void 0;
        for (index = i = 0, len = content.length; i < len; index = ++i) {
            token = content[index];
            answer = predicate(token);
            if (answer === true) {
                last_matching_index = index;
            }
            if (answer === false) {
                break;
            }
        }
        if (last_matching_index != null) {
            return content.slice(0, +last_matching_index + 1 || 9e9);
        }
        return [];
    };

    private static wrapSingleTag(tag: string, content: string): string {
        if (Tokenizer.isClosedTag(content)) {
            return `${content}</${tag}>`;
        }
        return `<${tag}>${content}`;
    }

}
