import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, UserPlus, ArrowLeft } from "lucide-react";

interface User {
    _id: string;
    name: string;
    email: string;
}

interface Props {
    onBack: () => void;
}

export function UsersManager({ onBack }: Props) {
    const [users, setUsers] = useState<User[]>([]);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPass, setNewPass] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:3000/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Erro ao buscar usuários", error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, email: newEmail, password: newPass }),
            });

            setNewName(""); setNewEmail(""); setNewPass("");
            fetchUsers();
        } catch (error) {
            alert("Erro ao criar usuário");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover este usuário?")) return;
        try {
            await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
            fetchUsers();
        } catch (error) {
            alert("Erro ao deletar");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
                <h2 className="text-2xl font-bold text-slate-100">Gerenciar Usuários</h2>
            </div>

            {/* Formulário de Criação */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-slate-400">Adicionar Novo Usuário</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="flex gap-4 items-end">
                        <div className="grid gap-2 flex-1">
                            <Input placeholder="Nome" value={newName} onChange={e => setNewName(e.target.value)} className="bg-slate-950 border-slate-700 text-white" />
                        </div>
                        <div className="grid gap-2 flex-1">
                            <Input placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="bg-slate-950 border-slate-700 text-white" />
                        </div>
                        <div className="grid gap-2 flex-1">
                            <Input type="password" placeholder="Senha" value={newPass} onChange={e => setNewPass(e.target.value)} className="bg-slate-950 border-slate-700 text-white" />
                        </div>
                        <Button type="submit" className="bg-green-700 hover:bg-green-800">
                            <UserPlus className="h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Lista de Usuários */}
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800">
                                <TableHead className="text-slate-400">Nome</TableHead>
                                <TableHead className="text-slate-400">Email</TableHead>
                                <TableHead className="text-right text-slate-400">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id} className="border-slate-800">
                                    <TableCell className="text-slate-200 font-medium">{user.name}</TableCell>
                                    <TableCell className="text-slate-400">{user.email}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-400 hover:bg-red-950/30"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}