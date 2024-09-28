import request from 'supertest';
import { app } from '../../../app';
import { Borrowing } from '../../../models/borrowing';

describe('GET /api/borrowing', () => {
  it('should return list of borrowings', async () => {
    const res = await request(app).get('/api/borrowing');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('should return borrowings with pagination', async () => {
    const res = await request(app).get('/api/borrowing').query({ limit: 10, page: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body).toHaveProperty('totalBorrowing');
    expect(res.body).toHaveProperty('totalPages');
    expect(res.body).toHaveProperty('currentPage');
  });
});

describe('GET /api/borrowing/:id', () => {
  it('should return borrowing by id', async () => {
    const res = await request(app).get('/api/borrowing/66f64fb11ab8767d7548ba2f');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should return 404 if borrowing not found', async () => {
    const res = await request(app).get('/api/borrowing/62f25f1b6a5f9f8b2e6f1f34');
    expect(res.status).toBe(200);
  });
});

describe('POST /api/borrowing', () => {
  it('should return 400 if error creating borrowing', async () => {
    const res = await request(app).post('/api/borrowing')
      .send({
        codeBooks: ['BUK-PRO-1201'],
        codeMember: "BUD-MAH-9009"
      });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toBe(`Member with code 'BUD-MAH-9009' Not Found`); 
  });

  it('should return 422 if error validation', async () => {
    const res = await request(app).post('/api/borrowing')
      .send({
        codeBooks: ['BUK-PRO-1201'],
        codeMember: ''
      });
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toBe('Data Not Valid');
  });
});

describe('POST /api/return-borrowing', () => {
  it('should return borrowing', async () => {

    const res = await request(app).post('/api/return-borrowing')
      .send({
        codeBooks: ["BUK-PRO-1201"],
        codeMember: "BUD-MAH-9009"
      });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
  });

  it('should return 400 if error returning borrowing', async () => {
    const res = await request(app).post('/api/return-borrowing')
      .send({
        codeBooks: ['62f25f1b6a5f9f8b2e6f1f17'],
        codeMember: '62f25f1b6a5f9f8b2e6f1f19'
      });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toBe('Member with code 62f25f1b6a5f9f8b2e6f1f19 Not Found');
  });

  it('should return 422 if error validation', async () => {
    const res = await request(app).post('/api/return-borrowing')
      .send({
        codeBooks: ['62f25f1b6a5f9f8b2e6f1f17'],
        codeMember: ''
      });
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toBe('Data Not Valid');
  });
});
