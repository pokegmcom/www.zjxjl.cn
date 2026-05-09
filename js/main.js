document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initBackToTop();
    initCarousel();
    initModal();
});

function initNavigation() {
    var header = document.getElementById('pm-header');
    var menuToggle = document.getElementById('pm-menu-toggle');
    var mobileMenu = document.getElementById('pm-mobile-menu');

    if (!header) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            var isOpen = mobileMenu.classList.contains('active');
            var icon = menuToggle.querySelector('i');

            if (isOpen) {
                mobileMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            } else {
                mobileMenu.classList.add('active');
                menuToggle.setAttribute('aria-expanded', 'true');
                if (icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
        });

        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                var icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
}

function initScrollAnimations() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.pm-fade-in-up').forEach(function(el) {
        observer.observe(el);
    });
}

function initBackToTop() {
    var backToTop = document.getElementById('pm-back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

var carouselInterval;
var currentSlide = 0;

function initCarousel() {
    var track = document.getElementById('pm-carousel-track');
    if (!track) return;

    var items = track.querySelectorAll('.pm-carousel-item');
    var dots = document.querySelectorAll('.pm-carousel-dot');
    var totalSlides = items.length;

    if (totalSlides === 0) return;

    var screenshotTitles = ['3D精灵战斗', '精灵收集', 'Mega进化'];
    var screenshotDescs = ['炫酷战斗特效，热血回合制对决', '800+精灵等你收集，打造专属图鉴', '释放精灵全部潜力，战力飙升'];

    function showSlide(index) {
        items.forEach(function(item, i) {
            item.style.display = i === index ? 'block' : 'none';
        });

        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === index);
        });

        var titleEl = document.getElementById('pm-screenshot-title');
        var descEl = document.getElementById('pm-screenshot-desc');
        if (titleEl && screenshotTitles[index]) {
            titleEl.textContent = screenshotTitles[index];
        }
        if (descEl && screenshotDescs[index]) {
            descEl.textContent = screenshotDescs[index];
        }

        currentSlide = index;
    }

    window.changeSlide = function(direction) {
        var newIndex = (currentSlide + direction + totalSlides) % totalSlides;
        showSlide(newIndex);
    };

    window.goToSlide = function(index) {
        showSlide(index);
    };

    function startAutoPlay() {
        carouselInterval = setInterval(function() {
            changeSlide(1);
        }, 5000);
    }

    function stopAutoPlay() {
        clearInterval(carouselInterval);
    }

    startAutoPlay();

    var carousel = document.getElementById('pm-screenshot-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }

    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });
}

function initModal() {
    var modal = document.getElementById('pm-image-modal');
    if (!modal) return;

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

window.openImageModal = function(src) {
    var modal = document.getElementById('pm-image-modal');
    var img = document.getElementById('pm-modal-image');
    if (!modal || !img) return;

    img.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeImageModal = function() {
    var modal = document.getElementById('pm-image-modal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
};

window.copyCode = function(code) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function() {
            showToast('已复制到剪贴板：' + code);
        }).catch(function() {
            fallbackCopy(code);
        });
    } else {
        fallbackCopy(code);
    }
};

function fallbackCopy(code) {
    var textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        document.execCommand('copy');
        showToast('已复制到剪贴板：' + code);
    } catch (err) {
        showToast('复制失败，请手动复制', 'error');
    }

    document.body.removeChild(textarea);
}

window.showToast = function(message, type) {
    type = type || 'success';

    var toast = document.getElementById('pm-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'pm-toast';
        toast.className = 'pm-toast';
        document.body.appendChild(toast);
    }

    var iconClass = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    toast.innerHTML = '<i class="' + iconClass + '"></i><span>' + message + '</span>';
    toast.className = 'pm-toast ' + (type === 'error' ? 'error' : '');
    toast.classList.add('show');

    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
};

window.shareToWeibo = function() {
    var url = encodeURIComponent(window.location.href);
    var title = encodeURIComponent(document.title);
    window.open('https://service.weibo.com/share/share.php?url=' + url + '&title=' + title, '_blank');
};

window.shareToWechat = function() {
    showToast('请使用微信扫一扫分享');
};

window.copyLink = function() {
    copyCode(window.location.href);
};

window.loadArticles = function(containerId, options) {
    options = options || {};
    var container = document.getElementById(containerId);
    if (!container) return;

    var articles = window.ARTICLES_DATA || [];
    var limit = options.limit || articles.length;
    var showExcerpt = options.showExcerpt !== false;

    var html = '';
    articles.slice(0, limit).forEach(function(article) {
        html += '<div class="col-md-6 col-lg-4">';
        html += '<article class="pm-article-card pm-fade-in-up h-100">';
        html += '<div class="overflow-hidden">';
        html += '<img src="' + (article.image || 'img/screenshots/screenshot-1.png') + '" alt="' + article.title + '" class="pm-article-img" loading="lazy">';
        html += '</div>';
        html += '<div class="pm-article-body">';
        html += '<span class="pm-tag pm-tag-primary mb-2">' + (article.category || '活动') + '</span>';
        html += '<h3 class="pm-article-title">' + article.title + '</h3>';
        if (showExcerpt && article.excerpt) {
            html += '<p class="pm-article-excerpt">' + article.excerpt + '</p>';
        }
        html += '<div class="pm-article-meta">';
        html += '<span><i class="far fa-calendar me-1"></i>' + article.date + '</span>';
        html += '<span><i class="far fa-user me-1"></i>' + (article.author || '官方') + '</span>';
        html += '</div>';
        html += '</div>';
        html += '<a href="' + article.url + '" class="d-block px-4 py-3 border-top text-decoration-none fw-medium" style="color: var(--pm-primary);">';
        html += '查看详情 <i class="fas fa-arrow-right ms-1"></i>';
        html += '</a>';
        html += '</article>';
        html += '</div>';
    });

    container.innerHTML = html;
    initScrollAnimations();
};
