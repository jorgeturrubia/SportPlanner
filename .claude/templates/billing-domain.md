# Plantilla: Sistema de Facturación

## Entidades Principales

### Customer (Cliente)
```typescript
interface Customer {
  id: string;
  companyName: string;
  taxId: string;
  email: string;
  billingAddress: Address;
  paymentTerms: PaymentTerms;
  creditLimit: number;
  currency: string;
}
```

### Invoice (Factura)
```typescript
interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  lineItems: LineItem[];
  subtotal: Money;
  taxes: Tax[];
  discounts: Discount[];
  total: Money;
  status: InvoiceStatus;
}
```

### Product (Producto/Servicio)
```typescript
interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: Money;
  taxCategory: TaxCategory;
  isService: boolean;
  inventory?: InventoryInfo;
}
```

## Esquema de Base de Datos

### Tablas Principales
```sql
-- Clientes
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  tax_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  billing_address JSONB NOT NULL,
  payment_terms TEXT DEFAULT '30_days',
  credit_limit DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facturas
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(15,2) NOT NULL,
  tax_amount DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Líneas de Factura
CREATE TABLE invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  tax_rate DECIMAL(5,4) NOT NULL,
  line_total DECIMAL(15,2) NOT NULL
);
```

## APIs de Negocio

### Endpoints de Clientes
```csharp
// GET /api/customers
// POST /api/customers
// GET /api/customers/{id}/invoices
// GET /api/customers/{id}/balance
```

### Endpoints de Facturación
```csharp
// POST /api/invoices
// PUT /api/invoices/{id}/send
// PUT /api/invoices/{id}/mark-paid
// GET /api/invoices/{id}/pdf
```

## Componentes UI Específicos

### Dashboard de Facturación
- Resumen de ingresos
- Facturas pendientes
- Estado de pagos
- Gráficos de tendencias

### Gestión de Clientes
- Lista de clientes
- Historial de facturación
- Estado de crédito
- Comunicaciones

## Reglas de Negocio

1. **Numeración**: Las facturas deben seguir secuencia numérica
2. **Crédito**: No exceder límite de crédito del cliente
3. **Impuestos**: Calcular según jurisdicción del cliente
4. **Fechas**: Fecha de vencimiento basada en términos de pago
5. **Estados**: Transiciones de estado controladas
