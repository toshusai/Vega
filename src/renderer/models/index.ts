// @ts-ignore
import packageJson from "../../../package.json";
import { Asset, AudioAsset, FontAsset, VideoAsset, ImageAsset } from "./assets";
import {
  Strip,
  Text3DStrip,
  AudioStrip,
  VideoStrip,
  TextStrip,
  ImageStrip,
} from "./strips";
import type { IProject } from "./Project";

const VEGA_VERSION = packageJson.version;

export {
  Strip,
  Text3DStrip,
  TextStrip,
  AudioStrip,
  VideoStrip,
  Asset,
  AudioAsset,
  FontAsset,
  VideoAsset,
  IProject,
  ImageStrip,
  ImageAsset,
  VEGA_VERSION,
};
