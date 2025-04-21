import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Play, Sparkles } from "lucide-react";
import { saveFile, getImageBlob, generatePlaceholderImage, createMockVideoBlob, createTextFileUrl } from "./utils/FileUtils";

export type MessageRole = "user" | "assistant";
export type ContentType = "text" | "image" | "video" | "code" | "game";

export interface ChatMessageProps {
  role: MessageRole;
  content: string;
  contentType: ContentType;
  aiName?: string;
  aiAvatar?: string;
  timestamp?: string;
  gameUrl?: string;
}

export const ChatMessage = ({
  role,
  content,
  contentType,
  aiName = "ИИ",
  aiAvatar = "/placeholder.svg",
  timestamp = new Date().toLocaleTimeString(),
  gameUrl,
}: ChatMessageProps) => {
  const isUser = role === "user";
  const [savedState, setSavedState] = useState<"idle" | "saving" | "saved">("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(
    contentType === "image" ? generatePlaceholderImage(640, 480, content) : null
  );
  
  const handleSaveImage = async () => {
    if (!imageUrl) return;
    
    try {
      setSavedState("saving");
      const blob = await fetch(imageUrl).then(r => r.blob());
      await saveFile(blob, `generated-image-${Date.now()}.png`);
      setSavedState("saved");
      setTimeout(() => setSavedState("idle"), 2000);
    } catch (error) {
      console.error("Error saving image:", error);
      setSavedState("idle");
    }
  };
  
  const handleSaveVideo = async () => {
    try {
      setSavedState("saving");
      const videoBlob = await createMockVideoBlob(content);
      await saveFile(videoBlob, `generated-video-${Date.now()}.webm`);
      setSavedState("saved");
      setTimeout(() => setSavedState("idle"), 2000);
    } catch (error) {
      console.error("Error saving video:", error);
      setSavedState("idle");
    }
  };
  
  const handleSaveCode = async () => {
    try {
      setSavedState("saving");
      const fileName = content.includes("class") || content.includes("function") 
        ? "script.js" 
        : "code.txt";
      
      const fileUrl = createTextFileUrl(content);
      const blob = await fetch(fileUrl).then(r => r.blob());
      await saveFile(blob, fileName);
      setSavedState("saved");
      setTimeout(() => setSavedState("idle"), 2000);
    } catch (error) {
      console.error("Error saving code:", error);
      setSavedState("idle");
    }
  };

  return (
    <div className={cn("flex w-full gap-3 my-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-accent rounded-full">
          <img src={aiAvatar} alt={aiName} className="h-full w-full object-cover" />
        </Avatar>
      )}
      
      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
          <span>{isUser ? "Вы" : aiName}</span>
          <span>{timestamp}</span>
        </div>
        
        <Card className={cn(
          "p-3 rounded-xl shadow-md",
          isUser ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"
        )}>
          {contentType === "text" && <div className="whitespace-pre-wrap">{content}</div>}
          
          {contentType === "image" && (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <img 
                  src={imageUrl || generatePlaceholderImage(640, 480, content)} 
                  alt="Generated" 
                  className="rounded-md w-full max-w-sm object-cover"
                />
                <div className="absolute bottom-2 right-2 text-xs font-semibold text-white opacity-50">
                  HGPT Pro
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="self-end" 
                onClick={handleSaveImage}
                disabled={savedState === "saving"}
              >
                {savedState === "idle" && <Download className="mr-1 h-4 w-4" />}
                {savedState === "saving" && <Sparkles className="mr-1 h-4 w-4 animate-spin" />}
                {savedState === "saved" && <CheckCircle className="mr-1 h-4 w-4 text-green-500" />}
                {savedState === "idle" && "Сохранить"}
                {savedState === "saving" && "Сохранение..."}
                {savedState === "saved" && "Сохранено!"}
              </Button>
            </div>
          )}
          
          {contentType === "video" && (
            <div className="flex flex-col gap-2">
              <div className="relative bg-muted rounded-md w-full max-w-sm aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-md flex items-center justify-center">
                  <Play className="h-12 w-12 text-white/80" />
                </div>
                <span className="text-muted-foreground z-10">{content}</span>
                <div className="absolute bottom-2 right-2 text-xs font-semibold text-white opacity-50">
                  HGPT Pro
                </div>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="self-end"
                onClick={handleSaveVideo}
                disabled={savedState === "saving"}
              >
                {savedState === "idle" && <Download className="mr-1 h-4 w-4" />}
                {savedState === "saving" && <Sparkles className="mr-1 h-4 w-4 animate-spin" />}
                {savedState === "saved" && <CheckCircle className="mr-1 h-4 w-4 text-green-500" />}
                {savedState === "idle" && "Сохранить"}
                {savedState === "saving" && "Сохранение..."}
                {savedState === "saved" && "Сохранено!"}
              </Button>
            </div>
          )}
          
          {contentType === "code" && (
            <div className="flex flex-col gap-2">
              <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs">
                <code>{content}</code>
              </pre>
              <div className="flex gap-2 self-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSaveCode}
                  disabled={savedState === "saving"}
                >
                  {savedState === "idle" && <Download className="mr-1 h-4 w-4" />}
                  {savedState === "saving" && <Sparkles className="mr-1 h-4 w-4 animate-spin" />}
                  {savedState === "saved" && <CheckCircle className="mr-1 h-4 w-4 text-green-500" />}
                  {savedState === "idle" && "Скрипт"}
                  {savedState === "saving" && "Сохранение..."}
                  {savedState === "saved" && "Сохранено!"}
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="mr-1 h-4 w-4" /> Запустить
                </Button>
              </div>
            </div>
          )}
          
          {contentType === "game" && (
            <div className="flex flex-col gap-2">
              <div className="relative bg-muted rounded-md w-full max-w-sm aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-md flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-white/80" />
                </div>
                <span className="text-muted-foreground z-10">Игра готова к запуску</span>
                <div className="absolute bottom-2 right-2 text-xs font-semibold text-white opacity-50">
                  HGPT Pro
                </div>
              </div>
              <div className="flex gap-2 self-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (gameUrl) {
                      window.open(gameUrl, '_blank');
                    }
                  }}
                  disabled={!gameUrl}
                >
                  <Download className="mr-1 h-4 w-4" /> Скачать
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    if (gameUrl) {
                      window.open(gameUrl, '_blank');
                    }
                  }}
                  disabled={!gameUrl}
                >
                  <Play className="mr-1 h-4 w-4" /> Играть
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-accent rounded-full">
          <span className="text-xs">Вы</span>
        </Avatar>
      )}
    </div>
  );
};
