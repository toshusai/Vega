import React from "react";
import styled from "styled-components";

import * as Core from "@/core";
import * as ReAppUi from "@/riapp-ui";

export function registerGlobalVar() {
  if (typeof window !== "undefined") {
    window.React = React;
    window.styled = styled;
    window.Core = Core;
    window.ReAppUi = ReAppUi;
  }
}
