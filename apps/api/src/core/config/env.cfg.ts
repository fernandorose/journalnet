type Mode = "dev" | "prod";

export class EnvInitCfg {
  private static _instance: EnvInitCfg;
  private readonly mode: Mode;
  private readonly envPath: string;

  private constructor() {
    this.mode = (process.env.NODE_ENV as Mode) || "dev";
    this.envPath = this.resolveEnvPath();
    this.loadEnvFile();
  }

  public static get instance(): EnvInitCfg {
    if (!this._instance) this._instance = new EnvInitCfg();
    return this._instance;
  }

  private resolveEnvPath(): string {
    switch (this.mode) {
      case "prod":
        return "./.env.prod";
      case "dev":
      default:
        return "./.env.dev";
    }
  }

  private loadEnvFile(): void {
    console.log(`🔧 Load env config from: ${this.envPath}`);
    process.loadEnvFile(this.envPath);
  }

  public required(name: string): string {
    const value = process.env[name];
    if (value === undefined) throw new Error(`❌ Missing env var: ${name}`);
    return value;
  }

  public get env() {
    return {
      PG_USER: this.required("PG_USER"),
      PG_HOST: this.required("PG_HOST"),
      PG_DATABASE: this.required("PG_DATABASE"),
      PG_PASSWORD: this.required("PG_PASSWORD"),
      PG_PORT: this.required("PG_PORT"),
    };
  }
}
