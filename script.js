document.addEventListener("DOMContentLoaded", () => {
    
    // 1. CURSOR
    const cursor = document.getElementById('custom-cursor');
    if (cursor && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
        });
        document.querySelectorAll('a, button, input, .auth-tab').forEach(item => {
            item.addEventListener('mouseenter', () => cursor.classList.add('hover-effect'));
            item.addEventListener('mouseleave', () => cursor.classList.remove('hover-effect'));
        });
    } else if (cursor) { cursor.style.display = 'none'; }

    // 2. EFECTO ESCRITURA INMOBILIARIA
    const typedTextSpan = document.querySelector(".typed-text");
    if (typedTextSpan) {
        const textArray = ["ATRAE EXCLUSIVAS.", "CERO PUERTA FRÍA.", "MÉTODO TRIPLE 'A'."];
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
                textArrayIndex++; if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, 500);
            }
        }
        setTimeout(type, 1000);
    }

    // 3. PARTÍCULAS
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

    // 4. SCROLL ANIMATION
    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
    if (sectionsToAnimate.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } });
        }, { threshold: 0.15 });
        sectionsToAnimate.forEach(sec => observer.observe(sec));
    }

    // 5. CONTADORES
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

    // 6. SIMULADOR IA INMOBILIARIO
    const aiForm = document.getElementById('ai-form');
    const resultArea = document.getElementById('result-area');
    if (aiForm) {
        aiForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const product = document.getElementById('product').value;
            const audience = document.getElementById('audience').value;
            const submitBtn = aiForm.querySelector('button[type="submit"]');
            
            resultArea.classList.remove('hidden'); submitBtn.textContent = "ESCRIBIENDO PROMPT..."; submitBtn.style.opacity = "0.7";
            resultArea.innerHTML = `<span style="color: var(--accent-cyan);">Aplicando Ingeniería de Prompts para ${product} en ${audience}...</span>`;
            
            setTimeout(() => {
                resultArea.innerHTML = `
                    <span style="color: var(--accent-violet); font-weight: 500;">✓ Gancho Generado Exitosamente:</span><br><br>
                    "Los precios en ${audience} acaban de marcar un nuevo récord este trimestre. Si eres propietario de un ${product}, probablemente tu vivienda vale hoy un 15% más que hace un año. ¿Quieres saber su valor exacto actual sin compromiso? Contáctame y te enviaré un informe predictivo en 24h."
                `;
                submitBtn.textContent = "GENERAR NUEVO GANCHO"; submitBtn.style.opacity = "1";
            }, 2000);
        });
    }

    // 7. SCROLL TOP
    const scrollTopBtn = document.getElementById('scroll-to-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => { scrollTopBtn.classList.toggle('hidden', window.scrollY <= 400); });
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // 8. TABS (LOGIN Y REGISTRO)
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

    // 9. CARRITO DE COMPRAS
    const cartToggleBtn = document.getElementById('cart-toggle');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartBadges = document.querySelectorAll('.badge-count'); 
    
    let cart = JSON.parse(localStorage.getItem('neuralmark_cart')) || [];

    window.toggleCart = function() {
        if(cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('active'); cartOverlay.classList.toggle('active');
            document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
        }
    }

    if(cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    function updateCartUI() {
        if(!cartItemsContainer) return;
        cartItemsContainer.innerHTML = ''; let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info"><h4>${item.name}</h4><p>€${item.price}</p></div>
                    <button class="remove-item" data-index="${index}" aria-label="Eliminar producto"><i class="fas fa-trash"></i></button>
                </div>`;
        });
        
        if(cart.length === 0) {
            cartItemsContainer.innerHTML = `<div style="text-align:center; padding-top: 50px; color: var(--text-muted);"><i class="fas fa-shopping-basket" style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;"></i><p>Tu carrito está vacío.</p></div>`;
        }
        
        if(cartTotalPrice) cartTotalPrice.innerText = `€${total}`;
        cartBadges.forEach(badge => { badge.innerText = cart.length; badge.style.transform = 'scale(1.5)'; setTimeout(() => badge.style.transform = 'scale(1)', 200); });
        localStorage.setItem('neuralmark_cart', JSON.stringify(cart));

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart.splice(e.currentTarget.getAttribute('data-index'), 1); updateCartUI(); 
            });
        });
    }

    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id'); const name = e.target.getAttribute('data-name'); const price = parseFloat(e.target.getAttribute('data-price'));
            cart.push({ id, name, price }); updateCartUI();
            
            const originalText = e.target.innerHTML;
            e.target.innerHTML = `<i class="fas fa-check"></i> ¡Añadido!`;
            e.target.style.background = "linear-gradient(45deg, #28a745, #20c997)"; 
            if(cartSidebar && !cartSidebar.classList.contains('active')) { toggleCart(); }
            setTimeout(() => { e.target.innerHTML = originalText; e.target.style.background = ""; }, 2000);
        });
    });

    updateCartUI();

    // 10. LÓGICA DE CHECKOUT (PAGO)
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalPriceFinal = document.getElementById('checkout-total-price');

    if(checkoutItemsContainer && checkoutTotalPriceFinal) {
        let checkoutCart = JSON.parse(localStorage.getItem('neuralmark_cart')) || [];
        let total = 0;
        
        if (checkoutCart.length === 0) {
            checkoutItemsContainer.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No tienes productos en tu pedido.</p>';
        } else {
            checkoutCart.forEach(item => {
                total += item.price;
                checkoutItemsContainer.innerHTML += `<div class="checkout-item"><span class="checkout-item-name">${item.name}</span><span class="checkout-item-price">€${item.price}</span></div>`;
            });
        }
        
        checkoutTotalPriceFinal.innerText = `€${total}`;
        
        const checkoutForm = document.getElementById('checkout-form');
        if(checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault(); 
                if(checkoutCart.length === 0) { alert("Añade algún producto al carrito antes de pagar."); return; }
                const btn = checkoutForm.querySelector('button[type="submit"]');
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando pago...'; btn.style.opacity = '0.7';
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Pago Completado con Éxito';
                    btn.style.background = "linear-gradient(45deg, #28a745, #20c997)"; btn.style.opacity = '1';
                    
                    localStorage.removeItem('neuralmark_cart'); // Vaciamos el carrito
                    localStorage.setItem('pago_exitoso', 'true'); // <--- LE DAMOS LA LLAVE VIP
                    
                    setTimeout(() => { window.location.href = 'exito.html'; }, 2000); 
                }, 2500);
            });
        }
    }

    // ==========================================
    // 11. GESTIÓN VISUAL DE LA SESIÓN DE USUARIO
    // ==========================================
    const loginLinks = document.querySelectorAll('.login-link');
    const usuarioActivo = localStorage.getItem('ia_user');

    if (usuarioActivo) {
        // Si el usuario está en la memoria, cambiamos los enlaces de login a "Salir"
        loginLinks.forEach(link => {
            link.innerHTML = `<i class="fas fa-user-circle" style="margin-right: 5px;"></i> Salir`;
            link.href = "#"; // Evita que lleve a login.html
            link.style.color = "var(--accent-cyan)";
            link.style.fontWeight = "500";

            // Cuando hacen clic en "Salir", borramos la memoria y recargamos
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('ia_user');
                window.location.href = "index.html"; 
            });
        });
    }
});