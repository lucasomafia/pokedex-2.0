# Pokédex 2.0

Pokédex com os 151 Pokémon da primeira geração e 12 treinadores, agora com back-end e banco de dados. É uma evolução da Pokédex da Atividade 03: antes os dados vinham de um arquivo JSON fixo; agora o front-end em React consome uma API REST em Spring Boot, que guarda os dados no MongoDB Atlas.

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
- Aba **Treinadores**, com as insígnias e o time de cada treinador.

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
4. Abra o `.env` e preencha:
   - `MONGODB_URI`: a sua connection string, com a senha do usuário no lugar de `SENHA`;
   - `MONGODB_DATABASE`: o nome do banco. Se ficar vazio, o padrão é `pokedex`.

O `.env` está no `.gitignore` e **nunca deve ser commitado**, porque contém a senha do banco. Só o `.env.example`, sem senha, vai para o repositório.

### Carga inicial dos dados

Os dados vêm do arquivo `Script_Pokedex.sql`, que fica na raiz do projeto. Ao subir, o back-end lê esse script e preenche as coleções que estiverem vazias:

| Coleção | Origem no script | Conteúdo |
| --- | --- | --- |
| `pokemons` | tabelas `Pokemon`, `Types` e `Rel_Pokemon_Type` | 151 Pokémon, com os tipos embutidos em cada documento |
| `trainers` | tabelas `Trainers` e `Rel_Trainer_Pokemon` | 12 treinadores, com as insígnias (`Badges`) e os números dos Pokémon do time |

Se a coleção já tiver documentos, a carga é ignorada, então nada é duplicado ao reiniciar. Os times seguem o script, inclusive as repetições: o Koga tem três Venonat e o Lance tem dois Dragonite.

## Rodando o projeto

São dois servidores, cada um em um terminal.

### Back-end (porta 8080)

Na raiz do projeto:

```bash
./mvnw spring-boot:run
```

Rode o comando a partir da raiz, porque é lá que o back-end procura o `.env` e o `Script_Pokedex.sql`. A API fica em `http://localhost:8080/api`.

### Front-end (porta 5173)

Na pasta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

A interface fica em `http://localhost:5173`. O Vite encaminha as chamadas para `/api` ao back-end na porta 8080, então os dois precisam estar rodando.

## API

### Pokémon

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/pokemons` | Lista todos os Pokémon, em ordem de número |
| GET | `/api/pokemons?name=char` | Filtra pelo nome (parte do nome, sem diferenciar maiúsculas) |
| GET | `/api/pokemons?type=Fire` | Filtra pelo tipo |
| GET | `/api/pokemons/{id}` | Busca um Pokémon pelo número |
| POST | `/api/pokemons` | Cadastra um Pokémon (`409` se o número já existir) |
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

### Treinadores

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/trainers` | Lista os 12 treinadores |
| GET | `/api/trainers/{id}` | Busca um treinador pelo número |

Formato de um treinador. `badges` são as insígnias e `pokemonIds` são os números dos Pokémon do time:

```json
{
  "id": 1,
  "name": "Ash",
  "badges": 9,
  "pokemonIds": [25, 3, 6, 9, 131, 143]
}
```

## Estrutura

```
.
├── src/main/java/com/example/demo/
│   ├── config/          # carga inicial do Script_Pokedex.sql (pokémons e treinadores)
│   ├── controller/      # rotas REST
│   ├── model/           # Pokemon, Tipo, Estatisticas, Treinador
│   ├── repository/      # acesso ao MongoDB
│   └── service/         # regras de negócio
├── src/main/resources/
│   └── application.properties
├── frontend/
│   └── src/
│       ├── api/pokemons.js   # chamadas à API
│       ├── components/       # cards, busca, filtro, detalhes, formulário, treinadores
│       ├── data/             # tipos, atributos e endereço das imagens
│       └── App.jsx
├── Script_Pokedex.sql   # dados de origem
├── .env.example         # modelo das variáveis de ambiente
└── pom.xml
```

## Autores

- João Pedro: back-end e banco de dados
- Lucas: front-end e documentação
