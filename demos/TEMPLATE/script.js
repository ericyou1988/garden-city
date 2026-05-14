/**
 * Demo 模板脚本
 * 这是一个简单的示例脚本，展示基本的交互功能
 */

// 获取 DOM 元素
const button = document.getElementById('clickMe');
const output = document.getElementById('output');

// 点击计数器
let clickCount = 0;

// 添加点击事件监听器
button.addEventListener('click', function() {
    clickCount++;
    output.textContent = `您点击了 ${clickCount} 次`;
    
    // 添加动画效果
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Demo 模板已加载');
});