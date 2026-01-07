import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { randomInt } from 'node:crypto'
import request from 'supertest'
import { app } from '../src/app.js'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  
  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    // Desfaz todas as migrations e aplica novamente, para que cada 
    // teste utilize um banco limpo
    execSync('pnpm run knex migrate:rollback --all')
    execSync('pnpm run knex migrate:latest')
  })
  
  it('Should be able to create a new transaction', async () => {
    // Arrange
    const fakeTransaction = {
      title: 'Test create transaction',
      amount: randomInt(1000),
      type: 'debit',
    }
  
    // Act
    // const res = await app.inject({
    //   method: 'POST',
    //   url: '/transaction',
    //   payload: fakeTransaction,
    // })
  
    const res = await request(app.server)
      .post('/transaction')
      .send(fakeTransaction)
  
    // Assert
    expect(res.statusCode).toEqual(201)
  })

  it('Should be able to list all transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transaction')
      .send({
        title: 'Test list transaction',
        amount: 999,
        type: 'credit',
      })

    expect(createTransactionResponse.statusCode).toEqual(201)
      
    const cookies = createTransactionResponse.get('Set-Cookie')!
      
    const listResponse = await request(app.server)
      .get('/transaction')
      .set('Cookie', cookies)
      
    expect(listResponse.statusCode).toEqual(200)
    expect(listResponse.body.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining(
          {
            title: 'Test list transaction',
            amount: 999,
          },
        ),
      ]),
    )
  })

  it('Should be able to list a specify transaction by id', async () => {
    const fakeTransacion = {
      title: 'Fake transaction',
      amount: 555,
      type: 'credit',
    }

    const createTransactionResponse = await request(app.server)
      .post('/transaction')
      .send(fakeTransacion)
      .expect(201)

    const cookies = createTransactionResponse.get('Set-cookie')!

    const listAllTransactionsResponse = await request(app.server)
      .get('/transaction')
      .set('Cookie', cookies)
      .expect(200)
    
    const transactionId = listAllTransactionsResponse.body.transactions[0].id

    const listSpecifyTransactionResponse = await request(app.server)
      .get(`/transaction/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(listSpecifyTransactionResponse.body.transaction)
      .toEqual(
        expect.objectContaining(
          {
            title: 'Fake transaction',
            amount: 555,
          },
        ))
  })

  it('Should be able to list the transactions summary', async () => {
    const fakeCreditTransacion = {
      title: 'Fake credit transaction',
      amount: 2000,
      type: 'credit',
    }

    const fakeDebitTransacion = {
      title: 'Fake debit transaction',
      amount: 500,
      type: 'debit',
    }

    const createTransactionResponse = await request(app.server)
      .post('/transaction')
      .send(fakeCreditTransacion)
      .expect(201)

    const cookies = createTransactionResponse.get('Set-cookie')!

    await request(app.server)
      .post('/transaction')
      .set('Cookie', cookies)
      .send(fakeDebitTransacion)
      .expect(201)

    const listSummaryResponse = await request(app.server)
      .get('/transaction/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(listSummaryResponse.body.summary)
      .toEqual({
        amount: 1500,
      })
  })
})
