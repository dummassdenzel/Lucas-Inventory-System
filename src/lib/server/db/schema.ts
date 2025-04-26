import { mysqlTable, varchar, int, timestamp, text } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const categories = mysqlTable('categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description')
});

export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  quantity: int('quantity').notNull().default(0),
  minQuantity: int('min_quantity').notNull().default(0),
  categoryId: int('category_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Define the relationships
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));