import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    Check, X, FileText, User as UserIcon, Search, Filter, 
    LayoutDashboard, Users, BookOpen, GraduationCap, 
    MoreHorizontal, DollarSign, PieChart, ArrowRight,
    Briefcase, Plus, Minus
} from 'lucide-react';
import { EnrollmentStatus, User, Course } from '../types';

type DashboardTab = 'overview' | 'kanban' | 'courses' | 'students';

export const AdminDashboard: React.FC = () => {
  const { getAllStudents, approveDocument, rejectDocument, updateStudent, getCourseStats, updateCourseCapacity } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Performance optimization: Move data fetching to effect and add limit
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    const data = getAllStudents();
    // Limit to 50 records to prevent performance issues with large datasets
    setStudents(data.slice(0, 50));
  }, [getAllStudents, refreshTrigger]);

  const refreshData = () => setRefreshTrigger(prev => prev + 1);

  const handleUpdateStatus = (studentId: string, status: EnrollmentStatus) => {
      updateStudent(studentId, { enrollmentStatus: status });
      refreshData();
  };

  const handleTogglePayment = (student: User) => {
      const next = student.paymentStatus === 'paid' ? 'unpaid' : 'paid';
      const nextEnrollment =
        next === 'paid' && student.enrollmentStatus === 'payment_pending'
          ? 'enrolled'
          : next === 'unpaid' && student.enrollmentStatus === 'enrolled'
          ? 'payment_pending'
          : student.enrollmentStatus;

      updateStudent(student.id, { paymentStatus: next, enrollmentStatus: nextEnrollment });
      refreshData();
  };


  const getCourseName = (id?: string) => {
      if (!id) return 'Not Selected';
      const course = t.courses.list.find(c => c.id === id);
      return course ? course.title : id;
  };

  const stats = useMemo(() => {
      return {
          total: students.length,
          enrolled: students.filter(s => s.enrollmentStatus === 'enrolled').length,
          pending: students.filter(s => s.enrollmentStatus === 'pending').length,
          visa: students.filter(s => s.enrollmentStatus === 'visa_issued').length,
          revenue: students.filter(s => ['enrolled', 'visa_issued'].includes(s.enrollmentStatus || '')).length * 2500 // Mock calc
      };
  }, [students]);

  // --- Sub-Components ---

  const OverviewTab = () => (
      <div className="space-y-6 animate-fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                  <div>
                      <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-2">${stats.revenue.toLocaleString()}</h3>
                      <p className="text-green-500 text-sm mt-1 flex items-center gap-1"><span className="bg-green-100 p-0.5 rounded">↑ 12%</span> vs last month</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-green-600">
                      <DollarSign className="w-6 h-6" />
                  </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                  <div>
                      <p className="text-gray-500 text-sm font-medium">Total Students</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</h3>
                      <p className="text-gray-400 text-sm mt-1">Active accounts</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                      <Users className="w-6 h-6" />
                  </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                  <div>
                      <p className="text-gray-500 text-sm font-medium">Visa Issued</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.visa}</h3>
                      <p className="text-madinah-gold text-sm mt-1">Ready for travel</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                      <FileText className="w-6 h-6" />
                  </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                  <div>
                      <p className="text-gray-500 text-sm font-medium">Pending Action</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</h3>
                      <p className="text-red-500 text-sm mt-1">Require review</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-red-600">
                      <PieChart className="w-6 h-6" />
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Enrollments</h3>
                  <div className="space-y-4">
                      {students.slice(0, 5).map(student => (
                          <div key={student.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                                      {student.name.charAt(0)}
                                  </div>
                                  <div>
                                      <p className="font-bold text-sm text-gray-900">{student.name}</p>
                                      <p className="text-xs text-gray-500">{getCourseName(student.enrolledCourseId)}</p>
                                  </div>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                  student.enrollmentStatus === 'enrolled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                  {student.enrollmentStatus || 'New'}
                              </span>
                          </div>
                      ))}
                      {students.length === 0 && <p className="text-gray-500 text-sm">No recent activity.</p>}
                  </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-madinah-green/5 rounded-xl border border-madinah-green/10 p-6">
                  <h3 className="font-bold text-lg text-madinah-green mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-3">
                      <button onClick={() => setActiveTab('kanban')} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <span className="font-medium text-gray-700">Review Applications</span>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                      </button>
                      <button onClick={() => setActiveTab('courses')} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <span className="font-medium text-gray-700">Manage Course Capacity</span>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                      </button>
                  </div>
              </div>
          </div>
      </div>
  );

  const KanbanTab = () => {
      const columns: {id: EnrollmentStatus | 'pending', label: string, color: string}[] = [
          { id: 'pending', label: 'Inquiry / New', color: 'bg-gray-100' },
          { id: 'payment_pending', label: 'Awaiting Payment', color: 'bg-yellow-50' },
          { id: 'enrolled', label: 'Enrolled', color: 'bg-green-50' },
          { id: 'visa_issued', label: 'Visa Issued', color: 'bg-blue-50' }
      ];

      return (
          <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-250px)] animate-fade-in">
              {columns.map(col => (
                  <div key={col.id} className="min-w-[300px] flex-1 flex flex-col bg-gray-50 rounded-xl border border-gray-200 h-full">
                      <div className={`p-4 border-b border-gray-200 rounded-t-xl ${col.color} flex justify-between items-center`}>
                          <h4 className="font-bold text-gray-700">{col.label}</h4>
                          <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                              {students.filter(s => (s.enrollmentStatus || 'pending') === col.id).length}
                          </span>
                      </div>
                      <div className="p-3 flex-1 overflow-y-auto space-y-3">
                          {students.filter(s => (s.enrollmentStatus || 'pending') === col.id).map(student => (
                              <div key={student.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                  <div className="flex justify-between items-start mb-2">
                                      <span className="font-bold text-sm text-gray-900">{student.name}</span>
                                      <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-3">{student.email}</p>
                                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                                      <BookOpen className="w-3 h-3" />
                                      <span className="truncate max-w-[150px]">{getCourseName(student.enrolledCourseId)}</span>
                                  </div>
                                  
                                  {/* Quick Status Movers */}
                                  <div className="flex gap-2 pt-2 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {col.id !== 'pending' && (
                                          <button 
                                              onClick={() => handleUpdateStatus(student.id, columns[columns.findIndex(c => c.id === col.id) - 1].id as EnrollmentStatus)}
                                              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                                          >
                                              Prev
                                          </button>
                                      )}
                                      {col.id !== 'visa_issued' && (
                                          <button 
                                              onClick={() => handleUpdateStatus(student.id, columns[columns.findIndex(c => c.id === col.id) + 1].id as EnrollmentStatus)}
                                              className="text-xs px-2 py-1 bg-madinah-green text-white hover:bg-opacity-90 rounded flex-1"
                                          >
                                              Next Stage
                                          </button>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      );
  };

  const CoursesTab = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.courses.list.map((course: Course) => {
                  const stats = getCourseStats(course.id, course.capacity);
                  const revenue = stats.enrolled * 2500;
                  const percentage = Math.min(100, (stats.enrolled / stats.capacity) * 100);
                  
                  return (
                      <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                          <div className="p-6 border-b border-gray-100 bg-gray-50">
                              <div className="flex justify-between items-start mb-4">
                                  <div className="p-3 bg-white rounded-lg shadow-sm">
                                    {course.id === 'business' ? <Briefcase className="w-6 h-6 text-madinah-gold" /> : 
                                     course.id === 'immersion' ? <UserIcon className="w-6 h-6 text-madinah-green" /> :
                                     <GraduationCap className="w-6 h-6 text-blue-600" />}
                                  </div>
                                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${stats.isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                      {stats.isFull ? 'Full' : 'Active'}
                                  </span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{course.arabicTitle}</p>
                          </div>
                          
                          <div className="p-6 flex-1">
                               {/* Capacity Management */}
                               <div className="mb-6">
                                  <div className="flex justify-between items-end mb-2">
                                      <span className="text-xs font-bold text-gray-500 uppercase">Capacity</span>
                                      <span className="text-sm font-bold text-gray-900">{stats.enrolled} / {stats.capacity}</span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                                      <div 
                                        className={`h-2.5 rounded-full ${stats.isFull ? 'bg-red-500' : 'bg-madinah-green'}`} 
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                      <button 
                                        onClick={() => {
                                            updateCourseCapacity(course.id, Math.max(0, stats.capacity - 5));
                                            refreshData();
                                        }}
                                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                                      >
                                          <Minus className="w-4 h-4" />
                                      </button>
                                      <span className="text-sm font-mono font-bold w-8 text-center">{stats.capacity}</span>
                                      <button 
                                        onClick={() => {
                                            updateCourseCapacity(course.id, stats.capacity + 5);
                                            refreshData();
                                        }}
                                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                                      >
                                          <Plus className="w-4 h-4" />
                                      </button>
                                      <span className="text-xs text-gray-400 ml-2">Adjust Limit</span>
                                  </div>
                               </div>

                              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100">
                                  <div>
                                      <p className="text-xs text-gray-500 uppercase font-bold">Students</p>
                                      <p className="text-xl font-bold text-gray-900">{stats.enrolled}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-gray-500 uppercase font-bold">Est. Revenue</p>
                                      <p className="text-xl font-bold text-gray-900">${revenue.toLocaleString()}</p>
                                  </div>
                              </div>
                              
                              <div className="space-y-3">
                                  <p className="text-sm font-bold text-gray-700">Recent Enrollees:</p>
                                  {students.filter(s => s.enrolledCourseId === course.id).slice(0, 3).map(s => (
                                      <div key={s.id} className="flex items-center gap-2 text-sm text-gray-600">
                                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                                              {s.name.charAt(0)}
                                          </div>
                                          {s.name}
                                      </div>
                                  ))}
                                  {stats.enrolled === 0 && <span className="text-sm text-gray-400 italic">No students yet</span>}
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
  );

  const StudentsTab = () => {
      const filteredStudents = students.filter(s => 
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                          type="text" 
                          placeholder="Search students by name, email, ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-madinah-green focus:border-transparent"
                      />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      Filter
                  </button>
              </div>

              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {filteredStudents.map((student) => (
                              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10 bg-madinah-green/10 rounded-full flex items-center justify-center">
                                              <UserIcon className="h-5 w-5 text-madinah-green" />
                                          </div>
                                          <div className="ml-4">
                                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                              <div className="text-sm text-gray-500">{student.email}</div>
                                              <div className="text-xs text-gray-400 mt-1">{student.studentId}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="text-sm text-gray-900">{getCourseName(student.enrolledCourseId)}</div>
                                      <div className="text-xs text-gray-500">{student.enrolledCourseId ? '60 Days' : '-'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <select 
                                          value={student.enrollmentStatus || 'pending'}
                                          onChange={(e) => handleUpdateStatus(student.id, e.target.value as EnrollmentStatus)}
                                          className={`text-xs font-bold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-madinah-gold cursor-pointer ${
                                              student.enrollmentStatus === 'enrolled' ? 'bg-green-100 text-green-800' : 
                                              student.enrollmentStatus === 'visa_issued' ? 'bg-blue-100 text-blue-800' :
                                              student.enrollmentStatus === 'payment_pending' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-gray-100 text-gray-800'
                                          }`}
                                      >
                                          <option value="pending">Pending</option>
                                          <option value="payment_pending">Awaiting Payment</option>
                                          <option value="enrolled">Enrolled</option>
                                          <option value="visa_issued">Visa Issued</option>
                                      </select>
                                      <div className="mt-2">
                                          <button
                                              onClick={() => handleTogglePayment(student)}
                                              className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                  student.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                                              }`}
                                          >
                                              {student.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                          </button>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="space-y-2">
                                          {student.documents && student.documents.length > 0 ? (
                                              student.documents.map(doc => (
                                                  <div key={doc.id} className="flex items-center gap-2 text-sm">
                                                      <FileText className="w-4 h-4 text-gray-400" />
                                                      <span className="text-gray-600 truncate max-w-[80px]" title={doc.name}>{doc.name}</span>
                                                      {doc.status === 'pending' ? (
                                                      <>
                                                          <button 
                                                              onClick={() => { approveDocument(student.id, doc.id); refreshData(); }}
                                                              className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded hover:bg-blue-200"
                                                          >
                                                              Approve
                                                          </button>
                                                          <button
                                                              onClick={() => {
                                                                  const reason = prompt('Rejection reason (optional):') || 'Rejected';
                                                                  rejectDocument(student.id, doc.id, reason);
                                                                  refreshData();
                                                              }}
                                                              className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded hover:bg-red-200"
                                                          >
                                                              Reject
                                                          </button>
                                                      </>
                                                      ) : doc.status === 'approved' ? (
                                                          <Check className="w-4 h-4 text-green-500" />
                                                      ) : (
                                                          <X className="w-4 h-4 text-red-500" />
                                                      )}
                                                  </div>
                                              ))
                                          ) : (
                                              <span className="text-xs text-gray-400 italic">No docs</span>
                                          )}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <button className="text-gray-400 hover:text-madinah-green"><MoreHorizontal className="w-5 h-5" /></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage enrollments, courses, and student applications.</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-gray-700 border border-gray-100">
                    {students.length} Total Applications
                </span>
                <button 
                    onClick={refreshData} 
                    className="p-2 bg-madinah-green text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <Briefcase className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-200">
            {[
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'kanban', label: 'Application Board', icon: Briefcase },
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'students', label: 'All Students', icon: Users }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as DashboardTab)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-white text-madinah-green border-b-2 border-madinah-green shadow-sm' 
                        : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
                    }`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'kanban' && <KanbanTab />}
        {activeTab === 'courses' && <CoursesTab />}
        {activeTab === 'students' && <StudentsTab />}

      </div>
    </div>
  );
};