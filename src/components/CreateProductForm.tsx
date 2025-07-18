import React, { useState, useEffect } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useApp } from '../contexts/AppContext';
import { productService } from '../services/productService';
import { games } from '../data/gamesList';
import { conditionService } from '../services/conditionService';

interface CreateProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProductForm({ onSuccess, onCancel }: CreateProductFormProps) {
  const { user, showNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [availableConditions, setAvailableConditions] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'account' as 'account' | 'skin' | 'service' | 'giftcard',
    game: '',
    price: '',
    condition: '',
    rarity: '',
    level: '',
    delivery_time: '24',
    commission_rate: 10
  });

  useEffect(() => {
    const conditions = conditionService.getConditionsForCategory(formData.category);
    setAvailableConditions(conditions);
    if (conditions.length > 0 && !conditions.includes(formData.condition)) {
      setFormData(prev => ({ ...prev, condition: conditions[0] }));
    }
  }, [formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification('Você precisa estar logado para criar um produto', 'error');
      return;
    }

    setLoading(true);
    try {
      await productService.createProduct({
        seller_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        game: formData.game,
        price: parseFloat(formData.price),
        condition: formData.condition,
        images,
        rarity: formData.rarity || null,
        level: formData.level ? parseInt(formData.level) : null,
        delivery_time: parseInt(formData.delivery_time),
        commission_rate: formData.commission_rate,
        status: 'pending_approval'
      });

      showNotification('Produto criado com sucesso! Aguarde aprovação.', 'success');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'account',
        game: '',
        price: '',
        condition: '',
        rarity: '',
        level: '',
        delivery_time: '24',
        commission_rate: 10
      });
      setImages([]);
      
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      showNotification('Erro ao criar produto. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const commissionPlans = [
    { rate: 5, name: 'Básico', benefits: ['Visibilidade padrão'] },
    { rate: 10, name: 'Padrão', benefits: ['Visibilidade padrão', 'Suporte prioritário'] },
    { rate: 15, name: 'Destaque', benefits: ['Visibilidade padrão', '+200% visibilidade', 'Suporte prioritário'] },
    { rate: 20, name: 'Premium Destaque', benefits: ['Topo dos resultados', 'Destaques do Dia', '+200% visibilidade', 'Visibilidade Padrão incluída'] }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Produto</h1>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Produto *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: Conta Valorant Immortal 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="account">Conta</option>
                <option value="skin">Skin</option>
                <option value="service">Serviço</option>
                <option value="giftcard">Gift Card</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jogo *
              </label>
              <select
                required
                value={formData.game}
                onChange={(e) => setFormData(prev => ({ ...prev, game: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Selecione um jogo</option>
                {games.map(game => (
                  <option key={game.id} value={game.name}>{game.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$) *
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condição *
              </label>
              <select
                required
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Selecione uma condição</option>
                {availableConditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo de Entrega (horas)
              </label>
              <input
                type="number"
                min="1"
                value={formData.delivery_time}
                onChange={(e) => setFormData(prev => ({ ...prev, delivery_time: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {(formData.category === 'account' || formData.category === 'skin') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raridade
                  </label>
                  <input
                    type="text"
                    value={formData.rarity}
                    onChange={(e) => setFormData(prev => ({ ...prev, rarity: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: Lendária, Épica, Rara"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível/Rank
                  </label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: Immortal 3, Nível 150"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Descreva detalhadamente seu produto..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plano de Comissão *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {commissionPlans.map(plan => (
                <div
                  key={plan.rate}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    formData.commission_rate === plan.rate
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, commission_rate: plan.rate }))}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-2xl font-bold text-purple-600">{plan.rate}%</p>
                    <ul className="text-xs text-gray-600 mt-2 space-y-1">
                      {plan.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagens do Produto
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Clique para adicionar imagens</p>
                <p className="text-sm text-gray-400">PNG, JPG até 5MB cada</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}