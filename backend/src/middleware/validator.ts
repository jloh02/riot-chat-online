import express from "express";
import Joi from "joi";

export function validateBody(schema: Joi.ObjectSchema) {
  return (req: express.Request, res: express.Response, next: () => void) => {
    const { error } = schema.validate(req.body);

    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    next();
  };
}
