const mongoose = require('mongoose');
require('dotenv').config();
const Subject = require('./models/Subject');

const btechBranches = [
  { key: 'CSE', name: 'Computer Science & Engineering' },
  { key: 'ECE', name: 'Electronics & Communication Engineering' },
  { key: 'EEE', name: 'Electrical & Electronics Engineering' },
  { key: 'ME', name: 'Mechanical Engineering' },
  { key: 'CE', name: 'Civil Engineering' }
];

const mtechBranches = [
  { key: 'CSE', name: 'Computer Science & Engineering' },
  { key: 'ECE', name: 'Electronics & Communication Engineering' }
];

const btechSubjects = {
  1: {
    1: ['Engineering Mathematics I', 'Engineering Physics', 'Basic Electrical Engineering', 'Programming Fundamentals'],
    2: ['Engineering Mathematics II', 'Engineering Chemistry', 'Engineering Mechanics', 'Workshop Practice']
  },
  2: {
    3: ['Data Structures', 'Digital Logic Design', 'Discrete Mathematics', 'Object Oriented Programming'],
    4: ['Computer Organization', 'Operating Systems', 'Database Management Systems', 'Probability & Statistics']
  },
  3: {
    5: ['Design & Analysis of Algorithms', 'Theory of Computation', 'Software Engineering', 'Computer Networks'],
    6: ['Compiler Design', 'Artificial Intelligence', 'Web Technologies', 'Cloud Computing']
  },
  4: {
    7: ['Advanced Algorithms', 'Distributed Systems', 'Information Security', 'Machine Learning'],
    8: ['Big Data Analytics', 'Internet of Things', 'Blockchain Fundamentals', 'Deep Learning']
  }
};

const mtechSubjects = {
  1: {
    1: ['Advanced Data Structures', 'Advanced Computer Architecture', 'Research Methodology', 'Advanced Database Systems'],
    2: ['Machine Learning', 'Advanced Operating Systems', 'Network Security', 'Distributed Computing']
  },
  2: {
    3: ['Cloud Infrastructure', 'Big Data Systems', 'Advanced AI', 'Software Quality Assurance'],
    4: ['Thesis I', 'Thesis II', 'Seminar', 'Industry Internship']
  }
};

const codeFor = (course, branchKey, year, sem, idx) => {
  const prefix = course === 'btech' ? 'BT' : 'MT';
  return `${prefix}${branchKey}${year}${sem}${String(idx + 1).padStart(2, '0')}`;
};

const buildSubjects = (course, branches, plan) => {
  const docs = [];
  Object.keys(plan).forEach((yearKey) => {
    const year = Number(yearKey);
    const semesters = plan[year];
    Object.keys(semesters).forEach((semKey) => {
      const semester = Number(semKey);
      const subjects = semesters[semester];
      branches.forEach((branch) => {
        subjects.forEach((name, idx) => {
          docs.push({
            code: codeFor(course, branch.key, year, semester, idx),
            name,
            course,
            branch: branch.key,
            semester: String(semester),
            year: String(year),
            teacher_id: 'TBD'
          });
        });
      });
    });
  });
  return docs;
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const btechDocs = buildSubjects('btech', btechBranches, btechSubjects);
  const mtechDocs = buildSubjects('mtech', mtechBranches, mtechSubjects);
  const all = [...btechDocs, ...mtechDocs];

  const existing = new Set((await Subject.find({}).select('code').lean()).map((s) => s.code));
  const toInsert = all.filter((s) => !existing.has(s.code));

  if (!toInsert.length) {
    console.log('No new subjects to insert.');
  } else {
    await Subject.insertMany(toInsert);
    console.log(`Inserted ${toInsert.length} subjects.`);
  }

  await mongoose.disconnect();
})();
