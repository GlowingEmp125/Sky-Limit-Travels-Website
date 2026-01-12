declare module 'amadeus' {
  export default class Amadeus {
    constructor(options: {
      clientId?: string;
      clientSecret?: string;
      hostname?: string;
      customAppId?: string;
      customAppVersion?: string;
      https?: boolean;
      logger?: any;
      logLevel?: string;
      ssl?: any;
      port?: number;
    });

    shopping: {
      flightOffersSearch: {
        get(params: any): Promise<{
          result: any;
          data: any;
        }>;
      };
      flightOffers: {
        pricing: {
          post(params: any): Promise<{
            result: any;
            data: any;
          }>;
        };
      };
      flightDestinations: {
        get(params: any): Promise<{
          result: any;
          data: any;
        }>;
      };
    };

    referenceData: {
      locations: {
        get(params: any): Promise<{
          result: any;
          data: any;
        }>;
      };
      airlines: {
        get(params: any): Promise<{
          result: any;
          data: any;
        }>;
      };
    };
  }
} 