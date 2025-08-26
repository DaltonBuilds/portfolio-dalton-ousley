"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Shield, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Server,
  Database,
  Network,
  Monitor,
  Lock,
  GitBranch,
  Cloud,
  Gauge,
  BarChart3,
  Eye,
  Settings,
  Target,
  Brain
} from 'lucide-react';

interface MetricData {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  status: 'healthy' | 'warning' | 'critical' | 'optimal';
  category: 'performance' | 'security' | 'cost' | 'reliability' | 'delivery';
}

interface SystemComponent {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'maintenance' | 'optimal';
  uptime: string;
  load: number;
  description: string;
  icon: React.ReactNode;
  metrics: string[];
}

const dashboardMetrics: MetricData[] = [
  {
    id: 'availability',
    label: 'System Availability',
    value: '99.95%',
    trend: 'stable',
    change: '+0.02%',
    status: 'optimal',
    category: 'reliability'
  },
  {
    id: 'mttr',
    label: 'Mean Time to Recovery',
    value: '8.2min',
    trend: 'up',
    change: '-63%',
    status: 'healthy',
    category: 'reliability'
  },
  {
    id: 'deploy-freq',
    label: 'Deploy Frequency',
    value: '12.3/day',
    trend: 'up',
    change: '+340%',
    status: 'optimal',
    category: 'delivery'
  },
  {
    id: 'security-score',
    label: 'Security Posture',
    value: '98.7%',
    trend: 'up',
    change: '+2.1%',
    status: 'healthy',
    category: 'security'
  },
  {
    id: 'cost-efficiency',
    label: 'Cost Optimization',
    value: '27%',
    trend: 'up',
    change: 'Saved',
    status: 'optimal',
    category: 'cost'
  },
  {
    id: 'performance',
    label: 'Response Time P95',
    value: '42ms',
    trend: 'up',
    change: '-18%',
    status: 'optimal',
    category: 'performance'
  },
  {
    id: 'error-rate',
    label: 'Error Rate',
    value: '0.023%',
    trend: 'up',
    change: '-45%',
    status: 'healthy',
    category: 'reliability'
  },
  {
    id: 'throughput',
    label: 'Request Throughput',
    value: '2.5M/hr',
    trend: 'stable',
    change: '+12%',
    status: 'healthy',
    category: 'performance'
  }
];

const systemComponents: SystemComponent[] = [
  {
    id: 'k8s-cluster',
    name: 'Kubernetes Clusters',
    status: 'optimal',
    uptime: '99.99%',
    load: 67,
    description: 'Multi-region K8s with auto-scaling',
    icon: <Server className="w-5 h-5" />,
    metrics: ['CPU: 67%', 'Memory: 54%', 'Pods: 847']
  },
  {
    id: 'cicd-pipeline',
    name: 'CI/CD Pipeline',
    status: 'online',
    uptime: '99.92%',
    load: 23,
    description: 'GitOps with automated testing',
    icon: <GitBranch className="w-5 h-5" />,
    metrics: ['Success: 98.7%', 'Queue: 3', 'Avg: 4.2min']
  },
  {
    id: 'monitoring',
    name: 'Observability Stack',
    status: 'optimal',
    uptime: '99.99%',
    load: 45,
    description: 'Grafana, Prometheus, Jaeger',
    icon: <Monitor className="w-5 h-5" />,
    metrics: ['Metrics: 2.1M/s', 'Traces: 45K/s', 'Logs: 890GB/day']
  },
  {
    id: 'security',
    name: 'Security Systems',
    status: 'optimal',
    uptime: '100%',
    load: 12,
    description: 'Zero-trust architecture',
    icon: <Shield className="w-5 h-5" />,
    metrics: ['Threats: 0', 'Scans: 24/day', 'Compliance: 100%']
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipelines',
    status: 'online',
    uptime: '99.99%',
    load: 78,
    description: 'Real-time data processing',
    icon: <Database className="w-5 h-5" />,
    metrics: ['Throughput: 2.5TB/day', 'Latency: <100ms', 'Quality: 99.7%']
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    status: 'optimal',
    uptime: '99.99%',
    load: 56,
    description: 'Rate limiting & load balancing',
    icon: <Network className="w-5 h-5" />,
    metrics: ['Requests: 2.5M/hr', 'Latency: 42ms', 'Cache: 87%']
  }
];

const statusColors = {
  online: 'bg-green-500',
  optimal: 'bg-blue-500',
  degraded: 'bg-yellow-500',
  maintenance: 'bg-orange-500',
  healthy: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500'
};

const categoryIcons = {
  performance: <Gauge className="w-4 h-4" />,
  security: <Shield className="w-4 h-4" />,
  cost: <DollarSign className="w-4 h-4" />,
  reliability: <Target className="w-4 h-4" />,
  delivery: <Zap className="w-4 h-4" />
};

function StatusIndicator({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${statusColors[status as keyof typeof statusColors]} animate-pulse`} />
      <span className="text-xs uppercase tracking-wider font-medium">{status}</span>
    </div>
  );
}

function MetricCard({ metric, delay = 0 }: { metric: MetricData; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/50 to-blue-500/50" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-green-400">
          {categoryIcons[metric.category]}
          <span className="text-xs uppercase tracking-wider">{metric.category}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${statusColors[metric.status]} animate-pulse`} />
      </div>
      
      <div className="space-y-1">
        <h3 className="text-white font-medium text-sm">{metric.label}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-green-400">{metric.value}</span>
          <span className={`text-xs ${
            metric.trend === 'up' ? 'text-green-400' : 
            metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} {metric.change}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function SystemMonitor({ component, delay = 0 }: { component: SystemComponent; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-black/60 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 relative"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
            {component.icon}
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{component.name}</h3>
            <StatusIndicator status={component.status} />
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Uptime</div>
          <div className="text-sm font-bold text-green-400">{component.uptime}</div>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mb-3">{component.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Load</span>
          <span className="text-xs text-white">{component.load}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${component.load}%` }}
            transition={{ delay: delay + 0.5, duration: 1 }}
            className={`h-1 rounded-full ${
              component.load > 80 ? 'bg-red-500' :
              component.load > 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-1 mt-3">
          {component.metrics.map((metric, index) => (
            <div key={index} className="text-xs text-gray-300 font-mono">
              {metric}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AlertPanel() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-orange-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">System Status</span>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>All systems operational</span>
        </div>
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>Next deployment: 14:30 UTC</span>
        </div>
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <Activity className="w-4 h-4" />
          <span>Monitoring active: 847 services</span>
        </div>
      </div>
    </div>
  );
}

export function CommandCenterDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <Gauge className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'operations', label: 'Operations', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,255,0,0.3) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Cloud Architecture Command Center</h2>
              <p className="text-xs text-gray-400">Enterprise Infrastructure Management Console</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400">Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-bold">OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-black/40 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all ${
                activeTab === tab.id
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dashboardMetrics.slice(0, 4).map((metric, index) => (
                  <MetricCard key={metric.id} metric={metric} delay={index * 0.1} />
                ))}
              </div>
              
              {/* System Components */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemComponents.map((component, index) => (
                  <SystemMonitor key={component.id} component={component} delay={index * 0.15} />
                ))}
              </div>
              
              {/* Alert Panel */}
              <AlertPanel />
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {dashboardMetrics.filter(m => m.category === 'performance' || m.category === 'reliability').map((metric, index) => (
                <MetricCard key={metric.id} metric={metric} delay={index * 0.1} />
              ))}
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {dashboardMetrics.filter(m => m.category === 'security').map((metric, index) => (
                <MetricCard key={metric.id} metric={metric} delay={index * 0.1} />
              ))}
              {systemComponents.filter(c => c.id === 'security' || c.id === 'monitoring').map((component, index) => (
                <SystemMonitor key={component.id} component={component} delay={index * 0.2} />
              ))}
            </motion.div>
          )}

          {activeTab === 'operations' && (
            <motion.div
              key="operations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardMetrics.filter(m => m.category === 'delivery' || m.category === 'cost').map((metric, index) => (
                  <MetricCard key={metric.id} metric={metric} delay={index * 0.1} />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemComponents.filter(c => c.id === 'cicd-pipeline' || c.id === 'k8s-cluster').map((component, index) => (
                  <SystemMonitor key={component.id} component={component} delay={index * 0.15} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="relative z-10 mt-8 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">847</div>
            <div className="text-xs text-gray-400">Services Monitored</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">2.5M</div>
            <div className="text-xs text-gray-400">Requests/Hour</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-400">99.99%</div>
            <div className="text-xs text-gray-400">Uptime SLA</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-400">24/7</div>
            <div className="text-xs text-gray-400">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
}
