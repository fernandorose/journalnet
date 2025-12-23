import express, { Application, Request, Response, Router } from "express";
import http, { createServer, Server } from "http";
import { PostgresClient } from "../config";

export abstract class AppServer {
  private static _app: Application;
  private static _router: Router;
  private static _port: string;
  private static _httpSrv: http.Server;

  public static async run() {
    await this._init();
    this._routes();
    this._listen();
    await this.postgresConnect();
  }

  private static async _init() {
    this._app = express();
    this._port = "3000";
    this._httpSrv = createServer(this._app as unknown as Server);
    this._router = Router();
  }

  private static _routes() {
    this._router.get(`/`, (req: Request, res: Response) =>
      res.send(`Hello World`)
    );
  }

  private static async postgresConnect() {
    const pool = PostgresClient.getPool();
    pool.connect(async (err, client, release) => {
      if (err) {
        return console.error("Error acquiring client", err.stack);
      }
      if (!client) {
        return console.error("Client is undefined");
      }
      client.query("SELECT NOW()", (err, result) => {
        release();
        if (err) {
          return console.error("Error executing query", err.stack);
        }
        console.log(result.rows);
      });
    });
  }

  private static _listen() {
    this._httpSrv.listen(this._port, () => {
      console.log(`Server running`);
    });
  }
}
