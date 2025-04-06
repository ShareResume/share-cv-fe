export enum StatCategoryEnum {
  SUBMISSIONS = 'submissions',
  ACCEPTANCE = 'acceptance',
  REJECTION = 'rejection'
}

export interface CompanyStatData {
  companyName: string;
  value: string | number;
  icon?: string;
  category: StatCategoryEnum;
}

export class CompanyStat {
  companyName: string;
  value: string | number;
  icon: string;
  category: StatCategoryEnum;

  constructor(companyName: string, value: string | number, icon: string, category: StatCategoryEnum) {
    this.companyName = companyName;
    this.value = value;
    this.icon = icon;
    this.category = category;
  }
  /**
   * Creates an array of CompanyStat instances from JSON array data
   */
  static fromJsonArray(jsonArray: unknown[]): CompanyStat[] {
    if (!jsonArray || !Array.isArray(jsonArray)) {
      return [];
    }

    return jsonArray.map(json => this.fromJson(json));
  }

  /**
   * Creates a CompanyStat instance from JSON data
   */
  static fromJson(json: unknown): CompanyStat {
    const data = json as CompanyStatData;

    return new CompanyStat(
      data.companyName || '',
      data.value || 0,
      data.icon || `assets/icons/${data.companyName?.toLowerCase() || 'default'}-icon.svg`,
      data.category || StatCategoryEnum.SUBMISSIONS,
    );
  }

  /**
   * Converts the CompanyStat instance to a JSON object
   */
  toJson(): CompanyStatData {
    return {
      companyName: this.companyName,
      value: this.value,
      icon: this.icon,
      category: this.category,
    };
  }

  /**
   * Helper method to get a display title for this category
   */
  static getCategoryTitle(category: StatCategoryEnum): string {
    switch (category) {
      case StatCategoryEnum.SUBMISSIONS:
        return 'Most Resume Submissions';
      case StatCategoryEnum.ACCEPTANCE:
        return 'Highest Acceptance Rate';
      case StatCategoryEnum.REJECTION:
        return 'Highest Rejection Rate';
      default:
        return 'Company Statistics';
    }
  }
} 