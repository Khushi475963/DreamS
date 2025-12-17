
import React, { useState } from 'react';
import { Search, Clock, Calendar, BadgeIndianRupee, Stethoscope, Star } from 'lucide-react';

interface Doctor {
  name: string;
  specialty: string;
  type: 'Regular OPD' | 'Super Specialist';
  timing?: string;
  days: string;
  charges?: string;
  imageColor: string;
}

const DOCTORS_DATA: Doctor[] = [
  // Regular OPD
  { name: 'Dr. Sanjeev Sehgal', specialty: 'Eye Consultant', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-blue-100 text-blue-600' },
  { name: 'Dr. Amit Mangla', specialty: 'ENT / Microbiologist', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-emerald-100 text-emerald-600' },
  { name: 'Dr. Rahul Sharma', specialty: 'General Surgeon', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-indigo-100 text-indigo-600' },
  { name: 'Dr. Rajesh Kumar Tayal', specialty: 'Orthopedic Specialist', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-amber-100 text-amber-600' },
  { name: 'Dr. Rajat Mangla', specialty: 'Anaesthetist', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-purple-100 text-purple-600' },
  { name: 'Dr. Shalini Mangla', specialty: 'Pediatrician', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-pink-100 text-pink-600' },
  { name: 'Dr. Romani Bansal', specialty: 'Pediatrician', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-rose-100 text-rose-600' },
  { name: 'Dr. Rooshali Kumar', specialty: 'Obstetrics & Gynecology', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-fuchsia-100 text-fuchsia-600' },
  { name: 'Dr. Vivek Srivastava', specialty: 'General Medicine', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-cyan-100 text-cyan-600' },
  { name: 'Dr. Ashima', specialty: 'Dental Specialist', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-teal-100 text-teal-600' },
  { name: 'Dr. Kamakshi', specialty: 'Physiotherapist / Dietitian', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-lime-100 text-lime-600' },
  { name: 'Dr. Vijay Dhiman', specialty: 'Physiotherapist', type: 'Regular OPD', days: 'Daily', timing: '9:30 AM - 4:00 PM', imageColor: 'bg-green-100 text-green-600' },

  // Super Specialists
  { name: 'Dr. Rohit Dhadwal', specialty: 'Urologist', type: 'Super Specialist', days: 'Every 1st Wednesday', timing: '10:00 AM – 2:00 PM', charges: '₹400', imageColor: 'bg-violet-100 text-violet-600' },
  { name: 'Dr. Mohit Kaushal', specialty: 'Pulmonologist', type: 'Super Specialist', days: 'Every 2nd & 4th Wednesday', timing: '11:00 AM – 1:00 PM', charges: '₹400', imageColor: 'bg-sky-100 text-sky-600' },
  { name: 'Dr. Anil Walia', specialty: 'Cosmetologist', type: 'Super Specialist', days: 'Every Saturday', timing: '10:00 AM – 2:00 PM', charges: '₹100', imageColor: 'bg-orange-100 text-orange-600' },
  { name: 'Dr. Sudhanshu Budakoti', specialty: 'Cardiologist', type: 'Super Specialist', days: 'Every 3rd Friday', timing: '11:00 AM – 2:00 PM', charges: '₹400', imageColor: 'bg-red-100 text-red-600' },
  { name: 'Dr. Deepti Singh', specialty: 'Breast & Endocrine Surgeon', type: 'Super Specialist', days: 'Every 2nd Tuesday', charges: '₹400', imageColor: 'bg-pink-100 text-pink-600' },
  { name: 'Dr. Mahindra Dange', specialty: 'Pediatric Surgeon', type: 'Super Specialist', days: 'Every 4th Tuesday', timing: '10:00 AM – 2:00 PM', charges: '₹400', imageColor: 'bg-blue-100 text-blue-600' },
  { name: 'Dr. Nishit Sawal', specialty: 'Neurologist', type: 'Super Specialist', days: 'Every 1st & 3rd Tuesday', timing: '11:00 AM – 2:00 PM', charges: '₹500', imageColor: 'bg-indigo-100 text-indigo-600' },
  { name: 'Dr. Yogesh Jindal', specialty: 'Neuro Surgeon', type: 'Super Specialist', days: 'Every 2nd & 4th Thursday', timing: '11:00 AM – 2:00 PM', charges: '₹400', imageColor: 'bg-slate-100 text-slate-600' },
  { name: 'Dr. Kalpesh', specialty: 'Nephrologist', type: 'Super Specialist', days: 'Every 1st Wednesday', timing: '10:00 AM – 2:00 PM', charges: '₹400', imageColor: 'bg-cyan-100 text-cyan-600' },
];

const DoctorsDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Regular OPD' | 'Super Specialist'>('All');

  const filteredDoctors = DOCTORS_DATA.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || doc.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in pb-10">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-indigo-600" />
            Doctors & Specialists
          </h2>
          <p className="text-slate-500">J.C. Juneja Hospital Directory & OPD Schedule</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="Search Doctor or Specialty..." 
             className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        {['All', 'Regular OPD', 'Super Specialist'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab 
              ? 'bg-white text-indigo-700 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
             <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${doc.imageColor}`}>
                    {doc.name.split(' ')[1]?.charAt(0) || doc.name.charAt(0)}
                  </div>
                  {doc.type === 'Super Specialist' && (
                    <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Super Speciality
                    </span>
                  )}
                  {doc.type === 'Regular OPD' && (
                     <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                       Regular OPD
                     </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-slate-800">{doc.name}</h3>
                <p className="text-indigo-600 font-medium text-sm mb-4">{doc.specialty}</p>
                
                <div className="space-y-2 text-sm text-slate-600">
                   <div className="flex items-start gap-2">
                     <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                     <span className="font-medium">{doc.days}</span>
                   </div>
                   {doc.timing && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{doc.timing}</span>
                    </div>
                   )}
                   {doc.charges && (
                    <div className="flex items-center gap-2">
                      <BadgeIndianRupee className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>OPD Charges: <span className="font-semibold text-slate-800">{doc.charges}</span></span>
                    </div>
                   )}
                </div>
             </div>
             
             <div className="bg-slate-50 border-t border-slate-100 p-3 text-center">
               <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide">
                 Book Appointment
               </button>
             </div>
          </div>
        ))}
      </div>
      
      {filteredDoctors.length === 0 && (
         <div className="text-center py-20 text-slate-400">
           <p>No doctors found matching your criteria.</p>
         </div>
      )}
    </div>
  );
};

export default DoctorsDirectory;
