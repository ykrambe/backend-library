import request from 'supertest';
import { app } from '../../../app';
import { Book } from '../../../models/book';

// it('should return list of books pagination', async () => {
//     const res = await request(app).get('/api/books').query({ limit: 10, page: 1 });
//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty('status', 'success');
//     expect(res.body.data).toBeInstanceOf(Array);
// });

describe('GET /api/books', () => {
  it('should return list of books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toBeInstanceOf(Array);
  });
});

describe('GET /api/books/:id', () => {
  it('should return book by id', async () => {

    const res = await request(app).get(`/api/books/66f64f451ab8767d7548ba1f`);
    expect(res.status).toBe(401);
  });

  it('should return 401 if book not found', async () => {
    const res = await request(app).get('/api/books/66f64fb71ab8767d7548ba33');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toBe('Book with ID 66f64fb71ab8767d7548ba33 Not Found');
  });
});

describe('POST /api/books', () => {
  it('should create new book', async () => {
    const res = await request(app).post('/api/books').send({
      title: 'New Book',
      author: 'New Author',
      stock: 10,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('title', 'New Book');
    expect(res.body.data).toHaveProperty('author', 'New Author');
    expect(res.body.data).toHaveProperty('stock', 10);
  });

  it('should return 422 if data is not valid', async () => {
    const res = await request(app).post('/api/books').send({
      title: '',
      author: '',
      stock: -1,
    });
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.errors).toBeInstanceOf(Array);
    expect(res.body.errors[0].param).toBe('title');
    expect(res.body.errors[1].param).toBe('author');
    expect(res.body.errors[2].param).toBe('stock');
  });
});

describe('PUT /api/books/:id', () => {
  it('should update book by id', async () => {
    const book = await Book.findOne();
    const res = await request(app).put(`/api/books/${book?.id}`).send({
      title: 'Updated Book',
      author: 'Updated Author',
      stock: 20,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('id', book?._id.toString());
    expect(res.body.data).toHaveProperty('title', 'Updated Book');
    expect(res.body.data).toHaveProperty('author', 'Updated Author');
    expect(res.body.data).toHaveProperty('stock', 20);
  });

  it('should return 422 if parameter or request body is not valid', async () => {
    const res = await request(app).put('/api/books/66f64fb71ab8767d7548ba33');
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toBe('Data Not Valid');
  });
});

describe('DELETE /api/books/:id', () => {
  it('should delete book by id', async () => {
    const book = await Book.findOne();
    const res = await request(app).delete(`/api/books/${book?.id}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
    expect(await Book.findById(book?._id)).toBeNull();
  });

  it('should return 401 if book not found', async () => {
    const res = await request(app).delete('/api/books/66f64fb71ab8767d7548ba33');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toBe('Book with ID 66f64fb71ab8767d7548ba33 Not Found');
  });
});

