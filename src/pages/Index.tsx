import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  size: string[];
  image: string;
  description: string;
  inStock: boolean;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<Array<Product & { quantity: number }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Стильный худи',
      price: 2990,
      category: 'одежда',
      size: ['XS', 'S', 'M', 'L', 'XL'],
      image: '/img/6f86ec67-e4a5-4cda-b251-0e8f26c517d1.jpg',
      description: 'Современный худи из качественного хлопка',
      inStock: true
    },
    {
      id: 2,
      name: 'Модные очки',
      price: 1590,
      category: 'аксессуары',
      size: ['ONE SIZE'],
      image: '/img/c96766c3-546e-4a53-8392-15b741f2514a.jpg',
      description: 'Стильные солнечные очки с UV защитой',
      inStock: true
    },
    {
      id: 3,
      name: 'Кроссовки',
      price: 4990,
      category: 'обувь',
      size: ['36', '37', '38', '39', '40', '41', '42', '43'],
      image: '/img/4c055df6-e772-4376-abe2-b45503df0dec.jpg',
      description: 'Удобные спортивные кроссовки',
      inStock: true
    },
    {
      id: 4,
      name: 'Базовая футболка',
      price: 990,
      category: 'одежда',
      size: ['XS', 'S', 'M', 'L', 'XL'],
      image: '/img/6f86ec67-e4a5-4cda-b251-0e8f26c517d1.jpg',
      description: 'Классическая футболка из органического хлопка',
      inStock: true
    },
    {
      id: 5,
      name: 'Рюкзак',
      price: 3490,
      category: 'аксессуары',
      size: ['ONE SIZE'],
      image: '/img/c96766c3-546e-4a53-8392-15b741f2514a.jpg',
      description: 'Вместительный городской рюкзак',
      inStock: false
    },
    {
      id: 6,
      name: 'Джинсы',
      price: 3990,
      category: 'одежда',
      size: ['28', '30', '32', '34', '36'],
      image: '/img/6f86ec67-e4a5-4cda-b251-0e8f26c517d1.jpg',
      description: 'Классические прямые джинсы',
      inStock: true
    }
  ]);

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    category: 'одежда',
    size: [],
    image: '',
    description: '',
    inStock: true
  });

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSize = selectedSize === 'all' || product.size.includes(selectedSize);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSize && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      const product: Product = {
        ...newProduct,
        id: Math.max(...products.map(p => p.id), 0) + 1,
        size: newProduct.size.length > 0 ? newProduct.size : ['ONE SIZE']
      };
      setProducts([...products, product]);
      setNewProduct({
        name: '',
        price: 0,
        category: 'одежда',
        size: [],
        image: '',
        description: '',
        inStock: true
      });
      setIsAddProductOpen(false);
    }
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const deleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (editingProduct) {
      const newSizes = checked 
        ? [...editingProduct.size, size]
        : editingProduct.size.filter(s => s !== size);
      setEditingProduct({...editingProduct, size: newSizes});
    } else {
      const newSizes = checked 
        ? [...newProduct.size, size]
        : newProduct.size.filter(s => s !== size);
      setNewProduct({...newProduct, size: newSizes});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-navy-blue">VIBESTORE</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-bright-orange transition-colors font-medium border-b-2 border-bright-orange">Главная</a>
              <a href="#" className="text-gray-700 hover:text-bright-orange transition-colors font-medium">Каталог</a>
              <a href="#" className="text-gray-700 hover:text-bright-orange transition-colors font-medium">Доставка</a>
              <a href="#" className="text-gray-700 hover:text-bright-orange transition-colors font-medium">Контакты</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                variant={isAdmin ? "default" : "ghost"} 
                size="sm"
                onClick={() => setIsAdmin(!isAdmin)}
                className={isAdmin ? "bg-bright-orange hover:bg-bright-orange/90" : ""}
              >
                <Icon name="Settings" size={16} className="mr-1" />
                {isAdmin ? "Владелец" : "Админ"}
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="User" size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative"
              >
                <Icon name="ShoppingCart" size={20} />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-bright-orange text-white text-xs min-w-[20px] h-[20px] flex items-center justify-center rounded-full">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="bg-gradient-to-r from-bright-orange to-cyan-blue bg-clip-text text-transparent">
            <h2 className="text-5xl font-bold mb-4">Стильная одежда</h2>
            <p className="text-xl text-gray-600 mb-8">Современные тренды и актуальная мода</p>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-bright-orange to-cyan-blue mx-auto rounded-full"></div>
        </section>

        {/* Admin Panel */}
        {isAdmin && (
          <section className="mb-8 p-6 bg-gradient-to-r from-bright-orange/10 to-cyan-blue/10 rounded-lg border-2 border-bright-orange/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-navy-blue">Панель управления</h3>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-bright-orange hover:bg-bright-orange/90 text-white">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Добавить новый товар</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Название товара</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Введите название"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Цена (₽)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                        placeholder="Введите цену"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Категория</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="одежда">Одежда</SelectItem>
                          <SelectItem value="аксессуары">Аксессуары</SelectItem>
                          <SelectItem value="обувь">Обувь</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="image">URL изображения</Label>
                      <Input
                        id="image"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        placeholder="/img/example.jpg"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Описание товара"
                        rows={3}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Размеры</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'ONE SIZE', '36', '37', '38', '39', '40', '41', '42', '43'].map(size => (
                          <label key={size} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newProduct.size.includes(size)}
                              onChange={(e) => handleSizeChange(size, e.target.checked)}
                            />
                            <span className="text-sm">{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={addProduct} className="bg-bright-orange hover:bg-bright-orange/90">
                      Добавить товар
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-gray-600">Всего товаров: {products.length}</p>
          </section>
        )}

        {/* Filters */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              type="text"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-300 focus:border-bright-orange"
            />
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="одежда">Одежда</SelectItem>
                <SelectItem value="аксессуары">Аксессуары</SelectItem>
                <SelectItem value="обувь">Обувь</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="Размер" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все размеры</SelectItem>
                <SelectItem value="XS">XS</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
                <SelectItem value="ONE SIZE">ONE SIZE</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-bright-orange hover:bg-bright-orange/90 text-white">
              <Icon name="Filter" size={16} className="mr-2" />
              Применить
            </Button>
          </div>
        </section>

        {/* Products Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-md">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Нет в наличии</Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-cyan-blue text-white">
                    {product.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.size.map((size) => (
                    <Badge key={size} variant="outline" className="text-xs">
                      {size}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-navy-blue">
                    {product.price.toLocaleString()} ₽
                  </span>
                  <div className="flex space-x-2">
                    {isAdmin && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                          className="text-xs px-2 py-1"
                        >
                          <Icon name="Edit" size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProduct(product.id)}
                          className="text-xs px-2 py-1"
                        >
                          <Icon name="Trash2" size={12} />
                        </Button>
                      </div>
                    )}
                    <Button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="bg-bright-orange hover:bg-bright-orange/90 text-white px-6"
                    >
                      <Icon name="Plus" size={16} className="mr-1" />
                      В корзину
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Cart Sidebar */}
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Корзина</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="ShoppingCart" size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Корзина пуста</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              {item.price.toLocaleString()} ₽ × {item.quantity}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Итого:</span>
                        <span className="text-2xl font-bold text-navy-blue">
                          {getTotalPrice().toLocaleString()} ₽
                        </span>
                      </div>
                      <Button className="w-full bg-bright-orange hover:bg-bright-orange/90 text-white py-3">
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Dialog */}
        {editingProduct && (
          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Редактировать товар</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Название товара</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price">Цена (₽)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Категория</Label>
                  <Select value={editingProduct.category} onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="одежда">Одежда</SelectItem>
                      <SelectItem value="аксессуары">Аксессуары</SelectItem>
                      <SelectItem value="обувь">Обувь</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-image">URL изображения</Label>
                  <Input
                    id="edit-image"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-description">Описание</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Размеры</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'ONE SIZE', '36', '37', '38', '39', '40', '41', '42', '43'].map(size => (
                      <label key={size} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingProduct.size.includes(size)}
                          onChange={(e) => handleSizeChange(size, e.target.checked)}
                        />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({...editingProduct, inStock: e.target.checked})}
                    />
                    <span>В наличии</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  Отмена
                </Button>
                <Button onClick={() => updateProduct(editingProduct)} className="bg-bright-orange hover:bg-bright-orange/90">
                  Сохранить изменения
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Footer Navigation */}
        <footer className="bg-navy-blue text-white py-12 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-lg">Навигация</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-cyan-blue transition-colors">Главная</a></li>
                <li><a href="#" className="hover:text-cyan-blue transition-colors">Каталог</a></li>
                <li><a href="#" className="hover:text-cyan-blue transition-colors">Корзина</a></li>
                <li><a href="#" className="hover:text-cyan-blue transition-colors">Профиль</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Доставка</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-cyan-blue transition-colors">Условия доставки</a></li>
                <li><a href="#" className="hover:text-cyan-blue transition-colors">Способы оплаты</a></li>
                <li><a href="#" className="hover:text-cyan-blue transition-colors">Возврат товара</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Контакты</h4>
              <ul className="space-y-2">
                <li className="flex items-center"><Icon name="Phone" size={16} className="mr-2" /> +7 (999) 123-45-67</li>
                <li className="flex items-center"><Icon name="Mail" size={16} className="mr-2" /> info@marketplace.ru</li>
                <li className="flex items-center"><Icon name="MapPin" size={16} className="mr-2" /> Москва, ул. Примерная, д. 1</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Социальные сети</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-white hover:text-cyan-blue">
                  <Icon name="Instagram" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-cyan-blue">
                  <Icon name="Facebook" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-cyan-blue">
                  <Icon name="Twitter" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;