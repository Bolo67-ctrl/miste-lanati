import {readFile, writeFile} from "node:fs/promises";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY. Set it in your Codespaces terminal; do not paste it into source code or commit it.");
  process.exit(1);
}

const script = await readFile(new URL("../public/audio/narration-ht.txt", import.meta.url), "utf8");
const narration = script
  .split("\n")
  .filter((line) => line.trim() && !line.startsWith("MISTÈ LANATI") && !line.startsWith("Vwa:") && !line.startsWith("Dire videyo") && !line.startsWith("Pwononse") && !line.trim().startsWith("["))
  .join(" ")
  .replace(/\s+/g, " ")
  .trim();

const model = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({
    contents: [{parts: [{text: `Read the following exactly in Haitian Creole (Kreyòl ayisyen). Use a deep, warm male documentary narrator voice, calm and clear, with natural pacing and short pauses. Do not translate or add words. Text: ${narration}`}]}],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {voiceConfig: {prebuiltVoiceConfig: {voiceName: "Charon"}}}
    }
  })
});

const payload = await response.json();
if (!response.ok) {
  console.error("Gemini TTS request failed:", JSON.stringify(payload, null, 2));
  process.exit(1);
}

const audioPart = payload.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data);
if (!audioPart) {
  console.error("No audio data was returned. Response:", JSON.stringify(payload, null, 2));
  process.exit(1);
}

const pcm = Buffer.from(audioPart.inlineData.data, "base64");
const mime = audioPart.inlineData.mimeType || "";
const sampleRate = Number(mime.match(/rate=(\d+)/)?.[1] || 24000);
const channels = 1;
const bitsPerSample = 16;
const wavHeader = Buffer.alloc(44);
wavHeader.write("RIFF", 0);
wavHeader.writeUInt32LE(36 + pcm.length, 4);
wavHeader.write("WAVE", 8);
wavHeader.write("fmt ", 12);
wavHeader.writeUInt32LE(16, 16);
wavHeader.writeUInt16LE(1, 20);
wavHeader.writeUInt16LE(channels, 22);
wavHeader.writeUInt32LE(sampleRate, 24);
wavHeader.writeUInt32LE(sampleRate * channels * bitsPerSample / 8, 28);
wavHeader.writeUInt16LE(channels * bitsPerSample / 8, 32);
wavHeader.writeUInt16LE(bitsPerSample, 34);
wavHeader.write("data", 36);
wavHeader.writeUInt32LE(pcm.length, 40);

await writeFile(new URL("../public/audio/narration-ht.wav", import.meta.url), Buffer.concat([wavHeader, pcm]));
console.log("Created public/audio/narration-ht.wav");
console.log("Listen to the file before using it; verify the Haitian Creole pronunciation and pacing.");
