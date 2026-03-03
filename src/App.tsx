/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  Brain, 
  CheckCircle2, 
  Github, 
  Gitlab, 
  Layout, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  Menu, 
  X,
  ChevronRight,
  BarChart3,
  Users,
  ArrowRight,
  Lock,
  Globe,
  Code2,
  Cpu,
  Sparkles,
  TrendingUp,
  Clock,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform duration-300">
              <Zap className="text-black w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-bold tracking-tighter font-display">CodePulse</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {["Features", "Integrations", "Pricing", "Docs"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Sign in</button>
            <button className="bg-brand text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-brand/90 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              Start Free Trial
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-zinc-400 hover:text-white transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-6">
              {["Features", "Integrations", "Pricing", "Docs"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-lg font-medium text-zinc-400 hover:text-brand transition-colors">
                  {item}
                </a>
              ))}
              <div className="pt-6 flex flex-col gap-4">
                <button className="w-full py-3 text-zinc-400 font-medium">Sign in</button>
                <button className="w-full bg-brand text-black py-3 rounded-xl font-bold">Start Free Trial</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-brand" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Now with AI Burnout Prediction</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            Scale Your Team,<br />
            <span className="text-brand italic font-display">Not Their Stress</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Analyze developer velocity and patterns without the micromanagement. 
            CodePulse predicts burnout before it happens, keeping your engineers happy and your codebase healthy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="group relative w-full sm:w-auto bg-brand text-black px-10 py-5 rounded-2xl text-lg font-bold hover:bg-brand/90 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Start Analyzing for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button className="w-full sm:w-auto bg-white/5 border border-white/10 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
              Book a Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-32"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-12">Trusted by the world's best engineering teams</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {["Vercel", "Stripe", "Airbnb", "OpenAI", "Slack", "Github"].map((brand) => (
              <div key={brand} className="flex items-center gap-2 font-bold text-2xl tracking-tighter hover:text-white transition-colors cursor-default">
                <div className="w-6 h-6 bg-zinc-700 rounded-sm" /> {brand}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureBento = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Insight, not oversight.</h2>
          <p className="text-zinc-400 text-lg">We provide the metrics that matter for a healthy engineering culture, without the invasive tracking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-8 group-hover:bg-brand/20 transition-colors">
                <Activity className="text-brand w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Predictive Burnout Analysis</h3>
              <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
                Our AI models analyze commit patterns, PR cycle times, and communication frequency to detect early signs of developer fatigue before it impacts your team.
              </p>
              
              <div className="mt-12 p-6 rounded-2xl bg-black/40 border border-white/5 max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Team Health Score</span>
                  <span className="text-brand font-bold">92%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "92%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-brand" 
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                  <TrendingUp className="w-3 h-3 text-brand" />
                  <span>+4% from last sprint</span>
                </div>
              </div>
            </div>
            {/* Decorative Gradient */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand/5 to-transparent pointer-events-none" />
          </motion.div>

          {/* Small Card 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-8 group-hover:bg-brand/20 transition-colors">
              <Code2 className="text-brand w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Knowledge Silo Detection</h3>
            <p className="text-zinc-400 leading-relaxed">
              Identify areas of your codebase where only one person has context, helping you prioritize knowledge sharing.
            </p>
          </motion.div>

          {/* Small Card 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-8 group-hover:bg-brand/20 transition-colors">
              <Clock className="text-brand w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Cycle Time Optimization</h3>
            <p className="text-zinc-400 leading-relaxed">
              Track the time from first commit to production. Identify bottlenecks in your review process and deployment pipeline.
            </p>
          </motion.div>

          {/* Medium Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 relative overflow-hidden group"
          >
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-8 group-hover:bg-brand/20 transition-colors">
                  <Cpu className="text-brand w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Deep Contextual Metrics</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  We don't just count commits. We understand the complexity of changes, the impact on the codebase, and the cognitive load required.
                </p>
              </div>
              <div className="flex-1 w-full grid grid-cols-4 gap-2 items-end h-32">
                {[40, 70, 50, 90, 60, 80, 45, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-t-lg ${i % 2 === 0 ? 'bg-brand/40' : 'bg-brand'}`} 
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Integrations = () => {
  const integrations = [
    { name: "GitHub", icon: <Github className="w-8 h-8" />, color: "bg-zinc-800" },
    { name: "GitLab", icon: <Gitlab className="w-8 h-8" />, color: "bg-orange-600/20 text-orange-500" },
    { name: "Bitbucket", icon: <Zap className="w-8 h-8" />, color: "bg-blue-600/20 text-blue-500" },
    { name: "Slack", icon: <MessageSquare className="w-8 h-8" />, color: "bg-emerald-600/20 text-emerald-500" },
    { name: "Jira", icon: <BarChart3 className="w-8 h-8" />, color: "bg-blue-500/20 text-blue-400" },
    { name: "Linear", icon: <Layout className="w-8 h-8" />, color: "bg-indigo-500/20 text-indigo-400" }
  ];

  return (
    <section id="integrations" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-6">
              <Globe className="w-3 h-3 text-brand" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand">Global Connectivity</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">Connects where you code.</h2>
            <p className="text-zinc-400 text-xl mb-10 leading-relaxed font-light">
              Integrates in seconds with your existing CI/CD pipeline. No agents to install, no manual logging. We connect via OAuth and start analyzing history immediately.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "SOC2 Type II", desc: "Enterprise-grade security standards." },
                { title: "Read-Only", desc: "We never modify your source code." },
                { title: "Zero Config", desc: "Connect and get insights in minutes." },
                { title: "Multi-Cloud", desc: "Works with AWS, GCP, and Azure." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-brand" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">{item.title}</h4>
                    <p className="text-sm text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {integrations.map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-10 rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center gap-6 hover:bg-zinc-900 hover:border-brand/30 transition-all cursor-pointer group shadow-xl"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color} group-hover:glow transition-all duration-500`}>
                  {item.icon}
                </div>
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      desc: "For small teams and open source projects.",
      features: ["Up to 5 developers", "30-day history", "Basic burnout alerts", "GitHub integration"],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$49",
      period: "/dev/mo",
      desc: "For growing engineering organizations.",
      features: ["Unlimited developers", "Unlimited history", "Advanced AI burnout prediction", "All integrations", "Custom dashboards"],
      cta: "Start 14-day Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For large-scale organizations with complex needs.",
      features: ["SSO & SAML", "Dedicated account manager", "Custom data retention", "On-premise options", "SLA guarantees"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Simple, transparent pricing.</h2>
          <p className="text-zinc-400 text-lg">Choose the plan that's right for your team's size and stage.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-[2.5rem] border flex flex-col ${plan.popular ? 'bg-brand/5 border-brand/30 relative' : 'bg-zinc-900/50 border-white/5'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-bold tracking-tighter">{plan.price}</span>
                  {plan.period && <span className="text-zinc-500 text-sm">{plan.period}</span>}
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">{plan.desc}</p>
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.popular ? 'bg-brand text-black hover:bg-brand/90 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DashboardPreview = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">Powerful Dashboards</h2>
        <p className="text-zinc-400 text-xl mb-20 max-w-2xl mx-auto font-light">Everything you need to know about your team's pulse, in one beautiful interface.</p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mx-auto max-w-6xl group"
        >
          <div className="bg-zinc-900 rounded-[2rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Browser Header */}
            <div className="bg-zinc-800/80 px-6 py-4 border-b border-white/5 flex items-center gap-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/30" />
              </div>
              <div className="flex-1 bg-black/40 rounded-lg py-1.5 text-xs text-zinc-500 font-mono tracking-tight border border-white/5">
                app.codepulse.io/team-pulse
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-700/50" />
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-10 bg-gradient-to-b from-zinc-900 to-black">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                  { label: "Active Devs", val: "24", change: "+2", icon: <Users className="w-4 h-4" /> },
                  { label: "Cycle Time", val: "2.4d", change: "-12%", icon: <Clock className="w-4 h-4" /> },
                  { label: "PR Throughput", val: "142", change: "+14%", icon: <Code2 className="w-4 h-4" /> },
                  { label: "Burnout Risk", val: "Low", change: "Stable", icon: <AlertCircle className="w-4 h-4" /> }
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-zinc-800/30 border border-white/5 text-left">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                        {stat.icon}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-brand/10 text-brand' : 'bg-zinc-700/30 text-zinc-400'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold tracking-tight">{stat.val}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 h-80 rounded-2xl bg-zinc-800/30 border border-white/5 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-sm font-bold text-zinc-300">Team Velocity</h4>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-brand" />
                        <span className="text-[10px] text-zinc-500">Current</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-brand/30" />
                        <span className="text-[10px] text-zinc-500">Previous</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex items-end gap-4">
                    {[30, 50, 40, 70, 60, 45, 90, 65, 80, 55, 75, 100].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.8 }}
                        className={`flex-1 rounded-t-lg ${i % 2 === 0 ? 'bg-brand/80' : 'bg-brand/40'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="h-80 rounded-2xl bg-zinc-800/30 border border-white/5 p-8 flex flex-col">
                  <h4 className="text-sm font-bold text-zinc-300 mb-8 text-left">Burnout Risk Distribution</h4>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22c55e" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="50.24" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">80%</span>
                        <span className="text-[8px] font-bold uppercase text-zinc-500">Healthy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Glow */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full h-60 bg-brand/10 blur-[120px] -z-10 opacity-50" />
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-32 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-24">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <Zap className="text-black w-5 h-5 fill-current" />
              </div>
              <span className="text-2xl font-bold tracking-tighter font-display">CodePulse</span>
            </div>
            <p className="text-zinc-500 text-lg leading-relaxed mb-10 max-w-xs font-light">
              The modern engineering intelligence platform built for developer well-being and productivity.
            </p>
            <div className="flex gap-6">
              {["Github", "Twitter", "LinkedIn", "Discord"].map((social) => (
                <a key={social} href="#" className="text-zinc-500 hover:text-white transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest">{social}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-8">Product</h4>
            <ul className="space-y-6 text-sm text-zinc-500">
              {["Features", "Integrations", "Pricing", "Changelog", "Security"].map((item) => (
                <li key={item}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-8">Resources</h4>
            <ul className="space-y-6 text-sm text-zinc-500">
              {["Documentation", "API Reference", "Blog", "Community", "Guides"].map((item) => (
                <li key={item}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-8">Company</h4>
            <ul className="space-y-6 text-sm text-zinc-500">
              {["About", "Careers", "News", "Contact", "Legal"].map((item) => (
                <li key={item}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-8">Support</h4>
            <ul className="space-y-6 text-sm text-zinc-500">
              {["Help Center", "Status", "Contact Us", "Feedback"].map((item) => (
                <li key={item}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <p className="text-xs text-zinc-600 font-medium uppercase tracking-widest">All systems operational</p>
          </div>
          <p className="text-xs text-zinc-600">© 2024 CodePulse Inc. Built with love for developers.</p>
          <div className="flex gap-8 text-xs text-zinc-600 font-medium uppercase tracking-widest">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main>
        <Hero />
        <FeatureBento />
        <Integrations />
        <DashboardPreview />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
