// demo.js
const API_URL = 'https://9h1l0p7qr5.execute-api.us-east-1.amazonaws.com/prod/demo';

// Función principal de demo
async function runDemo() {
    const urlInput = document.getElementById('demo-url');
    const btn = document.getElementById('demo-btn');
    const resultDiv = document.getElementById('demo-result');
    const errorDiv = document.getElementById('demo-error');
    const loadingDiv = document.getElementById('demo-loading');

    const url = urlInput.value.trim();
    if (!url) {
        urlInput.focus();
        urlInput.classList.add('ring-2', 'ring-red-300');
        setTimeout(() => urlInput.classList.remove('ring-2', 'ring-red-300'), 2000);
        return;
    }

    // Reset UI
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
    btn.disabled = true;
    btn.textContent = 'Extrayendo...';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Error desconocido');
        }

        // Mostrar resultados
        const mpName = data.marketplace.charAt(0).toUpperCase() + data.marketplace.slice(1);
        document.getElementById('result-marketplace').textContent = mpName;

        document.getElementById('result-price').textContent = data.data.currentPrice
            ? `$${data.data.currentPrice.toLocaleString('es-CO')}`
            : 'No disponible';

        document.getElementById('result-original').textContent = data.data.originalPrice
            ? `$${data.data.originalPrice.toLocaleString('es-CO')}`
            : '-';

        const discountBadge = document.getElementById('discount-badge');
        if (data.data.discount > 0) {
            document.getElementById('result-discount').textContent = `-${data.data.discount}%`;
            discountBadge.classList.remove('hidden');
        } else {
            discountBadge.classList.add('hidden');
        }

        document.getElementById('result-stock').innerHTML = data.data.inStock
            ? '<span class="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">En Stock</span>'
            : '<span class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">Sin Stock</span>';

        document.getElementById('demo-duration').textContent = `Extraído en ${data.durationMs}ms`;

        loadingDiv.classList.add('hidden');
        resultDiv.classList.remove('hidden');

    } catch (error) {
        loadingDiv.classList.add('hidden');
        document.getElementById('error-message').textContent = error.message;
        errorDiv.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.textContent = '🔍 Extraer datos';
    }
}

// Función para cargar lista de URLs
async function loadUrlList() {
    // URLs hardcodeadas para evitar problemas de CORS
    const urls = [
        "https://www.exito.com/iphone-17-pro-max-256gb-plata-esim-104768840-mp/p",
        "https://www.mercadolibre.com.co/apple-iphone-17-pro-max-256-gb-naranja-cosmico/p/MCO55308620",
        "https://www.falabella.com.co/falabella-co/product/139968206/Celular-Xiaomi-Poco-X7-Pro-5G-256Gb-8Ram-50Mp-Negro/139968207"
    ];
    
    const container = document.getElementById('url-list-container');
    
    try {
        // Simular una pequeña demora para mostrar el loading
        await new Promise(resolve => setTimeout(resolve, 300));
        
        container.innerHTML = '';
        
        urls.forEach((url, index) => {
            const urlItem = document.createElement('div');
            urlItem.className = 'flex items-center justify-between bg-white p-3 rounded-lg border';
            urlItem.innerHTML = `
                <span class="text-sm text-slate-600 truncate flex-1 mr-3">${url}</span>
                <button 
                    onclick="loadUrlToInput('${url.replace(/'/g, "\\'")}')"
                    class="bg-[#4f46e5] text-white px-4 py-1 rounded text-xs font-bold hover:bg-[#3730a3] transition"
                >
                    Cargar
                </button>
            `;
            container.appendChild(urlItem);
        });
        
        container.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Función para procesar una URL específica
function processUrl(url) {
    document.getElementById('demo-url').value = url;
    runDemo();
}

// Función para cargar URL en el input sin procesar automáticamente
function loadUrlToInput(url) {
    document.getElementById('demo-url').value = url;
    // Opcional: hacer foco en el input para que el usuario pueda editar si quiere
    document.getElementById('demo-url').focus();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners
    document.getElementById('demo-url').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runDemo();
    });

    // En la función del event listener del checkbox
    document.getElementById('use-url-list').addEventListener('change', function() {
        const section = document.getElementById('url-list-section');
        if (this.checked) {
            section.classList.remove('hidden');
            // Cargar automáticamente las URLs hardcodeadas
            loadUrlList();
        } else {
            section.classList.add('hidden');
            // Limpiar el contenedor cuando se desmarca
            document.getElementById('url-list-container').innerHTML = '';
            document.getElementById('url-list-container').classList.add('hidden');
        }
    });
    
    // Toggle menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
});