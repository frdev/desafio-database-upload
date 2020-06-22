import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction | null> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    let transactionCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoriesRepository.create({ title: category });

      await categoriesRepository.save(transactionCategory);
    }

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value)
      throw new AppError("You don't have enought balance");

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
