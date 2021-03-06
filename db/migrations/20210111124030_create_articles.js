exports.up = function (knex) {
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.string('body', 10000).notNullable();
    articlesTable.integer('votes').defaultsTo(0);
    articlesTable
      .string('topic')
      .references('topics.slug')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    articlesTable
      .string('author')
      .references('users.username')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    articlesTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('articles');
};
