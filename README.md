<h1 align="center">
   RefactorCraft 🛠️
  </h1>

<p align="center">
   An AI-powered static code analysis and refactoring assistant built with React.
</p>

<p align="center">
  Analyze • Visualize • Refactor • Optimize
</p>

---

## 📖 About The Project

RefactorCraft is a developer-focused code analysis platform that helps users understand and improve codebases through visual insights, complexity scoring, dependency mapping, and intelligent refactoring assistance.

Instead of manually searching through files and dependencies, RefactorCraft automatically scans uploaded projects and provides actionable insights through an interactive workspace.

---

## ✨ Key Features

### 📂 Code File Explorer
- Collapsible folder tree structure
- Fast project navigation
- Tracks file relationships
- Displays project hierarchy visually

### ↩️ Fix History (Undo / Redo)
- Maintains code modification history
- Allows rollback of previous fixes
- Stack-based history management

### 📋 Code Checker Queue
- Processes files in priority order
- Analyzes larger files first
- Detects code quality issues
- Generates actionable refactoring suggestions

### ⚡ Instant Word Checker
- Validates variable names instantly
- Detects invalid naming patterns
- Follows JavaScript naming conventions
- Provides real-time feedback

### 📊 Complexity Scorer
- Ranks functions by difficulty
- Measures:
  - IF Statements
  - Loops
  - Switch Statements
  - Nesting Depth
- Helps identify high-risk code

### 🗺️ Code Connection Map
- Visual dependency graph
- Shows file-to-file imports
- Built using React Flow
- Interactive relationship explorer

### 🔒 Loop Safety Net
- Detects dangerous looping patterns
- Prevents infinite loop execution
- Highlights problematic logic
- Improves application stability

### ✏️ Rename Helper
- Searches variable usage across files
- Validates new names
- Prevents naming conflicts
- Simplifies refactoring
---

## 💻 Tech Stack

This project is built using modern frontend technologies.

| Technology | Purpose |
|------------|----------|
| React | Frontend Framework |
| Vite | Build Tool |
| Tailwind CSS | UI Styling |
| Monaco Editor | Code Editor |
| React Flow | Dependency Graph |
| Framer Motion | Animations |
| JavaScript | Logic Engine |

---

## 📸 Screenshots

### Landing Page 
<img width="1710" height="978" alt="Screenshot 2026-06-14 at 10 58 25 AM" src="https://github.com/user-attachments/assets/560aed04-7ce0-4370-ab4c-97c7ca40006b" />


### File Explorer and Word Checker
<img width="1710" height="988" alt="Screenshot 2026-06-14 at 11 00 56 AM" src="https://github.com/user-attachments/assets/b225ac2a-2d2b-4aa4-b290-b92cf23be88a" />


### Complexity Ranking
<img width="1709" height="982" alt="Screenshot 2026-06-14 at 10 59 29 AM" src="https://github.com/user-attachments/assets/0b952181-4e0d-41dd-96f6-e8c96a99cafc" />


### Dependency Map
<img width="1710" height="981" alt="Screenshot 2026-06-14 at 10 59 53 AM" src="https://github.com/user-attachments/assets/8ea8b6bf-42e5-4138-92c7-72f2796a45f4" />


### Monaco Editor
<img width="1178" height="916" alt="Screenshot 2026-06-14 at 11 00 11 AM" src="https://github.com/user-attachments/assets/788ed580-a684-471d-8933-a79334280371" />


### Checker Queue
<img width="1710" height="981" alt="Screenshot 2026-06-14 at 11 01 12 AM" src="https://github.com/user-attachments/assets/f6779371-e8db-41e4-bdca-11c5b79e742f" />
 
### Fix History / Loop Safety Net / Rename Helper
<img width="1710" height="983" alt="Screenshot 2026-06-14 at 11 02 30 AM" src="https://github.com/user-attachments/assets/be171627-ef1b-4b88-a87c-ef8ceab24ab2" />


---

## 🏗️ Architecture Overview

```text
## 🏗️ Architecture Overview

The application follows a modular component-based architecture.

### 1. Presentation Layer
Responsible for rendering the user interface.

- landingPage.jsx
- fileExplorer.jsx
- codeChecker.jsx
- complexityScorer.jsx
- codeMap.jsx
- renameHelper.jsx
- loopSafety.jsx
- fixHistory.jsx
- wordChecker.jsx

### 2. Analysis Layer
Responsible for code inspection and complexity calculations.

- complexityAnalyzer.js
- Loop Detection Engine
- Rename Validation Engine

### 3. Queue Management Layer
Processes files in priority order.

- codeQueue.js
- codeChecker.jsx

### 4. Visualization Layer
Displays code relationships and complexity rankings.

- complexityScorer.jsx
- codeMap.jsx

### 5. State Management Layer
Maintains application state using React Hooks.

- useState()
- useEffect()

### 6. Editor Layer
Provides source code viewing and navigation.

- Monaco Editor
- Function Navigation System
```

---

## 🚀 Getting Started

### Installation

Clone the repository

```bash
git clone https://github.com/DhruvC-2938/RefactorCraft.git
```

Navigate into the project

```bash
cd RefactorCraft
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 📋 Deliverables Implemented

✅ Project Explorer

✅ Complexity Scorer

✅ Dependency Map

✅ Rename Helper

✅ Checker Queue

✅ Monaco Editor

✅ Loop Safety Net<

✅ Undo/Redo Support

---

## 🌐 Live Demo

Add your Vercel URL here:

```text
https://your-project.vercel.app
```


---

## 📄 License

This project was developed for academic and educational purposes.
