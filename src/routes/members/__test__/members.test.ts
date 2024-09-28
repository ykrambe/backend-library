import request from 'supertest';
import { app } from '../../../app';
import { Member } from '../../../models/member';

describe('GET /api/members', () => {
  it('should return list of members', async () => {
    const res = await request(app).get('/api/members');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toBeInstanceOf(Array);
  });
});

describe('GET /api/members/:id', () => {
  it('should return member by id', async () => {
    const res = await request(app).get(`/api/members/66f64fb11ab8767d7548ba2f`);
    expect(res.status).toBe(401);
  });

  it('should return 401 if member not found', async () => {
    const res = await request(app).get('/api/members/66f64fb71ab8767d7548ba33');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toBe('Member with ID 66f64fb71ab8767d7548ba33 Not Found');
  });
});

describe('POST /api/members', () => {
  it('should create new member', async () => {
    const res = await request(app).post('/api/members').send({
      name: 'Aldi',
      address: 'Jl. Raya Bekasi KM 20',
      job: 'Software Engineer',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toMatchObject({
      name: 'Aldi',
      address: 'Jl. Raya Bekasi KM 20',
      job: 'Software Engineer',
      status: 'Active',
    });
  });

  it('should return 422 if data not valid', async () => {
    const res = await request(app).post('/api/members').send({
      name: '',
      address: '',
      job: '',
    });
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toBe('Data Not Valid');
  });
});

describe('PUT /api/members/:id', () => {
  it('should update member by id', async () => {
    const member = await Member.findOne()
    const res = await request(app).put(`/api/members/${member?.id}`).send({
      name: 'Yusuf Rambe Update',
      address: 'Jl. Raya Bekasi KM 20 Update',
      job: 'Software Engineer Update',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should return 401 if member not found', async () => {
    const res = await request(app).put('/api/members/66f64fb71ab8767d7548ba33').send({
      name: 'Aldi',
      address: 'Jl. Raya Bekasi KM 20',
      job: 'Software Engineer',
    });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.message).toBe('Error to update new member');
  });
});

// describe('DELETE /api/members/:id', () => {
//   it('should delete member by id', async () => {
//     const res = await request(app).delete(`/api/members/66f64f451ab8767d7548ba1f`);
//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty('status', 'success');
//     expect(res.body.message).toBe('Member with ID 66f64f451ab8767d7548ba1f has been deleted');
//   });

//   it('should return 401 if member not found', async () => {
//     const res = await request(app).delete('/api/members/66f64fb71ab8767d7548ba33');
//     expect(res.status).toBe(401);
//     expect(res.body).toHaveProperty('status', 'error');
//     expect(res.body.message).toBe('Member with ID 66f64fb71ab8767d7548ba33 Not Found');
//   });
// });
