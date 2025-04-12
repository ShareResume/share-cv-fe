export interface CompanyData {
  name: string;
  logoUrl: string;
}

export class Company {
  name: string;
  logoUrl: string;

  constructor(name: string, logoUrl: string) {
    this.name = name;
    this.logoUrl = logoUrl;
  }

  /**
   * Creates a Company instance from JSON data
   */
  static fromJson(json: unknown): Company {
    const data = json as CompanyData;
    
    return new Company(
      data.name || '',
      data.logoUrl || `assets/images/logos/${data.name?.toLowerCase() || 'default'}.png`,
    );
  }

  /**
   * Creates an array of Company instances from JSON array data
   */
  static fromJsonArray(jsonArray: unknown[]): Company[] {
    if (!jsonArray || !Array.isArray(jsonArray)) {
      return [];
    }

    return jsonArray.map(json => this.fromJson(json));
  }

  /**
   * Converts the Company instance to a JSON object
   */
  toJson(): CompanyData {
    return {
      name: this.name,
      logoUrl: this.logoUrl,
    };
  }
} 