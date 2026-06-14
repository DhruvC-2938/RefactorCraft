import { useState } from 'react';

export default function LandingPage({ onDataReady }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsProcessing(true);

    try {
      const fileData = await Promise.all(
        files.map(async (file) => {
          const content = await file.text();
          return {
            path: file.webkitRelativePath,
            content: content
          };
        })
      );

      const buildTree = (filesList) => {
        const root = [];

        filesList.forEach(({ path, content }) => {
          if (path.includes('node_modules') || path.includes('.git') || path.includes('dist')) return;

          const parts = path.split('/');
          parts.shift();
          if (parts.length === 0) return;

          let currentLevel = root;

          parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            let existingNode = currentLevel.find(n => n.name === part);

            if (!existingNode) {
              existingNode = {
                name: part,
                type: isFile ? 'file' : 'folder',
                ...(isFile ? { content } : { children: [] })
              };
              currentLevel.push(existingNode);
            }

            if (!isFile) {
              currentLevel = existingNode.children;
            }
          });
        });

        return root;
      };

      const tree = buildTree(fileData);

      setTimeout(() => {
        onDataReady(tree);
      }, 1200);

    } catch (error) {
      console.error("Error parsing files:", error);
      alert("Failed to parse the project directory.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex font-sans">

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 0.85s linear infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        .dot-1 { animation: pulse-dot 1.2s ease-in-out infinite 0s; }
        .dot-2 { animation: pulse-dot 1.2s ease-in-out infinite 0.2s; }
        .dot-3 { animation: pulse-dot 1.2s ease-in-out infinite 0.4s; }
      `}</style>

      {/* LEFT PANEL — Dark */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-zinc-950 p-12 relative overflow-hidden">

        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Top — Brand */}
        <div className="relative z-10">
          <span className="text-white text-xl font-semibold tracking-tight">
            Refactor<span className="text-indigo-400">Craft</span>
          </span>
        </div>

        {/* Middle — Feature list */}
        <div className="relative z-10 space-y-8">
          <p className="text-zinc-400 text-xs uppercase tracking-widest font-medium">What it does</p>
          {[
            { icon: '◫', title: 'Understand your code',    desc: 'Scores every function by complexity and maps how your classes connect — so you always know where the mess is.' },
            { icon: '▦', title: 'Catch problems early',    desc: 'A smart checker queue scans files for bad patterns, naming violations, and infinite loops before they ship.' },
            { icon: '✎', title: 'Refactor with confidence', desc: 'Rename variables across your entire codebase, undo any structural change, and explore files in a clean collapsible view.' },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 items-start">
              <span className="text-indigo-400 text-lg mt-0.5 select-none">{f.icon}</span>
              <div>
                <p className="text-white text-sm font-medium mb-1">{f.title}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom — Footnote */}
        <p className="relative z-10 text-zinc-600 text-xs">
          Files are processed locally. Nothing leaves your machine.
        </p>
      </div>

      {/* RIGHT PANEL — Light */}
      <div className="flex-1 flex items-center justify-center bg-zinc-50 p-8">
        <div className="w-full max-w-md">

          {/* Mobile brand (only visible when left panel is hidden) */}
          <p className="lg:hidden text-zinc-900 text-lg font-semibold tracking-tight mb-8">
            Refactor<span className="text-indigo-500">Craft</span>
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mb-1 tracking-tight">
            Open a project
          </h2>
          <p className="text-zinc-400 text-sm mb-8">
            Upload your codebase to check complexity, detect bad patterns, and get refactor suggestions.
          </p>

          {/* Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center min-h-[360px] transition-all duration-200 ${
              isProcessing
                ? 'border-indigo-200 bg-indigo-50/40 cursor-wait'
                : dragActive
                ? 'border-indigo-400 bg-indigo-50 scale-[1.01]'
                : 'border-zinc-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 cursor-pointer'
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDrop={() => setDragActive(false)}
          >
            <input
              type="file"
              webkitdirectory="true"
              directory="true"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait z-10"
            />

            {isProcessing ? (
              <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-[3px] border-zinc-100" />
                  <div className="spinner absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-700 mb-2">Parsing file tree</p>
                  <div className="flex gap-1.5 justify-center">
                    <span className="dot-1 w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                    <span className="dot-2 w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                    <span className="dot-3 w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                {/* Folder icon — pure SVG, no emoji */}
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={dragActive ? '#6366f1' : '#c4b5fd'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <div>
                  <p className="text-base font-semibold text-zinc-800 mt-1">
                    {dragActive ? 'Drop it here' : 'Click or drag a folder'}
                  </p>
                  <p className="text-sm text-zinc-400 mt-2">
                    Skips{' '}
                    <code className="font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded text-xs">node_modules</code>
                    {', '}
                    <code className="font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded text-xs">.git</code>
                    {', '}
                    <code className="font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded text-xs">dist</code>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Hint row */}
          <div className="flex items-center gap-2 mt-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p className="text-xs text-zinc-400">Processed entirely in your browser</p>
          </div>

        </div>
      </div>
    </div>
  );
}
