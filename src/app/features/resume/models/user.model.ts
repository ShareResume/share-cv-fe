export interface UserData {
  id: string;
  name: string;
  avatarUrl: string;
}

export class User {
  id: string;
  name: string;
  avatarUrl: string;

  constructor(id: string, name: string, avatarUrl: string) {
    this.id = id;
    this.name = name;
    this.avatarUrl = avatarUrl;
  }

  /**
   * Creates a User instance from JSON data
   */
  static fromJson(json: unknown): User {
    const data = json as UserData;
    
    return new User(
      data.id || '',
      data.name || '',
      data.avatarUrl || 'assets/images/avatars/default.png'
    );
  }

  /**
   * Creates an array of User instances from JSON array data
   */
  static fromJsonArray(jsonArray: unknown[]): User[] {
    if (!jsonArray || !Array.isArray(jsonArray)) {
      return [];
    }

    return jsonArray.map(json => this.fromJson(json));
  }

  /**
   * Converts the User instance to a JSON object
   */
  toJson(): UserData {
    return {
      id: this.id,
      name: this.name,
      avatarUrl: this.avatarUrl
    };
  }
} 