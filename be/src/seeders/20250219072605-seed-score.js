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

    // Get all subjects
    const subjects = await queryInterface.sequelize.query(
      "SELECT id, name FROM subjects",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const subjectMap = {};
    subjects.forEach((subject) => {
      subjectMap[subject.name] = subject.id;
    });

    // First process students
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
              sbd,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            seenSbds.add(sbd);

            // When chunk is full, add to chunks array and create new chunk
            if (currentChunk.length >= CHUNK_SIZE) {
              studentChunks.push([...currentChunk]);
              currentChunk = [];
            }
          }
        })
        .on("end", async () => {
          try {
            // Add final chunk if it has any records
            if (currentChunk.length > 0) {
              studentChunks.push(currentChunk);
            }

            // Insert students in chunks
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

    // Now get all the students
    console.log("Fetching student IDs...");
    const insertedStudents = await queryInterface.sequelize.query(
      "SELECT id, sbd FROM students",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const studentMap = {};
    insertedStudents.forEach((student) => {
      studentMap[student.sbd] = student.id;
    });

    // Now process scores in chunks
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
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });

                // When chunk is full, add to chunks array and create new chunk
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
            // Add final chunk if it has any records
            if (currentChunk.length > 0) {
              scoreChunks.push(currentChunk);
            }

            // Insert scores in chunks
            console.log(`Processing ${scoreChunks.length} score chunks...`);
            for (let i = 0; i < scoreChunks.length; i++) {
              console.log(
                `Inserting score chunk ${i + 1}/${scoreChunks.length}...`
              );
              await queryInterface.bulkInsert("scores", scoreChunks[i], {});

              // Free memory after each chunk is inserted
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
