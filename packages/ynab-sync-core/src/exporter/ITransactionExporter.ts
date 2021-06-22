export interface ITransactionExporter<TInput, TOutput> {
  export(input: TInput): Promise<TOutput>;
}

export type FileTransactionExportOutput = {
  filePath: string;
};
