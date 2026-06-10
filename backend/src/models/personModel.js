const db = require("../config/database");

/* =========================
   CREATE PERSON
========================= */
const createPerson = (data) => {
  const {
    FirstName,
    LastName,
    Gender,
    BirthDate,
    Phone,
    Email,
    Address,
  } = data;

  return db.query(
    `INSERT INTO Person
    (
      FirstName,
      LastName,
      Gender,
      BirthDate,
      Phone,
      Email,
      Address,
      CreatedAt,
      UpdatedAt,
      IsActive
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`,
    [
      FirstName,
      LastName,
      Gender,
      BirthDate,
      Phone,
      Email,
      Address,
    ]
  );
};

/* =========================
   GET ALL PERSONS
========================= */
const getAllPersons = () => {
  return db.query(`
    SELECT *
    FROM Person
  `);
};

/* =========================
   GET BY ID
========================= */
const getPersonById = (id) => {
  return db.query(
    `
    SELECT *
    FROM Person
    WHERE PersonID = ?
    `,
    [id]
  );
};

/* =========================
   UPDATE PERSON
========================= */
const updatePerson = (id, data) => {
  const {
    FirstName,
    LastName,
    Gender,
    BirthDate,
    Phone,
    Email,
    Address,
    IsActive,
  } = data;

  return db.query(
    `
    UPDATE Person
    SET
      FirstName = ?,
      LastName = ?,
      Gender = ?,
      BirthDate = ?,
      Phone = ?,
      Email = ?,
      Address = ?,
      UpdatedAt = NOW(),
      IsActive = ?
    WHERE PersonID = ?
    `,
    [
      FirstName,
      LastName,
      Gender,
      BirthDate,
      Phone,
      Email,
      Address,
      IsActive,
      id,
    ]
  );
};

/* =========================
   DELETE PERSON
========================= */
const deletePerson = (id) => {
  return db.query(
    `
    DELETE FROM Person
    WHERE PersonID = ?
    `,
    [id]
  );
};

module.exports = {
  createPerson,
  getAllPersons,
  getPersonById,
  updatePerson,
  deletePerson,
};