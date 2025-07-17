import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  Eye,
  Check,
  X,
  Settings,
  Download,
  MessageSquare
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { TicketService } from '../services/ticketService';

export function AdminDashboard() {
  const { user } = useAuth();
  const { setNotification } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  // Check if user is admin or the master admin
  const isMasterAdmin = user?.email === 'califellipee@outlook.com' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin' || isMasterAdmin;
  
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-gray-400">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'transactions', label: 'Transações', icon: DollarSign },
    { id: 'withdrawals', label: 'Saques', icon: Download },
    { id: 'tickets', label: 'Tickets', icon: MessageSquare },
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'dashboard') {
        await loadStats();
      } else if (activeTab === 'users') {
        await loadUsers();
      } else if (activeTab === 'products') {
        await loadProducts();
      } else if (activeTab === 'transactions') {
        await loadTransactions();
      } else if (activeTab === 'withdrawals') {
        await loadWithdrawals();
      } else if (activeTab === 'tickets') {
        await loadTickets();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const loadStats = async () => {
    try {
      const [usersResult, productsResult, transactionsResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('amount').eq('status', 'completed')
      ]);

      const totalRevenue = transactionsResult.data?.reduce((sum, t) => sum + (t.amount * 0.15), 0) || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalRevenue,
        pendingWithdrawals: 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      // Use service role key for admin access
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Limit for performance

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadProducts = async () => {
    try {
      // Use service role key for admin access
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:users(id, username, email, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      // Use service role key for admin access
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          buyer:users!transactions_buyer_id_fkey(id, username, email),
          seller:users!transactions_seller_id_fkey(id, username, email),
          product:products(title, category, game)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadWithdrawals = async () => {
    try {
      // Use service role key for admin access
      const { data, error } = await supabase
        .from('withdrawals')
        .select(`
          *,
          user:users(id, username, email, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    }
  };

  const loadTickets = async () => {
    try {
      const data = await TicketService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const handleUserVerification = async (userId: string, verified: boolean) => {
    try {
      console.log('🔐 Alterando verificação do usuário:', userId, verified);
      
      const { error } = await supabase
        .from('users')
        .update({ is_verified: verified, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
      console.log('✅ Verificação alterada');
      setNotification('✅ Verificação do usuário alterada com sucesso!');
      loadUsers(); // Reload data
    } catch (error) {
      console.error('Error updating user:', error);
      setNotification('❌ Erro ao alterar verificação do usuário');
    }
  };

  const handleUserRoleChange = async (userId: string, role: string) => {
    try {
      console.log('👑 Alterando role do usuário:', userId, role);
      
      const { error } = await supabase
        .from('users')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
      console.log('✅ Role alterada');
      setNotification('✅ Permissão do usuário alterada com sucesso!');
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      setNotification('❌ Erro ao alterar permissão do usuário');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      console.log('🗑️ Excluindo usuário:', userId);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      console.log('✅ Usuário excluído');
      setNotification('✅ Usuário excluído com sucesso!');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setNotification('❌ Erro ao excluir usuário');
    }
  };
  const handleProductApproval = async (productId: string, approved: boolean) => {
    try {
      console.log('📦 Alterando status do produto:', productId, approved);
      
      const { error } = await supabase
        .from('products')
        .update({ 
          status: approved ? 'active' : 'removed',
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;
      console.log('✅ Status do produto alterado');
      setNotification(`✅ Produto ${approved ? 'aprovado' : 'rejeitado'} com sucesso!`);
      loadProducts(); // Reload data
    } catch (error) {
      console.error('Error updating product:', error);
      setNotification('❌ Erro ao alterar status do produto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      console.log('🗑️ Excluindo produto:', productId);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      console.log('✅ Produto excluído');
      setNotification('✅ Produto excluído com sucesso!');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setNotification('❌ Erro ao excluir produto');
    }
  };
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-gray-400">Gerencie sua plataforma GG Sync Market</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                  <span className="text-green-400 text-sm font-medium">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stats.totalUsers || 0}</h3>
                <p className="text-gray-400 text-sm">Usuários Totais</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">+8%</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stats.totalProducts || 0}</h3>
                <p className="text-gray-400 text-sm">Produtos Ativos</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                  <span className="text-green-400 text-sm font-medium">+23%</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">R$ {(stats.totalRevenue || 0).toFixed(2)}</h3>
                <p className="text-gray-400 text-sm">Receita Total</p>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <Download className="w-8 h-8 text-purple-400" />
                  <span className="text-yellow-400 text-sm font-medium">{stats.pendingWithdrawals || 0}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Saques</h3>
                <p className="text-gray-400 text-sm">Pendentes</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Gerenciar Usuários ({users.length})</h3>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Carregando usuários...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Nenhum usuário encontrado</h3>
                  <p className="text-gray-400">Os usuários aparecerão aqui quando se registrarem.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={user.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                          alt={user.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">{user.username}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                          <p className="text-gray-500 text-xs">
                            Saldo: R$ {(user.balance || 0).toFixed(2)} • 
                            Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {user.is_verified && <Shield className="w-4 h-4 text-green-400" />}
                        <Badge variant={
                          user.role === 'admin' ? 'error' : 
                          user.role === 'moderator' ? 'warning' : 'primary'
                        }>
                          {user.role}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Eye}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                          >
                            Ver
                          </Button>
                          {!user.is_verified && (
                            <Button 
                              variant="primary" 
                              size="sm" 
                              icon={Check}
                              onClick={() => handleUserVerification(user.id, true)}
                            >
                              Verificar
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Gerenciar Produtos ({products.length})</h3>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Carregando produtos...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-400">Os produtos aparecerão aqui quando forem criados.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.images?.[0] || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-white font-medium">{product.title}</p>
                          <p className="text-gray-400 text-sm">
                            Vendedor: {product.seller?.username || 'N/A'} • {product.game} • {product.category}
                          </p>
                          <p className="text-green-400 font-bold">R$ {product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={
                          product.status === 'active' ? 'success' :
                          product.status === 'pending_approval' ? 'warning' : 'error'
                        }>
                          {product.status === 'active' ? 'Ativo' :
                           product.status === 'pending_approval' ? 'Pendente' : 'Removido'}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Eye}
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowProductModal(true);
                            }}
                          >
                            Ver
                          </Button>
                          {product.status === 'pending_approval' && (
                            <>
                              <Button 
                                variant="primary" 
                                size="sm" 
                                icon={Check}
                                onClick={() => handleProductApproval(product.id, true)}
                              >
                                Aprovar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                icon={X}
                                onClick={() => handleProductApproval(product.id, false)}
                              >
                                Rejeitar
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Transações ({transactions.length})</h3>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Carregando transações...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Nenhuma transação encontrada</h3>
                  <p className="text-gray-400">As transações aparecerão aqui quando forem realizadas.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-white font-medium">
                          {transaction.product?.title || 'Produto removido'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Comprador: {transaction.buyer?.username || 'N/A'} • 
                          Vendedor: {transaction.seller?.username || 'N/A'}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">
                          R$ {transaction.amount.toFixed(2)}
                        </p>
                        <Badge variant={
                          transaction.status === 'completed' ? 'success' :
                          transaction.status === 'disputed' ? 'error' :
                          transaction.status === 'escrow' ? 'warning' : 'secondary'
                        }>
                          {transaction.status === 'completed' ? 'Concluída' :
                           transaction.status === 'disputed' ? 'Disputada' :
                           transaction.status === 'escrow' ? 'Em Escrow' : transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Tickets de Suporte ({tickets.length})</h3>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Carregando tickets...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Nenhum ticket encontrado</h3>
                  <p className="text-gray-400">Os tickets de suporte aparecerão aqui.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={ticket.user?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                          alt={ticket.user?.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">{ticket.subject}</p>
                          <p className="text-gray-400 text-sm">Por: {ticket.user?.username}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={
                          ticket.status === 'new' ? 'warning' :
                          ticket.status === 'in_progress' ? 'primary' :
                          ticket.status === 'resolved' ? 'success' : 'secondary'
                        }>
                          {ticket.status === 'new' ? 'Novo' :
                           ticket.status === 'in_progress' ? 'Em Andamento' :
                           ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                        </Badge>
                        <Badge variant={
                          ticket.priority === 'urgent' ? 'error' :
                          ticket.priority === 'high' ? 'warning' :
                          ticket.priority === 'medium' ? 'primary' : 'secondary'
                        }>
                          {ticket.priority === 'urgent' ? '🚨 Urgente' :
                           ticket.priority === 'high' ? '🔴 Alta' :
                           ticket.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" icon={Eye}>
                            Ver
                          </Button>
                          <Button variant="primary" size="sm" icon={MessageSquare}>
                            Responder
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Configurações da Plataforma</h3>
                {isMasterAdmin && (
                  <Badge variant="error">Master Admin</Badge>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Taxas de Comissão</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Taxa Mínima (%)</label>
                      <input
                        type="number"
                        defaultValue="5"
                        disabled={!isMasterAdmin}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Taxa Máxima (%)</label>
                      <input
                        type="number"
                        defaultValue="20"
                        disabled={!isMasterAdmin}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Configurações de Segurança</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked disabled={!isMasterAdmin} className="rounded" />
                      <span className="text-gray-300">Verificação obrigatória para vendedores</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked disabled={!isMasterAdmin} className="rounded" />
                      <span className="text-gray-300">Moderação automática de produtos</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" disabled={!isMasterAdmin} className="rounded" />
                      <span className="text-gray-300">Notificações de atividade suspeita</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="primary" disabled={!isMasterAdmin}>
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowUserModal(false)} />
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Detalhes do Usuário</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedUser.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'}
                    alt={selectedUser.username}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="text-white font-bold text-lg">{selectedUser.username}</h4>
                    <p className="text-gray-400">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => handleUserRoleChange(selectedUser.id, e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="user">Usuário</option>
                      <option value="moderator">Moderador</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Saldo</label>
                    <p className="text-green-400 font-bold text-lg">R$ {(selectedUser.balance || 0).toFixed(2)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-400">Membro desde: {new Date(selectedUser.created_at).toLocaleDateString('pt-BR')}</p>
                  <p className="text-gray-400">Verificado: {selectedUser.is_verified ? '✅ Sim' : '❌ Não'}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowUserModal(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Detalhes do Produto</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  {selectedProduct.images?.[0] && (
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg">{selectedProduct.title}</h4>
                    <p className="text-gray-400 mb-2">{selectedProduct.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="primary">{selectedProduct.game}</Badge>
                      <Badge variant="secondary">{selectedProduct.category}</Badge>
                      <Badge variant={
                        selectedProduct.status === 'active' ? 'success' :
                        selectedProduct.status === 'pending_approval' ? 'warning' : 'error'
                      }>
                        {selectedProduct.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Preço: <span className="text-green-400 font-bold">R$ {selectedProduct.price.toFixed(2)}</span></p>
                    <p className="text-gray-400">Taxa: {selectedProduct.commission_rate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Vendedor: {selectedProduct.seller?.username || 'N/A'}</p>
                    <p className="text-gray-400">Criado em: {new Date(selectedProduct.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowProductModal(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}