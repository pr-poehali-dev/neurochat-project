import { useState, useRef, useEffect } from "react";
import { Send, Brain, Image, Video, Gamepad2, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";
import { AISelector, AIModel } from "./AISelector";
import { CreateAIModal } from "./CreateAIModal";
import { generatePlaceholderImage, createMockVideoBlob } from "./utils/FileUtils";
import { generateGame, createGameUrl, extractGameCodeSnippet, analyzeGameRequest } from "./utils/GameGenerator";

// Keyword patterns for content recognition
const PATTERNS = {
  IMAGE: /(картинк|изображени|нарису|фото|рисунок)/i,
  VIDEO: /(видео|ролик|клип|анимаци)/i,
  GAME: /(игр|аркад|головоломк|платформер)/i,
  CODE: /(код|скрипт|программ|функци)/i
};

const initialAIModel: AIModel = {
  id: "gpt4",
  name: "Умник",
  description: "Совершенная текстовая модель для общения и создания контента",
  capabilities: ["text", "code", "image", "video", "game"],
  avatar: "/placeholder.svg"
};

const defaultMessages: ChatMessageProps[] = [
  {
    role: "assistant",
    content: "Привет! Я ИИ-ассистент. Могу создать для вас изображения, видео, игры или код. Просто опишите, что вы хотите!",
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
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectContentType = (text: string): "text" | "image" | "video" | "game" | "code" => {
    if (PATTERNS.IMAGE.test(text)) return "image";
    if (PATTERNS.VIDEO.test(text)) return "video";
    if (PATTERNS.GAME.test(text)) return "game";
    if (PATTERNS.CODE.test(text)) return "code";
    return "text";
  };

  const generateImageFromPrompt = (prompt: string): string => {
    // Extract key details from the prompt
    const keywords = prompt.toLowerCase().split(/\s+/);
    const colors = ['красный', 'синий', 'зелёный', 'жёлтый', 'фиолетовый', 'оранжевый', 'чёрный', 'белый', 'розовый', 'голубой'];
    const subjects = ['пейзаж', 'портрет', 'животное', 'город', 'море', 'горы', 'лес', 'закат', 'рассвет', 'космос', 'цветы'];
    const styles = ['акварель', 'масло', 'цифровой', 'пиксельный', 'реализм', 'абстракция', 'минимализм'];
    
    // Determine image characteristics based on the prompt
    let color = "#9b87f5"; // Default color
    let mainSubject = "";
    let style = "";
    
    for (const word of keywords) {
      if (colors.some(c => word.includes(c))) {
        switch (true) {
          case word.includes('красн'): color = '#ff6b6b'; break;
          case word.includes('син'): color = '#0ea5e9'; break;
          case word.includes('зелён'): color = '#34d399'; break;
          case word.includes('жёлт'): color = '#fcd34d'; break;
          case word.includes('фиолет'): color = '#8b5cf6'; break;
          case word.includes('оранж'): color = '#f97316'; break;
          case word.includes('чёрн'): color = '#1e293b'; break;
          case word.includes('бел'): color = '#f8fafc'; break;
          case word.includes('розов'): color = '#ec4899'; break;
          case word.includes('голуб'): color = '#38bdf8'; break;
        }
      }
      
      for (const subject of subjects) {
        if (word.includes(subject.slice(0, 4))) {
          mainSubject = subject;
          break;
        }
      }
      
      for (const s of styles) {
        if (word.includes(s.slice(0, 4))) {
          style = s;
          break;
        }
      }
    }
    
    // Generate a more complex image based on the analyzed prompt
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, shadeColor(color, -30));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create visual elements based on the subject
    if (mainSubject === 'пейзаж' || mainSubject === 'горы') {
      // Draw mountains
      ctx.fillStyle = shadeColor(color, -50);
      ctx.beginPath();
      ctx.moveTo(0, 350);
      ctx.lineTo(200, 150);
      ctx.lineTo(300, 250);
      ctx.lineTo(400, 100);
      ctx.lineTo(500, 200);
      ctx.lineTo(640, 300);
      ctx.lineTo(640, 480);
      ctx.lineTo(0, 480);
      ctx.closePath();
      ctx.fill();
      
      // Sun/moon
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(520, 120, 60, 0, Math.PI * 2);
      ctx.fill();
    } else if (mainSubject === 'море' || mainSubject === 'вода') {
      // Draw water
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, 240, canvas.width, 240);
      
      // Waves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 250 + i * 20);
        for (let x = 0; x < canvas.width; x += 20) {
          ctx.lineTo(x, 250 + i * 20 + Math.sin(x / 30) * 5);
        }
        ctx.stroke();
      }
    } else if (mainSubject === 'космос') {
      // Draw stars
      ctx.fillStyle = 'white';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.fillRect(x, y, size, size);
      }
      
      // Planet
      ctx.fillStyle = shadeColor(color, 30);
      ctx.beginPath();
      ctx.arc(400, 240, 100, 0, Math.PI * 2);
      ctx.fill();
      
      // Planet rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(400, 240, 150, 30, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();
    } else if (mainSubject === 'животное') {
      // Simple animal silhouette
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      // Head
      ctx.beginPath();
      ctx.arc(320, 200, 80, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.beginPath();
      ctx.moveTo(260, 150);
      ctx.lineTo(280, 100);
      ctx.lineTo(300, 150);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(340, 150);
      ctx.lineTo(360, 100);
      ctx.lineTo(380, 150);
      ctx.fill();
      // Body
      ctx.beginPath();
      ctx.ellipse(320, 330, 100, 70, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(290, 190, 15, 0, Math.PI * 2);
      ctx.arc(350, 190, 15, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Apply style effects
    if (style === 'пиксельный') {
      // Pixelate the image
      const pixelSize = 10;
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let y = 0; y < canvas.height; y += pixelSize) {
          for (let x = 0; x < canvas.width; x += pixelSize) {
            const imageData = tempCtx.getImageData(x, y, 1, 1).data;
            ctx.fillStyle = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
    } else if (style === 'акварель') {
      // Watercolor effect
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 5; i++) {
        ctx.drawImage(canvas, Math.random() * 10 - 5, Math.random() * 10 - 5);
      }
      ctx.globalAlpha = 1;
    }
    
    // Add text describing the image
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    let description = prompt;
    if (description.length > 60) {
      description = description.substring(0, 60) + '...';
    }
    ctx.fillText(description, canvas.width / 2, canvas.height - 20);
    
    // Add HGPT Pro watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('HGPT Pro', canvas.width - 20, canvas.height - 20);
    
    return canvas.toDataURL('image/png');
  };
  
  // Helper function to shade colors
  const shadeColor = (color: string, percent: number): string => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.round(R * (100 + percent) / 100);
    G = Math.round(G * (100 + percent) / 100);
    B = Math.round(B * (100 + percent) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    R = R > 0 ? R : 0;
    G = G > 0 ? G : 0;
    B = B > 0 ? B : 0;

    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
  };

  const generateResponseForContentType = async (text: string, contentType: string): Promise<ChatMessageProps> => {
    setIsGenerating(true);
    let responseMessage: ChatMessageProps;
    
    try {
      switch (contentType) {
        case "image":
          // Analyze the request to determine image details
          const imageDescription = text.replace(PATTERNS.IMAGE, "").trim();
          const imageUrl = generateImageFromPrompt(imageDescription || text);
          
          responseMessage = {
            role: "assistant",
            content: imageDescription || "Вот изображение по вашему запросу",
            contentType: "image",
            aiName: selectedAI.name,
            aiAvatar: selectedAI.avatar,
            timestamp: new Date().toLocaleTimeString()
          };
          break;
          
        case "video":
          // Analyze the request to determine video details
          const videoDescription = text.replace(PATTERNS.VIDEO, "").trim();
          
          responseMessage = {
            role: "assistant",
            content: videoDescription || "Созданное видео по вашему запросу",
            contentType: "video",
            aiName: selectedAI.name,
            aiAvatar: selectedAI.avatar,
            timestamp: new Date().toLocaleTimeString()
          };
          break;
          
        case "game":
          // Generate actual playable game HTML
          const gameHtml = generateGame(text);
          const gameUrl = createGameUrl(gameHtml);
          
          // Analyze the game request to provide a more descriptive response
          const gameAnalysis = analyzeGameRequest(text);
          let gameType = "Аркадная игра";
          
          if (gameAnalysis.template === "puzzle") {
            gameType = "Головоломка";
          } else if (gameAnalysis.template === "platformer") {
            gameType = "Платформер";
          }
          
          responseMessage = {
            role: "assistant",
            content: `Я создал ${gameType.toLowerCase()} по вашему запросу "${text}". Вы можете запустить её прямо сейчас или скачать для игры позже.`,
            contentType: "game",
            aiName: selectedAI.name,
            aiAvatar: selectedAI.avatar,
            timestamp: new Date().toLocaleTimeString(),
            gameUrl: gameUrl
          };
          break;
          
        case "code":
          // Analyze the request to determine code requirements
          const codeRequest = text.toLowerCase();
          let codeSample = "";
          
          if (codeRequest.includes('игр')) {
            codeSample = `// Создание простой браузерной игры
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Настройка игры
const game = {
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e'
};

// Игрок
const player = {
  x: game.width / 2,
  y: game.height - 50,
  width: 50,
  height: 50,
  color: '#9b87f5',
  speed: 5,
  dx: 0
};

// Управление
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') player.dx = -player.speed;
  if (e.key === 'ArrowRight') player.dx = player.speed;
});

document.addEventListener('keyup', function(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// Игровой цикл
function gameLoop() {
  // Очистка холста
  ctx.fillStyle = game.backgroundColor;
  ctx.fillRect(0, 0, game.width, game.height);
  
  // Обновление позиции игрока
  player.x += player.dx;
  
  // Отрисовка игрока
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  requestAnimationFrame(gameLoop);
}

// Запуск игры
gameLoop();`;
          } else if (codeRequest.includes('сайт') || codeRequest.includes('страниц')) {
            codeSample = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Мой сайт</title>
  <style>
    :root {
      --primary: #9b87f5;
      --background: #1a1a2e;
      --text: #ffffff;
      --accent: #7e69ab;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      background-color: var(--background);
      color: var(--text);
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    
    header {
      background-color: var(--primary);
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    
    .nav-links a {
      color: var(--text);
      text-decoration: none;
      transition: opacity 0.3s;
    }
    
    .nav-links a:hover {
      opacity: 0.8;
    }
    
    main {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 2rem;
    }
    
    .hero {
      text-align: center;
      padding: 3rem 0;
    }
    
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .button {
      display: inline-block;
      background-color: var(--primary);
      color: var(--text);
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }
    
    .feature-card {
      background-color: rgba(255,255,255,0.05);
      border-radius: 8px;
      padding: 1.5rem;
      transition: transform 0.3s;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
    }
    
    footer {
      background-color: rgba(0,0,0,0.2);
      text-align: center;
      padding: 1.5rem;
      margin-top: 3rem;
    }
    
    .watermark {
      position: fixed;
      bottom: 10px;
      right: 10px;
      opacity: 0.3;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <div class="logo">МойСайт</div>
      <div class="nav-links">
        <a href="#">Главная</a>
        <a href="#">О нас</a>
        <a href="#">Услуги</a>
        <a href="#">Контакты</a>
      </div>
    </nav>
  </header>
  
  <main>
    <section class="hero">
      <h1>Добро пожаловать на наш сайт</h1>
      <p>Мы создаём инновационные решения для ваших задач</p>
      <a href="#" class="button">Узнать больше</a>
    </section>
    
    <section class="features">
      <div class="feature-card">
        <h2>Первое преимущество</h2>
        <p>Описание первого преимущества вашего продукта или услуги. Расскажите, почему это важно.</p>
      </div>
      <div class="feature-card">
        <h2>Второе преимущество</h2>
        <p>Описание второго преимущества вашего продукта или услуги. Расскажите, почему это важно.</p>
      </div>
      <div class="feature-card">
        <h2>Третье преимущество</h2>
        <p>Описание третьего преимущества вашего продукта или услуги. Расскажите, почему это важно.</p>
      </div>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2023 МойСайт. Все права защищены.</p>
  </footer>
  
  <div class="watermark">HGPT Pro</div>
  
  <script>
    // Простой скрипт для анимации
    document.addEventListener('DOMContentLoaded', function() {
      const featureCards = document.querySelectorAll('.feature-card');
      
      // Добавляем анимацию появления
      featureCards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        }, index * 200);
      });
    });
  </script>
</body>
</html>`;
          } else {
            codeSample = `function ${text.includes('функци') ? 'processData' : 'analyzeText'}(input) {
  // Проверяем входные данные
  if (!input || typeof input !== 'string') {
    throw new Error('Ожидается непустая строка');
  }
  
  // Обработка данных
  const result = {
    wordCount: input.split(/\\s+/).filter(Boolean).length,
    charCount: input.length,
    withoutSpaces: input.replace(/\\s+/g, '').length,
    sentences: input.split(/[.!?]+/).filter(Boolean).length
  };
  
  // Дополнительный анализ
  result.averageWordLength = result.wordCount 
    ? (result.withoutSpaces / result.wordCount).toFixed(2) 
    : 0;
    
  console.log('Анализ выполнен успешно');
  return result;
}`;
          }
          
          responseMessage = {
            role: "assistant",
            content: codeSample,
            contentType: "code",
            aiName: selectedAI.name,
            aiAvatar: selectedAI.avatar,
            timestamp: new Date().toLocaleTimeString()
          };
          break;
          
        default: // text
          // Generate contextual text response based on the AI personality
          let textResponse = '';
          
          // Determine if the request contains greetings
          if (text.toLowerCase().includes('привет') || text.toLowerCase().includes('здравствуй')) {
            textResponse = `Привет! Я ${selectedAI.name}, ваш личный ИИ-помощник. Чем могу быть полезен сегодня?`;
          } 
          // Determine if it's a question about capabilities
          else if (text.toLowerCase().includes('что ты умеешь') || text.toLowerCase().includes('как ты работаешь')) {
            textResponse = `Я могу создавать различный контент по вашему запросу:
- Изображения (напишите "создай картинку ...")
- Видео (напишите "сгенерируй видео ...")
- Игры (напишите "создай игру ...")
- Код (напишите "напиши код для ...")

Все созданные файлы вы можете сохранить на своё устройство.`;
          }
          // Questions about the AI itself
          else if (text.toLowerCase().includes('кто ты') || text.toLowerCase().includes('расскажи о себе')) {
            textResponse = `Я ${selectedAI.name}, продвинутая нейросеть, созданная для помощи в генерации различного контента. Я могу создавать изображения, видео, игры и писать код. Мои возможности постоянно расширяются!`;
          }
          // Default response
          else {
            textResponse = `Я понял ваш запрос! Чтобы я мог помочь эффективнее, уточните, какой именно контент вы хотите создать: изображение, видео, игру или код? Просто опишите, что именно вам нужно.`;
          }
          
          responseMessage = {
            role: "assistant",
            content: textResponse.trim(),
            contentType: "text",
            aiName: selectedAI.name,
            aiAvatar: selectedAI.avatar,
            timestamp: new Date().toLocaleTimeString()
          };
      }
    } catch (error) {
      console.error("Error generating response:", error);
      responseMessage = {
        role: "assistant",
        content: "Извините, произошла ошибка при создании контента. Пожалуйста, попробуйте еще раз с другим запросом.",
        contentType: "text",
        aiName: selectedAI.name,
        aiAvatar: selectedAI.avatar,
        timestamp: new Date().toLocaleTimeString()
      };
    }
    
    setIsGenerating(false);
    return responseMessage;
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isGenerating) return;

    // Добавляем сообщение пользователя
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
      contentType: "text",
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Определяем тип контента, который нужно создать
    const contentType = detectContentType(input.toLowerCase());
    
    // Очищаем ввод
    setInput("");
    
    // Если контент соответствует выбранной вкладке, меняем ее
    if (contentType !== "text" && selectedTab !== contentType) {
      setSelectedTab(contentType);
    }
    
    // Эмулируем небольшую задержку для более реалистичного опыта
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Генерируем ответ нейросети
    const responseMessage = await generateResponseForContentType(userMessage.content, contentType);
    
    // Добавляем ответ нейросети
    setMessages(prev => [...prev, responseMessage]);
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
      content: `Привет! Я ${newAI.name}, ваша персональная нейросеть${newAI.description ? ` для ${newAI.description.toLowerCase()}` : ''}. Расскажите, чем я могу вам помочь?`,
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
            <TabsTrigger value="image" className="flex items-center gap-1">
              <Image className="h-4 w-4" />
              <span>Изображения</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              <span>Видео</span>
            </TabsTrigger>
            <TabsTrigger value="game" className="flex items-center gap-1">
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
          
          <div className="p-4 relative">
            <div className="flex gap-2">
              <Textarea
                placeholder="Напишите сообщение..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] resize-none"
                disabled={isGenerating}
              />
              <Button 
                onClick={handleSendMessage} 
                className="self-end"
                disabled={isGenerating || !input.trim()}
              >
                {isGenerating ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <div>
                Подсказка: создай картинку, видео, игру или код
              </div>
              <div className="flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>Powered by {selectedAI.name}</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="image" className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <Image className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Генерация изображений</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              Опишите изображение, которое хотите создать, и нейросеть сгенерирует его для вас. Вы сможете скачать его на своё устройство.
            </p>
            <Button 
              className="mt-4"
              onClick={() => {
                setSelectedTab("chat");
                setInput("Создай изображение ");
              }}
            >
              Создать изображение
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="video" className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <Video className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Генерация видео</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              Опишите видеоролик, который хотите создать, и нейросеть сгенерирует его для вас. Вы сможете скачать его на своё устройство.
            </p>
            <Button 
              className="mt-4"
              onClick={() => {
                setSelectedTab("chat");
                setInput("Создай видео ");
              }}
            >
              Создать видео
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="game" className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Создание игр</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              Опишите игру, которую хотите создать, и нейросеть разработает её для вас. Вы сможете играть в неё прямо в браузере или скачать.
            </p>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => {
                  setSelectedTab("chat");
                  setInput("Создай аркадную игру ");
                }}
              >
                Аркадная игра
              </Button>
              <Button 
                onClick={() => {
                  setSelectedTab("chat");
                  setInput("Создай головоломку ");
                }}
              >
                Головоломка
              </Button>
              <Button 
                onClick={() => {
                  setSelectedTab("chat");
                  setInput("Создай платформер ");
                }}
              >
                Платформер
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="flex-1 p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <Code className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Генерация кода</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              Опишите программу или скрипт, который хотите создать, и нейросеть напишет для вас код. Вы сможете скачать его на своё устройство.
            </p>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => {
                  setSelectedTab("chat");
                  setInput("Напиши код для сайта ");
                }}
              >
                Веб-сайт
              </Button>
              <Button 
                onClick={() => {
                  setSelectedTab("chat");
                  setInput("Напиши код для игры ");
                }}
              >
                Игра
              </Button>
              <Button 
                onClick={() => {
                  setSelectedTab("chat");
                  setInput("Напиши функцию для ");
                }}
              >
                Функция
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CreateAIModal 
        open={createAIOpen} 
        onOpenChange={setCreateAIOpen} 
        onCreateAI={handleCreateAI}
      />
      
      <div className="watermark">HGPT Pro</div>
    </div>
  );
};
