import { Provider } from "react-redux";
import styled from "styled-components";

import { AssetDetailsPanel } from "@/components/asset_details_panel/AssetDetailsPanel";
import { AssetPanel } from "@/components/assets_panel/AssetPanel";
import { KeyFramePanel } from "@/components/keyframes_panel/KeyFramePanel";
import { MenuButton } from "@/components/MenuButton";
import { Preview } from "@/components/preview_panel/Preview";
import { RecordMenuButton } from "@/components/RecordMenuButton";
import { SettingsMenuButton } from "@/components/SettingsMenuButton";
import { SplashModal } from "@/components/SplashModal";
import { StripPanel } from "@/components/strip_panel/StripPanel";
import { Timeline } from "@/components/timeline_panel/Timeline";
import { useFirstRender } from "@/hooks/useFirstRender";
import { GlobalStyle, HPanel, VPanel } from "@/riapp-ui/src";
import store from "@/store";
import { initGlobalEvent } from "@/utils/initGlobalEvent";

const IndexPage = () => {
  const firstRender = useFirstRender();
  if (firstRender) return null;

  initGlobalEvent();
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <RootDiv>
          <SplashModal />
          <HeaderDiv>
            <MenuButton />
            <RecordMenuButton />
            <SettingsMenuButton />
          </HeaderDiv>

          <BodyDiv>
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
          </BodyDiv>
          <BottomSpaceDiv />
        </RootDiv>
      </Provider>
    </>
  );
};

const RootDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const HeaderDiv = styled.div`
  display: flex;
  height: 16px;
`;

const BodyDiv = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const BottomSpaceDiv = styled.div`
  height: 8px;
`;

export default IndexPage;
