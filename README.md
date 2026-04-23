# DeliveryAPI

API back-end para gerenciamento de entregas com autenticação JWT, controle de acesso por roles e rastreamento completo do ciclo de vida das entregas. Projeto realizado como prática após as aulas de desenvolvimento back-end do curso FullStack da RocketSeat.

## 🛠 Tecnologias

- **Express.js** - Framework web minimalista
- **TypeScript** - Type safety e melhor experiência de desenvolvimento
- **Prisma** - ORM com migrações versionadas e type-safe
- **PostgreSQL** - Banco de dados robusto
- **JWT** - Autenticação com tokens
- **Bcrypt** - Hash seguro de senhas
- **Zod** - Validação de schemas
- **Docker Compose** - Orquestração de containers

## 📚 O que Aprendi

- ✅ Estrutura de projetos em camadas (controllers, routes, middlewares)
- ✅ Tratamento de erros centralizado com middleware customizado
- ✅ Validação robusta de entrada com schema validation (Zod)
- ✅ Autenticação com JWT e tokens Bearer
- ✅ Autorização baseada em roles (RBAC)
- ✅ Database migrations e versionamento com Prisma
- ✅ RESTful API design
- ✅ Type safety com TypeScript
- ✅ Testes automatizados com Vitest e Supertest
- ✅ Segurança: hash de senhas, proteção de rotas, validações de email

## 🏗 Estrutura do Projeto

```
src/
├── controllers/              # Lógica de negócio dos endpoints
│   ├── users-controller.ts
│   ├── sessions-controller.ts
│   ├── deliveries-controller.ts
│   ├── deliveries-status-controller.ts
│   └── delivery-logs-controller.ts
├── routes/                   # Definição das rotas da API
│   ├── index.ts
│   ├── users-routes.ts
│   ├── sessions-routes.ts
│   ├── deliveries-routes.ts
│   └── delivery-logs-routes.ts
├── middlewares/              # Express middlewares
│   ├── error-handler.ts      # Tratamento centralizado de erros
│   ├── ensure-authenticated.ts    # Validação JWT
│   └── verify-user-authorization.ts  # Verificação de roles
├── configs/
│   └── authConfig.ts         # Configuração de autenticação
├── database/
│   └── prisma.ts             # Cliente Prisma
├── utils/                    # Funções utilitárias
│   └── app-error.ts          # Classe de erro customizada
├── types/
│   └── express.d.ts          # Type extensions para Express
├── tests/                    # Testes automatizados
├── app.ts                    # Inicialização do Express
├── env.ts                    # Validação de variáveis de ambiente
└── server.ts                 # Entrada da aplicação

prisma/
├── schema.prisma             # Schema do banco de dados
└── migrations/               # Migrações versionadas

docker-compose.yml           # Configuração PostgreSQL com Docker
```

## ⚙️ Como Rodar o Projeto

### Pré-requisitos

- Node.js 20+
- npm 10+
- Docker & Docker Compose

### Passo a Passo

#### 1. Instalar Dependências

```bash
npm install
```

Instala todas as dependências definidas no `package.json`.

#### 2. Iniciar o Banco de Dados

```bash
docker-compose up -d
```

Inicia o container PostgreSQL em background na porta 5432.

#### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/delivery_api
NODE_ENV=development
JWT_SECRET=sua-chave-secreta-aqui
```

#### 4. Executar Migrations do Banco

```bash
npx prisma migrate dev
```

Cria as tabelas (users, deliveries, delivery_logs) no banco de dados.

#### 5. Iniciar Servidor em Desenvolvimento

```bash
npm run dev
```

Inicia o servidor na porta **3333** com hot reload automático.

**Servidor rodando em:** http://localhost:3333

#### 6. Testar o Servidor

```bash
curl http://localhost:3333/users
```

## 📡 Endpoints

### Usuários

| Método | Rota     | Descrição              | Auth | Status |
| ------ | -------- | ---------------------- | ---- | ------ |
| `POST` | `/users` | Registrar novo usuário | ❌   | 201    |

**POST Body:**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "customer",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": null
}
```

### Sessões (Autenticação)

| Método | Rota        | Descrição                 | Auth | Status |
| ------ | ----------- | ------------------------- | ---- | ------ |
| `POST` | `/sessions` | Fazer login (obter token) | ❌   | 200    |

**POST Body:**

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "customer"
  }
}
```

### Entregas

| Método  | Rota                     | Descrição                   | Auth       | Status |
| ------- | ------------------------ | --------------------------- | ---------- | ------ |
| `POST`  | `/deliveries`            | Criar nova entrega          | JWT+Seller | 201    |
| `GET`   | `/deliveries`            | Listar todas as entregas    | JWT+Seller | 200    |
| `PATCH` | `/deliveries/:id/status` | Atualizar status da entrega | JWT+Seller | 200    |

**POST Body:**

```json
{
  "user_id": "uuid-do-usuario",
  "description": "Entrega de eletrônicos para São Paulo"
}
```

### Logs de Entrega

| Método | Rota                               | Descrição               | Auth       | Status |
| ------ | ---------------------------------- | ----------------------- | ---------- | ------ |
| `POST` | `/delivery-logs`                   | Adicionar log à entrega | JWT+Seller | 201    |
| `GET`  | `/delivery-logs/:delivery_id/show` | Ver entregas com logs   | JWT        | 200    |

**POST Body:**

```json
{
  "delivery_id": "uuid-da-entrega",
  "description": "Saiu para entrega"
}
```

**PATCH /deliveries/:id/status Body:**

```json
{
  "status": "shipped"
}
```

**Status disponíveis:** `processing`, `shipped`, `delivered`

## 🛡 Boas Práticas

### 1. Validação em Schema

Todos os inputs são validados com Zod antes de processar:

```typescript
const bodySchema = z.object({
  email: z.email(),
  password: z.string().trim().min(6),
})
const { email, password } = bodySchema.parse(request.body)
```

### 2. Tratamento de Erros Centralizado

- `AppError` para erros da aplicação com status codes customizados
- `ZodError` para erros de validação
- Middleware `errorHandler` captura todos os erros

### 3. Verificações de Existência

Sempre validar recursos antes de usar:

```typescript
const user = await prisma.user.findUnique({ where: { id: user_id } })
if (!user) {
  throw new AppError("User not found", 404)
}
```

### 4. Hash Seguro de Senhas

Senhas são hasheadas com bcrypt (8 rounds) antes de salvar:

```typescript
const passwordHash = await hash(password, 8)
await prisma.user.create({
  data: { email, password: passwordHash },
})
```

### 5. Autorização por Role

Middleware protege rotas por role:

```typescript
app.post(
  "/deliveries",
  ensureAuthenticated,
  verifyUserAuthorization(["seller"]),
  new DeliveriesController().create,
)
```

## ✅ Testes

O projeto inclui testes automatizados com Vitest e Supertest:

```bash
npm test
```

**Exemplo de teste:**

```typescript
it("should create a new user successfully", async () => {
  const response = await request(app).post("/users").send({
    name: "Test User",
    email: "test@example.com",
    password: "testpassword",
  })

  expect(response.status).toBe(201)
  expect(response.body.email).toBe("test@example.com")
})
```

---

**Autor:** Matheus Alves | RocketSeat Full-Stack
