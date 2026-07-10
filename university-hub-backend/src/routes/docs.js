import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    name: 'University Hub API',
    version: '1.0.0',
    endpoints: {
      health: {
        method: 'GET',
        path: '/health',
        description: 'Check API health'
      },
      auth: {
        register: {
          method: 'POST',
          path: '/api/auth/register',
          body: { name: 'string', email: 'string', password: 'string', role: 'string' }
        },
        login: {
          method: 'POST',
          path: '/api/auth/login',
          body: { email: 'string', password: 'string' }
        },
        me: {
          method: 'GET',
          path: '/api/auth/me',
          auth: true
        }
      },
      registrations: {
        create: {
          method: 'POST',
          path: '/api/registrations',
          body: { fullName: 'string', email: 'string', programme: 'string', referrerSlug: 'string', consent: 'boolean' }
        },
        getAll: {
          method: 'GET',
          path: '/api/registrations',
          auth: true
        },
        getByAmbassador: {
          method: 'GET',
          path: '/api/registrations/ambassador/:slug',
          auth: true
        }
      },
      proofs: {
        submit: {
          method: 'POST',
          path: '/api/proofs',
          auth: true,
          body: { registrationId: 'uuid', referenceNumber: 'string', notes: 'string' }
        },
        validate: {
          method: 'PUT',
          path: '/api/proofs/validate/:registrationId',
          auth: true,
          admin: true
        }
      }
    }
  });
});

export default router;