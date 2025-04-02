import Student from "./student";
import Subject, {
  MathSubject,
  PhysicsSubject,
  ChemistrySubject,
  BiologySubject,
  LiteratureSubject,
  HistorySubject,
  GeographySubject,
  CivicEducationSubject,
  ForeignLanguage,
} from "./subject";
import Score from "./score";
import SubjectGroup from "./subjectGroup";

Student.hasMany(Score, {
  foreignKey: "studentId",
  as: "scores",
  onDelete: "CASCADE",
});

Subject.hasMany(Score, {
  foreignKey: "subjectId",
  as: "scores",
  onDelete: "CASCADE",
});

SubjectGroup.hasMany(Subject, {
  foreignKey: "groupId",
  as: "subjects",
  onDelete: "CASCADE",
});

Score.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

Score.belongsTo(Subject, {
  foreignKey: "subjectId",
  as: "subject",
});

Subject.belongsTo(SubjectGroup, {
  foreignKey: "groupId",
  as: "group",
});

export {
  Student,
  Subject,
  Score,
  SubjectGroup,
  MathSubject,
  PhysicsSubject,
  ChemistrySubject,
  BiologySubject,
  LiteratureSubject,
  HistorySubject,
  GeographySubject,
  CivicEducationSubject,
  ForeignLanguage,
};
