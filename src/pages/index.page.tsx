import React from "react";
import { Provider } from "react-redux";
import styled, { css } from "styled-components";

import { AssetDetailsPanel } from "@/components/asset_details_panel/AssetDetailsPanel";
import { AssetPanel } from "@/components/assets_panel/AssetPanel";
import { KeyFramePanel } from "@/components/keyframes_panel/KeyFramePanel";
import { MenuButton } from "@/components/MenuButton";
import { Preview } from "@/components/preview_panel/Preview";
import { RecordMenuButton } from "@/components/RecordMenuButton";
import { SettingsMenuButton } from "@/components/SettingsMenuButton";
import { StripPanel } from "@/components/strip_panel/StripPanel";
import { Timeline } from "@/components/timeline_panel/Timeline";
import { GlobalStyle, HPanel, VPanel } from "@/riapp-ui/src";
import store from "@/store";
import { initGlobalEvent } from "@/utils/initGlobalEvent";

const IndexPage = () => {
  initGlobalEvent();
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <RootDiv>
          <div
            style={{
              display: "flex",
              height: "16px",
            }}
          >
            <MenuButton />
            <RecordMenuButton />
            <SettingsMenuButton />
          </div>

          <div
            style={{
              paddingTop: "0px",
              // 20px header + 8px padding
              height: "100%",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <VPanel
              top={
                <HPanel
                  left={<StripPanel />}
                  right={<Preview />}
                  defaultRate={0.3}
                />
              }
              bottom={
                <HPanel
                  left={
                    <VPanel
                      top={<Timeline />}
                      bottom={<KeyFramePanel />}
                      defaultRate={0.7}
                    />
                  }
                  right={
                    <HPanel
                      left={<AssetDetailsPanel />}
                      right={<AssetPanel />}
                    />
                  }
                  defaultRate={0.7}
                />
              }
            />
          </div>
          <div
            css={css`
              height: 8px;
            `}
          ></div>
        </RootDiv>
      </Provider>
    </>
  );
};

const RootDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default IndexPage;
