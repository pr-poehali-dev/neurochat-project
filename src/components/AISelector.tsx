import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Brain, Image, Video, Gamepad2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: Array<"text" | "image" | "video" | "code" | "game">;
  avatar: string;
}

const predefinedModels: AIModel[] = [
  {
    id: "gpt4",
    name: "Умник",
    description: "Совершенная текстовая модель для общения и создания контента",
    capabilities: ["text", "code"],
    avatar: "/placeholder.svg"
  },
  {
    id: "dalle3",
    name: "Художник",
    description: "Генерирует реалистичные изображения по описанию",
    capabilities: ["text", "image"],
    avatar: "/placeholder.svg"
  },
  {
    id: "midjourney",
    name: "Творец",
    description: "Создает художественные изображения в разных стилях",
    capabilities: ["text", "image"],
    avatar: "/placeholder.svg"
  },
  {
    id: "videogen",
    name: "Режиссер",
    description: "Генерирует короткие видеоролики по текстовому описанию",
    capabilities: ["text", "video"],
    avatar: "/placeholder.svg"
  },
  {
    id: "gamecreator",
    name: "Разработчик",
    description: "Создает простые игры по вашему сценарию",
    capabilities: ["text", "code", "game"],
    avatar: "/placeholder.svg"
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
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <img 
              src={selectedModel.avatar} 
              alt={selectedModel.name} 
              className="h-5 w-5 rounded-full"
            />
            <span>{selectedModel.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Найти нейросеть..." />
          <CommandList>
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandGroup heading="Доступные нейросети">
              {predefinedModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    onSelectModel(model);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <img 
                    src={model.avatar} 
                    alt={model.name} 
                    className="h-6 w-6 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span>{model.name}</span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {model.capabilities.includes("text") && <Brain className="h-3 w-3 text-muted-foreground" />}
                    {model.capabilities.includes("image") && <Image className="h-3 w-3 text-muted-foreground" />}
                    {model.capabilities.includes("video") && <Video className="h-3 w-3 text-muted-foreground" />}
                    {model.capabilities.includes("game") && <Gamepad2 className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <Check
                    className={cn(
                      "ml-1 h-4 w-4",
                      selectedModel.id === model.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Свой ИИ">
              <CommandItem onSelect={onCreateCustomAI}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Создать новую нейросеть</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
