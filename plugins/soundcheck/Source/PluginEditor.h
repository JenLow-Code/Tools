#pragma once
#include "PluginProcessor.h"

class JenLowSoundcheckAudioProcessorEditor final : public juce::AudioProcessorEditor,
                                                    private juce::Timer
{
public:
    explicit JenLowSoundcheckAudioProcessorEditor (JenLowSoundcheckAudioProcessor&);
    ~JenLowSoundcheckAudioProcessorEditor() override = default;

    void paint (juce::Graphics&) override;
    void resized() override;

private:
    void timerCallback() override;
    void paintMetric (juce::Graphics&, juce::Rectangle<int>, const juce::String&,
                      float, bool, const juce::String&) const;
    static juce::String formatDb (float value);

    JenLowSoundcheckAudioProcessor& processor;
    juce::TextButton measureNoise { "MEASURE NOISE (3s)" };
    juce::TextButton resetPeaks { "RESET PEAK" };
    juce::TextButton resetClips { "RESET CLIPS" };

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (JenLowSoundcheckAudioProcessorEditor)
};
