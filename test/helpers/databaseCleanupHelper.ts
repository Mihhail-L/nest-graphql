import { DataSource } from 'typeorm';

export default async (database: DataSource): Promise<void> => {
  const tables = database.entityMetadatas;
  await database.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const table of tables) {
    const repository = database.getRepository(table.tableName);
    await repository.query(`TRUNCATE TABLE ${table.tableName}`);
  }
  await database.query('SET FOREIGN_KEY_CHECKS = 1');
};
