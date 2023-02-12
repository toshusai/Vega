import { type IpcRenderer, IpcRendererEvent } from "electron";
import styled, { type CSSProp } from "styled-components";
import type {} from "styled-components/cssprop";

import * as Core from "@/core";
import * as RiAppUi from "@/riapp-ui";

interface IpcRenderer extends NodeJS.EventEmitter {
  invoke(channel: string, ...args: any[]): Promise<any>;
  on(
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ): this;
  once(
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ): this;
  postMessage(channel: string, message: any, transfer?: MessagePort[]): void;
  removeAllListeners(channel: string): this;
  removeListener(channel: string, listener: (...args: any[]) => void): this;
  send(channel: string, ...args: any[]): void;
  sendSync(channel: string, ...args: any[]): any;
  sendTo(webContentsId: number, channel: string, ...args: any[]): void;
  sendToHost(channel: string, ...args: any[]): void;
}

declare module "react" {
  interface Attributes {
    css?: CSSProp;
  }
}

declare global {
  const ipcRenderer: IpcRenderer;
  interface Window {
    styled: styled;
    Core: typeof Core;
    RiAppUi: typeof RiAppUi;
  }
}
