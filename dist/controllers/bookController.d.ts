import { Request, Response } from 'express';
export declare const getBooks: (req: Request, res: Response) => Promise<void>;
export declare const downloadBook: (req: Request, res: Response) => Promise<void>;
export declare const getUserBooks: (req: Request, res: Response) => Promise<void>;
