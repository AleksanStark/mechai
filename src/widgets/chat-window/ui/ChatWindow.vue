<script setup lang="ts">
import { ref, nextTick, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import OpenAI from "openai";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { imageToBase64 } from "../../../features/ai";

// ───────────────── TYPES ─────────────────

interface Message {
  role: "user" | "ai";
  text: string;
  image?: string;
}

// ───────────────── ROUTE ─────────────────

const route = useRoute();

const mode = computed(() =>
  route.path.includes("recommendation") ? "RECOMMENDATION" : "ANALYSIS",
);

// ───────────────── OPENAI ─────────────────

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPEN_ROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
});

// ───────────────── SYSTEM PROMPT ─────────────────

const SYSTEM_PROMPT_RECOMMENDATION = `
You are MechAI — a Texas-based veteran automotive mechanic and vehicle decision advisor.

══════════════════════════════════════
🎯 CORE IDENTITY
══════════════════════════════════════
You are NOT a general AI assistant.

You are ONLY an automotive decision mechanic.

Your entire purpose is:
- analyze vehicles
- evaluate car condition
- help with buying / repairing / avoiding cars
- detect risks in automotive deals

You ONLY understand and respond to automotive-related content.

══════════════════════════════════════
🚫 ABSOLUTE DOMAIN LIMIT (HIGHEST PRIORITY RULE)
══════════════════════════════════════
You MUST ONLY respond to content related to:

✔ Cars
✔ Trucks
✔ Motorcycles
✔ Engines
✔ Car parts
✔ Vehicle buying/selling
✔ Maintenance and repair
✔ Automotive images

❌ EVERYTHING ELSE IS OUT OF SCOPE:
- games
- cartoons
- people
- animals
- objects
- memes
- general questions
- random images
- software/apps
- any non-vehicle content

══════════════════════════════════════
🚫 OUT-OF-SCOPE RESPONSE RULE (STRICT)
══════════════════════════════════════
If the user request is NOT about a vehicle or automotive topic:

You MUST respond EXACTLY:

"I can only help with vehicles, buddy. Send me something car-related."

❌ Do NOT:
- analyze the content
- guess context
- give advice
- explain anything
- joke about it
- try to "force relevance"

══════════════════════════════════════
🚗 PRIMARY ROLE (ONLY WHEN IN SCOPE)
══════════════════════════════════════
When the input IS automotive-related:

You are a DECISION MAKER mechanic.

You guide user from uncertainty → final decision:
BUY / NEGOTIATE / REPAIR / AVOID

You act like a Texas garage mechanic with experience from thousands of real cases.

══════════════════════════════════════
📊 DECISION RULE
══════════════════════════════════════
You MUST always output a decision when in scope:

- BUY (safe)
- NEGOTIATE (minor risks)
- REPAIR BEFORE BUY / REPAIR IF OWNED
- AVOID (high risk)

You NEVER stay neutral.

══════════════════════════════════════
📸 IMAGE RULE
══════════════════════════════════════
- Only analyze images IF they contain vehicles or car parts
- If image is not automotive → trigger OUT-OF-SCOPE RESPONSE RULE
- If image is unclear → ask for vehicle-specific clarification ONLY

══════════════════════════════════════
🚗 ANALYSIS INPUTS (ONLY VEHICLES)
══════════════════════════════════════
You evaluate only:

- car photos
- vehicle descriptions
- mileage / price / year
- mechanical symptoms
- known car issues

══════════════════════════════════════
🚨 RISK DETECTION (AUTOMOTIVE ONLY)
══════════════════════════════════════
Detect only car-related risks:

- accident damage
- flood damage (utoplennik)
- odometer rollback
- engine/transmission failure
- overpriced vehicle
- hidden repair history

══════════════════════════════════════
🧠 RESPONSE STRUCTURE (WHEN IN SCOPE)
══════════════════════════════════════
1. Quick verdict (BUY / NEGOTIATE / AVOID)
2. Risk level (LOW / MEDIUM / HIGH)
3. Mechanic reasoning
4. Hidden risks
5. Real-world consequences
6. Final recommendation

══════════════════════════════════════
🧢 TEXAS MECHANIC STYLE
══════════════════════════════════════
Speak like a Texas garage mechanic:
- direct, rough, confident
- practical language
- natural mechanic slang (translated to user language)

BUT:
No English slang is allowed if user writes in another language.

══════════════════════════════════════
🌐 LANGUAGE RULE (STRICT)
══════════════════════════════════════
Always respond in the SAME language as the user.

- Russian → full Russian
- English → full English
- German → full German

NO mixed languages allowed.

All slang must be translated.

══════════════════════════════════════
🎯 OPTIONAL FEATURE (ONLY IF AUTOMOTIVE CONTEXT)
══════════════════════════════════════
If relevant, you may use light “garage humor” or Texas mechanic style phrases.

BUT ONLY inside automotive context.

══════════════════════════════════════
❌ STRICT RULES
══════════════════════════════════════
- NEVER analyze non-automotive content
- NEVER guess meaning of unrelated images
- NEVER force decision on non-car topics
- NEVER answer outside domain
- ALWAYS reject out-of-scope immediately

══════════════════════════════════════
🎯 FINAL GOAL
══════════════════════════════════════
- Be a strict automotive decision mechanic
- Avoid hallucinating outside domain
- Give fast BUY / NEGOTIATE / AVOID decisions only for vehicles
`;

const SYSTEM_PROMPT_ANALYZE = `
You are MechAI — a senior automotive mechanic and vehicle inspection expert from Texas.

══════════════════════════════════════
🎯 CORE ROLE
══════════════════════════════════════
You are NOT a general assistant.

You are a professional garage mechanic specialized ONLY in visual vehicle inspection.

Your only task:
Analyze car images and evaluate the vehicle condition based strictly on what is visible.

You do NOT:
- answer text-only questions
- discuss general topics
- provide unrelated advice

If there is no image, respond:
"Sorry buddy, I only inspect vehicles through photos."

══════════════════════════════════════
📸 PRIMARY TASK — IMAGE INSPECTION
══════════════════════════════════════
When an image is provided, you must:

1. Carefully examine every visible detail:
   - body condition (scratches, dents, rust, paint damage)
   - lights, glass, mirrors
   - wheels and tires
   - suspension stance (if visible)
   - interior condition (if visible)
   - engine bay (if visible)
   - any leaks, cracks, broken parts
   - signs of repainting or replaced panels

2. Detect both:
   - obvious damage
   - subtle signs of wear or hidden issues

3. Actively look for fraud indicators:
   - inconsistent panel gaps
   - mismatched paint shades
   - fresh paint over old damage
   - water damage signs (stains, corrosion patterns, mold, fogging)
   - signs of flooding (flood cars / “water-damaged vehicles”)
   - tampered or replaced parts
   - signs of accident cover-up or cheap repair jobs
   - odometer or interior mismatch vs exterior condition

══════════════════════════════════════
🚨 FRAUD / HIDDEN DAMAGE DETECTION
══════════════════════════════════════
You MUST treat every vehicle as potentially suspicious until proven otherwise.

Pay special attention to:
- Flood / water-damaged vehicles (VERY IMPORTANT)
- Accident-repaired cars
- Repainted or resold damaged vehicles
- Cosmetic masking of structural damage

If you suspect fraud or hidden damage:
- clearly say it
- explain why based on visible clues
- describe what might be hidden underneath

Never ignore suspicious signs.

══════════════════════════════════════
⚠️ DAMAGE CLASSIFICATION (MANDATORY)
══════════════════════════════════════
After inspection, assign ONE final condition level:

- 🟢 LOW DAMAGE
  Minor wear, cosmetic issues only, no serious concerns

- 🟡 MEDIUM DAMAGE
  Noticeable issues, possible repairs needed, may affect comfort or reliability

- 🔴 SEVERE DAMAGE
  Major problems, likely structural/mechanical concerns, risky purchase

- 🔥 EXTREME / CRITICAL DAMAGE ("AWFUL")
  Unsafe, heavily damaged, flood/accident-prone, or not worth buying

══════════════════════════════════════
🧠 REQUIRED OUTPUT STRUCTURE
══════════════════════════════════════
Always respond in this format:

1. 🔍 Visual Observation
Describe exactly what is visible in the image

2. 🧠 Inspection Findings
Explain mechanical or structural meaning

3. 🚨 Fraud / Hidden Damage Check
- suspicious signs
- possible hidden problems
- flood/accident indicators (if any)

4. ⚠️ Risk Analysis
- safety risks
- mechanical risks
- financial risks
- long-term consequences

5. 💥 Owner Impact
Explain real-world impact on:
- driving
- safety
- reliability
- repair cost

6. 📊 FINAL VERDICT
Choose one:
LOW DAMAGE / MEDIUM DAMAGE / SEVERE DAMAGE / EXTREME DAMAGE

Explain why clearly.

══════════════════════════════════════
🧢 TEXAS MECHANIC STYLE
══════════════════════════════════════
Speak like a Texas garage mechanic:

- direct, honest, experienced tone
- slightly rough but not exaggerated
- occasional slang:
  "buddy", "listen here", "I’ve seen this before", "that’s not looking good", "this one’s been through it"

Examples:
- "Yeah buddy, that paint don’t look factory anymore."
- "I’ve seen flood cars like this before… and they usually hide more than they show."
- "This one’s been patched up, but not in a good way."

══════════════════════════════════════
🌐 LANGUAGE RULE (IMPORTANT)
══════════════════════════════════════
You must ALWAYS respond in the same language that the user uses in their message.

- If the user writes in Russian → respond in Russian
- If the user writes in English → respond in English
- If the user writes in German → respond in German
- If the user mixes languages → respond in the dominant language of the message

You MUST NOT switch languages unless the user changes language first.

Do not translate unless explicitly asked.

══════════════════════════════════════
❌ STRICT RULES
══════════════════════════════════════
- ONLY analyze images
- DO NOT answer unrelated questions
- DO NOT guess without visual evidence
- DO NOT hallucinate hidden damage without any signs
- DO NOT act like a general AI assistant

══════════════════════════════════════
🎯 FINAL GOAL
══════════════════════════════════════
Your mission is:
Give a brutally honest visual inspection of the vehicle,
detect possible fraud or hidden damage,
identify flood or accident cars when visible,
and classify the vehicle condition clearly so the user avoids bad purchases.
`;
// ───────────────── STATE ─────────────────

const visibleMessages = ref<Message[]>([
  {
    role: "ai",
    text: "# MechAi Online\n\nUpload ingredients or ask for a meal plan.",
  },
]);

const typing = ref(false);
const isStreaming = ref(false);

const inputVal = ref("");

const fileInput = ref<HTMLInputElement | null>(null);

const selectedImage = ref<string | null>(null);

const messagesRef = ref<HTMLElement | null>(null);

// ───────────────── HELPERS ─────────────────

function renderMarkdown(text: string): string {
  const raw = marked.parse(text) as string;
  return DOMPurify.sanitize(raw);
}

async function scrollToBottom() {
  await nextTick();

  messagesRef.value?.scrollTo({
    top: messagesRef.value.scrollHeight,
    behavior: "smooth",
  });
}

// ───────────────── FILE HANDLING ─────────────────

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (!file) return;

  selectedImage.value = URL.createObjectURL(file);
}

function clearImage() {
  if (selectedImage.value) {
    URL.revokeObjectURL(selectedImage.value);
  }

  selectedImage.value = null;

  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

// ───────────────── SEND MESSAGE ─────────────────

async function sendMessage() {
  const text = inputVal.value.trim();
  const file = fileInput.value?.files?.[0];

  if ((!text && !file) || typing.value) return;

  inputVal.value = "";

  // USER MESSAGE

  visibleMessages.value.push({
    role: "user",
    text,
    image: selectedImage.value ?? undefined,
  });

  await scrollToBottom();

  // AI PLACEHOLDER

  typing.value = true;
  isStreaming.value = false;

  const aiIndex = visibleMessages.value.length;

  visibleMessages.value.push({
    role: "ai",
    text: "",
  });

  try {
    // BUILD HISTORY

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: route.path.includes("recommendation")
          ? SYSTEM_PROMPT_RECOMMENDATION
          : SYSTEM_PROMPT_ANALYZE,
      },
    ];

    // HISTORY

    for (const msg of visibleMessages.value) {
      if (msg.role === "user") {
        messages.push({
          role: "user",
          content: msg.text,
        });
      }

      if (msg.role === "ai" && msg.text) {
        messages.push({
          role: "assistant",
          content: msg.text,
        });
      }
    }

    // CURRENT MESSAGE WITH IMAGE

    if (file) {
      const base64 = await imageToBase64(file);

      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: text || "Analyze this image",
          },
          {
            type: "image_url",
            image_url: {
              url: base64,
            },
          },
        ],
      });
    }

    // MODEL

    const model = "openai/gpt-5.4-nano";

    // STREAM

    const stream = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1400,
    });

    let accumulated = "";

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";

      if (!delta) continue;

      if (!isStreaming.value) {
        isStreaming.value = true;
      }

      accumulated += delta;

      visibleMessages.value[aiIndex]!.text = accumulated;

      await scrollToBottom();
    }

    clearImage();
  } catch (error) {
    console.error(error);

    visibleMessages.value[aiIndex]!.text =
      "⚠️ Something went wrong. Try again.";
  } finally {
    typing.value = false;
    isStreaming.value = false;

    await scrollToBottom();
  }
}

// ───────────────── ENTER SEND ─────────────────

function onEnter(event: KeyboardEvent) {
  if (event.shiftKey) return;

  event.preventDefault();

  sendMessage();
}

// ───────────────── INIT ─────────────────

onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <section class="chat-page">
    <!-- GRID -->
    <div class="scan-grid"></div>

    <!-- WINDOW -->
    <div class="chat-window">
      <!-- HEADER -->
      <div class="chat-header">
        <div>
          <div class="title">MECH AI SYSTEM</div>
          <div class="subtitle">Neural Cooking Assistant</div>
        </div>

        <div class="mode">
          {{ mode }}
        </div>
      </div>

      <!-- MESSAGES -->
      <div ref="messagesRef" class="chat-body">
        <div
          v-for="(msg, index) in visibleMessages"
          :key="index"
          class="message-row"
          :class="msg.role"
        >
          <div class="message-bubble">
            <!-- IMAGE -->
            <img
              v-if="msg.image"
              :src="msg.image"
              alt="upload"
              class="message-image"
            />

            <!-- TEXT -->
            <div
              v-if="msg.role === 'ai'"
              class="markdown-body"
              v-html="renderMarkdown(msg.text)"
            ></div>

            <div v-else-if="msg.text" class="user-text">
              {{ msg.text }}
            </div>
          </div>
        </div>

        <!-- TYPING -->
        <div v-if="typing && !isStreaming" class="message-row ai">
          <div class="typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- PREVIEW -->
      <div v-if="selectedImage" class="preview-wrapper">
        <img :src="selectedImage" class="preview-image" />

        <button class="remove-preview" @click="clearImage">✕</button>
      </div>

      <!-- INPUT -->
      <div class="chat-input">
        <!-- FILE -->
        <button class="upload-btn" @click="triggerFileInput">+</button>

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          hidden
          @change="handleFileChange"
        />

        <!-- INPUT -->
        <textarea
          v-model="inputVal"
          placeholder="Describe your ingredients..."
          rows="1"
          @keydown.enter="onEnter"
        />

        <!-- SEND -->
        <button class="send-btn" :disabled="typing" @click="sendMessage">
          <span v-if="!typing">SEND</span>

          <span v-else class="loader"></span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chat-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #12232d 0%, #081018 60%);
  overflow: hidden;
  position: relative;
  padding: 20px;
}

/* GRID */

.scan-grid {
  position: absolute;
  inset: 0;

  background-image:
    linear-gradient(rgba(0, 216, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 216, 255, 0.04) 1px, transparent 1px);

  background-size: 42px 42px;

  opacity: 0.5;
}

/* WINDOW */

.chat-window {
  width: min(900px, 100%);
  height: 88vh;

  display: flex;
  flex-direction: column;

  position: relative;

  background: linear-gradient(
    145deg,
    rgba(10, 16, 24, 0.96),
    rgba(16, 24, 34, 0.98)
  );

  border: 1px solid rgba(0, 216, 255, 0.18);

  backdrop-filter: blur(14px);

  box-shadow:
    0 0 60px rgba(0, 216, 255, 0.08),
    inset 0 0 30px rgba(0, 0, 0, 0.7);

  overflow: hidden;

  border-radius: 22px;
}

/* HEADER */

.chat-header {
  padding: 20px 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid rgba(0, 216, 255, 0.08);
}

.title {
  color: #e6fbff;

  font-size: 18px;
  font-weight: 700;

  letter-spacing: 0.08em;
}

.subtitle {
  margin-top: 4px;

  color: rgba(230, 251, 255, 0.55);

  font-size: 12px;
}

.mode {
  color: #ff9f43;

  font-size: 11px;

  letter-spacing: 0.24em;
}

/* BODY */

.chat-body {
  flex: 1;

  overflow-y: auto;

  display: flex;
  flex-direction: column;

  gap: 16px;

  padding: 24px;
}

/* MESSAGES */

.message-row {
  display: flex;
}

.message-row.user {
  justify-content: flex-end;
}

.message-row.ai {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 78%;

  padding: 14px 16px;

  border-radius: 18px;

  line-height: 1.6;
}

.message-row.ai .message-bubble {
  background: rgba(0, 216, 255, 0.06);

  border: 1px solid rgba(0, 216, 255, 0.12);

  color: #e6fbff;

  border-bottom-left-radius: 4px;
}

.message-row.user .message-bubble {
  background: rgba(255, 159, 67, 0.12);

  border: 1px solid rgba(255, 159, 67, 0.16);

  color: #fff4e8;

  border-bottom-right-radius: 4px;
}

/* IMAGE */

.message-image {
  width: 220px;

  border-radius: 12px;

  display: block;

  margin-bottom: 10px;
}

/* INPUT */

.chat-input {
  padding: 18px;

  border-top: 1px solid rgba(0, 216, 255, 0.08);

  display: flex;
  gap: 12px;
  align-items: flex-end;
}

/* TEXTAREA */

.chat-input textarea {
  flex: 1;

  resize: none;

  min-height: 52px;
  max-height: 180px;

  background: rgba(255, 255, 255, 0.03);

  border: 1px solid rgba(0, 216, 255, 0.12);

  border-radius: 14px;

  padding: 14px;

  color: #e6fbff;

  outline: none;

  font-size: 14px;

  line-height: 1.5;
}

.chat-input textarea:focus {
  border-color: rgba(0, 216, 255, 0.35);
}

/* BUTTONS */

.upload-btn,
.send-btn {
  height: 52px;

  border: none;

  border-radius: 14px;

  cursor: pointer;

  transition: 0.25s ease;
}

.upload-btn {
  width: 52px;

  background: rgba(0, 216, 255, 0.08);

  color: #00d8ff;

  font-size: 22px;
}

.upload-btn:hover {
  background: rgba(0, 216, 255, 0.16);
}

.send-btn {
  min-width: 110px;

  background: #ff9f43;

  color: #091016;

  font-weight: 700;

  letter-spacing: 0.08em;
}

.send-btn:hover {
  transform: translateY(-1px);

  background: #ffb15e;
}

.send-btn:disabled {
  opacity: 0.6;

  cursor: not-allowed;
}

/* PREVIEW */

.preview-wrapper {
  padding: 0 20px 16px;

  position: relative;
}

.preview-image {
  width: 120px;

  border-radius: 14px;

  border: 1px solid rgba(0, 216, 255, 0.16);
}

.remove-preview {
  position: absolute;

  top: -8px;
  left: 120px;

  width: 24px;
  height: 24px;

  border: none;

  border-radius: 50%;

  background: #ff5f56;

  color: white;

  cursor: pointer;
}

/* TYPING */

.typing {
  display: flex;
  gap: 6px;

  padding: 14px 18px;

  background: rgba(0, 216, 255, 0.06);

  border-radius: 14px;
}

.typing span {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #00d8ff;

  animation: bounce 1.2s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

/* MARKDOWN */

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  margin: 10px 0 6px;

  color: white;
}

:deep(.markdown-body p) {
  margin: 0 0 8px;
}

:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  padding-left: 18px;
}

:deep(.markdown-body code) {
  background: rgba(255, 255, 255, 0.08);

  padding: 2px 5px;

  border-radius: 4px;
}

:deep(.markdown-body pre) {
  overflow-x: auto;

  padding: 10px;

  border-radius: 10px;

  background: rgba(0, 0, 0, 0.35);
}

/* LOADER */

.loader {
  width: 18px;
  height: 18px;

  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: black;

  border-radius: 50%;

  display: inline-block;

  animation: spin 1s linear infinite;
}

/* SCROLLBAR */

.chat-body::-webkit-scrollbar {
  width: 6px;
}

.chat-body::-webkit-scrollbar-thumb {
  background: rgba(0, 216, 255, 0.18);

  border-radius: 20px;
}

/* ANIMATIONS */

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }

  30% {
    transform: translateY(-6px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
