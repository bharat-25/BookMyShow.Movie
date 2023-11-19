export class UpdateMovieDto {
    readonly plot?: string;
    readonly genres?: string[];
    readonly runtime?: number;
    readonly cast?: string[];
    readonly title?: string;
    readonly fullplot?: string;
    readonly languages?: string[];
    readonly released?: Date;
    readonly rated?: string;
    readonly year?: number;
    readonly imdb?: {
      rating?: number;
      votes?: number;
      id?: number;
    };
    readonly countries?: string[];
  }
  