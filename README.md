Iniciar a API: nodemon loader.js / node loader.js

Executar Testes: npm run test

Swagger: http://localhost:3000/api-docs

Endpoints:

Criação de Usuário
POST - http://localhost:3000/api/signup

Autenticação de Usuário
POST - http://localhost:3000/api/login

Incluir Planeta
POST - http://localhost:3000/api/planetas

Excluir Planeta
DELETE - http://localhost:3000/api/planetas/{:id}

Consultar Planeta por ID
GET - http://localhost:3000/api/planetas/{:id}

Consultar Planeta por Nome
GET - http://localhost:3000/api/planetas/busca/nome/?valor=[nome do planeta]

Listar Planeta
GET - http://localhost:3000/api/planetas
      http://localhost:3000/api/planetas/?page=[numero da pagina]


