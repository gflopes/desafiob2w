<h2>Informações da API Planetas - Defasio B2W</h2>

A API está preparada para ser instalada no Heroku<br/>

Iniciar a API: nodemon loader.js / node loader.js<br/>
Executar Testes: npm run test<br/>

Swagger: http://localhost:3000/api-docs<br/>

Endpoints:<br/>

Criação de Usuário
POST - http://localhost:3000/api/signup

Autenticação de Usuário<br/>
POST - http://localhost:3000/api/login

Incluir Planeta<br/>
POST - http://localhost:3000/api/planetas

Excluir Planeta<br/>
DELETE - http://localhost:3000/api/planetas/{:id}

Consultar Planeta por ID<br/>
GET - http://localhost:3000/api/planetas/{:id}

Consultar Planeta por Nome<br/>
GET - http://localhost:3000/api/planetas/busca/nome/?valor=[nome do planeta]

Listar Planeta<br/>
GET - http://localhost:3000/api/planetas<br/>
      http://localhost:3000/api/planetas/?page=[numero da pagina]
