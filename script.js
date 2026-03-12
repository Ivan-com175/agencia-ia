document.addEventListener("DOMContentLoaded", () => {
    
    // 1. CURSOR PERSONALIZADO PREMIUM
    const cursor = document.getElementById('custom-cursor');
    if (cursor && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        const clickables = document.querySelectorAll('a, button, input, .accordion-header, .auth-tab');
        clickables.forEach(item => {
            item.addEventListener('mouseenter', () => cursor.classList.add('hover-effect'));
            item.addEventListener('mouseleave', () => cursor.classList.remove('hover-effect'));
        });
    } else if (cursor) {
        cursor.style.display = 'none';
    }

    // 2. EFECTO DE ESCRITURA ANIMADA
    const typedTextSpan = document.querySelector(".typed-text");
    if (typedTextSpan) {
        const textArray = ["AUTOMATIZACIÓN.", "PERSONALIZACIÓN.", "RESULTADOS REALES."];
        let textArrayIndex = 0; let charIndex = 0;
        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++; setTimeout(type, 80);
            } else { setTimeout(erase, 2500); }
        }
        function erase() {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--; setTimeout(erase, 40);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, 500);
            }
        }
        setTimeout(type, 1000);
    }

    // 3. MOTOR DE PARTÍCULAS
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const parentSection = canvas.parentElement; 
        canvas.width = window.innerWidth; canvas.height = parentSection.offsetHeight;
        let particlesArray = [];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5; this.speedX = (Math.random() * 0.8) - 0.4; 
                this.speedY = (Math.random() * 0.8) - 0.4; this.color = Math.random() > 0.5 ? '#00ffff' : '#8a2be2'; 
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color; ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
        }
        function initParticles() {
            particlesArray = []; let numParticles = (canvas.width * canvas.height) / 12000; 
            for (let i = 0; i < numParticles; i++) particlesArray.push(new Particle());
        }
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update(); particlesArray[i].draw();
                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x; const dy = particlesArray[i].y - particlesArray[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath(); ctx.strokeStyle = `rgba(0, 255, 255, ${0.8 - dist/100})`; 
                        ctx.lineWidth = 0.3; ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y); ctx.stroke(); ctx.closePath();
                    }
                }
            }
            requestAnimationFrame(animateParticles); 
        }
        initParticles(); animateParticles();
        window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = parentSection.offsetHeight; initParticles(); });
    }

    // 4. ANIMACIONES FADE-IN
    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
    if (sectionsToAnimate.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } });
        }, { threshold: 0.15 });
        sectionsToAnimate.forEach(sec => observer.observe(sec));
    }

    // 5. CONTADORES ANIMADOS
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        let hasCounted = false;
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true;
                    counters.forEach(counter => {
                        const updateCount = () => {
                            const target = +counter.getAttribute('data-target'); const count = +counter.innerText; const inc = target / 50; 
                            if (count < target) { counter.innerText = Math.ceil(count + inc); setTimeout(updateCount, 40); } else { counter.innerText = target; }
                        };
                        updateCount();
                    });
                }
            });
        }, { threshold: 0.5 });
        const statsSection = document.querySelector('.stats');
        if (statsSection) counterObserver.observe(statsSection);
    }

    // 6. SIMULADOR IA
    const aiForm = document.getElementById('ai-form');
    const resultArea = document.getElementById('result-area');
    if (aiForm) {
        aiForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const product = document.getElementById('product').value;
            const audience = document.getElementById('audience').value;
            const submitBtn = aiForm.querySelector('button[type="submit"]');
            
            resultArea.classList.remove('hidden'); submitBtn.textContent = "PROCESANDO..."; submitBtn.style.opacity = "0.7";
            resultArea.innerHTML = `<span style="color: var(--accent-cyan);">Iniciando agentes para analizar <strong>${product}</strong>...</span>`;
            
            setTimeout(() => {
                resultArea.innerHTML = `
                    <span style="color: var(--accent-violet); font-weight: 500;">✓ Copy Generado Exitosamente:</span><br><br>
                    "¿Buscas llevar tu rendimiento al límite? Descubre el <strong>${product}</strong> diseñado para <strong>${audience}</strong> que no se conforman con lo ordinario. Domina tu rutina hoy."
                `;
                submitBtn.textContent = "GENERAR NUEVO COPY"; submitBtn.style.opacity = "1";
            }, 2000);
        });
    }

    // 7. ACORDEÓN FAQ
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                header.classList.toggle('active');
                const content = header.nextElementSibling;
                content.style.maxHeight = header.classList.contains('active') ? content.scrollHeight + "px" : 0;
                accordionHeaders.forEach(other => {
                    if (other !== header && other.classList.contains('active')) {
                        other.classList.remove('active'); other.nextElementSibling.style.maxHeight = 0;
                    }
                });
            });
        });
    }

    // 8. MODO CLARO / OSCURO
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        if (localStorage.getItem('theme') === 'light') { document.body.setAttribute('data-theme', 'light'); themeIcon.classList.replace('fa-sun', 'fa-moon'); }
        themeToggleBtn.addEventListener('click', () => {
            if (document.body.getAttribute('data-theme') === 'light') {
                document.body.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark'); themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                document.body.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // 9. BOTÓN VOLVER ARRIBA
    const scrollTopBtn = document.getElementById('scroll-to-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => { scrollTopBtn.classList.toggle('hidden', window.scrollY <= 400); });
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // 10. LOGIN Y REGISTRO
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    if (tabLogin && tabRegister && formLogin && formRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active'); tabRegister.classList.remove('active');
            formLogin.classList.add('active'); formLogin.classList.remove('hidden');
            formRegister.classList.remove('active'); formRegister.classList.add('hidden');
        });
        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active'); tabLogin.classList.remove('active');
            formRegister.classList.add('active'); formRegister.classList.remove('hidden');
            formLogin.classList.remove('active'); formLogin.classList.add('hidden');
        });
    }

    // 11. SISTEMA DE CARRITO DE COMPRAS
    const cartToggleBtn = document.getElementById('cart-toggle');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartBadges = document.querySelectorAll('.badge-count'); 
    
    let cart = JSON.parse(localStorage.getItem('neuralmark_cart')) || [];

    // Función global para poder abrir el carrito desde el botón del menú directamente
    window.toggleCart = function() {
        if(cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('active');
            cartOverlay.classList.toggle('active');
            document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
        }
    }

    if(cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    function updateCartUI() {
        if(!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>€${item.price}</p>
                    </div>
                    <button class="remove-item" data-index="${index}" aria-label="Eliminar producto">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        if(cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align:center; padding-top: 50px; color: var(--text-muted);">
                    <i class="fas fa-shopping-basket" style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>Tu carrito está vacío.</p>
                </div>`;
        }
        
        if(cartTotalPrice) cartTotalPrice.innerText = `€${total}`;
        
        cartBadges.forEach(badge => {
            badge.innerText = cart.length;
            badge.style.transform = 'scale(1.5)';
            setTimeout(() => badge.style.transform = 'scale(1)', 200);
        });
        
        localStorage.setItem('neuralmark_cart', JSON.stringify(cart));

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                cart.splice(index, 1);
                updateCartUI(); 
            });
        });
    }

    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            
            cart.push({ id, name, price });
            updateCartUI();
            
            const originalText = e.target.innerHTML;
            e.target.innerHTML = `<i class="fas fa-check"></i> ¡Añadido!`;
            e.target.style.background = "linear-gradient(45deg, #28a745, #20c997)"; 
            
            if(cartSidebar && !cartSidebar.classList.contains('active')) {
                toggleCart();
            }

            setTimeout(() => {
                e.target.innerHTML = originalText;
                e.target.style.background = ""; 
            }, 2000);
        });
    });

    updateCartUI();

    // =========================================
    // 12. LÓGICA DE LA PÁGINA DE CHECKOUT
    // =========================================
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');

    if(checkoutItemsContainer && checkoutTotalPrice) {
        // Leemos el carrito de la memoria
        let checkoutCart = JSON.parse(localStorage.getItem('neuralmark_cart')) || [];
        let total = 0;
        
        if (checkoutCart.length === 0) {
            checkoutItemsContainer.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No tienes productos en tu pedido.</p>';
        } else {
            // Dibujamos cada producto en la lista del recibo
            checkoutCart.forEach(item => {
                total += item.price;
                checkoutItemsContainer.innerHTML += `
                    <div class="checkout-item">
                        <span class="checkout-item-name">${item.name}</span>
                        <span class="checkout-item-price">€${item.price}</span>
                    </div>
                `;
            });
        }
        
        // Ponemos el precio total
        checkoutTotalPrice.innerText = `€${total}`;
        
        // Simular el proceso de pago al enviar el formulario
        const checkoutForm = document.getElementById('checkout-form');
        if(checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Evitamos que la página se recargue
                
                if(checkoutCart.length === 0) {
                    alert("Añade algún producto al carrito antes de pagar.");
                    return;
                }

                const btn = checkoutForm.querySelector('button[type="submit"]');
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando pago con el banco...';
                btn.style.opacity = '0.7';
                
                // Simulamos una espera de 2.5 segundos de carga
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Pago Completado con Éxito';
                    btn.style.background = "linear-gradient(45deg, #28a745, #20c997)";
                    btn.style.opacity = '1';
                    
                    // Vaciamos el carrito porque ya se ha comprado
                    localStorage.removeItem('neuralmark_cart'); 
                    
                    // Redirigimos al inicio después de 2 segundos de éxito
                    setTimeout(() => {
                        window.location.href = 'index.html'; 
                    }, 2000);
                }, 2500);
            });
        }
    }
});