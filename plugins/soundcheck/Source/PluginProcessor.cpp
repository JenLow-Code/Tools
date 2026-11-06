#include "PluginProcessor.h"
#include "PluginEditor.h"
#include <cmath>
#include <algorithm>

JenLowSoundcheckAudioProcessor::JenLowSoundcheckAudioProcessor()
    : AudioProcessor (BusesProperties()
        .withInput ("Input", juce::AudioChannelSet::stereo(), true)
        .withOutput ("Output", juce::AudioChannelSet::stereo(), true))
{
}

bool JenLowSoundcheckAudioProcessor::isBusesLayoutSupported (const BusesLayout& layouts) const
{
    const auto input = layouts.getMainInputChannelSet();
    return (input == juce::AudioChannelSet::mono() || input == juce::AudioChannelSet::stereo())
        && input == layouts.getMainOutputChannelSet();
}

float JenLowSoundcheckAudioProcessor::toDb (float linear) noexcept
{
    return juce::Decibels::gainToDecibels (linear, -100.0f);
}

void JenLowSoundcheckAudioProcessor::prepareToPlay (double sampleRate, int)
{
    currentSampleRate = sampleRate > 0.0 ? sampleRate : 48000.0;
    smoothedMeanSquare = 0.0;
    noiseSumSquares = 0.0;
    noiseSampleCount = 0;
    maxPeakLinear = 0.0f;
    rmsDb.store (-100.0f);
    peakDb.store (-100.0f);
    heldPeakDb.store (-100.0f);
    noiseCaptureState.store (0);
    clippedSamples.store (0);
}

void JenLowSoundcheckAudioProcessor::processBlock (juce::AudioBuffer<float>& buffer,
                                                     juce::MidiBuffer&)
{
    juce::ScopedNoDenormals noDenormals;
    const int channels = buffer.getNumChannels();
    const int frames = buffer.getNumSamples();
    if (channels == 0 || frames == 0)
        return;

    if (resetHoldRequested.exchange (false))
        maxPeakLinear = 0.0f;

    if (noiseCaptureRequested.exchange (false))
    {
        noiseSumSquares = 0.0;
        noiseSampleCount = 0;
        noiseSamplesTarget = std::max<juce::int64>
            (1, static_cast<juce::int64> (currentSampleRate * 3.0) * channels);
        noiseCaptureState.store (1);
    }

    double blockSumSquares = 0.0;
    float blockPeak = 0.0f;
    int blockClips = 0;

    for (int ch = 0; ch < channels; ++ch)
    {
        const float* samples = buffer.getReadPointer (ch);
        for (int i = 0; i < frames; ++i)
        {
            const auto value = samples[i];
            const auto absolute = std::abs (value);
            blockPeak = std::max (blockPeak, absolute);
            blockSumSquares += static_cast<double> (value) * value;
            if (absolute >= 1.0f)
                ++blockClips;

            if (noiseCaptureState.load (std::memory_order_relaxed) == 1
                && noiseSampleCount < noiseSamplesTarget)
            {
                noiseSumSquares += static_cast<double> (value) * value;
                ++noiseSampleCount;
            }
        }
    }

    // RMS is smoothed over approximately 300 ms, independent of buffer size.
    const double blockMeanSquare = blockSumSquares / (channels * frames);
    const double smoothing = std::exp (-static_cast<double> (frames)
                                       / (currentSampleRate * 0.3));
    smoothedMeanSquare = smoothing * smoothedMeanSquare
                       + (1.0 - smoothing) * blockMeanSquare;

    maxPeakLinear = std::max (maxPeakLinear, blockPeak);
    peakDb.store (toDb (blockPeak), std::memory_order_relaxed);
    heldPeakDb.store (toDb (maxPeakLinear), std::memory_order_relaxed);
    rmsDb.store (toDb (static_cast<float> (std::sqrt (smoothedMeanSquare))),
                 std::memory_order_relaxed);
    if (blockClips > 0)
        clippedSamples.fetch_add (blockClips, std::memory_order_relaxed);

    if (noiseCaptureState.load (std::memory_order_relaxed) == 1
        && noiseSampleCount >= noiseSamplesTarget)
    {
        const auto noiseRms = std::sqrt (noiseSumSquares / noiseSampleCount);
        noiseFloorDb.store (toDb (static_cast<float> (noiseRms)),
                            std::memory_order_relaxed);
        noiseCaptureState.store (2, std::memory_order_release);
    }

    // Transparency by design: the incoming audio is not modified.
}

juce::AudioProcessorEditor* JenLowSoundcheckAudioProcessor::createEditor()
{
    return new JenLowSoundcheckAudioProcessorEditor (*this);
}

juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new JenLowSoundcheckAudioProcessor();
}
