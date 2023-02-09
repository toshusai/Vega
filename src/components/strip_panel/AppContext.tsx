
export interface AppContext {
  dispatch: any;
  actions: any;
  fs: {
    writeFile: (path: string, data: any) => Promise<any>;
  };
}
