// Professional Website Templates
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  html: string;
  brandTokens?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
}

const generateBaseTemplate = (content: string, title: string, brandTokens?: Template['brandTokens']) => {
  const primaryColor = brandTokens?.primaryColor || '#0EA5E9';
  const secondaryColor = brandTokens?.secondaryColor || '#8B5CF6';
  const fontFamily = brandTokens?.fontFamily || 'Inter, system-ui, sans-serif';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="Professional website built with modern technologies">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: ${primaryColor};
            --secondary-color: ${secondaryColor};
            --font-family: ${fontFamily};
        }
        body {
            font-family: var(--font-family);
        }
        .btn-primary {
            background: var(--primary-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);
        }
        .text-primary {
            color: var(--primary-color);
        }
        .bg-primary {
            background-color: var(--primary-color);
        }
        .gradient-hero {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out;
        }
        .animate-slide-up {
            animation: slideUp 0.6s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="bg-gray-50">
    ${content}
    
    <script>
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        });

        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            observer.observe(el);
        });

        // Contact form handling
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
            });
        }
    </script>
</body>
</html>`;
};

export const templates: Template[] = [
  {
    id: 'saas-landing',
    name: 'SaaS Landing Page',
    description: 'Modern SaaS landing page with hero, features, pricing, and testimonials',
    category: 'business',
    preview: '#',
    html: generateBaseTemplate(`
    <!-- Navigation -->
    <nav class="bg-white shadow-sm fixed w-full top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <div class="flex-shrink-0">
                    <h2 class="text-2xl font-bold text-primary">SaasFlow</h2>
                </div>
                <div class="hidden md:block">
                    <div class="flex items-center space-x-8">
                        <a href="#features" class="text-gray-700 hover:text-primary transition-colors">Features</a>
                        <a href="#pricing" class="text-gray-700 hover:text-primary transition-colors">Pricing</a>
                        <a href="#about" class="text-gray-700 hover:text-primary transition-colors">About</a>
                        <a href="#contact" class="text-gray-700 hover:text-primary transition-colors">Contact</a>
                        <button class="btn-primary">Get Started</button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-hero pt-20 pb-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
                    Scale Your Business<br>
                    <span class="text-yellow-300">with AI Power</span>
                </h1>
                <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up">
                    Transform your workflow with our intelligent SaaS platform. Boost productivity by 300% with automated insights and seamless integrations.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                    <button class="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all">
                        Start Free Trial
                    </button>
                    <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all">
                        Watch Demo
                    </button>
                </div>
                <p class="text-white/70 mt-4 text-sm">No credit card required • 14-day free trial</p>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-16 bg-white animate-on-scroll">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to streamline your business operations</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <div class="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
                    <p class="text-gray-600">Process data 10x faster with our optimized algorithms and cloud infrastructure.</p>
                </div>
                
                <div class="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <div class="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Secure & Reliable</h3>
                    <p class="text-gray-600">Enterprise-grade security with 99.9% uptime guarantee and automatic backups.</p>
                </div>
                
                <div class="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <div class="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Easy Integration</h3>
                    <p class="text-gray-600">Connect with 500+ apps and services through our robust API and webhooks.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-16 bg-gray-50 animate-on-scroll">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
                <p class="text-xl text-gray-600">Choose the plan that fits your needs</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-8 rounded-lg shadow-sm border">
                    <h3 class="text-xl font-semibold mb-4">Starter</h3>
                    <div class="mb-4">
                        <span class="text-3xl font-bold">$29</span>
                        <span class="text-gray-600">/month</span>
                    </div>
                    <ul class="space-y-2 mb-6">
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Up to 1,000 records</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Basic integrations</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Email support</li>
                    </ul>
                    <button class="w-full border-2 border-primary text-primary py-2 rounded-lg hover:bg-primary hover:text-white transition-all">
                        Get Started
                    </button>
                </div>
                
                <div class="bg-white p-8 rounded-lg shadow-lg border-2 border-primary relative">
                    <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span class="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">Popular</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-4">Professional</h3>
                    <div class="mb-4">
                        <span class="text-3xl font-bold">$99</span>
                        <span class="text-gray-600">/month</span>
                    </div>
                    <ul class="space-y-2 mb-6">
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Up to 10,000 records</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Advanced integrations</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Priority support</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Custom workflows</li>
                    </ul>
                    <button class="w-full btn-primary">
                        Get Started
                    </button>
                </div>
                
                <div class="bg-white p-8 rounded-lg shadow-sm border">
                    <h3 class="text-xl font-semibold mb-4">Enterprise</h3>
                    <div class="mb-4">
                        <span class="text-3xl font-bold">$299</span>
                        <span class="text-gray-600">/month</span>
                    </div>
                    <ul class="space-y-2 mb-6">
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited records</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> White-label solution</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Dedicated support</li>
                        <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Custom integrations</li>
                    </ul>
                    <button class="w-full border-2 border-primary text-primary py-2 rounded-lg hover:bg-primary hover:text-white transition-all">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-white animate-on-scroll">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p class="text-xl text-gray-600">Ready to transform your business? Let's talk!</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-xl font-semibold mb-4">Contact Information</h3>
                    <div class="space-y-4">
                        <p class="flex items-center">
                            <span class="text-primary mr-3">📧</span>
                            hello@saasflow.com
                        </p>
                        <p class="flex items-center">
                            <span class="text-primary mr-3">📞</span>
                            +1 (555) 123-4567
                        </p>
                        <p class="flex items-center">
                            <span class="text-primary mr-3">📍</span>
                            San Francisco, CA
                        </p>
                    </div>
                </div>
                
                <form id="contact-form" class="space-y-4">
                    <input type="text" placeholder="Your Name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none" required>
                    <input type="email" placeholder="Your Email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none" required>
                    <textarea placeholder="Your Message" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none" required></textarea>
                    <button type="submit" class="w-full btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-4 text-primary">SaasFlow</h3>
                <p class="text-gray-400 mb-6">Empowering businesses with intelligent automation</p>
                <div class="flex justify-center space-x-6">
                    <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" class="text-gray-400 hover:text-white transition-colors">Support</a>
                </div>
                <div class="mt-8 pt-8 border-t border-gray-800">
                    <p class="text-gray-400">&copy; 2024 SaasFlow. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
    `, 'SaasFlow - Scale Your Business with AI')
  },

  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    description: 'Stunning portfolio template for creatives and agencies',
    category: 'portfolio',
    preview: '#',
    html: generateBaseTemplate(`
    <!-- Navigation -->
    <nav class="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-sm">
        <div class="max-w-6xl mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-primary">Alex Chen</h2>
                <div class="hidden md:flex space-x-8">
                    <a href="#work" class="text-gray-700 hover:text-primary transition-colors">Work</a>
                    <a href="#about" class="text-gray-700 hover:text-primary transition-colors">About</a>
                    <a href="#services" class="text-gray-700 hover:text-primary transition-colors">Services</a>
                    <a href="#contact" class="text-gray-700 hover:text-primary transition-colors">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-24 pb-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div class="max-w-6xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div class="animate-slide-up">
                    <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Creative
                        <span class="text-primary block">Designer</span>
                    </h1>
                    <p class="text-xl text-gray-600 mb-8">
                        I create meaningful digital experiences that connect brands with their audiences through innovative design and storytelling.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button class="btn-primary">View My Work</button>
                        <button class="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-primary hover:text-primary transition-all">
                            Download CV
                        </button>
                    </div>
                </div>
                <div class="animate-slide-up">
                    <div class="w-full h-96 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                        <span class="text-white text-6xl">🎨</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Work Section -->
    <section id="work" class="py-16 animate-on-scroll">
        <div class="max-w-6xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Work</h2>
                <p class="text-xl text-gray-600">A selection of my recent projects</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="group cursor-pointer">
                    <div class="bg-gradient-to-br from-blue-400 to-blue-600 h-64 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span class="text-white text-4xl">📱</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Mobile Banking App</h3>
                    <p class="text-gray-600">UX/UI Design for a modern banking application with focus on user experience and security.</p>
                </div>
                
                <div class="group cursor-pointer">
                    <div class="bg-gradient-to-br from-green-400 to-green-600 h-64 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span class="text-white text-4xl">🌐</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">E-commerce Platform</h3>
                    <p class="text-gray-600">Complete visual identity and web design for a sustainable fashion e-commerce brand.</p>
                </div>
                
                <div class="group cursor-pointer">
                    <div class="bg-gradient-to-br from-purple-400 to-purple-600 h-64 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span class="text-white text-4xl">🎯</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Brand Identity</h3>
                    <p class="text-gray-600">Logo design and brand guidelines for a tech startup focusing on AI solutions.</p>
                </div>
                
                <div class="group cursor-pointer">
                    <div class="bg-gradient-to-br from-orange-400 to-orange-600 h-64 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span class="text-white text-4xl">📊</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Dashboard Design</h3>
                    <p class="text-gray-600">Analytics dashboard with complex data visualization and intuitive user interface.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16 bg-gray-50 animate-on-scroll">
        <div class="max-w-4xl mx-auto px-6">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Me</h2>
                <p class="text-xl text-gray-600">Passionate about creating beautiful and functional designs</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <p class="text-gray-700 mb-6">
                        With over 8 years of experience in digital design, I specialize in creating user-centered solutions that drive business results. My approach combines strategic thinking with creative execution.
                    </p>
                    <p class="text-gray-700 mb-6">
                        I've had the privilege of working with startups and Fortune 500 companies, helping them transform their digital presence and connect with their audiences in meaningful ways.
                    </p>
                    
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-semibold">UI/UX Design</span>
                                <span>95%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: 95%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-semibold">Brand Design</span>
                                <span>90%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: 90%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between mb-2">
                                <span class="font-semibold">Web Development</span>
                                <span>85%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-primary h-2 rounded-full" style="width: 85%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div class="w-full h-96 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                        <span class="text-white text-6xl">👨‍💻</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-16 animate-on-scroll">
        <div class="max-w-6xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Services</h2>
                <p class="text-xl text-gray-600">How I can help bring your vision to life</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                    <div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                        <span class="text-white text-2xl">🎨</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-4">UI/UX Design</h3>
                    <p class="text-gray-600">User-centered design solutions that enhance user experience and drive conversions.</p>
                </div>
                
                <div class="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                    <div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                        <span class="text-white text-2xl">🏷️</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-4">Brand Identity</h3>
                    <p class="text-gray-600">Complete brand identity packages including logo design, guidelines, and visual systems.</p>
                </div>
                
                <div class="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                    <div class="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                        <span class="text-white text-2xl">💻</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-4">Web Development</h3>
                    <p class="text-gray-600">Responsive websites and web applications built with modern technologies and best practices.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 bg-gray-900 text-white animate-on-scroll">
        <div class="max-w-4xl mx-auto px-6">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
                <p class="text-xl text-gray-300">Have a project in mind? I'd love to hear about it.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h3 class="text-xl font-semibold mb-6">Get in Touch</h3>
                    <div class="space-y-4">
                        <p class="flex items-center">
                            <span class="text-primary mr-4">📧</span>
                            hello@alexchen.design
                        </p>
                        <p class="flex items-center">
                            <span class="text-primary mr-4">📞</span>
                            +1 (555) 987-6543
                        </p>
                        <p class="flex items-center">
                            <span class="text-primary mr-4">📍</span>
                            New York, NY
                        </p>
                    </div>
                    
                    <div class="mt-8">
                        <h4 class="font-semibold mb-4">Follow Me</h4>
                        <div class="flex space-x-4">
                            <a href="#" class="text-gray-300 hover:text-primary transition-colors">Twitter</a>
                            <a href="#" class="text-gray-300 hover:text-primary transition-colors">Instagram</a>
                            <a href="#" class="text-gray-300 hover:text-primary transition-colors">Dribbble</a>
                            <a href="#" class="text-gray-300 hover:text-primary transition-colors">LinkedIn</a>
                        </div>
                    </div>
                </div>
                
                <form id="contact-form" class="space-y-4">
                    <input type="text" placeholder="Your Name" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white" required>
                    <input type="email" placeholder="Your Email" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white" required>
                    <input type="text" placeholder="Project Budget" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white">
                    <textarea placeholder="Tell me about your project" rows="4" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white" required></textarea>
                    <button type="submit" class="w-full btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>
    `, 'Alex Chen - Creative Designer Portfolio')
  },

  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    description: 'Complete online store template with product showcase',
    category: 'ecommerce',
    preview: '#',
    html: generateBaseTemplate(`
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <h2 class="text-2xl font-bold text-primary">TechStore</h2>
                </div>
                
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#products" class="text-gray-700 hover:text-primary transition-colors">Products</a>
                    <a href="#categories" class="text-gray-700 hover:text-primary transition-colors">Categories</a>
                    <a href="#about" class="text-gray-700 hover:text-primary transition-colors">About</a>
                    <a href="#contact" class="text-gray-700 hover:text-primary transition-colors">Contact</a>
                </div>
                
                <div class="flex items-center space-x-4">
                    <button class="p-2 text-gray-700 hover:text-primary">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                    <button class="p-2 text-gray-700 hover:text-primary relative">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                        </svg>
                        <span class="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-hero py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div class="animate-slide-up">
                    <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                        Latest Tech<br>
                        <span class="text-yellow-300">Best Prices</span>
                    </h1>
                    <p class="text-xl text-white/90 mb-8">
                        Discover cutting-edge technology with unbeatable prices. From smartphones to laptops, we have everything you need.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button class="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all">
                            Shop Now
                        </button>
                        <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all">
                            View Deals
                        </button>
                    </div>
                    <p class="text-white/70 mt-4 text-sm">Free shipping on orders over $50</p>
                </div>
                
                <div class="animate-slide-up">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                            <div class="text-4xl mb-2">📱</div>
                            <h3 class="text-white font-semibold">Smartphones</h3>
                            <p class="text-white/70 text-sm">Latest models</p>
                        </div>
                        <div class="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                            <div class="text-4xl mb-2">💻</div>
                            <h3 class="text-white font-semibold">Laptops</h3>
                            <p class="text-white/70 text-sm">Professional grade</p>
                        </div>
                        <div class="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                            <div class="text-4xl mb-2">🎧</div>
                            <h3 class="text-white font-semibold">Audio</h3>
                            <p class="text-white/70 text-sm">Premium sound</p>
                        </div>
                        <div class="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                            <div class="text-4xl mb-2">⌚</div>
                            <h3 class="text-white font-semibold">Wearables</h3>
                            <p class="text-white/70 text-sm">Smart devices</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section id="products" class="py-16 bg-white animate-on-scroll">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
                <p class="text-xl text-gray-600">Handpicked items just for you</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 border">
                    <div class="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                        <span class="text-4xl">📱</span>
                    </div>
                    <h3 class="font-semibold mb-2">iPhone 15 Pro</h3>
                    <p class="text-gray-600 text-sm mb-4">Latest Apple smartphone with titanium design</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-primary">$999</span>
                        <button class="btn-primary text-sm px-4 py-2">Add to Cart</button>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 border">
                    <div class="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-4 flex items-center justify-center">
                        <span class="text-4xl">💻</span>
                    </div>
                    <h3 class="font-semibold mb-2">MacBook Pro M3</h3>
                    <p class="text-gray-600 text-sm mb-4">Professional laptop for creators and developers</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-primary">$1,599</span>
                        <button class="btn-primary text-sm px-4 py-2">Add to Cart</button>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 border">
                    <div class="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 flex items-center justify-center">
                        <span class="text-4xl">🎧</span>
                    </div>
                    <h3 class="font-semibold mb-2">AirPods Pro</h3>
                    <p class="text-gray-600 text-sm mb-4">Wireless earbuds with active noise cancellation</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-primary">$249</span>
                        <button class="btn-primary text-sm px-4 py-2">Add to Cart</button>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 border">
                    <div class="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mb-4 flex items-center justify-center">
                        <span class="text-4xl">⌚</span>
                    </div>
                    <h3 class="font-semibold mb-2">Apple Watch</h3>
                    <p class="text-gray-600 text-sm mb-4">Advanced health and fitness tracking</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-primary">$399</span>
                        <button class="btn-primary text-sm px-4 py-2">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Categories -->
    <section id="categories" class="py-16 bg-gray-50 animate-on-scroll">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                <p class="text-xl text-gray-600">Find exactly what you're looking for</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="group cursor-pointer">
                    <div class="bg-gradient-to-br from-primary to-blue-600 h-64 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span class="text-white text-6xl">📱</span>
                    </div>
                    <h3 class="text-xl font-semibold text-center">Mobile Devices</h3>
                    <p class="text-gray-600 text-center">Smartphones, tablets, and accessories</p>
                </div>
                
                <div class="group cursor-pointer">
                    <div class="bg-gradient-to-br from-purple-500 to-pink-600 h-64 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span class="text-white text-6xl">💻</span>
                    </div>
                    <h3 class="text-xl font-semibold text-center">Computers</h3>
                    <p class="text-gray-600 text-center">Laptops, desktops, and peripherals</p>
                </div>
                
                <div class="group cursor-pointer">
                    <div class="bg-gradient-to-br from-green-500 to-teal-600 h-64 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span class="text-white text-6xl">🎮</span>
                    </div>
                    <h3 class="text-xl font-semibold text-center">Gaming</h3>
                    <p class="text-gray-600 text-center">Consoles, games, and gaming gear</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Newsletter -->
    <section class="py-16 bg-gray-900 text-white animate-on-scroll">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
            <p class="text-xl text-gray-300 mb-8">Get the latest tech news and exclusive deals</p>
            
            <form class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    class="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary focus:outline-none text-white"
                    required
                >
                <button type="submit" class="btn-primary whitespace-nowrap">
                    Subscribe
                </button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-2xl font-bold mb-4 text-primary">TechStore</h3>
                    <p class="text-gray-400 mb-4">Your trusted partner for the latest technology and electronics.</p>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Products</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white transition-colors">Smartphones</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Laptops</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Audio</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Gaming</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Support</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Returns</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Shipping</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Contact Us</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold mb-4">Company</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Terms</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-gray-800 mt-8 pt-8 text-center">
                <p class="text-gray-400">&copy; 2024 TechStore. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `, 'TechStore - Latest Tech, Best Prices')
  }
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === 'all') return templates;
  return templates.filter(template => template.category === category);
};