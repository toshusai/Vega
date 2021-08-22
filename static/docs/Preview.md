# Preview

## PlayMode

PlayMode selection is on the Controller panel.

PlayMode is the setting for how to play the preview.

This option has two values: `No Sync` and `Drop Frame`.

__`Play Every Frame`__ renders each frame. However, the fps can be low. The audio may sound choppy.

Internally, it waits for the video to load.
Because video seek (set HTMLMEdiaElement.currentTime) is not fast.
Check `VideoStrip.wait(time: number)`.

__`Sync to Audio`__ Sync to audio, but the preview image may be delayed due to lag. drop frames.

Internally, the preview does not wait for a video seek.

## Time

Time is current preview time.

## FPS

Fps is the current frame rate of the preview.
If it is lower than the set FPS, it will be displayed in red.

## Resolution

Resolution selection is on the Preview panel

Resolution is preview resolution.
The lower the resolution, the faster the preview will play.

