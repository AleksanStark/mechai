<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

/* mode */
const mode = computed(() =>
  route.path.includes("recommendation") ? "RECOMMENDATION" : "ANALYSIS",
);

/* chat */
const message = ref("");

/* image upload */
const imagePreview = ref<string | null>(null);
const imageFile = ref<File | null>(null);

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const sendMessage = () => {
  if (!message.value && !imageFile.value) return;

  console.log("send:", {
    text: message.value,
    image: imageFile.value,
  });

  message.value = "";
  imageFile.value = null;
  imagePreview.value = null;
};
</script>

<template>
  <section class="chat-page">
    <!-- GRID -->
    <div class="scan-grid"></div>

    <!-- WINDOW -->
    <div class="chat-window hud-frame">
      <!-- HEADER -->
      <div class="chat-header">
        <div class="scan-label">NEURAL CHAT SYSTEM</div>
        <div class="mode">{{ mode }}</div>
      </div>

      <!-- BODY -->
      <div class="chat-body">
        <div class="msg ai">SYSTEM: Cyber Texas AI initialized...</div>

        <div class="msg user">Hello system</div>

        <!-- image preview -->
        <div v-if="imagePreview" class="img-preview">
          <img :src="imagePreview" alt="upload" />
        </div>
      </div>

      <!-- INPUT -->
      <div class="chat-input">
        <!-- file upload -->
        <label class="upload-btn">
          +
          <input type="file" accept="image/*" hidden @change="onFileChange" />
        </label>

        <!-- text input -->
        <input v-model="message" placeholder="TYPE COMMAND..." />

        <!-- send -->
        <button @click="sendMessage">SEND</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── PAGE ── */
.chat-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-deep);
  position: relative;
  overflow: hidden;
}

/* ── GRID (cyber HUD) ── */
.scan-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 216, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 216, 255, 0.04) 1px, transparent 1px);
  background-size: 52px 52px;
  opacity: 0.5;
  filter: blur(0.2px);
}

/* ── WINDOW ── */
.chat-window {
  width: min(780px, 92vw);
  height: 82vh;
  padding: 22px;
  background: linear-gradient(145deg, var(--bg-dark), var(--bg-card));
  border: 1px solid rgba(0, 216, 255, 0.25);
  box-shadow:
    0 0 45px rgba(0, 216, 255, 0.08),
    inset 0 0 25px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
}

/* ── HEADER ── */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.mode {
  font-family: "Share Tech Mono", monospace;
  color: var(--orange);
  font-size: 10px;
  letter-spacing: 0.25em;
}

/* ── BODY ── */
.chat-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding: 10px;
}

/* ── MESSAGES ── */
.msg {
  padding: 10px 14px;
  font-family: "Barlow Condensed", sans-serif;
  max-width: 75%;
  border-left: 2px solid var(--cyan);
  background: rgba(0, 216, 255, 0.06);
}

.user {
  align-self: flex-end;
  border-left: none;
  border-right: 2px solid var(--orange);
  background: rgba(232, 121, 42, 0.08);
}

/* ── IMAGE PREVIEW ── */
.img-preview {
  max-width: 280px;
  border: 1px solid var(--cyan-dim);
  padding: 4px;
  background: rgba(0, 0, 0, 0.3);
}

.img-preview img {
  width: 100%;
  display: block;
}

/* ── INPUT BAR ── */
.chat-input {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  align-items: center;
}

/* file button */
.upload-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Share Tech Mono", monospace;
  border: 1px solid var(--cyan-dim);
  color: var(--cyan);
  cursor: pointer;
  transition: 0.2s;
}

.upload-btn:hover {
  background: rgba(0, 216, 255, 0.1);
}

/* input */
.chat-input input {
  flex: 1;
  background: var(--bg-card2);
  border: 1px solid var(--cyan-dim);
  color: var(--cream);
  padding: 10px;
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 0.1em;
}

/* send */
.chat-input button {
  background: var(--orange);
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 0.15em;
  transition: 0.2s;
}

.chat-input button:hover {
  background: var(--amber);
}
</style>
