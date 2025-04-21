import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generatePlaceholderImage } from "./utils/FileUtils";
import { AIModel, AICapability } from "./AISelector";

interface CreateAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAI: (model: AIModel) => void;
}

const capabilityOptions: { id: AICapability; label: string }[] = [
  { id: "text", label: "Текст" },
  { id: "image", label: "Изображения" },
  { id: "video", label: "Видео" },
  { id: "code", label: "Код" },
  { id: "game", label: "Игры" },
];

export const CreateAIModal = ({
  open,
  onOpenChange,
  onCreateAI,
}: CreateAIModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("");
  const [capabilities, setCapabilities] = useState<AICapability[]>(["text"]);
  const [avatar, setAvatar] = useState("");

  const handleCapabilityToggle = (capability: AICapability) => {
    setCapabilities((prev) =>
      prev.includes(capability)
        ? prev.filter((cap) => cap !== capability)
        : [...prev, capability]
    );
  };

  const handleCreateAI = () => {
    if (!name.trim()) return;

    // Создаем персонализированный аватар
    const aiAvatar = avatar || generatePlaceholderImage(100, 100, name);

    // Создаем модель нейросети
    const newModel: AIModel = {
      id: `custom-${Date.now()}`,
      name,
      description: description || `Персонализированная нейросеть "${name}"`,
      capabilities:Я создам улучшенную верс capabilities.length > 0 ?ию чата с ИИ, где генерация игр, изображений capabilities : ["text"],
      avatar: aiAvatar,
    };

    onCreateAI(newModel);
    onOpen и видео будет работать по вашимChange(false);
    resetForm();
  }; запросам с возможностью сох

  const resetForm = () => {
    setName("");
    setDescription("");ранения и использования на устройстве.
    setPersonality("");
    setCapabilities(["text"]);
    setAvatar("");
  };

  const handleCan

<pp-code>
<pp-filepathcel = () => {
    resetForm();
    on>src/components/ChatContainer.tsx</pp-OpenChange(false);
  };

  const generateRandomName = () => {filepath>
<pp-content>import { useState, useRef, useEffect } from
    const prefixes = ["Н "react";
import { Send, Brain, Image, Video,ейро", "Ассистент", " Gamepad2, Code, Sparkles } fromПомощник", "Гений", "Мыслитель", "Творец", "lucide-react";
import { Button "Эксперт"];
    const suffixes = ["GP } from "@/components/ui/button";
import { Textarea } from "@/components/ui/T", "AI", "X", "Pro", "Plus", "Ультра", "Max",textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } "Mind"];
    
    const randomPrefix = from "@/components/ui/tabs"; prefixes[Math.floor(Math.random
import { Separator } from "@/() * prefixes.length)];
    components/ui/separator";
import { Chatconst randomSuffix = suffixes[Math.floor(Math.random() * suffixesMessage, ChatMessageProps } from "./ChatMessage";
import { AISelector,.length)];
    
    setName(`${randomPrefix AIModel } from "./AISelector";
import}${randomSuffix}`);
  }; { CreateAIModal } from

  return (
    <Dialog open={ "./CreateAIModal";
import { generateopen} onOpenChange={onOpenChange}>
      <DialogContent className="smPlaceholderImage, createM:max-w-[500px]">ockVideoBlob } from "./utils/
        <DialogHeader>
          <DialogTitleFileUtils";
import { generate>Создать персональную нейросеть</DialogTitle>
          <DialogDescription>
            Настройте характGame, createGameUrl, extractер и возможности вашей персональной нейросети
          </DialogGameCodeSnippet, analyDescription>
        </DialogHeader>zeGameRequest } from "./utils/

        <div className="grid gap-4 py-4">
          <div className="GameGenerator";

// Keyworgrid gap-2">
            <Label htmlFor="name"d patterns for content recognition
const PATTERNS = {
  IMAGE:  className="flex justify-between items-center">
              /(картинк|изИмя нейросети
              <Buttonображени|нарису|ф 
                variant="ghost" 
                size="sm" 
                classNameото|рисунок)/i,
  VIDEO: /(видео|ролик|клип="h-7 px-2 text-xs" 
                onClick={|анимаци)/i,generateRandomName}
              >
                
  GAME: /(игр|аркад|головСгенерировать
              </Button>оломк|платформер
            </Label>
            <Input
              id="name")/i,
  CODE
              value={name}
              onChange={(: /(код|скрипт|программe) => setName(e.target.value)}
              placeholder="Например: Твор|функци)/i
};

constец, Помощник, Г initialAIModel: AIModel =ПТ-макс"
            />
          </div {
  id: "gpt4",
  name: ">

          <div className="grid gap-2">
            <Label htmlFor="description">Умник",
  description: "СовОписание</Label>
            <Input
              id="description"
              value={ершенная текстовая модельdescription}
              onChange={(e) => set для общения и создания контента",Description(e.target.value)}
              
  capabilities: ["text",placeholder="Например: Экспертная система для обработки данных"
            />
           "code", "image", "video", "game"],</div>

          <div className="grid gap-2">
            <Label htmlFor
  avatar: "/placeholder.svg="personality">Личность и характер ("
};

const defaultMessages: ChatMessagePropsнеобязательно)</Label>
            [] = [
  {
    role: "assistant",
    content:<Textarea
              id="personality"
              value={personality}
              onChange={(e) => "Привет! Я  setPersonality(e.target.value)}ИИ-ассистент.
              placeholder="Например: Дружелюбный, позитивный, с Могу создать для вас изображения, видео, игры или код тонким чувством юмора. Просто опишите, что в"
              className="resize-none minы хотите!",
    contentType-h-[80px]"
            : "text",
    aiName: "/>
          </div>

          <divУмник",
    aiAvatar: className="grid gap-2">
             "/placeholder.svg",
    timestamp: new Date().toLocaleTimeString()
  <Label>Возможности</Label>
            <div className="grid grid-cols-2}
];

export const ChatContainer = () => gap-2">
              {capabil {
  const [messages, setMessages] =ityOptions.map((option) => ( useState<ChatMessageProps[]>(defaultMessages);
                <div key={option.id} className="flex items
  const [input, setInput] =-center space-x-2"> useState("");
  const [selectedAI, setSelecte
                  <Checkbox
                    idAI] = useState<AIModel>(initialAd={`capability-${option.id}`}
                    IModel);
  const [createAIOpen, setchecked={capabilities.includes(option.id)}CreateAIOpen] = useState(false);
                    onCheckedChange={()
  const [selectedTab, setSelectedTab => handleCapabilityToggle(option.] = useState("chat");
  const [id)}
                  />
                  isGenerating, setIsGenerating] = useState(false);
  const mess<Label
                    htmlFor={`capability-${optionagesEndRef = useRef<HTMLDiv.id}`}
                    className="textElement>(null);

  use-sm font-normal"
                  >Effect(() => {
    mess
                    {option.label}
                agesEndRef.current?.scrollIntoView  </Label>
                </div>({ behavior: "smooth" });
  },
              ))}
            </div>
           [messages]);

  const detect</div>
        </div>

        <DialogFooter>
          <ButtonContentType = (text: string): "text" | "image" | "video" variant="outline" onClick={handleCan | "game" | "code" =>cel}>
            Отмена
           {
    if (PATTERNS.IMAGE</Button>
          <Button onClick={handle.test(text)) return "image";CreateAI} disabled={!name.trim
    if (PATTERNS.VIDEO.test(()}>
            Создать
          text)) return "video";
    if (</Button>
        </DialogFooter>PATTERNS.GAME.test(text))
      </DialogContent>
    </Dialog> return "game";
    if (PATTERNS
  );
};
</pp-content.CODE.test(text)) return "code>
</pp-code>

<pp";
    return "text";
  };-code>
<pp-filepath>src

  const generateImageFromPrompt = (/App.tsx</pp-prompt: string): string => {
    //filepath>
<pp-content>import { Routes, Route } from 'react-router- Extract key details from the prompt
    const keywordsdom';
import Index from './pages/Index = prompt.toLowerCase().split(/\s+';
import NotFound from './pages//);
    const colors = ['NotFound';
import './App.css';красный', 'синий', 'з

function App() {
  return (
    елёный', 'жёлтый<Routes>
      <Route path="/" element={', 'фиолетовый',<Index />} />
      <Route path 'оранжевый',="*" element={<NotFound />} 'чёрный', 'бел />
    </Routes>
  );
}

export default App;
</pp-ый', 'розовый', 'content>
</pp-code>

голубой'];
    const subjects<pp-code>
<pp-filepath> = ['пейзаж', 'портретsrc/pages/Index.tsx</pp-', 'животное', 'городfilepath>
<pp-content>import {', 'море', 'горы', 'лес', 'зак ChatContainer } from "@/components/ChatContainer";

export default function Index() {
  return (ат', 'рассвет', 'космос', 'цветы'];
    <div className="min-h-screen bg
    const styles = ['акварель', '-background text-foreground">
      масло', 'цифровой', <ChatContainer />
    </div>
  );
}
