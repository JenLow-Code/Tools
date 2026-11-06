#include "PluginEditor.h"
#include <cmath>

namespace
{
const juce::Colour background (0xff091624);
const juce::Colour panel (0xff12273b);
const juce::Colour blue (0xff49b7f6);
const juce::Colour muted (0xff9eafc0);
const juce::Colour white (0xffedf5ff);
const juce::Colour warning (0xffffaa6b);
}

JenLowSoundcheckAudioProcessorEditor::JenLowSoundcheckAudioProcessorEditor
    (JenLowSoundcheckAudioProcessor& p) : AudioProcessorEditor (&p), processor (p)
{
    setSize (620, 460);
    for (auto* button : { &measureNoise, &resetPeaks, &resetClips })
    {
        addAndMakeVisible (*button);
        button->setColour (juce::TextButton::buttonColourId, panel);
        button->setColour (juce::TextButton::textColourOffId, white);
    }
    measureNoise.onClick = [this] { processor.requestNoiseMeasurement(); };
    resetPeaks.onClick = [this] { processor.resetPeakHold(); };
    resetClips.onClick = [this] { processor.resetClipCount(); };
    startTimerHz (20);
}

juce::String JenLowSoundcheckAudioProcessorEditor::formatDb (float value)
{
    if (value <= -99.9f)
        return "-inf";
    return juce::String (value, 1) + " dBFS";
}

void JenLowSoundcheckAudioProcessorEditor::paintMetric
    (juce::Graphics& g, juce::Rectangle<int> area, const juce::String& label,
     float value, bool showBar, const juce::String& subtitle) const
{
    g.setColour (panel);
    g.fillRoundedRectangle (area.toFloat(), 12.0f);
    auto content = area.reduced (18);
    g.setColour (muted);
    g.setFont (juce::Font (juce::FontOptions (12.0f, juce::Font::bold)));
    g.drawText (label, content.removeFromTop (22), juce::Justification::centredLeft);
    g.setColour (value >= -0.1f ? warning : white);
    g.setFont (juce::Font (juce::FontOptions (29.0f, juce::Font::bold)));
    g.drawText (formatDb (value), content.removeFromTop (48), juce::Justification::centredLeft);
    if (showBar)
    {
        auto bar = content.removeFromTop (11).toFloat();
        g.setColour (background.brighter (0.4f));
        g.fillRoundedRectangle (bar, 4.0f);
        const float normalized = juce::jlimit (0.0f, 1.0f, (value + 80.0f) / 80.0f);
        if (normalized > 0.0f)
        {
            g.setColour (value >= -0.1f ? warning : blue);
            g.fillRoundedRectangle (bar.withWidth (bar.getWidth() * normalized), 4.0f);
        }
    }
    g.setColour (muted);
    g.setFont (12.0f);
    g.drawText (subtitle, content.removeFromBottom (20), juce::Justification::centredLeft);
}

void JenLowSoundcheckAudioProcessorEditor::paint (juce::Graphics& g)
{
    g.fillAll (background);
    g.setColour (blue);
    g.setFont (juce::Font (juce::FontOptions (12.0f, juce::Font::bold)));
    g.drawText ("JENLOW / PRODUCTION TOOLS", 24, 18, 350, 20, juce::Justification::left);
    g.setColour (white);
    g.setFont (juce::Font (juce::FontOptions (30.0f, juce::Font::bold)));
    g.drawText ("Soundcheck", 24, 43, 440, 44, juce::Justification::left);
    g.setColour (muted);
    g.setFont (13.0f);
    g.drawText ("INPUT ANALYSIS  /  TRANSPARENT AUDIO PASS-THROUGH", 25, 91, 550, 20,
                juce::Justification::left);

    const int left = 24, top = 128, gap = 12, width = 280, height = 105;
    paintMetric (g, {left, top, width, height}, "LIVE RMS",
                 processor.getRmsDb(), true, "Smoothed level (300 ms)");
    paintMetric (g, {left + width + gap, top, width, height}, "LIVE PEAK",
                 processor.getPeakDb(), true, "Sample peak");
    paintMetric (g, {left, top + height + gap, width, height}, "HELD PEAK",
                 processor.getHeldPeakDb(), true, "Highest sample peak since reset");
    const int state = processor.getNoiseCaptureState();
    const juce::String noiseText = state == 1 ? "Measuring... stay silent"
                                 : state == 2 ? "Measured silence RMS"
                                 : "Not measured yet";
    paintMetric (g, {left + width + gap, top + height + gap, width, height},
                 "NOISE FLOOR", processor.getNoiseFloorDb(), false, noiseText);

    g.setColour (muted);
    g.setFont (13.0f);
    g.drawText ("SAMPLES AT OR ABOVE 0 dBFS: " +
                juce::String (processor.getClippedSamples()),
                25, 410, 340, 24, juce::Justification::left);
    if (processor.getClippedSamples() > 0)
    {
        g.setColour (warning);
        g.drawText ("CHECK INPUT GAIN", 390, 410, 205, 24, juce::Justification::right);
    }
}

void JenLowSoundcheckAudioProcessorEditor::resized()
{
    measureNoise.setBounds (24, 365, 207, 31);
    resetPeaks.setBounds (242, 365, 122, 31);
    resetClips.setBounds (375, 365, 122, 31);
}

void JenLowSoundcheckAudioProcessorEditor::timerCallback()
{
    measureNoise.setEnabled (processor.getNoiseCaptureState() != 1);
    measureNoise.setButtonText (processor.getNoiseCaptureState() == 1
                               ? "MEASURING SILENCE..." : "MEASURE NOISE (3s)");
    repaint();
}
