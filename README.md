# API de Contatos

API REST simples para gerenciamento de contatos, desenvolvida com Node.js, Express, TypeScript e MySQL.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose

## Configuração e execução

### 1. Clonar o repositório e instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

Variáveis necessárias:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin
DB_NAME=contacts
```

### 3. Subir o banco de dados MySQL

O banco roda em container Docker, isolado do ambiente da máquina host:

```bash
docker compose up -d
```

Isso vai criar um container MySQL 8.0, já com o banco `contacts` criado automaticamente. Aguarde alguns segundos até o container ficar pronto — é possível acompanhar com:

```bash
docker compose logs -f mysql
```

### 4. Criar a tabela de contatos

Conecte-se ao banco (via DBeaver, MySQL Workbench, ou terminal) usando os dados do `.env`, e execute:

```sql
CREATE TABLE contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL
);
```

### 5. Rodar a aplicação

```bash
npm run dev
```

O servidor sobe em `http://localhost:3000`.

## Endpoints

### Criar contato

`POST /contacts`

**Body:**

```json
{
  "name": "João Silva",
  "phone": "21999999999"
}
```

**Resposta `201 Created`:**

```json
{
  "id": 1,
  "name": "João Silva",
  "phone": "21999999999"
}
```

**Possíveis erros:**

- `400` — campos ausentes ou nome inválido (mínimo duas palavras, cada uma com pelo menos 3 letras)

---

### Listar contatos

`GET /contacts`

**Resposta `200 OK`:**

```json
[
  {
    "id": 1,
    "name": "João Silva",
    "phone": "21999999999"
  }
]
```

---

### Atualizar contato

`PATCH /contacts/:id`

**Body** (aceita atualização parcial — `name`, `phone`, ou ambos):

```json
{
  "name": "João Souza",
  "phone": "21988888888"
}
```

**Resposta `200 OK`:**

```json
{
  "id": 1,
  "name": "João Souza",
  "phone": "21988888888"
}
```

**Possíveis erros:**

- `400` — id inválido, ou nenhum campo enviado, ou nome inválido
- `404` — contato não encontrado

---

### Excluir contato

`DELETE /contacts/:id`

**Resposta `204 No Content`** (sem corpo)

**Possíveis erros:**

- `400` — id inválido
- `404` — contato não encontrado

## Decisões técnicas

**Pool de conexões (`mysql2/promise`)**
A API usa `createPool` em vez de uma conexão única, já que requisições HTTP concorrentes precisam de múltiplas conexões disponíveis simultaneamente. O pool gerencia a distribuição automaticamente, evitando que uma requisição trave esperando outra liberar a conexão.

**Por que `mysql2` e não `mysql`**
O pacote `mysql2` suporta prepared statements binários (mais seguro contra SQL Injection), tem suporte nativo a Promises (permitindo `async/await` sem callbacks) e é mais performático que o driver `mysql` original.

**Banco em container Docker**
O MySQL roda isolado em container para garantir reprodutibilidade: quem for rodar o projeto não precisa instalar MySQL na máquina, apenas subir o container com um único comando.

**DELETE retorna `204` sem corpo**
Seguindo a semântica HTTP (RFC 7231), respostas `204 No Content` não devem conter corpo — a ausência de erro já comunica sucesso implicitamente.

**Camadas separadas (route → controller → repository)**
Rotas definem apenas o path e o método HTTP; controllers tratam a lógica de request/response; repositories concentram o acesso ao banco de dados. Essa separação facilita manutenção e testes.

**Validação de nome**
Implementada manualmente (sem biblioteca externa), dado o escopo simples da regra (mínimo duas palavras, cada uma com pelo menos 3 caracteres) — evitando dependência desnecessária para uma lógica de poucas linhas.
