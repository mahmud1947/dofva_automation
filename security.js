/**
 * Dofva Automation - Client-Side Security Module
 * Implements various security measures for the website
 */

(function() {
    'use strict';

    // Security configuration
    const SecurityConfig = {
        maxFormSubmissions: 5,
        submissionTimeWindow: 300000, // 5 minutes
        sessionTimeout: 1800000, // 30 minutes
        maxInputLength: 1000,
        allowedDomains: ['localhost', 'dofva-automation.com']
    };

    // Advanced Rate Limiting and DDoS Protection
    class AdvancedRateLimiter {
        constructor() {
            this.submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
            this.pageViews = JSON.parse(localStorage.getItem('pageViews') || '[]');
            this.failedAttempts = JSON.parse(localStorage.getItem('failedAttempts') || '[]');
            this.suspiciousIPs = JSON.parse(localStorage.getItem('suspiciousIPs') || '[]');
            this.cleanOldData();
            this.initDDoSProtection();
        }

        cleanOldData() {
            const now = Date.now();
            this.submissions = this.submissions.filter(
                time => now - time < SecurityConfig.submissionTimeWindow
            );
            localStorage.setItem('formSubmissions', JSON.stringify(this.submissions));
        }

        canSubmit() {
            this.cleanOldSubmissions();
            return this.submissions.length < SecurityConfig.maxFormSubmissions;
        }

        recordSubmission() {
            this.submissions.push(Date.now());
            localStorage.setItem('formSubmissions', JSON.stringify(this.submissions));
        }
    }

    // Input sanitization and validation
    class InputValidator {
        static sanitizeInput(input) {
            if (typeof input !== 'string') return '';
            
            // Remove potentially dangerous characters and SQL injection patterns
            return input
                .replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<[^>]+>/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                // SQL injection prevention
                .replace(/('|(\-\-)|(;)|(\|)|(\*)|(%))/g, '')
                .replace(/\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/gi, '')
                .replace(/\b(AND|OR)\b\s*\d+\s*=\s*\d+/gi, '')
                .replace(/\b(HAVING|WHERE)\b\s*\d+\s*=\s*\d+/gi, '')
                .replace(/\b(CONCAT|CHAR|ASCII|SUBSTRING|LENGTH|MID|REPLACE)\s*\(/gi, '')
                .replace(/\b(WAITFOR|DELAY|SLEEP|BENCHMARK)\b/gi, '')
                .replace(/\b(LOAD_FILE|INTO OUTFILE|INTO DUMPFILE)\b/gi, '')
                .replace(/\b(INFORMATION_SCHEMA|SYSOBJECTS|SYSCOLUMNS)\b/gi, '')
                .replace(/\b(XP_CMDSHELL|SP_EXECUTESQL|OPENROWSET)\b/gi, '')
                .trim()
                .substring(0, SecurityConfig.maxInputLength);
        }

        static validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email) && email.length <= 254;
        }

        static detectSQLInjection(input) {
            const sqlPatterns = [
                /('|(\-\-)|(;)|(\|)|(\*))/,
                /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b/i,
                /\b(AND|OR)\s+\d+\s*=\s*\d+/i,
                /\b(CONCAT|CHAR|ASCII|SUBSTRING)\s*\(/i,
                /\b(WAITFOR|DELAY|SLEEP|BENCHMARK)\b/i,
                /\b(LOAD_FILE|INTO\s+OUTFILE)\b/i,
                /\b(INFORMATION_SCHEMA|SYSOBJECTS)\b/i
            ];
            return sqlPatterns.some(pattern => pattern.test(input));
        }

        static validatePhone(phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
        }

        static validateName(name) {
            const nameRegex = /^[a-zA-Z\s\-'\.]{2,50}$/;
            return nameRegex.test(name);
        }
    }

    // CSRF Protection
    class CSRFProtection {
        static generateToken() {
            const array = new Uint8Array(32);
            crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        }

        static setToken() {
            const token = this.generateToken();
            sessionStorage.setItem('csrfToken', token);
            return token;
        }

        static getToken() {
            return sessionStorage.getItem('csrfToken') || this.setToken();
        }

        static validateToken(token) {
            return token === this.getToken();
        }
    }

    // Security monitoring
    class SecurityMonitor {
        constructor() {
            this.suspiciousActivity = [];
            this.init();
        }

        init() {
            this.detectDevTools();
            this.preventRightClick();
            this.detectSuspiciousRequests();
            this.monitorConsoleAccess();
        }

        detectDevTools() {
            let devtools = {
                open: false,
                orientation: null
            };

            const threshold = 160;
            setInterval(() => {
                if (window.outerHeight - window.innerHeight > threshold || 
                    window.outerWidth - window.innerWidth > threshold) {
                    if (!devtools.open) {
                        devtools.open = true;
                        this.logSuspiciousActivity('Developer tools opened');
                    }
                } else {
                    devtools.open = false;
                }
            }, 500);
        }

        preventRightClick() {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.logSuspiciousActivity('Right-click attempted');
                return false;
            });

            // Prevent common keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
                if (e.keyCode === 123 || 
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                    (e.ctrlKey && e.keyCode === 85)) {
                    e.preventDefault();
                    this.logSuspiciousActivity('Developer shortcut attempted');
                    return false;
                }
            });
        }

        detectSuspiciousRequests() {
            // Monitor for unusual request patterns
            const originalFetch = window.fetch;
            window.fetch = (...args) => {
                const url = args[0];
                if (typeof url === 'string' && !this.isAllowedDomain(url)) {
                    this.logSuspiciousActivity(`Suspicious request to: ${url}`);
                }
                return originalFetch.apply(this, args);
            };
        }

        monitorConsoleAccess() {
            // Detect console usage
            let consoleWarningShown = false;
            Object.defineProperty(console, '_commandLineAPI', {
                get: function() {
                    if (!consoleWarningShown) {
                        console.warn('🚨 Security Warning: Unauthorized console access detected!');
                        consoleWarningShown = true;
                    }
                    return undefined;
                }
            });
        }

        isAllowedDomain(url) {
            try {
                const domain = new URL(url).hostname;
                return SecurityConfig.allowedDomains.some(allowed => 
                    domain === allowed || domain.endsWith('.' + allowed)
                );
            } catch {
                return false;
            }
        }

        logSuspiciousActivity(activity) {
            const timestamp = new Date().toISOString();
            this.suspiciousActivity.push({ activity, timestamp });
            
            // Keep only last 50 entries
            if (this.suspiciousActivity.length > 50) {
                this.suspiciousActivity.shift();
            }
            
            console.warn(`🔒 Security Alert: ${activity} at ${timestamp}`);
        }
    }

    // Form security handler
    class FormSecurity {
        constructor() {
            this.rateLimiter = new RateLimiter();
            this.init();
        }

        init() {
            this.secureAllForms();
            this.addCSRFTokens();
        }

        secureAllForms() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => this.secureForm(form));
        }

        secureForm(form) {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showSecurityError('Form validation failed. Please check your input.');
                    return false;
                }

                if (!this.rateLimiter.canSubmit()) {
                    e.preventDefault();
                    this.showSecurityError('Too many submissions. Please wait before trying again.');
                    return false;
                }

                this.rateLimiter.recordSubmission();
            });

            // Add input validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    e.target.value = InputValidator.sanitizeInput(e.target.value);
                });
            });
        }

        validateForm(form) {
            const formData = new FormData(form);
            
            for (let [key, value] of formData.entries()) {
                if (typeof value === 'string') {
                    // Check for potential XSS
                    if (this.containsXSS(value)) {
                        return false;
                    }

                    // Check for SQL injection attempts
                    if (InputValidator.detectSQLInjection(value)) {
                        console.warn('🔒 SQL Injection attempt detected:', value);
                        return false;
                    }

                    // Validate specific field types
                    if (key.toLowerCase().includes('email') && !InputValidator.validateEmail(value)) {
                        return false;
                    }
                    
                    if (key.toLowerCase().includes('phone') && !InputValidator.validatePhone(value)) {
                        return false;
                    }
                    
                    if (key.toLowerCase().includes('name') && !InputValidator.validateName(value)) {
                        return false;
                    }
                }
            }

            return true;
        }

        containsXSS(input) {
            const xssPatterns = [
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                /javascript:/gi,
                /on\w+\s*=/gi,
                /<iframe/gi,
                /<object/gi,
                /<embed/gi,
                /expression\s*\(/gi
            ];

            return xssPatterns.some(pattern => pattern.test(input));
        }

        addCSRFTokens() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrf_token';
                csrfInput.value = CSRFProtection.getToken();
                form.appendChild(csrfInput);
            });
        }

        showSecurityError(message) {
            // Create and show security error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'security-error';
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #dc3545;
                color: white;
                padding: 15px;
                border-radius: 5px;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;
            errorDiv.textContent = message;
            
            document.body.appendChild(errorDiv);
            
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 5000);
        }
    }

    // Session management
    class SessionManager {
        constructor() {
            this.lastActivity = Date.now();
            this.init();
        }

        init() {
            this.trackActivity();
            this.checkSessionTimeout();
        }

        trackActivity() {
            ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
                document.addEventListener(event, () => {
                    this.lastActivity = Date.now();
                }, { passive: true });
            });
        }

        checkSessionTimeout() {
            setInterval(() => {
                if (Date.now() - this.lastActivity > SecurityConfig.sessionTimeout) {
                    this.handleSessionTimeout();
                }
            }, 60000); // Check every minute
        }

        handleSessionTimeout() {
            // Clear sensitive data
            sessionStorage.clear();
            
            // Show timeout message
            alert('Your session has expired for security reasons. The page will reload.');
            window.location.reload();
        }
    }

    // Initialize security when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        try {
            new SecurityMonitor();
            new FormSecurity();
            new SessionManager();
            
            console.log('🔒 Dofva Automation Security Module Initialized');
        } catch (error) {
            console.error('Security module initialization failed:', error);
        }
    });

    // Expose minimal API for legitimate use
    window.DofvaSecurity = {
        validateInput: InputValidator.sanitizeInput,
        validateEmail: InputValidator.validateEmail,
        generateCSRFToken: CSRFProtection.generateToken
    };

})();
