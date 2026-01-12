'use client';

import { useState, useEffect } from 'react';
import { LogLevel } from '@/lib/amadeus-error-logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Download, Filter, RefreshCw, Search, AlertTriangle, Info, Bug, Clock } from 'lucide-react';

// Admin API key - in a real app, this would be securely stored
const API_KEY = 'skylimit-admin-dev';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: any;
  params?: any;
}

export default function ApiLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    level: '' as LogLevel | '',
    source: '',
    search: '',
  });
  
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/admin/logs?apiKey=${API_KEY}&format=json&maxLines=500`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch logs');
      }
      
      const data = await response.json();
      setLogs(data.logs);
      setFilteredLogs(data.logs);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load logs');
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    fetchLogs();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...logs];
    
    if (filter.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }
    
    if (filter.source) {
      filtered = filtered.filter(log => log.source === filter.source);
    }
    
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm) || 
        JSON.stringify(log.details).toLowerCase().includes(searchTerm) ||
        JSON.stringify(log.params).toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredLogs(filtered);
  }, [logs, filter]);
  
  // Get unique sources for filter dropdown
  const sources = [...new Set(logs.map(log => log.source))];
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  
  // Download logs as JSON
  const downloadLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `amadeus-logs-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Get level badge color
  const getLevelBadge = (level: LogLevel) => {
    switch(level) {
      case LogLevel.ERROR:
        return <Badge variant="destructive" className="font-bold"><Bug className="w-3 h-3 mr-1" /> {level}</Badge>;
      case LogLevel.WARNING:
        return <Badge variant="warning" className="bg-amber-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" /> {level}</Badge>;
      case LogLevel.INFO:
        return <Badge variant="outline" className="bg-blue-500 text-white"><Info className="w-3 h-3 mr-1" /> {level}</Badge>;
      case LogLevel.DEBUG:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> {level}</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Amadeus API Logs</h1>
          <p className="text-muted-foreground">
            Monitor and troubleshoot Amadeus API integrations
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            onClick={fetchLogs}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          <Button 
            onClick={downloadLogs}
            variant="secondary"
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter Logs
          </CardTitle>
          <CardDescription>
            Narrow down logs by level, source, or content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Log Level</label>
              <Select 
                value={filter.level} 
                onValueChange={(value) => setFilter({...filter, level: value as LogLevel | ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARNING">WARNING</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                  <SelectItem value="DEBUG">DEBUG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Source</label>
              <Select 
                value={filter.source} 
                onValueChange={(value) => setFilter({...filter, source: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sources</SelectItem>
                  {sources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="flex">
                <Input
                  placeholder="Search in messages and details"
                  value={filter.search}
                  onChange={(e) => setFilter({...filter, search: e.target.value})}
                  className="rounded-r-none"
                />
                <Button variant="ghost" className="rounded-l-none border border-l-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3">Loading logs...</span>
        </div>
      )}
      
      {/* Log count */}
      {!loading && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logs.length} logs
            {filter.level || filter.source || filter.search ? ' (filtered)' : ''}
          </p>
        </div>
      )}
      
      {/* Log list */}
      {!loading && filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No logs found</p>
          {(filter.level || filter.source || filter.search) && (
            <Button 
              variant="ghost" 
              className="mt-2"
              onClick={() => setFilter({level: '', source: '', search: ''})}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
      
      {!loading && filteredLogs.length > 0 && (
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <Card key={index} className={`overflow-hidden border-l-4 ${
              log.level === LogLevel.ERROR ? 'border-l-red-500' : 
              log.level === LogLevel.WARNING ? 'border-l-amber-500' : 
              log.level === LogLevel.INFO ? 'border-l-blue-500' : 
              'border-l-gray-300'
            }`}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <div className="flex items-center">
                    {getLevelBadge(log.level)}
                    <span className="ml-2 text-sm font-medium bg-muted px-2 py-1 rounded">
                      {log.source}
                    </span>
                  </div>
                  <time className="text-xs text-muted-foreground mt-1 md:mt-0">
                    {formatDate(log.timestamp)}
                  </time>
                </div>
                
                <p className="text-sm md:text-base font-medium mt-2">{log.message}</p>
                
                {/* Collapsible details */}
                <Tabs defaultValue="details" className="mt-4">
                  <TabsList className="bg-muted text-xs">
                    <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                    <TabsTrigger value="params" className="text-xs">Parameters</TabsTrigger>
                    <TabsTrigger value="raw" className="text-xs">Raw</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="pt-2">
                    {log.details ? (
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-64">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-sm text-muted-foreground">No details available</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="params" className="pt-2">
                    {log.params ? (
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-64">
                        {JSON.stringify(log.params, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-sm text-muted-foreground">No parameters available</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="raw" className="pt-2">
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-64">
                      {JSON.stringify(log, null, 2)}
                    </pre>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 