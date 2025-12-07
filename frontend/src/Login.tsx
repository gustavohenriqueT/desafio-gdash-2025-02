import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface LoginProps {
    onLoginSuccess: (token: string, userData: any) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Email ou senha inválidos");
            }

            const data = await response.json();
            onLoginSuccess(data.access_token, data.user);
        } catch (err) {
            setError("Falha no login. Verifique suas credenciais.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-100">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-slate-800">
                            <Lock className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center font-bold">Acesso Restrito</CardTitle>
                    <CardDescription className="text-center text-slate-400">
                        Entre com suas credenciais do GDASH
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                className="bg-slate-950 border-slate-700 text-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                className="bg-slate-950 border-slate-700 text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm text-center bg-red-950/30 p-2 rounded border border-red-900">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            {loading ? "Entrando..." : "Entrar no Sistema"}
                        </Button>

                        <div className="text-xs text-center text-slate-500 mt-4">
                            Credenciais padrão: admin@example.com / 123456
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}