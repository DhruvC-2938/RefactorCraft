import { useState } from 'react';

// The Main Wrapper Component
export default function FileExplorer({ data, onFileSelect }) {
  if (!data) return null;
  
  return (
    <div className="text-sm font-mono text-slate-700 select-none">
      {data.map((item, index) => (
        <FileNode key={index} item={item} onFileSelect={onFileSelect} />
      ))}
    </div>
  );
}

// The Recursive Node Component
function FileNode({ item, onFileSelect }) {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = item.type === 'folder';

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(item);
    }
  };

  return (
    <div className="ml-3 my-0.5">
      <div 
        onClick={handleClick}
        className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-indigo-50 transition-colors ${
          isFolder ? 'font-semibold text-slate-800' : 'text-slate-600 hover:text-indigo-600'
        }`}
      >
        <span className="w-5 text-center text-base">
          {isFolder ? (isOpen ? '📂' : '📁') : '📄'}
        </span>
        <span className="truncate">{item.name}</span>
      </div>
      
      {/* Recursion: If it's an open folder, render another FileExplorer inside it */}
      {isFolder && isOpen && item.children && (
        <div className="border-l border-slate-200 ml-2.5 pl-1.5 mt-0.5">
          <FileExplorer data={item.children} onFileSelect={onFileSelect} />
        </div>
      )}
    </div>
  );
}