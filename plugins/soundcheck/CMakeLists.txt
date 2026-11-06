cmake_minimum_required(VERSION 3.22)
project(JenLowSoundcheck VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
    JUCE
    GIT_REPOSITORY https://github.com/juce-framework/JUCE.git
    GIT_TAG 8.0.15
    GIT_SHALLOW TRUE
)
FetchContent_MakeAvailable(JUCE)

juce_add_plugin(JenLowSoundcheck
    COMPANY_NAME "JenLow"
    BUNDLE_ID "net.jenlow.soundcheck"
    IS_SYNTH FALSE
    NEEDS_MIDI_INPUT FALSE
    NEEDS_MIDI_OUTPUT FALSE
    IS_MIDI_EFFECT FALSE
    EDITOR_WANTS_KEYBOARD_FOCUS FALSE
    COPY_PLUGIN_AFTER_BUILD FALSE
    PLUGIN_MANUFACTURER_CODE JnLw
    PLUGIN_CODE JLSC
    FORMATS VST3 Standalone
    PRODUCT_NAME "JenLow Soundcheck"
)

juce_generate_juce_header(JenLowSoundcheck)

target_sources(JenLowSoundcheck PRIVATE
    Source/PluginProcessor.h
    Source/PluginProcessor.cpp
    Source/PluginEditor.h
    Source/PluginEditor.cpp
)

target_compile_definitions(JenLowSoundcheck PRIVATE
    JUCE_WEB_BROWSER=0
    JUCE_USE_CURL=0
    JUCE_VST3_CAN_REPLACE_VST2=0
)

target_link_libraries(JenLowSoundcheck PRIVATE
    juce::juce_audio_utils
    PUBLIC
    juce::juce_recommended_config_flags
)
