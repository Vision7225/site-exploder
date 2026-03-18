import { motion } from "framer-motion";
import { File, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  children?: FileNode[];
}

interface FileTreeProps {
  tree: FileNode[];
  onFileSelect: (path: string) => void;
  selectedFile?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}b`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}kb`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}mb`;
}

function TreeNode({ node, depth, onFileSelect, selectedFile, index }: {
  node: FileNode;
  depth: number;
  onFileSelect: (path: string) => void;
  selectedFile?: string;
  index: number;
}) {
  const [open, setOpen] = useState(true);
  const isSelected = selectedFile === node.path;
  const isHtml = node.name.endsWith(".html");

  return (
    <motion.div
      initial={{ opacity: 0, x: 2 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25, ease: [0.2, 0, 0, 1] }}
    >
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded-md group cursor-default transition-colors ${
          isSelected ? "bg-accent/10 text-accent" : "hover:bg-secondary"
        } ${isHtml ? "cursor-pointer" : ""}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (node.type === "directory") setOpen(!open);
          else if (isHtml) onFileSelect(node.path);
        }}
      >
        {node.type === "directory" ? (
          open ? <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" /> : <Folder className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <File className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
        <span className="truncate text-xs font-mono">{node.name}</span>
        {node.size !== undefined && (
          <span className="ml-auto text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity tabular-nums shrink-0">
            {formatSize(node.size)}
          </span>
        )}
      </div>
      {node.type === "directory" && open && node.children?.map((child, i) => (
        <TreeNode key={child.path} node={child} depth={depth + 1} onFileSelect={onFileSelect} selectedFile={selectedFile} index={i} />
      ))}
    </motion.div>
  );
}

export default function FileTree({ tree, onFileSelect, selectedFile }: FileTreeProps) {
  return (
    <aside className="bg-card border-r border-border flex flex-col h-screen">
      <header className="p-4 border-b border-border">
        <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Contents</span>
      </header>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {tree.map((node, i) => (
          <TreeNode key={node.path} node={node} depth={0} onFileSelect={onFileSelect} selectedFile={selectedFile} index={i} />
        ))}
      </div>
    </aside>
  );
}
