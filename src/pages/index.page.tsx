import { Provider } from "react-redux";

import {
  BottomSpaceDiv,
  GlobalStyle,
  HeaderDiv,
  HPanel,
  MainDiv,
  RootDiv,
  VPanel,
} from "@/app-ui/src";
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

          <MainDiv>
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
          </MainDiv>
          <BottomSpaceDiv />
        </RootDiv>
      </Provider>
    </>
  );
};

export default IndexPage;
