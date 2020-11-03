import { Category } from '../../categories/category.entity';
import { Factory, Seeder } from 'typeorm-seeding';

export class CreateCategories implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const categories = [
      'Overall impression',
      'Appearance',
      'Aroma',
      'Flavour',
      'Mouthfeel',
    ];

    for (const name of categories) {
      await factory(Category)()
        .map(async category => {
          category.name = name;
          return category;
        })
        .create();
    }
  }
}
