export enum Action {
    INSERT = 'insert',
    DELETE = 'delete',
    REPLACE = 'replace',
    EQUAL = 'equal',
    NONE = 'none',
}

export class Operation {
    action: Action;
    start_in_before: number;
    end_in_before?: number;
    start_in_after: number;
    end_in_after?: number;
    replaceBefore?: string[];
    replaceAfter?: string[];
    children?: Operation[];

    constructor(
        action: Action,
        start_in_before: number,
        start_in_after: number,
        end_in_before?: number,
        end_in_after?: number,
    ) {
        this.action = action;
        this.start_in_before = start_in_before;
        this.end_in_before = end_in_before;
        this.start_in_after = start_in_after;
        this.end_in_after = end_in_after;
    }
}

export class Match {
    start_in_before: number;
    start_in_after: number;
    length: number;
    end_in_before: number;
    end_in_after: number;

    constructor(start_in_before, start_in_after, length) {
        this.start_in_before = start_in_before;
        this.start_in_after = start_in_after;
        this.length = length;
        this.end_in_before = this.start_in_before + this.length - 1;
        this.end_in_after = this.start_in_after + this.length - 1;
    }
}


export class Matcher {
    findMatchingBlocks(before_tokens: string[], after_tokens: string[]): Match[] {
        const matchingBlocks = [];
        const index_of_before_locations_in_after_tokens = this.create_index(before_tokens, after_tokens);
        this.fillMatchingBlocks(
            before_tokens,
            after_tokens,
            index_of_before_locations_in_after_tokens,
            0,
            before_tokens.length,
            0,
            after_tokens.length,
            matchingBlocks,
        );
        return matchingBlocks;
    };

    private create_index(find_these: string[], in_these: string[]) {
        if (find_these == null) {
            throw new Error('params must have find_these key');
        }
        if (in_these == null) {
            throw new Error('params must have in_these key');
        }

        let idx;
        const index = {};
        for (const token of find_these) {
            index[token] = [];
            idx = in_these.indexOf(token);
            while (idx !== -1) {
                index[token].push(idx);
                idx = in_these.indexOf(token, idx + 1);
            }
        }
        return index;
    };

    private fillMatchingBlocks(
        before_tokens,
        after_tokens,
        index_of_before_locations_in_after_tokens,
        start_in_before,
        end_in_before,
        start_in_after,
        end_in_after,
        matching_blocks,
    ) {
        const match = this.findMatch(
            before_tokens,
            after_tokens,
            index_of_before_locations_in_after_tokens,
            start_in_before,
            end_in_before,
            start_in_after,
            end_in_after,
        );

        if (!match) {
            return;
        }


        if (start_in_before < match.start_in_before && start_in_after < match.start_in_after) {
            this.fillMatchingBlocks(
                before_tokens,
                after_tokens,
                index_of_before_locations_in_after_tokens,
                start_in_before,
                match.start_in_before,
                start_in_after,
                match.start_in_after,
                matching_blocks,
            );
        }
        matching_blocks.push(match);
        if (match.end_in_before <= end_in_before && match.end_in_after <= end_in_after) {
            this.fillMatchingBlocks(
                before_tokens,
                after_tokens,
                index_of_before_locations_in_after_tokens,
                match.end_in_before + 1,
                end_in_before,
                match.end_in_after + 1,
                end_in_after,
                matching_blocks,
            );
        }
    };

    private findMatch(before_tokens, after_tokens, index_of_before_locations_in_after_tokens, start_in_before, end_in_before, start_in_after, end_in_after) {
        let best_match_in_after,
            best_match_in_before,
            best_match_length,
            i,
            index_in_before,
            locations_in_after,
            looking_for,
            match,
            match_length_at,
            new_match_length,
            new_match_length_at,
            ref,
            ref1;
        best_match_in_before = start_in_before;
        best_match_in_after = start_in_after;
        best_match_length = 0;
        match_length_at = {};
        for (index_in_before = i = ref = start_in_before, ref1 = end_in_before; ref <= ref1 ? i < ref1 : i > ref1; index_in_before = ref <= ref1 ? ++i : --i) {
            new_match_length_at = {};
            looking_for = before_tokens[index_in_before];
            locations_in_after = index_of_before_locations_in_after_tokens[looking_for];
            for (const index_in_after of locations_in_after) {
                if (index_in_after < start_in_after) {
                    continue;
                }
                if (index_in_after >= end_in_after) {
                    break;
                }
                if (match_length_at[index_in_after - 1] == null) {
                    match_length_at[index_in_after - 1] = 0;
                }
                new_match_length = match_length_at[index_in_after - 1] + 1;
                new_match_length_at[index_in_after] = new_match_length;
                if (new_match_length > best_match_length) {
                    best_match_in_before = index_in_before - new_match_length + 1;
                    best_match_in_after = index_in_after - new_match_length + 1;
                    best_match_length = new_match_length;
                }
            }
            match_length_at = new_match_length_at;
        }
        if (best_match_length !== 0) {
            match = new Match(best_match_in_before, best_match_in_after, best_match_length);
        }
        return match;
    };
}
