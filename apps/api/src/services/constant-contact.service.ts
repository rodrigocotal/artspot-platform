import { config } from '../config/environment';
import { prisma } from '../config/database';

const TOKEN_URL = 'https://authz.constantcontact.com/oauth2/default/v1/token';
const SIGNUP_FORM_URL = 'https://api.cc.email/v3/contacts/sign_up_form';
const TOKEN_EXPIRY_BUFFER_MS = 60_000;
const REFRESH_TOKEN_CREDENTIAL_KEY = 'constant_contact_refresh_token';

export type ConstantContactSubscribeResult =
  | { skipped: true; reason: 'disabled' | 'not_configured' }
  | { skipped: false; contactId: string | null };

interface NewsletterSubscriber {
  email: string;
  name?: string;
}

interface AccessTokenState {
  token: string;
  expiresAt: number;
}

export class ConstantContactService {
  private accessToken: AccessTokenState | null = null;
  private refreshToken: string | null = null;

  async subscribeNewsletter(
    subscriber: NewsletterSubscriber
  ): Promise<ConstantContactSubscribeResult> {
    if (!config.constantContact.enabled) {
      return { skipped: true, reason: 'disabled' };
    }

    if (!(await this.isConfigured())) {
      return { skipped: true, reason: 'not_configured' };
    }

    const accessToken = await this.getAccessToken();
    const name = this.splitName(subscriber.name);

    const response = await fetch(SIGNUP_FORM_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: subscriber.email,
        ...(name.firstName ? { first_name: name.firstName } : {}),
        ...(name.lastName ? { last_name: name.lastName } : {}),
        list_memberships: [config.constantContact.newsletterListId],
        permission_to_send: 'implicit',
      }),
    });

    if (!response.ok) {
      throw new Error(`Constant Contact signup failed with status ${response.status}`);
    }

    const data = (await response.json()) as { contact_id?: string };
    return { skipped: false, contactId: data.contact_id ?? null };
  }

  private async isConfigured() {
    return Boolean(
      config.constantContact.clientId &&
        config.constantContact.clientSecret &&
        (await this.getRefreshToken()) &&
        config.constantContact.newsletterListId
    );
  }

  private async getAccessToken() {
    if (this.accessToken && this.accessToken.expiresAt > Date.now() + TOKEN_EXPIRY_BUFFER_MS) {
      return this.accessToken.token;
    }

    const credentials = Buffer.from(
      `${config.constantContact.clientId}:${config.constantContact.clientSecret}`
    ).toString('base64');
    const refreshToken = await this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('Constant Contact refresh token is not configured');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Constant Contact token refresh failed with status ${response.status}`);
    }

    const data = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
      refresh_token?: string;
    };

    if (!data.access_token) {
      throw new Error('Constant Contact token refresh did not return an access token');
    }

    this.accessToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
    };
    if (data.refresh_token) {
      this.refreshToken = data.refresh_token;
      await this.persistRefreshToken(data.refresh_token);
    }

    return data.access_token;
  }

  private async getRefreshToken() {
    if (this.refreshToken) {
      return this.refreshToken;
    }

    try {
      const credential = await prisma.integrationCredential.findUnique({
        where: { key: REFRESH_TOKEN_CREDENTIAL_KEY },
      });
      if (credential?.value) {
        this.refreshToken = credential.value;
        return credential.value;
      }
    } catch (err) {
      console.error('Constant Contact credential lookup failed:', err);
    }

    this.refreshToken = config.constantContact.refreshToken || null;
    return this.refreshToken;
  }

  private async persistRefreshToken(refreshToken: string) {
    try {
      await prisma.integrationCredential.upsert({
        where: { key: REFRESH_TOKEN_CREDENTIAL_KEY },
        update: { value: refreshToken },
        create: {
          key: REFRESH_TOKEN_CREDENTIAL_KEY,
          value: refreshToken,
        },
      });
    } catch (err) {
      console.error('Constant Contact credential update failed:', err);
    }
  }

  private splitName(name?: string) {
    const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
    if (parts.length === 0) {
      return { firstName: '', lastName: '' };
    }

    const [firstName, ...rest] = parts;
    return { firstName, lastName: rest.join(' ') };
  }
}

export const constantContactService = new ConstantContactService();
