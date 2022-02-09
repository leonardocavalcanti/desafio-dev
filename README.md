# CNAB importer and viewer

This is a simple ReactJS + NextJS (and NextAuth to handle authentication) + PostgreSQL app to import and view CNAB files data, following the specs described below.

## Documentação do CNAB

| Descrição do campo  | Inicio | Fim | Tamanho | Comentário
| ------------- | ------------- | -----| ---- | ------
| Tipo  | 1  | 1 | 1 | Tipo da transação
| Data  | 2  | 9 | 8 | Data da ocorrência
| Valor | 10 | 19 | 10 | Valor da movimentação. *Obs.* O valor encontrado no arquivo precisa ser divido por cem(valor / 100.00) para normalizá-lo.
| CPF | 20 | 30 | 11 | CPF do beneficiário
| Cartão | 31 | 42 | 12 | Cartão utilizado na transação 
| Hora  | 43 | 48 | 6 | Hora da ocorrência atendendo ao fuso de UTC-3
| Dono da loja | 49 | 62 | 14 | Nome do representante da loja
| Nome loja | 63 | 81 | 19 | Nome da loja

## Documentação sobre os tipos das transações

| Tipo | Descrição | Natureza | Sinal |
| ---- | -------- | --------- | ----- |
| 1 | Débito | Entrada | + |
| 2 | Boleto | Saída | - |
| 3 | Financiamento | Saída | - |
| 4 | Crédito | Entrada | + |
| 5 | Recebimento Empréstimo | Entrada | + |
| 6 | Vendas | Entrada | + |
| 7 | Recebimento TED | Entrada | + |
| 8 | Recebimento DOC | Entrada | + |
| 9 | Aluguel | Saída | - |

# Getting Started locally

To get a local copy up and running, please follow these simple steps.

### Prerequisites

- Node.js
- PostgreSQL
- Yarn _(recommended)_

### Development Setup

1. Clone the repo
   ```sh
   git clone https://github.com/leonardocavalcanti/desafio-dev.git
   ```
2. Install packages with yarn
   ```sh
   yarn install
   ```
3. Copy `.env.example` to `.env`
4. Configure environment variables in the .env file. Replace `<user>`, `<pass>`, `<db-host>`, `<db-port>` with their applicable values

   ```
   DATABASE_URL='postgresql://<user>:<pass>@<db-host>:<db-port>'
   ```

   <details>
   <summary>You can easily start a PostgreSQL instance with 'docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres', but if you don't know how to configure the DATABASE_URL, then follow the steps here</summary>

   1. Create a free account with [Heroku](https://www.heroku.com/).

   2. Create a new app.

   3. In your new app, go to `Overview` and next to `Installed add-ons`, click `Configure Add-ons`. We need this to set up our database.

   4. Once you clicked on `Configure Add-ons`, click on `Find more add-ons` and search for `postgres`. One of the options will be `Heroku Postgres` - click on that option.

   5. Once the pop-up appears, click `Submit Order Form` - plan name should be `Hobby Dev - Free`.

   6. Once you completed the above steps, click on your newly created `Heroku Postgres` and go to its `Settings`.

   7. In `Settings`, copy your URI to your .env file and replace the `postgresql://<user>:<pass>@<db-host>:<db-port>` with it.

   8. To view your DB, once you add new data in Prisma, you can use [Heroku Data Explorer](https://heroku-data-explorer.herokuapp.com/).
   </details>

5. Set up the database using the Prisma schema (found in `prisma/schema.prisma`)
   ```sh
   npx prisma db push
   ```
6. Run (in development mode)
   ```sh
   yarn dev
   ```
