import React from "react";
import styled from "styled-components";

import * as Core from "@/core";
import * as RiAppUi from "@/riapp-ui/src";

export function registerGlobalVar() {
  if (typeof window !== "undefined") {
    window.React = React;
    window.styled = styled;
    window.Core = Core;
    window.RiAppUi = RiAppUi;
  }
}
