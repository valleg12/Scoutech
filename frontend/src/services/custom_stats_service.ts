interface CustomStats {
  [key: string]: string | number;
}

class CustomStatsService {
  private static instance: CustomStatsService;
  private customData: CustomStats[] = [];
  private headers: string[] = [];
  private dataType: string = '';

  private constructor() {}

  public static getInstance(): CustomStatsService {
    if (!CustomStatsService.instance) {
      CustomStatsService.instance = new CustomStatsService();
    }
    return CustomStatsService.instance;
  }

  public setData(data: CustomStats[], headers: string[], type: string = 'custom'): void {
    this.customData = data;
    this.headers = headers;
    this.dataType = type;
  }

  public getData(): CustomStats[] {
    return this.customData;
  }

  public getHeaders(): string[] {
    return this.headers;
  }

  public getDataType(): string {
    return this.dataType;
  }

  public clear(): void {
    this.customData = [];
    this.headers = [];
    this.dataType = '';
  }

  public detectDataType(headers: string[]): string {
    const headerSet = new Set(headers.map(h => h.toLowerCase()));
    
    // Détection des statistiques de joueurs
    if (
      headerSet.has('buts') ||
      headerSet.has('goals') ||
      headerSet.has('assists') ||
      headerSet.has('passes_decisives')
    ) {
      return 'player_stats';
    }
    
    // Détection des statistiques de matchs
    if (
      headerSet.has('match') ||
      headerSet.has('score') ||
      headerSet.has('resultat')
    ) {
      return 'match_stats';
    }
    
    // Détection des données de scouting
    if (
      headerSet.has('scout') ||
      headerSet.has('evaluation') ||
      headerSet.has('rating')
    ) {
      return 'scouting_data';
    }

    return 'custom';
  }

  public getAnalytics(): any {
    const analytics: any = {
      totalRecords: this.customData.length,
      columns: this.headers.length,
      numericalColumns: 0,
      categoricalColumns: 0,
      summary: {}
    };

    this.headers.forEach(header => {
      const values = this.customData.map(row => row[header]);
      const isNumerical = values.every(v => !isNaN(Number(v)));
      
      if (isNumerical) {
        analytics.numericalColumns++;
        const numbers = values.map(v => Number(v));
        analytics.summary[header] = {
          type: 'numerical',
          min: Math.min(...numbers),
          max: Math.max(...numbers),
          average: numbers.reduce((a, b) => a + b, 0) / numbers.length,
          median: this.calculateMedian(numbers)
        };
      } else {
        analytics.categoricalColumns++;
        const categories = new Set(values);
        analytics.summary[header] = {
          type: 'categorical',
          uniqueValues: categories.size,
          categories: Array.from(categories)
        };
      }
    });

    return analytics;
  }

  private calculateMedian(numbers: number[]): number {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
  }
}

export const customStatsService = CustomStatsService.getInstance(); 