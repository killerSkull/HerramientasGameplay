<div align="center">

# 🎮 ClipMarker

**Real-time gameplay moment tracking for gaming content creators**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Export](#-export-options) • [Author](#-author)

</div>

---

## 📋 Overview

**ClipMarker** is a lightweight, browser-based tool designed for gaming content creators who need to mark and organize important moments during gameplay sessions. Stop the hassle of manually noting timestamps—ClipMarker does it for you in real-time.

Whether you're streaming, recording Let's Plays, or capturing highlights, ClipMarker helps you:

- ⏱️ **Track moments instantly** with a single click
- 🏷️ **Categorize clips** by type (kills, fails, funny moments, etc.)
- 📝 **Add custom notes** to each marked moment
- 📤 **Export timestamps** ready for YouTube descriptions

---

## ✨ Features

### Core Functionality

| Feature                  | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| **High-Precision Timer** | Accurate session timer with start/pause/reset controls  |
| **One-Click Marking**    | Instantly capture the current timestamp                 |
| **Manual Mode**          | Add clips with custom timestamps at any time            |
| **Clip Categories**      | Organize moments by customizable categories             |
| **Clip Editing**         | Modify timestamps, categories, and notes after creation |
| **Session Management**   | Save and restore previous sessions                      |

### Export Options

- **📋 YouTube Format** — Pre-formatted timestamps ready to paste into video descriptions
- **📦 JSON Export** — Full session data for external tools or backup

### User Experience

- 🎨 **Multiple Themes** — Light, Dark, and custom color schemes
- ⌨️ **Keyboard Shortcuts** — Speed up your workflow
- 🔔 **Notifications** — Visual feedback for all actions
- 📊 **Timeline View** — Visual representation of your marked moments
- 💾 **Auto-Save** — Never lose your work with LocalStorage persistence

---

## 🚀 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm, yarn, or pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/FeresDev/clipmarker.git

# Navigate to the project
cd clipmarker

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📖 Usage

### 1. Start a Session

Enter a session name (e.g., "Fortnite Highlights - Jan 2026") and click **Start** to begin the timer.

### 2. Mark Moments

During gameplay:

- Click any **category button** to mark the current timestamp
- Or enable **Manual Mode** to input specific timestamps

### 3. Manage Your Clips

- **Edit** any clip to modify its timestamp, category, or notes
- **Delete** clips you no longer need
- View all clips in the **Timeline** for a visual overview

### 4. Export & Share

When your session ends:

- Export to **YouTube format** for instant video descriptions
- Export to **JSON** for data backup or external tools

### ⌨️ Keyboard Shortcuts

| Shortcut   | Action                   |
| ---------- | ------------------------ |
| `Space`    | Start/Pause timer        |
| `1-9`      | Quick mark with category |
| `Ctrl + E` | Export panel             |
| `Ctrl + S` | Settings                 |

---

## 📤 Export Options

### YouTube Description Format

```
0:00 - 🎯 Epic Snipe
0:45 - 😂 Funny Fail
1:23 - 🏆 Victory Royale
```

### JSON Structure

```json
{
  "sessionName": "Gaming Session",
  "clips": [
    {
      "id": "uuid-v4",
      "timestamp": 45,
      "category": "kill",
      "note": "Epic Snipe",
      "createdAt": "2026-01-31T04:30:00Z"
    }
  ]
}
```

---

## 🛠️ Tech Stack

| Technology         | Purpose                 |
| ------------------ | ----------------------- |
| **React 19**       | UI Framework            |
| **Vite 7**         | Build Tool & Dev Server |
| **Tailwind CSS 4** | Styling                 |
| **Lucide React**   | Icons                   |
| **LocalStorage**   | Data Persistence        |

---

## 📁 Project Structure

```
clipmarker/
├── src/
│   ├── components/       # React components
│   │   ├── ClipMarker.jsx    # Main application
│   │   ├── Timer.jsx         # Session timer
│   │   ├── ClipsList.jsx     # Clip management
│   │   ├── Timeline.jsx      # Visual timeline
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── config/           # App configuration & themes
│   ├── utils/            # Helper functions
│   └── App.jsx           # Root component
├── public/               # Static assets
└── package.json
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

<div align="center">

**FeresDev**

_Creator & Lead Developer_

[![GitHub](https://img.shields.io/badge/GitHub-FeresDev-181717?style=for-the-badge&logo=github)](https://github.com/FeresDev)

</div>

---

## 📄 License

This project is **free to use**. If you use or modify this project, please give credit to the original creator:

> **Original idea & development by [FeresDev](https://github.com/FeresDev)**

---

<div align="center">

**Made with ❤️ for the gaming content creator community**

⭐ Star this repository if you find it useful!

</div>
