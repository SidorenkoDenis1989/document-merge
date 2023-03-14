import { Action, Operation, Matcher,  Match  } from './matcher';

export class DiffCalculator {
    private readonly before_tokens: string[];
    private readonly after_tokens: string[];
    private position_in_before: number;
    private position_in_after: number;

    constructor(before_tokens: string[], after_tokens: string[]) {
        if (before_tokens == null) {
            throw new Error('before_tokens?');
        }
        if (after_tokens == null) {
            throw new Error('after_tokens?');
        }
        this.before_tokens = before_tokens;
        this.after_tokens = after_tokens;
        this.position_in_before = 0;
        this.position_in_after = 0;
    }

    public calculate_operations(): Operation[] {
        const operations: Operation[] = [];

        const matches: Match[] = new Matcher()
            .findMatchingBlocks(this.before_tokens, this.after_tokens);
        matches.push(new Match(this.before_tokens.length, this.after_tokens.length, 0));
        for (let index = 0; index < matches.length; index++) {
            const match = matches[index];
            const match_starts_at_current_position_in_before = this.position_in_before === match.start_in_before;
            const match_starts_at_current_position_in_after = this.position_in_after === match.start_in_after;
            const action_up_to_match_positions = this.mapAction(match_starts_at_current_position_in_before, match_starts_at_current_position_in_after);
            if (action_up_to_match_positions !== 'none') {
                operations.push({
                    action: action_up_to_match_positions,
                    start_in_before: this.position_in_before,
                    end_in_before: action_up_to_match_positions !== Action.INSERT ? match.start_in_before - 1 : undefined,
                    start_in_after: this.position_in_after,
                    end_in_after: action_up_to_match_positions !== Action.DELETE ? match.start_in_after - 1 : undefined,
                });
            }
            if (match.length !== 0) {
                operations.push({
                    action: Action.EQUAL,
                    start_in_before: match.start_in_before,
                    end_in_before: match.end_in_before,
                    start_in_after: match.start_in_after,
                    end_in_after: match.end_in_after,
                });
            }
            this.position_in_before = match.end_in_before + 1;
            this.position_in_after = match.end_in_after + 1;
        }


        const post_processed = [];
        let last_op: Operation = new Operation(Action.NONE, null, null);

        for (let j = 0; j < operations.length; j++) {
            const op = operations[j];
            if ((this.is_single_whitespace(op) && last_op.action === Action.REPLACE) || (op.action === Action.REPLACE && last_op.action === Action.REPLACE)) {
                last_op.end_in_before = op.end_in_before;
                last_op.end_in_after = op.end_in_after;
            } else {
                post_processed.push(op);
                last_op = op;
            }
        }
        return post_processed;
    }

    private is_single_whitespace = (op: Operation) => {
        if (op.action !== 'equal') {
            return false;
        }
        if (op.end_in_before - op.start_in_before !== 0) {
            return false;
        }

        // @ts-ignore
        return /^\s$/.test(this.before_tokens.slice(op.start_in_before, op.end_in_before + 1));
    };


    private mapAction(match_starts_at_current_position_in_before: boolean, match_starts_at_current_position_in_after: boolean): Action {
        if (!match_starts_at_current_position_in_before && !match_starts_at_current_position_in_after) {
            return Action.REPLACE;
        }
        if (match_starts_at_current_position_in_before && !match_starts_at_current_position_in_after) {
            return Action.INSERT;
        }
        if (!match_starts_at_current_position_in_before && match_starts_at_current_position_in_after) {
            return Action.DELETE;
        }
        return Action.NONE;
    }
}
