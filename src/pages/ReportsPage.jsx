import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import reportsData from '../data/reports.json';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Download,
  Eye,
  ChevronRight,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Stethoscope,
  FileText
} from 'lucide-react';

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [activeTab, setActiveTab] = useState('overview');

  // Data statistik dari reports.json
  const stats = {
    revenue: reportsData.monthlyRevenue || "$12,450",
    growth: reportsData.patientGrowth || "15%",
    topService: reportsData.topService || "Root Canal Treatment",
    totalPatients: reportsData.totalPatients || 284,
    appointmentRate: reportsData.appointmentRate || "92%",
    avgRating: reportsData.avgRating || 4.8,
    pendingReviews: reportsData.pendingReviews || 3,
    services: reportsData.services || [
      { name: "Root Canal", count: 45, revenue: "$6,750" },
      { name: "Teeth Whitening", count: 32, revenue: "$4,800" },
      { name: "Dental Implant", count: 28, revenue: "$8,400" },
      { name: "Braces", count: 24, revenue: "$7,200" }
    ],
    monthlyData: reportsData.monthlyData || [
      { month: "Jan", revenue: 8200, patients: 45 },
      { month: "Feb", revenue: 9100, patients: 52 },
      { month: "Mar", revenue: 7800, patients: 48 },
      { month: "Apr", revenue: 10200, patients: 58 },
      { month: "May", revenue: 9400, patients: 55 },
      { month: "Jun", revenue: 12450, patients: 67 }
    ]
  };

  const timeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  // Helper untuk format currency
  const formatCurrency = (value) => {
    if (typeof value === 'string' && value.startsWith('$')) return value;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-5">
      <PageHeader 
        title="Reports" 
        subtitle="Analyze clinic performance and financial growth." 
      />

      {/* Time Range Filter & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === option.value
                  ? 'bg-[var(--dark-blue)] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[var(--dark-blue)] hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[var(--dark-blue)] hover:text-[var(--dark-blue)] transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--dark-blue)] text-white rounded-xl text-sm hover:bg-blue-800 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Revenue</span>
              <p className="text-2xl font-bold text-[var(--dark-blue)] mt-1">{stats.revenue}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">+12.5%</span>
                <span className="text-xs text-gray-400">vs last month</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Patients</span>
              <p className="text-2xl font-bold text-[var(--dark-blue)] mt-1">{stats.totalPatients}</p>
              <div className="flex items-center gap-1 mt-1">
                <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">{stats.growth}</span>
                <span className="text-xs text-gray-400">growth</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Appointment Rate</span>
              <p className="text-2xl font-bold text-[var(--dark-blue)] mt-1">{stats.appointmentRate}</p>
              <div className="flex items-center gap-1 mt-1">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600">+2.1%</span>
                <span className="text-xs text-gray-400">improvement</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Rating</span>
              <p className="text-2xl font-bold text-[var(--dark-blue)] mt-1">{stats.avgRating} ★</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-amber-500">⭐⭐⭐⭐⭐</span>
                <span className="text-xs text-gray-400">({stats.pendingReviews} reviews)</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Visual representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--dark-blue)]">Revenue Overview</h3>
            <span className="text-xs text-gray-400">Last 6 months</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {stats.monthlyData.map((data, index) => {
              const maxRevenue = Math.max(...stats.monthlyData.map(d => d.revenue));
              const height = (data.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full max-w-[40px] bg-gradient-to-t from-[var(--dark-blue)] to-blue-400 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-gray-400">{data.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>${Math.min(...stats.monthlyData.map(d => d.revenue)).toLocaleString()}</span>
            <span>${Math.max(...stats.monthlyData.map(d => d.revenue)).toLocaleString()}</span>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-[var(--dark-blue)] mb-3">Top Services</h3>
          <div className="space-y-3">
            {stats.services.slice(0, 4).map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    index === 0 ? 'bg-emerald-50 text-emerald-600' :
                    index === 1 ? 'bg-blue-50 text-blue-600' :
                    index === 2 ? 'bg-purple-50 text-purple-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-700">{service.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{service.count} pts</span>
                  <span className="text-sm font-semibold text-[var(--dark-blue)]">{service.revenue}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 text-xs text-[var(--dark-blue)] font-medium hover:underline text-center">
            View all services →
          </button>
        </div>
      </div>

      {/* Quick Actions / Additional Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--dark-blue)]">Patient Reports</p>
              <p className="text-xs text-gray-400">Detailed patient analytics</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--dark-blue)] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--dark-blue)]">Financial Reports</p>
              <p className="text-xs text-gray-400">Revenue & expenses</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--dark-blue)] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--dark-blue)]">Service Analytics</p>
              <p className="text-xs text-gray-400">Top performing services</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--dark-blue)] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--dark-blue)]">Performance</p>
              <p className="text-xs text-gray-400">Clinic metrics</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--dark-blue)] group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}