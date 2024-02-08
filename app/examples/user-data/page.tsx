import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import Link from "next/link";
import { DEBUG_HUB_OPTIONS } from "../../debug/constants";
// import { generateImage } from "./generate-image";

type State = {
  saidGm: boolean;
};

const initialState: State = { saidGm: false };

const reducer: FrameReducer<State> = (state, action) => {
  return {
    saidGm: true,
  };
};

// This is a react server component only
export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    ...DEBUG_HUB_OPTIONS,
    fetchHubContext: true,
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  // Here: do a server side side effect either sync or async (using await), such as minting an NFT if you want.
  // example: load the users credentials & check they have an NFT
  // const image = await generateImage(frameMessage);

  console.log("info: state is:", state);

  // then, when done, return next frame
  return (
    <div>
      GM user data example. <Link href="/debug">Debug</Link>
      <FrameContainer
        pathname="/examples/user-data"
        postUrl="/examples/user-data/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage src={"https://framesjs.org/og.png"} />
        {!state.saidGm ? (
          <FrameButton onClick={dispatch}>Say GM</FrameButton>
        ) : null}
      </FrameContainer>
    </div>
  );
}
