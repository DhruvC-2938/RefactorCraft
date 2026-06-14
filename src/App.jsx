import { useState, useRef } from 'react';
import Editor from "@monaco-editor/react";
import LandingPage from './components/landingPage';
import FileExplorer from './components/fileExplorer';
import ComplexityScorer from './components/complexityScorer';
import CodeCheckerQueue from './components/codeChecker';
import CodeConnectionMap from './components/codeMap';
import InstantWordChecker from './components/wordChecker';
import RenameHelper from './components/renameHelper';
import FixHistory from './components/fixHistory';
import LoopSafetyNet from './components/loopSafety';
import CodeMapReactFlow from './components/codeMap';
import {
  FolderTree,
  ShieldCheck,
  BarChart3,
  Network,
  Wrench
} from "lucide-react";

export default function App() {
  const [fileSystem, setFileSystem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('explorer');
  const [auditState, setAuditState] = useState({ files: [], scanComplete: false });

  // NEW: Lifted state to keep loop findings alive across tab switches
  const [loopFindings, setLoopFindings] = useState([]);

  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => { editorRef.current = editor; };
  const triggerUndo = () => editorRef.current?.trigger('external', 'undo', null);
  const triggerRedo = () => editorRef.current?.trigger('external', 'redo', null);

  const handleEditorChange = (newValue) => {
    if (!selectedFile) return;
    setSelectedFile(prev => ({ ...prev, content: newValue }));
  };

  const handleSmartRename = (oldWord, newWord) => {
    if (!selectedFile) return;
    const regex = new RegExp(`\\b${oldWord}\\b`, 'g');
    const updatedContent = selectedFile.content.replace(regex, newWord);
    setSelectedFile(prev => ({ ...prev, content: updatedContent }));

    const updateNestedFiles = (nodes) => {
      return nodes.map(node => {
        if (node.name === selectedFile.name) return { ...node, content: updatedContent };
        if (node.children) return { ...node, children: updateNestedFiles(node.children) };
        return node;
      });
    };
    setFileSystem(updateNestedFiles(fileSystem));
  };

  const handleDataReady = (data) => {
    if (!data || data.length === 0) return;
    if (data[0].type) { setFileSystem(data); return; }
    const root = [];
    data.forEach(file => {
      const filePath = file.path || file.filename || file.name;
      const parts = filePath.split('/').filter(Boolean);
      let currentLevel = root;
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        let node = currentLevel.find(n => n.name === part);
        if (!node) {
          node = { name: part, type: isFile ? 'file' : 'folder', ...(isFile ? { content: file.content || "" } : { children: [] }) };
          currentLevel.push(node);
        }
        if (!isFile) currentLevel = node.children;
      });
    });
    setFileSystem(root);
  };

  if (!fileSystem) {
    return <LandingPage onDataReady={handleDataReady} />;
  }

  const renderFeaturePanel = () => {
    switch (activeTab) {
      case 'explorer':
        return (
          <div className="flex flex-col h-full animate-in slide-in-from-left duration-500">
            <InstantWordChecker selectedFile={selectedFile} />
            <div className="mt-4 px-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Project Hierarchy</h3>
              <FileExplorer data={fileSystem} onFileSelect={setSelectedFile} />
            </div>
          </div>
        );
      case 'auditor':
        return (
          <div className="h-full animate-in zoom-in-95 duration-300">
            <CodeCheckerQueue
              data={fileSystem}
              onFileSelect={setSelectedFile}
              auditState={auditState}
              setAuditState={setAuditState}
            />
          </div>
        );
      // In App.jsx, inside renderFeaturePanel():
      case 'complexity':
        return (
          <div className="h-full animate-in zoom-in-95 duration-300">
            {/* Pass the lifted state instead of the raw filesystem */}
            <ComplexityScorer
  auditState={auditState}
  onFileSelect={setSelectedFile}
  editorRef={editorRef}
/>
          </div>
        );
      case 'architecture':
        return (
          <div className="h-full flex flex-col animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 bg-white border-b border-slate-100 mb-4 rounded-xl">
              <h3 className="text-xs font-bold text-slate-600">Module Dependency Map</h3>
              <p className="text-[10px] text-slate-400">Visualizing imports from AST analysis</p>
            </div>
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <CodeMapReactFlow data={fileSystem} />
            </div>
          </div>
        );
      case 'refactor':
        return (
          <div className="p-4 flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto h-full">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm shrink-0">
              <h3 className="text-sm font-bold text-slate-700 mb-1">Global Refactoring</h3>
              <p className="text-xs text-slate-400 mb-4">Safely rename variables across boundaries.</p>
              <RenameHelper onRename={handleSmartRename} />
            </div>
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shrink-0">
              <h3 className="text-sm font-bold text-indigo-700 mb-1">History Stack</h3>
              <p className="text-xs text-indigo-400 mb-4">Restore previous editor states.</p>
              <FixHistory onUndo={triggerUndo} onRedo={triggerRedo} />
            </div>
            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shrink-0 flex flex-col min-h-0">
              <h3 className="text-sm font-bold text-rose-700 mb-1">Security Killswitch</h3>
              <p className="text-xs text-rose-400 mb-4">Pre-flight loop detection.</p>
              {/* NEW: Passed the lifted state as props */}
              <LoopSafetyNet
                selectedFile={selectedFile}
                findings={loopFindings}
                onFindingsUpdate={setLoopFindings}
              />
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F8F9FD] text-slate-800 flex flex-col font-sans overflow-hidden antialiased selection:bg-indigo-100">

      <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center">
            <span className="text-white text-sm font-black">R</span>
          </div>
          <h1 className="text-base font-bold tracking-tight text-slate-900">Refactor<span className="text-indigo-600">Craft</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-500">Dhruv C.</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">DS</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">

  <nav className="w-20 bg-white border-r border-slate-100 flex flex-col items-center py-8 gap-8 shrink-0 z-20">
    <NavItem
  icon={<FolderTree size={22} />}
  active={activeTab === 'explorer'}
  onClick={() => setActiveTab('explorer')}
  label="Files"
/>

<NavItem
  icon={<ShieldCheck size={22} />}
  active={activeTab === 'auditor'}
  onClick={() => setActiveTab('auditor')}
  label="Audit"
/>

<NavItem
  icon={<BarChart3 size={22} />}
  active={activeTab === 'complexity'}
  onClick={() => setActiveTab('complexity')}
  label="Stats"
/>

<NavItem
  icon={<Network size={22} />}
  active={activeTab === 'architecture'}
  onClick={() => setActiveTab('architecture')}
  label="Map"
/>

<NavItem
  icon={<Wrench size={22} />}
  active={activeTab === 'refactor'}
  onClick={() => setActiveTab('refactor')}
  label="Tools"
/>
  </nav>

  {activeTab === 'architecture' ? (

    <div className="flex-1 bg-[#0f172a]">
      <CodeConnectionMap data={fileSystem} />
    </div>

  ) : (

    <>
      <aside className="w-[450px] bg-[#FDFDFD] border-r border-slate-100 flex flex-col shrink-0 z-10 overflow-hidden">
        {renderFeaturePanel()}
      </aside>

      <section className="flex-1 flex flex-col min-w-0 bg-white relative z-0">
        <div className="h-16 border-b border-slate-50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📄</span>
            <span className="text-sm font-bold text-slate-700">
              {selectedFile ? selectedFile.name : "Waiting for selection..."}
            </span>
          </div>
        </div>

        <div className="flex-1 p-8">

  <div className="h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-[#1e1e1e] flex flex-col">

    {/* Mac Header */}

    <div className="h-12 bg-[#2d2d2d] border-b border-slate-700 flex items-center px-4 shrink-0">

      <div className="flex items-center gap-2">

        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />

      </div>

      <div className="flex-1 text-center">

        <span className="text-xs text-slate-400 font-medium">
          {selectedFile
            ? selectedFile.name
            : "No File Selected"}
        </span>

      </div>

    </div>

    {/* File Stats */}

    <div className="h-8 bg-[#252526] border-b border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 shrink-0">

      <span>
        {selectedFile?.name || "Waiting..."}
      </span>

      <span>
        {selectedFile?.content
          ? `${selectedFile.content.split('\n').length} lines`
          : ""}
      </span>

    </div>

    {/* Editor */}

    <div className="flex-1">

      {!selectedFile ? (

        <div className="h-full flex items-center justify-center text-slate-500 font-mono">
          Pick a file from the explorer to start crafting.
        </div>

      ) : (

        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          path={selectedFile.name}
          value={selectedFile.content}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{
            minimap: {
              enabled: false
            },

            fontSize: 14,

            fontLigatures: true,

            smoothScrolling: true,

            cursorBlinking: "smooth",

            roundedSelection: true,

            scrollBeyondLastLine: false,

            padding: {
              top: 16,
              bottom: 16
            }
          }}
        />

      )}

    </div>

  </div>

</div>
      </section>
    </>
  )}

</main>

      <footer className="h-10 bg-white border-t border-slate-100 px-8 flex items-center justify-between shrink-0 text-[10px] font-bold text-slate-400 z-30">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Active</span>
        </div>
        <div className="flex gap-6">
          <span className="hover:text-indigo-500 cursor-pointer transition-colors">Documentation</span>
        </div>
      </footer>

    </div>
  );
}

function NavItem({ icon, active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-1 transition-all ${active ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
    >
      <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${active ? 'bg-indigo-50 shadow-inner' : ''}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-tighter ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{label}</span>
      {active && <div className="absolute -left-4 w-1 h-8 bg-indigo-500 rounded-r-full" />}
    </button>
  );
}// redeploy
