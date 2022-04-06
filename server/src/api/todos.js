const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();


router.get('/lists', async (req, res, next) => {
  try {

    const db = new sqlite3.Database(path.join(__dirname, '..', 'database.sqlite'));

    db.serialize(() => {
      //create the tables if do not exists
      db.run("CREATE TABLE IF NOT EXISTS todoLists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date DATE)");
      db.run("CREATE TABLE IF NOT EXISTS todoListItems (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, listId INTEGER, status TINYINT DEFAULT 0)");

      db.all("SELECT l.*, COUNT(i.id) as items FROM todoLists AS l LEFT JOIN todoListItems AS i ON i.listId=l.id ORDER BY l.date DESC", (err, result) => {
        if (err)
          throw new Error(err)

        db.close();
        res.status(200).json({ lists: result });
      });

    });

  } catch (e) {
    next(e) // pass the error to errorHandler middleware
  }


});

router.post('/create-list', async (req, res, next) => {
  try {

    const { id, name, date } = req.body
    const db = new sqlite3.Database(path.join(__dirname, '..', 'database.sqlite'));

    db.serialize(() => {
      if (typeof id !== undefined && id) {
        const stmt = db.prepare("UPDATE todoLists SET name = ?, date = ? WHERE id = ?");
        stmt.run([name, date, id]);
        stmt.finalize();
      } else {
        const stmt = db.prepare("INSERT INTO todoLists (name, date) VALUES (?, ?)");
        stmt.run([name, date]);
        stmt.finalize();
      }
      db.close();

      res.status(200).json({ message: 'Todo list created' });

    });

  } catch (e) {
    next(e)
  }

});

router.delete('/delete-list', async (req, res, next) => {
  try {

    const { id } = req.body
    const db = new sqlite3.Database(path.join(__dirname, '..', 'database.sqlite'));

    db.serialize(() => {
      const stmt = db.prepare("DELETE FROM todoLists WHERE id= ?");
      stmt.run(id);
      stmt.finalize();
      const stmt2 = db.prepare("DELETE FROM todoListItems WHERE listId= ?");
      stmt2.run(id);
      stmt2.finalize();
      db.close();

      res.status(200).json({ message: 'Todo list deleted' });

    });

  } catch (e) {
    next(e)
  }

});

router.post('/create-item', async (req, res, next) => {
  try {

    const { id, listId, name } = req.body
    const db = new sqlite3.Database(path.join(__dirname, '..', 'database.sqlite'));

    db.serialize(() => {

      if (typeof id !== undefined && id) {
        const stmt = db.prepare("UPDATE todoListItems SET name = ? WHERE id = ?");
        stmt.run([name, id]);
        stmt.finalize();
      } else {
        const stmt = db.prepare("INSERT INTO todoListItems (name, listId) VALUES (?, ?)");
        stmt.run([name, listId]);
        stmt.finalize();
      }
      db.close();

      res.status(200).json({ message: 'List item created' });

    });

  } catch (e) {
    next(e)
  }

});

router.delete('/delete-item', async (req, res, next) => {
  try {

    const { id } = req.body
    const db = new sqlite3.Database(path.join(__dirname, '..', 'database.sqlite'));

    db.serialize(() => {

      const stmt = db.prepare("DELETE FROM todoListItems WHERE id= ?");
      stmt.run(id);
      stmt.finalize();
      db.close();

      res.status(200).json({ message: 'List item deleted' });

    });

  } catch (e) {
    next(e)
  }

});

router.post('/mark-item', async (req, res, next) => {
  try {

    const { id, status } = req.body
    const db = new sqlite3.Database(path.join(__dirname, '..', 'database.sqlite'));

    db.serialize(() => {

      const stmt = db.prepare("UPDATE todoListItems SET status = ? WHERE id= ?");
      stmt.run([status, id]);
      stmt.finalize();
      db.close();

      res.status(200).json({ message: 'List item marked' });

    });

  } catch (e) {
    next(e)
  }

});


router.get('/:listId/items', async (req, res, next) => {
  try {

    const { listId } = req.params
    const db = new sqlite3.Database(path.join(__dirname, '..', 'database.sqlite'));

    db.serialize(() => {

      db.all("SELECT * FROM todoListItems WHERE listId = ?", [listId], (err, result) => {
        if (err)
          throw new Error(err)

        db.close();
        res.status(200).json({ items: result });
      });

    });

  } catch (e) {
    next(e)
  }

});

module.exports = router;
