'use client';

import React, { useState } from 'react';
import {
  Building,
  Save,
  Upload,
  Download,
  Users,
  Globe,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  Settings,
  CheckCircle,
  ArrowLeft,
  Brain,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Company Management</h1>
                <p className="text-gray-400">Enterprise-grade company setup and management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Building className="w-5 h-5 text-blue-400" />
            <span>Company Information</span>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
              <input
                type="text"
                defaultValue="Accountrix Technologies Inc."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Legal Name</label>
              <input
                type="text"
                defaultValue="Accountrix Technologies Incorporated"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">EIN</label>
              <input
                type="text"
                defaultValue="12-3456789"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Business Type</label>
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                <option value="C-Corporation" className="text-black bg-white">C-Corporation</option>
                <option value="S-Corporation" className="text-black bg-white">S-Corporation</option>
                <option value="LLC" className="text-black bg-white">LLC</option>
                <option value="Partnership" className="text-black bg-white">Partnership</option>
                <option value="Sole-Proprietorship" className="text-black bg-white">Sole Proprietorship</option>
              </select>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Contact Information</span>
              </h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Phone"
                  defaultValue="+1 (512) 555-0123"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  defaultValue="info@accountrix.ai"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>Banking Information</span>
              </h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Primary Bank"
                  defaultValue="Chase Business Banking"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
                <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                  <option value="Business Checking">Business Checking</option>
                  <option value="Business Savings">Business Savings</option>
                  <option value="Money Market">Money Market</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}