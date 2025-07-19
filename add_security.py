#!/usr/bin/env python3
"""
Script to add security headers and security.js to all HTML files
"""

import os
import re

# Security headers to add
security_headers = '''    
    <!-- Security Headers -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" />
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta http-equiv="X-Frame-Options" content="DENY" />
    <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    '''

# Security script to add
security_script = '''    <!-- Security Module -->
    <script src="./security.js"></script>
    '''

def add_security_to_file(filename):
    print(f"Adding security to {filename}...")
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has security headers
        if 'Security Headers' in content:
            print(f"  ✅ {filename} already has security headers")
            return
        
        # Add security headers before Tailwind CSS script
        if 'https://cdn.tailwindcss.com' in content:
            content = re.sub(
                r'(\s+)<script src="https://cdn\.tailwindcss\.com[^>]*></script>',
                security_headers + r'\1<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>',
                content
            )
        
        # Add security script before closing body tag
        if '</body>' in content and 'security.js' not in content:
            content = re.sub(
                r'(\s+)</body>',
                security_script + r'\1<script>\n      function toggleMobileMenu() {\n        const mobileMenu = document.getElementById(\'mobileMenu\');\n        mobileMenu.classList.toggle(\'hidden\');\n      }\n    </script>\1</body>',
                content
            )
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  ✅ Added security to {filename}")
        
    except Exception as e:
        print(f"  ❌ Error processing {filename}: {e}")

def main():
    # List of HTML files to update (excluding index.html which is already done)
    html_files = [
        'services.html',
        'projects.html', 
        'about.html',
        'blog.html',
        'contact.html',
        'privacy-policy.html',
        'terms-of-service.html'
    ]
    
    for filename in html_files:
        if os.path.exists(filename):
            add_security_to_file(filename)
        else:
            print(f"❌ File {filename} not found")
    
    print("\n🔒 Security implementation completed!")

if __name__ == "__main__":
    main()
