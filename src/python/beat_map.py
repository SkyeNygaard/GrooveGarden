import essentia
import essentia.standard as es
import numpy as np
import os
import json
#  cd /mnt/c/Users/Skye/Downloads/Programming/GrooveGarden/src/python/
#  source ~/venv/bin/activate
#  python beat_map.py


def detect_beats(audio_path):
  """
  Detect the BPM and beat timings of an audio file using essentia's RhythmExtractor

  Args:
      audio_path (str): Path to the audio file

  Returns:
      tuple: (bpm, beat_times in milliseconds)
  """
  try:
    # Load the audio file
    audio = es.MonoLoader(filename=audio_path)()

    # Use RhythmExtractor for beat detection
    rhythm_extractor = es.RhythmExtractor2013()
    bpm, beats, beats_confidence, _, beats_intervals = rhythm_extractor(audio)

    # Convert beat times to milliseconds
    beat_times_ms = [int(beat * 1000) for beat in beats]

    return float(bpm), beat_times_ms

  except Exception as e:
    print(f"Error processing {audio_path}: {str(e)}")
    return None, None


def process_directory(
  music_dir="../../public/songs", output_dir="../../public/beatmaps"
):
  """
  Process all audio files in a directory and create individual beat map files

  Args:
      music_dir (str): Directory containing music files
      output_dir (str): Directory to save beat maps
  """
  # Create output directory if it doesn't exist
  os.makedirs(output_dir, exist_ok=True)

  # Supported audio formats
  audio_extensions = (".mp3", ".wav", ".ogg")

  for filename in os.listdir(music_dir):
    if filename.lower().endswith(audio_extensions):
      file_path = os.path.join(music_dir, filename)
      output_filename = os.path.splitext(filename)[0] + ".json"
      output_path = os.path.join(output_dir, output_filename)

      print(f"Processing {filename}...")
      bpm, beat_times = detect_beats(file_path)

      if bpm is not None and beat_times is not None:
        # Create beat map data in the same format as crushcrushcrush.json
        beat_data = {"filename": filename, "bpm": bpm, "beats": beat_times}

        # Save to individual JSON file
        with open(output_path, "w") as f:
          json.dump(beat_data, f, indent="\t")

        print(f"{filename}: {bpm:.1f} BPM, {len(beat_times)} beats")
        print(f"Beat map saved to {output_path}")


if __name__ == "__main__":
  process_directory()
