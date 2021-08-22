export type IAsset = {
  readonly id: string;
  readonly name: string;
  readonly type: string;
};

export class Asset implements IAsset {
  readonly id: string;
  readonly name: string;
  readonly path: string;
  type: string = "";

  constructor(id: string, name: string, path: string) {
    this.id = id;
    this.name = name;
    this.path = path;
  }

  toInterface(): IAsset {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
    };
  }
}
