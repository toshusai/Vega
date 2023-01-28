export type VideoEffect = {
  id: string;
  type: "video";
  videoAssetId: string;
  x: number;
  y: number;

  /**
   * @deprecated use width instead
   */
  scaleX?: number;
  /**
   * @deprecated use height instead
   */
  scaleY?: number;

  width?: number;
  height?: number;
};
