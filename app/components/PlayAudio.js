import { Audio } from "expo-av";

let sound;

// TODO: Add Sound files here and names as key
const audioFiles = {
  drop: require("assets/audio/drop.wav"),
};

//TODO: add fileName like playSound("drop")
async function playSound(filename) {
  try {
    if (sound) {
      await sound.unloadAsync();
    }

    const file = audioFiles[filename];
    if (!file) {
      console.error("Sound file not found:", filename);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(file);
    sound = newSound;
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing sound", error);
  }
}

// Optional: If you want a function to stop the sound
async function stopSound() {
  if (sound) {
    try {
      await sound.stopAsync();
    } catch (error) {
      console.error("Error stopping sound", error);
    }
  }
}

// Optional: If you want a function to unload the sound
async function unloadSound() {
  if (sound) {
    try {
      await sound.unloadAsync();
      sound = null;
    } catch (error) {
      console.error("Error unloading sound", error);
    }
  }
}

export { playSound, stopSound, unloadSound };
