export interface ITransactionExporter<TInput, TOutput> {
  export(input: TInput): Promise<TOutput>;
}

export type FileTransactionExportOutput = {
  filePath: string;
};

export interface IInputProvider {
  getInput(key: string, description: string): string | undefined;
}

export class EnvironmentInputProvider implements IInputProvider {
  getInput(key: string, _description: string): string | undefined {
    return process.env[key];
  }
}

export class ChainedInputProvider implements IInputProvider {
  private inputProviders: IInputProvider[];

  constructor(...inputProviders: IInputProvider[]) {
    this.inputProviders = inputProviders;
  }

  getInput(key: string, description: string): string | undefined {
    let result: string | undefined = undefined;

    for (let i = 0; i < this.inputProviders.length; i++) {
      const inputProvider = this.inputProviders[i];
      const providerResult = inputProvider?.getInput(key, description);
      if (providerResult) {
        result = providerResult;
        break;
      }
    }

    return result;
  }
}
