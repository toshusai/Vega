import React from "react";
import styled from "styled-components";

import * as RiAppUi from "@/app-ui/src";
import * as Core from "@/core";

export function registerGlobalVar() {
  if (typeof window !== "undefined") {
    window.React = React;
    window.styled = styled;
    window.Core = Core;
    window.RiAppUi = RiAppUi;
  }
}
