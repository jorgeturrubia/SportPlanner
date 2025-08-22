---
allowed-tools: Write, Edit, Read
argument-hint: [domain-type] [project-name] [description]
description: Configure business domain context for the project
---

Configure the business domain context for your project:

**Domain Configuration**: $ARGUMENTS

**Supported Domain Types**:
- **sports** - Athletic training, fitness, performance management
- **billing** - Invoicing, payments, accounting, financial management
- **ecommerce** - Online retail, inventory, orders, customers
- **education** - Learning management, courses, students, assessments
- **healthcare** - Patient management, appointments, medical records
- **real-estate** - Property management, listings, agents, transactions
- **restaurant** - Menu management, orders, reservations, inventory
- **logistics** - Shipping, tracking, warehouses, deliveries

**What this configures**:
1. Updates CLAUDE.md with domain-specific context
2. Sets up business entity templates
3. Configures domain-aware validation rules
4. Establishes naming conventions
5. Defines business logic patterns
6. Creates domain-specific slash commands

**Example Usage**:
```bash
/configure-domain sports PlanSport "Athletic training and performance management platform"
/configure-domain billing InvoiceApp "Complete invoicing and payment processing system"
/configure-domain ecommerce ShopMaster "Multi-vendor e-commerce marketplace"
```

Use business-analyst agent to perform domain analysis and configure the project accordingly.
