/**
 * 《晴川·映江梦》动画效果脚本
 * 负责滚动触发动画、视差效果、特殊动效
 */

// ==================== 滚动触发动画 ====================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-reveal');
        this.windowHeight = window.innerHeight;
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        // 初始化所有元素
        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        // 绑定滚动事件
        this.checkElements();
        window.addEventListener('scroll', () => this.checkElements());
        window.addEventListener('resize', () => {
            this.windowHeight = window.innerHeight;
            this.checkElements();
        });
    }
    
    checkElements() {
        this.elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top;
            const elementBottom = rect.bottom;
            
            // 元素进入视口
            if (elementTop < this.windowHeight * 0.9 && elementBottom > 0) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }
}

// ==================== 视差滚动效果 ====================
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.parallax');
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            this.elements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// ==================== 数字滚动动画 ====================
class CountUp {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.startValue = 0;
        this.startTime = null;
    }
    
    start() {
        this.startTime = Date.now();
        this.animate();
    }
    
    animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        // 缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(this.target * easeOutQuart);
        
        this.element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.element.textContent = this.target.toLocaleString();
        }
    }
}

// 初始化数字动画
function initCountUpAnimations() {
    const counters = document.querySelectorAll('.count-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.dataset.target);
                const counter = new CountUp(entry.target, target);
                counter.start();
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ==================== 诗句飘动效果 ====================
class FloatingPoem {
    constructor(container) {
        this.container = container;
        this.init();
    }
    
    init() {
        const poems = this.container.querySelectorAll('.poem-line');
        
        poems.forEach((poem, index) => {
            // 随机延迟和持续时间
            const delay = index * 0.3;
            const duration = 3 + Math.random() * 2;
            
            poem.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        });
    }
}

// ==================== 水波纹效果 ====================
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// 为按钮添加水波纹效果
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .card');
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple);
    });
}

// 添加水波纹样式
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(212, 175, 55, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
        }
        25% {
            transform: translateY(-10px) translateX(5px);
        }
        50% {
            transform: translateY(-5px) translateX(-5px);
        }
        75% {
            transform: translateY(-15px) translateX(3px);
        }
    }
`;
document.head.appendChild(rippleStyle);

// ==================== 鼠标跟随光效 ====================
class CursorGlow {
    constructor() {
        this.glow = null;
        this.init();
    }
    
    init() {
        // 创建光效元素
        this.glow = document.createElement('div');
        this.glow.className = 'cursor-glow';
        this.glow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
            pointer-events: none;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            z-index: 9999;
            opacity: 0;
        `;
        document.body.appendChild(this.glow);
        
        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            this.glow.style.left = `${e.clientX}px`;
            this.glow.style.top = `${e.clientY}px`;
            this.glow.style.opacity = '1';
        });
        
        document.addEventListener('mouseleave', () => {
            this.glow.style.opacity = '0';
        });
    }
}

// ==================== 粒子背景效果（轻量版）====================
class ParticleBackground {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 30;
        this.init();
    }
    
    init() {
        const canvas = document.createElement('canvas');
        canvas.width = this.container.offsetWidth;
        canvas.height = this.container.offsetHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.3';
        this.container.appendChild(canvas);
        
        this.ctx = canvas.getContext('2d');
        
        // 创建粒子
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
        
        this.animate();
        
        // 窗口大小改变时调整画布
        window.addEventListener('resize', () => {
            canvas.width = this.container.offsetWidth;
            canvas.height = this.container.offsetHeight;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.particles.forEach(particle => {
            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 边界检测
            if (particle.x < 0 || particle.x > this.ctx.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.ctx.canvas.height) particle.vy *= -1;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==================== 页面加载时初始化所有动画 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 滚动显示动画
    new ScrollReveal();
    
    // 视差效果
    new ParallaxEffect();
    
    // 数字滚动
    initCountUpAnimations();
    
    // 水波纹效果
    initRippleEffect();
    
    // 鼠标光效（可选，可能影响性能）
    // new CursorGlow();
    
    // 诗句飘动
    const poemContainers = document.querySelectorAll('.poem-container');
    poemContainers.forEach(container => new FloatingPoem(container));
    
    // 粒子背景（仅在特定容器中）
    const particleContainers = document.querySelectorAll('.particle-bg');
    particleContainers.forEach(container => new ParticleBackground(container));
});

// ==================== 页面切换动画 ====================
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        document.body.style.opacity = '1';
    }
});

