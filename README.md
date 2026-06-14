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
(Add Screenshot)

### File Explorer
(Add Screenshot)

### Complexity Ranking
(Add Screenshot)

### Dependency Map
(Add Screenshot)

### Monaco Editor
(Add Screenshot)

### Rename Helper
(Add Screenshot)

---

## 🏗️ Architecture Overview

```text
Landing Page
      │
      ▼
Project Upload
      │
      ▼
Project Parser
      │
 ┌────┼───────────┐
 ▼    ▼           ▼

Checker Queue   Complexity
                  Ranking

 ▼               ▼
Code Issues    Function Analysis

 └────┬───────────┘
      ▼

Monaco Editor

      ▼

Rename Helper

      ▼

Dependency Map
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
