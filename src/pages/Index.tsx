import { useState } from "react";
import FileTree, { FileNode } from "@/components/FileTree";
import ExtractorStage from "@/components/ExtractorStage";

const fileTree: FileNode[] = [
  {
    name: "AI (2)",
    path: "AI (2)",
    type: "directory",
    children: [
      {
        name: "fastapi_project",
        path: "AI (2)/fastapi_project",
        type: "directory",
        children: [
          { name: "ai_engine.py", path: "AI (2)/fastapi_project/ai_engine.py", type: "file", size: 248 },
          { name: "database.py", path: "AI (2)/fastapi_project/database.py", type: "file", size: 296 },
          { name: "main.py", path: "AI (2)/fastapi_project/main.py", type: "file", size: 2723 },
          { name: "models.py", path: "AI (2)/fastapi_project/models.py", type: "file", size: 599 },
        ],
      },
      {
        name: "frontend",
        path: "AI (2)/frontend",
        type: "directory",
        children: [
          { name: "audio.html", path: "AI (2)/frontend/audio.html", type: "file", size: 17887 },
          { name: "chatbot.html", path: "AI (2)/frontend/chatbot.html", type: "file", size: 9820 },
          { name: "dashboard.html", path: "AI (2)/frontend/dashboard.html", type: "file", size: 7151 },
          { name: "diary.html", path: "AI (2)/frontend/diary.html", type: "file", size: 9556 },
          { name: "eeg.html", path: "AI (2)/frontend/eeg.html", type: "file", size: 15768 },
          { name: "home.html", path: "AI (2)/frontend/home.html", type: "file", size: 18974 },
          { name: "image.html", path: "AI (2)/frontend/image.html", type: "file", size: 18428 },
          { name: "index.html", path: "AI (2)/frontend/index.html", type: "file", size: 5731 },
          { name: "login.html", path: "AI (2)/frontend/login.html", type: "file", size: 5335 },
          { name: "register.html", path: "AI (2)/frontend/register.html", type: "file", size: 5115 },
          { name: "sleep.html", path: "AI (2)/frontend/sleep.html", type: "file", size: 9726 },
          { name: "text.html", path: "AI (2)/frontend/text.html", type: "file", size: 21620 },
          { name: "video.html", path: "AI (2)/frontend/video.html", type: "file", size: 22706 },
        ],
      },
    ],
  },
];

export default function Index() {
  const [selectedFile, setSelectedFile] = useState<string | undefined>();

  return (
    <div className="grid grid-cols-[280px_1fr] h-screen bg-background text-foreground">
      <FileTree tree={fileTree} onFileSelect={setSelectedFile} selectedFile={selectedFile} />
      <ExtractorStage selectedFile={selectedFile} totalFiles={27} totalSize="175.1 KB" />
    </div>
  );
}
