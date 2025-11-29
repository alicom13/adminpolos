/*!
 * Admin Polos v1.0 - Professional Admin Dashboard
 * Enhanced JavaScript with Multi-Layout Support
 * Integrated with Polos JS Framework
 * Copyright 2025 Admin Polos
 */

class AdminPolos {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.overlay = document.getElementById('overlay');
        this.userMenu = document.getElementById('userMenu');
        this.userDropdown = document.getElementById('userDropdown');
        this.layoutButtons = document.querySelectorAll('.layout-btn');
        
        this.hoverTimeout = null;
        this.isHoveringSidebar = false;
        this.currentLayout = 'full'; // Default layout
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLayoutSystem();
        this.setupAutoHover();
        this.setupPolosIntegration();
        
        console.log('🚀 Admin Polos v1.0 Initialized');
    }

    setupEventListeners() {
        // Sidebar toggle
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        
        // Overlay click (mobile)
        this.overlay.addEventListener('click', () => this.closeMobileSidebar());
        
        // User dropdown
        this.userMenu.addEventListener('click', (e) => this.toggleUserDropdown(e));
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Layout buttons
        this.layoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLayout(e));
        });
    }

    setupLayoutSystem() {
        // Set default layout
        this.setLayout('full');
        
        // Load saved layout from localStorage
        const savedLayout = localStorage.getItem('adminPolosLayout');
        if (savedLayout) {
            this.setLayout(savedLayout);
        }
    }

    setLayout(layout) {
        // Remove all layout classes
        this.sidebar.classList.remove('layout-full', 'layout-compact', 'layout-icons', 'layout-hidden');
        
        // Add new layout class
        this.sidebar.classList.add(`layout-${layout}`);
        this.currentLayout = layout;
        
        // Update active state of layout buttons
        this.layoutButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.layout === layout);
        });
        
        // Close all submenus when changing to compact/hidden layouts
        if (layout !== 'full') {
            this.closeAllSubmenus();
        }
        
        // Save to localStorage
        localStorage.setItem('adminPolosLayout', layout);
        
        console.log(`Layout changed to: ${layout}`);
    }

    changeLayout(e) {
        const layout = e.currentTarget.dataset.layout;
        this.setLayout(layout);
    }

    toggleSidebar() {
        if (window.innerWidth <= 768) {
            // Mobile behavior
            this.sidebar.classList.toggle('open');
            this.overlay.classList.toggle('active');
        } else {
            // Desktop behavior - toggle between full and icons
            if (this.currentLayout === 'full') {
                this.setLayout('icons');
            } else {
                this.setLayout('full');
            }
        }
    }

    closeMobileSidebar() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('active');
    }

    setupAutoHover() {
        if (window.innerWidth <= 768) return;

        // Mouse enter sidebar
        this.sidebar.addEventListener('mouseenter', () => {
            this.isHoveringSidebar = true;
            clearTimeout(this.hoverTimeout);
            
            // Auto-expand icons layout on hover
            if (this.currentLayout === 'icons' && !this.sidebar.classList.contains('layout-full')) {
                this.hoverTimeout = setTimeout(() => {
                    this.sidebar.classList.add('layout-full-temp');
                }, 150);
            }
        });

        // Mouse leave sidebar
        this.sidebar.addEventListener('mouseleave', (e) => {
            this.isHoveringSidebar = false;
            clearTimeout(this.hoverTimeout);
            
            const relatedTarget = e.relatedTarget;
            if (!this.sidebar.contains(relatedTarget) && relatedTarget !== this.sidebar) {
                this.hoverTimeout = setTimeout(() => {
                    // Revert to original layout
                    if (this.sidebar.classList.contains('layout-full-temp')) {
                        this.sidebar.classList.remove('layout-full-temp');
                        this.closeAllSubmenus();
                    }
                }, 300);
            }
        });
    }

    setupSubmenuToggle() {
        document.querySelectorAll('.has-sub > a').forEach(link => {
            link.removeEventListener('click', this.handleSubmenuClick);
            link.addEventListener('click', this.handleSubmenuClick);
        });
    }

    handleSubmenuClick = (e) => {
        if (window.innerWidth > 768 || !this.sidebar.classList.contains('layout-icons')) {
            e.preventDefault();
            e.stopPropagation();
            
            const parent = e.currentTarget.parentElement;
            
            // Close other submenus at the same level
            if (parent.parentElement.classList.contains('menu')) {
                this.closeOtherSubmenus(parent);
            }
            
            // Toggle current submenu
            parent.classList.toggle('open');
        }
    }

    closeAllSubmenus() {
        document.querySelectorAll('.has-sub').forEach(el => {
            el.classList.remove('open');
        });
    }

    closeOtherSubmenus(clickedElement) {
        const mainMenuItems = Array.from(document.querySelectorAll('.menu > .has-sub'));
        mainMenuItems.forEach(el => {
            if (el !== clickedElement && !clickedElement.contains(el)) {
                el.classList.remove('open');
            }
        });
    }

    toggleUserDropdown(e) {
        e.stopPropagation();
        this.userDropdown.classList.toggle('show');
    }

    handleOutsideClick(e) {
        if (!this.userMenu.contains(e.target)) {
            this.userDropdown.classList.remove('show');
        }
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobileSidebar();
        }
    }

    setupPolosIntegration() {
        // Wait for Polos JS to initialize
        if (typeof Polos !== 'undefined') {
            Polos.on('initialized', () => {
                this.enhanceInteractiveElements();
                this.setupPolosEvents();
            });
        } else {
            // Fallback if Polos doesn't load
            setTimeout(() => {
                this.enhanceInteractiveElements();
            }, 100);
        }
    }

    enhanceInteractiveElements() {
        // Enhance interactive boxes
        document.querySelectorAll('.js-interactive').forEach(el => {
            el.addEventListener('click', (e) => {
                if (typeof Polos !== 'undefined') {
                    Polos.setLoading(e.currentTarget, true);
                    setTimeout(() => Polos.setLoading(e.currentTarget, false), 1000);
                }
            });
        });

        // Setup stats cards
        document.querySelectorAll('[data-stats]').forEach(card => {
            card.addEventListener('click', (e) => {
                const statsType = e.currentTarget.getAttribute('data-stats');
                console.log(`Viewing detailed ${statsType} statistics`);
            });
        });

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (typeof Polos !== 'undefined') {
                    Polos.setLoading('#chartContainer', true, { text: 'Generating report...' });
                    setTimeout(() => {
                        Polos.setLoading('#chartContainer', false);
                        alert('Report exported successfully!');
                    }, 2000);
                }
            });
        }

        // Chart period buttons
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.currentTarget.getAttribute('data-period');
                if (typeof Polos !== 'undefined') {
                    Polos.setLoading('#chartContainer', true, { text: `Loading ${period} data...` });
                    setTimeout(() => {
                        Polos.setLoading('#chartContainer', false);
                        console.log(`Switched to ${period} view`);
                    }, 1000);
                }
            });
        });
    }

    setupPolosEvents() {
        if (typeof Polos !== 'undefined') {
            Polos.on('screenChange', (event, data) => {
                console.log(`Screen changed from ${data.from} to ${data.to}`);
            });
        }
    }

    // Public methods
    refresh() {
        this.setupSubmenuToggle();
        this.enhanceInteractiveElements();
    }

    getCurrentLayout() {
        return this.currentLayout;
    }

    setLayoutManually(layout) {
        this.setLayout(layout);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.adminPolos = new AdminPolos();
});

// Global access
window.AdminPolos = AdminPolos;
