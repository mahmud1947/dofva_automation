# Dofva Automation Website

A professional, fully-responsive business website for Dofva Automation - a leading company specializing in process automation, robotic integration, and workflow optimization solutions. This static website showcases the company's services, projects, and expertise in industrial automation.

## Project Structure

```
dofva_automation/
├── index.html          # Home page
├── services.html       # Services overview
├── projects.html       # Project showcase
├── about.html          # About the company
├── blog.html           # Blog/news section
├── contact.html        # Contact information and form
├── privacy-policy.html # Privacy policy page
├── terms-of-service.html # Terms of service page
├── security.js         # Client-side security module
├── .htaccess          # Server security configuration
├── .gitattributes      # Git configuration
├── SECURITY.md         # Security documentation
└── README.md           # This file
```

## Features

- **Responsive Design**: Built with Tailwind CSS for mobile-first responsive design
- **Modern UI**: Clean, professional dark theme design with consistent branding
- **Service Showcase**: Detailed presentation of automation services and solutions
- **Project Portfolio**: Examples of successful automation implementations across industries
- **Contact Form**: Easy way for potential clients to get in touch
- **SEO Optimized**: Comprehensive meta tags, Open Graph tags, and semantic HTML structure
- **Consistent Navigation**: Unified navigation menu across all pages
- **Professional Footer**: Complete footer with navigation links and copyright information
- **Fast Loading**: Optimized static HTML with minimal dependencies
- **🔒 Comprehensive Security**: Multi-layered cybersecurity implementation
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: Token-based request validation
- **Rate Limiting**: Anti-spam and DoS protection
- **Security Monitoring**: Real-time threat detection and logging

## Technologies Used

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **Google Fonts**: Inter and Noto Sans font families
- **SVG Icons**: Scalable vector graphics for icons

## Services Offered

1. **Process Automation**: Streamline workflows and eliminate manual tasks
2. **Robotic Integration**: Integrate robotic systems for increased precision
3. **System Integration**: Connect disparate systems for seamless operations
4. **Workflow Optimization**: Improve overall efficiency and productivity

## Getting Started

### Local Development

1. Clone or download this repository
2. Navigate to the project directory
3. Start a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
4. Open your browser and go to `http://localhost:8000`
5. Navigate through the different pages using the navigation menu

### Direct File Access

Alternatively, you can open `index.html` directly in a web browser, though some features may work better with a local server.

### Deployment

This is a static website that can be deployed to any web hosting service:
- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Netlify**: Drag and drop the folder or connect to a Git repository
- **Vercel**: Deploy directly from GitHub or upload files
- **Traditional Web Hosting**: Upload files via FTP to your web server

## Browser Support

This website is compatible with all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Testing

The website has been thoroughly tested for:
- ✅ Cross-page navigation functionality
- ✅ Responsive design on different screen sizes
- ✅ SEO meta tags and Open Graph implementation
- ✅ Visual consistency across all pages
- ✅ Form functionality and user experience
- ✅ Browser compatibility (Chrome, Firefox, Safari, Edge)

## Security Features

🔒 **Enterprise-Grade Security** - The website implements comprehensive cybersecurity measures:

- **Server-Side Protection**: Apache .htaccess with security headers, file protection, and rate limiting
- **Client-Side Security**: Advanced JavaScript security module with real-time monitoring
- **Input Validation**: Comprehensive sanitization and XSS prevention
- **CSRF Protection**: Token-based request validation
- **Session Security**: Automatic timeout and activity monitoring
- **Security Monitoring**: Real-time threat detection and logging

For detailed security information, see [SECURITY.md](./SECURITY.md).

## Project Status

🚀 **Production Ready** - The website is fully functional and ready for deployment with enterprise-grade security.

## Contact Information

For business inquiries, please visit the contact page or reach out directly through the website's contact form.

## Contributing

This is a business website project. For any technical issues or improvements, please ensure all changes maintain the professional appearance and functionality of the site.

## License

© 2024 Dofva Automation. All rights reserved.
