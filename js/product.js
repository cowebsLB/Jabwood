// Product Page Dynamic Loader
let productsData = null;

// Category display names
const categoryNames = {
    'hardwoods': 'Hard Woods',
    'softwoods': 'Soft Woods',
    'panels': 'Wood-Based Panels'
};

// Get product ID from URL
function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load products data
async function loadProducts() {
    try {
        const response = await fetch('js/products.json');
        const data = await response.json();
        productsData = data.products;
        return true;
    } catch (error) {
        console.error('Error loading products:', error);
        return false;
    }
}

// Find product by ID
function findProduct(productId) {
    if (!productsData) return null;
    return productsData.find(p => p.id === productId);
}

// Render product badges
function renderBadges(badges) {
    if (!badges || badges.length === 0) return '';
    
    const badgeColors = [
        'bg-wood-500 text-white',
        'bg-stone-900 text-white',
        'bg-wood-800 text-white'
    ];
    
    return badges.map((badge, index) => {
        const colorClass = badgeColors[index % badgeColors.length];
        return `<span class="${colorClass} px-4 py-2 rounded-full text-sm">${badge}</span>`;
    }).join('');
}

// Render about section
function renderAbout(about) {
    if (!about) return '';
    
    let html = '';
    
    // Render paragraphs
    if (about.paragraphs && about.paragraphs.length > 0) {
        html += about.paragraphs.map(p => 
            `<p class="text-gray-700 mb-4 leading-relaxed">${p}</p>`
        ).join('');
    }
    
    // Render features
    if (about.features && about.features.length > 0) {
        html += '<h3 class="text-xl font-bold text-wood-500 mb-4">Key Features:</h3>';
        html += '<ul class="list-disc list-inside text-gray-700 mb-4 space-y-2">';
        html += about.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');
        html += '</ul>';
    }
    
    return html;
}

// Render specifications
function renderSpecifications(specs) {
    if (!specs || Object.keys(specs).length === 0) return '';
    
    return Object.entries(specs).map(([key, value]) => `
        <div class="flex justify-between">
            <span class="text-gray-600">${key}:</span>
            <span class="font-medium">${value}</span>
        </div>
    `).join('');
}

// Render applications
function renderApplications(applications) {
    if (!applications || Object.keys(applications).length === 0) return '';
    
    return Object.entries(applications).map(([category, items]) => `
        <div>
            <h3 class="text-lg font-semibold text-wood-500 mb-3">${category}</h3>
            <ul class="text-gray-700 space-y-1">
                ${items.map(item => `<li>• ${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// Render related products
function renderRelated(relatedIds) {
    if (!relatedIds || relatedIds.length === 0) return '';
    
    const relatedProducts = relatedIds
        .map(id => productsData.find(p => p.id === id))
        .filter(p => p !== undefined)
        .slice(0, 4); // Limit to 4 related products
    
    if (relatedProducts.length === 0) return '';
    
    return relatedProducts.map(product => `
        <a href="product.html?id=${product.id}" class="block text-gray-700 hover:text-wood-500 transition-colors">${product.name}</a>
    `).join('');
}

// Update page metadata
function updatePageMetadata(product) {
    // Update title
    document.getElementById('page-title').textContent = `${product.name} - Jabwood`;
    
    // Update meta description
    const metaDesc = document.getElementById('page-description');
    if (metaDesc) {
        metaDesc.setAttribute('content', product.subtitle || product.description || `Premium ${product.name} from Jabwood.`);
    }
    
    // Update loader text
    const loaderWord = document.getElementById('loader-word');
    if (loaderWord) {
        // Extract first word from product name for loader
        const firstWord = product.name.split(' ')[0];
        loaderWord.textContent = firstWord;
    }
    
    // Update hero section
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroTitle = document.getElementById('hero-title');
    const heroDescription = document.getElementById('hero-description');
    
    if (heroSubtitle) {
        const categoryText = categoryNames[product.category] || product.category.toUpperCase();
        heroSubtitle.textContent = categoryText;
    }
    
    if (heroTitle) {
        // Split product name and make part of it italic (wood-500 color)
        const nameParts = product.name.split(' ');
        if (nameParts.length > 1) {
            const firstPart = nameParts[0];
            const restParts = nameParts.slice(1).join(' ');
            heroTitle.innerHTML = `${firstPart} <i class="font-serif text-wood-500">${restParts}</i>`;
        } else {
            heroTitle.textContent = product.name;
        }
    }
    
    if (heroDescription) {
        heroDescription.textContent = product.subtitle || product.description || `Premium ${product.name} from Jabwood.`;
    }
}

// Render product
function renderProduct(product) {
    if (!product) {
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('error-state').classList.remove('hidden');
        return;
    }
    
    // Update page metadata
    updatePageMetadata(product);
    
    // Update breadcrumb
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbCategory) {
        const categoryName = categoryNames[product.breadcrumbCategory] || product.category;
        breadcrumbCategory.textContent = categoryName;
        breadcrumbCategory.href = `our-products.html#${product.breadcrumbCategory}`;
    }
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
    }
    
    // Render product name
    const productName = document.getElementById('product-name');
    if (productName) productName.textContent = product.name;
    
    // Render subtitle
    const productSubtitle = document.getElementById('product-subtitle');
    if (productSubtitle) productSubtitle.textContent = product.subtitle || '';
    
    // Render badges
    const productBadges = document.getElementById('product-badges');
    if (productBadges) {
        productBadges.innerHTML = renderBadges(product.badges);
    }
    
    // Render image
    const productImage = document.getElementById('product-image');
    if (productImage) {
        productImage.src = product.image || '';
        productImage.alt = product.name;
    }
    
    // Render about section
    const aboutContent = document.getElementById('about-content');
    if (aboutContent) {
        aboutContent.innerHTML = renderAbout(product.about);
    }
    
    // Render specifications
    const specificationsContent = document.getElementById('specifications-content');
    if (specificationsContent) {
        const specsHtml = renderSpecifications(product.specifications);
        if (specsHtml) {
            specificationsContent.innerHTML = specsHtml;
        } else {
            specificationsContent.parentElement.style.display = 'none';
        }
    }
    
    // Render applications
    const applicationsContent = document.getElementById('applications-content');
    if (applicationsContent) {
        const appsHtml = renderApplications(product.applications);
        if (appsHtml) {
            applicationsContent.innerHTML = appsHtml;
        } else {
            document.getElementById('applications-section').style.display = 'none';
        }
    }
    
    // Render related products
    const relatedContent = document.getElementById('related-content');
    if (relatedContent) {
        const relatedHtml = renderRelated(product.related);
        if (relatedHtml) {
            relatedContent.innerHTML = relatedHtml;
        } else {
            document.getElementById('related-section').style.display = 'none';
        }
    }
    
    // Update CTA title
    const ctaTitle = document.getElementById('cta-title');
    if (ctaTitle) {
        ctaTitle.textContent = `Interested in ${product.name}?`;
    }
    
    // Hide loading, show content
    document.getElementById('loading-state').classList.add('hidden');
    document.getElementById('product-details').classList.remove('hidden');
}

// Initialize product page
async function initProductPage() {
    const productId = getProductId();
    
    if (!productId) {
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('error-state').classList.remove('hidden');
        return;
    }
    
    // Load products data
    const loaded = await loadProducts();
    if (!loaded) {
        document.getElementById('loading-state').classList.add('hidden');
        document.getElementById('error-state').classList.remove('hidden');
        return;
    }
    
    // Find and render product
    const product = findProduct(productId);
    renderProduct(product);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPage);
} else {
    initProductPage();
}

