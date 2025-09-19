"use client"

import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock,
  TrendingUp,
  Target,
  Calendar,
  Flame,
  BarChart3,
  Award,
  Lightbulb
} from 'lucide-react';

export function EnhancedAnalytics() {
  const analytics = useAnalytics();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decreasing': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-green-500';
    if (streak >= 3) return 'text-blue-500';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(analytics.focusTime.today)}</div>
            <p className="text-xs text-muted-foreground">
              Tempo focado hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sequência</CardTitle>
            <Flame className={`h-4 w-4 ${getStreakColor(analytics.productivity.currentStreak)}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStreakColor(analytics.productivity.currentStreak)}`}>
              {analytics.productivity.currentStreak}
            </div>
            <p className="text-xs text-muted-foreground">
              Dias consecutivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.productivity.completionRate}%</div>
            <Progress value={analytics.productivity.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendência</CardTitle>
            {getTrendIcon(analytics.patterns.weeklyTrend)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{analytics.patterns.weeklyTrend}</div>
            <p className="text-xs text-muted-foreground">
              Comparado à semana passada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="patterns">Padrões</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Tempo de Foco
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Esta Semana:</span>
                  <span className="font-medium">{formatTime(analytics.focusTime.thisWeek)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Este Mês:</span>
                  <span className="font-medium">{formatTime(analytics.focusTime.thisMonth)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="font-medium">{formatTime(analytics.focusTime.total)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Produtividade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sessão Média:</span>
                  <span className="font-medium">{formatTime(analytics.productivity.averageSessionLength)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Melhor Horário:</span>
                  <span className="font-medium">{analytics.productivity.bestTimeOfDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Recorde de Sequência:</span>
                  <span className="font-medium">{analytics.productivity.longestStreak} dias</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Padrões de Uso
              </CardTitle>
              <CardDescription>
                Entenda quando você é mais produtivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Dia Mais Ativo:</span>
                <Badge variant="secondary">{analytics.patterns.mostActiveDay}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Dia Menos Ativo:</span>
                <Badge variant="outline">{analytics.patterns.leastActiveDay}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Média Diária:</span>
                <span className="font-medium">{formatTime(analytics.patterns.dailyAverage)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tendência Semanal:</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(analytics.patterns.weeklyTrend)}
                  <span className="capitalize">{analytics.patterns.weeklyTrend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Insights Personalizados
              </CardTitle>
              <CardDescription>
                Dicas baseadas no seu uso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.insights.map((insight, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}