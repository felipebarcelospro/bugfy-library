import axios from 'axios';

import { NextFunction, Request, Response } from 'express';

interface IBugFyConfig {
  host: string;
  applicationName: string; 
  discordChannelId: string;
  whatsAppGroupId: string;
}

export class BugFy {
  private readonly api

  constructor(private config: IBugFyConfig) {
    this.api = this.getApi()
  }

  getApi() {
    const api = axios.create({
      baseURL: 'http://localhost:3000/api/v1/',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    return api
  }

  async expressMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err) {
      await this.sendError(err);
    }

    next();
  }

  async sendError(err: Error) {
    const { host, applicationName, discordChannelId, whatsAppGroupId } = this.config;
    const { message, stack } = err;

    const body = {
      message,
      stack,
      applicationName,
      host,
      discordChannelId,
      whatsAppGroupId
    };

    await this.api.post('/errors', body);
  }
}