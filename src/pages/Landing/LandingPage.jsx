import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import CountUpModule from 'react-countup';
const CountUp = CountUpModule.default || CountUpModule;
import { Button } from 'antd';
import {
  SunOutlined, MoonOutlined, SwapOutlined, WalletOutlined, FlagOutlined,
  LineChartOutlined, FileTextOutlined, BellOutlined, CheckCircleOutlined,
  SafetyCertificateOutlined, SyncOutlined, GlobalOutlined, MenuOutlined, CloseOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import useTheme from '../../hooks/useTheme';
import { ROUTES } from '../../constants/routes';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-fintech-surface border border-gray-100 dark:border-fintech-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
  >
    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-fintech-primary/10 flex items-center justify-center text-fintech-primary text-2xl mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-fintech-textMuted text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const StepCard = ({ number, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    className="relative flex flex-col md:flex-row gap-6 items-start md:items-center"
  >
    <div className="w-16 h-16 rounded-full bg-fintech-primary text-white flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-lg shadow-blue-500/30 z-10">
      {number}
    </div>
    <div className="bg-white dark:bg-fintech-surface border border-gray-100 dark:border-fintech-border rounded-2xl p-6 flex-1 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-fintech-textMuted text-sm">{description}</p>
    </div>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isDarkMode, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // For Hero Parallax
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-fintech-bg font-sans selection:bg-fintech-primary/30">
      <Helmet>
        <title>MoneyHaven - Take Control of Your Financial Future</title>
        <meta name="description" content="MoneyHaven is your ultimate personal finance dashboard. Track transactions, set budgets, achieve savings goals, and get AI-powered insights." />
        <meta property="og:title" content="MoneyHaven - Personal Finance Dashboard" />
        <meta property="og:description" content="Track your expenses, set budgets, achieve goals, and get AI-powered insights with MoneyHaven." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-fintech-surface/80 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-fintech-border py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                M
              </div>
              <span className={`font-bold text-xl tracking-tight ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                MoneyHaven
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  {link.label}
                  {link.label === 'Pricing' && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">Soon</span>}
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button type="text" icon={isDarkMode ? <SunOutlined className="text-yellow-500" /> : <MoonOutlined className="text-gray-600" />} onClick={toggleTheme} className="dark:text-white" />
              <Link to={ROUTES.LOGIN}>
                <Button type="text" className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">Login</Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button type="primary" className="rounded-full px-6 font-medium shadow-md shadow-blue-500/20">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <Button type="text" icon={isDarkMode ? <SunOutlined className="text-yellow-500" /> : <MoonOutlined />} onClick={toggleTheme} className="dark:text-white" />
              <Button type="text" className="dark:text-white" icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-[60px] left-0 right-0 bg-white dark:bg-fintech-surface border-b border-gray-200 dark:border-fintech-border z-40 overflow-hidden shadow-lg"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-base font-medium text-gray-800 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-fintech-border/50" onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                  {link.label === 'Pricing' && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">Soon</span>}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                  <Button block size="large">Login</Button>
                </Link>
                <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
                  <Button block type="primary" size="large">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[120px]" />
        </div>

        <motion.div style={{ y: yHero, opacity: opacityHero }} className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 dark:bg-fintech-primary/10 border border-blue-100 dark:border-fintech-primary/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6">
              The Ultimate Finance OS
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight"
          >
            Take Control of Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              Financial Future
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500 dark:text-fintech-textMuted mb-10"
          >
            Track every penny, set smart budgets, achieve savings goals, and get AI-powered insights to grow your wealth seamlessly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link to={ROUTES.REGISTER} className="w-full sm:w-auto">
              <Button type="primary" size="large" className="w-full sm:w-auto rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform">
                Start for free
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN} className="w-full sm:w-auto">
              <Button size="large" className="w-full sm:w-auto rounded-full px-8 h-12 text-base font-semibold border-gray-200 dark:border-fintech-border dark:text-white hover:border-gray-300 dark:hover:border-gray-600 bg-white/50 dark:bg-fintech-surface/50 backdrop-blur-sm">
                Login to Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-fintech-surface border-y border-gray-100 dark:border-fintech-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-fintech-border">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="pt-8 md:pt-0">
              <div className="text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
                ₹<CountUp end={10} duration={2.5} suffix="M+" />
              </div>
              <div className="text-gray-500 dark:text-fintech-textMuted font-medium uppercase tracking-wider text-sm">Wealth Tracked</div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="pt-8 md:pt-0">
              <div className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
                <CountUp end={100} duration={2} suffix="+" />
              </div>
              <div className="text-gray-500 dark:text-fintech-textMuted font-medium uppercase tracking-wider text-sm">Goals Achieved</div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="pt-8 md:pt-0">
              <div className="text-4xl md:text-5xl font-extrabold text-green-600 dark:text-green-400 mb-2">
                <CountUp end={1000} duration={2.5} suffix="+" separator="," />
              </div>
              <div className="text-gray-500 dark:text-fintech-textMuted font-medium uppercase tracking-wider text-sm">Transactions Managed</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof / Why Us */}
      <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose MoneyHaven?</h2>
          <p className="text-lg text-gray-500 dark:text-fintech-textMuted">Everything you need to manage your personal finances, built into one beautiful platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            delay={0.1} icon={<SwapOutlined />} title="Smart Transactions"
            description="Log your income and expenses instantly. Categorize everything effortlessly to see exactly where your money goes."
          />
          <FeatureCard
            delay={0.2} icon={<WalletOutlined />} title="Intelligent Budgets"
            description="Set spending limits for categories. We'll track your progress and alert you before you overspend."
          />
          <FeatureCard
            delay={0.3} icon={<FlagOutlined />} title="Goal Tracking"
            description="Saving for a vacation or a house? Set visual milestones and watch your savings grow over time."
          />
          <FeatureCard
            delay={0.4} icon={<LineChartOutlined />} title="AI Analytics"
            description="Get personalized, AI-driven insights on your spending habits and forecast your future expenses."
          />
          <FeatureCard
            delay={0.5} icon={<FileTextOutlined />} title="Rich Reports"
            description="Export your financial data cleanly as PDF or Excel. Perfect for tax season or personal reviews."
          />
          <FeatureCard
            delay={0.6} icon={<BellOutlined />} title="Real-time Alerts"
            description="Stay on top of your finances with smart notifications for budget limits and goal achievements."
          />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-white dark:bg-fintech-surface border-y border-gray-100 dark:border-fintech-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-500 dark:text-fintech-textMuted">Four simple steps to absolute financial clarity.</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-8 top-8 bottom-8 w-0.5 bg-blue-100 dark:bg-fintech-primary/20 z-0"></div>

            <div className="space-y-12">
              <StepCard number="1" delay={0.1} title="Create Your Account" description="Sign up in seconds. Your data is secure and encrypted." />
              <StepCard number="2" delay={0.2} title="Track Transactions" description="Start logging your daily expenses and income. Assign them to categories." />
              <StepCard number="3" delay={0.3} title="Set Budgets & Goals" description="Define how much you want to spend and save each month." />
              <StepCard number="4" delay={0.4} title="Achieve Freedom" description="Review your AI insights and reports. Adjust your habits and watch your wealth grow." />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Placeholder) */}
      <section id="testimonials" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Loved by Users</h2>
        <p className="text-lg text-gray-500 dark:text-fintech-textMuted mb-12">Join thousands of others taking control of their finances.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Jenkins",
              role: "Freelance Designer",
              initials: "SJ",
              quote: "MoneyHaven completely changed how I look at my expenses. The AI insights helped me cut down my subscription bloat by 30% in just one month!"
            },
            {
              name: "David Chen",
              role: "Software Engineer",
              initials: "DC",
              quote: "Finally, a finance dashboard that doesn't feel like a spreadsheet. Tracking my custom budgets and savings goals has never been this intuitive."
            },
            {
              name: "Emily Rodriguez",
              role: "Small Business Owner",
              initials: "ER",
              quote: "The automated reports save me hours during tax season. I can see exactly where every penny goes with crystal clear categorization."
            }
          ].map((testimonial, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i+1) * 0.1 }} className="bg-gray-50 dark:bg-fintech-surface/50 border border-gray-100 dark:border-fintech-border p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-yellow-400 text-xl mb-4">★★★★★</div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-6">"{testimonial.quote}"</p>
              </div>
              <div className="flex items-center justify-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-fintech-primary/20 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shrink-0">
                  {testimonial.initials}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-500 dark:text-fintech-textMuted">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 dark:bg-fintech-surface"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to take control of your finances?</h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join MoneyHaven today and experience the easiest way to track, manage, and grow your wealth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to={ROUTES.REGISTER} className="w-full sm:w-auto">
              <Button size="large" className="w-full sm:w-auto h-14 px-8 rounded-full text-blue-600 font-bold border-0 hover:text-blue-700 hover:scale-105 transition-all">
                Get Started for Free
              </Button>
            </Link>
            <Link to={ROUTES.LOGIN} className="w-full sm:w-auto">
              <Button type="text" size="large" className="w-full sm:w-auto h-14 px-8 rounded-full text-white hover:text-blue-100 hover:bg-white/10 font-medium">
                Log In to Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-[#0a0a0a] border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">M</div>
              <span className="font-bold text-lg text-white">MoneyHaven</span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm">
              Your personal financial operating system. Track expenses, create budgets, set goals, and gain insights effortlessly.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal & Social</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-center md:text-left text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} MoneyHaven. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with 💙 for personal finance.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
