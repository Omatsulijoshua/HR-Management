'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  code: string;
  type: string;
  instructor: string;
  durationHours: number;
  capacity: number;
  enrolledCount: number;
}

interface Enrollment {
  id: string;
  employeeName: string;
  courseTitle: string;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completionDate?: string;
  certificateUrl?: string;
}

export default function TrainingPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c1',
      title: 'Enterprise Microservices & Cloud Security',
      code: 'SEC_201',
      type: 'INTERNAL_WORKSHOP',
      instructor: 'Dr. Chidi Nnamdi',
      durationHours: 16,
      capacity: 30,
      enrolledCount: 18,
    },
    {
      id: 'c2',
      title: 'AWS Certified Solutions Architect Training',
      code: 'AWS_ARCH',
      type: 'EXTERNAL_CERTIFICATION',
      instructor: 'AWS Training Academy',
      durationHours: 40,
      capacity: 15,
      enrolledCount: 15,
    },
    {
      id: 'c3',
      title: 'Annual Information Security Compliance',
      code: 'INFO_SEC_MANDATORY',
      type: 'MANDATORY_COMPLIANCE',
      instructor: 'Global Risk & Compliance Team',
      durationHours: 4,
      capacity: 100,
      enrolledCount: 42,
    },
  ]);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    {
      id: 'e1',
      employeeName: 'Omatsuli Joshua',
      courseTitle: 'Enterprise Microservices & Cloud Security',
      status: 'COMPLETED',
      completionDate: '2026-08-28',
      certificateUrl: 'https://cdn.nexushcm.io/certs/cert_8921.pdf',
    },
    {
      id: 'e2',
      employeeName: 'Amina Bello',
      courseTitle: 'AWS Certified Solutions Architect Training',
      status: 'IN_PROGRESS',
    },
  ]);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newInstructor, setNewInstructor] = useState('');
  const [newHours, setNewHours] = useState(8);
  const [newCap, setNewCap] = useState(30);

  const [selectedCourseId, setSelectedCourseId] = useState('c1');
  const [enrollEmpName, setEnrollEmpName] = useState('');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCode) return;
    const created: Course = {
      id: String(Date.now()),
      title: newTitle,
      code: newCode.toUpperCase(),
      type: 'INTERNAL_WORKSHOP',
      instructor: newInstructor || 'Internal Specialist',
      durationHours: Number(newHours),
      capacity: Number(newCap),
      enrolledCount: 0,
    };
    setCourses([...courses, created]);
    setShowCourseModal(false);
    setNewTitle('');
    setNewCode('');
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollEmpName) return;
    const course = courses.find((c) => c.id === selectedCourseId);
    const newEnr: Enrollment = {
      id: String(Date.now()),
      employeeName: enrollEmpName,
      courseTitle: course ? course.title : 'Selected Training Course',
      status: 'ENROLLED',
    };
    setEnrollments([newEnr, ...enrollments]);
    setShowEnrollModal(false);
    setEnrollEmpName('');
  };

  const handleMarkCompleted = (id: string) => {
    setEnrollments(
      enrollments.map((e) =>
        e.id === id
          ? {
              ...e,
              status: 'COMPLETED',
              completionDate: new Date().toISOString().split('T')[0],
              certificateUrl: 'https://cdn.nexushcm.io/certs/cert_generated.pdf',
            }
          : e
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Phase 10 — Learning & Development (L&D)
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Training Courses & Certifications</h1>
            <p className="text-sm text-slate-500">Corporate L&D course catalog, employee training enrolments, capacity tracking, and digital certificate issuing.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/skills"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition"
            >
              Organization Skills Inventory →
            </Link>
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
            >
              + Create Training Course
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Published Courses</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">{courses.length} Active Courses</div>
            <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">Workshops & Certifications</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Enrolments</span>
            <div className="text-2xl font-bold text-indigo-600 mt-2">{enrollments.length} Active Trainees</div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Across all Departments</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed Certifications</span>
            <div className="text-2xl font-bold text-teal-600 mt-2">
              {enrollments.filter((e) => e.status === 'COMPLETED').length} Issued
            </div>
            <span className="text-xs text-slate-500 mt-1 inline-block">Verified Certificates</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mandatory Compliance Rate</span>
            <div className="text-2xl font-bold text-purple-600 mt-2">100% Compliant</div>
            <span className="text-xs text-slate-500 mt-1 inline-block">InfoSec & Workplace Safety</span>
          </div>
        </div>

        {/* SECTION 1: Course Catalog Grid */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Course Catalog & Schedules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                      {c.type}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Code: {c.code}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mt-3">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Instructor: {c.instructor}</p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                    <span>Duration: {c.durationHours} Hours</span>
                    <span className="font-semibold text-slate-800">
                      Seats: {c.enrolledCount} / {c.capacity}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCourseId(c.id);
                    setShowEnrollModal(true);
                  }}
                  className="mt-6 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition"
                >
                  Enroll Trainee in Course
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Employee Enrolments Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Active Course Enrolments & Certificates</h2>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Employee Name</th>
                <th className="px-6 py-3">Course Title</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Completion Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{enr.employeeName}</td>
                  <td className="px-6 py-4">{enr.courseTitle}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        enr.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : enr.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {enr.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">{enr.completionDate || 'In Progress'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {enr.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => handleMarkCompleted(enr.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition"
                      >
                        Mark Completed
                      </button>
                    ) : (
                      <a
                        href={enr.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition inline-block"
                      >
                        🎓 View Certificate
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Create Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create L&D Training Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern React 19 & Next.js Architecture"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="REACT_101"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Instructor / Provider</label>
                <input
                  type="text"
                  placeholder="Senior Frontend Architect"
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newCap}
                    onChange={(e) => setNewCap(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Trainee Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Enroll Trainee in Course</h3>
            <form onSubmit={handleEnroll} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Employee Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Raji"
                  value={enrollEmpName}
                  onChange={(e) => setEnrollEmpName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
