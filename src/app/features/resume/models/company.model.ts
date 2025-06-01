export interface CompanyData {
  id: string;
  name: string;
  logoUrl: string;
  isHrScreeningPassed?: boolean;
}

export class Company {
  id: string;
  name: string;
  logoUrl: string;
  isHrScreeningPassed: boolean;

  constructor(id: string, name: string, logoUrl: string, isHrScreeningPassed: boolean = false) {
    this.id = id;
    this.name = name;
    this.logoUrl = logoUrl;
    this.isHrScreeningPassed = isHrScreeningPassed;
  }

  static fromJson(json: unknown): Company {
    const data = json as CompanyData;
    
    return new Company(
      data.id || '',
      data.name || '',
      data.logoUrl || `assets/images/logos/${data.name?.toLowerCase() || 'default'}.png`,
      data.isHrScreeningPassed || false
    );
  }

  static fromJsonArray(jsonArray: unknown[]): Company[] {
    if (!jsonArray || !Array.isArray(jsonArray)) {
      return [];
    }

    return jsonArray.map(json => this.fromJson(json));
  }

  toJson(): CompanyData {
    return {
      id: this.id,
      name: this.name,
      logoUrl: this.logoUrl,
      isHrScreeningPassed: this.isHrScreeningPassed
    };
  }
} 