// i18n Language System
class I18nSystem {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.applyLanguage();
        this.setupLanguageSwitch();
        
        // Multiple fallbacks to ensure translations are applied
        setTimeout(() => {
            this.applyLanguage();
        }, 100);
        
        setTimeout(() => {
            this.applyLanguage();
        }, 500);
        
        setTimeout(() => {
            this.applyLanguage();
        }, 1000);
    }

    async loadTranslations() {
        try {
            // Determine the correct path based on current location
            const isProductPage = window.location.pathname.includes('/products/');
            const basePath = isProductPage ? '../../js/languages/' : 'js/languages/';
            
            console.log('Loading translations from:', basePath);
            console.log('Current URL:', window.location.href);
            
            const enResponse = await fetch(`${basePath}en.json`);
            const arResponse = await fetch(`${basePath}ar.json`);
            
            console.log('English response status:', enResponse.status);
            console.log('Arabic response status:', arResponse.status);
            
            if (!enResponse.ok) {
                throw new Error(`Failed to load English translations: ${enResponse.status} ${enResponse.statusText}`);
            }
            if (!arResponse.ok) {
                throw new Error(`Failed to load Arabic translations: ${arResponse.status} ${arResponse.statusText}`);
            }
            
            this.translations.en = await enResponse.json();
            this.translations.ar = await arResponse.json();
            
            console.log('Translations loaded successfully');
            console.log('English nav.home:', this.translations.en?.nav?.home);
            console.log('Arabic nav.home:', this.translations.ar?.nav?.home);
            console.log('English products.workability:', this.translations.en?.products?.workability);
            console.log('Arabic products.workability:', this.translations.ar?.products?.workability);
        } catch (error) {
            console.error('Error loading translations:', error);
            // Set fallback translations
            this.translations.en = {};
            this.translations.ar = {};
        }
    }

    getTranslation(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            translation = translation?.[k];
        }
        
        if (!translation) {
            console.warn(`Translation not found for key: ${key}`);
        }
        
        return translation || key;
    }

    translateElement(element) {
        const key = element.getAttribute('data-i18n');
        if (key) {
            const translation = this.getTranslation(key);
            
            // Handle different element types
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'IMG') {
                element.alt = translation;
            } else {
                element.textContent = translation;
            }
        }
    }

    applyLanguage() {
        console.log('Applying language:', this.currentLanguage);
        console.log('Translations available:', !!this.translations[this.currentLanguage]);
        
        // Set document direction
        document.documentElement.setAttribute('dir', this.currentLanguage === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', this.currentLanguage);
        
        // Add language class to body
        document.body.classList.remove('lang-en', 'lang-ar');
        document.body.classList.add(`lang-${this.currentLanguage}`);
        
        // Translate all elements with data-i18n attribute
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        console.log('Found elements to translate:', elementsToTranslate.length);
        
        let translatedCount = 0;
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation && translation !== key) {
                element.textContent = translation;
                translatedCount++;
            }
        });
        
        console.log('Successfully translated:', translatedCount, 'elements');
        
        // Update language switch button text
        const languageText = document.getElementById('language-text');
        const desktopLanguageText = document.getElementById('desktop-language-text');
        
        if (languageText) {
            languageText.textContent = this.currentLanguage === 'en' ? 'العربية' : 'English';
        }
        
        if (desktopLanguageText) {
            desktopLanguageText.textContent = this.currentLanguage === 'en' ? 'العربية' : 'English';
        }
        
        // Update mobile nav modal direction
        this.updateMobileNavDirection();
    }

    updateMobileNavDirection() {
        const modal = document.getElementById('mobile-nav-modal');
        if (modal) {
            if (this.currentLanguage === 'ar') {
                modal.classList.add('rtl-modal');
            } else {
                modal.classList.remove('rtl-modal');
            }
        }
    }

    setupLanguageSwitch() {
        const languageSwitch = document.getElementById('language-switch');
        const desktopLanguageSwitch = document.getElementById('desktop-language-switch');
        
        if (languageSwitch) {
            languageSwitch.addEventListener('click', () => {
                this.switchLanguage();
            });
        }
        
        if (desktopLanguageSwitch) {
            desktopLanguageSwitch.addEventListener('click', () => {
                this.switchLanguage();
            });
        }
    }

    switchLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
        localStorage.setItem('language', this.currentLanguage);
        this.applyLanguage();
        
        // Close mobile menu after language switch
        const mobileMenu = document.getElementById('mobile-nav-modal');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            this.closeMobileMenu();
        }
    }

    closeMobileMenu() {
        // Use the existing closeMobileNav function from main.js
        if (typeof closeMobileNav === 'function') {
            closeMobileNav();
        } else {
            // Fallback if main.js isn't loaded yet
            const mobileMenu = document.getElementById('mobile-nav-modal');
            const body = document.body;
            
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                body.classList.remove('modal-open');
            }
            
            // Also remove any scroll prevention that might be lingering
            body.style.overflow = '';
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
        }
    }
}

// Initialize i18n system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing i18n system...');
    window.i18n = new I18nSystem();
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('DOM still loading, waiting for DOMContentLoaded...');
} else {
    console.log('DOM already loaded, initializing i18n system immediately...');
    window.i18n = new I18nSystem();
}

// Manual translation function for debugging
window.forceTranslate = function() {
    if (window.i18n) {
        console.log('Forcing translation...');
        window.i18n.applyLanguage();
    } else {
        console.log('i18n system not available');
    }
};

// Export for global access
window.I18nSystem = I18nSystem;
