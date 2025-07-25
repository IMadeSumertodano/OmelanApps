/* eslint-disable camelcase */
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("appointment", {
    id: { type: "serial", primaryKey: true },
    user_client_id: {
      type: "varchar(50)",
      references: "users_client(id)",
      onDelete: "cascade",
    },
    user_partner_id: {
      type: "varchar(50)",
      references: "users_partner(id)",
      onDelete: "cascade",
    },
    appointment_date: { type: "date" },
    status: { type: "varchar" },
    created_at: {
      type: "TEXT",
      notNull: true,
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("appointment");
};
