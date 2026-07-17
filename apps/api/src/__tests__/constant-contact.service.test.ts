describe('ConstantContactService', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;
  const prismaMock = {
    integrationCredential: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.resetModules();
    jest.doMock('../config/database', () => ({
      prisma: prismaMock,
    }));
    process.env = {
      ...originalEnv,
      CONSTANT_CONTACT_ENABLED: 'true',
      CONSTANT_CONTACT_CLIENT_ID: 'client-id',
      CONSTANT_CONTACT_CLIENT_SECRET: 'client-secret',
      CONSTANT_CONTACT_REFRESH_TOKEN: 'refresh-token',
      CONSTANT_CONTACT_NEWSLETTER_LIST_ID: 'list-id',
    };
    global.fetch = jest.fn();
    prismaMock.integrationCredential.findUnique.mockResolvedValue(null);
    prismaMock.integrationCredential.upsert.mockResolvedValue({});
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.dontMock('../config/database');
    jest.clearAllMocks();
  });

  it('does not call Constant Contact when integration is incomplete', async () => {
    delete process.env.CONSTANT_CONTACT_REFRESH_TOKEN;

    const { ConstantContactService } = await import('../services/constant-contact.service');
    const service = new ConstantContactService();

    const result = await service.subscribeNewsletter({
      email: 'collector@example.com',
      name: 'Collector Name',
    });

    expect(result).toEqual({ skipped: true, reason: 'not_configured' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('refreshes an access token, persists rotation, and submits a newsletter signup payload', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'access-token',
          expires_in: 3600,
          refresh_token: 'rotated-refresh-token',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact_id: 'contact-id' }),
      });

    const { ConstantContactService } = await import('../services/constant-contact.service');
    const service = new ConstantContactService();

    const result = await service.subscribeNewsletter({
      email: 'collector@example.com',
      name: 'Collector Name',
    });

    expect(result).toEqual({ skipped: false, contactId: 'contact-id' });
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      'https://authz.constantcontact.com/oauth2/default/v1/token',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Basic /),
        }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'https://api.cc.email/v3/contacts/sign_up_form',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          email_address: 'collector@example.com',
          first_name: 'Collector',
          last_name: 'Name',
          list_memberships: ['list-id'],
          permission_to_send: 'implicit',
        }),
      })
    );
    expect(prismaMock.integrationCredential.upsert).toHaveBeenCalledWith({
      where: { key: 'constant_contact_refresh_token' },
      update: { value: 'rotated-refresh-token' },
      create: {
        key: 'constant_contact_refresh_token',
        value: 'rotated-refresh-token',
      },
    });
  });

  it('uses a stored refresh token when one exists', async () => {
    prismaMock.integrationCredential.findUnique.mockResolvedValue({
      key: 'constant_contact_refresh_token',
      value: 'stored-refresh-token',
    });
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'access-token', expires_in: 3600 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact_id: 'contact-id' }),
      });

    const { ConstantContactService } = await import('../services/constant-contact.service');
    const service = new ConstantContactService();

    await service.subscribeNewsletter({
      email: 'collector@example.com',
      name: 'Collector Name',
    });

    const tokenRequest = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(tokenRequest.body.get('refresh_token')).toBe('stored-refresh-token');
  });
});
