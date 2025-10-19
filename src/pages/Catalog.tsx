// src/pages/Catalog.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useCatalog } from "../lib/CatalogContext";
import { Product, ProductCategory } from "../lib/catalog";

export function Catalog() {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductActive,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive
  } = useCatalog();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: 0,
    description: '',
    sku: '',
    imageUrl: '',
    productUrl: '',
    isActive: true
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.price > 0) {
      addProduct(newProduct);
      setNewProduct({
        name: '',
        category: '',
        price: 0,
        description: '',
        sku: '',
        imageUrl: '',
        productUrl: '',
        isActive: true
      });
      setShowAddProduct(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name) {
      addCategory(newCategory);
      setNewCategory({
        name: '',
        description: '',
        isActive: true
      });
      setShowAddCategory(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      sku: product.sku,
      imageUrl: product.imageUrl || '',
      productUrl: product.productUrl || '',
      isActive: product.isActive
    });
    setShowAddProduct(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct && newProduct.name && newProduct.category && newProduct.price > 0) {
      updateProduct(editingProduct.id, newProduct);
      setEditingProduct(null);
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        category: '',
        price: 0,
        description: '',
        sku: '',
        imageUrl: '',
        productUrl: '',
        isActive: true
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="tracking-tight mb-2">Catálogo de Productos</h1>
          <p className="text-muted-foreground">Gestiona el catálogo que usa el AI para recomendar productos</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddCategory(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Categoría
          </Button>
          <Button onClick={() => setShowAddProduct(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-muted-foreground">Total Productos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{products.filter(p => p.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Productos Activos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categorías</div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario para añadir/editar producto */}
      {showAddProduct && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
            <CardDescription>
              {editingProduct ? 'Modifica los datos del producto' : 'Añade un nuevo producto al catálogo'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Nombre del Producto</Label>
                <Input
                  id="product-name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Ej: Pacojet 4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">Categoría</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-price">Precio (€)</Label>
                <Input
                  id="product-price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  placeholder="2800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-sku">SKU</Label>
                <Input
                  id="product-sku"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  placeholder="PACO-4-001"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">Descripción</Label>
              <Textarea
                id="product-description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Descripción del producto y sus características principales"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-image">URL de Imagen</Label>
                <Input
                  id="product-image"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://100x100chef.com/images/producto.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-url">URL del Producto</Label>
                <Input
                  id="product-url"
                  value={newProduct.productUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, productUrl: e.target.value })}
                  placeholder="https://100x100chef.com/productos/producto"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="product-active"
                checked={newProduct.isActive}
                onCheckedChange={(checked) => setNewProduct({ ...newProduct, isActive: checked })}
              />
              <Label htmlFor="product-active">Producto activo</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
                {editingProduct ? 'Actualizar' : 'Añadir'} Producto
              </Button>
              <Button variant="outline" onClick={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
                setNewProduct({
                  name: '',
                  category: '',
                  price: 0,
                  description: '',
                  sku: '',
                  imageUrl: '',
                  productUrl: '',
                  isActive: true
                });
              }}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de productos por categoría */}
      {categories.map(category => {
        const categoryProducts = products.filter(p => p.category === category.id);
        return (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {category.name}
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {categoryProducts.length} productos
                    </Badge>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCategoryActive(category.id)}
                  >
                    {category.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {categoryProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay productos en esta categoría
                </p>
              ) : (
                <div className="space-y-3">
                  {categoryProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{product.name}</h4>
                          <Badge variant={product.isActive ? "default" : "secondary"}>
                            {product.price}€
                          </Badge>
                          <Badge variant="outline">{product.sku}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleProductActive(product.id)}
                        >
                          {product.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}