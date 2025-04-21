import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ChevronDown, Plus } from "lucide-react";

export type AICapability = "text" | "image" | "video" | "game" | "code";

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  capabilities: AICapability[];
  avatar: string;
}

export const AvailableModels: AIModel[] = [
  {
    id: "gpt4",
    name: "Умник",
    description: "Совершенная текстовая модель для общения и создания контента",
    capabilities: ["text", "code", "image", "video", "game"],
    avatar: "/placeholder.svg",
  },
  {
    id: "stable-diffusion",
    name: "Художник",
    description: "Специализированная модель для создания изображений",
    capabilities: ["text", "image"],
    avatar: "/placeholder.svg",
  },
  {
    id: "video-gen",
    name: "Режиссёр",
    description: "Генерирует видеоролики по вашему описанию",
    capabilities: ["text", "video"],
    avatar: "/placeholder.svg",
  },
  {
    id: "coder",
    name: "Программист",
    description: "Специализируется на написании и анализе кода",
    capabilities: ["text", "code", "game"],
    avatar: "/placeholder.svg",
  }
];

interface AISelectorProps {
  selectedModel: AIModel;
  onSelectModel: (model: AIModel) => void;
  onCreateCustomAI: () => void;
}

export const AISelector = ({
  selectedModel,
  onSelectModel,
  onCreateCustomAI
}: AISelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <img src={selectedModel.avatar} alt={selectedModel.name} />
            </Avatar>
            <span>{selectedModel.name}</span>
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[260px]">
        <DropdownMenuLabel>Выберите модель</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {AvailableModels.map((model) => (
          <DropdownMenuItem
            key={model.id}
            className="flex flex-col items-start py-2 cursor-pointer"
            onClick={() => {
              onSelectModel(model);
              setIsOpen(false);
            }}
          >
            <div className="flex items-center gap-2 w-full">
              <Avatar className="h-8 w-8">
                <img src={model.avatar} alt={model.name} />
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {model.description}
                </div>
              </div>
              {model.id === selectedModel.id && (
                <Badge variant="outline" className="ml-auto">Выбрано</Badge>
              )}
            </div>
            <div className="flex gap-1 mt-2">
              {model.capabilities.includes("text") && (
                <Badge variant="secondary" className="text-xs">Текст</Badge>
              )}
              {model.capabilities.includes("image") && (
                <Badge variant="secondary" className="text-xs">Фото</Badge>
              )}
              {model.capabilities.includes("video") && (
                <Badge variant="secondary" className="text-xs">Видео</Badge>
              )}
              {model.capabilities.includes("game") && (
                <Badge variant="secondary" className="text-xs">Игры</Badge>
              )}
              {model.capabilities.includes("code") && (
                <Badge variant="secondary" className="text-xs">Код</Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => {
            onCreateCustomAI();
            setIsOpen(false);
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Создать свою модель</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
