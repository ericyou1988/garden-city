// ============================================================
// 🛸 达芬奇扑翼机 — Three.js 三维机械展示 (经典 IIFE 模式)
// ============================================================

(function () {
  // ── 全局变量 ──
  var scene, camera, renderer, controls;
  var ornithopterGroup;
  var parts = {};
  var isExploded = false;
  var autoRotate = true;
  var wireframeMode = false;
  var raycaster, mouse;
  var hoveredPart = null;
  var clock = new THREE.Clock();

  // ── 部件配置 ──
  var PART_DEFS = [
    { key: 'fuselage',    name: '机身骨架',   color: 0x8B7355, explodeDir: new THREE.Vector3(0, 0, 0) },
    { key: 'cockpit',     name: '驾驶舱',     color: 0x4A90D9, explodeDir: new THREE.Vector3(0, 0.5, 0) },
    { key: 'leftWing',    name: '左翼',       color: 0xC4A35A, explodeDir: new THREE.Vector3(-3, 0, 0) },
    { key: 'rightWing',   name: '右翼',       color: 0xC4A35A, explodeDir: new THREE.Vector3(3, 0, 0) },
    { key: 'tailWing',    name: '尾翼',       color: 0xB8946A, explodeDir: new THREE.Vector3(0, 0.3, -2) },
    { key: 'landingGear',  name: '起落架',     color: 0x666666, explodeDir: new THREE.Vector3(0, -1, 0) },
    { key: 'mechanism',   name: '扑翼机构',   color: 0xCC7733, explodeDir: new THREE.Vector3(0, -0.5, 0.5) },
    { key: 'propeller',   name: '尾桨',       color: 0xAA6644, explodeDir: new THREE.Vector3(0, 0, -1.5) },
  ];

  // ── 初始化场景 ──
  function init() {
    // 场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.Fog(0x0a0a0f, 15, 40);

    // 相机
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(6, 3, 8);

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // 控制器 (r128 UMD 挂在 THREE 命名空间下)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.target.set(0, 0, 0);

    // 灯光
    setupLights();

    // 地面网格
    setupGrid();

    // 创建扑翼机模型
    createOrnithopter();

    // 射线检测
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // 事件监听
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

    // 填充部件列表
    populatePartsList();

    // 隐藏加载动画
    setTimeout(function () {
      document.getElementById('loading').classList.add('fade-out');
    }, 500);

    // 开始动画循环
    animate();
  }

  // ── 灯光设置 ──
  function setupLights() {
    // 环境光
    var ambient = new THREE.AmbientLight(0x404060, 0.6);
    scene.add(ambient);

    // 主光源（暖色）
    var mainLight = new THREE.DirectionalLight(0xfff5e0, 1.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 30;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);

    // 补光（冷色）
    var fillLight = new THREE.DirectionalLight(0x4080ff, 0.4);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // 底部反射光
    var bottomLight = new THREE.DirectionalLight(0x334455, 0.2);
    bottomLight.position.set(0, -5, 0);
    scene.add(bottomLight);

    // 点光源（模拟机身高光）
    var cockpitLight = new THREE.PointLight(0x00d4ff, 0.5, 5);
    cockpitLight.position.set(0, 1, 0);
    scene.add(cockpitLight);
  }

  // ── 地面网格 ──
  function setupGrid() {
    var gridHelper = new THREE.GridHelper(30, 30, 0x1a1a2e, 0x1a1a2e);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // 圆形平台
    var platformGeo = new THREE.CylinderGeometry(8, 8, 0.1, 64);
    var platformMat = new THREE.MeshStandardMaterial({
      color: 0x12121a,
      roughness: 0.8,
      metalness: 0.3,
    });
    var platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -2.05;
    platform.receiveShadow = true;
    scene.add(platform);
  }

  // ── 创建扑翼机模型 ──
  function createOrnithopter() {
    ornithopterGroup = new THREE.Group();

    PART_DEFS.forEach(function (def) {
      var part = createPart(def.key, def.color);
      part.userData = {
        name: def.name,
        color: def.color,
        explodeDir: def.explodeDir,
        originalPos: part.position.clone(),
      };
      parts[def.key] = part;
      ornithopterGroup.add(part);
    });

    // 设置初始位置
    ornithopterGroup.position.y = 0.5;
    scene.add(ornithopterGroup);
  }

  // ── 创建单个部件 ──
  function createPart(key, color) {
    var group = new THREE.Group();
    var mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.5,
      metalness: 0.4,
    });

    switch (key) {
      case 'fuselage':
        // 机身骨架 - 细长圆柱 + 框架结构
        var bodyGeo = new THREE.CylinderGeometry(0.15, 0.1, 3.5, 8);
        var body = new THREE.Mesh(bodyGeo, mat);
        body.rotation.z = Math.PI / 2;
        body.castShadow = true;
        group.add(body);

        // 框架支撑
        for (var i = -1.2; i <= 1.2; i += 0.6) {
          var ringGeo = new THREE.TorusGeometry(0.18, 0.02, 8, 16);
          var ring = new THREE.Mesh(ringGeo, mat);
          ring.position.x = i;
          ring.rotation.y = Math.PI / 2;
          ring.castShadow = true;
          group.add(ring);
        }

        // 纵向支撑杆
        for (var i = 0; i < 4; i++) {
          var angle = (i / 4) * Math.PI * 2;
          var rodGeo = new THREE.CylinderGeometry(0.015, 0.015, 3.2, 6);
          var rod = new THREE.Mesh(rodGeo, mat);
          rod.position.y = Math.sin(angle) * 0.15;
          rod.position.z = Math.cos(angle) * 0.15;
          rod.rotation.z = Math.PI / 2;
          group.add(rod);
        }
        break;

      case 'cockpit':
        // 驾驶舱 - 半球罩
        var domeGeo = new THREE.SphereGeometry(0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
        var dome = new THREE.Mesh(domeGeo, mat);
        dome.material = new THREE.MeshStandardMaterial({
          color: 0x4A90D9,
          roughness: 0.1,
          metalness: 0.1,
          transparent: true,
          opacity: 0.7,
        });
        dome.position.y = 0.2;
        dome.castShadow = true;
        group.add(dome);

        // 底座
        var baseGeo = new THREE.CylinderGeometry(0.35, 0.3, 0.15, 16);
        var base = new THREE.Mesh(baseGeo, mat);
        base.position.y = 0.05;
        group.add(base);
        break;

      case 'leftWing':
        group.add(createWing(mat, 1));
        break;

      case 'rightWing':
        group.add(createWing(mat, -1));
        break;

      case 'tailWing':
        // 尾翼 - 垂直翼面
        var tailShape = new THREE.Shape();
        tailShape.moveTo(0, 0);
        tailShape.lineTo(0, 0.8);
        tailShape.lineTo(0.5, 0.6);
        tailShape.lineTo(0.5, 0.1);
        tailShape.closePath();

        var tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.03, bevelEnabled: false });
        var tail = new THREE.Mesh(tailGeo, mat);
        tail.position.set(0, 0, -1.6);
        tail.castShadow = true;
        group.add(tail);

        // 水平尾翼
        var hTailShape = new THREE.Shape();
        hTailShape.moveTo(0, 0);
        hTailShape.lineTo(0.8, 0);
        hTailShape.lineTo(0.6, 0.3);
        hTailShape.lineTo(0, 0.3);
        hTailShape.closePath();

        var hTailGeo = new THREE.ExtrudeGeometry(hTailShape, { depth: 0.02, bevelEnabled: false });
        var hTail = new THREE.Mesh(hTailGeo, mat);
        hTail.rotation.x = Math.PI / 2;
        hTail.position.set(0, 0, -1.6);
        hTail.castShadow = true;
        group.add(hTail);
        break;

      case 'landingGear':
        // 起落架 - 三个轮子
        var wheelPositions = [
          new THREE.Vector3(0, -0.6, 1),
          new THREE.Vector3(-0.5, -0.6, -0.8),
          new THREE.Vector3(0.5, -0.6, -0.8),
        ];

        wheelPositions.forEach(function (pos) {
          // 支撑柱
          var strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6);
          var strut = new THREE.Mesh(strutGeo, mat);
          strut.position.copy(pos);
          strut.position.y += 0.25;
          group.add(strut);

          // 轮子
          var wheelGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12);
          var wheel = new THREE.Mesh(wheelGeo, mat);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.copy(pos);
          wheel.castShadow = true;
          group.add(wheel);
        });

        // 连接横杆
        var barGeo = new THREE.CylinderGeometry(0.015, 0.015, 1, 6);
        var bar = new THREE.Mesh(barGeo, mat);
        bar.rotation.z = Math.PI / 2;
        bar.position.set(0, -0.6, -0.8);
        group.add(bar);
        break;

      case 'mechanism':
        // 扑翼机构 - 曲柄连杆
        // 中央曲柄
        var crankGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
        var crank = new THREE.Mesh(crankGeo, mat);
        crank.rotation.z = Math.PI / 2;
        crank.position.set(0, -0.3, 0);
        group.add(crank);

        // 曲柄臂 + 连杆
        for (var side = -1; side <= 1; side += 2) {
          var armGeo = new THREE.BoxGeometry(0.04, 0.25, 0.04);
          var arm = new THREE.Mesh(armGeo, mat);
          arm.position.set(side * 0.15, -0.2, 0);
          group.add(arm);

          var linkGeo = new THREE.BoxGeometry(0.03, 0.4, 0.03);
          var link = new THREE.Mesh(linkGeo, mat);
          link.position.set(side * 0.25, 0, 0);
          link.rotation.z = side * 0.3;
          group.add(link);

          var jointGeo = new THREE.SphereGeometry(0.04, 8, 8);
          var joint = new THREE.Mesh(jointGeo, mat);
          joint.position.set(side * 0.35, 0.15, 0);
          group.add(joint);
        }
        break;

      case 'propeller':
        // 尾桨 - 螺旋桨
        var propHub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8),
          mat
        );
        propHub.rotation.z = Math.PI / 2;
        propHub.position.set(0, 0, -2);
        group.add(propHub);

        // 桨叶
        for (var i = 0; i < 3; i++) {
          var bladeGeo = new THREE.BoxGeometry(0.02, 0.3, 0.08);
          var blade = new THREE.Mesh(bladeGeo, mat);
          blade.position.set(0, 0.15, -2);
          blade.rotation.x = (i / 3) * Math.PI * 2;
          group.add(blade);
        }
        break;
    }

    return group;
  }

  // ── 创建机翼 ──
  function createWing(mat, side) {
    var wingGroup = new THREE.Group();

    // 主翼面
    var wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(side * 2.5, 0.3);
    wingShape.lineTo(side * 2.8, 0);
    wingShape.lineTo(side * 2.5, -0.2);
    wingShape.lineTo(0, -0.1);
    wingShape.closePath();

    var wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
    });

    var wing = new THREE.Mesh(wingGeo, mat);
    wing.castShadow = true;
    wingGroup.add(wing);

    // 翼梁
    var sparGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.2, 6);
    var spar = new THREE.Mesh(sparGeo, mat);
    spar.rotation.z = Math.PI / 2;
    spar.position.set(side * 1.1, 0, 0.02);
    wingGroup.add(spar);

    // 翼肋
    for (var i = 0.5; i < 2.5; i += 0.5) {
      var ribGeo = new THREE.BoxGeometry(0.02, 0.15, 0.05);
      var rib = new THREE.Mesh(ribGeo, mat);
      rib.position.set(side * i, 0, 0.02);
      wingGroup.add(rib);
    }

    return wingGroup;
  }

  // ── 填充部件列表 ──
  function populatePartsList() {
    var list = document.getElementById('partsList');
    PART_DEFS.forEach(function (def) {
      var item = document.createElement('div');
      item.className = 'part-item';
      item.innerHTML =
        '<div class="part-color" style="background: #' + def.color.toString(16).padStart(6, '0') + '"></div>' +
        '<span>' + def.name + '</span>';
      item.addEventListener('mouseenter', function () { highlightPart(def.key); });
      item.addEventListener('mouseleave', function () { clearHighlight(); });
      list.appendChild(item);
    });
  }

  // ── 高亮部件 ──
  function highlightPart(key) {
    clearHighlight();
    var part = parts[key];
    if (!part) return;

    hoveredPart = key;
    part.traverse(function (child) {
      if (child.isMesh) {
        child.material.emissive = new THREE.Color(0x00d4ff);
        child.material.emissiveIntensity = 0.3;
      }
    });

    var tooltip = document.getElementById('tooltip');
    tooltip.textContent = part.userData.name;
    tooltip.classList.add('visible');
  }

  function clearHighlight() {
    if (hoveredPart && parts[hoveredPart]) {
      parts[hoveredPart].traverse(function (child) {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 0;
        }
      });
    }
    hoveredPart = null;
    document.getElementById('tooltip').classList.remove('visible');
  }

  // ── 鼠标事件 ──
  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    var tooltip = document.getElementById('tooltip');
    tooltip.style.left = event.clientX + 15 + 'px';
    tooltip.style.top = event.clientY + 15 + 'px';
  }

  function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
    var allMeshes = [];
    Object.values(parts).forEach(function (part) {
      part.traverse(function (child) {
        if (child.isMesh) allMeshes.push(child);
      });
    });

    var intersects = raycaster.intersectObjects(allMeshes);
    if (intersects.length > 0) {
      var clicked = intersects[0].object;
      for (var key in parts) {
        var found = false;
        parts[key].traverse(function (child) {
          if (child === clicked) found = true;
        });
        if (found) {
          highlightPart(key);
          setTimeout(clearHighlight, 1500);
          break;
        }
      }
    }
  }

  // ── 窗口大小变化 ──
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ── 爆炸图切换 ──
  window.toggleExplode = function () {
    isExploded = !isExploded;
    var btn = document.getElementById('btn-explode');
    btn.classList.toggle('active', isExploded);

    var duration = 800;
    var startTime = Date.now();

    var startPositions = {};
    var targetPositions = {};

    Object.keys(parts).forEach(function (key) {
      startPositions[key] = parts[key].position.clone();
      if (isExploded) {
        targetPositions[key] = parts[key].userData.originalPos.clone().add(parts[key].userData.explodeDir);
      } else {
        targetPositions[key] = parts[key].userData.originalPos.clone();
      }
    });

    function animateExplode() {
      var elapsed = Date.now() - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);

      Object.keys(parts).forEach(function (key) {
        parts[key].position.lerpVectors(startPositions[key], targetPositions[key], eased);
      });

      if (progress < 1) {
        requestAnimationFrame(animateExplode);
      }
    }

    animateExplode();
  };

  // ── 自动旋转切换 ──
  window.toggleAutoRotate = function () {
    autoRotate = !autoRotate;
    controls.autoRotate = autoRotate;
    document.getElementById('btn-rotate').classList.toggle('active', autoRotate);
  };

  // ── 重置视角 ──
  window.resetCamera = function () {
    camera.position.set(6, 3, 8);
    controls.target.set(0, 0, 0);
    controls.update();
  };

  // ── 线框模式切换 ──
  window.toggleWireframe = function () {
    wireframeMode = !wireframeMode;
    document.getElementById('btn-wireframe').classList.toggle('active', wireframeMode);

    Object.values(parts).forEach(function (part) {
      part.traverse(function (child) {
        if (child.isMesh) {
          child.material.wireframe = wireframeMode;
        }
      });
    });
  };

  // ── 动画循环 ──
  function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    controls.update();

    // 扑翼动画
    if (!isExploded && parts.leftWing && parts.rightWing) {
      var time = clock.getElapsedTime();
      var flapAngle = Math.sin(time * 2) * 0.3;
      parts.leftWing.rotation.z = flapAngle;
      parts.rightWing.rotation.z = -flapAngle;

      if (parts.mechanism) {
        parts.mechanism.rotation.y = Math.sin(time * 2) * 0.1;
      }
    }

    // 尾桨旋转
    if (parts.propeller) {
      parts.propeller.children.forEach(function (child) {
        if (child.geometry && child.geometry.type === 'BoxGeometry') {
          child.rotation.x += 0.1;
        }
      });
    }

    // FPS 计数
    var fps = Math.round(1 / delta);
    document.getElementById('fps-counter').textContent = fps;

    renderer.render(scene, camera);
  }

  // ── 全局错误处理 ──
  window.addEventListener('error', function (e) {
    var loading = document.getElementById('loading');
    if (loading) {
      loading.innerHTML = '<div style="color:#ff6b6b;font-size:1.2rem;margin-bottom:8px">⚠️ 加载出错</div>' +
        '<p style="color:#aaa;font-size:0.85rem">' + (e.message || '请检查网络连接后刷新页面') + '</p>';
    }
  });

  // ── 超时保底 ──
  setTimeout(function () {
    var loading = document.getElementById('loading');
    if (loading && !loading.classList.contains('fade-out')) {
      loading.innerHTML = '<div style="color:#ffcc00;font-size:1.2rem;margin-bottom:8px">⏳ 加载较慢</div>' +
        '<p style="color:#aaa;font-size:0.85rem">Three.js 文件较大（~600KB），请等待或刷新页面重试</p>';
    }
  }, 5000);

  // ── 启动（确保 THREE 全局可用） ──
  if (typeof THREE !== 'undefined') {
    init();
  } else {
    // 如果 THREE 还没加载完（经典 script 同步加载不应发生此情况）
    window.addEventListener('load', function () {
      if (typeof THREE !== 'undefined') init();
    });
  }
})();
