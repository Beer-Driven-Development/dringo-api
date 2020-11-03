import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Category } from '../../categories/category.entity';

define(Category, (faker: typeof Faker) => {
  const category = new Category();
  return category;
});
