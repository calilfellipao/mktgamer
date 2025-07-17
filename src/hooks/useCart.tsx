export function useCart() {
  const { user } = useAuth();
  const { setCurrentPage } = useApp();
  const [items, setItems] = useState<CartItem[]>([]);