# API de Contatos

API REST simples para gerenciamento de contatos, desenvolvida com Node.js, Express, TypeScript e MySQL.

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose

Não é necessário ter Node.js instalado - tanto a API quanto o banco de dados rodam em containers.

## Configuração e execução

### 1. Subir a aplicação

Com o repositório clonado, na raiz do projeto:

```bash
docker compose up -d --build
```

Esse comando sobe dois containers:

- **mysql**: banco de dados MySQL 8.0, já com o banco `contacts` e a tabela `contacts` criados automaticamente (via script de inicialização)
- **api**: a aplicação Node.js/Express, conectada ao banco

Para acompanhar os logs e confirmar que tudo subiu corretamente:

```bash
docker compose logs -f
```

A API estará disponível em `http://localhost:3000`.

### 2. Encerrar a aplicação

```bash
docker compose down
```

Os dados do banco são preservados entre reinicializações graças a um volume persistente. Para remover também os dados (reset completo):

```bash
docker compose down -v
```

## Variáveis de ambiente

As variáveis de conexão com o banco já estão definidas no `docker-compose.yml` para o ambiente containerizado, não sendo necessária configuração manual. Caso queira rodar a API fora do Docker (não recomendado, mas possível para desenvolvimento local), crie um `.env` na raiz com:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin
DB_NAME=contacts
```

Nesse caso, o MySQL ainda pode rodar via Docker (`docker compose up -d mysql`), e a API roda separadamente com `npm install` seguido de `npm run dev`.

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

- `400` - campos ausentes ou nome inválido (mínimo duas palavras, cada uma com pelo menos 3 letras)

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

**Body** (aceita atualização parcial - `name`, `phone`, ou ambos):

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

- `400` - id inválido, ou nenhum campo enviado, ou nome inválido
- `404` - contato não encontrado

---

### Excluir contato

`DELETE /contacts/:id`

**Resposta `204 No Content`** (sem corpo)

**Possíveis erros:**

- `400` - id inválido
- `404` - contato não encontrado

## Decisões técnicas

**Pool de conexões (`mysql2/promise`)**
A API usa `createPool` em vez de uma conexão única, já que requisições HTTP concorrentes precisam de múltiplas conexões disponíveis simultaneamente. O pool gerencia a distribuição automaticamente, evitando que uma requisição trave esperando outra liberar a conexão.

**Por que `mysql2` e não `mysql`**
O pacote `mysql2` suporta prepared statements binários (mais seguro contra SQL Injection), tem suporte nativo a Promises (permitindo `async/await` sem callbacks) e é mais performático que o driver `mysql` original.

**API e banco em containers Docker**
Ambos rodam isolados em containers para garantir reprodutibilidade: quem for rodar o projeto não precisa instalar Node.js nem MySQL na máquina, apenas Docker. A tabela é criada automaticamente na primeira inicialização via script SQL montado no container do MySQL, eliminando o passo manual de configuração do banco.

**DELETE retorna `204` sem corpo**
Seguindo a semântica HTTP (RFC 7231), respostas `204 No Content` não devem conter corpo - a ausência de erro já comunica sucesso implicitamente.

**Camadas separadas (route → controller → repository)**
Rotas definem apenas o path e o método HTTP; controllers tratam a lógica de request/response; repositories concentram o acesso ao banco de dados. Essa separação facilita manutenção e testes.

**Validação de nome**
Implementada manualmente (sem biblioteca externa), dado o escopo simples da regra (mínimo duas palavras, cada uma com pelo menos 3 caracteres) - evitando dependência desnecessária para uma lógica de poucas linhas.
