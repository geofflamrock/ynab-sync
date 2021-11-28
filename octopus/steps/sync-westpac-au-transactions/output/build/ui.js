var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var dist$5 = {};

var dist$4 = {};

var InitialInputs = {};

Object.defineProperty(InitialInputs, "__esModule", { value: true });

var DeploymentTargetUI = {};

Object.defineProperty(DeploymentTargetUI, "__esModule", { value: true });

var PackageSelector = {};

Object.defineProperty(PackageSelector, "__esModule", { value: true });
PackageSelector.packageSelector = void 0;
function packageSelector(props) {
    return Object.assign({ type: "package" }, props);
}
PackageSelector.packageSelector = packageSelector;

var ContainerImageSelector = {};

Object.defineProperty(ContainerImageSelector, "__esModule", { value: true });
ContainerImageSelector.containerImageSelector = void 0;
function containerImageSelector(props) {
    return Object.assign({ type: "container-image" }, props);
}
ContainerImageSelector.containerImageSelector = containerImageSelector;

var Section = {};

Object.defineProperty(Section, "__esModule", { value: true });
Section.section = void 0;
function section(props) {
    return Object.assign({ type: "section" }, props);
}
Section.section = section;

var SectionGroup = {};

Object.defineProperty(SectionGroup, "__esModule", { value: true });
SectionGroup.sectionGroup = void 0;
function sectionGroup(props) {
    return Object.assign({ type: "section group" }, props);
}
SectionGroup.sectionGroup = sectionGroup;

var SensitiveText = {};

Object.defineProperty(SensitiveText, "__esModule", { value: true });
SensitiveText.sensitiveText = void 0;
function sensitiveText(props) {
    return Object.assign({ type: "sensitive" }, props);
}
SensitiveText.sensitiveText = sensitiveText;

var StepUI = {};

Object.defineProperty(StepUI, "__esModule", { value: true });

var InputComponents = {};

Object.defineProperty(InputComponents, "__esModule", { value: true });
InputComponents.note = void 0;
function note(strings, ...expressions) {
    return strings
        .map((s, i) => {
        const expression = expressions[i];
        if (expression)
            return [s, expression];
        return [s];
    })
        .reduce((acc, current) => {
        return [...acc, ...current];
    }, []);
}
InputComponents.note = note;

var RadioButtons = {};

Object.defineProperty(RadioButtons, "__esModule", { value: true });
RadioButtons.radioButtons = void 0;
function radioButtons(props) {
    return Object.assign({ type: "radio-buttons" }, props);
}
RadioButtons.radioButtons = radioButtons;

var Text = {};

Object.defineProperty(Text, "__esModule", { value: true });
Text.text = void 0;
function text(props) {
    return Object.assign({ type: "text" }, props);
}
Text.text = text;

var List = {};

Object.defineProperty(List, "__esModule", { value: true });
List.list = void 0;
function list(props) {
    return Object.assign({ type: "list" }, props);
}
List.list = list;

var Checkbox = {};

Object.defineProperty(Checkbox, "__esModule", { value: true });
Checkbox.checkbox = void 0;
function checkbox(props) {
    return Object.assign({ type: "checkbox" }, props);
}
Checkbox.checkbox = checkbox;

var FormContent = {};

Object.defineProperty(FormContent, "__esModule", { value: true });

var Account = {};

Object.defineProperty(Account, "__esModule", { value: true });
Account.account = void 0;
function account(props) {
    return Object.assign({ type: "account" }, props);
}
Account.account = account;

var Select = {};

Object.defineProperty(Select, "__esModule", { value: true });
Select.select = void 0;
function select(props) {
    return Object.assign({ type: "select" }, props);
}
Select.select = select;

var _Number = {};

Object.defineProperty(_Number, "__esModule", { value: true });
_Number.number = void 0;
function number(props) {
    return Object.assign({ type: "number" }, props);
}
_Number.number = number;

var InlineList = {};

Object.defineProperty(InlineList, "__esModule", { value: true });
InlineList.inlineList = void 0;
function inlineList(props) {
    return Object.assign({ type: "inline-list" }, props);
}
InlineList.inlineList = inlineList;

var InlineSelect = {};

Object.defineProperty(InlineSelect, "__esModule", { value: true });
InlineSelect.inlineSelect = void 0;
function inlineSelect(props) {
    return Object.assign({ type: "inline-select" }, props);
}
InlineSelect.inlineSelect = inlineSelect;

var InlineText = {};

Object.defineProperty(InlineText, "__esModule", { value: true });
InlineText.inlineText = void 0;
function inlineText(props) {
    return Object.assign({ type: "inline-text" }, props);
}
InlineText.inlineText = inlineText;

var InlineCheckbox = {};

Object.defineProperty(InlineCheckbox, "__esModule", { value: true });
InlineCheckbox.inlineCheckbox = void 0;
function inlineCheckbox(props) {
    return Object.assign({ type: "inline-checkbox" }, props);
}
InlineCheckbox.inlineCheckbox = inlineCheckbox;

var TextFormat = {};

Object.defineProperty(TextFormat, "__esModule", { value: true });
TextFormat.code = TextFormat.italic = TextFormat.bold = void 0;
function bold(text) {
    return {
        type: "bold",
        text,
    };
}
TextFormat.bold = bold;
function italic(text) {
    return {
        type: "italic",
        text,
    };
}
TextFormat.italic = italic;
function code(text) {
    return {
        type: "code",
        text,
    };
}
TextFormat.code = code;

var Link = {};

Object.defineProperty(Link, "__esModule", { value: true });
Link.link = void 0;
function link(props) {
    return Object.assign({ type: "link" }, props);
}
Link.link = link;

(function (exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(InitialInputs, exports);
__exportStar(DeploymentTargetUI, exports);
__exportStar(PackageSelector, exports);
__exportStar(ContainerImageSelector, exports);
__exportStar(Section, exports);
__exportStar(SectionGroup, exports);
__exportStar(SensitiveText, exports);
__exportStar(StepUI, exports);
__exportStar(InputComponents, exports);
__exportStar(RadioButtons, exports);
__exportStar(Text, exports);
__exportStar(List, exports);
__exportStar(Checkbox, exports);
__exportStar(FormContent, exports);
__exportStar(Account, exports);
__exportStar(Select, exports);
__exportStar(_Number, exports);
__exportStar(InlineList, exports);
__exportStar(InlineSelect, exports);
__exportStar(InlineText, exports);
__exportStar(InlineCheckbox, exports);
__exportStar(TextFormat, exports);
__exportStar(Link, exports);

}(dist$4));

var dist$3 = {};

var handler = {};

Object.defineProperty(handler, "__esModule", { value: true });

var octopusContext = {};

Object.defineProperty(octopusContext, "__esModule", { value: true });

(function (exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(handler, exports);
__exportStar(octopusContext, exports);

}(dist$3));

var dist$2 = {};

var PackageReference = {};

Object.defineProperty(PackageReference, "__esModule", { value: true });

var Discriminator = {};

Object.defineProperty(Discriminator, "__esModule", { value: true });

var SensitiveValues = {};

Object.defineProperty(SensitiveValues, "__esModule", { value: true });

var InputPaths = {};

Object.defineProperty(InputPaths, "__esModule", { value: true });

var SupportedValueTypes = {};

Object.defineProperty(SupportedValueTypes, "__esModule", { value: true });

var EmptyInitialValue = {};

Object.defineProperty(EmptyInitialValue, "__esModule", { value: true });

var accounts = {};

var AmazonWebServicesAccount = {};

Object.defineProperty(AmazonWebServicesAccount, "__esModule", { value: true });

var AzureServicePrincipal = {};

Object.defineProperty(AzureServicePrincipal, "__esModule", { value: true });

var GoogleCloudAccount = {};

Object.defineProperty(GoogleCloudAccount, "__esModule", { value: true });

var SshKeyPair = {};

Object.defineProperty(SshKeyPair, "__esModule", { value: true });

var Token = {};

Object.defineProperty(Token, "__esModule", { value: true });

var UsernamePassword = {};

Object.defineProperty(UsernamePassword, "__esModule", { value: true });

(function (exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(AmazonWebServicesAccount, exports);
__exportStar(AzureServicePrincipal, exports);
__exportStar(GoogleCloudAccount, exports);
__exportStar(SshKeyPair, exports);
__exportStar(Token, exports);
__exportStar(UsernamePassword, exports);

}(accounts));

var ContainerImageReference = {};

Object.defineProperty(ContainerImageReference, "__esModule", { value: true });

var ServerOwnedTypes = {};

Object.defineProperty(ServerOwnedTypes, "__esModule", { value: true });

var BoundValue = {};

Object.defineProperty(BoundValue, "__esModule", { value: true });
BoundValue.isBoundValue = BoundValue.isNotBoundValue = void 0;
function isNotBoundValue(value) {
    return !isBoundValue(value);
}
BoundValue.isNotBoundValue = isNotBoundValue;
function isBoundValue(value) {
    const boundValue = value;
    return (boundValue === null || boundValue === void 0 ? void 0 : boundValue.type) === "bound";
}
BoundValue.isBoundValue = isBoundValue;

var PartialByType = {};

Object.defineProperty(PartialByType, "__esModule", { value: true });

var StepConfigurationExportInputs = {};

Object.defineProperty(StepConfigurationExportInputs, "__esModule", { value: true });

(function (exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(PackageReference, exports);
__exportStar(Discriminator, exports);
__exportStar(SensitiveValues, exports);
__exportStar(InputPaths, exports);
__exportStar(PackageReference, exports);
__exportStar(SupportedValueTypes, exports);
__exportStar(EmptyInitialValue, exports);
__exportStar(accounts, exports);
__exportStar(ContainerImageReference, exports);
__exportStar(ServerOwnedTypes, exports);
__exportStar(BoundValue, exports);
__exportStar(PartialByType, exports);
__exportStar(StepConfigurationExportInputs, exports);

}(dist$2));

var dist$1 = {};

var MigrationInputs = {};

Object.defineProperty(MigrationInputs, "__esModule", { value: true });

var MigrationOutputs = {};

Object.defineProperty(MigrationOutputs, "__esModule", { value: true });

var Migrate = {};

Object.defineProperty(Migrate, "__esModule", { value: true });

var Migration = {};

Object.defineProperty(Migration, "__esModule", { value: true });

var Migrations = {};

Object.defineProperty(Migrations, "__esModule", { value: true });

(function (exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(MigrationInputs, exports);
__exportStar(MigrationOutputs, exports);
__exportStar(Migrate, exports);
__exportStar(Migration, exports);
__exportStar(Migrations, exports);

}(dist$1));

var dist = {};

Object.defineProperty(dist, "__esModule", { value: true });

(function (exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(dist$4, exports);
__exportStar(dist$3, exports);
__exportStar(dist$2, exports);
__exportStar(dist$1, exports);
__exportStar(dist, exports);

}(dist$5));

const SyncWestpacAuTransactionsStepUI = {
    createInitialInputs: () => {
        return {
            westpacCredentials: {
                username: "",
            },
            westpacAccount: {
                accountName: "",
            },
            ynabCredentials: {},
            ynabAccount: {
                budgetId: "",
                accountId: "",
            },
            options: {
                debug: false,
                numberOfDaysToSync: 7,
            },
        };
    },
    editInputsForm: (inputs) => {
        return [
            dist$5.section({
                title: "Westpac Credentials",
                content: [
                    dist$5.text({
                        input: inputs.westpacCredentials.username,
                        label: "Username",
                        helpText: "Username for Westpac Online Banking",
                    }),
                    dist$5.sensitiveText({
                        input: inputs.westpacCredentials.password,
                        label: "Password",
                        helpText: "Password for Westpac Online Banking",
                    }),
                ],
            }),
            dist$5.section({
                title: "Westpac Account",
                content: [
                    dist$5.text({
                        input: inputs.westpacAccount.accountName,
                        label: "Account Name",
                        helpText: "Name of the account to sync transactions from",
                    }),
                ],
            }),
            dist$5.section({
                title: "YNAB Credentials",
                content: [
                    dist$5.sensitiveText({
                        input: inputs.ynabCredentials.apiKey,
                        label: "API Key",
                        helpText: "YNAB API Key to allow access to sync transactions",
                        note: dist$5.note `You can find this in your YNAB account settings`,
                    }),
                ],
            }),
            dist$5.section({
                title: "YNAB Account",
                content: [
                    dist$5.text({
                        input: inputs.ynabAccount.budgetId,
                        label: "Budget Id",
                        helpText: "Id of the budget to sync transactions to",
                    }),
                    dist$5.text({
                        input: inputs.ynabAccount.accountId,
                        label: "Account Id",
                        helpText: "Id of the account to sync transactions to",
                    }),
                ],
            }),
            dist$5.section({
                title: "Sync Details",
                content: [
                    dist$5.number({
                        input: inputs.options.numberOfDaysToSync,
                        label: "Number of Days to Sync",
                        helpText: "Number of days to sync transactions for",
                    }),
                    dist$5.number({
                        input: inputs.options.loginTimeoutInMs.convertTo({
                            toNewType: (value) => (value === undefined ? 0 : value),
                            toOriginalType: (value) => (value === 0 ? undefined : value),
                        }),
                        label: "Login timeout",
                        helpText: "The timeout when attempting to login to Westpac Online Banking",
                    }),
                ],
            }),
            dist$5.section({
                title: "Advanced",
                content: [
                    dist$5.checkbox({
                        input: inputs.options.debug,
                        label: "Debug",
                        helpText: "Enable debug logging",
                    }),
                    dist$5.text({
                        input: inputs.options.toolsDirectory.convertTo({
                            toNewType: (value) => (value === undefined ? "" : value),
                            toOriginalType: (value) => (value === "" ? undefined : value),
                        }),
                        label: "Tools Directory",
                        helpText: "Path to the tools directory containing Chrome",
                    }),
                    dist$5.text({
                        input: inputs.options.downloadDirectory.convertTo({
                            toNewType: (value) => (value === undefined ? "" : value),
                            toOriginalType: (value) => (value === "" ? undefined : value),
                        }),
                        label: "Download Directory",
                        helpText: "Path to the directory to download files to",
                    }),
                ],
            }),
        ];
    },
};

export { SyncWestpacAuTransactionsStepUI, SyncWestpacAuTransactionsStepUI as default };
//# sourceMappingURL=ui.js.map
