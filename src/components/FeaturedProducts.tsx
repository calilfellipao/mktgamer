import React, { useState, useEffect } from 'react';
import { Star, Shield, Eye } from 'lucide-react';
import { Product } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { ProductService } from '../services/productService';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { LoginModal } from './LoginModal';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user } = useAuth();
  const { setCurrentPage } = useApp();

  useEffect(() => {
    let isMounted = true;
    
    const loadFeaturedProducts = async () => {
      try {
        console.log('🌟 Carregando produtos em destaque (público)...');
        
        const data = await ProductService.getFeaturedProducts(8);
        
        if (!isMounted) return;

        const formattedProducts = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          game: item.game,
          images: Array.isArray(item.images) ? item.images : [],
          seller: {
            id: item.seller?.id || '',
            username: item.seller?.username || 'Vendedor',
            email: '',
            avatar: item.seller?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
            reputation: 4.8,
            verified: item.seller?.is_verified || false,
            plan: 'pro',
            totalSales: 0,
            joinDate: new Date().toISOString()
          },
          featured: true,
          condition: 'excellent' as const,
          tags: [],
          createdAt: item.created_at
        }));
        
        setProducts(formattedProducts);
        console.log('✅ Produtos em destaque carregados:', formattedProducts.length);
      } catch (error) {
        if (isMounted) {
          console.error('❌ Erro ao carregar produtos em destaque:', error);
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBuyProduct = (product: Product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    // Redirecionar direto para checkout com produto único
    sessionStorage.setItem('checkoutProduct', JSON.stringify(product));
    setCurrentPage('checkout');
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new': return 'Novo';
      case 'used': return 'Usado';
      case 'excellent': return 'Excelente';
      default: return condition;
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Destaques do <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Dia</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 animate-pulse">
                <div className="h-48 bg-gray-800 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-800 rounded mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded mb-4"></div>
                  <div className="h-6 bg-gray-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Destaques do <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Dia</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Os produtos com maior taxa de destaque da nossa plataforma
          </p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhum produto em destaque</h3>
            <p className="text-gray-400">Produtos com taxa 20%+ aparecerão aqui</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900 rounded-xl overflow-hidden border border-yellow-500/50 hover:border-yellow-400 transition-all duration-300 group shadow-lg shadow-yellow-500/20"
              >
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      ⭐ DESTAQUE
                    </div>
                  </div>
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="success">{getConditionText(product.condition)}</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="primary">{product.game}</Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={product.seller.avatar}
                        alt={product.seller.username}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1';
                        }}
                      />
                      <span className="text-sm text-gray-400">{product.seller.username}</span>
                      {product.seller.verified && (
                        <Shield className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{product.seller.reputation}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-400">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => {}}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleBuyProduct(product)}
                      >
                        Comprar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </section>
  );
}