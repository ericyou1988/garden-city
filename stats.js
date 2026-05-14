/**
 * Garden City - Demo 访问统计模块
 * 使用 localStorage 存储访问数据（纯静态方案，无后端依赖）
 *
 * 使用方法：
 *   在主页 index.html 中引入本脚本后调用 GardenStats.renderCards()
 *   在 demo 页面中引入本脚本后调用 GardenStats.trackVisit('demo-id')
 */
const GardenStats = (function () {
  'use strict';

  const STORAGE_KEY = 'garden-city-stats';

  // ── 内部工具 ──

  /**
   * 读取所有统计数据
   * 结构: { "demo-id": { count: Number, lastVisit: ISO-String } }
   */
  function _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  /**
   * 保存统计数据
   */
  function _save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage 满或不可用时静默失败
    }
  }

  /**
   * 格式化数字：1234 → "1,234"
   */
  function _formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * 格式化日期：ISO 字符串 → "2024-01-15"
   */
  function _formatDate(isoStr) {
    if (!isoStr) return '';
    try {
      var d = new Date(isoStr);
      var y = d.getFullYear();
      var m = ('0' + (d.getMonth() + 1)).slice(-2);
      var day = ('0' + d.getDate()).slice(-2);
      return y + '-' + m + '-' + day;
    } catch (e) {
      return '';
    }
  }

  // ── 公开 API ──

  /**
   * 记录一次访问（在 demo 页面调用）
   * @param {string} demoId - demo 的唯一标识，通常用目录名如 "3d-earth"
   */
  function trackVisit(demoId) {
    if (!demoId) return;
    var data = _load();
    if (!data[demoId]) {
      data[demoId] = { count: 0, lastVisit: null };
    }
    data[demoId].count += 1;
    data[demoId].lastVisit = new Date().toISOString();
    _save(data);
  }

  /**
   * 获取某个 demo 的统计数据
   * @param {string} demoId
   * @returns {{ count: number, lastVisit: string|null }}
   */
  function getStats(demoId) {
    var data = _load();
    return data[demoId] || { count: 0, lastVisit: null };
  }

  /**
   * 获取所有 demo 的统计数据
   * @returns {Object}
   */
  function getAllStats() {
    return _load();
  }

  /**
   * 为页面上的所有 demo 卡片注入访问统计
   * 卡片需要有 data-demo-id 属性来标识 demo
   * 调用此方法后会在每张卡片末尾追加统计信息元素
   */
  function renderCards() {
    var cards = document.querySelectorAll('.demo-card[data-demo-id]');
    var allStats = _load();

    cards.forEach(function (card) {
      var demoId = card.getAttribute('data-demo-id');
      var stat = allStats[demoId] || { count: 0, lastVisit: null };

      // 避免重复注入
      if (card.querySelector('.demo-stats')) return;

      var statsEl = document.createElement('div');
      statsEl.className = 'demo-stats';
      statsEl.innerHTML =
        '<span class="stats-visits">👁 ' + _formatNumber(stat.count) + ' 次访问</span>' +
        (stat.lastVisit
          ? '<span class="stats-date">最近访问 ' + _formatDate(stat.lastVisit) + '</span>'
          : '');

      card.appendChild(statsEl);
    });
  }

  /**
   * 从当前页面 URL 推断 demoId
   * 适用于 demos/xxx/index.html → 返回 "xxx"
   * @returns {string|null}
   */
  function inferDemoId() {
    var path = window.location.pathname;
    // 匹配 /demos/<id>/ 或 /demos/<id>/index.html
    var match = path.match(/\/demos\/([^\/]+)\//);
    return match ? match[1] : null;
  }

  /**
   * 便捷方法：自动检测当前 demo 页面并记录访问
   */
  function autoTrack() {
    var demoId = inferDemoId();
    if (demoId) {
      trackVisit(demoId);
    }
  }

  // 公开接口
  return {
    trackVisit: trackVisit,
    getStats: getStats,
    getAllStats: getAllStats,
    renderCards: renderCards,
    inferDemoId: inferDemoId,
    autoTrack: autoTrack,
  };
})();
