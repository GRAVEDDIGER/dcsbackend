export class SnapshotDocuments {
  constructor (
    protected readonly render: boolean,
    protected readonly description: string,
    protected readonly title: string
  ) {}

  async data (): Promise<any> {
    return { render: this?.render, description: this?.description, title: this?.title }
  }
}
export class QuerySnapshot {
  constructor (
    public documents: SnapshotDocuments[] = []
  ) {}
}
export class uploadResult {
  constructor (
    public ref: StorageReference
  ) {}
}
export class StorageReference {
  constructor (protected ref: string) {}
  async getDownloadUrl (): Promise<string> { return this.ref }
}
