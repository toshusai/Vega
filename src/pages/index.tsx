import React from "react";
import { Provider } from "react-redux";

import { AssetDetailsPanel } from "@/components/asset_details_panel/AssetDetailsPanel";
import { AssetPanel } from "@/components/assets_panel/AssetPanel";
import { KeyFramePanel } from "@/components/keyframes_panel/KeyFramePanel";
import { MenuButton } from "@/components/MenuButton";
import { Preview } from "@/components/preview_panel/Preview";
import { RecordMenuButton } from "@/components/RecordMenuButton";
import { SettingsMenuButton } from "@/components/SettingsMenuButton";
import { StripPanel } from "@/components/strip_panel/StripPanel";
import { Timeline } from "@/components/timeline_panel/Timeline";
import { GlobalStyle,HPanel , VPanel  } from "@/shared/src";
import store from "@/store";
import { initGlobalEvent } from "@/utils/initGlobalEvent";

const IndexPage = () => {
  initGlobalEvent();
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <div
          style={{
            display: "flex",
            height: "16px",
            padding: "4px 4px 0px 4px",
          }}
        >
          <MenuButton />
          <RecordMenuButton />
          <SettingsMenuButton />
        </div>

        <div
          style={{
            padding: "4px",
            // 20px header + 8px padding
            height: "calc(100% - 28px)",
            width: "calc(100% - 8px)",
            overflow: "hidden",
          }}
        >
          <VPanel
            top={
              <HPanel
                left={
                  <VPanel top={<StripPanel />} bottom={<KeyFramePanel />} />
                }
                right={<Preview />}
                defaultRate={0.3}
              />
            }
            bottom={
              <HPanel
                left={<Timeline />}
                right={
                  <HPanel left={<AssetDetailsPanel />} right={<AssetPanel />} />
                }
                defaultRate={0.7}
              />
            }
          />
        </div>
      </Provider>
    </>
  );
};

export default IndexPage;
