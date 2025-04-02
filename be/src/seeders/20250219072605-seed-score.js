"use strict";

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Transform } = require("stream");

require("dotenv").config();

module.exports = {
  async up(queryInterface, Sequelize) {
    const csvPath = path.join(__dirname, "../../data/diem_thi_thpt_2024.csv");

    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file not found at: ${csvPath}`);
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    const subjects = await queryInterface.sequelize.query(
      "SELECT id, name FROM subjects",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const subjectMap = {};
    subjects.forEach((subject) => {
      subjectMap[subject.name] = subject.id;
    });

    console.log("Starting student import...");
    await new Promise((resolve, reject) => {
      const studentChunks = [];
      let currentChunk = [];
      const CHUNK_SIZE = 500;
      const seenSbds = new Set();

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          const sbd = row.sbd?.trim();
          if (sbd && !seenSbds.has(sbd)) {
            currentChunk.push({
              registrationNumber: sbd,
            });
            seenSbds.add(sbd);

            if (currentChunk.length >= CHUNK_SIZE) {
              studentChunks.push([...currentChunk]);
              currentChunk = [];
            }
          }
        })
        .on("end", async () => {
          try {
            if (currentChunk.length > 0) {
              studentChunks.push(currentChunk);
            }

            console.log(`Processing ${studentChunks.length} student chunks...`);
            for (let i = 0; i < studentChunks.length; i += 100) {
              console.log(
                `Inserting student chunk ${i + 1}/${studentChunks.length}...`
              );
              await queryInterface.bulkInsert("students", studentChunks[i], {});
            }

            console.log("Students imported successfully");
            resolve();
          } catch (error) {
            console.error("Error inserting students:", error);
            reject(error);
          }
        })
        .on("error", (error) => {
          console.error("Error reading CSV:", error);
          reject(error);
        });
    });

    console.log("Fetching student IDs...");
    const insertedStudents = await queryInterface.sequelize.query(
      'SELECT id, "registrationNumber" FROM students',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const studentMap = {};
    insertedStudents.forEach((student) => {
      studentMap[student.registrationNumber] = student.id;
    });

    console.log("Starting score import...");
    return new Promise((resolve, reject) => {
      let scoreChunks = [];
      let currentChunk = [];
      const CHUNK_SIZE = 1000;
      let processedRows = 0;

      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          processedRows++;
          if (processedRows % 1000 === 0) {
            console.log(`Processed ${processedRows} CSV rows...`);
          }

          const sbd = row.sbd?.trim();
          if (!sbd) return;

          const studentId = studentMap[sbd];
          if (!studentId) return;

          Object.keys(subjectMap).forEach((subjectName) => {
            if (row[subjectName] && row[subjectName].trim() !== "") {
              const scoreValue = parseFloat(row[subjectName]);
              if (!isNaN(scoreValue)) {
                currentChunk.push({
                  studentId,
                  subjectId: subjectMap[subjectName],
                  score: scoreValue,
                });

                if (currentChunk.length >= CHUNK_SIZE) {
                  scoreChunks.push([...currentChunk]);
                  currentChunk = [];
                }
              }
            }
          });
        })
        .on("end", async () => {
          try {
            if (currentChunk.length > 0) {
              scoreChunks.push(currentChunk);
            }
            console.log(`Processing ${scoreChunks.length} score chunks...`);
            for (let i = 0; i < scoreChunks.length; i += 100) {
              console.log(
                `Inserting score chunk ${i + 1}/${scoreChunks.length}...`
              );
              await queryInterface.bulkInsert("scores", scoreChunks[i], {});

              scoreChunks[i] = null;
            }

            console.log("Data import completed successfully");
            resolve();
          } catch (error) {
            console.error("Error inserting scores:", error);
            reject(error);
          }
        })
        .on("error", (error) => {
          console.error("Error processing CSV for scores:", error);
          reject(error);
        });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("scores", null, {});
    await queryInterface.bulkDelete("students", null, {});
  },
};
