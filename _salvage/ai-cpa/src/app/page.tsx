"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Shield,
  Zap,
  DollarSign,
  TrendingUp,
  Users,
  Building,
  FileText,
  Calculator,
  BarChart3,
  Globe,
  Smartphone,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Upload,
  Target,
  RefreshCw,
  CreditCard,
  Receipt,
  PieChart,
  LineChart,
  Scan,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Plus,
} from "lucide-react";

export default function AccountrixLandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  const features = [
    {
      icon: Brain,
      title: "Advanced AI CPA",
      subtitle:
        "Conversational AI agent providing meeting assistance, generating and answering questions, and predictive reporting capabilities.",
      items: [
        "AI-powered conversation",
        "Cash flow projections (98% acc)",
        "Real-time financial analysis",
      ],
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: Shield,
      title: "Military-Grade Security",
      subtitle:
        "Enterprise security with bank-level encryption, SOC compliance, and threat protection.",
      items: ["256-bit encryption", "SOC compliance certified", "Encrypted audit trails"],
      color: "from-red-500 to-orange-500",
    },
    {
      icon: AlertTriangle,
      title: "ML Fraud Detection",
      subtitle:
        "Real-time machine learning models with anomaly detection and behavioral analysis alerts.",
      items: [
        "Real-time transaction scoring",
        "Behavioral pattern analysis",
        "Automated fraud alerting",
      ],
      color: "from-pink-500 to-red-500",
    },
    {
      icon: Globe,
      title: "Enterprise Integrations",
      subtitle:
        "Seamless integration with Salesforce, ERP systems, payroll software, and Payment processors.",
      items: [
        "500+ pre-built integrations",
        "ERP Systems (SAP, Oracle)",
        "Payroll (ADP, PayStream)",
      ],
      color: "from-green-500 to-teal-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Reporting",
      subtitle:
        "Comprehensive financial statements, custom dashboards, and regulatory compliance reports.",
      items: ["Custom financial statements", "Executive dashboards", "Regulatory compliance"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      subtitle:
        "Automated audit system monitoring and performance optimization with advanced alerting.",
      items: ["System health monitoring", "Performance optimization", "Advanced alerting"],
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const metrics = [
    { value: "$2,847,592", label: "Total Assets", change: "+15.2%" },
    { value: "$485,000", label: "Monthly Revenue", change: "+8.7%" },
    { value: "12", label: "Active Reports", change: "+2 this week" },
    { value: "99.9%", label: "System Uptime", change: "+0.1%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ACCOUNTRIX
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Enterprise AI Accounting Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowLogin(true)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Live Demo
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Enterprise
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Login to Demo
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm mb-6">
              🔸 Enterprise AI Accounting Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI CPA for{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              $500M Companies
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Revolutionary AI-powered accounting system with military-grade security, real-time fraud
            detection, and predictive financial modeling built for enterprise scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleDemoLogin}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <Brain className="w-5 h-5" />
              <span>Try Live Demo Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all border border-white/20"
            >
              View Dashboard
            </button>
          </div>

          {/* Live Metrics */}
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-16">
            <h3 className="text-white font-semibold mb-6 flex items-center justify-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>Live Enterprise Metrics</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white mb-2">{metric.value}</p>
                  <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
                  <p className="text-green-400 text-xs">{metric.change}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-6 flex items-center justify-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Live metrics from integrated every 3 seconds</span>
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise-Grade Features */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Enterprise-Grade Features</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Built for $500M+ companies with sophisticated AI, security, and compliance requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all group"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-sm mb-6">{feature.subtitle}</p>

              <ul className="space-y-2">
                {feature.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center space-x-2 text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant Experience */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Experience the Accountrix AI Assistant
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ask complex financial questions and get instant, intelligent responses.
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
              <span className="text-sm">💬 What's our cash position for the next 90 days?</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">Accountrix AI Assistant</span>
              <span className="text-gray-400 text-sm">Based on current trends and ML analysis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <p className="text-green-400 font-bold text-lg">+$2.8M</p>
                <p className="text-gray-300 text-sm">30-Day Revenue</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                <p className="text-blue-400 font-bold text-lg">-$1.2M</p>
                <p className="text-gray-300 text-sm">Operating Expenses</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                <p className="text-purple-400 font-bold text-lg">98%</p>
                <p className="text-gray-300 text-sm">Forecast Confidence</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4">
              Key insight: Project completion Q3 significantly boost position. Recommend securing
              expenses. Consider developing revenue streams.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleDemoLogin}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
              >
                Start a demo trial on our current financial position
              </button>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Brain className="w-3 h-3 text-white" />
              </div>
              <span className="text-white font-medium text-sm">Accountrix AI Assistant</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">20% Expense Increase</span>
                <span className="text-yellow-400">⚠ CAUTION</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">30% Cost Increase</span>
                <span className="text-green-400">✓ PASS</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-gray-300">Economic Downturn</span>
                <span className="text-red-400">⚠ RISK</span>
              </div>
            </div>

            <p className="text-gray-400 text-xs mt-3">
              Recommendation: Build cash reserves to $3.5+ML operating expenses. Consider
              diversifying revenue streams.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise Solutions */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Enterprise Solutions</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Purpose-built for $500M+ companies with complex financial operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Professional</h3>
            <p className="text-4xl font-bold text-blue-400 mb-2">
              $2,500<span className="text-lg text-gray-400">/month</span>
            </p>
            <p className="text-gray-400 mb-6">For growing companies</p>
            <ul className="space-y-3 text-left mb-8">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Basic AI CPA Features</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Standard Financial Reports</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Basic Fraud Detection</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Get Started
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-2 border-purple-400 rounded-2xl p-8 text-center relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </span>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
            <p className="text-4xl font-bold text-purple-400 mb-2">
              $15,000<span className="text-lg text-gray-400">/month</span>
            </p>
            <p className="text-gray-400 mb-6">For $500M+ companies</p>
            <ul className="space-y-3 text-left mb-8">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Advanced AI CPA with ML Models</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Real-time Fraud Detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Enterprise Integrations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Custom Financial Experience</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">24/7 Enterprise Support</span>
              </li>
            </ul>
            <button
              onClick={handleDemoLogin}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-semibold"
            >
              Start Enterprise Trial
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Custom</h3>
            <p className="text-4xl font-bold text-green-400 mb-2">
              Custom<span className="text-lg text-gray-400"> pricing</span>
            </p>
            <p className="text-gray-400 mb-6">For unique requirements</p>
            <ul className="space-y-3 text-left mb-8">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Everything in Enterprise</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Custom AI Model Training</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">White-label Solutions</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Dedicated Infrastructure</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Enterprise SLA</span>
              </li>
            </ul>
            <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">Accountrix Enterprise</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Powered by Advanced ML Models</span>
              <span>Enterprise Security</span>
              <span>SOC PA Accuracy</span>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>© 2024 Accountrix AI Enterprise. $500M+ Ready Accounting Platform</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Login to Accountrix</h2>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">Or try our demo</p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition-all border border-white/20"
                >
                  🚀 Try Live Demo (No signup required)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
