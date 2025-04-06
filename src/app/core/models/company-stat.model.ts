export enum StatCategoryEnum {
  SUBMISSIONS = 'submissions',
  ACCEPTANCE = 'acceptance',
  REJECTION = 'rejection'
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
  static fromJsonArray(jsonArray: any[]): CompanyStat[] {
    if (!jsonArray || !Array.isArray(jsonArray)) {
      return [];
    }
    return jsonArray.map(json => this.fromJson(json));
  }

  /**
   * Creates a CompanyStat instance from JSON data
   */
  static fromJson(json: any): CompanyStat {
    return new CompanyStat(
      json.companyName,
      json.value,
      json.icon || `assets/icons/${json.companyName.toLowerCase()}-icon.svg`,
      json.category
    );
  }

  /**
   * Converts the CompanyStat instance to a JSON object
   */
  toJson(): any {
    return {
      companyName: this.companyName,
      value: this.value,
      icon: this.icon,
      category: this.category
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