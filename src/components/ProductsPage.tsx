@@ .. @@
-interface ProductsPageProps {
-  onAddToCart: (product: Product) => void;
-}
-
-export function ProductsPage({ onAddToCart }: ProductsPageProps) {
+export function ProductsPage() {
   const { searchQuery, selectedGame, selectedCategory } = useApp();
+  const { user } = useAuth();
   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
   const [sortBy, setSortBy] = useState('newest');
   const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
   const [showFilters, setShowFilters] = useState(false);
   const [products, setProducts] = useState<Product[]>([]);
   const [isLoading, setIsLoading] = useState(true);
+  const [showLoginModal, setShowLoginModal] = useState(false);

@@ .. @@
+  const handleBuyProduct = (product: Product) => {
+    if (!user) {
+      setShowLoginModal(true);
+      return;
+    }
+    
+    // Redirecionar direto para checkout com produto único
+    const { setCurrentPage } = useApp();
+    // Armazenar produto no sessionStorage para o checkout
+    sessionStorage.setItem('checkoutProduct', JSON.stringify(product));
+    setCurrentPage('checkout');
+  };
+
+  const getConditionText = (condition: string) => {
+    switch (condition) {
+      case 'new': return 'Novo';
+      case 'used': return 'Usado';
+      case 'excellent': return 'Excelente';
+      default: return condition;
+    }
+  };

@@ .. @@
                       <div className="absolute top-4 right-4">
-                        <Badge variant="success">{product.condition}</Badge>
+                        <Badge variant="success">{getConditionText(product.condition)}</Badge>
                       </div>

@@ .. @@
                           <Button
                             variant="primary"
                             size="sm"
-                            onClick={() => onAddToCart(product)}
+                            onClick={() => handleBuyProduct(product)}
                           >
                             Comprar
                           </Button>

@@ .. @@
           </div>
         </div>
       </div>
+      
+      {/* Login Modal */}
+      {showLoginModal && (
+        <LoginModal
+          isOpen={showLoginModal}
+          onClose={() => setShowLoginModal(false)}
+        />
+      )}
     </div>