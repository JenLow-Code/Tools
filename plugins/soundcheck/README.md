# JenLow Soundcheck — v0.1.0

An independent JUCE VST3 + Standalone audio-input analyzer for **JenLow Tools**, hosted in GitHub so development can continue from different computers.

## Current MVP
- Stereo/mono non-destructive audio pass-through.
- Live smoothed RMS in dBFS.
- Live sample peak and resettable held peak in dBFS.
- Count of sample values at or above 0 dBFS (not a true-peak / intersample meter).
- Three-second silence RMS calibration, initiated manually with no speech or instruments playing.
- No network, artificial intelligence, user tracking, or changes to the existing JenLow Tools frontend.

## Cloud build
Go to GitHub > Actions > **JenLow Soundcheck VST3** > **Run workflow**.
When the Windows build succeeds, download the **jenlow-soundcheck-windows** artifact.
The VST3 can be installed and used in FL Studio on Windows; the standalone executable requires a configured audio input.

## Local development (optional)
Requires CMake 3.22+, compiler (MSVC on Windows), and network access to fetch JUCE:

```sh
cmake -S plugins/soundcheck -B build/soundcheck
cmake --build build/soundcheck --config Release
```

JUCE is retrieved by CMake; check its licensing before distributing commercial software.

## Testing checklist
1. Open VST3 on a mono/stereo audio track in FL Studio.
2. Confirm audio passes through unchanged.
3. Test silent input, then moderate level and then a deliberately clipped test signal at safe monitoring levels.
4. Stop input and click **Measure Noise (3s)**; remain silent during capture.
5. Check sample peak, held peak, clip counter, reset buttons.
6. Repeat with sample rates 44.1, 48 and 96 kHz and multiple buffer sizes.

## Accuracy / limitations
- Measures incoming *digital* signal at the plugin insert; cannot identify analog clipping that happened before the ADC.
- Silence RMS is an estimate, not a calibrated electrical-noise or acoustical-noise measurement.
- No true peak, LUFS, spectrum analyzer, recording automation or FL Studio remote control in this MVP.
- No audio files, sessions or microphone captures are uploaded.
- GitHub Actions builds have not been validated until a successful run is visible.

## Next milestones
1. Validate CI and review measured values with deterministic test signals.
2. Add true peak, configurable thresholds and input/noise diagnostic report.
3. Coordinate with JenLow Deck for transport and recording workflows.
4. Integrate as a distinct module inside the JenLow Tools website without modifying studio inventory logic.
