import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AIModel } from "./AISelector";

interface CreateAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAI: (model: AIModel) => void;
}

export const CreateAIModal = ({
  open,
  onOpenChange,
  onCreateAI
}: CreateAIModalProps) => {
  const [newAI, setNewAI] = useState<Partial<AIModel>>({
    id: `custom-${Date.now()}`,
    name: "",
    description: "",
    capabilities: ["text"],
    avatar: "/placeholder.svg"
  });

  const handleCreateAI = () => {
    if (newAI.name) {
      onCreateAI(newAI as AIModel);
      onOpenChange(false);
      setNewAI({
        id: `custom-${Date.now()}`,
        name: "",
        description: "",
        capabilities: ["text"],
        avatar: "/placeholder.svg"
      });
    }
  };

  const capabilities = [
    { id: "text", label: "Текст" },
    { id: "image", label: "Изображения" },
    { id: "video", label: "Видео" },
    { id: "code", label: "Код" },
    { id: "game", label: "Игры" }
  ];

  const toggleCapability = (capability: "text" | "image" | "video" | "code" | "game") => {
    const currentCapabilities = newAI.capabilities || [];
    if (currentCapabilities.includes(capability)) {
      setNewAI({
        ...newAI,
        capabilities: currentCapabilities.filter(c => c !== capability)
      });
    } else {
      setNewAI({
        ...newAI,
        capabilities: [...currentCapabilities, capability]
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать свою нейросеть</DialogTitle>
          <DialogDescription>
            Опишите характер и возможности вашей идеальной нейросети
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Имя
            </Label>
            <Input
              id="name"
              value={newAI.name}
              onChange={(e) => setNewAI({ ...newAI, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Описание
            </Label>
            <Textarea
              id="description"
              value={newAI.description}
              onChange={(e) => setNewAI({ ...newAI, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Возможности
            </Label>
            <div className="col-span-3 space-y-2">
              {capabilities.map((capability) => (
                <div key={capability.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={capability.id}
                    checked={newAI.capabilities?.includes(capability.id as any)}
                    onCheckedChange={() => toggleCapability(capability.id as any)}
                  />
                  <label
                    htmlFor={capability.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {capability.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateAI} disabled={!newAI.name}>Создать нейросеть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
