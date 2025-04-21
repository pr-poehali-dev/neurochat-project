/**
 * Game Generator Utility
 * Generates game code based on user requests
 */

interface GameTemplate {
  name: string;
  description: string;
  template: (options: any) => string;
  defaultOptions: any;
}

// Collection of game templates
const gameTemplates: Record<string, GameTemplate> = {
  // Simple arcade game template
  arcade: {
    name: "Аркадная игра",
    description: "Простая аркадная игра с базовыми элементами управления",
    defaultOptions: {
      playerColor: "#9b87f5",
      enemyColor: "#ff6b6b",
      backgroundColor: "#1a1a2e",
      gameName: "Аркада",
      difficulty: "medium"
    },
    template: (options) => `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.gameName}</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background-color: ${options.backgroundColor};
      font-family: Arial, sans-serif;
    }
    canvas {
      display: block;
    }
    .game-overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      color: white;
      font-size: 18px;
    }
    .watermark {
      position: absolute;
      bottom: 10px;
      right: 10px;
      color: rgba(255, 255, 255, 0.3);
      font-size: 14px;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div class="game-overlay">
    <div>Счёт: <span id="score">0</span></div>
    <div>Уровень: <span id="level">1</span></div>
  </div>
  <div class="watermark">HGPT Pro</div>
  <canvas id="gameCanvas"></canvas>
  
  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    
    // Установка размеров canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Игровые переменные
    let score = 0;
    let level = 1;
    let gameSpeed = ${options.difficulty === 'easy' ? '1' : options.difficulty === 'hard' ? '2' : '1.5'};
    
    // Игрок
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 50,
      width: 40,
      height: 40,
      color: "${options.playerColor}",
      speed: 6,
      dx: 0
    };
    
    // Массив врагов
    let enemies = [];
    
    // Массив пуль
    let bullets = [];
    
    // Обработка нажатий клавиш
    const keys = {};
    
    document.addEventListener('keydown', function(e) {
      keys[e.code] = true;
      
      // Стрельба на пробел
      if (e.code === 'Space') {
        fireBullet();
      }
    });
    
    document.addEventListener('keyup', function(e) {
      keys[e.code] = false;
    });
    
    // Создание пули
    function fireBullet() {
      bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        color: 'white',
        speed: 10
      });
    }
    
    // Создание врага
    function createEnemy() {
      const width = 30 + Math.random() * 30;
      enemies.push({
        x: Math.random() * (canvas.width - width),
        y: -50,
        width: width,
        height: width,
        color: "${options.enemyColor}",
        speed: 1 + Math.random() * 3 * gameSpeed
      });
    }
    
    // Обновление игрока
    function updatePlayer() {
      // Движение по горизонтали
      if (keys['ArrowLeft'] || keys['KeyA']) {
        player.dx = -player.speed;
      } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.dx = player.speed;
      } else {
        player.dx = 0;
      }
      
      player.x += player.dx;
      
      // Ограничение по краям экрана
      if (player.x < 0) {
        player.x = 0;
      } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
      }
    }
    
    // Обновление врагов
    function updateEnemies() {
      for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemies[i].speed;
        
        // Удаление врагов, когда они выходят за границу
        if (enemies[i].y > canvas.height) {
          enemies.splice(i, 1);
          i--;
          score -= 5;
          if (score < 0) score = 0;
          scoreElement.textContent = score;
        }
      }
      
      // Создание новых врагов случайным образом
      if (Math.random() < 0.02 * gameSpeed) {
        createEnemy();
      }
    }
    
    // Обновление пуль
    function updateBullets() {
      for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
        
        // Удаление пуль, когда они выходят за границу
        if (bullets[i].y < 0) {
          bullets.splice(i, 1);
          i--;
          continue;
        }
        
        // Проверка столкновений с врагами
        for (let j = 0; j < enemies.length; j++) {
          if (
            bullets[i] && bullets[i].x < enemies[j].x + enemies[j].width &&
            bullets[i].x + bullets[i].width > enemies[j].x &&
            bullets[i].y < enemies[j].y + enemies[j].height &&
            bullets[i].y + bullets[i].height > enemies[j].y
          ) {
            // Столкновение - удаляем пулю и врага
            bullets.splice(i, 1);
            enemies.splice(j, 1);
            i--;
            score += 10;
            scoreElement.textContent = score;
            
            // Увеличение уровня каждые 100 очков
            if (score % 100 === 0) {
              level++;
              gameSpeed += 0.2;
              levelElement.textContent = level;
            }
            
            break;
          }
        }
      }
    }
    
    // Проверка столкновения игрока с врагами
    function checkCollisions() {
      for (let i = 0; i < enemies.length; i++) {
        if (
          player.x < enemies[i].x + enemies[i].width &&
          player.x + player.width > enemies[i].x &&
          player.y < enemies[i].y + enemies[i].height &&
          player.y + player.height > enemies[i].y
        ) {
          // Столкновение - игра окончена
          gameOver();
          return;
        }
      }
    }
    
    // Окончание игры
    function gameOver() {
      // Остановка игрового цикла
      cancelAnimationFrame(animationId);
      
      // Отображение экрана окончания игры
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'white';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.font = '24px Arial';
      ctx.fillText('Счёт: ' + score, canvas.width / 2, canvas.height / 2);
      ctx.fillText('Уровень: ' + level, canvas.width / 2, canvas.height / 2 + 30);
      
      ctx.font = '20px Arial';
      ctx.fillText('Нажмите пробел для новой игры', canvas.width / 2, canvas.height / 2 + 80);
      
      // Обработчик для перезапуска игры
      document.addEventListener('keydown', restartGame);
    }
    
    function restartGame(e) {
      if (e.code === 'Space') {
        document.removeEventListener('keydown', restartGame);
        
        // Сброс игровых переменных
        score = 0;
        level = 1;
        gameSpeed = ${options.difficulty === 'easy' ? '1' : options.difficulty === 'hard' ? '2' : '1.5'};
        scoreElement.textContent = score;
        levelElement.textContent = level;
        
        // Сброс игрока
        player.x = canvas.width / 2;
        player.y = canvas.height - 50;
        
        // Очистка врагов и пуль
        enemies = [];
        bullets = [];
        
        // Перезапуск игрового цикла
        gameLoop();
      }
    }
    
    // Отрисовка всех элементов
    function draw() {
      // Очистка холста
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Отрисовка игрока
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Отрисовка врагов
      enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });
      
      // Отрисовка пуль
      bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
    }
    
    // Игровой цикл
    let animationId;
    
    function gameLoop() {
      // Обновление
      updatePlayer();
      updateEnemies();
      updateBullets();
      checkCollisions();
      
      // Отрисовка
      draw();
      
      // Запуск следующего кадра
      animationId = requestAnimationFrame(gameLoop);
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      player.y = canvas.height - 50;
    });
    
    // Запуск игры
    gameLoop();
  </script>
</body>
</html>`
  },
  
  // Puzzle game template
  puzzle: {
    name: "Головоломка",
    description: "Игра-головоломка с перемещением блоков",
    defaultOptions: {
      tileColor: "#8B5CF6",
      backgroundColor: "#1A1F2C",
      gameName: "Головоломка",
      difficulty: "medium",
      gridSize: 4
    },
    template: (options) => `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.gameName}</title>
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: ${options.backgroundColor};
      font-family: Arial, sans-serif;
      color: white;
    }
    
    .game-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(${options.gridSize}, 1fr);
      grid-template-rows: repeat(${options.gridSize}, 1fr);
      gap: 5px;
      width: 320px;
      height: 320px;
      perspective: 600px;
    }
    
    .tile {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${options.tileColor};
      border-radius: 5px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
      backface-visibility: hidden;
      color: white;
      user-select: none;
    }
    
    .tile:hover {
      transform: scale(0.95);
      filter: brightness(1.1);
    }
    
    .empty {
      background-color: transparent;
      cursor: default;
    }
    
    .info {
      display: flex;
      justify-content: space-between;
      width: 320px;
    }
    
    .watermark {
      position: absolute;
      bottom: 10px;
      right: 10px;
      color: rgba(255, 255, 255, 0.3);
      font-size: 14px;
      pointer-events: none;
    }
    
    button {
      padding: 8px 16px;
      background-color: ${options.tileColor};
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
    }
    
    button:hover {
      filter: brightness(1.1);
    }
  </style>
</head>
<body>
  <div class="game-container">
    <h1>${options.gameName}</h1>
    <div class="info">
      <div>Ходы: <span id="moves">0</span></div>
      <div>Время: <span id="time">00:00</span></div>
    </div>
    <div class="grid" id="grid"></div>
    <button id="new-game">Новая игра</button>
    <div class="watermark">HGPT Pro</div>
  </div>

  <script>
    const gridEl = document.getElementById('grid');
    const movesEl = document.getElementById('moves');
    const timeEl = document.getElementById('time');
    const newGameBtn = document.getElementById('new-game');
    
    const gridSize = ${options.gridSize};
    const tilesCount = gridSize * gridSize;
    let tiles = [];
    let emptyTileIndex = tilesCount - 1;
    let moves = 0;
    let timer;
    let seconds = 0;
    let isGameComplete = false;
    
    // Инициализация игры
    initGame();
    
    function initGame() {
      // Сброс состояния
      tiles = [];
      emptyTileIndex = tilesCount - 1;
      moves = 0;
      seconds = 0;
      isGameComplete = false;
      movesEl.textContent = moves;
      timeEl.textContent = '00:00';
      gridEl.innerHTML = '';
      
      // Создание исходного упорядоченного массива
      for (let i = 0; i < tilesCount - 1; i++) {
        tiles.push(i + 1);
      }
      tiles.push(0); // Пустая плитка
      
      // Перемешивание массива с гарантией разрешимости
      shuffleTiles();
      
      // Создание элементов плиток
      renderTiles();
      
      // Запуск таймера
      clearInterval(timer);
      timer = setInterval(updateTimer, 1000);
    }
    
    function shuffleTiles() {
      // Выполняем много случайных ходов из решенного состояния
      let shuffleMoves = ${options.difficulty === 'easy' ? '50' : options.difficulty === 'hard' ? '150' : '100'};
      
      // Начальное состояние - решенная головоломка
      tiles = Array.from({length: tilesCount - 1}, (_, i) => i + 1);
      tiles.push(0);
      emptyTileIndex = tilesCount - 1;
      
      for (let i = 0; i < shuffleMoves; i++) {
        // Получить возможные ходы для пустой клетки
        const possibleMoves = getValidMoves();
        
        // Выбрать случайный ход
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        
        // Выполнить ход
        swapTiles(randomMove);
      }
    }
    
    function getValidMoves() {
      const row = Math.floor(emptyTileIndex / gridSize);
      const col = emptyTileIndex % gridSize;
      const validMoves = [];
      
      // Проверить соседние клетки (вверх, вниз, влево, вправо)
      if (row > 0) validMoves.push(emptyTileIndex - gridSize); // Вверх
      if (row < gridSize - 1) validMoves.push(emptyTileIndex + gridSize); // Вниз
      if (col > 0) validMoves.push(emptyTileIndex - 1); // Влево
      if (col < gridSize - 1) validMoves.push(emptyTileIndex + 1); // Вправо
      
      return validMoves;
    }
    
    function swapTiles(tileIndex) {
      // Заменить местами выбранную плитку и пустую
      const tempValue = tiles[tileIndex];
      tiles[tileIndex] = 0;
      tiles[emptyTileIndex] = tempValue;
      emptyTileIndex = tileIndex;
    }
    
    function renderTiles() {
      gridEl.innerHTML = '';
      
      for (let i = 0; i < tilesCount; i++) {
        const tileEl = document.createElement('div');
        const value = tiles[i];
        
        tileEl.className = value === 0 ? 'tile empty' : 'tile';
        tileEl.textContent = value === 0 ? '' : value;
        tileEl.dataset.index = i;
        
        if (value !== 0) {
          tileEl.addEventListener('click', () => handleTileClick(i));
        }
        
        gridEl.appendChild(tileEl);
      }
    }
    
    function handleTileClick(tileIndex) {
      if (isGameComplete) return;
      
      // Проверить, можно ли переместить эту плитку
      const validMoves = getValidMoves();
      
      if (validMoves.includes(tileIndex)) {
        // Переместить плитку
        swapTiles(tileIndex);
        moves++;
        movesEl.textContent = moves;
        
        // Обновить отображение
        renderTiles();
        
        // Проверить, завершена ли игра
        checkGameComplete();
      }
    }
    
    function checkGameComplete() {
      // Проверка, все ли плитки на своих местах
      for (let i = 0; i < tilesCount - 1; i++) {
        if (tiles[i] !== i + 1) return;
      }
      
      // Если все плитки на своих местах, игра завершена
      isGameComplete = true;
      clearInterval(timer);
      
      // Отображение сообщения о победе
      setTimeout(() => {
        alert('Поздравляем! Вы решили головоломку за ' + moves + ' ходов и ' + formatTime(seconds) + '!');
      }, 300);
    }
    
    function updateTimer() {
      seconds++;
      timeEl.textContent = formatTime(seconds);
    }
    
    function formatTime(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
    }
    
    // Обработчик кнопки новой игры
    newGameBtn.addEventListener('click', initGame);
  </script>
</body>
</html>`
  },
  
  // Platformer game template
  platformer: {
    name: "Платформер",
    description: "Простая игра-платформер с прыжками и препятствиями",
    defaultOptions: {
      playerColor: "#9b87f5",
      platformColor: "#7E69AB",
      backgroundColor: "#1A1F2C",
      gameName: "Приключение",
      difficulty: "medium"
    },
    template: (options) => `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.gameName}</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background-color: ${options.backgroundColor};
      font-family: Arial, sans-serif;
    }
    canvas {
      display: block;
    }
    .game-overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      color: white;
      font-size: 18px;
    }
    .watermark {
      position: absolute;
      bottom: 10px;
      right: 10px;
      color: rgba(255, 255, 255, 0.3);
      font-size: 14px;
      pointer-events: none;
    }
    .controls {
      position: absolute;
      bottom: 10px;
      left: 10px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="game-overlay">
    <div>Расстояние: <span id="score">0</span>м</div>
  </div>
  <div class="controls">Управление: A/D или ←/→ для движения, W или ↑ для прыжка</div>
  <div class="watermark">HGPT Pro</div>
  <canvas id="gameCanvas"></canvas>
  
  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    
    // Установка размеров canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Игровые переменные
    let score = 0;
    let gameSpeed = ${options.difficulty === 'easy' ? '5' : options.difficulty === 'hard' ? '8' : '6'};
    let gravity = 0.5;
    
    // Игрок
    const player = {
      x: 150,
      y: canvas.height - 150,
      width: 40,
      height: 50,
      color: "${options.playerColor}",
      speed: 6,
      dx: 0,
      dy: 0,
      jumpForce: 15,
      jumpHeight: 15,
      grounded: false,
      jumping: false
    };
    
    // Платформы
    let platforms = [];
    
    // Создание начальных платформ
    function createInitialPlatforms() {
      // Земля
      platforms.push({
        x: 0,
        y: canvas.height - 100,
        width: canvas.width + 200,
        height: 100,
        color: "${options.platformColor}"
      });
      
      // Дополнительные платформы
      for (let i = 0; i < 6; i++) {
        const platformWidth = 100 + Math.random() * 200;
        platforms.push({
          x: 500 + i * 300 + Math.random() * 200,
          y: canvas.height - 200 - Math.random() * 200,
          width: platformWidth,
          height: 20,
          color: "${options.platformColor}"
        });
      }
    }
    
    createInitialPlatforms();
    
    // Обработка нажатий клавиш
    const keys = {};
    
    document.addEventListener('keydown', function(e) {
      keys[e.code] = true;
    });
    
    document.addEventListener('keyup', function(e) {
      keys[e.code] = false;
    });
    
    // Обновление игрока
    function updatePlayer() {
      // Горизонтальное движение
      player.dx = 0;
      
      if (keys['ArrowLeft'] || keys['KeyA']) {
        player.dx = -player.speed;
      } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.dx = player.speed;
      }
      
      // Прыжок
      if ((keys['ArrowUp'] || keys['KeyW']) && player.grounded && !player.jumping) {
        player.dy = -player.jumpForce;
        player.jumping = true;
        player.grounded = false;
      }
      
      // Применяем гравитацию
      player.dy += gravity;
      
      // Перемещаем игрока
      player.x += player.dx;
      player.y += player.dy;
      
      // Проверка столкновений с платформами
      player.grounded = false;
      
      for (let i = 0; i < platforms.length; i++) {
        const p = platforms[i];
        
        // Проверка столкновения снизу
        if (player.y + player.height > p.y && 
            player.y < p.y + p.height &&
            player.x + player.width > p.x && 
            player.x < p.x + p.width) {
          
          // Столкновение с верхней частью платформы
          if (player.dy > 0 && player.y + player.height - player.dy <= p.y) {
            player.y = p.y - player.height;
            player.dy = 0;
            player.grounded = true;
            player.jumping = false;
          }
          // Столкновение с нижней частью платформы
          else if (player.dy < 0 && player.y - player.dy >= p.y + p.height) {
            player.y = p.y + p.height;
            player.dy = 0;
          }
        }
      }
      
      // Ограничение по краям экрана
      if (player.x < 0) {
        player.x = 0;
      } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
      }
      
      // Проверка падения
      if (player.y > canvas.height) {
        gameOver();
      }
    }
    
    // Обновление платформ и создание новых
    function updatePlatforms() {
      for (let i = 0; i < platforms.length; i++) {
        platforms[i].x -= gameSpeed;
        
        // Удаление платформ, вышедших за пределы экрана
        if (platforms[i].x + platforms[i].width < 0) {
          platforms.splice(i, 1);
          i--;
          
          // Создание новой платформы
          const platformWidth = 100 + Math.random() * 200;
          platforms.push({
            x: canvas.width + Math.random() * 200,
            y: canvas.height - 200 - Math.random() * 200,
            width: platformWidth,
            height: 20,
            color: "${options.platformColor}"
          });
          
          // Увеличение счета
          score += 10;
          scoreElement.textContent = score;
          
          // Увеличение скорости игры
          if (score % 100 === 0) {
            gameSpeed += 0.5;
          }
        }
      }
    }
    
    // Окончание игры
    function gameOver() {
      // Остановка игрового цикла
      cancelAnimationFrame(animationId);
      
      // Отображение экрана окончания игры
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'white';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.font = '24px Arial';
      ctx.fillText('Расстояние: ' + score + 'м', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '20px Arial';
      ctx.fillText('Нажмите пробел для новой игры', canvas.width / 2, canvas.height / 2 + 60);
      
      // Обработчик для перезапуска игры
      document.addEventListener('keydown', restartGame);
    }
    
    function restartGame(e) {
      if (e.code === 'Space') {
        document.removeEventListener('keydown', restartGame);
        
        // Сброс игровых переменных
        score = 0;
        gameSpeed = ${options.difficulty === 'easy' ? '5' : options.difficulty === 'hard' ? '8' : '6'};
        scoreElement.textContent = score;
        
        // Сброс игрока
        player.x = 150;
        player.y = canvas.height - 150;
        player.dx = 0;
        player.dy = 0;
        
        // Сброс платформ
        platforms = [];
        createInitialPlatforms();
        
        // Перезапуск игрового цикла
        gameLoop();
      }
    }
    
    // Отрисовка всех элементов
    function draw() {
      // Очистка холста
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Отрисовка фона
      ctx.fillStyle = "${options.backgroundColor}";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Отрисовка платформ
      platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      });
      
      // Отрисовка игрока
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Глаза и улыбка для игрока
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(player.x + 10, player.y + 15, 5, 0, Math.PI * 2);
      ctx.arc(player.x + 30, player.y + 15, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(player.x + 20, player.y + 30, 10, 0, Math.PI);
      ctx.stroke();
    }
    
    // Игровой цикл
    let animationId;
    
    function gameLoop() {
      // Обновление
      updatePlayer();
      updatePlatforms();
      
      // Отрисовка
      draw();
      
      // Запуск следующего кадра
      animationId = requestAnimationFrame(gameLoop);
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
      const oldHeight = canvas.height;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Корректировка позиции игрока при изменении размера окна
      const heightDiff = canvas.height - oldHeight;
      player.y += heightDiff;
      
      // Корректировка позиции платформ
      platforms.forEach(platform => {
        platform.y += heightDiff;
      });
    });
    
    // Запуск игры
    gameLoop();
  </script>
</body>
</html>`
  }
};

/**
 * Analyzes user request to determine game type and features
 * @param request User's request text
 * @returns Game options including template and customizations
 */
export const analyzeGameRequest = (request: string): {template: string, options: any} => {
  // Default to arcade game if no clear type detected
  let gameType = 'arcade';
  
  // Convert to lowercase for easier matching
  const lowercaseRequest = request.toLowerCase();
  
  // Detect game type from request
  if (lowercaseRequest.includes('головолом') || 
      lowercaseRequest.includes('пазл') || 
      lowercaseRequest.includes('puzzle')) {
    gameType = 'puzzle';
  }
  else if (lowercaseRequest.includes('платформер') || 
           lowercaseRequest.includes('прыг') || 
           lowercaseRequest.includes('run') || 
           lowercaseRequest.includes('бег')) {
    gameType = 'platformer';
  }
  
  // Choose template
  const template = gameTemplates[gameType];
  
  // Set base options using template defaults
  const options = {...template.defaultOptions};
  
  // Customize options based on request
  
  // Game name
  if (lowercaseRequest.includes('назв')) {
    const nameMatch = request.match(/назв[а-я]+\s+["']?([^"']+)["']?/i);
    if (nameMatch && nameMatch[1]) {
      options.gameName = nameMatch[1].trim();
    }
  }
  
  // Difficulty
  if (lowercaseRequest.includes('лёгк') || lowercaseRequest.includes('прост')) {
    options.difficulty = 'easy';
  } else if (lowercaseRequest.includes('сложн') || lowercaseRequest.includes('труд')) {
    options.difficulty = 'hard';
  }
  
  // Colors
  if (lowercaseRequest.includes('красн')) {
    options.playerColor = '#ff6b6b';
  } else if (lowercaseRequest.includes('син')) {
    options.playerColor = '#0ea5e9';
  } else if (lowercaseRequest.includes('зелён')) {
    options.playerColor = '#34d399';
  }
  
  if (lowercaseRequest.includes('фон')) {
    if (lowercaseRequest.includes('тёмн') || lowercaseRequest.includes('чёрн')) {
      options.backgroundColor = '#1A1F2C';
    } else if (lowercaseRequest.includes('свет')) {
      options.backgroundColor = '#f3f4f6';
      options.platformColor = '#9b87f5';
    }
  }
  
  // Grid size for puzzle
  if (gameType === 'puzzle') {
    if (lowercaseRequest.includes('3x3') || lowercaseRequest.includes('3 на 3')) {
      options.gridSize = 3;
    } else if (lowercaseRequest.includes('5x5') || lowercaseRequest.includes('5 на 5')) {
      options.gridSize = 5;
    }
  }
  
  return {
    template: gameType,
    options
  };
};

/**
 * Generates a complete game based on user request
 * @param request The user's request text
 * @returns HTML string for the complete game
 */
export const generateGame = (request: string): string => {
  const { template, options } = analyzeGameRequest(request);
  return gameTemplates[template].template(options);
};

/**
 * Creates an object URL for the generated game
 * @param gameHtml The HTML content of the game
 * @returns A URL that can be used to open the game
 */
export const createGameUrl = (gameHtml: string): string => {
  const blob = new Blob([gameHtml], { type: 'text/html' });
  return URL.createObjectURL(blob);
};

/**
 * Extracts a snippet of code from the full game HTML
 * @param gameHtml The complete game HTML
 * @returns A snippet suitable for display in the chat
 */
export const extractGameCodeSnippet = (gameHtml: string): string => {
  // For display purposes, extract just the game logic portion
  const scriptMatch = gameHtml.match(/<script>([\s\S]*?)<\/script>/);
  if (scriptMatch && scriptMatch[1]) {
    // Get the first few lines of the script
    const lines = scriptMatch[1].split('\n');
    return lines.slice(0, 15).join('\n') + '\n// ... (полный код игры)';
  }
  return 'const canvas = document.getElementById("gameCanvas");\n// ... (полный код игры)';
};
