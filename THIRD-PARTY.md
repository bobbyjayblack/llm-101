# Third-party components

The project license applies to this repository's original application and course material. Downloaded dependencies and models are separate works governed by their respective licenses, including:

- Qwen3-TTS code and model weights: Apache License 2.0. [Official repository](https://github.com/QwenLM/Qwen3-TTS), [VoiceDesign model](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign), [Base model](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-Base).
- PyTorch and torchaudio: see their bundled license and third-party notices. [PyTorch license](https://github.com/pytorch/pytorch/blob/main/LICENSE).
- Hugging Face Transformers and Accelerate: Apache License 2.0. Their package metadata and notices cover dependencies separately.
- Playwright (development and browser verification only): Apache License 2.0. [Official repository](https://github.com/microsoft/playwright).

Model weights and Python environments are downloaded during setup and are not committed here. Preserve their included notices if redistributing them. Setup generates original synthetic narrator references from descriptions; no person's reference recording is supplied or cloned. Ordinary narration reuses these synthetic references through Qwen's Base model.
