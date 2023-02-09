import React from "react";
import styled from "styled-components";

export function registerGlobalVar() {
  if (typeof window !== "undefined") {
    window.React = React;
    window.styled = styled;
  }
}
