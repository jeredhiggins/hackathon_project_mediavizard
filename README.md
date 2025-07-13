# 🧙 Media Vizard: Client-Side Face Redaction for Privacy Protection

**Media Vizard** is a lightweight, privacy-first image redaction tool that runs entirely in the browser—no server required. It’s built to help users quickly and securely redact faces and sensitive metadata from images, especially in high-risk or vulnerable situations such as protests, immigration enforcement zones, and activist documentation.

🌐 **Live Demo:** [https://mediavizard.netlify.app](https://mediavizard.netlify.app)  

🎥 **Demo Video For Hackathon Submission:** [Watch on YouTube](https://www.youtube.com/watch?v=zW8Jz94Y8vg)

😈 **Hackathon project page** : [https://devpost.com/software/media-vizard](https://devpost.com/software/media-vizard)

---

## ✨ Features

- ✅ **100% client-side** image redaction (no uploads, no server processing)
- 🧠 Multi-model AI face detection (MediaPipe, BlazeFace, FaceDetection TF.js)
- 🔍 Toggle between **low**, **medium**, and **high sensitivity**
- 🖼 Manual face tagging for crowds or missed detections
- 👁 Multiple redaction modes: **blur**, **pixelate**, **blackout**
- 🧾 EXIF metadata removal (strips GPS, timestamps, device info)
- 📱 Fully responsive and mobile-friendly
- ⚡ Works offline via PWA caching

---

## 🔧 Built With

- **React** (Vite)
- **TensorFlow.js** & `@tensorflow-models/face-detection`
- **MediaPipe + BlazeFace**
- **TypeScript**
- **Netlify** (for hosting)
- **HTML Canvas API**
- **EXIF.js** (for metadata scrubbing)
- **Vite + Tailwind CSS**

---

## 🛠 Installation & Local Development

1. **Clone this repo**

```bash
git clone https://github.com/jeredhiggins/hackathon_project_mediavizard.git
cd media-vizard
