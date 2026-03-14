const { exec } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');

function converterParaWav(input, output) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .audioChannels(1)
      .audioFrequency(16000)
      .format('wav')
      .save(output)
      .on('end', resolve)
      .on('error', reject);
  });
}

function transcrever(caminhoOgg) {
  return new Promise(async (resolve, reject) => {

    const caminhoWav = caminhoOgg.replace('.ogg', '.wav');

    try {
      await converterParaWav(caminhoOgg, caminhoWav);

      exec(
        `./audio/whisper.cpp/build/bin/whisper-cli \
         -m ./audio/whisper.cpp/models/ggml-base.bin \
         -f ${caminhoWav} \
         -l pt \
         --no-timestamps`,
        (error, stdout, stderr) => {
          if (error) reject(stderr);
          else resolve(stdout.trim());
        }
      );

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = transcrever;