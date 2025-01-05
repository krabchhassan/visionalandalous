/*
  # Schéma initial pour le système de gestion d'optique

  1. Tables
    - suppliers (fournisseurs)
      - id: UUID primary key
      - name: text, nom du fournisseur
      - contact: text, informations de contact
      - address: text, adresse
      - created_at: timestamp with timezone
    
    - products (produits)
      - id: UUID primary key
      - name: text, nom du produit
      - description: text
      - price: decimal, prix
      - stock: integer, quantité en stock
      - supplier_id: UUID, référence au fournisseur
      - category: text, catégorie du produit
      - created_at: timestamp with timezone
    
    - clients
      - id: UUID primary key
      - name: text, nom du client
      - email: text
      - phone: text
      - prescription: text, ordonnance
      - created_at: timestamp with timezone
    
    - orders (commandes)
      - id: UUID primary key
      - client_id: UUID, référence au client
      - total_amount: decimal
      - status: text, statut de la commande
      - created_at: timestamp with timezone

    - order_items (détails des commandes)
      - id: UUID primary key
      - order_id: UUID, référence à la commande
      - product_id: UUID, référence au produit
      - quantity: integer
      - price: decimal
      - created_at: timestamp with timezone

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques pour les utilisateurs authentifiés
*/

-- Création de la table des fournisseurs
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Création de la table des produits
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    supplier_id UUID REFERENCES suppliers(id),
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Création de la table des clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    prescription TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Création de la table des commandes
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Création de la table des éléments de commande
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Activation de RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Enable full access for authenticated users" ON suppliers
    FOR ALL TO authenticated
    USING (true);

CREATE POLICY "Enable full access for authenticated users" ON products
    FOR ALL TO authenticated
    USING (true);

CREATE POLICY "Enable full access for authenticated users" ON clients
    FOR ALL TO authenticated
    USING (true);

CREATE POLICY "Enable full access for authenticated users" ON orders
    FOR ALL TO authenticated
    USING (true);

CREATE POLICY "Enable full access for authenticated users" ON order_items
    FOR ALL TO authenticated
    USING (true);