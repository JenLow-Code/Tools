#pragma once
#include <JuceHeader.h>
#include <atomic>

class JenLowSoundcheckAudioProcessor final : public juce::AudioProcessor
{
public:
    JenLowSoundcheckAudioProcessor();
    ~JenLowSoundcheckAudioProcessor() override = default;

    void prepareToPlay (double sampleRate, int samplesPerBlock) override;
    void releaseResources() override {}
    void processBlock (juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override { return true; }
    const juce::String getName() const override { return "JenLow Soundcheck"; }
    bool acceptsMidi() const override { return false; }
    bool producesMidi() const override { return false; }
    bool isMidiEffect() const override { return false; }
    double getTailLengthSeconds() const override { return 0.0; }
    int getNumPrograms() override { return 1; }
    int getCurrentProgram() override { return 0; }
    void setCurrentProgram (int) override {}
    const juce::String getProgramName (int) override { return {}; }
    void changeProgramName (int, const juce::String&) override {}
    void getStateInformation (juce::MemoryBlock&) override {}
    void setStateInformation (const void*, int) override {}
    bool isBusesLayoutSupported (const BusesLayout& layouts) const override;

    // Read on the GUI thread; written on the audio thread.
    float getRmsDb() const noexcept { return rmsDb.load(); }
    float getPeakDb() const noexcept { return peakDb.load(); }
    float getHeldPeakDb() const noexcept { return heldPeakDb.load(); }
    float getNoiseFloorDb() const noexcept { return noiseFloorDb.load(); }
    int getClippedSamples() const noexcept { return clippedSamples.load(); }
    int getNoiseCaptureState() const noexcept { return noiseCaptureState.load(); }
    void requestNoiseMeasurement() noexcept { noiseCaptureRequested.store (true); }
    void resetClipCount() noexcept { clippedSamples.store (0); }
    void resetPeakHold() noexcept { resetHoldRequested.store (true); }

private:
    static float toDb (float linear) noexcept;

    std::atomic<float> rmsDb { -100.0f };
    std::atomic<float> peakDb { -100.0f };
    std::atomic<float> heldPeakDb { -100.0f };
    std::atomic<float> noiseFloorDb { -100.0f };
    std::atomic<int> clippedSamples { 0 };
    // 0: not measured; 1: measuring; 2: complete
    std::atomic<int> noiseCaptureState { 0 };
    std::atomic<bool> noiseCaptureRequested { false };
    std::atomic<bool> resetHoldRequested { false };

    // Audio-thread-owned state (no allocations, locks, or UI calls in processBlock).
    double currentSampleRate = 48000.0;
    double smoothedMeanSquare = 0.0;
    double noiseSumSquares = 0.0;
    juce::int64 noiseSampleCount = 0;
    juce::int64 noiseSamplesTarget = 1;
    float maxPeakLinear = 0.0f;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (JenLowSoundcheckAudioProcessor)
};
