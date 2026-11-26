# Pokédex 2.0

Pokédex com os 151 Pokémon da primeira geração, agora com back-end e banco de dados. É uma evolução da Pokédex da Atividade 03: antes os dados vinham de um arquivo JSON fixo; agora o front-end em React consome uma API REST em Spring Boot, que guarda os Pokémon no MongoDB Atlas.

Além de listar, buscar e filtrar, a Pokédex 2.0 permite **cadastrar, editar e excluir** Pokémon pela própria interface.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Front-end | React 19 + Vite |
| Back-end | Java 21 + Spring Boot 4 (Spring Web MVC + Spring Data MongoDB) |
| Banco de dados | MongoDB Atlas |

## Funcionalidades

- Listagem dos Pokémon em cards, com sprite, número, tipos e atributos.
- Busca por nome ou número.
- Filtro por tipo.
- Janela de detalhes ao clicar em um card.
- Cadastro de um novo Pokémon (botão **+ Novo Pokémon**).
- Edição e exclusão (botões **Editar** e **Excluir** na janela de detalhes).
- Aba **Treinadores**, com o time de cada treinador.

## Pré-requisitos

- Java 21 (JDK).
- Node.js 20.19+ ou 22.12+, com npm.
- Uma conta no MongoDB Atlas com um cluster criado.

O Maven não precisa estar instalado: o projeto usa o Maven Wrapper (`./mvnw`).

## Configurando o MongoDB

1. No MongoDB Atlas, em **Database & Network Access**:
   - na aba **Database Users**, crie um usuário com senha e permissão de leitura e escrita;
   - na aba **IP Access List**, libere o IP da sua máquina.
2. No cluster, clique em **Connect → Drivers → Java** e copie a connection string. Ela tem este formato:
   ```
   mongodb+srv://USUARIO:SENHA@cluster.xxxxx.mongodb.net/
   ```
3. Na raiz do projeto, copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
4. Abra o `.env` e preencha a variável `MONGODB_URI` com a sua connection string, trocando `SENHA` pela senha do usuário.

O `.env` está no `.gitignore` e **nunca deve ser commitado**, porque contém a senha do banco. Só o `.env.example`, sem senha, vai para o repositório.

## Rodando o projeto

São dois servidores, cada um em um terminal.

### Back-end (porta 8080)

Na raiz do projeto:

```bash
./mvnw spring-boot:run
```

A API fica em `http://localhost:8080/api/pokemons`.

### Front-end (porta 5173)

Na pasta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

A interface fica em `http://localhost:5173`. O Vite encaminha as chamadas para `/api` ao back-end na porta 8080, então os dois precisam estar rodando.

## API

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/pokemons` | Lista todos os Pokémon |
| GET | `/api/pokemons/{id}` | Busca um Pokémon pelo número |
| POST | `/api/pokemons` | Cadastra um Pokémon |
| PUT | `/api/pokemons/{id}` | Atualiza um Pokémon |
| DELETE | `/api/pokemons/{id}` | Exclui um Pokémon |

Formato de um Pokémon:

```json
{
  "id": 1,
  "name": "Bulbasaur",
  "types": [{ "id": 4, "name": "Grass" }, { "id": 8, "name": "Poison" }],
  "stats": {
    "hp": 45,
    "attack": 49,
    "defense": 49,
    "specialAttack": 65,
    "specialDefense": 65,
    "speed": 45
  }
}
```

## Estrutura

```
.
├── src/main/java/...        # back-end Spring Boot (models, repositories, services, controllers)
├── src/main/resources/      # application.properties
├── frontend/
│   └── src/
│       ├── api/pokemons.js  # chamadas à API (GET, POST, PUT, DELETE)
│       ├── components/      # cards, busca, filtro, detalhes, formulário, treinadores
│       ├── data/            # lista de tipos e treinadores
│       └── App.jsx
├── .env.example             # modelo das variáveis de ambiente
└── pom.xml
```

## Autores

- João Pedro: back-end e banco de dados
- Lucas: front-end e documentação
