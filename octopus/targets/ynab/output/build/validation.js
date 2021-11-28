var validateInputs = function (inputs, validate) {
    return [
        validate(inputs.test, function (test) {
            if (test === "")
                return "Test cannot be empty";
            return undefined;
        }),
    ];
};

module.exports = validateInputs;
//# sourceMappingURL=validation.js.map
