"use strict";

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Transform } = require("stream");
require("dotenv").config();

const transformData = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    try {
      const transformed = {
        sbd: chunk.sbd?.trim(),
        toan: chunk.toan ? parseFloat(chunk.toan) : null,
        ngu_van: chunk.ngu_van ? parseFloat(chunk.ngu_van) : null,
        ngoai_ngu: chunk.ngoai_ngu ? parseFloat(chunk.ngoai_ngu) : null,
        vat_li: chunk.vat_li ? parseFloat(chunk.vat_li) : null,
        hoa_hoc: chunk.hoa_hoc ? parseFloat(chunk.hoa_hoc) : null,
        sinh_hoc: chunk.sinh_hoc ? parseFloat(chunk.sinh_hoc) : null,
        lich_su: chunk.lich_su ? parseFloat(chunk.lich_su) : null,
        dia_li: chunk.dia_li ? parseFloat(chunk.dia_li) : null,
        gdcd: chunk.gdcd ? parseFloat(chunk.gdcd) : null,
        ma_ngoai_ngu: chunk.ma_ngoai_ngu?.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (!transformed.sbd) {
        console.warn(`Skipping invalid record: ${JSON.stringify(chunk)}`);
        callback();
        return;
      }

      callback(null, transformed);
    } catch (error) {
      console.error("Error transforming data:", error);
      callback(error);
    }
  },
});

module.exports = {
  async up(queryInterface, Sequelize) {
    const csvPath = path.join(__dirname, "../../data/diem_thi_thpt_2024.csv");

    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file not found at: ${csvPath}`);
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    return new Promise((resolve, reject) => {
      const records = [];

      fs.createReadStream(csvPath)
        .pipe(csv())
        .pipe(transformData)
        .on("data", (row) => {
          records.push(row);
        }) 
        .on("end", async () => {
          try {
            const batchSize = 1000;

            for (let i = 0; i < records.length; i += batchSize) {
              const batch = records.slice(i, i + batchSize);
              await queryInterface.bulkInsert("scores", batch, {});
            }

            console.log("Data import completed successfully");
            resolve();
          } catch (error) {
            console.error("Error inserting data:", error);
            reject(error);
          }
        })
        .on("error", (error) => {
          console.error("Error reading CSV:", error);
          reject(error);
        });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("scores", null, {});
  },
};
