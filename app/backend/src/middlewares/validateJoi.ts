import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export default class ValidateJoi {
  joi = (req: Request, res: Response, next: NextFunction, schemas: Schema) => {
    const { error } = schemas.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
}
