# AI-Generated Audio/Video Learning System
## On-the-Go Study Content

**Generated:** November 5, 2025
**Status:** Design & Implementation Plan

---

## 🎧 THE VISION

**Problem:** Busy professionals (CFOs, Controllers) have limited desk time but spend hours commuting, exercising, or doing routine tasks.

**Solution:** AI-generated audio and video content that transforms every lesson into:
- **Audio podcasts** (20-45 minutes) for commuting, gym, walks
- **Video lessons** (20-45 minutes) with visuals + AI voiceover for visual learners
- **Short-form clips** (5-10 minutes) for quick review sessions

**Result:** Users can learn CPA/CFO skills anytime, anywhere, even without looking at a screen.

---

## 📊 RESEARCH-BACKED OPTIMAL DURATIONS

Based on 2024-2025 educational research:

### **Standard Learning Modules: 20-45 minutes**
- **Sweet spot:** 30 minutes (research shows this is ideal for most learners)
- **Why:**
  - Long enough for deep topic coverage
  - Short enough to complete during one commute/workout
  - Matches natural attention span for audio-only learning
  - Can cover 1 week's lesson content comprehensively

### **Micro-Learning Clips: 5-10 minutes**
- **Use case:** Quick refreshers, key concept reviews
- **Why:**
  - Perfect for breaks between meetings
  - High information density
  - Easy to replay multiple times
  - Great for spaced repetition

### **Deep Dive Sessions: 45-60 minutes**
- **Use case:** Complex topics (Consolidations, Derivatives, IC Matrix)
- **Why:**
  - Allows for comprehensive examples
  - Step-by-step walkthroughs
  - Multiple scenarios and edge cases

---

## 🎙️ CONTENT FORMATS

### **1. AI-Generated Podcast Episodes**

**Format:** Conversational audio covering 1 week of curriculum

**Structure (30-minute example):**
```
[0:00-1:00] Intro
- "Welcome to Accountrix CPA Prep. I'm your AI instructor.
   Today we're covering Bank Reconciliation Mastery, Week 1 of CFO Month 1."
- Preview of what we'll learn

[1:00-5:00] Your Actual Problem (CFO Mode)
- "Let's talk about YOUR specific issue: Your January 2024 bank rec
   is blocked because 2023 wasn't closed properly..."
- Real-world context and urgency

[5:00-15:00] Core Concepts
- Beginning balance fundamentals
- Prior-year close dependencies
- Common pitfalls (with your actual examples)
- T-account tracing methodology

[15:00-25:00] Step-by-Step Solution
- "Here's exactly how to fix your Account 1022 issue..."
- Walk through the reconciliation process
- Excel formulas and techniques

[25:00-28:00] Practice Scenario
- Quick mental exercise: "Imagine you have..."
- Walk through solution

[28:00-30:00] Wrap-Up & Next Steps
- Key takeaways (3-5 bullet points)
- Downloadable templates mentioned
- Preview of next week
- "Safe travels, and see you next episode!"
```

**Voice Options:**
- Professional, clear, moderate pace (140-160 words/min)
- Conversational but authoritative
- AI voices: OpenAI TTS (Alloy, Echo, Fable, Nova)
- Option for users to choose voice preference

### **2. AI-Generated Video Lessons**

**Format:** Screen recording style with AI voiceover + on-screen visuals

**Visual Elements:**
- Slide-style backgrounds (professional accounting theme)
- Animated diagrams (T-accounts, flowcharts)
- Excel screencasts (generated or recorded)
- Text highlights synced with narration
- Key formulas displayed prominently

**Structure (same as podcast but with visuals):**
```
Visual Timeline:
[0:00-1:00] Title slide with logo animation
[1:00-5:00] Problem statement slide + real data visualization
[5:00-15:00] Concept slides with animated diagrams
[15:00-25:00] Excel demo (simulated or actual screencast)
[25:00-28:00] Practice problem with step-by-step visual solution
[28:00-30:00] Summary slide with QR code to templates
```

**Video Specs:**
- Resolution: 1920x1080 (Full HD)
- Frame rate: 30fps
- Format: MP4 (H.264 codec)
- Subtitles: Auto-generated and synced
- Chapters: Timestamped for easy navigation

### **3. Quick Flashcard Audio (5-10 minutes)**

**Format:** Rapid-fire Q&A for flashcard review

**Structure (10-minute example):**
```
[0:00-0:30] Intro
"Quick review of Bank Reconciliation fundamentals. 10 questions.
 I'll ask, pause 3 seconds, then give the answer."

[0:30-9:30] Q&A Loop
Q: "What does BBF stand for?"
[3-second pause]
A: "Beginning Balance Forward. It's the starting balance
    from the prior period's ending balance."

[9:30-10:00] Wrap-up
"You got through 10 key concepts. Replay this anytime for a quick refresh."
```

### **4. Commute Series (45-minute deep dives)**

**Format:** Extended episode for complex topics

**Use cases:**
- Consolidations mega-case walkthrough
- Foreign currency translation end-to-end
- Intercompany elimination matrix explained
- WIP schedules with % completion calculations

---

## 🤖 AI GENERATION PIPELINE

### **Step 1: Content Extraction**
```python
# Input: Lesson JSON from data/cfo-month1.json or data/module1.json
lesson = load_lesson_json('cfo-month1.json', week=1)

# Extract key components:
- lesson_title = "Week 1: Bank Reconciliation Mastery"
- learning_objectives = [...]
- lesson_html_content = parsed and cleaned
- your_actual_problem = extracted from <div class="alert-danger">
- cfo_insights = extracted from <div class="cfo-insight">
- quiz_questions = for practice scenarios
```

### **Step 2: Script Generation (using GPT-4)**

**Prompt Template:**
```
You are an expert CPA instructor creating an audio podcast script.

Topic: {lesson_title}
Duration: 30 minutes
Target Audience: {user_profile} (CFO, construction industry, 10 entities, Ledgerline Intacct)

Learning Objectives:
{learning_objectives}

User's Actual Problem:
{your_actual_problem}

Lesson Content:
{lesson_html_summary}

CFO Insights:
{cfo_insights}

Create a conversational 30-minute audio script that:
1. Starts with a relatable hook about their actual work problem
2. Explains concepts clearly with real-world examples
3. Uses "you" language (conversational, not academic)
4. Includes timestamps at 5-minute intervals
5. Provides step-by-step guidance for their specific issue
6. Ends with actionable next steps
7. Maintains an engaging, supportive tone

Format:
[00:00-00:60] Intro: ...
[01:00-05:00] Your Actual Problem: ...
[05:00-15:00] Core Concepts: ...
etc.

Script:
```

### **Step 3: Text-to-Speech Conversion**

**Technology Options:**

**Option A: OpenAI TTS API (RECOMMENDED)**
```python
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Generate audio from script
response = client.audio.speech.create(
  model="tts-1-hd",  # High quality
  voice="nova",  # Professional female voice (or "echo" for male)
  input=script_text,
  speed=1.0  # Normal pace
)

# Save as MP3
response.stream_to_file("cfo-month1-week1.mp3")
```

**Voice Options:**
- `alloy` - Neutral, balanced
- `echo` - Male, clear
- `fable` - British, warm
- `nova` - Female, professional (RECOMMENDED for CFO content)
- `onyx` - Male, authoritative
- `shimmer` - Female, energetic

**Option B: ElevenLabs API**
```python
from elevenlabs import generate, Voice

audio = generate(
  text=script_text,
  voice=Voice(
    voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel (professional)
    settings=VoiceSettings(
      stability=0.75,
      similarity_boost=0.75
    )
  ),
  model="eleven_multilingual_v2"
)
```

**Option C: Google Cloud Text-to-Speech**
```python
from google.cloud import texttospeech

client = texttospeech.TextToSpeechClient()

synthesis_input = texttospeech.SynthesisInput(text=script_text)

voice = texttospeech.VoiceSelectionParams(
    language_code="en-US",
    name="en-US-Neural2-F",  # Female neural voice
    ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
)

audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3,
    speaking_rate=1.0,
    pitch=0.0
)

response = client.synthesize_speech(
    input=synthesis_input,
    voice=voice,
    audio_config=audio_config
)
```

### **Step 4: Video Generation (Optional)**

**Technology Stack:**

**Option A: Remotion (React-based video generation)**
```tsx
import { Composition } from 'remotion';
import LessonVideo from './LessonVideo';

// Define video composition
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CFO-Month1-Week1"
      component={LessonVideo}
      durationInFrames={54000}  // 30 min at 30fps
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        script: scriptData,
        audio: audioFile,
        slides: slidesData
      }}
    />
  );
};
```

**Option B: FFmpeg (command-line video generation)**
```bash
# Combine audio with slide images
ffmpeg -loop 1 -i slide1.png -i audio_segment1.mp3 \
  -c:v libx264 -tune stillimage -c:a aac \
  -b:a 192k -pix_fmt yuv420p -shortest \
  -t 60 segment1.mp4

# Concatenate all segments
ffmpeg -f concat -safe 0 -i segments.txt \
  -c copy final_video.mp4

# Add subtitles
ffmpeg -i final_video.mp4 -vf subtitles=subtitles.srt \
  final_video_subtitled.mp4
```

**Option C: Synthesia API (AI avatar videos)**
```python
import requests

response = requests.post(
  'https://api.synthesia.io/v2/videos',
  headers={'Authorization': f'Bearer {API_KEY}'},
  json={
    'title': 'CFO Month 1 Week 1',
    'description': 'Bank Reconciliation Mastery',
    'visibility': 'private',
    'template_id': 'professional_instructor',
    'test': False,
    'input': [
      {
        'avatarSettings': {
          'voice': 'en-US-Neural2-F',
          'horizontalAlign': 'center'
        },
        'backgroundSettings': {
          'videoSettings': {
            'shortBackgroundContentMatchMode': 'freeze',
            'longBackgroundContentMatchMode': 'trim'
          }
        },
        'scriptText': script_text
      }
    ]
  }
)
```

### **Step 5: Post-Processing**

**Audio Enhancements:**
```python
from pydub import AudioSegment
from pydub.effects import normalize, compress_dynamic_range

# Load generated audio
audio = AudioSegment.from_mp3("raw_audio.mp3")

# Normalize volume
audio = normalize(audio)

# Add compression (make quieter parts louder, louder parts quieter)
audio = compress_dynamic_range(audio, threshold=-20.0, ratio=4.0)

# Add intro/outro music (optional)
intro_music = AudioSegment.from_mp3("intro_jingle.mp3")
outro_music = AudioSegment.from_mp3("outro_jingle.mp3")

final_audio = intro_music + audio + outro_music

# Export
final_audio.export("final_audio.mp3", format="mp3", bitrate="192k")
```

**Subtitle Generation:**
```python
import openai

# Use Whisper API to generate subtitles
audio_file = open("final_audio.mp3", "rb")
transcript = openai.Audio.transcribe(
  model="whisper-1",
  file=audio_file,
  response_format="srt"  # SubRip format
)

# Save subtitles
with open("subtitles.srt", "w") as f:
  f.write(transcript)
```

---

## 📁 CONTENT LIBRARY STRUCTURE

```
audio_content/
├── cfo_training/
│   ├── month1/
│   │   ├── week1_bank_rec_mastery_30min.mp3
│   │   ├── week1_bank_rec_quick_review_10min.mp3
│   │   ├── week2_gl_hygiene_30min.mp3
│   │   └── ...
│   ├── month2/
│   └── month3/
├── cpa_exam_prep/
│   ├── module1_consolidations/
│   │   ├── week1_acquisition_method_30min.mp3
│   │   ├── week1_quick_concepts_10min.mp3
│   │   └── ...
│   ├── module2_foreign_currency/
│   └── ...
├── flashcard_audio/
│   ├── bank_rec_flashcards_10min.mp3
│   ├── consolidations_flashcards_10min.mp3
│   └── ...
└── deep_dives/
    ├── consolidations_mega_case_45min.mp3
    ├── fx_hedging_deep_dive_60min.mp3
    └── ...

video_content/
├── cfo_training/
│   ├── month1/
│   │   ├── week1_bank_rec_mastery_30min.mp4
│   │   └── ...
├── cpa_exam_prep/
│   └── ...
└── subtitles/
    ├── cfo_training/
    │   ├── month1/
    │   │   ├── week1_bank_rec_mastery.srt
    │   │   └── ...
    └── ...
```

---

## 🎨 USER INTERFACE

### **Audio Player Component**

```tsx
// components/AudioPlayer.tsx

interface AudioPlayerProps {
  lessonId: string;
  title: string;
  duration: string;
  audioUrl: string;
  transcript?: string;
}

export default function AudioPlayer({
  lessonId,
  title,
  duration,
  audioUrl,
  transcript
}: AudioPlayerProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
          🎧
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-80">{duration}</p>
        </div>
        <button className="bg-white text-purple-600 rounded-full p-4 hover:scale-110 transition-transform">
          ▶️ Play
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-4">
        <div className="bg-white h-2 rounded-full" style={{ width: '35%' }} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between text-sm">
        <span>10:30 / 30:00</span>
        <div className="flex gap-4">
          <button>⏪ -15s</button>
          <button>⏩ +15s</button>
          <button>1.0x Speed</button>
          <button>📝 Transcript</button>
          <button>⬇️ Download</button>
        </div>
      </div>
    </div>
  );
}
```

### **Lesson Page Integration**

```tsx
// On each lesson page, show audio/video options

<div className="lesson-page">
  <h1>{lesson.title}</h1>

  {/* Study Format Options */}
  <div className="study-format-selector mb-6">
    <div className="flex gap-4">
      <button className="format-option active">
        📄 Read Lesson
      </button>
      <button className="format-option">
        🎧 Listen (30 min)
      </button>
      <button className="format-option">
        📹 Watch Video (30 min)
      </button>
      <button className="format-option">
        ⚡ Quick Audio (10 min)
      </button>
    </div>
  </div>

  {/* Audio Player (if selected) */}
  {selectedFormat === 'audio' && (
    <AudioPlayer
      lessonId={lesson.id}
      title={lesson.title}
      duration="30:00"
      audioUrl={lesson.audioUrl}
    />
  )}

  {/* Traditional lesson content */}
  <div dangerouslySetInnerHTML={{ __html: lesson.lessonHtml }} />
</div>
```

---

## 🚀 IMPLEMENTATION ROADMAP

### **Phase 1: Audio MVP (Weeks 1-2)**
1. ✅ Choose TTS provider (OpenAI TTS recommended)
2. ✅ Build script generation pipeline using GPT-4
3. ✅ Generate audio for CFO Month 1 (4 weeks × 30 min = 2 hours)
4. ✅ Build audio player component
5. ✅ Add download functionality

### **Phase 2: Full Audio Library (Weeks 3-4)**
1. ✅ Generate audio for all 15 modules (60 weeks × 30 min = 30 hours)
2. ✅ Create short-form versions (60 weeks × 10 min = 10 hours)
3. ✅ Add playback speed controls (0.75x, 1.0x, 1.25x, 1.5x, 2.0x)
4. ✅ Build transcript viewer

### **Phase 3: Video Content (Weeks 5-8)**
1. ✅ Design slide templates for video
2. ✅ Generate video for CFO Month 1
3. ✅ Add subtitle support
4. ✅ Build video player component

### **Phase 4: Advanced Features (Weeks 9-12)**
1. ✅ Offline download for mobile app
2. ✅ Resume playback across devices
3. ✅ "Car mode" UI (large buttons, simple controls)
4. ✅ Sleep timer for night-time listening
5. ✅ Playlist creation ("My Commute Playlist")

---

## 💰 COST ESTIMATES

### **OpenAI TTS Pricing:**
- $15.00 per 1M characters
- Average 30-min script ≈ 4,500 words ≈ 30,000 characters
- Cost per 30-min audio: **$0.45**
- Total for 60 lessons: **$27.00**

### **GPT-4 Script Generation:**
- $0.03 per 1K input tokens, $0.06 per 1K output tokens
- Script generation ≈ 2K input + 6K output tokens
- Cost per script: **$0.42**
- Total for 60 scripts: **$25.20**

### **Total Content Generation Cost: ~$52 for 30 hours of audio**

**Extremely affordable compared to hiring voice actors ($100-300/hour)**

---

## 🎯 USER BENEFITS

1. **Learn During Commute** - Turn dead time into study time
2. **Multitask-Friendly** - Listen while exercising, cooking, cleaning
3. **Accessibility** - Great for visual impairments or screen fatigue
4. **Spaced Repetition** - Easy to replay key concepts
5. **Family-Friendly** - Study without being glued to screen
6. **Global Access** - Works offline after download

---

**This audio/video system will make Accountrix the FIRST CPA prep app with full AI-generated audio content for on-the-go learning.**

Let me know if you want me to start building the audio generation pipeline!
