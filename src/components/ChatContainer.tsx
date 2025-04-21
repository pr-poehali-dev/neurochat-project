import { useState, useRef, useEffect } from "react";
import { Send, Brain, Image, Video, Gamepad2, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";
import { AISelector, AIModel } from "./AISelector";
import { CreateAIModal } from "./CreateAIModal";

const initialAIModel: AIModel = {
  id: "gpt4",
  name: "Умник",
  description: "Совершенная текстовая модель для общения и создания контента",
  capabilities: ["text", "code"],
  avatar: "/placeholder.svg"
};

const defaultMessages: ChatMessageProps[] = [
  {
    role: "assistant",
    content: "Привет! Я ИИ-ассистент. Чем могу помочь?",
    contentType: "text",
    aiName: "Умник",
    aiAvatar: "/placeholder.svg",
    timestamp: new Date().toLocaleTimeString()
  }
];

export const ChatContainer = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(defaultMessages);
  const [input, setInput] = useState("");
  const [selectedAI, setSelectedAI] = useState<AIModel>(initialAIModel);
  const [createAIOpen, setCreateAIOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    // Добавляем сообщение пользователя
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
      contentType: "text",
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Симулируем ответ ИИ-модели
    setTimeout(() => {
      let responseMessage: ChatMessageProps;
      
      if (input.toLowerCase().includes("фото") || input.toLowerCase().includes("картинк")) {
        responseMessage = {
          role: "assistant",
          content: "Вот изображение по вашему запросу:",
          contentType: "image",
          aiName: selectedAI.name,
          aiAvatar: selectedAI.avatar,
          timestamp: new Date().toLocaleTimeString()
        };
      } else if (input.toLowerCase().includes("видео")) {
        responseMessage = {
          role: "assistant",
          content: "Я создал видео по вашему запросу:",
          contentType: "video",
          aiName: selectedAI.name,
          aiAvatar: selectedAI.avatar,
          timestamp: new Date().toLocaleTimeString()
        };
      } else if (input.toLowerCase().includes("игр")) {
        responseMessage = {
          role: "assistant",
          content: "Я разработал игру по вашему запросу. Вы можете запустить её прямо сейчас или скачать.",
          contentType: "game",
          aiName: selectedAI.name,
          aiAvatar: selectedAI.avatar,
          timestamp: new Date().toLocaleTimeString()
        };
      } else if (input.toLowerCase().includes("код") || input.toLowerCase().includes("скрипт")) {
        responseMessage = {
          role: "assistant",
          content: `function createGame() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);
  
  // Game logic
  const player = { x: 100, y: 100, width: 50, height: 50 };
  const obstacles = [];
  
  function gameLoop() {
    // Update game state
    // Render game
    requestAnimationFrame(gameLoop);
  }
  
  gameLoop();
  
  return "Game created successfully!";
}`,
          contentType: "code",
          aiName: selectedAI.name,
          aiAvatar: selectedAI.avatar,
          timestamp: new Date().toLocaleTimeString()
        };
      } else {
        responseMessage = {
          role: "assistant",
          content: `Я понял ваш запрос! ${selectedAI.name} готов помочь вам. Напишите подробнее, что именно вы хотите создать или узнать.`,
          contentType: "text",
          aiName: selectedAI.name,
          aiAvatar: selectedAI.avatar,
          timestamp: new Date().toLocaleTimeString()
        };
      }
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateAI = (newAI: AIModel) => {
    setSelectedAI(newAI);
    // Добавить приветственное сообщение от новой нейросети
    const welcomeMessage: ChatMessageProps = {
      role: "assistant",
      content: `Привет! Я ${newAI.name}, ваша персональная нейросеть. Расскажите, чем я могу вам помочь?`,
      contentType: "text",
      aiName: newAI.name,
      aiAvatar: newAI.avatar,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">АИ-Чат</h1>
        </div>
        
        <div className="w-[200px]">
          <AISelector 
            selectedModel={selectedAI} 
            onSelectModel={setSelectedAI} 
            onCreateCustomAI={() => setCreateAIOpen(true)}
          />
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b px-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span>Чат</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-1">
              <Image className="h-4 w-4" />
              <span>Изображения</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              <span>Видео</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-1">
              <Gamepad2 className="h-4 w-4" />
              <span>Игры</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              <span>Код</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col p-0 m-0">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <Separator />
          
          <div className="p-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Напишите сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] resize-none"
              />
              <Button onClick={handleSendMessage} className="self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <div>
                Доступные команды: создать фото, видео, игру, код
              </div>
              <div className="flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>Powered by {selectedAI.name}</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="images" className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <Image className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Генерация изображений</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              Здесь вы можете создавать и управлять изображениями, сгенерированными нейросетью
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <Video className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Генерация видео</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              Здесь вы можете создавать и управлять видеороликами, созданными нейросетью
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="games" className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Создание игр</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              Здесь вы можете создавать и запускать игры, разработанные нейросетью по вашему описанию
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <Code className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Генерация кода</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              Здесь вы можете создавать и редактировать программный код, сгенерированный нейросетью
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <CreateAIModal 
        open={createAIOpen} 
        onOpenChange={setCreateAIOpen} 
        onCreateAI={handleCreateAI}
      />
    </div>
  );
};
