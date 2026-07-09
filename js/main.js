/* ============================================================
   秸谷新生 — 主脚本文件
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ----- 导航栏滚动效果 -----
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // 滚动时导航栏添加阴影
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 汉堡菜单切换
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // 点击导航链接后关闭菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // 点击页面其他区域关闭菜单
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // ----- 滚动渐入动画 -----
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 为所有卡片元素添加渐入效果
    const animatedElements = document.querySelectorAll(
        '.pain-card, .model-step, .data-card, .swot-card, .strategy-card, ' +
        '.customer-card, .forecast-card, .risk-card, .team-card, .vision-card, ' +
        '.timeline-item, .breakeven-box'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // ----- 数字递增动画 -----
    const animateNumbers = () => {
        document.querySelectorAll('.data-number').forEach(el => {
            const text = el.textContent.trim();
            // 匹配纯数字（可能带%）
            const match = text.match(/^([\d.]+)(.*)$/);
            if (!match) return;

            const target = parseFloat(match[1]);
            const suffix = match[2] || '';
            const isInteger = !match[1].includes('.');

            let current = 0;
            const duration = 1500;
            const startTime = performance.now();

            const update = (timestamp) => {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // ease-out 缓动
                const eased = 1 - Math.pow(1 - progress, 3);
                current = target * eased;

                if (isInteger) {
                    el.textContent = Math.floor(current) + suffix;
                } else {
                    el.textContent = current.toFixed(1) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = text; // 确保最终值精确
                }
            };

            // 使用 IntersectionObserver 在可见时触发
            const numObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(update);
                        numObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });

            numObserver.observe(el);
        });
    };

    animateNumbers();

    // ----- 平滑滚动（兼容不支持 smooth 的浏览器） -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // ----- 导航链接活动状态 -----
    const sections = document.querySelectorAll('section[id]');

    const updateActiveLink = () => {
        let currentId = '';
        const navHeight = navbar.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            if (window.scrollY >= sectionTop) {
                currentId = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);

    // ----- 导航活动样式（CSS 中定义） -----
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: var(--green-primary) !important;
            background: var(--green-bg) !important;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);

});
