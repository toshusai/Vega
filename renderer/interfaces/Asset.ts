export type Asset = {
  id: string;
  name: string;
  type: string;
  path: string;
};

export type FontAsset = Asset & {
  type: "font";
  path: string;
};

export type VideoAsset = Asset & {
  type: "video";
  path: string;
};