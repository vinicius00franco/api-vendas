# Diagramas de Classes dos Endpoints

Esta pasta contém os diagramas de classes UML para cada endpoint da API de Vendas, criados em formato PlantUML (.puml) seguindo as melhores práticas de diagramas UML.

## Estrutura dos Diagramas

Todos os diagramas seguem uma organização padronizada com:

### 📦 Segmentação por Camadas (Packages)

- **Presentation Layer** (Azul Claro): Controllers que lidam com requisições HTTP
- **DTO Layer** (Amarelo Claro): Data Transfer Objects para validação e transformação
- **Business Layer** (Verde Claro): Services com lógica de negócio
- **Data Layer** (Vermelho Claro): Entities e tipos seguros do banco de dados

### ↔️ Orientação Horizontal

Todos os diagramas usam `left to right direction` para melhor legibilidade e fluxo natural da informação.

### 🔗 Relacionamentos Claros

- Setas direcionais mostram dependências e fluxo de dados
- Relacionamentos de composição/agregação entre entidades
- Notas explicativas sobre tipos seguros e arquitetura

## Diagramas Disponíveis

### 1. brands_diagram.puml
**Endpoint:** `/brands` - Gerenciamento de Marcas
- **Presentation:** BrandController
- **DTO:** BrandRequestDto
- **Business:** BrandService
- **Data:** Brand, SafeBrand

### 2. categories_diagram.puml
**Endpoint:** `/categories` - Gerenciamento de Categorias
- **Presentation:** CategoryController
- **DTO:** CategoryRequestDto
- **Business:** CategoryService
- **Data:** Category, SafeCategory

### 3. clients_diagram.puml
**Endpoint:** `/clients` - Gerenciamento de Clientes
- **Presentation:** ClientController
- **DTO:** ClientRequestDto
- **Business:** ClientService
- **Data:** Client, ClientAddress, SafeClient

### 4. products_diagram.puml
**Endpoint:** `/products` - Gerenciamento de Produtos
- **Presentation:** ProductController
- **DTO:** ProductRequestDto
- **Business:** ProductService
- **Data:** Product, ProductVariant, Category, Brand, SafeProduct, SafeCategory, SafeBrand

### 5. sales_diagram.puml
**Endpoint:** `/sales` - Gerenciamento de Vendas
- **Presentation:** SalesController
- **DTO:** SalesRequestDto
- **Business:** SalesService
- **Data:** Sale, Product, Client, SafeSale, SafeProduct, SafeClient

### 6. users_diagram.puml
**Endpoint:** `/users` - Gerenciamento de Usuários
- **Presentation:** UserController
- **DTO:** UserRequestDto
- **Business:** UserService
- **Data:** User, SafeUser

## Convenções dos Diagramas

### 🎨 Cores das Camadas
- **Azul Claro (#LightBlue)**: Presentation Layer
- **Amarelo Claro (#LightYellow)**: DTO Layer
- **Verde Claro (#LightGreen)**: Business Layer
- **Vermelho Claro (#LightCoral)**: Data Layer

### 📝 Notação de Métodos
- `+` : Métodos públicos
- `-` : Métodos/Atributos privados
- `--` : Separador visual em classes

### 🔄 Relacionamentos
- `-->` : Dependência/uso
- `belongs to` : Relacionamento de pertencimento
- `has` : Composição/agregação
- `has many` : Relacionamento um-para-muitos

## Arquitetura Representada

### 🏛️ Padrões Arquiteturais

1. **Clean Architecture**: Separação clara entre camadas
2. **DTO Pattern**: Objetos de transferência de dados
3. **Repository Pattern**: Abstração de acesso a dados
4. **Service Layer**: Lógica de negócio isolada

### 🔒 Segurança e Performance

- **UUIDs Externos**: Exposição segura de identificadores
- **IDs Internos**: Otimização de performance em joins
- **Tipos Seguros**: Omit campos sensíveis (IDs, senhas)
- **Validação**: DTOs garantem integridade dos dados

## Como Visualizar

### 🖥️ Ferramentas Recomendadas

1. **VS Code + PlantUML Extension**
   - Instale a extensão "PlantUML"
   - Abra os arquivos `.puml`
   - Visualize com preview integrado

2. **PlantUML Online**
   - Acesse: https://plantuml.com/
   - Cole o conteúdo dos arquivos
   - Visualize instantaneamente

3. **IntelliJ IDEA**
   - Suporte nativo a PlantUML
   - Preview integrado no editor

### 📋 Comandos para Renderização

```bash
# Instalar PlantUML (Linux)
sudo apt-get install plantuml

# Gerar PNG de um diagrama
plantuml brands_diagram.puml

# Gerar SVG
plantuml -tsvg brands_diagram.puml
```

## Benefícios desta Estrutura

✅ **Manutenibilidade**: Código organizado por responsabilidades
✅ **Testabilidade**: Separação clara facilita testes unitários
✅ **Escalabilidade**: Camadas independentes permitem crescimento
✅ **Segurança**: Campos sensíveis não são expostos
✅ **Performance**: IDs internos otimizam consultas
✅ **Documentação**: Diagramas servem como documentação viva