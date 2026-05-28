// ========== 春秋战国历史地图展示 ==========

// 加载数据
let historyData = null;
let currentYearIndex = 0;
const TOTAL_YEARS = 549; // 前770 到 前221

// Canvas 上下文
let canvas, ctx;
let mapWidth, mapHeight;

// 中国地图简化坐标（相对坐标，0-100）
const CHINA_MAP = {
  // 主要城市/地标坐标
  cities: {
    '镐京': { x: 28, y: 42, modern: '西安' },
    '洛邑': { x: 32, y: 44, modern: '洛阳' },
    '临淄': { x: 52, y: 38, modern: '淄博' },
    '邯郸': { x: 42, y: 35, modern: '邯郸' },
    '大梁': { x: 36, y: 40, modern: '开封' },
    '郑': { x: 34, y: 42, modern: '新郑' },
    '郢': { x: 32, y: 58, modern: '江陵' },
    '寿春': { x: 38, y: 52, modern: '寿县' },
    '蓟': { x: 48, y: 25, modern: '北京' },
    '咸阳': { x: 26, y: 44, modern: '咸阳' },
    '雍': { x: 24, y: 46, modern: '凤翔' }
  },
  
  // 地理特征
  features: {
    '黄河': [
      { x: 20, y: 35 }, { x: 28, y: 32 }, { x: 35, y: 33 },
      { x: 42, y: 30 }, { x: 50, y: 28 }, { x: 58, y: 26 },
      { x: 65, y: 25 }, { x: 75, y: 24 }
    ],
    '长江': [
      { x: 20, y: 65 }, { x: 30, y: 62 }, { x: 40, y: 60 },
      { x: 50, y: 58 }, { x: 60, y: 56 }, { x: 70, y: 55 },
      { x: 80, y: 54 }
    ],
    '泰山': { x: 55, y: 36 },
    '华山': { x: 28, y: 45 }
  }
};

// 各国在不同时期的疆域（简化多边形）
const STATE_TERRITORIES = {
  // 春秋初期（前770）
  '-770': {
    'zhou': [{ x: 30, y: 42, r: 8 }],
    'qi': [{ x: 50, y: 38, r: 12 }],
    'jin': [{ x: 38, y: 35, r: 15 }],
    'chu': [{ x: 35, y: 55, r: 18 }],
    'qin': [{ x: 25, y: 45, r: 10 }],
    'yan': [{ x: 48, y: 25, r: 10 }],
    'lu': [{ x: 48, y: 40, r: 5 }],
    'song': [{ x: 38, y: 42, r: 5 }],
    'zheng': [{ x: 33, y: 43, r: 4 }],
    'wu': [{ x: 55, y: 55, r: 8 }],
    'yue': [{ x: 58, y: 60, r: 6 }]
  },
  // 春秋中期（前550）
  '-550': {
    'zhou': [{ x: 32, y: 44, r: 6 }],
    'qi': [{ x: 50, y: 38, r: 14 }],
    'jin': [{ x: 38, y: 35, r: 16 }],
    'chu': [{ x: 35, y: 55, r: 22 }],
    'qin': [{ x: 25, y: 45, r: 12 }],
    'yan': [{ x: 48, y: 25, r: 12 }],
    'wu': [{ x: 55, y: 55, r: 12 }],
    'yue': [{ x: 58, y: 60, r: 8 }]
  },
  // 春秋末期（前475）
  '-475': {
    'zhou': [{ x: 32, y: 44, r: 4 }],
    'qi': [{ x: 50, y: 38, r: 14 }],
    'jin': [{ x: 38, y: 35, r: 16 }],
    'chu': [{ x: 35, y: 55, r: 24 }],
    'qin': [{ x: 25, y: 45, r: 14 }],
    'yan': [{ x: 48, y: 25, r: 14 }],
    'wu': [{ x: 55, y: 55, r: 10 }],
    'yue': [{ x: 58, y: 60, r: 12 }]
  },
  // 战国初期（前400）- 三家分晋后
  '-400': {
    'zhou': [{ x: 32, y: 44, r: 3 }],
    'qi': [{ x: 50, y: 38, r: 14 }],
    'han': [{ x: 34, y: 42, r: 8 }],
    'zhao': [{ x: 40, y: 35, r: 12 }],
    'wei': [{ x: 36, y: 40, r: 10 }],
    'chu': [{ x: 35, y: 55, r: 24 }],
    'qin': [{ x: 25, y: 45, r: 16 }],
    'yan': [{ x: 48, y: 25, r: 16 }],
    'yue': [{ x: 58, y: 60, r: 10 }]
  },
  // 战国中期（前300）
  '-300': {
    'zhou': [{ x: 32, y: 44, r: 2 }],
    'qi': [{ x: 50, y: 38, r: 14 }],
    'han': [{ x: 34, y: 42, r: 8 }],
    'zhao': [{ x: 40, y: 35, r: 14 }],
    'wei': [{ x: 36, y: 40, r: 8 }],
    'chu': [{ x: 35, y: 55, r: 26 }],
    'qin': [{ x: 25, y: 45, r: 20 }],
    'yan': [{ x: 48, y: 25, r: 18 }],
    'zhou_remnant': [{ x: 32, y: 44, r: 2 }]
  },
  // 战国末期（前230）
  '-230': {
    'han': [{ x: 34, y: 42, r: 6 }],
    'zhao': [{ x: 40, y: 35, r: 10 }],
    'chu': [{ x: 35, y: 55, r: 20 }],
    'qin': [{ x: 28, y: 44, r: 28 }],
    'yan': [{ x: 48, y: 25, r: 12 }],
    'qi': [{ x: 50, y: 38, r: 12 }]
  },
  // 秦统一（前221）
  '-221': {
    'qin': [{ x: 35, y: 45, r: 35 }]
  }
};

// 时期映射
const PERIODS = {
  '0': '-770',
  '25': '-550',
  '50': '-475',
  '60': '-400',
  '75': '-300',
  '90': '-230',
  '100': '-221'
};

// 国家颜色映射
const STATE_COLORS = {
  'zhou': '#8B4513',
  'zhou_remnant': '#8B4513',
  'qi': '#FF6B35',
  'jin': '#4ECDC4',
  'han': '#F39C12',
  'zhao': '#1ABC9C',
  'wei': '#3498DB',
  'chu': '#E74C3C',
  'qin': '#2C3E50',
  'yan': '#9B59B6',
  'lu': '#27AE60',
  'song': '#8E44AD',
  'zheng': '#E67E22',
  'wu': '#16A085',
  'yue': '#2980B9'
};

// 国家名称映射
const STATE_NAMES = {
  'zhou': '周',
  'zhou_remnant': '周',
  'qi': '齐',
  'jin': '晋',
  'han': '韩',
  'zhao': '赵',
  'wei': '魏',
  'chu': '楚',
  'qin': '秦',
  'yan': '燕',
  'lu': '鲁',
  'song': '宋',
  'zheng': '郑',
  'wu': '吴',
  'yue': '越'
};

// ========== 初始化 ==========

async function init() {
  // 加载数据
  try {
    const response = await fetch('data.json');
    historyData = await response.json();
    console.log('历史数据加载成功');
  } catch (error) {
    console.error('加载数据失败:', error);
    // 使用内置数据
    historyData = getBuiltinData();
  }

  // 初始化 Canvas
  canvas = document.getElementById('mapCanvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  // 初始化 UI
  initTimeline();
  initPeriodButtons();
  renderStateList();
  renderEventsList();
  renderFiguresList();

  // 初始渲染
  renderMap(0);
  updateTimelineDisplay(0);

  console.log('春秋战国历史地图初始化完成');
}

function resizeCanvas() {
  if (!canvas) return;
  
  const container = canvas.parentElement;
  mapWidth = container.clientWidth;
  mapHeight = container.clientHeight;
  
  canvas.width = mapWidth;
  canvas.height = mapHeight;
  
  // 重新渲染
  renderMap(currentYearIndex);
}

// ========== 时间轴控制 ==========

function initTimeline() {
  const slider = document.getElementById('timelineSlider');
  if (!slider) return;

  slider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    renderMap(value);
    updateTimelineDisplay(value);
  });
}

function initPeriodButtons() {
  const buttons = document.querySelectorAll('.period-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 更新激活状态
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // 获取年份索引
      const yearIndex = parseInt(btn.dataset.year);
      currentYearIndex = yearIndex;
      
      // 更新滑块
      const slider = document.getElementById('timelineSlider');
      if (slider) slider.value = yearIndex;
      
      // 渲染
      renderMap(yearIndex);
      updateTimelineDisplay(yearIndex);
    });
  });
}

function updateTimelineDisplay(yearIndex) {
  const yearDisplay = document.getElementById('timelineYear');
  if (!yearDisplay) return;

  const year = getYearFromIndex(yearIndex);
  const event = findEventByYear(year);
  
  let description = '';
  if (event) {
    description = event.title;
  } else {
    const period = getPeriodName(yearIndex);
    description = period;
  }

  yearDisplay.innerHTML = `<strong>公元前${Math.abs(year)}年</strong> — ${description}`;
}

function getYearFromIndex(index) {
  return -770 + Math.round((index / 100) * 549);
}

function getPeriodName(index) {
  if (index < 30) return '春秋时期';
  if (index < 60) return '战国初期';
  if (index < 85) return '战国中期';
  return '战国末期';
}

function findEventByYear(year) {
  if (!historyData || !historyData.events) return null;
  
  // 查找最接近的事件
  let closestEvent = null;
  let minDiff = Infinity;
  
  for (const event of historyData.events) {
    const diff = Math.abs(event.year - year);
    if (diff < minDiff && diff < 30) {
      minDiff = diff;
      closestEvent = event;
    }
  }
  
  return closestEvent;
}

// ========== 地图渲染 ==========

function renderMap(yearIndex) {
  if (!ctx || !historyData) return;

  currentYearIndex = yearIndex;
  const year = getYearFromIndex(yearIndex);
  const yearKey = getClosestYearKey(year);
  
  // 清空画布
  ctx.clearRect(0, 0, mapWidth, mapHeight);
  
  // 绘制背景
  drawBackground();
  
  // 绘制地理特征
  drawGeographicFeatures();
  
  // 绘制诸侯国疆域
  const territories = STATE_TERRITORIES[yearKey];
  if (territories) {
    for (const [stateId, circles] of Object.entries(territories)) {
      drawStateTerritory(stateId, circles);
    }
  }
  
  // 绘制城市
  drawCities(yearKey);
  
  // 绘制标题
  drawMapTitle(year);
}

function getClosestYearKey(year) {
  const keys = Object.keys(STATE_TERRITORIES).map(k => parseInt(k));
  keys.sort((a, b) => Math.abs(a - year) - Math.abs(b - year));
  return keys[0].toString();
}

function drawBackground() {
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 0, mapHeight);
  gradient.addColorStop(0, '#0a0a0a');
  gradient.addColorStop(0.5, '#1a1a2e');
  gradient.addColorStop(1, '#0f0f1a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, mapWidth, mapHeight);
  
  // 网格线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  
  const gridSize = 50;
  for (let x = 0; x < mapWidth; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, mapHeight);
    ctx.stroke();
  }
  for (let y = 0; y < mapHeight; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(mapWidth, y);
    ctx.stroke();
  }
}

function drawGeographicFeatures() {
  // 黄河
  ctx.strokeStyle = '#D4A574';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 5]);
  ctx.beginPath();
  CHINA_MAP.features['黄河'].forEach((point, i) => {
    const x = (point.x / 100) * mapWidth;
    const y = (point.y / 100) * mapHeight;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  
  // 长江
  ctx.strokeStyle = '#5DADE2';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 5]);
  ctx.beginPath();
  CHINA_MAP.features['长江'].forEach((point, i) => {
    const x = (point.x / 100) * mapWidth;
    const y = (point.y / 100) * mapHeight;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  
  // 河流标签
  ctx.fillStyle = '#D4A574';
  ctx.font = '14px sans-serif';
  ctx.fillText('黄河', (CHINA_MAP.features['黄河'][3].x / 100) * mapWidth + 10, (CHINA_MAP.features['黄河'][3].y / 100) * mapHeight - 10);
  
  ctx.fillStyle = '#5DADE2';
  ctx.fillText('长江', (CHINA_MAP.features['长江'][3].x / 100) * mapWidth + 10, (CHINA_MAP.features['长江'][3].y / 100) * mapHeight - 10);
}

function drawStateTerritory(stateId, circles) {
  const color = STATE_COLORS[stateId] || '#888';
  const name = STATE_NAMES[stateId] || stateId;
  
  circles.forEach(circle => {
    const x = (circle.x / 100) * mapWidth;
    const y = (circle.y / 100) * mapHeight;
    const r = (circle.r / 100) * Math.min(mapWidth, mapHeight) * 0.6;
    
    // 外发光
    const glowGradient = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 1.5);
    glowGradient.addColorStop(0, color + '40');
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 主体
    const gradient = ctx.createRadialGradient(x, y, r * 0.3, x, y, r);
    gradient.addColorStop(0, color + 'CC');
    gradient.addColorStop(1, color + '80');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    
    // 边框
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    
    // 国家名称
    ctx.fillStyle = '#FFF';
    ctx.font = `bold ${Math.max(14, r * 0.6)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x, y);
  });
}

function drawCities(yearKey) {
  // 根据时期显示相关城市
  const citiesToShow = ['洛邑', '临淄', '邯郸', '大梁', '郢', '咸阳', '蓟'];
  
  citiesToShow.forEach(cityName => {
    const city = CHINA_MAP.cities[cityName];
    if (!city) return;
    
    const x = (city.x / 100) * mapWidth;
    const y = (city.y / 100) * mapHeight;
    
    // 城市标记
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // 城市名称
    ctx.fillStyle = '#FFF';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(cityName, x + 8, y - 8);
  });
}

function drawMapTitle(year) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(16, 16, 180, 36);
  
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`公元前${Math.abs(year)}年`, 24, 38);
}

// ========== UI 渲染 ==========

function renderStateList() {
  const container = document.getElementById('stateList');
  if (!container || !historyData || !historyData.states) return;
  
  container.innerHTML = historyData.states.map(state => `
    <div class="state-item">
      <div class="state-color" style="background: ${state.color}"></div>
      <span class="state-name">${state.name}</span>
      <span class="state-desc">${state.capital}</span>
    </div>
  `).join('');
}

function renderEventsList() {
  const container = document.getElementById('eventsList');
  if (!container || !historyData || !historyData.events) return;
  
  // 按时间排序
  const sortedEvents = [...historyData.events].sort((a, b) => a.year - b.year);
  
  container.innerHTML = sortedEvents.map(event => `
    <div class="event-item">
      <div class="event-year">公元前${Math.abs(event.year)}年</div>
      <div class="event-title">${event.title}</div>
      <div class="event-desc">${event.description}</div>
    </div>
  `).join('');
}

function renderFiguresList() {
  const container = document.getElementById('figuresList');
  if (!container || !historyData || !historyData.figures) return;
  
  container.innerHTML = historyData.figures.map(fig => `
    <div class="figure-item">
      <div>
        <div class="figure-period"><span class="figure-name">${fig.name}</span> · ${fig.period}</div>
        <div class="figure-story">${fig.story}</div>
      </div>
    </div>
  `).join('');
}

// ========== 内置数据（备用）==========

function getBuiltinData() {
  return {
    states: [
      { id: 'zhou', name: '周', capital: '洛邑', color: '#8B4513' },
      { id: 'qi', name: '齐', capital: '临淄', color: '#FF6B35' },
      { id: 'jin', name: '晋', capital: '新田', color: '#4ECDC4' },
      { id: 'chu', name: '楚', capital: '郢', color: '#E74C3C' },
      { id: 'qin', name: '秦', capital: '咸阳', color: '#2C3E50' },
      { id: 'yan', name: '燕', capital: '蓟', color: '#9B59B6' },
      { id: 'han', name: '韩', capital: '郑', color: '#F39C12' },
      { id: 'zhao', name: '赵', capital: '邯郸', color: '#1ABC9C' },
      { id: 'wei', name: '魏', capital: '大梁', color: '#3498DB' }
    ],
    events: [
      { year: -771, title: '烽火戏诸侯', description: '周幽王亡国' },
      { year: -770, title: '平王东迁', description: '东周开始' },
      { year: -453, title: '三家分晋', description: '战国开始' },
      { year: -221, title: '秦始皇统一', description: '秦朝建立' }
    ],
    figures: [
      { name: '周幽王', period: '西周', story: '烽火戏诸侯' },
      { name: '齐桓公', period: '春秋', story: '春秋首霸' },
      { name: '秦始皇', period: '战国', story: '统一六国' }
    ]
  };
}

// ========== 启动 ==========

document.addEventListener('DOMContentLoaded', init);
