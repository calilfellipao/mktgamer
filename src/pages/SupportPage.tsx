import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useApp } from '../contexts/AppContext';
import { ticketService } from '../services/ticketService';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  messages?: TicketMessage[];
}

interface TicketMessage {
  id: string;
  message: string;
  sender_id: string;
  is_admin: boolean;
  created_at: string;
  sender?: {
    username: string;
  };
}

export function SupportPage() {
  const { user, showNotification } = useApp();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userTickets = await ticketService.getUserTickets(user.id);
      setTickets(userTickets);
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
      showNotification('Erro ao carregar tickets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const ticket = await ticketService.createTicket({
        user_id: user.id,
        subject: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority
      });

      setTickets(prev => [ticket, ...prev]);
      setNewTicket({ subject: '', description: '', priority: 'medium' });
      setShowCreateForm(false);
      showNotification('Ticket criado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      showNotification('Erro ao criar ticket', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !user || !newMessage.trim()) return;

    try {
      const message = await ticketService.sendMessage({
        ticket_id: selectedTicket.id,
        sender_id: user.id,
        message: newMessage.trim(),
        is_admin: false
      });

      setSelectedTicket(prev => prev ? {
        ...prev,
        messages: [...(prev.messages || []), message]
      } : null);
      
      setNewMessage('');
      showNotification('Mensagem enviada!', 'success');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      showNotification('Erro ao enviar mensagem', 'error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600">Você precisa estar logado para acessar o suporte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Central de Suporte</h1>
          <p className="text-gray-600 mt-2">
            Precisa de ajuda? Crie um ticket e nossa equipe irá te ajudar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Tickets */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Meus Tickets</h2>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Ticket
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Carregando tickets...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum ticket encontrado</p>
                    <p className="text-sm text-gray-400">Crie seu primeiro ticket de suporte</p>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedTicket?.id === ticket.id ? 'bg-purple-50 border-r-4 border-purple-500' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 truncate">{ticket.subject}</h3>
                        <div className="flex items-center space-x-1 ml-2">
                          {getStatusIcon(ticket.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status === 'new' && 'Novo'}
                            {ticket.status === 'in_progress' && 'Em Andamento'}
                            {ticket.status === 'resolved' && 'Resolvido'}
                            {ticket.status === 'closed' && 'Fechado'}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority === 'urgent' && 'Urgente'}
                            {ticket.priority === 'high' && 'Alta'}
                            {ticket.priority === 'medium' && 'Média'}
                            {ticket.priority === 'low' && 'Baixa'}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Detalhes do Ticket / Formulário */}
          <div className="lg:col-span-2">
            {showCreateForm ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Criar Novo Ticket</h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>

                <form onSubmit={handleCreateTicket} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Descreva brevemente o problema"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Descreva detalhadamente o problema ou dúvida"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Criando...' : 'Criar Ticket'}
                    </Button>
                  </div>
                </form>
              </div>
            ) : selectedTicket ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        {selectedTicket.subject}
                      </h2>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(selectedTicket.status)}>
                          {selectedTicket.status === 'new' && 'Novo'}
                          {selectedTicket.status === 'in_progress' && 'Em Andamento'}
                          {selectedTicket.status === 'resolved' && 'Resolvido'}
                          {selectedTicket.status === 'closed' && 'Fechado'}
                        </Badge>
                        <Badge className={getPriorityColor(selectedTicket.priority)}>
                          {selectedTicket.priority === 'urgent' && 'Urgente'}
                          {selectedTicket.priority === 'high' && 'Alta'}
                          {selectedTicket.priority === 'medium' && 'Média'}
                          {selectedTicket.priority === 'low' && 'Baixa'}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      Criado em {new Date(selectedTicket.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Descrição Inicial</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedTicket.description}
                    </p>
                  </div>

                  {/* Mensagens do Chat */}
                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium text-gray-900">Conversas</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedTicket.messages?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.is_admin
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-purple-600 text-white'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.is_admin ? 'text-gray-500' : 'text-purple-200'
                            }`}>
                              {message.is_admin ? 'Suporte' : 'Você'} • {' '}
                              {new Date(message.created_at).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formulário de Nova Mensagem */}
                  {selectedTicket.status !== 'closed' && (
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <Button type="submit" disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione um ticket
                </h3>
                <p className="text-gray-500">
                  Escolha um ticket da lista para ver os detalhes e conversar com o suporte.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}