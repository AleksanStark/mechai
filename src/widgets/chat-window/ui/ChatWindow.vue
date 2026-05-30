<script setup lang="ts">
import { ref, nextTick, computed, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import OpenAI from "openai";
import { imageToBase64 } from "../../../features/ai";
import { openai } from "../../../features/ai/api/aiApi";
import { renderMarkdown } from "../../../features/ai/utils/markdown";
import {
  SYSTEM_PROMPT_ANALYZE,
  SYSTEM_PROMPT_RECOMMENDATION,
} from "../../../features/ai/aiPromts";

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

// ───────────────── STATE ─────────────────

const visibleMessages = ref<Message[]>([
  {
    role: "ai",
    text: "# MechAi Online\n\n I wait you mate.",
  },
]);

const typing = ref(false);
const isStreaming = ref(false);

const inputVal = ref("");

const fileInput = ref<HTMLInputElement | null>(null);

const selectedImages = reactive<{ image: string }[]>([]);

const messagesRef = ref<HTMLElement | null>(null);

// ───────────────── HELPERS ─────────────────

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
  const files = (event.target as HTMLInputElement).files;

  if (!files) return;

  for (const file of files) {
    const img = URL.createObjectURL(file);
    selectedImages.push({ image: img });
  }
}

function clearImage() {
  if (selectedImages) {
    selectedImages.length = 0;
  }
}

function removeImage(index: number) {
  selectedImages.splice(index, 1);
}

// ───────────────── SEND MESSAGE ─────────────────

async function sendMessage() {
  const text = inputVal.value.trim();
  const files = fileInput.value?.files;

  if ((!text && !files) || typing.value) return;

  inputVal.value = "";

  // USER MESSAGE

  for (const img of selectedImages) {
    visibleMessages.value.push({
      role: "user",
      text,
      image: img.image ?? undefined,
    });
  }

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

    if (files) {
      for (const file of files) {
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
    }

    // MODEL

    // const model = "openai/gpt-5.4-nano";
    const model = "qwen/qwen2.5-vl-72b-instruct";
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
      <div v-if="selectedImages">
        <div
          v-for="(img, index) in selectedImages"
          :key="index"
          class="preview-wrapper"
        >
          <img :src="img.image" class="preview-image" />

          <button class="remove-preview" @click="removeImage(index)">✕</button>
        </div>
      </div>

      <!-- INPUT -->
      <div class="chat-input">
        <!-- FILE -->
        <button class="upload-btn" @click="triggerFileInput">+</button>

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
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
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;800&family=Rajdhani:wght@400;500;600;700&family=Noto+Sans:wght@400;500;700&display=swap");

/* PAGE */

.chat-page {
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;

  overflow: hidden;
  position: relative;

  background: radial-gradient(circle at top, #12232d 0%, #081018 60%);

  font-family: "Rajdhani", "Noto Sans", sans-serif;

  letter-spacing: 0.03em;
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
  width: min(920px, 100%);
  height: 88vh;

  display: flex;
  flex-direction: column;

  position: relative;

  overflow: hidden;

  border-radius: 24px;

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
}

/* HEADER */

.chat-header {
  padding: 22px 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid rgba(0, 216, 255, 0.08);
}

.title {
  color: #e6fbff;

  font-size: 20px;
  font-weight: 800;

  font-family: "Orbitron", "Noto Sans", sans-serif;

  letter-spacing: 0.16em;

  text-shadow:
    0 0 12px rgba(0, 216, 255, 0.45),
    0 0 22px rgba(0, 216, 255, 0.2);
}

.subtitle {
  margin-top: 6px;

  color: rgba(230, 251, 255, 0.55);

  font-size: 12px;

  font-family: "Rajdhani", "Noto Sans", sans-serif;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

.mode {
  color: #ff9f43;

  font-size: 12px;

  font-family: "Orbitron", "Noto Sans", sans-serif;

  letter-spacing: 0.24em;

  text-shadow: 0 0 12px rgba(255, 159, 67, 0.35);
}

/* BODY */

.chat-body {
  flex: 1;

  overflow-y: auto;

  display: flex;
  flex-direction: column;

  gap: 18px;

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

  padding: 16px 18px;

  border-radius: 18px;

  line-height: 1.75;

  font-size: 16px;

  font-family: "Rajdhani", "Noto Sans", sans-serif;

  backdrop-filter: blur(8px);
}

/* AI MESSAGE */

.message-row.ai .message-bubble {
  background: linear-gradient(
    145deg,
    rgba(0, 216, 255, 0.08),
    rgba(0, 216, 255, 0.03)
  );

  border: 1px solid rgba(0, 216, 255, 0.16);

  color: #e6fbff;

  border-bottom-left-radius: 4px;

  box-shadow:
    0 0 24px rgba(0, 216, 255, 0.06),
    inset 0 0 20px rgba(0, 216, 255, 0.03);
}

/* USER MESSAGE */

.message-row.user .message-bubble {
  background: linear-gradient(
    135deg,
    rgba(255, 159, 67, 0.14),
    rgba(255, 159, 67, 0.08)
  );

  border: 1px solid rgba(255, 159, 67, 0.22);

  color: #fff4e8;

  border-bottom-right-radius: 4px;

  box-shadow:
    0 0 18px rgba(255, 159, 67, 0.08),
    inset 0 0 12px rgba(255, 159, 67, 0.05);
}

/* IMAGE */

.message-image {
  width: 240px;

  display: block;

  margin-bottom: 12px;

  border-radius: 14px;

  border: 1px solid rgba(0, 216, 255, 0.14);

  box-shadow: 0 0 18px rgba(0, 216, 255, 0.08);
}

/* USER TEXT */

.user-text {
  white-space: pre-wrap;

  word-break: break-word;
}

/* INPUT */

.chat-input {
  padding: 18px;

  display: flex;
  gap: 12px;
  align-items: flex-end;

  border-top: 1px solid rgba(0, 216, 255, 0.08);
}

/* TEXTAREA */

.chat-input textarea {
  flex: 1;

  resize: none;

  min-height: 52px;
  max-height: 180px;

  padding: 14px 16px;

  border-radius: 14px;

  border: 1px solid rgba(0, 216, 255, 0.14);

  background: rgba(255, 255, 255, 0.03);

  color: #e6fbff;

  outline: none;

  font-size: 15px;

  line-height: 1.6;

  transition: 0.25s ease;

  font-family: "Rajdhani", "Noto Sans", sans-serif;
}

.chat-input textarea::placeholder {
  color: rgba(230, 251, 255, 0.32);

  letter-spacing: 0.04em;
}

.chat-input textarea:focus {
  border-color: rgba(0, 216, 255, 0.45);

  box-shadow:
    0 0 0 1px rgba(0, 216, 255, 0.2),
    0 0 18px rgba(0, 216, 255, 0.12);
}

/* BUTTONS */

.upload-btn,
.send-btn {
  height: 52px;

  border: none;

  border-radius: 14px;

  cursor: pointer;

  transition: 0.25s ease;

  font-family: "Orbitron", "Noto Sans", sans-serif;
}

/* UPLOAD BUTTON */

.upload-btn {
  width: 52px;

  background: rgba(0, 216, 255, 0.08);

  color: #00d8ff;

  font-size: 22px;

  box-shadow:
    0 0 12px rgba(0, 216, 255, 0.08),
    inset 0 0 10px rgba(0, 216, 255, 0.03);
}

.upload-btn:hover {
  background: rgba(0, 216, 255, 0.16);

  transform: translateY(-1px);
}

/* SEND BUTTON */

.send-btn {
  min-width: 120px;

  background: linear-gradient(135deg, #ff9f43, #ffb15e);

  color: #091016;

  font-weight: 800;

  letter-spacing: 0.12em;

  box-shadow:
    0 0 20px rgba(255, 159, 67, 0.22),
    inset 0 -2px 6px rgba(0, 0, 0, 0.18);
}

.send-btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 0 28px rgba(255, 159, 67, 0.35),
    inset 0 -2px 6px rgba(0, 0, 0, 0.22);
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

  box-shadow: 0 0 20px rgba(0, 216, 255, 0.08);
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

  border-radius: 14px;

  background: rgba(0, 216, 255, 0.06);
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

:deep(.markdown-body) {
  font-family: "Rajdhani", "Noto Sans", sans-serif;

  color: #dff9ff;

  line-height: 1.8;

  font-size: 16px;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4) {
  margin: 18px 0 10px;

  font-family: "Orbitron", "Noto Sans", sans-serif;

  color: #ffffff;

  letter-spacing: 0.06em;

  text-shadow: 0 0 10px rgba(0, 216, 255, 0.18);
}

:deep(.markdown-body h1) {
  font-size: 28px;
}

:deep(.markdown-body h2) {
  font-size: 22px;
}

:deep(.markdown-body h3) {
  font-size: 18px;
}

:deep(.markdown-body p) {
  margin-bottom: 12px;

  color: rgba(230, 251, 255, 0.92);
}

:deep(.markdown-body strong) {
  color: #ffffff;

  font-weight: 700;
}

:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  padding-left: 22px;

  margin-bottom: 14px;
}

:deep(.markdown-body li) {
  margin-bottom: 6px;
}

:deep(.markdown-body blockquote) {
  margin: 14px 0;

  padding: 12px 16px;

  border-left: 3px solid rgba(0, 216, 255, 0.4);

  background: rgba(255, 255, 255, 0.03);

  border-radius: 10px;

  color: rgba(230, 251, 255, 0.82);
}

:deep(.markdown-body code) {
  background: rgba(0, 216, 255, 0.08);

  color: #7ee7ff;

  padding: 3px 7px;

  border-radius: 6px;

  font-size: 14px;

  font-family: "JetBrains Mono", monospace;
}

:deep(.markdown-body pre) {
  overflow-x: auto;

  padding: 16px;

  border-radius: 14px;

  background: rgba(0, 0, 0, 0.42);

  border: 1px solid rgba(0, 216, 255, 0.08);

  box-shadow: inset 0 0 20px rgba(0, 216, 255, 0.03);
}

:deep(.markdown-body pre code) {
  background: transparent;

  padding: 0;

  color: #dff9ff;
}

:deep(.markdown-body a) {
  color: #5de2ff;

  text-decoration: none;
}

:deep(.markdown-body a:hover) {
  text-decoration: underline;
}

/* LOADER */

.loader {
  width: 18px;
  height: 18px;

  border-radius: 50%;

  display: inline-block;

  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: black;

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
