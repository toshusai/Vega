import { Provider } from "react-redux";
import styled from "styled-components";

import { GlobalStyle, VPanel } from "@/app-ui/src";
import { Preview } from "@/components/preview_panel/Preview";
import { useFirstRender } from "@/hooks/useFirstRender";
import store from "@/store";
import { initGlobalEvent } from "@/utils/initGlobalEvent";

import { StripDetails } from "./StripDetails";
import { Timeline } from "./Timeline";

const IndexPage = () => {
  const firstRender = useFirstRender();
  if (firstRender) return null;

  initGlobalEvent();
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <RootDiv>
          <VPanel
            top={<VPanel top={<Preview />} bottom={<Timeline />} />}
            bottom={<StripDetails />}
            defaultRate={0.7}
          />
          <BottomSpaceDiv />
        </RootDiv>
      </Provider>
    </>
  );
};

export const Flex = styled.div`
  display: flex;
  width: 100%;
`;

const RootDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100svh;
  overflow: hidden;
`;

const BottomSpaceDiv = styled.div`
  height: 8px;
`;

export default IndexPage;
