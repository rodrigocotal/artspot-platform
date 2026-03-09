import { SquareClient, SquareEnvironment } from 'square';
import { config } from './environment';

let squareInstance: SquareClient | null = null;

export function getSquare(): SquareClient {
  if (!squareInstance) {
    if (!config.square.accessToken) {
      throw new Error('SQUARE_ACCESS_TOKEN is not configured');
    }
    squareInstance = new SquareClient({
      token: config.square.accessToken,
      environment:
        config.square.environment === 'production'
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    });
  }
  return squareInstance;
}
