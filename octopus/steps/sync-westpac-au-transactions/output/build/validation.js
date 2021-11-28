var validateInputs = function (inputs, validate) {
    return [
        validate(inputs.westpacCredentials.username, function (username) {
            if (username === "")
                return "Westpac username cannot be empty";
            return undefined;
        }),
        validate(inputs.westpacCredentials.password, function (password) {
            if (password.type === "empty")
                return "Westpac password cannot be empty";
            return undefined;
        }),
        validate(inputs.westpacAccount.accountName, function (accountName) {
            if (accountName === "")
                return "Westpac account name cannot be empty";
            return undefined;
        }),
        validate(inputs.ynabCredentials.apiKey, function (apiKey) {
            if (apiKey.type === "empty")
                return "YNAB API Key cannot be empty";
            return undefined;
        }),
        // todo the rest
    ];
};

module.exports = validateInputs;
//# sourceMappingURL=validation.js.map
