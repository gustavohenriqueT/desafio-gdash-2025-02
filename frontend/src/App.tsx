import { useEffect, useState } from "react";
import { Login } from "./Login";
import { UsersManager } from "./UsersManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Wind, Droplets, Thermometer, Download, BrainCircuit, LogOut, Users } from "lucide-react";

interface WeatherLog {
  _id: string;
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  createdAt: string;
}

function App() {
  const [view, setView] = useState<'dashboard' | 'users'>('dashboard');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [logs, setLogs] = useState<WeatherLog[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("gdash_token");
    const savedUser = localStorage.getItem("gdash_user");
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (token: string, userData: any) => {
    localStorage.setItem("gdash_token", token);
    localStorage.setItem("gdash_user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("gdash_token");
    localStorage.removeItem("gdash_user");
    setIsAuthenticated(false);
    setUser(null);
    setLogs([]);
    setView('dashboard');
  };

  const handleDownloadCsv = () => {
    window.open("http://localhost:3000/weather/export/csv", "_blank");
  };

  const fetchWeather = async () => {
    if (!isAuthenticated) return;
    try {
      const responseLogs = await fetch("http://localhost:3000/weather");
      const dataLogs = await responseLogs.json();
      setLogs(dataLogs);

      const responseInsights = await fetch("http://localhost:3000/weather/insights");
      const dataInsights = await responseInsights.json();
      setInsights(dataInsights);

      setLoading(false);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWeather();
      const interval = setInterval(fetchWeather, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const latest = logs[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* CABEÇALHO */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              GDash Weather 🚀
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Bem-vindo, {user?.name}
            </p>
          </div>

          <div className="flex gap-2">
            {view === 'dashboard' && (
              <>
                <Button
                  variant="outline"
                  className="border-blue-800 text-blue-400 hover:bg-blue-950/50 hover:text-blue-200"
                  onClick={handleDownloadCsv}
                >
                  <Download className="mr-2 h-4 w-4" /> Exportar
                </Button>

                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                  onClick={() => setView('users')}
                >
                  <Users className="h-4 w-4 mr-2" /> Usuários
                </Button>
              </>
            )}

            {/* Botão de Logout */}
            <Button
              variant="destructive"
              className="bg-red-900 hover:bg-red-800"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {view === 'users' ? (
          <UsersManager onBack={() => setView('dashboard')} />
        ) : (
          <>
            {latest ? (
              <>
                {/* Seção de Inteligência Artificial */}
                {insights && (
                  <Card className="bg-gradient-to-r from-violet-950 to-slate-900 border-violet-800">
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <BrainCircuit className="h-6 w-6 text-violet-400 mr-2" />
                      <CardTitle className="text-violet-100">Análise Inteligente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-violet-100">
                        <div>
                          <p className="text-sm text-violet-400">Tendência</p>
                          <p className="text-lg font-bold">{insights.trend}</p>
                        </div>
                        <div>
                          <p className="text-sm text-violet-400">Análise</p>
                          <p className="text-md">{insights.summary}</p>
                        </div>
                        <div>
                          <p className="text-sm text-violet-400">Recomendação</p>
                          <p className="text-md font-semibold text-yellow-300">{insights.alert}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Cards de Temperatura */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Temperatura</CardTitle>
                      <Thermometer className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{latest.temperature}°C</div>
                      <p className="text-xs text-slate-500">Em {latest.city}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Umidade</CardTitle>
                      <Droplets className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{latest.humidity}%</div>
                      <p className="text-xs text-slate-500">Umidade Relativa</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">Vento</CardTitle>
                      <Wind className="h-4 w-4 text-cyan-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{latest.windSpeed} km/h</div>
                      <p className="text-xs text-slate-500">Velocidade</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-500">
                {loading ? "Carregando dados..." : "Nenhum dado recebido ainda."}
              </div>
            )}

            {/* Tabela de Histórico */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Histórico de Recebimento</CardTitle>
                <Badge variant="outline" className="text-green-400 border-green-800 bg-green-950/30 ml-2">
                  Sistema Online
                </Badge>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                      <TableHead className="text-slate-400">Hora</TableHead>
                      <TableHead className="text-slate-400">Cidade</TableHead>
                      <TableHead className="text-slate-400">Temp</TableHead>
                      <TableHead className="text-slate-400">Condição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.slice(0, 10).map((log) => (
                      <TableRow key={log._id} className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell className="font-mono text-slate-300">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>{log.city}</TableCell>
                        <TableCell>{log.temperature}°C</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700">
                            {log.condition}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default App;