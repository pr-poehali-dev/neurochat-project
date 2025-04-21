import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle } from "lucide-react";

export type MessageRole = "user" | "assistant";
export type ContentType = "text" | "image" | "video" | "code" | "game";

export interface ChatMessageProps {
  role: MessageRole;
  content: string;
  contentType: ContentType;
  aiName?: string;
  aiAvatar?: string;
  timestamp?: string;
}

export const ChatMessage = ({
  role,
  content,
  contentType,
  aiName = "ИИ",
  aiAvatar = "/placeholder.svg",
  timestamp = new Date().toLocaleTimeString(),
}: ChatMessageProps) => {
  const isUser = role === "user";

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
              <img src="/placeholder.svg" alt="Generated" className="rounded-md w-full max-w-sm object-cover" />
              <Button variant="secondary" size="sm" className="self-end">
                <Download className="mr-1 h-4 w-4" /> Сохранить
              </Button>
            </div>
          )}
          
          {contentType === "video" && (
            <div className="flex flex-col gap-2">
              <div className="bg-muted rounded-md w-full max-w-sm aspect-video flex items-center justify-center">
                <span className="text-muted-foreground">Видео сгенерировано</span>
              </div>
              <Button variant="secondary" size="sm" className="self-end">
                <Download className="mr-1 h-4 w-4" /> Сохранить
              </Button>
            </div>
          )}
          
          {contentType === "code" && (
            <div className="flex flex-col gap-2">
              <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs">
                <code>{content}</code>
              </pre>
              <div className="flex gap-2 self-end">
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" /> Скрипт
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="mr-1 h-4 w-4" /> Запустить
                </Button>
              </div>
            </div>
          )}
          
          {contentType === "game" && (
            <div className="flex flex-col gap-2">
              <div className="bg-muted rounded-md w-full max-w-sm aspect-video flex items-center justify-center">
                <span className="text-muted-foreground">Игра готова к запуску</span>
              </div>
              <div className="flex gap-2 self-end">
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" /> Скачать
                </Button>
                <Button variant="secondary" size="sm">
                  <CheckCircle className="mr-1 h-4 w-4" /> Играть
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
