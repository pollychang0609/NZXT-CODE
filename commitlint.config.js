// Level [0..2]: 0 disables the rule. For 1 it will be considered a warning for 2 an error.
// Applicable always|never: never inverts the rule.
// Value: value to use for this rule.
module.exports = {
    extends: ['@commitlint/config-angular'],
    "rules": {
        "header-max-length": [2, "always", 72],
        'type-enum': [2, 'always', [
            'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert'
        ]],
        "scope-empty" : [2, 'never']

    }
};
