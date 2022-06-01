import * as express from 'express';
import Routers from './routers/Router';

class App {
  public app: express.Express;
  public router = new Routers();

  constructor() {
    this.app = express();
    this.config();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.app.use(express.json());
    this.router.login(this.app);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.warn('Listen on', PORT));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
